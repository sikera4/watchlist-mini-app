import { UseQueryOptionsWithoutQueryKeyAndFn } from '@/types';
import { db } from '@/utilities/initializeFirebase';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { User } from '../types';

const getUserData = async (userId: number | null): Promise<User | null> => {
  if (!userId) {
    return null;
  }

  const userDocRef = doc(db, 'users', String(userId));
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const userData = userDoc.data() as User;

    return userData;
  }

  return null;
};

export const useUserDataQuery = (
  userId: number | null,
  options?: UseQueryOptionsWithoutQueryKeyAndFn<User | null, unknown, User | null, [string, number | null]>
) => {
  return useQuery({
    ...options,
    queryKey: ['user', userId],
    queryFn: () => getUserData(userId),
  });
};
