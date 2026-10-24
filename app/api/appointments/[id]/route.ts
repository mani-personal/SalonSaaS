import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSession, requireSalonMember } from '@/lib/auth';
const schema = z.object({ status: z.enum(['CONFIRMED','IN_SERVICE','COMPLETED','CANCELLED','NO_SHOW']).optional(), date: z.iso.date().optional(), startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional() });
const mins = (t: string) => { const [h,m] = t.split(':').map(Number); return h*60+m; };
const time = (n: number) => `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSession(); if (!session) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  const { id } = await ctx.params; const appointment = await prisma.appointment.findUnique({ where: { id }, include: { service: true } });
  if (!appointment) return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
  if (session.role === 'CUSTOMER' && appointment.customerId !== session.id) return NextResponse.json({ error: 'You can only manage your own bookings.' }, { status: 403 });
  if (session.role === 'OWNER' && !(await requireSalonMember(appointment.salonId))) return NextResponse.json({ error: 'Salon membership required.' }, { status: 403 });
  try {
    const input = schema.parse(await req.json()); const data: {status?: typeof appointment.status; date?: Date; startTime?: string; endTime?: string} = {};
    if (input.status) { if (session.role === 'CUSTOMER' && input.status !== 'CANCELLED') return NextResponse.json({ error: 'Customers can only cancel their booking.' }, { status: 403 }); data.status = input.status; }
    if (input.date || input.startTime) {
      if (session.role === 'CUSTOMER' && appointment.status !== 'CONFIRMED') return NextResponse.json({ error: 'Only confirmed bookings can be rescheduled.' }, { status: 400 });
      const startTime = input.startTime ?? appointment.startTime; const date = new Date(`${input.date ?? appointment.date.toISOString().slice(0,10)}T00:00:00.000Z`); const end = mins(startTime) + appointment.service.durationMin;
      const conflict = await prisma.appointment.findFirst({ where: { id: { not: id }, staffId: appointment.staffId, date, status: { in: ['CONFIRMED','IN_SERVICE'] }, startTime: { lt: time(end) }, endTime: { gt: startTime } } });
      if (conflict) return NextResponse.json({ error: 'That time conflicts with another booking.' }, { status: 409 });
      data.date = date; data.startTime = startTime; data.endTime = time(end); if (session.role === 'CUSTOMER') data.status = 'CONFIRMED';
    }
    return NextResponse.json({ appointment: await prisma.appointment.update({ where: { id }, data, include: { salon: true, service: true, staff: true } }) });
  } catch (e) { return NextResponse.json({ error: e instanceof z.ZodError ? e.issues[0]?.message : 'Unable to update booking.' }, { status: 400 }); }
}
