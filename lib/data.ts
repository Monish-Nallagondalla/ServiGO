// ─── CAR TIERS ───────────────────────────────────────────────────────────────
export type CarTier = 'standard' | 'premium' | 'luxury' | 'ultra';

export const CAR_TIER_CONFIG: Record<CarTier, {
  label: string;
  multiplier: number;
  sourcing: string;
  leadTime: string;
  bookingFlow: 'instant' | 'quote';
  surcharge: number;
}> = {
  standard: {
    label: 'Standard',
    multiplier: 1,
    sourcing: 'Local OEM distributor',
    leadTime: 'Same day',
    bookingFlow: 'instant',
    surcharge: 0,
  },
  premium: {
    label: 'Premium',
    multiplier: 2.2,
    sourcing: 'Regional OEM depot',
    leadTime: '1–2 days',
    bookingFlow: 'instant',
    surcharge: 0.15,
  },
  luxury: {
    label: 'Luxury',
    multiplier: 5,
    sourcing: 'Authorized importer',
    leadTime: '3–7 days',
    bookingFlow: 'quote',
    surcharge: 0.30,
  },
  ultra: {
    label: 'Ultra Luxury',
    multiplier: 10,
    sourcing: 'Direct OEM import',
    leadTime: '7–14 days',
    bookingFlow: 'quote',
    surcharge: 0.45,
  },
};

// ─── CARS ────────────────────────────────────────────────────────────────────
export const CARS: { make: string; model: string; tier: CarTier }[] = [
  { make: 'Maruti', model: 'Swift', tier: 'standard' },
  { make: 'Maruti', model: 'Baleno', tier: 'standard' },
  { make: 'Maruti', model: 'Ertiga', tier: 'standard' },
  { make: 'Hyundai', model: 'i20', tier: 'standard' },
  { make: 'Hyundai', model: 'Creta', tier: 'standard' },
  { make: 'Honda', model: 'City', tier: 'standard' },
  { make: 'Tata', model: 'Nexon', tier: 'standard' },
  { make: 'Tata', model: 'Punch', tier: 'standard' },
  { make: 'Kia', model: 'Sonet', tier: 'standard' },
  { make: 'Toyota', model: 'Fortuner', tier: 'premium' },
  { make: 'Toyota', model: 'Innova Crysta', tier: 'premium' },
  { make: 'MG', model: 'Hector', tier: 'premium' },
  { make: 'Skoda', model: 'Octavia', tier: 'premium' },
  { make: 'Jeep', model: 'Compass', tier: 'premium' },
  { make: 'BMW', model: '3 Series', tier: 'luxury' },
  { make: 'BMW', model: '5 Series', tier: 'luxury' },
  { make: 'Mercedes-Benz', model: 'C-Class', tier: 'luxury' },
  { make: 'Mercedes-Benz', model: 'E-Class', tier: 'luxury' },
  { make: 'Audi', model: 'A4', tier: 'luxury' },
  { make: 'Audi', model: 'Q5', tier: 'luxury' },
  { make: 'Porsche', model: 'Cayenne', tier: 'ultra' },
  { make: 'Land Rover', model: 'Defender', tier: 'ultra' },
  { make: 'Lexus', model: 'ES 300h', tier: 'ultra' },
];

// ─── SERVICES ─────────────────────────────────────────────────────────────────
export type ServiceType = 'engine_oil' | 'air_filter' | 'ac_filter' | 'brake_pad';

export const SERVICES: {
  id: ServiceType;
  name: string;
  description: string;
  basePartCost: number;
  laborCost: number;
  icon: string;
  duration: string;
}[] = [
  {
    id: 'engine_oil',
    name: 'Engine Oil Change',
    description: 'Full synthetic or semi-synthetic oil replacement with OEM-grade filter',
    basePartCost: 800,
    laborCost: 300,
    icon: '🛢️',
    duration: '45 min',
  },
  {
    id: 'air_filter',
    name: 'Air Filter Replacement',
    description: 'Engine air filter replacement to maintain fuel efficiency and performance',
    basePartCost: 350,
    laborCost: 150,
    icon: '💨',
    duration: '20 min',
  },
  {
    id: 'ac_filter',
    name: 'AC Cabin Filter',
    description: 'Cabin air filter for cleaner, allergen-free air inside your car',
    basePartCost: 400,
    laborCost: 150,
    icon: '❄️',
    duration: '20 min',
  },
  {
    id: 'brake_pad',
    name: 'Brake Pad Replacement',
    description: 'OEM brake pad replacement for safe, reliable stopping performance',
    basePartCost: 1200,
    laborCost: 500,
    icon: '🔧',
    duration: '60 min',
  },
];

