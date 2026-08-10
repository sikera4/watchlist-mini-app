import 'server-only';

import { createHmac, timingSafeEqual } from 'node:crypto';

const DEFAULT_MAX_AGE_SECONDS = 15 * 60;
const ALLOWED_CLOCK_SKEW_SECONDS = 30;

export type VerifiedTelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
};

type VerifyTelegramInitDataOptions = {
  botToken: string;
  maxAgeSeconds?: number;
  now?: Date;
};

export class TelegramInitDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TelegramInitDataError';
  }
}

const getDataCheckString = (params: URLSearchParams) =>
  [...params.entries()]
    .filter(([key]) => key !== 'hash')
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

const verifyHash = (params: URLSearchParams, botToken: string) => {
  const receivedHash = params.get('hash');

  if (!receivedHash || !/^[a-f\d]{64}$/i.test(receivedHash)) {
    throw new TelegramInitDataError('Telegram init data has an invalid hash');
  }

  const secretKey = createHmac('sha256', 'WebAppData').update(botToken).digest();
  const expectedHash = createHmac('sha256', secretKey).update(getDataCheckString(params)).digest();
  const receivedHashBuffer = Buffer.from(receivedHash, 'hex');

  if (
    receivedHashBuffer.length !== expectedHash.length ||
    !timingSafeEqual(receivedHashBuffer, expectedHash)
  ) {
    throw new TelegramInitDataError('Telegram init data signature is invalid');
  }
};

const verifyAuthDate = (params: URLSearchParams, now: Date, maxAgeSeconds: number) => {
  const authDate = Number(params.get('auth_date'));
  const nowSeconds = Math.floor(now.getTime() / 1000);

  if (!Number.isSafeInteger(authDate) || authDate <= 0) {
    throw new TelegramInitDataError('Telegram init data has an invalid auth date');
  }

  if (authDate > nowSeconds + ALLOWED_CLOCK_SKEW_SECONDS) {
    throw new TelegramInitDataError('Telegram init data auth date is in the future');
  }

  if (nowSeconds - authDate > maxAgeSeconds) {
    throw new TelegramInitDataError('Telegram init data has expired');
  }
};

const parseUser = (params: URLSearchParams): VerifiedTelegramUser => {
  const serializedUser = params.get('user');

  if (!serializedUser) {
    throw new TelegramInitDataError('Telegram init data does not contain a user');
  }

  try {
    const user = JSON.parse(serializedUser) as Partial<VerifiedTelegramUser>;

    if (!Number.isSafeInteger(user.id) || !user.id || typeof user.first_name !== 'string') {
      throw new TelegramInitDataError('Telegram init data contains an invalid user');
    }

    return user as VerifiedTelegramUser;
  } catch (error) {
    if (error instanceof TelegramInitDataError) {
      throw error;
    }

    throw new TelegramInitDataError('Telegram init data contains malformed user data');
  }
};

export const verifyTelegramInitData = (
  initData: string,
  {
    botToken,
    maxAgeSeconds = DEFAULT_MAX_AGE_SECONDS,
    now = new Date(),
  }: VerifyTelegramInitDataOptions
) => {
  if (!initData) {
    throw new TelegramInitDataError('Telegram init data is missing');
  }

  if (!botToken) {
    throw new Error('TELEGRAM_BOT_TOKEN is not configured');
  }

  const params = new URLSearchParams(initData);

  verifyHash(params, botToken);
  verifyAuthDate(params, now, maxAgeSeconds);

  return parseUser(params);
};
