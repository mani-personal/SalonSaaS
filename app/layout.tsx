import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'AuraBook — Salon Booking & Management', description: 'Discover salons, manage appointments, and grow your salon business with AuraBook.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
