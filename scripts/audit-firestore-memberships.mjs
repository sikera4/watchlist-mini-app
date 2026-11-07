import { existsSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { applicationDefault, cert, deleteApp, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { auditMemberships } from './lib/audit-memberships.mjs';

// Keep shell variables authoritative; .env.local takes precedence over .env.
for (const path of ['.env.local', '.env']) {
  if (existsSync(path)) process.loadEnvFile(path);
}

const { values } = parseArgs({
  options: { 'project-id': { type: 'string' }, details: { type: 'boolean', default: false } },
});
const projectId = process.env.FIREBASE_PROJECT_ID;

if (!projectId || values['project-id'] !== projectId) {
  throw new Error('Pass --project-id matching FIREBASE_PROJECT_ID to select the audit target.');
}

if (process.env.FIRESTORE_EMULATOR_HOST) {
  throw new Error('Unset FIRESTORE_EMULATOR_HOST before auditing the live project.');
}

const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (Boolean(clientEmail) !== Boolean(privateKey)) {
  throw new Error('Provide both FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY, or use ADC.');
}

const app = initializeApp({
  projectId,
  credential:
    clientEmail && privateKey ? cert({ projectId, clientEmail, privateKey }) : applicationDefault(),
});

try {
  const db = getFirestore(app);
  // A read-only transaction gives both collections a consistent snapshot.
  const [users, watchlists] = await db.runTransaction(
    async (transaction) => {
      const users = await transaction.get(db.collection('users'));
      const watchlists = await transaction.get(db.collection('watchlists'));

      return [users, watchlists];
    },
    { readOnly: true }
  );
  const asMap = (snapshot) => new Map(snapshot.docs.map((doc) => [doc.id, doc.data()]));
  const result = auditMemberships(asMap(users), asMap(watchlists));
  const counts = {};

  for (const issue of result.issues) counts[issue.code] = (counts[issue.code] ?? 0) + 1;
  console.log(
    JSON.stringify(
      {
        projectId,
        readOnly: true,
        users: result.users,
        watchlists: result.watchlists,
        issueCount: result.issues.length,
        counts,
        ...(values.details ? { issues: result.issues } : {}),
      },
      null,
      2
    )
  );
  process.exitCode = result.issues.length ? 1 : 0;
} catch (error) {
  // Do not dump credential-bearing SDK objects into logs.
  console.error('Audit failed; check credentials, project access, and connectivity.', {
    code: typeof error.code === 'number' ? error.code : 'audit_failed',
  });
  process.exitCode = 2;
} finally {
  await deleteApp(app);
}
