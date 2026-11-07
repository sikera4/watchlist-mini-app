import assert from 'node:assert/strict';
import { test } from 'node:test';
import { planUserIdNormalization, verifyUserIdPlan } from '../scripts/lib/normalize-user-ids.mjs';

const record = (userId) => ({
  data: { userId, watchlists: ['unchanged'] },
  version: { seconds: 1, nanoseconds: 0 },
});

test('normalizes only numeric IDs matching their document IDs without modifying input', () => {
  const users = new Map([
    ['123', record(123)],
    ['456', record('456')],
  ]);
  const original = structuredClone(users);

  assert.deepEqual(planUserIdNormalization(users), [
    {
      documentId: '123',
      version: { seconds: 1, nanoseconds: 0 },
      before: 123,
      after: '123',
    },
  ]);
  assert.deepEqual(users, original);
});

test('refuses mismatched, malformed, and unsafe IDs instead of guessing identities', () => {
  for (const value of [456, '456', null, undefined, 1.5, -123, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => planUserIdNormalization(new Map([['123', record(value)]])));
  }
});

test('verifies target, operation, backup contents, and document versions', () => {
  const users = new Map([['123', record(123)]]);
  const plan = {
    version: 1,
    operation: 'normalize-user-ids',
    projectId: 'demo-normalize',
    changes: structuredClone(planUserIdNormalization(users)),
  };

  assert.deepEqual(verifyUserIdPlan(plan, 'demo-normalize', users), plan.changes);
  assert.throws(() => verifyUserIdPlan(plan, 'other', users));
  assert.throws(() => verifyUserIdPlan({ ...plan, operation: 'other' }, 'demo-normalize', users));
  assert.throws(() => verifyUserIdPlan({ ...plan, changes: [] }, 'demo-normalize', users));

  users.get('123').version.seconds++;

  assert.throws(() => verifyUserIdPlan(plan, 'demo-normalize', users));
});

test('a completed migration is a no-op and stale plans are not reapplied', () => {
  const users = new Map([['123', record(123)]]);
  const plan = {
    version: 1,
    operation: 'normalize-user-ids',
    projectId: 'demo-normalize',
    changes: planUserIdNormalization(users),
  };

  users.get('123').data.userId = '123';

  assert.deepEqual(planUserIdNormalization(users), []);
  assert.throws(() => verifyUserIdPlan(plan, 'demo-normalize', users));
});
