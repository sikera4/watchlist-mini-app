// Pure validation: never changes documents or infers new access grants.
export function auditMemberships(users, watchlists) {
  const issues = [];
  const report = (code, document, relatedDocument) =>
    issues.push({ code, document, ...(relatedDocument ? { relatedDocument } : {}) });
  const validId = (id) => typeof id === 'string' && id.length > 0 && !id.includes('/');
  const validUserId = (id) => typeof id === 'string' && /^[1-9]\d*$/.test(id);

  for (const [id, user] of users) {
    const path = `users/${id}`;

    if (
      typeof user.userId === 'number' &&
      Number.isSafeInteger(user.userId) &&
      user.userId > 0 &&
      String(user.userId) === id
    ) {
      report('numeric_user_id', path);
    } else if (!validUserId(id) || user.userId !== id) {
      report('invalid_user_id', path);
    }

    if (!Array.isArray(user.watchlists)) {
      report('invalid_watchlist_references', path);
      continue;
    }

    if (new Set(user.watchlists).size !== user.watchlists.length) {
      report('duplicate_watchlist_references', path);
    }

    for (const listId of user.watchlists) {
      if (!validId(listId)) {
        report('invalid_watchlist_reference', path);
        continue;
      }

      const list = watchlists.get(listId);

      if (!list) report('missing_watchlist', path, `watchlists/${listId}`);
      else if (!Array.isArray(list.userIds) || !list.userIds.includes(id)) {
        report('reference_without_membership', path, `watchlists/${listId}`);
      }
    }
  }

  for (const [id, list] of watchlists) {
    const path = `watchlists/${id}`;

    if (Object.hasOwn(list, 'usersIds')) report('legacy_membership_field', path);

    if (!Array.isArray(list.items)) report('invalid_items', path);

    if (!Array.isArray(list.userIds) || list.userIds.length === 0) {
      report('invalid_memberships', path);
      continue;
    }

    if (new Set(list.userIds).size !== list.userIds.length) {
      report('duplicate_memberships', path);
    }

    for (const userId of list.userIds) {
      if (!validUserId(userId)) {
        report('invalid_member_id', path);
        continue;
      }

      const user = users.get(userId);

      if (!user) report('missing_user', path, `users/${userId}`);
      else if (!Array.isArray(user.watchlists) || !user.watchlists.includes(id)) {
        report('membership_without_reference', path, `users/${userId}`);
      }
    }
  }

  return { users: users.size, watchlists: watchlists.size, issues };
}
