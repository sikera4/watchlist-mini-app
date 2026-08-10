import { checkIfDocumentExists } from './checkIfDocumentExists';
import { db } from './initializeFirebase';

export const checkIfUserExists = async (userId: string): Promise<boolean> => {
  return checkIfDocumentExists(db, 'users', userId);
};
