import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { parseArgs } from 'node:util';
import { applicationDefault, cert, deleteApp, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import {
  planReferenceRepairs,
  verifyReferencePlan,
  summarizeReferenceRepairs,
} from './lib/repair-references.mjs';

for (const path of ['.env.local', '.env']) {
  if (existsSync(path)) process.loadEnvFile(path);
}

const { values } = parseArgs({
  options: {
    'project-id': { type: 'string' },
    plan: { type: 'string' },
    apply: { type: 'boolean', default: false },
  },
});
const projectId = process.env.FIREBASE_PROJECT_ID;

if (!projectId || values['project-id'] !== projectId || !values.plan) {
  throw new Error('Require --project-id matching FIREBASE_PROJECT_ID and --plan=<backup path>.');
}

if (process.env.FIRESTORE_EMULATOR_HOST) throw new Error('Unexpected emulator configuration.');
const planPath = resolve(values.plan);
const backupRoot = resolve('.firestore-backups');
const relativePath = relative(backupRoot, planPath);

if (
  !relativePath ||
  relativePath.startsWith('..') ||
  resolve(backupRoot, relativePath) !== planPath
) {
  throw new Error('Keep private repair plans under the ignored .firestore-backups directory.');
}

const savedPlan = values.apply ? JSON.parse(readFileSync(planPath, 'utf8')) : null;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (Boolean(clientEmail) !== Boolean(privateKey)) throw new Error('Incomplete Admin credentials.');
const app = initializeApp({
  projectId,
  credential:
    clientEmail && privateKey ? cert({ projectId, clientEmail, privateKey }) : applicationDefault(),
});

try {
  const db = getFirestore(app);
  const asMap = (snapshot) =>
    new Map(
      snapshot.docs.map((document) => [
        document.id,
        {
          data: document.data(),
          version: {
            seconds: document.updateTime.seconds,
            nanoseconds: document.updateTime.nanoseconds,
          },
        },
      ])
    );
  const result = await db.runTransaction(
    async (transaction) => {
      const users = asMap(await transaction.get(db.collection('users')));
      const watchlists = asMap(await transaction.get(db.collection('watchlists')));
      const repairs = values.apply
        ? verifyReferencePlan(savedPlan, projectId, users, watchlists)
        : planReferenceRepairs(users, watchlists);

      if (values.apply) {
        for (const repair of repairs) {
          transaction.update(db.collection('users').doc(repair.userId), {
            watchlists: repair.after,
          });
        }
      }

      return repairs;
    },
    values.apply ? { maxAttempts: 3 } : { readOnly: true }
  );

  if (!values.apply) {
    mkdirSync(dirname(planPath), { recursive: true, mode: 0o700 });
    // Exclusive creation prevents overwriting an earlier backup. before[] is
    // the exact pre-change value of the only field this script can modify.
    writeFileSync(
      planPath,
      JSON.stringify(
        {
          version: 1,
          projectId,
          createdAt: new Date().toISOString(),
          repairs: result,
        },
        null,
        2
      ) + '\n',
      { flag: 'wx', mode: 0o600 }
    );
  }

  console.log(
    JSON.stringify(
      {
        projectId,
        applied: values.apply,
        backup: planPath,
        ...summarizeReferenceRepairs(result),
      },
      null,
      2
    )
  );
} finally {
  await deleteApp(app);
}
