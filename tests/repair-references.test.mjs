import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  planReferenceRepairs,
  summarizeReferenceRepairs,
  verifyReferencePlan,
} from '../scripts/lib/repair-references.mjs';

const record = (data) => ({ data, version: { seconds: 1, nanoseconds: 0 } });
function fixture() {
  return {
    users: new Map([
      ['123', record({ userId: 123, watchlists: ['missing', 'foreign', 'own', 'shared'] })],
      ['456', record({ userId: '456', watchlists: ['foreign', 'shared'] })],
    ]),
    lists: new Map([
      ['foreign', record({ userIds: ['456'], items: [{ id: 42 }] })],
      ['own', record({ userIds: ['123'], items: [] })],
      ['shared', record({ userIds: ['123', '456'], items: [] })],
    ]),
  };
}

test('removes only missing and nonmember references, preserves IDs and list data', () => {
  const { users, lists } = fixture();
  const original = structuredClone({ users, lists });
  const repairs = planReferenceRepairs(users, lists);
  assert.deepEqual(summarizeReferenceRepairs(repairs), {
    users: 1,
    missingReferences: 1,
    nonMemberReferences: 1,
  });
  assert.deepEqual(repairs[0].before, ['missing', 'foreign', 'own', 'shared']);
  assert.deepEqual(repairs[0].after, ['own', 'shared']);
  assert.deepEqual({ users, lists }, original);
});

test('accepts an unchanged plan but rejects a changed project or edited plan', () => {
  const { users, lists } = fixture();
  const plan = {
    version: 1,
    projectId: 'demo-repair',
    repairs: planReferenceRepairs(users, lists),
  };
  assert.deepEqual(verifyReferencePlan(plan, 'demo-repair', users, lists), plan.repairs);
  assert.throws(() => verifyReferencePlan(plan, 'other', users, lists));
  plan.repairs[0].after.push('foreign');
  assert.throws(() => verifyReferencePlan(plan, 'demo-repair', users, lists));
});

test('rejects stale plans after user edits, list edits, membership grants, or list restoration', () => {
  const mutations = [
    ({ users }) => {
      users.get('123').version.seconds++;
    },
    ({ lists }) => {
      lists.get('foreign').version.seconds++;
    },
    ({ lists }) => {
      lists.get('foreign').data.userIds.push('123');
    },
    ({ lists }) => {
      lists.set('missing', record({ userIds: ['123'] }));
    },
  ];

  for (const mutate of mutations) {
    const data = fixture();
    const plan = {
      version: 1,
      projectId: 'demo-repair',
      repairs: structuredClone(planReferenceRepairs(data.users, data.lists)),
    };
    mutate(data);
    assert.throws(() => verifyReferencePlan(plan, 'demo-repair', data.users, data.lists));
  }
});

test('does not guess access from malformed or numeric memberships', () => {
  const users = new Map([['123', record({ watchlists: ['numeric', 'empty', 'bad'] })]]);
  const lists = new Map([
    ['numeric', record({ userIds: [123] })],
    ['empty', record({ userIds: [] })],
    ['bad', record({ userIds: null })],
  ]);
  assert.deepEqual(planReferenceRepairs(users, lists), []);
});

test('a completed repair produces no further changes', () => {
  const { users, lists } = fixture();

  for (const repair of planReferenceRepairs(users, lists))
    users.get(repair.userId).data.watchlists = repair.after;
  assert.deepEqual(planReferenceRepairs(users, lists), []);
});
