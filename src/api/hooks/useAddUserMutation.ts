import { db } from '@/utilities/initializeFirebase';
import { useMutation } from '@tanstack/react-query';
import { collection, doc, setDoc } from 'firebase/firestore';

type Params = {
  userId: string;
};

const addUser = async ({ userId }: Params) => {
  const usersCollectionRef = collection(db, 'users');
  const userDocRef = doc(usersCollectionRef, String(userId));

  await setDoc(userDocRef, { userId, watchlists: [] });
};

export const useAddUserMutation = () => {
  return useMutation({
    mutationFn: addUser,
  });
};
