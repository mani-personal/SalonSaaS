import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
export async function GET() { if (!(await requireRole(['ADMIN']))) return NextResponse.json({ error: 'Admin access required.' }, { status: 403 }); const settings = await prisma.platformSetting.findMany(); return NextResponse.json({ settings: Object.fromEntries(settings.map(s => [s.key, s.value])) }); }
export async function PUT(req: NextRequest) {
  if (!(await requireRole(['ADMIN']))) return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  try { const body = z.record(z.string(), z.unknown()).parse(await req.json()); const settings = await prisma.$transaction(Object.entries(body).map(([key,value]) => prisma.platformSetting.upsert({ where: { key }, create: { key, value: value as object }, update: { value: value as object } }))); return NextResponse.json({ settings: Object.fromEntries(settings.map(s => [s.key,s.value])) }); }
  catch { return NextResponse.json({ error: 'Invalid platform settings.' }, { status: 400 }); }
}
