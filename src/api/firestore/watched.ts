import { doc, runTransaction } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { MediaItem } from '../types';

export type WatchedParams = {
  watchlistId: string;
  mediaId: number;
  isSeen: boolean;
};

export async function setWatched(db: Firestore, { watchlistId, mediaId, isSeen }: WatchedParams) {
  const watchlistDocRef = doc(db, 'watchlists', watchlistId);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(watchlistDocRef);

    if (!snapshot.exists()) {
      throw new Error('Watchlist no longer exists');
    }

    const items: MediaItem[] = snapshot.data().items;

    if (!Array.isArray(items) || !items.some((item) => item.id === mediaId)) {
      throw new Error('Item no longer exists in this watchlist');
    }

    // Set the requested state rather than toggling: transaction retries are idempotent.
    transaction.update(watchlistDocRef, {
      items: items.map((item) => (item.id === mediaId ? { ...item, isSeen } : item)),
    });
  });
}
