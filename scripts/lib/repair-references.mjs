import { isDeepStrictEqual } from 'node:util';

// Only remove references. Never change IDs, list contents, or access membership.
// Maps contain { data, version } records; version is a Firestore update timestamp.
export function planReferenceRepairs(users, watchlists) {
  const repairs = [];

  for (const [userId, user] of users) {
    if (!Array.isArray(user.data.watchlists)) continue;
    const removals = [];

    for (const listId of user.data.watchlists) {
      if (typeof listId !== 'string' || !listId || listId.includes('/')) continue;
      const list = watchlists.get(listId);

      if (!list) {
        removals.push({ listId, reason: 'missing_watchlist', listVersion: null });
      } else if (
        Array.isArray(list.data.userIds) &&
        list.data.userIds.length > 0 &&
        list.data.userIds.every((id) => typeof id === 'string' && /^[1-9]\d*$/.test(id)) &&
        !list.data.userIds.includes(userId)
      ) {
        removals.push({
          listId,
          reason: 'reference_without_membership',
          listVersion: list.version,
        });
      }
    }

    if (removals.length) {
      const removedIds = new Set(removals.map(({ listId }) => listId));
      repairs.push({
        userId,
        userVersion: user.version,
        before: user.data.watchlists,
        after: user.data.watchlists.filter((id) => !removedIds.has(id)),
        removals,
      });
    }
  }

  return repairs;
}

export function verifyReferencePlan(plan, projectId, users, watchlists) {
  if (plan.version !== 1 || plan.projectId !== projectId || !Array.isArray(plan.repairs)) {
    throw new Error('Invalid plan or project mismatch.');
  }

  const current = planReferenceRepairs(users, watchlists);

  if (!isDeepStrictEqual(plan.repairs, current)) {
    throw new Error('Data or plan changed since the dry run. Generate and review a new plan.');
  }

  return current;
}

export function summarizeReferenceRepairs(repairs) {
  const counts = { users: repairs.length, missingReferences: 0, nonMemberReferences: 0 };

  for (const { removals } of repairs) {
    for (const { reason } of removals) {
      if (reason === 'missing_watchlist') counts.missingReferences++;

      if (reason === 'reference_without_membership') counts.nonMemberReferences++;
    }
  }

  return counts;
}
