import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';
const schema = z.object({ email: z.email().transform(v => v.toLowerCase()), password: z.string().min(1) });
export async function POST(req: NextRequest) {
  try {
    const input = schema.parse(await req.json());
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    await createSession(user);
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch { return NextResponse.json({ error: 'Invalid login request.' }, { status: 400 }); }
}
