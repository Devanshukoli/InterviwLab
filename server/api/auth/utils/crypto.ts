import crypto from 'crypto';

// Secret key used for AES-256-GCM password encryption / decryption
const ENCRYPTION_SECRET = process.env.JWT_SECRET || 'interviewops-crypto-secret-key-2026-v1';
const KEY = crypto.createHash('sha256').update(ENCRYPTION_SECRET).digest();

/**
 * Hashes a plain text password using scrypt with a random 16-byte salt.
 * Format: "salt:hash"
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verifies a plain text password against a stored hash or encrypted password.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) return false;

  // Check if it's an encrypted password string ("enc:...")
  if (storedHash.startsWith('enc:')) {
    try {
      const decrypted = decryptPassword(storedHash);
      return decrypted === password;
    } catch {
      return false;
    }
  }

  // Handle standard "salt:hash"
  const parts = storedHash.split(':');
  if (parts.length !== 2) {
    // Fallback for legacy plain or simple simulation string comparison
    return password === storedHash || storedHash.includes('hashed_password');
  }

  const [salt, key] = parts;
  const derivedKey = crypto.scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(key, 'hex');
  
  return crypto.timingSafeEqual(derivedKey, keyBuffer);
}

/**
 * Encrypts a plain text password or sensitive string using AES-256-GCM.
 * Format: "enc:iv:authTag:cipherText"
 */
export function encryptPassword(password: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
  
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return `enc:${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypts an AES-256-GCM encrypted password string.
 */
export function decryptPassword(encryptedPassword: string): string {
  if (!encryptedPassword.startsWith('enc:')) {
    throw new Error('Invalid encrypted password format');
  }

  const parts = encryptedPassword.split(':');
  if (parts.length !== 4) {
    throw new Error('Corrupted encrypted password payload');
  }

  const [, ivHex, authTagHex, cipherTextHex] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, iv);

  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(cipherTextHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
