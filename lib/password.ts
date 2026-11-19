import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

/**
 * Hashes a plaintext password using Node.js crypto.scrypt.
 * Output format: salt:derivedKeyHex (both hex encoded).
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Verifies a plaintext password against a stored salt:derivedKeyHex string.
 * Uses timingSafeEqual to prevent timing attacks.
 */
export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, key] = stored.split(":");
    if (!salt || !key) return false;
    const derivedKey = scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(key, "hex");
    return timingSafeEqual(derivedKey, keyBuffer);
  } catch {
    return false;
  }
}
