import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const SECRET_KEY = process.env.ENCRYPTION_KEY || 'your-secret-key';
const ALGORITHM = 'aes-256-cbc';

const key = Buffer.from(SECRET_KEY.padEnd(32, ' ').substring(0, 32));

const iv = randomBytes(16);

const encryptData = (text: string): string => {
  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
};

const decryptData = (cipherText: string): string => {
  const [ivHex, encryptedText] = cipherText.split(':');
  const ivBuffer = Buffer.from(ivHex, 'hex');
  const decipher = createDecipheriv(ALGORITHM, key, ivBuffer);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

export { encryptData, decryptData };
