import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';
const schema = z.object({ name: z.string().trim().min(2).max(80), email: z.email().transform(v => v.toLowerCase()), password: z.string().min(10).max(128), phone: z.string().max(30).optional(), role: z.enum(['CUSTOMER','OWNER']).default('CUSTOMER') });
export async function POST(req: NextRequest) {
  try {
    const input = schema.parse(await req.json());
    const exists = await prisma.user.findUnique({ where: { email: input.email } });
    if (exists) return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    const user = await prisma.user.create({ data: { name: input.name, email: input.email, phone: input.phone, passwordHash: await bcrypt.hash(input.password, 12), role: input.role } });
    await createSession(user);
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } }, { status: 201 });
  } catch (e) { return NextResponse.json({ error: e instanceof z.ZodError ? e.issues[0]?.message : 'Unable to register.' }, { status: 400 }); }
}
