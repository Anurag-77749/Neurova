/**
 * Secure SHA-256 Password Hashing via Native Web Crypto API
 * Passwords are never stored in plain text anywhere in storage.
 */
export async function hashPassword(plain: string): Promise<string> {
  const normalized = plain.trim();
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  const computed = await hashPassword(plain);
  return computed === hash;
}