// ─── PRICING ENGINE ───────────────────────────────────────────────────────────
export const PLATFORM_FEE = 100;
export const GST_RATE = 0.18;

export function calculatePrice(
  tier: CarTier,
  selectedServices: ServiceType[]
): {
  lineItems: { name: string; partCost: number; labor: number; subtotal: number }[];
  partsTotal: number;
  laborTotal: number;
  surchargeAmount: number;
  platformFee: number;
  gst: number;
  total: number;
} {
  const config = CAR_TIER_CONFIG[tier];
  const lineItems = selectedServices.map((sid) => {
    const svc = SERVICES.find((s) => s.id === sid)!;
    const partCost = Math.round(svc.basePartCost * config.multiplier);
    const labor = svc.laborCost; // flat across tiers
    return { name: svc.name, partCost, labor, subtotal: partCost + labor };
  });

  const partsTotal = lineItems.reduce((s, l) => s + l.partCost, 0);
  const laborTotal = lineItems.reduce((s, l) => s + l.labor, 0);
  const surchargeAmount = Math.round(partsTotal * config.surcharge);
  const preGst = partsTotal + laborTotal + surchargeAmount + PLATFORM_FEE;
  const gst = Math.round(preGst * GST_RATE);
  const total = preGst + gst;

  return { lineItems, partsTotal, laborTotal, surchargeAmount, platformFee: PLATFORM_FEE, gst, total };
}

// ─── BANGALORE ZONES ─────────────────────────────────────────────────────────
export const ZONES = [
  { id: 'z1', name: 'Koramangala', partnerCount: 12, lat: 12.9352, lng: 77.6245 },
  { id: 'z2', name: 'Whitefield', partnerCount: 9, lat: 12.9698, lng: 77.7499 },
  { id: 'z3', name: 'Indiranagar', partnerCount: 8, lat: 12.9784, lng: 77.6408 },
  { id: 'z4', name: 'HSR Layout', partnerCount: 11, lat: 12.9116, lng: 77.6389 },
  { id: 'z5', name: 'Jayanagar', partnerCount: 7, lat: 12.9308, lng: 77.5831 },
  { id: 'z6', name: 'Marathahalli', partnerCount: 10, lat: 12.9591, lng: 77.6974 },
  { id: 'z7', name: 'Electronic City', partnerCount: 6, lat: 12.8399, lng: 77.6770 },
  { id: 'z8', name: 'Malleshwaram', partnerCount: 5, lat: 13.0035, lng: 77.5710 },
];

// ─── SERVICE PARTNERS ─────────────────────────────────────────────────────────
export const PARTNERS = [
  { id: 'p1', name: 'Ravi Kumar', zone: 'Koramangala', rating: 4.9, jobs: 312, status: 'available', phone: '+91 98450 11234', certified: ['standard', 'premium'] },
  { id: 'p2', name: 'Suresh Babu', zone: 'Whitefield', rating: 4.7, jobs: 198, status: 'on-job', phone: '+91 98450 22345', certified: ['standard'] },
  { id: 'p3', name: 'Anand Raj', zone: 'Indiranagar', rating: 4.8, jobs: 276, status: 'available', phone: '+91 98450 33456', certified: ['standard', 'premium', 'luxury'] },
  { id: 'p4', name: 'Deepak Nair', zone: 'HSR Layout', rating: 4.6, jobs: 145, status: 'available', phone: '+91 98450 44567', certified: ['standard', 'premium'] },
  { id: 'p5', name: 'Vinod Sharma', zone: 'Jayanagar', rating: 4.9, jobs: 421, status: 'on-job', phone: '+91 98450 55678', certified: ['standard', 'premium', 'luxury'] },
  { id: 'p6', name: 'Kiran Shetty', zone: 'Marathahalli', rating: 4.5, jobs: 89, status: 'available', phone: '+91 98450 66789', certified: ['standard'] },
  { id: 'p7', name: 'Manoj Pillai', zone: 'Electronic City', rating: 4.7, jobs: 203, status: 'available', phone: '+91 98450 77890', certified: ['standard', 'premium'] },
  { id: 'p8', name: 'Sanjay Gowda', zone: 'Malleshwaram', rating: 4.8, jobs: 167, status: 'break', phone: '+91 98450 88901', certified: ['standard', 'premium', 'luxury'] },
];

