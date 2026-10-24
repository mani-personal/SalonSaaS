import React, { useState, useMemo } from 'react';
import {
  Sparkles, Search, MapPin, Star, Clock, Calendar, User, Users, Scissors,
  CheckCircle2, XCircle, AlertCircle, Bell, MessageSquare, Mail, Shield,
  CreditCard, TrendingUp, Building2, Plus, Filter, ChevronRight, ChevronLeft,
  Settings, RefreshCw, DollarSign, Phone, Check, Ban, Play, Award, ArrowUpRight,
  Sliders, Eye, Trash2, Edit3, Lock, Unlock, Zap, FileText, Activity
} from 'lucide-react';

// --- INITIAL MOCK DATA ---
const INITIAL_SALONS = [
  {
    id: 'salon-1',
    name: 'Luxe Aura Studio & Spa',
    slug: 'luxe-aura-studio',
    city: 'New York',
    address: '450 Mercer St, SoHo, NY',
    rating: 4.9,
    reviewsCount: 184,
    status: 'ACTIVE', // ACTIVE, PENDING_APPROVAL, SUSPENDED, REJECTED
    plan: 'Enterprise Annual',
    mrr: 199,
    cancellationWindowHours: 24,
    phone: '+1 (212) 555-0192',
    email: 'concierge@luxeaura.com',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    categories: ['Hair', 'Spa', 'Nails'],
    hours: '09:00 AM - 07:00 PM',
    description: 'Award-winning luxury hair design, organic facials, and bespoke nail artistry in the heart of SoHo.'
  },
  {
    id: 'salon-2',
    name: 'The Sovereign Barber Co.',
    slug: 'sovereign-barber',
    city: 'Brooklyn',
    address: '118 Wythe Ave, Williamsburg, NY',
    rating: 4.8,
    reviewsCount: 142,
    status: 'ACTIVE',
    plan: 'Pro Monthly',
    mrr: 99,
    cancellationWindowHours: 12,
    phone: '+1 (718) 555-0148',
    email: 'book@sovereignbarber.com',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
    categories: ['Barber', 'Hair'],
    hours: '10:00 AM - 08:00 PM',
    description: 'Classic hot-towel shaves, precision skin fades, and artisan grooming for the modern gentleman.'
  },
  {
    id: 'salon-3',
    name: 'Velvet Rose Nail & Lash Lounge',
    slug: 'velvet-rose-lounge',
    city: 'Manhattan',
    address: '280 Madison Ave, Midtown, NY',
    rating: 4.7,
    reviewsCount: 98,
    status: 'ACTIVE',
    plan: 'Pro Monthly',
    mrr: 99,
    cancellationWindowHours: 24,
    phone: '+1 (212) 555-0833',
    email: 'hello@velvetroselounge.com',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    categories: ['Nails', 'Spa'],
    hours: '09:00 AM - 06:00 PM',
    description: 'Japanese gel manicures, luxury pedicures, and custom cashmere eyelash extensions.'
  },
  {
    id: 'salon-4',
    name: 'Serenity Botanica Holistic Spa',
    slug: 'serenity-botanica',
    city: 'Queens',
    address: '32-14 Steinway St, Astoria, NY',
    rating: 4.6,
    reviewsCount: 41,
    status: 'PENDING_APPROVAL',
    plan: 'Trial',
    mrr: 0,
    cancellationWindowHours: 24,
    phone: '+1 (718) 555-0911',
    email: 'owners@serenitybotanica.com',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    categories: ['Spa', 'Hair'],
    hours: '10:00 AM - 06:00 PM',
    description: 'Holistic aromatherapy massages, scalp detox rituals, and botanical skin therapies.'
  }
];

const INITIAL_SERVICES = [
  // Salon 1
  { id: 'srv-1', salonId: 'salon-1', name: 'Signature Balayage & Gloss', category: 'Hair', durationMin: 120, price: 240, isActive: true },
  { id: 'srv-2', salonId: 'salon-1', name: 'Precision Couture Haircut & Blowout', category: 'Hair', durationMin: 60, price: 110, isActive: true },
  { id: 'srv-3', salonId: 'salon-1', name: '24K Gold Hydrating Facial', category: 'Spa', durationMin: 60, price: 165, isActive: true },
  { id: 'srv-4', salonId: 'salon-1', name: 'Russian Gel Manicure', category: 'Nails', durationMin: 45, price: 75, isActive: true },
  // Salon 2
  { id: 'srv-5', salonId: 'salon-2', name: 'Executive Skin Fade & Beard Sculpt', category: 'Barber', durationMin: 60, price: 85, isActive: true },
  { id: 'srv-6', salonId: 'salon-2', name: 'Traditional Straight Razor Hot Towel Shave', category: 'Barber', durationMin: 45, price: 60, isActive: true },
  { id: 'srv-7', salonId: 'salon-2', name: 'Classic Scissor Cut & Wash', category: 'Hair', durationMin: 45, price: 55, isActive: true },
  // Salon 3
  { id: 'srv-8', salonId: 'salon-3', name: 'Soft Gel Nail Extensions + Art', category: 'Nails', durationMin: 90, price: 125, isActive: true },
  { id: 'srv-9', salonId: 'salon-3', name: 'Detox Rose Petal Spa Pedicure', category: 'Nails', durationMin: 60, price: 80, isActive: true },
  { id: 'srv-10', salonId: 'salon-3', name: 'Volume Cashmere Lash Full Set', category: 'Spa', durationMin: 90, price: 150, isActive: true },
  // Salon 4
  { id: 'srv-11', salonId: 'salon-4', name: 'Deep Tissue Bamboo Massage', category: 'Spa', durationMin: 60, price: 130, isActive: true },
];

