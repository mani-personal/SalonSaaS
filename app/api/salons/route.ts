import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, requireRole } from '@/lib/auth';
import { z } from 'zod';
const createSchema = z.object({ name: z.string().trim().min(2).max(120), city: z.string().trim().min(2), address: z.string().trim().min(4), email: z.email(), phone: z.string().optional(), description: z.string().max(2000).optional(), categories: z.array(z.string()).default([]), image: z.url().optional() });
export async function GET(req: NextRequest) {
  const session = await getSession(); const includeAll = req.nextUrl.searchParams.get('all') === 'true';
  if (includeAll && (!session || session.role !== 'ADMIN')) return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  const q = req.nextUrl.searchParams.get('q')?.trim(); const city = req.nextUrl.searchParams.get('city'); const category = req.nextUrl.searchParams.get('category');
  const salons = await prisma.salon.findMany({ where: { ...(includeAll ? {} : { status: 'ACTIVE' }), ...(q ? { OR: [{ name: { contains: q, mode: 'insensitive' } }, { city: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] } : {}), ...(city && city !== 'All' ? { city } : {}), ...(category && category !== 'All' ? { categories: { has: category } } : {}) }, include: { services: { where: { isActive: true }, orderBy: { price: 'asc' } }, staff: { where: { isWorking: true } }, _count: { select: { appointments: true } } }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ salons });
}
export async function POST(req: NextRequest) {
  const owner = await requireRole(['OWNER']); if (!owner) return NextResponse.json({ error: 'Sign in as a salon owner to register a salon.' }, { status: 401 });
  try {
    const input = createSchema.parse(await req.json()); const slugBase = input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'salon';
    let slug = slugBase; let n = 2; while (await prisma.salon.findUnique({ where: { slug } })) slug = `${slugBase}-${n++}`;
    const salon = await prisma.salon.create({ data: { ...input, slug, status: 'PENDING_APPROVAL', members: { create: { userId: owner.id, isPrimary: true } } } });
    return NextResponse.json({ salon }, { status: 201 });
  } catch (e) { return NextResponse.json({ error: e instanceof z.ZodError ? e.issues[0]?.message : 'Unable to create salon.' }, { status: 400 }); }
}
