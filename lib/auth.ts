import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';
import type { Role, User } from '@prisma/client';
const COOKIE_NAME = 'aurabook_session';
function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error('AUTH_SECRET must be set to a random string of at least 32 characters');
  return new TextEncoder().encode(value);
}
export async function createSession(user: Pick<User, 'id'|'email'|'role'|'name'>) {
  const token = await new SignJWT({ sub: user.id, email: user.email, role: user.role, name: user.name }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(secret());
  (await cookies()).set(COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
}
export async function getSession() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  try { const { payload } = await jwtVerify(token, secret()); if (!payload.sub) return null; return { id: String(payload.sub), email: String(payload.email), role: payload.role as Role, name: String(payload.name ?? '') }; } catch { return null; }
}
export async function requireRole(roles: Role[]) {
  const session = await getSession();
  if (!session || !roles.includes(session.role)) return null;
  return session;
}
export async function requireSalonMember(salonId: string) {
  const session = await getSession();
  if (!session) return null;
  if (session.role === 'ADMIN') return session;
  if (session.role !== 'OWNER') return null;
  const membership = await prisma.salonMember.findFirst({ where: { userId: session.id, salonId } });
  return membership ? session : null;
}