// ─── BOOKINGS ─────────────────────────────────────────────────────────────────
export type BookingStatus = 'pending' | 'assigned' | 'parts-ready' | 'en-route' | 'in-progress' | 'completed' | 'quote-requested';

export const BOOKINGS: {
  id: string;
  customerName: string;
  persona: string;
  car: string;
  tier: CarTier;
  zone: string;
  services: string[];
  status: BookingStatus;
  partner: string | null;
  slot: string;
  total: number;
  paymentMethod: string;
}[] = [
  { id: 'BK001', customerName: 'Rahul Mehta', persona: 'Deadline Driver', car: 'Hyundai Creta', tier: 'standard', zone: 'Koramangala', services: ['Engine Oil', 'Air Filter'], status: 'en-route', partner: 'Ravi Kumar', slot: 'Today, 3:00 PM', total: 1892, paymentMethod: 'UPI' },
  { id: 'BK002', customerName: 'Harshi Reddy', persona: 'Time-Starved Pro', car: 'Maruti Baleno', tier: 'standard', zone: 'Indiranagar', services: ['AC Filter'], status: 'completed', partner: 'Anand Raj', slot: 'Today, 11:00 AM', total: 768, paymentMethod: 'Card' },
  { id: 'BK003', customerName: 'Vikram Patel', persona: 'Car Enthusiast', car: 'BMW 5 Series', tier: 'luxury', zone: 'Whitefield', services: ['Engine Oil', 'Brake Pad'], status: 'quote-requested', partner: null, slot: 'Pending confirmation', total: 0, paymentMethod: 'TBD' },
  { id: 'BK004', customerName: 'Meera Singh', persona: 'First-Time Owner', car: 'Tata Nexon', tier: 'standard', zone: 'HSR Layout', services: ['Engine Oil', 'Air Filter', 'AC Filter'], status: 'assigned', partner: 'Deepak Nair', slot: 'Today, 5:00 PM', total: 2340, paymentMethod: 'Cash' },
  { id: 'BK005', customerName: 'Rajan Enterprises', persona: 'Fleet Manager', car: 'Toyota Fortuner ×3', tier: 'premium', zone: 'Electronic City', services: ['Engine Oil', 'Air Filter'], status: 'parts-ready', partner: 'Manoj Pillai', slot: 'Tomorrow, 9:00 AM', total: 14760, paymentMethod: 'Invoice' },
  { id: 'BK006', customerName: 'Priya Iyer', persona: 'Time-Starved Pro', car: 'Honda City', tier: 'standard', zone: 'Jayanagar', services: ['Brake Pad'], status: 'pending', partner: null, slot: 'Today, 7:00 PM', total: 2124, paymentMethod: 'UPI' },
];

// ─── INVENTORY ────────────────────────────────────────────────────────────────
export const INVENTORY = [
  { id: 'INV001', part: 'Engine Oil 5W-30 (Standard)', sku: 'EO-STD-5W30', tier: 'standard', stock: 48, reorderAt: 10, unitCost: 800 },
  { id: 'INV002', part: 'Air Filter — Hatchback/Sedan', sku: 'AF-STD-HB', tier: 'standard', stock: 35, reorderAt: 8, unitCost: 350 },
  { id: 'INV003', part: 'AC Cabin Filter — Universal', sku: 'ACF-UNI', tier: 'standard', stock: 42, reorderAt: 10, unitCost: 400 },
  { id: 'INV004', part: 'Brake Pad Set — Standard', sku: 'BP-STD-SET', tier: 'standard', stock: 22, reorderAt: 5, unitCost: 1200 },
  { id: 'INV005', part: 'Engine Oil 0W-40 (Premium)', sku: 'EO-PRM-0W40', tier: 'premium', stock: 14, reorderAt: 5, unitCost: 1760 },
  { id: 'INV006', part: 'Air Filter — SUV Premium', sku: 'AF-PRM-SUV', tier: 'premium', stock: 9, reorderAt: 3, unitCost: 770 },
  { id: 'INV007', part: 'Engine Oil 0W-20 BMW Spec', sku: 'EO-LUX-BMW', tier: 'luxury', stock: 4, reorderAt: 2, unitCost: 4000 },
  { id: 'INV008', part: 'Brake Pad — Mercedes OEM', sku: 'BP-LUX-MB', tier: 'luxury', stock: 2, reorderAt: 1, unitCost: 6000 },
];
