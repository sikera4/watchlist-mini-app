import assert from 'node:assert/strict';
import { test } from 'node:test';
import { auditMemberships } from '../scripts/lib/audit-memberships.mjs';

test('accepts reciprocal memberships, shared lists, and users with no lists', () => {
  const users = new Map([
    ['123', { userId: '123', watchlists: ['shared'] }],
    ['456', { userId: '456', watchlists: ['shared'] }],
    ['789', { userId: '789', watchlists: [] }],
  ]);
  const lists = new Map([['shared', { userIds: ['123', '456'], items: [] }]]);
  assert.deepEqual(auditMemberships(users, lists), { users: 3, watchlists: 1, issues: [] });
});

test('reports both directions of broken relationships without modifying input', () => {
  const users = new Map([['123', { userId: '123', watchlists: ['missing', 'private'] }]]);
  const lists = new Map([
    ['private', { userIds: ['456'], items: [] }],
    ['orphan', { userIds: ['123'], items: [] }],
  ]);
  const before = structuredClone({ users, lists });
  const codes = auditMemberships(users, lists).issues.map(({ code }) => code);
  assert.deepEqual(
    codes.sort(),
    [
      'missing_watchlist',
      'reference_without_membership',
      'missing_user',
      'membership_without_reference',
    ].sort()
  );
  assert.deepEqual({ users, lists }, before);
});

test('reports legacy IDs, malformed arrays, and duplicates', () => {
  const users = new Map([
    ['123', { userId: 123, watchlists: ['list', 'list', 7] }],
    ['456', { userId: '456', watchlists: null }],
  ]);
  const lists = new Map([
    ['list', { userIds: [123, '123', '123'], usersIds: [123], items: null }],
    ['empty', { userIds: [], items: [] }],
  ]);
  const codes = new Set(auditMemberships(users, lists).issues.map(({ code }) => code));

  for (const code of [
    'numeric_user_id',
    'duplicate_watchlist_references',
    'invalid_watchlist_reference',
    'invalid_watchlist_references',
    'invalid_member_id',
    'duplicate_memberships',
    'legacy_membership_field',
    'invalid_items',
    'invalid_memberships',
  ])
    assert.ok(codes.has(code), code);
});

test('does not classify mismatched IDs as safe numeric conversions', () => {
  const users = new Map([
    ['123', { userId: 456, watchlists: [] }],
    ['456', { userId: '123', watchlists: [] }],
    ['789', { watchlists: [] }],
  ]);
  const result = auditMemberships(users, new Map());
  assert.equal(result.issues.length, 3);
  assert.ok(result.issues.every(({ code }) => code === 'invalid_user_id'));
});
