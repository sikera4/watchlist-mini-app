import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { after, before, beforeEach, test } from 'node:test';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { createWatchlist, readWatchlists } from '../src/api/firestore/watchlists.ts';

// Never allow these tests (which clear their database) to target a live project.
const projectId = 'demo-watchlist-rules';

if (process.env.FIRESTORE_EMULATOR_HOST !== '127.0.0.1:8080') {
  throw new Error('Run via pnpm test:rules with the configured localhost emulator.');
}

const alice = '1001';
const bob = '1002';
const item = { id: 42, title: 'Example', posterPath: '/example.jpg', isSeen: false };
let environment;
const asUser = (uid) => environment.authenticatedContext(uid).firestore();

before(async () => {
  environment = await initializeTestEnvironment({
    projectId,
    firestore: {
      host: '127.0.0.1',
      port: 8080,
      rules: await readFile(new URL('../firestore.rules', import.meta.url), 'utf8'),
    },
  });
});

after(async () => {
  await environment?.cleanup();
});

beforeEach(async () => {
  await environment.clearFirestore();
  await environment.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    const batch = writeBatch(db);
    batch.set(doc(db, 'users', alice), { userId: alice, watchlists: ['alice-list', 'shared'] });
    batch.set(doc(db, 'users', bob), { userId: bob, watchlists: ['bob-list', 'shared'] });

    for (const [id, userIds] of [
      ['alice-list', [alice]],
      ['bob-list', [bob]],
      ['shared', [alice, bob]],
    ])
      batch.set(doc(db, 'watchlists', id), { name: id, userIds, items: [] });
    await batch.commit();
  });
});

function createBatch(db, id, data = {}) {
  const batch = writeBatch(db);
  batch.set(doc(db, 'watchlists', id), { name: 'New list', userIds: [alice], items: [], ...data });
  batch.update(doc(db, 'users', alice), { watchlists: arrayUnion(id) });

  return batch;
}

test('unauthenticated clients cannot read, query, or write', async () => {
  const db = environment.unauthenticatedContext().firestore();
  await assertFails(getDoc(doc(db, 'users', alice)));
  await assertFails(getDoc(doc(db, 'watchlists', 'alice-list')));
  await assertFails(readWatchlists(db, alice));
  await assertFails(createWatchlist(db, alice));
  await assertFails(updateDoc(doc(db, 'watchlists', 'alice-list'), { items: [item] }));
});

test('users can read their profile but not other profiles or the user collection', async () => {
  const db = asUser(alice);
  await assertSucceeds(getDoc(doc(db, 'users', alice)));
  await assertFails(getDoc(doc(db, 'users', bob)));
  await assertFails(getDocs(collection(db, 'users')));
});

test('membership query returns only own and shared lists; new users get an empty result', async () => {
  const lists = await assertSucceeds(readWatchlists(asUser(alice), alice));
  assert.deepEqual(lists.map(({ id }) => id).sort(), ['alice-list', 'shared']);
  assert.deepEqual(await assertSucceeds(readWatchlists(asUser('1003'), '1003')), []);
  await assertFails(readWatchlists(asUser(alice), bob));
  await assertFails(getDocs(collection(asUser(alice), 'watchlists')));
});

test('members can read shared lists, but an ID or reference alone does not grant access', async () => {
  const db = asUser(alice);
  await assertSucceeds(getDoc(doc(db, 'watchlists', 'shared')));
  await assertFails(getDoc(doc(db, 'watchlists', 'bob-list')));
  await assertFails(
    getDocs(
      query(collection(db, 'watchlists'), where(documentId(), 'in', ['alice-list', 'bob-list']))
    )
  );
  await environment.withSecurityRulesDisabled(async (context) => {
    await updateDoc(doc(context.firestore(), 'users', alice), {
      watchlists: arrayUnion('bob-list'),
    });
  });
  await assertFails(getDoc(doc(db, 'watchlists', 'bob-list')));
});

test('membership query supports more than 30 lists and does not trust stale references', async () => {
  await environment.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    const batch = writeBatch(db);

    for (let i = 0; i < 35; i++) {
      batch.set(doc(db, 'watchlists', `extra-${i}`), {
        name: 'Extra',
        userIds: [alice],
        items: [],
      });
    }

    await batch.commit();
  });
  assert.equal((await readWatchlists(asUser(alice), alice)).length, 37);
});

