const crypto = require('crypto');
const env = require('../config/env');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const CIPHER_PREFIX = 'enc:v1:';
const HEX_64_REGEX = /^[0-9a-fA-F]{64}$/;

function resolveKeyBuffer(keyHex = env.encryptionKey) {
  const key = typeof keyHex === 'string' ? keyHex.trim() : '';
  if (!HEX_64_REGEX.test(key)) {
    throw new Error(
      'ENCRYPTION_KEY invalide : doit être une chaîne hexadécimale de 64 caractères (32 octets AES-256)'
    );
  }
  return Buffer.from(key, 'hex');
}

function isEncrypted(value) {
  return typeof value === 'string' && value.startsWith(CIPHER_PREFIX);
}

function encrypt(plainText, keyHex = env.encryptionKey) {
  if (plainText === null || plainText === undefined || plainText === '') {
    return plainText;
  }

  const text = String(plainText);
  if (isEncrypted(text)) {
    return text;
  }

  const key = resolveKeyBuffer(keyHex);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });

  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return `${CIPHER_PREFIX}${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

function decrypt(cipherText, keyHex = env.encryptionKey) {
  if (cipherText === null || cipherText === undefined || cipherText === '') {
    return cipherText;
  }

  const text = String(cipherText);
  if (!isEncrypted(text)) {
    return text;
  }

  const payload = text.slice(CIPHER_PREFIX.length);
  const parts = payload.split(':');
  if (parts.length !== 3) {
    throw new Error('Format de donnée chiffrée AES-256-GCM invalide');
  }

  const [ivHex, authTagHex, encryptedHex] = parts;
  const key = resolveKeyBuffer(keyHex);
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}

function hashValue(value, keyHex = env.encryptionKey) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const normalized = String(value).trim().toUpperCase();
  if (!normalized) {
    return null;
  }
  const key = resolveKeyBuffer(keyHex);
  return crypto.createHmac('sha256', key).update(normalized).digest('hex');
}

function encryptStringArray(values, keyHex = env.encryptionKey) {
  if (!Array.isArray(values)) {
    return [];
  }
  return values.map((v) => encrypt(v, keyHex));
}

function decryptStringArray(values, keyHex = env.encryptionKey) {
  if (!Array.isArray(values)) {
    return [];
  }
  return values.map((v) => decrypt(v, keyHex));
}

module.exports = {
  ALGORITHM,
  CIPHER_PREFIX,
  resolveKeyBuffer,
  isEncrypted,
  encrypt,
  decrypt,
  hashValue,
  encryptStringArray,
  decryptStringArray
};
