import * as bcrypt from 'bcrypt';
import * as randomatic from 'randomatic';

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return await bcrypt.compare(password, passwordHash);
}

export function generatePassword(length = 10) {
  return randomatic('*', length);
}