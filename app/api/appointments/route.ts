import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
const schema = z.object({ salonId: z.string(), serviceId: z.string(), staffId: z.string(), date: z.iso.date(), startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/), clientName: z.string().trim().min(2).max(100), clientPhone: z.string().max(30).optional(), clientEmail: z.email().optional(), notes: z.string().max(1000).optional(), idempotencyKey: z.string().optional() });
const toMinutes = (t: string) => { const [h,m] = t.split(':').map(Number); return h * 60 + m; };
const toTime = (n: number) => `${String(Math.floor(n / 60)).padStart(2,'0')}:${String(n % 60).padStart(2,'0')}`;
export async function GET(req: NextRequest) {
  const session = await getSession(); if (!session) return NextResponse.json({ error: 'Sign in to view appointments.' }, { status: 401 });
  const salonId = req.nextUrl.searchParams.get('salonId');
  const appointments = await prisma.appointment.findMany({ where: session.role === 'ADMIN' ? (salonId ? { salonId } : {}) : session.role === 'OWNER' ? { salonId: { in: (await prisma.salonMember.findMany({ where: { userId: session.id }, select: { salonId: true } })).map(m => m.salonId) } } : { customerId: session.id }, include: { salon: true, service: true, staff: true }, orderBy: [{ date: 'asc' }, { startTime: 'asc' }] });
  return NextResponse.json({ appointments });
}
export async function POST(req: NextRequest) {
  const session = await getSession();
  try {
    const input = schema.parse(await req.json());
    const [salon, service, staff] = await Promise.all([prisma.salon.findUnique({ where: { id: input.salonId } }), prisma.service.findUnique({ where: { id: input.serviceId } }), prisma.staff.findUnique({ where: { id: input.staffId } })]);
    if (!salon || salon.status !== 'ACTIVE') return NextResponse.json({ error: 'This salon is not accepting bookings.' }, { status: 400 });
    if (!service || !service.isActive || service.salonId !== salon.id || !staff || staff.salonId !== salon.id || !staff.isWorking) return NextResponse.json({ error: 'Please select a valid service and available staff member.' }, { status: 400 });
    const start = toMinutes(input.startTime); const end = start + service.durationMin; if (end > 24 * 60) return NextResponse.json({ error: 'That time is outside business hours.' }, { status: 400 });
    if (staff.breakTime === input.startTime) return NextResponse.json({ error: 'That staff member is on a break at this time.' }, { status: 409 });
    const date = new Date(`${input.date}T00:00:00.000Z`);
    const existingKey = input.idempotencyKey ? await prisma.appointment.findUnique({ where: { idempotencyKey: input.idempotencyKey } }) : null;
    if (existingKey) return NextResponse.json({ appointment: existingKey });
    const existing = await prisma.appointment.findMany({ where: { staffId: staff.id, date, status: { in: ['CONFIRMED','IN_SERVICE'] } }, select: { startTime: true, endTime: true } });
    const collision = existing.some(a => start < toMinutes(a.endTime) && end > toMinutes(a.startTime));
    if (collision) return NextResponse.json({ error: 'That slot has just been booked. Please choose another time.' }, { status: 409 });
    const appointment = await prisma.appointment.create({ data: { salonId: salon.id, serviceId: service.id, staffId: staff.id, customerId: session?.role === 'CUSTOMER' ? session.id : undefined, clientName: input.clientName, clientPhone: input.clientPhone, clientEmail: input.clientEmail, date, startTime: input.startTime, endTime: toTime(end), price: service.price, notes: input.notes ?? '', idempotencyKey: input.idempotencyKey }, include: { salon: true, service: true, staff: true } });
    return NextResponse.json({ appointment }, { status: 201 });
  } catch (e) { return NextResponse.json({ error: e instanceof z.ZodError ? e.issues[0]?.message : 'Unable to create booking.' }, { status: 400 }); }
}
