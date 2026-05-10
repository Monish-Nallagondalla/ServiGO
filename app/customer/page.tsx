'use client';
import { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, MapPin, Clock, Shield, Star, ChevronDown, Zap, FileText } from 'lucide-react';
import { CARS, SERVICES, calculatePrice, CAR_TIER_CONFIG, CarTier, ServiceType } from '@/lib/data';
import Link from 'next/link';

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface BookingState {
  make: string;
  model: string;
  year: string;
  km: string;
  tier: CarTier | null;
  services: ServiceType[];
  zone: string;
  slot: string;
  address: string;
  payment: string;
  name: string;
  phone: string;
}

const ZONES = ['Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout', 'Jayanagar', 'Marathahalli', 'Electronic City', 'Malleshwaram'];
const SLOTS = ['Today, 9:00 AM', 'Today, 11:00 AM', 'Today, 2:00 PM', 'Today, 4:00 PM', 'Today, 6:00 PM', 'Tomorrow, 9:00 AM', 'Tomorrow, 11:00 AM', 'Tomorrow, 2:00 PM'];
const YEARS = ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016'];
const MAKES = [...new Set(CARS.map(c => c.make))];
const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI / GPay / PhonePe', icon: '📱' },
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'cash', label: 'Cash on Completion', icon: '💵' },
  { id: 'invoice', label: 'Corporate Invoice (GST)', icon: '🧾' },
];

