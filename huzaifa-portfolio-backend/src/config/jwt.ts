import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from './env';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

const jwtSecret: Secret = env.JWT_SECRET;

export const generateAccessToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, jwtSecret, options);
};

export const generateRefreshToken = (): string => {
  return crypto.randomBytes(64).toString('hex');
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, jwtSecret) as JwtPayload;
};

export const getTokenExpirySeconds = (): number => {
  const match = env.JWT_EXPIRES_IN.match(/^(\d+)([smhd])$/);
  if (!match) return 900;

  const value = Number(match[1]);
  const unit = match[2];

  if (unit === 's') return value;
  if (unit === 'm') return value * 60;
  if (unit === 'h') return value * 3600;
  if (unit === 'd') return value * 86400;

  return 900;
};

export const getRefreshTokenExpiry = (): Date => {
  const match = env.JWT_REFRESH_EXPIRES_IN.match(/^(\d+)([smhd])$/);
  if (!match) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const value = Number(match[1]);
  const unit = match[2];

  let ms = 0;
  if (unit === 's') ms = value * 1000;
  if (unit === 'm') ms = value * 60 * 1000;
  if (unit === 'h') ms = value * 3600 * 1000;
  if (unit === 'd') ms = value * 86400 * 1000;

  return new Date(Date.now() + ms);
};