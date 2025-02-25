import { encryptData, decryptData } from './encryption';

describe('encryptionUtils', () => {
  const sampleText = 'Hello, World!';
  const encryptedText = encryptData(sampleText);

  it('should encrypt data correctly', () => {
    expect(encryptedText).not.toBe(sampleText);
    expect(encryptedText).toMatch(/^[a-f0-9]{32}:[a-f0-9]+$/);
  });

  it('should decrypt the encrypted data correctly', () => {
    const decryptedText = decryptData(encryptedText);

    expect(decryptedText).toBe(sampleText);
  });

  it('should throw an error when the ciphertext is incorrect', () => {
    const invalidCipherText = 'invalid:content';

    expect(() => decryptData(invalidCipherText)).toThrow();
  });
});
