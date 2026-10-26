import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
async function main() {
  const adminEmail = (process.env.SEED_ADMIN_EMAIL || 'mani.manikandank75@gmail.com').toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Chilly@239177';
  await prisma.user.upsert({ where: { email: adminEmail }, update: {}, create: { name: 'Platform Administrator', email: adminEmail, passwordHash: await bcrypt.hash(adminPassword, 12), role: 'ADMIN' } });
  const ownerEmail = 'owner@example.com';
  const owner = await prisma.user.upsert({ where: { email: ownerEmail }, update: {}, create: { name: 'Salon Owner', email: ownerEmail, passwordHash: await bcrypt.hash('ChangeThis-Owner-Password-123!', 12), role: 'OWNER' } });
  const customerEmail = 'customer@example.com';
  await prisma.user.upsert({ where: { email: customerEmail }, update: {}, create: { name: 'Sophia Martinez', email: customerEmail, passwordHash: await bcrypt.hash('ChangeThis-Customer-Password-123!', 12), role: 'CUSTOMER', phone: '+1 917 555 0199' } });
  const data = [
    { name: 'Luxe Aura Studio & Spa', slug: 'luxe-aura-studio', city: 'New York', address: '450 Mercer St, SoHo, NY', email: 'concierge@luxeaura.com', phone: '+1 (212) 555-0192', status: 'ACTIVE' as const, plan: 'Enterprise Annual', monthlyPrice: 199, categories: ['Hair','Spa','Nails'], image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80', description: 'Luxury hair design, organic facials, and bespoke nail artistry in a calm, contemporary studio.', hours: '09:00 AM - 07:00 PM', rating: 4.9, reviewsCount: 184 },
    { name: 'The Sovereign Barber Co.', slug: 'sovereign-barber', city: 'Brooklyn', address: '118 Wythe Ave, Williamsburg, NY', email: 'book@sovereignbarber.com', phone: '+1 (718) 555-0148', status: 'ACTIVE' as const, plan: 'Pro Monthly', monthlyPrice: 99, categories: ['Barber','Hair'], image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1000&q=80', description: 'Classic hot-towel shaves, precision skin fades, and artisan grooming.', hours: '10:00 AM - 08:00 PM', rating: 4.8, reviewsCount: 142 },
    { name: 'Velvet Rose Nail & Lash Lounge', slug: 'velvet-rose-lounge', city: 'Manhattan', address: '280 Madison Ave, Midtown, NY', email: 'hello@velvetroselounge.com', phone: '+1 (212) 555-0833', status: 'ACTIVE' as const, plan: 'Pro Monthly', monthlyPrice: 99, categories: ['Nails','Spa'], image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80', description: 'Japanese gel manicures, luxury pedicures, and custom eyelash extensions.', hours: '09:00 AM - 06:00 PM', rating: 4.7, reviewsCount: 98 },
    { name: 'Serenity Botanica Holistic Spa', slug: 'serenity-botanica', city: 'Queens', address: '32-14 Steinway St, Astoria, NY', email: 'owners@serenitybotanica.com', phone: '+1 (718) 555-0911', status: 'PENDING_APPROVAL' as const, plan: 'Trial', monthlyPrice: 0, categories: ['Spa','Hair'], image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80', description: 'Holistic massages, scalp rituals, and botanical skin therapies.', hours: '10:00 AM - 06:00 PM', rating: 4.6, reviewsCount: 41 }
  ];
  for (const item of data) {
    const salon = await prisma.salon.upsert({ where: { slug: item.slug }, update: {}, create: item });
    if (salon.slug === 'luxe-aura-studio') await prisma.salonMember.upsert({ where: { userId_salonId: { userId: owner.id, salonId: salon.id } }, update: {}, create: { userId: owner.id, salonId: salon.id, isPrimary: true } });
    const serviceData = salon.slug === 'luxe-aura-studio' ? [ ['Signature Balayage & Gloss','Hair',120,240], ['Precision Couture Haircut & Blowout','Hair',60,110], ['24K Gold Hydrating Facial','Spa',60,165], ['Russian Gel Manicure','Nails',45,75] ] : salon.slug === 'sovereign-barber' ? [['Executive Skin Fade & Beard Sculpt','Barber',60,85],['Traditional Straight Razor Hot Towel Shave','Barber',45,60],['Classic Scissor Cut & Wash','Hair',45,55]] : salon.slug === 'velvet-rose-lounge' ? [['Soft Gel Nail Extensions + Art','Nails',90,125],['Detox Rose Petal Spa Pedicure','Nails',60,80],['Volume Cashmere Lash Full Set','Spa',90,150]] : [['Deep Tissue Bamboo Massage','Spa',60,130]];
    for (const [name, category, durationMin, price] of serviceData as [string,string,number,number][]) {
      const found = await prisma.service.findFirst({ where: { salonId: salon.id, name } }); if (!found) await prisma.service.create({ data: { salonId: salon.id, name, category, durationMin, price } });
    }
    const staffData = salon.slug === 'luxe-aura-studio' ? [['Elena Rostova','Master Colorist','13:00'],['Julian Vance','Senior Creative Director','14:00'],['Chloe Lin','Lead Esthetician & Nail Artist','12:00']] : salon.slug === 'sovereign-barber' ? [['Marcus Thorne','Master Barber','13:00'],['Devon Brooks','Fade Specialist','15:00']] : salon.slug === 'velvet-rose-lounge' ? [['Sora Takahashi','Master Nail Technician','13:00']] : [['Maya Patel','Holistic Therapist','13:00']];
    for (const [name,title,breakTime] of staffData as [string,string,string][]) { if (!(await prisma.staff.findFirst({ where: { salonId: salon.id, name } }))) await prisma.staff.create({ data: { salonId: salon.id, name, title, breakTime } }); }
  }
  for (const [key,value] of Object.entries({ taxRate: 8.875, commissionRate: 5, maintenanceMode: false })) await prisma.platformSetting.upsert({ where: { key }, update: {}, create: { key, value } });
  console.log(`Seed complete. Admin: ${adminEmail}. Demo owner: ${ownerEmail}.`);
}
main().finally(() => prisma.$disconnect());