test('actual app creation writes the list and user reference atomically', async () => {
  const db = asUser(alice);
  const id = await assertSucceeds(createWatchlist(db, alice, 'Weekend'));
  assert.deepEqual((await getDoc(doc(db, 'watchlists', id))).data(), {
    name: 'Weekend',
    userIds: [alice],
    items: [],
  });
  assert.ok((await getDoc(doc(db, 'users', alice))).data().watchlists.includes(id));
  await assertSucceeds(createWatchlist(db, alice));
});

test('standalone creation and standalone references are denied', async () => {
  const db = asUser(alice);
  await assertFails(
    setDoc(doc(db, 'watchlists', 'unlinked'), {
      name: 'Unlinked',
      userIds: [alice],
      items: [],
    })
  );

  for (const id of ['missing', 'bob-list', 'shared']) {
    // shared already exists in the profile: no-op updates are also denied.
    await assertFails(updateDoc(doc(db, 'users', alice), { watchlists: arrayUnion(id) }));
  }
});

test('invalid creation rejects the entire batch and preserves user references', async () => {
  const db = asUser(alice);
  const before = (await getDoc(doc(db, 'users', alice))).data();
  const invalid = [
    { name: '' },
    { name: 'x'.repeat(101) },
    { name: 42 },
    { userIds: [bob] },
    { userIds: [alice, bob] },
    { userIds: [1001] },
    { items: [item] },
    { items: {} },
    { owner: alice },
  ];

  for (let i = 0; i < invalid.length; i++) {
    await assertFails(createBatch(db, `invalid-${i}`, invalid[i]).commit());
  }

  assert.deepEqual((await getDoc(doc(db, 'users', alice))).data(), before);
  await environment.withSecurityRulesDisabled(async (context) => {
    assert.equal((await getDocs(collection(context.firestore(), 'watchlists'))).size, 3);
  });
});

test('creation requires an existing server-provisioned user and cannot impersonate another user', async () => {
  await assertFails(createWatchlist(asUser('1003'), '1003'));
  await assertFails(createWatchlist(asUser(alice), bob));
});

test('members can add, mark seen, and remove items in own or shared lists', async () => {
  for (const id of ['alice-list', 'shared']) {
    const ref = doc(asUser(alice), 'watchlists', id);
    await assertSucceeds(updateDoc(ref, { items: arrayUnion(item) }));
    const seen = { ...item, isSeen: true };
    await assertSucceeds(updateDoc(ref, { items: [seen] }));
    await assertSucceeds(updateDoc(ref, { items: arrayRemove(seen) }));
    assert.deepEqual((await getDoc(ref)).data().items, []);
  }

  await assertSucceeds(updateDoc(doc(asUser(bob), 'watchlists', 'shared'), { items: [item] }));
});

test('non-members cannot edit items or grant themselves membership', async () => {
  const ref = doc(asUser(alice), 'watchlists', 'bob-list');
  await assertFails(updateDoc(ref, { items: [item] }));
  await assertFails(updateDoc(ref, { userIds: arrayUnion(alice) }));
  await assertFails(updateDoc(ref, { userIds: [alice], items: [] }));
});

test('members cannot change membership, rename lists, add fields, or delete lists', async () => {
  const ref = doc(asUser(alice), 'watchlists', 'alice-list');

  for (const patch of [
    { userIds: [alice, bob] },
    { userIds: [] },
    { name: 'Renamed' },
    { admin: true },
    { items: {} },
  ])
    await assertFails(updateDoc(ref, patch));
  await assertFails(deleteDoc(ref));
});

test('user profiles cannot be created, deleted, or changed outside list creation', async () => {
  const db = asUser(alice);
  await assertFails(
    setDoc(doc(asUser('1003'), 'users', '1003'), { userId: '1003', watchlists: [] })
  );
  await assertFails(deleteDoc(doc(db, 'users', alice)));

  for (const patch of [
    { userId: bob },
    { admin: true },
    { watchlists: [] },
    { watchlists: ['alice-list', 'shared', 7] },
    { watchlists: 'bad' },
  ])
    await assertFails(updateDoc(doc(db, 'users', alice), patch));
  await assertFails(updateDoc(doc(db, 'users', bob), { watchlists: arrayUnion('alice-list') }));
  const batch = createBatch(db, 'new-list');
  batch.update(doc(db, 'users', alice), { admin: true });
  await assertFails(batch.commit());
});

test('unmatched collections and nested documents default to denied', async () => {
  const db = asUser(alice);

  for (const path of [
    'private/secret',
    'watchlistInvites/hashed-token',
    `users/${alice}/private/secret`,
    'watchlists/alice-list/items/42',
  ]) {
    await assertFails(getDoc(doc(db, path)));
    await assertFails(setDoc(doc(db, path), { value: true }));
  }
});
