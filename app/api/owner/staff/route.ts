import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireSalonMember } from '@/lib/auth';
const schema = z.object({ salonId: z.string(), name: z.string().trim().min(2).max(100), title: z.string().max(100).default('Stylist'), email: z.email().optional().or(z.literal('')), phone: z.string().max(30).optional(), breakTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional() });
export async function POST(req: NextRequest) {
  try { const input = schema.parse(await req.json()); if (!(await requireSalonMember(input.salonId))) return NextResponse.json({ error: 'Salon owner access required.' }, { status: 403 }); const staff = await prisma.staff.create({ data: input }); return NextResponse.json({ staff }, { status: 201 }); }
  catch (e) { return NextResponse.json({ error: e instanceof z.ZodError ? e.issues[0]?.message : 'Unable to add staff.' }, { status: 400 }); }
}
