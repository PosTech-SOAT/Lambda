import { randomBytes } from 'crypto';

export const generateSecretKey = () => {
  return randomBytes(32).toString('hex');
};
