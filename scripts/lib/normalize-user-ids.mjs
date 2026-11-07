import { isDeepStrictEqual } from 'node:util';

export function planUserIdNormalization(users) {
  const changes = [];

  for (const [documentId, { data, version }] of users) {
    if (
      typeof data.userId === 'string' &&
      data.userId === documentId &&
      /^[1-9]\d*$/.test(documentId)
    ) {
      continue;
    }

    if (
      typeof data.userId !== 'number' ||
      !Number.isSafeInteger(data.userId) ||
      data.userId <= 0 ||
      String(data.userId) !== documentId
    ) {
      throw new Error('A user ID does not match its document. Audit before migrating.');
    }

    changes.push({ documentId, version, before: data.userId, after: documentId });
  }

  return changes;
}

export function verifyUserIdPlan(plan, projectId, users) {
  if (
    plan.version !== 1 ||
    plan.operation !== 'normalize-user-ids' ||
    plan.projectId !== projectId
  ) {
    throw new Error('Invalid normalization plan or project mismatch.');
  }

  const changes = planUserIdNormalization(users);

  if (!isDeepStrictEqual(plan.changes, changes)) {
    throw new Error('User data changed after the dry run. Generate and review a new backup.');
  }

  return changes;
}
