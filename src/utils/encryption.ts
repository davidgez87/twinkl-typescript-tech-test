// eslint-disable-next-line import/no-extraneous-dependencies
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.ENCRYPTION_KEY || 'your-secret-key';

const encryptData = (text: string): string => CryptoJS.AES.encrypt(text, SECRET_KEY).toString();

const decryptData = (cipherText: string): string => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export { encryptData, decryptData };
