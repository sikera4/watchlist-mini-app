import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { applicationDefault, cert, deleteApp, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { planUserIdNormalization, verifyUserIdPlan } from './lib/normalize-user-ids.mjs';

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
  throw new Error('Require matching --project-id and --plan=.firestore-backups/<filename>.json.');
}

if (process.env.FIRESTORE_EMULATOR_HOST) {
  throw new Error('Unset FIRESTORE_EMULATOR_HOST before selecting the live project.');
}

const planPath = resolve(values.plan);
const backupRoot = resolve('.firestore-backups');
const backupRelativePath = relative(backupRoot, planPath);

if (!backupRelativePath || backupRelativePath.startsWith('..')) {
  throw new Error('Keep the private backup under .firestore-backups.');
}

const plan = values.apply ? JSON.parse(readFileSync(planPath, 'utf8')) : null;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (Boolean(clientEmail) !== Boolean(privateKey)) {
  throw new Error('Incomplete Admin credentials.');
}

const app = initializeApp({
  projectId,
  credential:
    clientEmail && privateKey ? cert({ projectId, clientEmail, privateKey }) : applicationDefault(),
});

try {
  const db = getFirestore(app);

  const changes = await db.runTransaction(
    async (transaction) => {
      const snapshot = await transaction.get(db.collection('users'));
      const users = new Map(
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
      const plannedChanges = values.apply
        ? verifyUserIdPlan(plan, projectId, users)
        : planUserIdNormalization(users);

      if (plannedChanges.length > 500) {
        throw new Error(
          'This atomic migration is limited to 500 users. Review a batched migration.'
        );
      }

      if (values.apply) {
        for (const change of plannedChanges) {
          // The only modified field. Document IDs, references, and list data stay intact.
          transaction.update(db.collection('users').doc(change.documentId), {
            userId: change.after,
          });
        }
      }

      return plannedChanges;
    },
    values.apply ? { maxAttempts: 3 } : { readOnly: true }
  );

  if (!values.apply) {
    mkdirSync(dirname(planPath), { recursive: true, mode: 0o700 });
    writeFileSync(
      planPath,
      JSON.stringify(
        {
          version: 1,
          operation: 'normalize-user-ids',
          projectId,
          createdAt: new Date().toISOString(),
          changes,
        },
        null,
        2
      ) + '\n',
      { flag: 'wx', mode: 0o600 }
    );
  }

  console.log(
    JSON.stringify(
      { projectId, applied: values.apply, users: changes.length, backup: planPath },
      null,
      2
    )
  );
} finally {
  await deleteApp(app);
}