// ─── STEP INDICATOR ───────────────────────────────────────────────────────────
function StepBar({ current }: { current: number }) {
  const steps = ['Your Profile', 'Services', 'Schedule', 'Confirm'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <div style={{
              width: '2rem', height: '2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: i < current ? 'var(--accent)' : i === current ? 'var(--accent)' : 'var(--bg-card)',
              border: i === current ? '2px solid var(--accent)' : i < current ? 'none' : '1px solid var(--border)',
              color: i <= current ? '#0B3B35' : 'var(--text-muted)',
              fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
            }}>
              {i < current ? <Check size={14} /> : i + 1}
            </div>
            <span style={{ fontSize: '0.8rem', color: i === current ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: i === current ? 600 : 400, whiteSpace: 'nowrap' }}>
              {s}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: 1, height: '1px', background: i < current ? 'var(--accent)' : 'var(--border)', margin: '0 0.75rem', minWidth: '1rem' }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── STEP 1: PROFILE ─────────────────────────────────────────────────────────
function Step1({ state, setState }: { state: BookingState; setState: (s: BookingState) => void }) {
  const models = CARS.filter(c => c.make === state.make).map(c => c.model);
  const selectedCar = CARS.find(c => c.make === state.make && c.model === state.model);

  return (
    <div>
      <h2 className="font-display" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Tell us about your car</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>We'll map the right parts and services instantly</p>

      {/* Name + Phone */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.75rem' }}>
        <div>
          <label className="label">Your Name</label>
          <input className="input" placeholder="Rahul Mehta" value={state.name}
            onChange={e => setState({ ...state, name: e.target.value })} />
        </div>
        <div>
          <label className="label">Phone Number</label>
          <input className="input" placeholder="+91 98XXX XXXXX" value={state.phone}
            onChange={e => setState({ ...state, phone: e.target.value })} />
        </div>
      </div>

      {/* Car details */}
      <div style={{ marginBottom: '0.5rem' }}>
        <label className="label">Your Car</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
          <div>
            <label className="label" style={{ fontSize: '0.7rem' }}>Make</label>
            <div style={{ position: 'relative' }}>
              <select className="select" value={state.make}
                onChange={e => setState({ ...state, make: e.target.value, model: '', tier: null })}>
                <option value="">Select make</option>
                {MAKES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            </div>
          </div>
          <div>
            <label className="label" style={{ fontSize: '0.7rem' }}>Model</label>
            <div style={{ position: 'relative' }}>
              <select className="select" value={state.model} disabled={!state.make}
                onChange={e => {
                  const car = CARS.find(c => c.make === state.make && c.model === e.target.value);
                  setState({ ...state, model: e.target.value, tier: car?.tier ?? null });
                }}>
                <option value="">Select model</option>
                {models.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            </div>
          </div>
          <div>
            <label className="label" style={{ fontSize: '0.7rem' }}>Year</label>
            <div style={{ position: 'relative' }}>
              <select className="select" value={state.year} onChange={e => setState({ ...state, year: e.target.value })}>
                <option value="">Select year</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            </div>
          </div>
          <div>
            <label className="label" style={{ fontSize: '0.7rem' }}>Current KM</label>
            <input className="input" placeholder="e.g. 32000" value={state.km}
              onChange={e => setState({ ...state, km: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Tier badge */}
      {selectedCar && (
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className={`badge ${selectedCar.tier === 'standard' ? 'badge-accent' : selectedCar.tier === 'premium' ? 'badge-warning' : 'badge-danger'}`}>
            {CAR_TIER_CONFIG[selectedCar.tier].label} Tier
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {selectedCar.tier === 'luxury' || selectedCar.tier === 'ultra'
              ? '⚠️ Parts on-order — quote flow applies'
              : `✓ Instant booking available · Parts: ${CAR_TIER_CONFIG[selectedCar.tier].sourcing}`}
          </span>
        </div>
      )}

      <div className="card" style={{ marginTop: '1.5rem', background: 'rgba(200,230,80,0.06)', borderColor: 'rgba(200,230,80,0.2)' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          💡 <strong style={{ color: 'var(--text-primary)' }}>Not sure what your car needs?</strong> Enter your KM reading — we'll recommend the right services on the next screen. No technical knowledge required.
        </p>
      </div>
    </div>
  );
}

// ─── STEP 2: SERVICES ─────────────────────────────────────────────────────────
function Step2({ state, setState }: { state: BookingState; setState: (s: BookingState) => void }) {
  const tier = state.tier ?? 'standard';
  const config = CAR_TIER_CONFIG[tier];
  const pricing = state.services.length > 0 ? calculatePrice(tier, state.services) : null;
  const kmNum = parseInt(state.km || '0');

  const getRecommendation = (serviceId: ServiceType): string | null => {
    if (kmNum >= 10000 && serviceId === 'engine_oil') return 'Recommended';
    if (kmNum >= 15000 && serviceId === 'air_filter') return 'Due soon';
    if (kmNum >= 20000 && serviceId === 'ac_filter') return 'Recommended';
    if (kmNum >= 30000 && serviceId === 'brake_pad') return 'Check advised';
    return null;
  };

  const toggleService = (id: ServiceType) => {
    setState({
      ...state,
      services: state.services.includes(id)
        ? state.services.filter(s => s !== id)
        : [...state.services, id],
    });
  };

  return (
    <div>
      <h2 className="font-display" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Choose your services</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
        {state.make} {state.model} · {state.km ? `${parseInt(state.km).toLocaleString()} KM` : ''}
      </p>

      {/* Tier info bar */}
      <div className="card" style={{
        marginBottom: '1.5rem',
        background: tier === 'luxury' || tier === 'ultra' ? 'rgba(255,107,107,0.06)' : 'rgba(200,230,80,0.06)',
        borderColor: tier === 'luxury' || tier === 'ultra' ? 'rgba(255,107,107,0.2)' : 'rgba(200,230,80,0.2)',
        padding: '1rem 1.25rem',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <span><strong style={{ color: 'var(--text-primary)' }}>Tier:</strong> {config.label}</span>
          <span><strong style={{ color: 'var(--text-primary)' }}>Parts from:</strong> {config.sourcing}</span>
          <span><strong style={{ color: 'var(--text-primary)' }}>Lead time:</strong> {config.leadTime}</span>
          <span><strong style={{ color: 'var(--text-primary)' }}>Booking:</strong> {config.bookingFlow === 'instant' ? '⚡ Instant' : '📋 Quote required'}</span>
          {config.surcharge > 0 && <span><strong style={{ color: 'var(--text-primary)' }}>Sourcing surcharge:</strong> {config.surcharge * 100}%</span>}
        </div>
      </div>

      {/* Service cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {SERVICES.map(svc => {
          const selected = state.services.includes(svc.id);
          const rec = getRecommendation(svc.id);
          const partCost = Math.round(svc.basePartCost * config.multiplier);
          return (
            <button key={svc.id} onClick={() => toggleService(svc.id)} style={{
              background: selected ? 'rgba(200,230,80,0.08)' : 'var(--bg-card)',
              border: selected ? '1px solid var(--accent)' : '1px solid var(--border)',
              borderRadius: '1rem', padding: '1.25rem', cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.2s', position: 'relative',
            }}>
              {rec && (
                <span className="badge badge-accent" style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', fontSize: '0.6rem' }}>
                  {rec}
                </span>
              )}
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{svc.icon}</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>{svc.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.75rem', lineHeight: 1.5 }}>{svc.description}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '1rem' }}>₹{(partCost + svc.laborCost).toLocaleString()}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: '0.35rem' }}>+GST</span>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>⏱ {svc.duration}</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Parts ₹{partCost.toLocaleString()} · Service charge ₹{svc.laborCost}
              </div>
              {selected && (
                <div style={{
                  position: 'absolute', top: '0.75rem', left: '0.75rem',
                  width: '1.25rem', height: '1.25rem', borderRadius: '50%',
                  background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Check size={10} color="#0B3B35" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Live price summary */}
      {pricing && (
        <div className="card" style={{ background: 'var(--bg-surface)' }}>
          <div style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '0.9rem' }}>Price Breakdown</div>
          {pricing.lineItems.map(li => (
            <div key={li.name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>{li.name}</span>
              <span>₹{li.subtotal.toLocaleString()}</span>
            </div>
          ))}
          <hr className="divider" />
          {pricing.surchargeAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Sourcing surcharge ({CAR_TIER_CONFIG[tier].surcharge * 100}%)</span>
              <span>₹{pricing.surchargeAmount.toLocaleString()}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Platform fee</span>
            <span>₹{pricing.platformFee}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>GST (18%)</span>
            <span>₹{pricing.gst.toLocaleString()}</span>
          </div>
          <hr className="divider" />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
            <span>Total</span>
            <span style={{ color: 'var(--accent)' }}>₹{pricing.total.toLocaleString()}</span>
          </div>
          {(tier === 'luxury' || tier === 'ultra') && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(255,107,107,0.08)', borderRadius: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ⚠️ Estimate only. Final price confirmed after parts availability check. Our team will call within 2 hours.
            </div>
          )}
        </div>
      )}

      <div className="card" style={{ marginTop: '1rem', background: 'rgba(200,230,80,0.06)', borderColor: 'rgba(200,230,80,0.2)' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          🔍 <strong style={{ color: 'var(--text-primary)' }}>Full parts transparency:</strong> After booking you'll receive the OEM part SKU, batch number, and manufacturer details before the partner arrives. Everything is traceable.
        </p>
      </div>
    </div>
  );
}

// ─── STEP 3: SCHEDULE ─────────────────────────────────────────────────────────
function Step3({ state, setState }: { state: BookingState; setState: (s: BookingState) => void }) {
  return (
    <div>
      <h2 className="font-display" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Schedule your service</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>We come to you — home, office, anywhere in Bangalore</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Zone */}
        <div>
          <label className="label">Your Zone</label>
          <div style={{ position: 'relative' }}>
            <select className="select" value={state.zone} onChange={e => setState({ ...state, zone: e.target.value })}>
              <option value="">Select zone</option>
              {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* Slot */}
        <div>
          <label className="label">Time Slot</label>
          <div style={{ position: 'relative' }}>
            <select className="select" value={state.slot} onChange={e => setState({ ...state, slot: e.target.value })}>
              <option value="">Select slot</option>
              {SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          </div>
        </div>
      </div>

      {/* Address */}
      <div style={{ marginTop: '1.25rem' }}>
        <label className="label">Full Address</label>
        <textarea className="input" rows={3} placeholder="Flat no, building name, street, landmark..."
          value={state.address} onChange={e => setState({ ...state, address: e.target.value })}
          style={{ resize: 'vertical' }} />
      </div>

      {/* Partner available info */}
      {state.zone && (
        <div className="card" style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'rgba(200,230,80,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <MapPin size={18} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Partners available in {state.zone}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
              Nearest certified partner will be auto-assigned after booking. You'll see their profile and live location.
            </div>
          </div>
        </div>
      )}

      {/* Trust stack */}
      <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
        {[
          { icon: <Shield size={16} />, text: 'Partner ID verified' },
          { icon: <Star size={16} />, text: 'Before & after photos' },
          { icon: <Clock size={16} />, text: '2-hour service window' },
          { icon: <Zap size={16} />, text: 'Live location tracking' },
        ].map(t => (
          <div key={t.text} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--accent)' }}>{t.icon}</span> {t.text}
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '1.25rem', background: 'rgba(200,230,80,0.06)', borderColor: 'rgba(200,230,80,0.2)' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          ⚡ <strong style={{ color: 'var(--text-primary)' }}>Same-day slots available.</strong> Morning slots have the best partner availability. Booking confirmed within 60 seconds.
        </p>
      </div>
    </div>
  );
}

// ─── STEP 4: CONFIRM ─────────────────────────────────────────────────────────
function Step4({ state, setState, onConfirm }: { state: BookingState; setState: (s: BookingState) => void; onConfirm: () => void }) {
  const tier = state.tier ?? 'standard';
  const pricing = state.services.length > 0 ? calculatePrice(tier, state.services) : null;
  const isQuote = tier === 'luxury' || tier === 'ultra';

  return (
    <div>
      <h2 className="font-display" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
        {isQuote ? 'Request a Quote' : 'Confirm & Pay'}
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
        {isQuote ? 'Our team will confirm parts availability and call you within 2 hours' : 'Review your booking before confirming'}
      </p>

      {/* Booking summary */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '0.9rem' }}>Booking Summary</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.875rem' }}>
          {[
            { label: 'Name', value: state.name || '—' },
            { label: 'Phone', value: state.phone || '—' },
            { label: 'Car', value: state.make && state.model ? `${state.make} ${state.model} (${state.year})` : '—' },
            { label: 'KM Reading', value: state.km ? `${parseInt(state.km).toLocaleString()} km` : '—' },
            { label: 'Zone', value: state.zone || '—' },
            { label: 'Slot', value: state.slot || '—' },
            { label: 'Services', value: state.services.length > 0 ? `${state.services.length} selected` : '—' },
            { label: 'Car Tier', value: CAR_TIER_CONFIG[tier].label },
          ].map(row => (
            <div key={row.label}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{row.label}</div>
              <div style={{ color: 'var(--text-primary)', marginTop: '0.2rem' }}>{row.value}</div>
            </div>
          ))}
        </div>
        {state.address && (
          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', fontSize: '0.875rem' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Address</div>
            <div style={{ marginTop: '0.2rem' }}>{state.address}</div>
          </div>
        )}
      </div>

      {/* Payment method (non-quote only) */}
      {!isQuote && (
        <div style={{ marginBottom: '1.25rem' }}>
          <label className="label">Payment Method</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '0.75rem' }}>
            {PAYMENT_METHODS.map(pm => (
              <button key={pm.id} onClick={() => setState({ ...state, payment: pm.id })} style={{
                background: state.payment === pm.id ? 'rgba(200,230,80,0.1)' : 'var(--bg-card)',
                border: state.payment === pm.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                borderRadius: '0.75rem', padding: '0.875rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
              }}>
                <div style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>{pm.icon}</div>
                <div style={{ color: 'var(--text-primary)', fontSize: '0.82rem', fontWeight: 500 }}>{pm.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price total */}
      {pricing && (
        <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{isQuote ? 'Estimated Total (pending confirmation)' : 'Total Amount'}</div>
            <div className="font-display" style={{ fontSize: '1.75rem', color: 'var(--accent)', marginTop: '0.2rem' }}>
              ₹{pricing.total.toLocaleString()}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Inclusive of GST</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className={`badge ${isQuote ? 'badge-warning' : 'badge-accent'}`}>
              {isQuote ? 'Quote Required' : 'Instant Booking'}
            </span>
          </div>
        </div>
      )}

      <button className="btn-accent" onClick={onConfirm} style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '1rem' }}>
        {isQuote ? 'Submit Quote Request' : 'Confirm Booking'} <ArrowRight size={18} />
      </button>
    </div>
  );
}

// ─── CONFIRMED STATE ──────────────────────────────────────────────────────────
function Confirmed({ state }: { state: BookingState }) {
  const tier = state.tier ?? 'standard';
  const isQuote = tier === 'luxury' || tier === 'ultra';
  const bookingId = 'BK' + Math.floor(Math.random() * 900 + 100);

  return (
    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
      <div style={{
        width: '5rem', height: '5rem', borderRadius: '50%', background: 'rgba(200,230,80,0.15)',
        border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 1.5rem',
      }}>
        {isQuote ? <FileText size={28} style={{ color: 'var(--accent)' }} /> : <Check size={28} style={{ color: 'var(--accent)' }} />}
      </div>

      <h2 className="font-display" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
        {isQuote ? 'Quote Submitted!' : 'Booking Confirmed!'}
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Booking ID: <strong style={{ color: 'var(--text-primary)' }}>{bookingId}</strong></p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '38ch', margin: '0 auto 2rem' }}>
        {isQuote
          ? 'Our team will check parts availability and call you within 2 hours to confirm pricing and schedule.'
          : `Your partner will arrive at ${state.slot}. You'll get a notification when they're en route.`}
      </p>

      {/* What happens next */}
      <div className="card" style={{ textAlign: 'left', marginBottom: '1.5rem', maxWidth: '32rem', margin: '0 auto 1.5rem' }}>
        <div style={{ fontWeight: 600, marginBottom: '1rem' }}>What happens next</div>
        {(isQuote ? [
          { icon: '📋', text: 'Parts availability check initiated' },
          { icon: '📞', text: 'Team calls within 2 hours' },
          { icon: '✅', text: 'Confirm pricing and schedule' },
          { icon: '🔧', text: 'Partner dispatched with correct parts' },
        ] : [
          { icon: '✅', text: 'Booking confirmed instantly' },
          { icon: '📦', text: 'Parts dispatched from kiosk' },
          { icon: '🗺️', text: `Partner en route by ${state.slot}` },
          { icon: '📸', text: 'Before & after photos sent to you' },
        ]).map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.1rem' }}>{step.icon}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{step.text}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/" className="btn-ghost" style={{ textDecoration: 'none' }}>Back to Home</Link>
        <Link href="/admin" className="btn-accent" style={{ textDecoration: 'none' }}>View in Admin <ArrowRight size={16} /></Link>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function CustomerPage() {
  const [step, setStep] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [state, setState] = useState<BookingState>({
    make: '', model: '', year: '', km: '', tier: null,
    services: [], zone: '', slot: '', address: '', payment: '', name: '', phone: '',
  });

  const canNext = [
    state.make && state.model && state.year,
    state.services.length > 0,
    state.zone && state.slot,
    true,
  ][step];

  if (confirmed) return (
    <div style={{ maxWidth: '40rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <Confirmed state={state} />
    </div>
  );

  return (
    <div style={{ maxWidth: '52rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <StepBar current={step} />

      <div style={{ minHeight: '28rem' }}>
        {step === 0 && <Step1 state={state} setState={setState} />}
        {step === 1 && <Step2 state={state} setState={setState} />}
        {step === 2 && <Step3 state={state} setState={setState} />}
        {step === 3 && <Step4 state={state} setState={setState} onConfirm={() => setConfirmed(true)} />}
      </div>

      {/* Navigation */}
      {step < 3 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <button className="btn-ghost" onClick={() => step > 0 ? setStep(step - 1) : undefined}
            style={{ opacity: step === 0 ? 0 : 1, pointerEvents: step === 0 ? 'none' : 'auto' }}>
            <ArrowLeft size={16} /> Back
          </button>
          <button className="btn-accent" onClick={() => setStep(step + 1)} disabled={!canNext}
            style={{ opacity: canNext ? 1 : 0.4, cursor: canNext ? 'pointer' : 'not-allowed' }}>
            {step === 2 ? 'Review Booking' : 'Continue'} <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
