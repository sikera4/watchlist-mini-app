import { checkIfDocumentExists } from './checkIfDocumentExists';
import { db } from './initializeFirebase';

export const checkIfUserExists = async (userId: number): Promise<boolean> => {
  return checkIfDocumentExists(db, 'users', String(userId));
};
