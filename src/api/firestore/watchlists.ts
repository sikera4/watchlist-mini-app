import { arrayUnion, collection, doc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { List } from '../types';

export async function readWatchlists(db: Firestore, userId: string): Promise<List[]> {
  const snapshot = await getDocs(
    query(collection(db, 'watchlists'), where('userIds', 'array-contains', userId))
  );

  return snapshot.docs.map((document) => ({ ...document.data(), id: document.id }) as List);
}

export async function createWatchlist(db: Firestore, userId: string, name = 'New Watchlist') {
  const list = doc(collection(db, 'watchlists'));
  const batch = writeBatch(db);

  batch.set(list, { name, userIds: [userId], items: [] });
  batch.update(doc(db, 'users', userId), { watchlists: arrayUnion(list.id) });

  await batch.commit();

  return list.id;
}
