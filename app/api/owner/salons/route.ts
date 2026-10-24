import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
export async function GET() {
  const owner = await requireRole(['OWNER']); if (!owner) return NextResponse.json({ error: 'Salon owner access required.' }, { status: 401 });
  const salons = await prisma.salon.findMany({ where: { members: { some: { userId: owner.id } } }, include: { services: true, staff: true, _count: { select: { appointments: true } } }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ salons });
}
