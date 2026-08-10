import {
  TelegramInitDataError,
  verifyTelegramInitData,
} from '@/server/auth/verifyTelegramInitData';
import { getFirebaseAdminAuth, getFirebaseAdminFirestore } from '@/server/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { NextResponse } from 'next/server';

type AuthenticationRequest = {
  initData?: unknown;
};

const ensureUserDocumentExists = async (userId: string) => {
  const firestore = getFirebaseAdminFirestore();
  const userReference = firestore.collection('users').doc(userId);

  await firestore.runTransaction(async (transaction) => {
    const userDocument = await transaction.get(userReference);

    if (!userDocument.exists) {
      transaction.create(userReference, {
        userId,
        watchlists: [],
        createdAt: FieldValue.serverTimestamp(),
      });
    }
  });
};

export const POST = async (request: Request) => {
  try {
    const body = (await request.json()) as AuthenticationRequest;

    if (typeof body.initData !== 'string') {
      return NextResponse.json({ error: 'Telegram init data is required' }, { status: 400 });
    }

    const telegramUser = verifyTelegramInitData(body.initData, {
      botToken: process.env.TELEGRAM_BOT_TOKEN ?? '',
    });
    const userId = String(telegramUser.id);

    await ensureUserDocumentExists(userId);

    const firebaseToken = await getFirebaseAdminAuth().createCustomToken(userId, {
      identityProvider: 'telegram',
    });

    return NextResponse.json({
      firebaseToken,
      user: {
        id: userId,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        username: telegramUser.username,
      },
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Request body must be valid JSON' }, { status: 400 });
    }

    if (error instanceof TelegramInitDataError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error('Telegram authentication failed', error);

    return NextResponse.json(
      { error: 'Authentication is temporarily unavailable' },
      { status: 500 }
    );
  }
};