const INITIAL_STAFF = [
  { id: 'stf-1', salonId: 'salon-1', name: 'Elena Rostova', title: 'Master Colorist', rating: 4.9, breakTime: '13:00', isWorking: true, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80' },
  { id: 'stf-2', salonId: 'salon-1', name: 'Julian Vance', title: 'Senior Creative Director', rating: 4.8, breakTime: '14:00', isWorking: true, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80' },
  { id: 'stf-3', salonId: 'salon-1', name: 'Chloe Lin', title: 'Lead Esthetician & Nail Artist', rating: 5.0, breakTime: '12:00', isWorking: true, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80' },
  { id: 'stf-4', salonId: 'salon-2', name: 'Marcus Thorne', title: 'Master Barber', rating: 4.9, breakTime: '13:00', isWorking: true, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80' },
  { id: 'stf-5', salonId: 'salon-2', name: 'Devon Brooks', title: 'Fade Specialist', rating: 4.7, breakTime: '15:00', isWorking: true, avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=250&q=80' },
  { id: 'stf-6', salonId: 'salon-3', name: 'Sora Takahashi', title: 'Master Nail Technician', rating: 4.9, breakTime: '13:00', isWorking: true, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80' },
  { id: 'stf-7', salonId: 'salon-4', name: 'Maya Patel', title: 'Holistic Therapist', rating: 4.8, breakTime: '13:00', isWorking: true, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80' },
];

const AVAILABLE_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const TODAY_STR = '2025-05-15';
const TOMORROW_STR = '2025-05-16';

const INITIAL_APPOINTMENTS = [
  {
    id: 'apt-101',
    salonId: 'salon-1',
    serviceId: 'srv-2',
    staffId: 'stf-1',
    clientName: 'Sophia Martinez',
    clientPhone: '+1 (917) 555-0199',
    clientEmail: 'sophia.m@example.com',
    date: TODAY_STR,
    time: '10:00',
    status: 'CONFIRMED', // CONFIRMED, IN_SERVICE, COMPLETED, CANCELLED
    price: 110,
    isWalkIn: false,
    notes: 'Prefers warm dimensional tones'
  },
  {
    id: 'apt-102',
    salonId: 'salon-1',
    serviceId: 'srv-3',
    staffId: 'stf-3',
    clientName: 'Liam O’Connor',
    clientPhone: '+1 (646) 555-0142',
    clientEmail: 'liam.oc@example.com',
    date: TODAY_STR,
    time: '11:00',
    status: 'IN_SERVICE',
    price: 165,
    isWalkIn: false,
    notes: 'Sensitive skin check'
  },
  {
    id: 'apt-103',
    salonId: 'salon-1',
    serviceId: 'srv-4',
    staffId: 'stf-3',
    clientName: 'Sophia Martinez',
    clientPhone: '+1 (917) 555-0199',
    clientEmail: 'sophia.m@example.com',
    date: '2025-05-10',
    time: '15:00',
    status: 'COMPLETED',
    price: 75,
    isWalkIn: false,
    notes: ''
  },
  {
    id: 'apt-104',
    salonId: 'salon-2',
    serviceId: 'srv-5',
    staffId: 'stf-4',
    clientName: 'Sophia Martinez',
    clientPhone: '+1 (917) 555-0199',
    clientEmail: 'sophia.m@example.com',
    date: TOMORROW_STR,
    time: '14:00',
    status: 'CONFIRMED',
    price: 85,
    isWalkIn: false,
    notes: 'Gift booking for brother'
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    channel: 'WHATSAPP',
    recipient: '+1 (917) 555-0199',
    salonName: 'Luxe Aura Studio & Spa',
    message: 'Hi Sophia! Reminder: Your Precision Couture Haircut with Elena Rostova is scheduled for 2025-05-15 at 10:00.',
    timestamp: '10 mins ago',
    type: '24H_REMINDER'
  },
  {
    id: 'notif-2',
    channel: 'EMAIL',
    recipient: 'liam.oc@example.com',
    salonName: 'Luxe Aura Studio & Spa',
    message: 'Booking Status Updated: Your 24K Gold Hydrating Facial is now IN_SERVICE.',
    timestamp: '2 mins ago',
    type: 'STATUS_UPDATE'
  }
];

const INITIAL_INVOICES = [
  { id: 'inv_9921', salonId: 'salon-1', salonName: 'Luxe Aura Studio & Spa', plan: 'Enterprise Annual', amount: 199, status: 'paid', date: '2025-05-01' },
  { id: 'inv_9922', salonId: 'salon-2', salonName: 'The Sovereign Barber Co.', plan: 'Pro Monthly', amount: 99, status: 'paid', date: '2025-05-03' },
  { id: 'inv_9923', salonId: 'salon-3', salonName: 'Velvet Rose Nail & Lash Lounge', plan: 'Pro Monthly', amount: 99, status: 'past_due', date: '2025-05-12' },
];

export default function App() {
  // --- GLOBAL SHARED STATE ---
  const [activePortal, setActivePortal] = useState('USER'); // 'USER' | 'SALON' | 'ADMIN'
  const [salons, setSalons] = useState(INITIAL_SALONS);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [toastAlert, setToastAlert] = useState(null);

  // Platform Settings (Admin)
  const [platformSettings, setPlatformSettings] = useState({
    taxRate: 8.875,
    commissionRate: 5.0,
    maintenanceMode: false,
    whatsappConnected: true,
    resendConnected: true
  });

  // --- USER CONSOLE STATE ---
  const [userTab, setUserTab] = useState('DISCOVER'); // 'DISCOVER' | 'DASHBOARD'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [viewingSalon, setViewingSalon] = useState(null);

  // Booking Wizard State
  const [bookingModalSalon, setBookingModalSalon] = useState(null);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardService, setWizardService] = useState(null);
  const [wizardStaff, setWizardStaff] = useState(null);
  const [wizardDate, setWizardDate] = useState(TODAY_STR);
  const [wizardTime, setWizardTime] = useState('');
  const [wizardNotes, setWizardNotes] = useState('');

  // Reschedule Modal State
  const [reschedulingApt, setReschedulingApt] = useState(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState(TODAY_STR);
  const [newRescheduleTime, setNewRescheduleTime] = useState('');

  // --- SALON CONSOLE STATE ---
  const [activeVendorSalonId, setActiveVendorSalonId] = useState('salon-1');
  const [salonTab, setSalonTab] = useState('CALENDAR'); // 'CALENDAR' | 'SERVICES' | 'STAFF' | 'NOTIFICATIONS'
  const [calendarDate, setCalendarDate] = useState(TODAY_STR);
  const [calendarStaffFilter, setCalendarStaffFilter] = useState('ALL');
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [walkInForm, setWalkInForm] = useState({
    clientName: '',
    clientPhone: '',
    serviceId: '',
    staffId: '',
    date: TODAY_STR,
    time: '12:00'
  });
  const [newServiceForm, setNewServiceForm] = useState({
    name: '',
    category: 'Hair',
    durationMin: 60,
    price: 90
  });

  // --- HELPER: TRIGGER NOTIFICATION & TOAST ---
  const dispatchNotification = (channel, recipient, salonName, message, type = 'INSTANT_ALERT') => {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      channel,
      recipient,
      salonName,
      message,
      timestamp: 'Just now',
      type
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setToastAlert({
      title: `${channel === 'WHATSAPP' ? 'WhatsApp' : 'Email'} Dispatched`,
      subtitle: `To: ${recipient}`,
      body: message,
      channel
    });
    setTimeout(() => {
      setToastAlert((current) => (current?.body === message ? null : current));
    }, 5000);
  };

  // --- HELPER: CHECK SLOT CONFLICT ---
  const isSlotBooked = (staffId, date, time, ignoreAptId = null) => {
    const staffMember = staff.find((s) => s.id === staffId);
    if (staffMember && !staffMember.isWorking) return { blocked: true, reason: 'Off Duty' };
    if (staffMember && staffMember.breakTime === time) return { blocked: true, reason: 'Break' };

    const conflict = appointments.find(
      (a) =>
        a.staffId === staffId &&
        a.date === date &&
        a.time === time &&
        a.id !== ignoreAptId &&
        ['CONFIRMED', 'IN_SERVICE'].includes(a.status)
    );
    if (conflict) return { blocked: true, reason: 'Booked' };
    return { blocked: false, reason: null };
  };

  // --- USER CONSOLE ACTIONS ---
  const openBookingWizard = (salon, preselectedService = null) => {
    setBookingModalSalon(salon);
    const salonServices = services.filter((s) => s.salonId === salon.id && s.isActive);
    const salonStaff = staff.filter((st) => st.salonId === salon.id && st.isWorking);
    setWizardService(preselectedService || salonServices[0] || null);
    setWizardStaff(salonStaff[0] || null);
    setWizardDate(TODAY_STR);
    setWizardTime('');
    setWizardNotes('');
    setWizardStep(preselectedService ? 2 : 1);
  };

  const handleConfirmClientBooking = () => {
    if (!bookingModalSalon || !wizardService || !wizardStaff || !wizardTime) return;

    const newApt = {
      id: `apt-${Date.now().toString().slice(-4)}`,
      salonId: bookingModalSalon.id,
      serviceId: wizardService.id,
      staffId: wizardStaff.id,
      clientName: 'Sophia Martinez',
      clientPhone: '+1 (917) 555-0199',
      clientEmail: 'sophia.m@example.com',
      date: wizardDate,
      time: wizardTime,
      status: 'CONFIRMED',
      price: wizardService.price,
      isWalkIn: false,
      notes: wizardNotes
    };

    setAppointments((prev) => [newApt, ...prev]);

    dispatchNotification(
      'WHATSAPP',
      newApt.clientPhone,
      bookingModalSalon.name,
      `Confirmed! Your ${wizardService.name} with ${wizardStaff.name} at ${bookingModalSalon.name} is booked for ${wizardDate} at ${wizardTime}.`,
      'BOOKING_CONFIRMED'
    );

    setBookingModalSalon(null);
    setViewingSalon(null);
    setUserTab('DASHBOARD');
  };

  const handleCancelAppointment = (apt) => {
    const salon = salons.find((s) => s.id === apt.salonId);
    setAppointments((prev) =>
      prev.map((item) => (item.id === apt.id ? { ...item, status: 'CANCELLED' } : item))
    );
    dispatchNotification(
      'EMAIL',
      apt.clientEmail || apt.clientPhone,
      salon?.name || 'Salon',
      `Cancellation confirmed for your appointment on ${apt.date} at ${apt.time}. Free cancellation policy (${salon?.cancellationWindowHours}h window) applied.`,
      'CANCELLATION'
    );
  };

  const handleConfirmReschedule = () => {
    if (!reschedulingApt || !newRescheduleTime) return;
    const salon = salons.find((s) => s.id === reschedulingApt.salonId);
    setAppointments((prev) =>
      prev.map((item) =>
        item.id === reschedulingApt.id
          ? { ...item, date: newRescheduleDate, time: newRescheduleTime, status: 'CONFIRMED' }
          : item
      )
    );
    dispatchNotification(
      'WHATSAPP',
      reschedulingApt.clientPhone,
      salon?.name || 'Salon',
      `Rescheduled! Your appointment at ${salon?.name} has been moved to ${newRescheduleDate} at ${newRescheduleTime}.`,
      'RESCHEDULED'
    );
    setReschedulingApt(null);
  };

  // --- SALON CONSOLE ACTIONS ---
  const activeVendorSalon = useMemo(
    () => salons.find((s) => s.id === activeVendorSalonId) || salons[0],
    [salons, activeVendorSalonId]
  );

  const handleUpdateAptStatus = (apt, newStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === apt.id ? { ...a, status: newStatus } : a))
    );
    const srv = services.find((s) => s.id === apt.serviceId);
    dispatchNotification(
      'WHATSAPP',
      apt.clientPhone,
      activeVendorSalon.name,
      `Update from ${activeVendorSalon.name}: Your ${srv?.name || 'appointment'} on ${apt.date} (${apt.time}) status is now ${newStatus.replace('_', ' ')}.`,
      'STATUS_UPDATE'
    );
  };

  const handleCreateWalkIn = (e) => {
    e.preventDefault();
    const srv = services.find((s) => s.id === walkInForm.serviceId);
    const stf = staff.find((s) => s.id === walkInForm.staffId);
    if (!srv || !stf || !walkInForm.clientName) return;

    const newApt = {
      id: `apt-${Date.now().toString().slice(-4)}`,
      salonId: activeVendorSalon.id,
      serviceId: srv.id,
      staffId: stf.id,
      clientName: walkInForm.clientName,
      clientPhone: walkInForm.clientPhone || '+1 (555) 019-2831',
      clientEmail: 'walkin@guest.com',
      date: walkInForm.date,
      time: walkInForm.time,
      status: 'CONFIRMED',
      price: srv.price,
      isWalkIn: true,
      notes: 'Manual Walk-In / Phone Booking'
    };

    setAppointments((prev) => [newApt, ...prev]);
    dispatchNotification(
      'WHATSAPP',
      newApt.clientPhone,
      activeVendorSalon.name,
      `Walk-in booked! ${srv.name} with ${stf.name} on ${newApt.date} at ${newApt.time}.`,
      'WALK_IN_CONFIRM'
    );
    setShowWalkInModal(false);
    setCalendarDate(walkInForm.date);
  };

  const handleAddService = (e) => {
    e.preventDefault();
    if (!newServiceForm.name) return;
    const newSrv = {
      id: `srv-${Date.now()}`,
      salonId: activeVendorSalon.id,
      name: newServiceForm.name,
      category: newServiceForm.category,
      durationMin: Number(newServiceForm.durationMin),
      price: Number(newServiceForm.price),
      isActive: true
    };
    setServices((prev) => [...prev, newSrv]);
    setNewServiceForm({ name: '', category: 'Hair', durationMin: 60, price: 90 });
  };

  // --- ADMIN CONSOLE ACTIONS ---
  const handleSalonStatusChange = (salonId, newStatus) => {
    setSalons((prev) =>
      prev.map((s) => {
        if (s.id !== salonId) return s;
        const updatedMrr =
          newStatus === 'ACTIVE'
            ? s.plan === 'Enterprise Annual'
              ? 199
              : s.plan === 'Pro Monthly'
              ? 99
              : 0
            : 0;
        return { ...s, status: newStatus, mrr: updatedMrr };
      })
    );
    const target = salons.find((s) => s.id === salonId);
    dispatchNotification(
      'EMAIL',
      target?.email || 'owner@salon.com',
      target?.name || 'Salon',
      `Admin Alert: Your salon account status on the platform has been updated to ${newStatus}.`,
      'ADMIN_ACTION'
    );
  };

  const handleSalonPlanChange = (salonId, newPlan) => {
    const mrrMap = { Trial: 0, 'Pro Monthly': 99, 'Enterprise Annual': 199 };
    setSalons((prev) =>
      prev.map((s) =>
        s.id === salonId
          ? { ...s, plan: newPlan, mrr: s.status === 'ACTIVE' ? mrrMap[newPlan] : 0 }
          : s
      )
    );
  };

  const simulateStripeWebhook = (eventType, salonId) => {
    const targetSalon = salons.find((s) => s.id === salonId);
    if (!targetSalon) return;

    if (eventType === 'invoice.paid') {
      const amount = targetSalon.plan === 'Enterprise Annual' ? 199 : 99;
      const newInv = {
        id: `inv_${Math.floor(1000 + Math.random() * 9000)}`,
        salonId: targetSalon.id,
        salonName: targetSalon.name,
        plan: targetSalon.plan === 'Trial' ? 'Pro Monthly' : targetSalon.plan,
        amount,
        status: 'paid',
        date: TODAY_STR
      };
      setInvoices((prev) => [newInv, ...prev]);
      setSalons((prev) =>
        prev.map((s) =>
          s.id === salonId
            ? {
                ...s,
                status: 'ACTIVE',
                plan: s.plan === 'Trial' ? 'Pro Monthly' : s.plan,
                mrr: amount
              }
            : s
        )
      );
      dispatchNotification(
        'EMAIL',
        targetSalon.email,
        targetSalon.name,
        `Stripe Webhook [invoice.paid]: Payment of $${amount} succeeded. Salon status verified ACTIVE.`,
        'STRIPE_WEBHOOK'
      );
    } else if (eventType === 'customer.subscription.deleted') {
      const newInv = {
        id: `inv_${Math.floor(1000 + Math.random() * 9000)}`,
        salonId: targetSalon.id,
        salonName: targetSalon.name,
        plan: targetSalon.plan,
        amount: targetSalon.mrr || 99,
        status: 'failed',
        date: TODAY_STR
      };
      setInvoices((prev) => [newInv, ...prev]);
      setSalons((prev) =>
        prev.map((s) => (s.id === salonId ? { ...s, status: 'SUSPENDED', mrr: 0 } : s))
      );
      dispatchNotification(
        'EMAIL',
        targetSalon.email,
        targetSalon.name,
        `Stripe Webhook [invoice.payment_failed]: Subscription unpaid. Salon automatically SUSPENDED and hidden from client discovery.`,
        'STRIPE_WEBHOOK'
      );
    }
  };

  // --- DERIVED FILTERED DATA ---
  const filteredSalons = useMemo(() => {
    return salons.filter((salon) => {
      if (salon.status !== 'ACTIVE') return false;
      const matchesSearch =
        salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salon.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salon.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || salon.categories.includes(selectedCategory);
      const matchesCity = selectedCity === 'All' || salon.city === selectedCity;
      const matchesRating = salon.rating >= minRating;
      return matchesSearch && matchesCategory && matchesCity && matchesRating;
    });
  }, [salons, searchQuery, selectedCategory, selectedCity, minRating]);

  const adminMetrics = useMemo(() => {
    const activeCount = salons.filter((s) => s.status === 'ACTIVE').length;
    const pendingCount = salons.filter((s) => s.status === 'PENDING_APPROVAL').length;
    const totalMrr = salons.reduce((acc, s) => acc + (s.status === 'ACTIVE' ? s.mrr : 0), 0);
    const totalGrossBookings = appointments
      .filter((a) => a.status !== 'CANCELLED')
      .reduce((acc, a) => acc + a.price, 0);
    return { activeCount, pendingCount, totalMrr, totalGrossBookings };
  }, [salons, appointments]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* LIVE NOTIFICATION TOAST BANNER */}
      {toastAlert && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md w-full bg-slate-900/95 backdrop-blur-md border border-indigo-500/40 rounded-2xl p-4 shadow-2xl shadow-indigo-950/80 animate-bounce">
          <div className="flex items-start gap-3">
            <div
              className={`p-2.5 rounded-xl shrink-0 ${
                toastAlert.channel === 'WHATSAPP'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
              }`}
            >
              {toastAlert.channel === 'WHATSAPP' ? (
                <MessageSquare className="w-5 h-5" />
              ) : (
                <Mail className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  {toastAlert.title}
                </span>
                <button
                  onClick={() => setToastAlert(null)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5">{toastAlert.subtitle}</p>
              <p className="text-sm text-slate-200 mt-1.5 leading-snug">{toastAlert.body}</p>
            </div>
          </div>
        </div>
      )}

      {/* TOP MULTI-TENANT PORTAL SWITCHER */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex flex-wrap items-center justify-between gap-3">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-rose-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                  AuraBook
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  SaaS v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Multi-Tenant Salon Management Engine
              </p>
            </div>
          </div>

          {/* 3-Portal Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActivePortal('USER')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activePortal === 'USER'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>1. User Console</span>
            </button>

            <button
              onClick={() => setActivePortal('SALON')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activePortal === 'SALON'
                  ? 'bg-gradient-to-r from-violet-600 to-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Scissors className="w-4 h-4" />
              <span>2. Salon Console</span>
            </button>

            <button
              onClick={() => setActivePortal('ADMIN')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activePortal === 'ADMIN'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>3. Admin Console</span>
              {adminMetrics.pendingCount > 0 && (
                <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-bold">
                  {adminMetrics.pendingCount}
                </span>
              )}
            </button>
          </div>

          {/* Quick Live Sync Badge */}
          <div className="hidden lg:flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Shared State Active
            </span>
          </div>
        </div>
      </header>

      {/* GLOBAL MAINTENANCE BANNER IF ENABLED BY SUPER ADMIN */}
      {platformSettings.maintenanceMode && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-center text-xs text-amber-300 flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            <strong>Platform Maintenance Mode Enabled by Super Admin:</strong> Public client bookings
            are paused while system upgrades are in progress.
          </span>
        </div>
      )}

      {/* =====================================================================
          PORTAL 1: USER CONSOLE (CLIENT-FACING)
      ===================================================================== */}
      {activePortal === 'USER' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Client Header Bar & Sub-Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
                Client Portal • Logged in as Sophia Martinez
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Discover & Book Premier Salons
              </h1>
            </div>
            <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 self-start">
              <button
                onClick={() => setUserTab('DISCOVER')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  userTab === 'DISCOVER'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Explore Salons ({filteredSalons.length})
              </button>
              <button
                onClick={() => setUserTab('DASHBOARD')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  userTab === 'DASHBOARD'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>My Appointments</span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-slate-800 text-indigo-300">
                  {
                    appointments.filter(
                      (a) => a.clientName === 'Sophia Martinez' && a.status === 'CONFIRMED'
                    ).length
                  }
                </span>
              </button>
            </div>
          </div>

          {userTab === 'DISCOVER' && (
            <>
              {/* Search & Filter Bar */}
              <div className="mt-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by salon name, neighborhood, or treatment..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="All">All Locations (NYC)</option>
                    <option value="New York">New York (SoHo)</option>
                    <option value="Brooklyn">Brooklyn</option>
                    <option value="Manhattan">Manhattan</option>
                    <option value="Queens">Queens</option>
                  </select>
                </div>
                <div>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value={0}>All Ratings</option>
                    <option value={4.5}>4.5+ Stars Only</option>
                    <option value={4.8}>4.8+ Top Rated</option>
                  </select>
                </div>

                {/* Category Pills */}
                <div className="md:col-span-4 flex items-center gap-2 overflow-x-auto pt-1">
                  {['All', 'Hair', 'Barber', 'Nails', 'Spa'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition shrink-0 ${
                        selectedCategory === cat
                          ? 'bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-sm'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Salon Grid */}
              {filteredSalons.length === 0 ? (
                <div className="mt-12 text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
                  <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-300">
                    No active salons match your filter
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Try clearing your search filters or check if the salon was suspended in the Admin
                    Console.
                  </p>
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSalons.map((salon) => {
                    const salonServices = services.filter(
                      (s) => s.salonId === salon.id && s.isActive
                    );
                    return (
                      <div
                        key={salon.id}
                        className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all flex flex-col group shadow-lg"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={salon.image}
                            alt={salon.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3 flex gap-1.5">
                            {salon.categories.map((cat) => (
                              <span
                                key={cat}
                                className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-950/80 backdrop-blur-md text-white border border-white/10"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/90 backdrop-blur-md text-amber-400 text-xs font-bold flex items-center gap-1 border border-amber-400/20">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{salon.rating}</span>
                            <span className="text-slate-400 font-normal">
                              ({salon.reviewsCount})
                            </span>
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition">
                              {salon.name}
                            </h3>
                            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                              <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                              {salon.address}
                            </p>
                            <p className="text-xs text-slate-300 mt-2.5 line-clamp-2">
                              {salon.description}
                            </p>

                            {/* Preview Top 2 Services */}
                            <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                              {salonServices.slice(0, 2).map((srv) => (
                                <div
                                  key={srv.id}
                                  className="flex items-center justify-between text-xs"
                                >
                                  <span className="text-slate-300 truncate pr-2">{srv.name}</span>
                                  <span className="text-indigo-400 font-semibold shrink-0">
                                    ${srv.price} • {srv.durationMin}m
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mt-5 pt-3 border-t border-slate-800 flex items-center gap-2">
                            <button
                              onClick={() => setViewingSalon(salon)}
                              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
                            >
                              View Menu & Staff
                            </button>
                            <button
                              disabled={platformSettings.maintenanceMode}
                              onClick={() => openBookingWizard(salon)}
                              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 text-xs font-semibold text-white transition shadow-md shadow-indigo-600/20"
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* USER DASHBOARD TAB: UPCOMING, COMPLETED, CANCELLED */}
          {userTab === 'DASHBOARD' && (
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                  <span className="text-xs text-slate-400">Client Account</span>
                  <p className="text-base font-bold text-white mt-0.5">Sophia Martinez</p>
                  <p className="text-xs text-indigo-400 mt-0.5">
                    sophia.m@example.com • +1 (917) 555-0199
                  </p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                  <span className="text-xs text-slate-400">Active Upcoming Bookings</span>
                  <p className="text-2xl font-bold text-emerald-400 mt-0.5">
                    {
                      appointments.filter(
                        (a) =>
                          a.clientName === 'Sophia Martinez' &&
                          ['CONFIRMED', 'IN_SERVICE'].includes(a.status)
                      ).length
                    }
                  </p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                  <span className="text-xs text-slate-400">WhatsApp & Email Reminders</span>
                  <p className="text-sm font-semibold text-indigo-300 mt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Opted-In (24h & 2h Prior)
                  </p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                  <h2 className="font-bold text-lg text-white">Your Appointment History</h2>
                  <span className="text-xs text-slate-400">
                    Real-time sync with Salon Calendar
                  </span>
                </div>
                <div className="divide-y divide-slate-800">
                  {appointments
                    .filter((a) => a.clientName === 'Sophia Martinez')
                    .map((apt) => {
                      const salon = salons.find((s) => s.id === apt.salonId);
                      const srv = services.find((s) => s.id === apt.serviceId);
                      const stf = staff.find((s) => s.id === apt.staffId);
                      return (
                        <div
                          key={apt.id}
                          className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/30 transition"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                                  apt.status === 'CONFIRMED'
                                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                    : apt.status === 'IN_SERVICE'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : apt.status === 'COMPLETED'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                }`}
                              >
                                {apt.status}
                              </span>
                              <span className="text-xs text-slate-400">Booking #{apt.id}</span>
                            </div>
                            <h3 className="text-base font-bold text-white">
                              {srv?.name} — <span className="text-indigo-400">${apt.price}</span>
                            </h3>
                            <p className="text-xs text-slate-300">
                              at <strong>{salon?.name}</strong> with{' '}
                              <span className="text-slate-200">{stf?.name}</span>
                            </p>
                            <p className="text-xs text-slate-400 flex items-center gap-3 pt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {apt.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-indigo-400" /> {apt.time}
                              </span>
                              <span className="text-slate-500">
                                (Policy: Free cancel up to {salon?.cancellationWindowHours || 24}h
                                prior)
                              </span>
                            </p>
                          </div>

                          {apt.status === 'CONFIRMED' && (
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => {
                                  setReschedulingApt(apt);
                                  setNewRescheduleDate(apt.date);
                                  setNewRescheduleTime(apt.time);
                                }}
                                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition flex items-center gap-1.5"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Reschedule
                              </button>
                              <button
                                onClick={() => handleCancelAppointment(apt)}
                                className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition flex items-center gap-1.5"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* SALON PROFILE MODAL (SERVICES, STAFF, HOURS) */}
          {viewingSalon && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl my-8">
                <div className="relative h-56">
                  <img
                    src={viewingSalon.image}
                    alt={viewingSalon.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  <button
                    onClick={() => setViewingSalon(null)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/80 text-white flex items-center justify-center hover:bg-slate-800"
                  >
                    ✕
                  </button>
                  <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{viewingSalon.name}</h2>
                      <p className="text-xs text-slate-300 flex items-center gap-2 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                        {viewingSalon.address} • Hours: {viewingSalon.hours}
                      </p>
                    </div>
                    <button
                      onClick={() => openBookingWizard(viewingSalon)}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg"
                    >
                      Launch Booking Wizard
                    </button>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[65vh] overflow-y-auto">
                  {/* Service Menu */}
                  <div className="md:col-span-2 space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400">
                      Service Menu
                    </h3>
                    {services
                      .filter((s) => s.salonId === viewingSalon.id && s.isActive)
                      .map((srv) => (
                        <div
                          key={srv.id}
                          className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                        >
                          <div>
                            <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                              {srv.category}
                            </span>
                            <h4 className="text-sm font-semibold text-white mt-1">{srv.name}</h4>
                            <p className="text-xs text-slate-400">{srv.durationMin} mins</p>
                          </div>
                          <div className="text-right">
                            <p className="text-base font-bold text-indigo-400">${srv.price}</p>
                            <button
                              onClick={() => openBookingWizard(viewingSalon, srv)}
                              className="mt-1 px-3 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-medium transition"
                            >
                              Select
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Staff Roster */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400">
                      Specialist Team
                    </h3>
                    {staff
                      .filter((st) => st.salonId === viewingSalon.id)
                      .map((st) => (
                        <div
                          key={st.id}
                          className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3"
                        >
                          <img
                            src={st.avatar}
                            alt={st.name}
                            className="w-11 h-11 rounded-full object-cover border border-indigo-500/40"
                          />
                          <div>
                            <h4 className="text-sm font-semibold text-white">{st.name}</h4>
                            <p className="text-xs text-slate-400">{st.title}</p>
                            <p className="text-[11px] text-amber-400 flex items-center gap-1 mt-0.5">
                              <Star className="w-3 h-3 fill-amber-400" /> {st.rating} • Break:{' '}
                              {st.breakTime}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INTERACTIVE 4-STEP BOOKING WIZARD MODAL */}
          {bookingModalSalon && (
            <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl">
                {/* Wizard Header */}
                <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                      Step {wizardStep} of 4 • {bookingModalSalon.name}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      {wizardStep === 1 && 'Select a Treatment Service'}
                      {wizardStep === 2 && 'Choose Your Stylist / Specialist'}
                      {wizardStep === 3 && 'Pick Date & Conflict-Free Time Slot'}
                      {wizardStep === 4 && 'Review & Confirm Appointment'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setBookingModalSalon(null)}
                    className="text-slate-400 hover:text-white text-sm px-2 py-1"
                  >
                    ✕
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 h-1.5">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-rose-500 h-1.5 transition-all duration-300"
                    style={{ width: `${(wizardStep / 4) * 100}%` }}
                  />
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  {/* STEP 1: SERVICE */}
                  {wizardStep === 1 && (
                    <div className="space-y-3">
                      {services
                        .filter((s) => s.salonId === bookingModalSalon.id && s.isActive)
                        .map((srv) => (
                          <button
                            key={srv.id}
                            onClick={() => {
                              setWizardService(srv);
                              setWizardStep(2);
                            }}
                            className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between ${
                              wizardService?.id === srv.id
                                ? 'bg-indigo-600/15 border-indigo-500 text-white'
                                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div>
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                                {srv.category}
                              </span>
                              <p className="font-bold text-sm text-white mt-1">{srv.name}</p>
                              <p className="text-xs text-slate-400 mt-0.5">
                                Duration: {srv.durationMin} minutes
                              </p>
                            </div>
                            <span className="text-base font-bold text-indigo-400">
                              ${srv.price}
                            </span>
                          </button>
                        ))}
                    </div>
                  )}

                  {/* STEP 2: STAFF */}
                  {wizardStep === 2 && (
                    <div className="space-y-3">
                      {staff
                        .filter((st) => st.salonId === bookingModalSalon.id)
                        .map((st) => (
                          <button
                            key={st.id}
                            disabled={!st.isWorking}
                            onClick={() => {
                              setWizardStaff(st);
                              setWizardStep(3);
                            }}
                            className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between ${
                              !st.isWorking
                                ? 'opacity-40 bg-slate-950 border-slate-800 cursor-not-allowed'
                                : wizardStaff?.id === st.id
                                ? 'bg-indigo-600/15 border-indigo-500'
                                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={st.avatar}
                                alt={st.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-bold text-sm text-white">{st.name}</p>
                                <p className="text-xs text-slate-400">{st.title}</p>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                  Daily Break: {st.breakTime}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-amber-400" /> {st.rating}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                {st.isWorking ? 'Available' : 'Off Duty'}
                              </span>
                            </div>
                          </button>
                        ))}
                    </div>
                  )}

                  {/* STEP 3: DATE & TIME */}
                  {wizardStep === 3 && wizardStaff && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                          Select Date
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { label: 'Today (May 15)', value: TODAY_STR },
                            { label: 'Tomorrow (May 16)', value: TOMORROW_STR }
                          ].map((d) => (
                            <button
                              key={d.value}
                              onClick={() => {
                                setWizardDate(d.value);
                                setWizardTime('');
                              }}
                              className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition ${
                                wizardDate === d.value
                                  ? 'bg-indigo-600 text-white border-indigo-500'
                                  : 'bg-slate-950 text-slate-300 border-slate-800'
                              }`}
                            >
                              {d.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
                          Available Slots for {wizardStaff.name}
                        </label>
                        <div className="grid grid-cols-3 gap-2.5">
                          {AVAILABLE_SLOTS.map((slot) => {
                            const check = isSlotBooked(wizardStaff.id, wizardDate, slot);
                            return (
                              <button
                                key={slot}
                                disabled={check.blocked}
                                onClick={() => setWizardTime(slot)}
                                className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition flex flex-col items-center ${
                                  check.blocked
                                    ? 'bg-slate-950/50 border-slate-800/60 text-slate-600 cursor-not-allowed'
                                    : wizardTime === slot
                                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                                    : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-indigo-500/50'
                                }`}
                              >
                                <span>{slot}</span>
                                {check.blocked && (
                                  <span className="text-[10px] text-rose-400/80 font-normal">
                                    {check.reason}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: CONFIRMATION */}
                  {wizardStep === 4 && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Salon:</span>
                          <span className="font-semibold text-white">{bookingModalSalon.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Service:</span>
                          <span className="font-semibold text-indigo-400">
                            {wizardService?.name} ({wizardService?.durationMin}m)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Specialist:</span>
                          <span className="font-semibold text-white">{wizardStaff?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Date & Time:</span>
                          <span className="font-semibold text-emerald-400">
                            {wizardDate} at {wizardTime}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-slate-800 flex justify-between text-base">
                          <span className="font-bold text-white">Total Due at Salon:</span>
                          <span className="font-bold text-white">${wizardService?.price}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">
                          Special Requests / Notes (Optional)
                        </label>
                        <input
                          type="text"
                          value={wizardNotes}
                          onChange={(e) => setWizardNotes(e.target.value)}
                          placeholder="Allergies, style preferences..."
                          className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                        />
                      </div>

                      <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 flex items-center gap-2.5">
                        <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>
                          Instant WhatsApp & Email confirmation + 24h automated reminder will be
                          dispatched to <strong>+1 (917) 555-0199</strong>.
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Wizard Footer Controls */}
                <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                  {wizardStep > 1 ? (
                    <button
                      onClick={() => setWizardStep((s) => s - 1)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                    >
                      ← Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {wizardStep < 4 ? (
                    <button
                      disabled={
                        (wizardStep === 1 && !wizardService) ||
                        (wizardStep === 2 && !wizardStaff) ||
                        (wizardStep === 3 && !wizardTime)
                      }
                      onClick={() => setWizardStep((s) => s + 1)}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-xs font-bold text-white"
                    >
                      Continue →
                    </button>
                  ) : (
                    <button
                      onClick={handleConfirmClientBooking}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-xs font-bold text-white shadow-lg"
                    >
                      Confirm & Send WhatsApp Alert
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* RESCHEDULE APPOINTMENT MODAL */}
          {reschedulingApt && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white">Reschedule Appointment</h3>
                  <button
                    onClick={() => setReschedulingApt(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Select a new conflict-free date and time slot for your appointment.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[TODAY_STR, TOMORROW_STR].map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        setNewRescheduleDate(d);
                        setNewRescheduleTime('');
                      }}
                      className={`py-2 rounded-xl text-xs font-bold border ${
                        newRescheduleDate === d
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {AVAILABLE_SLOTS.map((slot) => {
                    const check = isSlotBooked(
                      reschedulingApt.staffId,
                      newRescheduleDate,
                      slot,
                      reschedulingApt.id
                    );
                    return (
                      <button
                        key={slot}
                        disabled={check.blocked}
                        onClick={() => setNewRescheduleTime(slot)}
                        className={`py-2 rounded-xl text-xs font-semibold border ${
                          check.blocked
                            ? 'bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed'
                            : newRescheduleTime === slot
                            ? 'bg-indigo-600 border-indigo-400 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-300'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
                <button
                  disabled={!newRescheduleTime}
                  onClick={handleConfirmReschedule}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-xs font-bold text-white"
                >
                  Save New Time & Notify via WhatsApp
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* =====================================================================
          PORTAL 2: SALON CONSOLE (BUSINESS / VENDOR PORTAL)
      ===================================================================== */}
      {activePortal === 'SALON' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Vendor Top Control Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-rose-400">
                    Vendor Console • Tenant Workspace
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      activeVendorSalon.status === 'ACTIVE'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {activeVendorSalon.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <select
                    value={activeVendorSalonId}
                    onChange={(e) => setActiveVendorSalonId(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-lg font-bold text-white focus:outline-none focus:border-rose-500"
                  >
                    {salons.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.plan})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'CALENDAR', label: 'Calendar & Bookings', icon: Calendar },
                { id: 'SERVICES', label: 'Services & Pricing', icon: Scissors },
                { id: 'STAFF', label: 'Staff & Shifts', icon: Users },
                {
                  id: 'NOTIFICATIONS',
                  label: `WhatsApp/Email Log (${notifications.length})`,
                  icon: MessageSquare
                }
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSalonTab(t.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                      salonTab === t.id
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}

              <button
                onClick={() => {
                  const sList = services.filter((s) => s.salonId === activeVendorSalon.id);
                  const stList = staff.filter((s) => s.salonId === activeVendorSalon.id);
                  setWalkInForm({
                    clientName: '',
                    clientPhone: '',
                    serviceId: sList[0]?.id || '',
                    staffId: stList[0]?.id || '',
                    date: calendarDate,
                    time: '12:00'
                  });
                  setShowWalkInModal(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-rose-600 text-white text-xs font-bold shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>New Walk-In</span>
              </button>
            </div>
          </div>

          {/* TAB 1: CALENDAR & APPOINTMENT MANAGEMENT */}
          {salonTab === 'CALENDAR' && (
            <div className="mt-6 space-y-6">
              {/* Filters */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">Schedule Date:</span>
                  {[
                    { label: 'Today (May 15)', value: TODAY_STR },
                    { label: 'Tomorrow (May 16)', value: TOMORROW_STR }
                  ].map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setCalendarDate(d.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        calendarDate === d.value
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">Filter Specialist:</span>
                  <select
                    value={calendarStaffFilter}
                    onChange={(e) => setCalendarStaffFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                  >
                    <option value="ALL">All Salon Staff</option>
                    {staff
                      .filter((st) => st.salonId === activeVendorSalon.id)
                      .map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.name} ({st.title})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Appointments List & Status Pipelines */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">
                    Appointments for {calendarDate}
                  </h3>
                  <span className="text-xs text-slate-400">
                    Click status buttons to trigger instant WhatsApp/Email client alerts
                  </span>
                </div>

                <div className="divide-y divide-slate-800">
                  {appointments
                    .filter(
                      (a) =>
                        a.salonId === activeVendorSalon.id &&
                        a.date === calendarDate &&
                        (calendarStaffFilter === 'ALL' || a.staffId === calendarStaffFilter)
                    )
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((apt) => {
                      const srv = services.find((s) => s.id === apt.serviceId);
                      const stf = staff.find((s) => s.id === apt.staffId);
                      return (
                        <div
                          key={apt.id}
                          className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-800/20"
                        >
                          <div className="flex items-start gap-4">
                            <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[72px]">
                              <span className="block text-sm font-bold text-rose-400">
                                {apt.time}
                              </span>
                              <span className="block text-[10px] text-slate-500">
                                {srv?.durationMin}m
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-base text-white">
                                  {apt.clientName}
                                </span>
                                {apt.isWalkIn && (
                                  <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 text-[10px] font-bold">
                                    WALK-IN
                                  </span>
                                )}
                                <span className="text-xs text-slate-400">{apt.clientPhone}</span>
                              </div>
                              <p className="text-sm text-indigo-300 font-medium mt-0.5">
                                {srv?.name} • <span className="text-white">${apt.price}</span>
                              </p>
                              <p className="text-xs text-slate-400 mt-0.5">
                                Assigned to: <strong className="text-slate-200">{stf?.name}</strong>
                                {apt.notes && ` • Note: "${apt.notes}"`}
                              </p>
                            </div>
                          </div>

                          {/* Interactive Status Transitions */}
                          <div className="flex flex-wrap items-center gap-2">
                            {['CONFIRMED', 'IN_SERVICE', 'COMPLETED', 'CANCELLED'].map((st) => (
                              <button
                                key={st}
                                onClick={() => handleUpdateAptStatus(apt, st)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                  apt.status === st
                                    ? st === 'CONFIRMED'
                                      ? 'bg-indigo-600 text-white'
                                      : st === 'IN_SERVICE'
                                      ? 'bg-amber-500 text-slate-950'
                                      : st === 'COMPLETED'
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-rose-600 text-white'
                                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                                }`}
                              >
                                {st.replace('_', ' ')}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                  {appointments.filter(
                    (a) =>
                      a.salonId === activeVendorSalon.id &&
                      a.date === calendarDate &&
                      (calendarStaffFilter === 'ALL' || a.staffId === calendarStaffFilter)
                  ).length === 0 && (
                    <div className="p-12 text-center text-slate-500 text-sm">
                      No appointments scheduled for this date/staff filter. Use "New Walk-In" or
                      book from the User Console!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SERVICES MENU MANAGEMENT */}
          {salonTab === 'SERVICES' && (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-4 bg-slate-950 border-b border-slate-800">
                  <h3 className="font-bold text-sm text-white">
                    Active Service Catalog ({activeVendorSalon.name})
                  </h3>
                </div>
                <div className="divide-y divide-slate-800">
                  {services
                    .filter((s) => s.salonId === activeVendorSalon.id)
                    .map((srv) => (
                      <div
                        key={srv.id}
                        className="p-4 flex items-center justify-between gap-4"
                      >
                        <div>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                            {srv.category}
                          </span>
                          <h4 className="font-bold text-sm text-white mt-1">{srv.name}</h4>
                          <p className="text-xs text-slate-400">
                            Duration: {srv.durationMin} mins • Price: ${srv.price}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            setServices((prev) =>
                              prev.map((item) =>
                                item.id === srv.id
                                  ? { ...item, isActive: !item.isActive }
                                  : item
                              )
                            )
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                            srv.isActive
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {srv.isActive ? 'Active on Menu' : 'Hidden'}
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {/* Add Service Form */}
              <form
                onSubmit={handleAddService}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 h-fit"
              >
                <h3 className="font-bold text-base text-white">Add New Treatment</h3>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Service Name</label>
                  <input
                    type="text"
                    required
                    value={newServiceForm.name}
                    onChange={(e) =>
                      setNewServiceForm({ ...newServiceForm, name: e.target.value })
                    }
                    placeholder="e.g., Keratin Glass Hair Ritual"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Category</label>
                    <select
                      value={newServiceForm.category}
                      onChange={(e) =>
                        setNewServiceForm({ ...newServiceForm, category: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                    >
                      <option value="Hair">Hair</option>
                      <option value="Spa">Spa</option>
                      <option value="Nails">Nails</option>
                      <option value="Barber">Barber</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Duration (Min)</label>
                    <input
                      type="number"
                      value={newServiceForm.durationMin}
                      onChange={(e) =>
                        setNewServiceForm({ ...newServiceForm, durationMin: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    value={newServiceForm.price}
                    onChange={(e) =>
                      setNewServiceForm({ ...newServiceForm, price: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  + Publish to Client Menu
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: STAFF & SHIFT MANAGEMENT */}
          {salonTab === 'STAFF' && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {staff
                .filter((st) => st.salonId === activeVendorSalon.id)
                .map((st) => (
                  <div
                    key={st.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={st.avatar}
                        alt={st.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-rose-500/40"
                      />
                      <div>
                        <h4 className="font-bold text-base text-white">{st.name}</h4>
                        <p className="text-xs text-slate-400">{st.title}</p>
                        <p className="text-xs text-amber-400 mt-0.5">★ {st.rating} Rating</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        Daily Break Slot: <strong className="text-white">{st.breakTime}</strong>
                      </span>
                      <button
                        onClick={() =>
                          setStaff((prev) =>
                            prev.map((item) =>
                              item.id === st.id
                                ? { ...item, isWorking: !item.isWorking }
                                : item
                            )
                          )
                        }
                        className={`px-3 py-1.5 rounded-lg font-bold ${
                          st.isWorking
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {st.isWorking ? 'On Shift' : 'Off Duty'}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* TAB 4: AUTOMATED WHATSAPP & EMAIL NOTIFICATION LOG */}
          {salonTab === 'NOTIFICATIONS' && (
            <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Twilio WhatsApp & Resend Email Dispatch Feed
                  </h3>
                  <p className="text-xs text-slate-400">
                    Real-time log of instant confirmations, 24h/2h cron reminders, and status
                    updates
                  </p>
                </div>
                <button
                  onClick={() =>
                    dispatchNotification(
                      'WHATSAPP',
                      '+1 (917) 555-0199',
                      activeVendorSalon.name,
                      `Automated 2h Reminder: We look forward to seeing you soon at ${activeVendorSalon.name}!`,
                      'CRON_2H_REMINDER'
                    )
                  }
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white"
                >
                  Trigger Test 2h Cron Reminder
                </button>
              </div>
              <div className="divide-y divide-slate-800">
                {notifications.map((n) => (
                  <div key={n.id} className="p-4 flex items-start gap-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase shrink-0 ${
                        n.channel === 'WHATSAPP'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {n.channel}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>
                          To: <strong className="text-slate-200">{n.recipient}</strong> •{' '}
                          {n.salonName}
                        </span>
                        <span>{n.timestamp}</span>
                      </div>
                      <p className="text-sm text-slate-200 mt-1">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WALK-IN CREATION MODAL */}
          {showWalkInModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <form
                onSubmit={handleCreateWalkIn}
                className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">New Walk-In / Phone Booking</h3>
                  <button
                    type="button"
                    onClick={() => setShowWalkInModal(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Client Name</label>
                  <input
                    type="text"
                    required
                    value={walkInForm.clientName}
                    onChange={(e) =>
                      setWalkInForm({ ...walkInForm, clientName: e.target.value })
                    }
                    placeholder="e.g., Jordan Taylor"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    WhatsApp Phone Number
                  </label>
                  <input
                    type="text"
                    value={walkInForm.clientPhone}
                    onChange={(e) =>
                      setWalkInForm({ ...walkInForm, clientPhone: e.target.value })
                    }
                    placeholder="+1 (555) 234-5678"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Service</label>
                  <select
                    value={walkInForm.serviceId}
                    onChange={(e) =>
                      setWalkInForm({ ...walkInForm, serviceId: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    {services
                      .filter((s) => s.salonId === activeVendorSalon.id)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} (${s.price})
                        </option>
                      ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Assign Staff</label>
                    <select
                      value={walkInForm.staffId}
                      onChange={(e) =>
                        setWalkInForm({ ...walkInForm, staffId: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                    >
                      {staff
                        .filter((st) => st.salonId === activeVendorSalon.id)
                        .map((st) => (
                          <option key={st.id} value={st.id}>
                            {st.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Time Slot</label>
                    <select
                      value={walkInForm.time}
                      onChange={(e) => setWalkInForm({ ...walkInForm, time: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                    >
                      {AVAILABLE_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-rose-600 text-white text-xs font-bold"
                >
                  Add to Calendar & Send WhatsApp Confirmation
                </button>
              </form>
            </div>
          )}
        </main>
      )}

      {/* =====================================================================
          PORTAL 3: ADMIN CONSOLE (SUPER ADMIN PORTAL)
      ===================================================================== */}
      {activePortal === 'ADMIN' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                Super Admin Portal • Global SaaS Governance
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Tenant Subscriptions, Stripe Billing & Platform KPIs
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setPlatformSettings((p) => ({ ...p, maintenanceMode: !p.maintenanceMode }))
                }
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                  platformSettings.maintenanceMode
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {platformSettings.maintenanceMode
                  ? 'Disable Maintenance Mode'
                  : 'Enable Maintenance Mode'}
              </button>
            </div>
          </div>

          {/* KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Monthly Recurring Revenue (MRR)</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-bold text-white mt-2">${adminMetrics.totalMrr}</p>
              <span className="text-xs text-emerald-400 mt-1 inline-block">
                +18.4% vs last month (Stripe Live)
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Active Verified Salons</span>
                <Building2 className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-3xl font-bold text-white mt-2">
                {adminMetrics.activeCount}{' '}
                <span className="text-sm font-normal text-slate-400">/ {salons.length} total</span>
              </p>
              <span className="text-xs text-amber-400 mt-1 inline-block">
                {adminMetrics.pendingCount} awaiting approval
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Total Platform Bookings GMV</span>
                <TrendingUp className="w-4 h-4 text-rose-400" />
              </div>
              <p className="text-3xl font-bold text-white mt-2">
                ${adminMetrics.totalGrossBookings}
              </p>
              <span className="text-xs text-slate-400 mt-1 inline-block">
                Across {appointments.length} total appointments
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Platform Commission ({platformSettings.commissionRate}%)</span>
                <Activity className="w-4 h-4 text-violet-400" />
              </div>
              <p className="text-3xl font-bold text-emerald-400 mt-2">
                $
                {(
                  (adminMetrics.totalGrossBookings * platformSettings.commissionRate) /
                  100
                ).toFixed(2)}
              </p>
              <span className="text-xs text-slate-400 mt-1 inline-block">
                Global Tax Rate: {platformSettings.taxRate}%
              </span>
            </div>
          </div>

          {/* SALON & SUBSCRIPTION MANAGEMENT TABLE */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-white">
                  Multi-Tenant Salon Directory & Access Control
                </h2>
                <p className="text-xs text-slate-400">
                  Approving or suspending a salon immediately updates the User Console discovery
                  list
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-bold uppercase text-slate-400 bg-slate-950/50">
                    <th className="py-3.5 px-4">Salon Tenant</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Subscription Tier</th>
                    <th className="py-3.5 px-4">MRR</th>
                    <th className="py-3.5 px-4">Stripe Webhook Simulator</th>
                    <th className="py-3.5 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-xs">
                  {salons.map((salon) => (
                    <tr key={salon.id} className="hover:bg-slate-800/30">
                      <td className="py-4 px-4">
                        <p className="font-bold text-sm text-white">{salon.name}</p>
                        <p className="text-slate-400">
                          {salon.city} • {salon.email}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            salon.status === 'ACTIVE'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : salon.status === 'PENDING_APPROVAL'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {salon.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={salon.plan}
                          onChange={(e) => handleSalonPlanChange(salon.id, e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        >
                          <option value="Trial">Free Trial ($0)</option>
                          <option value="Pro Monthly">Pro Monthly ($99/mo)</option>
                          <option value="Enterprise Annual">Enterprise Annual ($199/mo)</option>
                        </select>
                      </td>
                      <td className="py-4 px-4 font-bold text-white">
                        ${salon.status === 'ACTIVE' ? salon.mrr : 0}/mo
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => simulateStripeWebhook('invoice.paid', salon.id)}
                            className="px-2.5 py-1 rounded bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold"
                          >
                            ⚡ invoice.paid
                          </button>
                          <button
                            onClick={() =>
                              simulateStripeWebhook('customer.subscription.deleted', salon.id)
                            }
                            className="px-2.5 py-1 rounded bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-[11px] font-semibold"
                          >
                            ⚡ payment_failed
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        {salon.status === 'PENDING_APPROVAL' && (
                          <>
                            <button
                              onClick={() => handleSalonStatusChange(salon.id, 'ACTIVE')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleSalonStatusChange(salon.id, 'REJECTED')}
                              className="px-3 py-1.5 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white font-bold"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {salon.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleSalonStatusChange(salon.id, 'SUSPENDED')}
                            className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600 hover:text-white font-semibold"
                          >
                            Suspend Tenant
                          </button>
                        )}
                        {(salon.status === 'SUSPENDED' || salon.status === 'REJECTED') && (
                          <button
                            onClick={() => handleSalonStatusChange(salon.id, 'ACTIVE')}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                          >
                            Reactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* STRIPE INVOICES FEED & GLOBAL PLATFORM SETTINGS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stripe Billing Feed */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-400" />
                  Stripe Subscription Invoices & Payouts Ledger
                </h3>
                <span className="text-xs text-slate-400">Webhook Event Log</span>
              </div>
              <div className="divide-y divide-slate-800">
                {invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-4 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono text-slate-400">{inv.id}</span>
                      <p className="font-bold text-sm text-white mt-0.5">{inv.salonName}</p>
                      <p className="text-slate-400">
                        Plan: {inv.plan} • {inv.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">${inv.amount}.00 USD</p>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 rounded uppercase text-[10px] font-bold ${
                          inv.status === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : inv.status === 'past_due'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Global Platform Configuration */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                Global Platform Settings
              </h3>
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Platform Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={platformSettings.taxRate}
                  onChange={(e) =>
                    setPlatformSettings({
                      ...platformSettings,
                      taxRate: Number(e.target.value)
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  SaaS Booking Commission (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={platformSettings.commissionRate}
                  onChange={(e) =>
                    setPlatformSettings({
                      ...platformSettings,
                      commissionRate: Number(e.target.value)
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Meta WhatsApp Cloud API</span>
                  <span className="text-emerald-400 font-semibold">Connected ✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Resend Transactional Email</span>
                  <span className="text-emerald-400 font-semibold">Connected ✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Stripe Billing Webhooks</span>
                  <span className="text-emerald-400 font-semibold">Listening ✓</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}