import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireSalonMember } from '@/lib/auth';
const schema = z.object({ salonId: z.string(), name: z.string().trim().min(2).max(120), category: z.string().default('Hair'), durationMin: z.coerce.number().int().min(5).max(600), price: z.coerce.number().min(0).max(100000), isActive: z.boolean().optional() });
export async function POST(req: NextRequest) {
  try { const input = schema.parse(await req.json()); if (!(await requireSalonMember(input.salonId))) return NextResponse.json({ error: 'Salon owner access required.' }, { status: 403 }); const service = await prisma.service.create({ data: input }); return NextResponse.json({ service }, { status: 201 }); }
  catch (e) { return NextResponse.json({ error: e instanceof z.ZodError ? e.issues[0]?.message : 'Unable to add service.' }, { status: 400 }); }
}
