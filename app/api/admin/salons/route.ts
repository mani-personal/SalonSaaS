import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
const schema = z.object({ status: z.enum(['PENDING_APPROVAL','ACTIVE','SUSPENDED','REJECTED']).optional(), plan: z.enum(['Trial','Pro Monthly','Enterprise Annual']).optional(), monthlyPrice: z.coerce.number().min(0).max(100000).optional() });
export async function PATCH(req: NextRequest) {
  const admin = await requireRole(['ADMIN']); if (!admin) return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  try { const body = z.object({ salonId: z.string(), ...schema.shape }).parse(await req.json()); const { salonId, ...data } = body; const salon = await prisma.salon.update({ where: { id: salonId }, data: { ...data, ...(data.plan === 'Trial' ? { monthlyPrice: 0 } : {}) } }); return NextResponse.json({ salon }); }
  catch (e) { return NextResponse.json({ error: e instanceof z.ZodError ? e.issues[0]?.message : 'Unable to update salon.' }, { status: 400 }); }
}
