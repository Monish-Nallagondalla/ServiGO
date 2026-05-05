'use client';
import { useState, useEffect } from 'react';
import {
  BarChart2, Users, Package, Home, AlertTriangle, CheckCircle,
  MapPin, ArrowRight, TrendingUp, Zap, Star, Clock, Phone,
  ChevronRight, RefreshCw, ArrowLeft, Wrench
} from 'lucide-react';
import { BOOKINGS, PARTNERS, INVENTORY, ZONES, CAR_TIER_CONFIG, BookingStatus, CarTier } from '@/lib/data';
import Link from 'next/link';

// ─── types ────────────────────────────────────────────────────────────────────
type BookingMutable = {
  id: string; customerName: string; persona: string; car: string; tier: CarTier;
  zone: string; services: string[]; status: BookingStatus; partner: string | null;
  slot: string; total: number; paymentMethod: string; requestedAt: number;
};

// ─── helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => `₹${n.toLocaleString()}`;

function elapsed(ms: number): string {
  const m = Math.floor(ms / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); const rm = m % 60;
  return `${h}h ${rm}m ago`;
}

const STATUS_FLOW: BookingStatus[] = ['pending', 'assigned', 'parts-ready', 'en-route', 'in-progress', 'completed'];
const STATUS_NEXT_LABEL: Partial<Record<BookingStatus, string>> = {
  pending: 'Mark Assigned',
  assigned: 'Parts Ready',
  'parts-ready': 'En Route',
  'en-route': 'In Progress',
  'in-progress': 'Mark Complete',
};

// seed mock requestedAt times (minutes ago)
const QUOTE_AGES: Record<string, number> = { BK003: 134 };
const PENDING_AGES: Record<string, number> = { BK006: 22, BK001: 47 };

function seedTime(id: string): number {
  const now = Date.now();
  if (QUOTE_AGES[id]) return now - QUOTE_AGES[id] * 60000;
  if (PENDING_AGES[id]) return now - PENDING_AGES[id] * 60000;
  return now - 10 * 60000;
}

// ─── shared badge components ──────────────────────────────────────────────────
function StatusBadge({ status }: { status: BookingStatus | string }) {
  const map: Record<string, string> = {
    pending: 'badge-warning', assigned: 'badge-warning',
    'parts-ready': 'badge-accent', 'en-route': 'badge-accent',
    'in-progress': 'badge-accent', completed: 'badge-muted',
    'quote-requested': 'badge-danger',
  };
  const labels: Record<string, string> = {
    pending: 'Pending', assigned: 'Assigned', 'parts-ready': 'Parts Ready',
    'en-route': 'En Route', 'in-progress': 'In Progress',
    completed: 'Completed', 'quote-requested': 'Quote Needed',
  };
  return <span className={`badge ${map[status] ?? 'badge-muted'}`}>{labels[status] ?? status}</span>;
}

function TierBadge({ tier }: { tier: string }) {
  const map: Record<string, string> = { standard: 'badge-accent', premium: 'badge-warning', luxury: 'badge-danger', ultra: 'badge-danger' };
  return <span className={`badge ${map[tier] ?? 'badge-muted'}`} style={{ fontSize: '0.6rem' }}>{CAR_TIER_CONFIG[tier as CarTier]?.label ?? tier}</span>;
}

function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name.split(' ').map(n => n[0]).join('');
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: 'rgba(200,230,80,0.15)', border: '1px solid rgba(200,230,80,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, color: 'var(--accent)', fontSize: size * 0.35,
    }}>{initials}</div>
  );
}

// ─── OVERVIEW / ACTION CENTRE ─────────────────────────────────────────────────
function Overview({ bookings, setTab, openBooking }: {
  bookings: BookingMutable[];
  setTab: (t: string) => void;
  openBooking: (id: string) => void;
}) {
  const completed = bookings.filter(b => b.status === 'completed');
  const totalRevenue = completed.reduce((s, b) => s + b.total, 0);
  const totalMargin = Math.round(totalRevenue * 0.32);
  const blendedMarginPct = totalRevenue > 0 ? Math.round((totalMargin / totalRevenue) * 100) : 0;
  const activeJobs = bookings.filter(b => !['completed', 'quote-requested'].includes(b.status)).length;
  const quoteQueue = bookings.filter(b => b.status === 'quote-requested');
  const unassigned = bookings.filter(b => b.status === 'pending');
  const availablePartners = PARTNERS.filter(p => p.status === 'available').length;

  const revenueData = [12400, 18900, 14200, 22100, 19800, 28400, totalRevenue];
  const maxRev = Math.max(...revenueData);

  const STATS = [
    { label: "Today's Revenue", value: fmt(totalRevenue), sub: `${completed.length} jobs completed`, icon: <TrendingUp size={17} />, accent: true, action: null },
    { label: 'Parts Margin', value: `${blendedMarginPct}%`, sub: fmt(totalMargin) + ' captured today', icon: <BarChart2 size={17} />, accent: true, action: null },
    { label: 'Active Jobs', value: String(activeJobs), sub: 'Across all zones', icon: <Zap size={17} />, accent: false, action: () => setTab('bookings') },
    { label: 'Available Partners', value: `${availablePartners}/8`, sub: 'Ready to dispatch', icon: <Users size={17} />, accent: false, action: () => setTab('partners') },
  ];

  return (
    <div>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {STATS.map(s => (
          <div key={s.label} className="stat-card" onClick={s.action ?? undefined}
            style={{ cursor: s.action ? 'pointer' : 'default', transition: 'border-color 0.2s' }}
            onMouseEnter={e => { if (s.action) (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)'; }}
            onMouseLeave={e => { if (s.action) (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
              <span style={{ color: s.accent ? 'var(--accent)' : 'var(--text-muted)' }}>{s.icon}</span>
              {s.action && <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />}
            </div>
            <div className="font-display" style={{ fontSize: '1.9rem', lineHeight: 1, color: s.accent ? 'var(--accent)' : 'var(--text-primary)' }}>{s.value}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.3rem' }}>{s.label}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '0.1rem', opacity: 0.7 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── ACTION CENTRE ── */}
      {(quoteQueue.length > 0 || unassigned.length > 0) && (
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <AlertTriangle size={15} style={{ color: 'var(--danger)' }} />
            <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Action Required</span>
            <span className="badge badge-danger" style={{ fontSize: '0.58rem', marginLeft: '0.25rem' }}>
              {quoteQueue.length + unassigned.length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {quoteQueue.map(b => (
              <button key={b.id} onClick={() => openBooking(b.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  background: 'rgba(255,107,107,0.05)', border: '1px solid rgba(255,107,107,0.2)',
                  borderRadius: '0.75rem', padding: '0.875rem 1rem', cursor: 'pointer',
                  textAlign: 'left', width: '100%', transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--danger)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,107,107,0.2)')}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--danger)', flexShrink: 0, boxShadow: '0 0 6px var(--danger)' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{b.customerName} — {b.car}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.775rem', marginTop: '0.1rem' }}>
                    Luxury quote · <span style={{ color: 'var(--danger)' }}>Waiting {elapsed(Date.now() - b.requestedAt)}</span> · Parts check needed
                  </div>
                </div>
                <span className="badge badge-danger" style={{ fontSize: '0.6rem', flexShrink: 0 }}>Quote</span>
                <ChevronRight size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              </button>
            ))}

            {unassigned.map(b => (
              <button key={b.id} onClick={() => openBooking(b.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  background: 'rgba(255,179,71,0.04)', border: '1px solid rgba(255,179,71,0.2)',
                  borderRadius: '0.75rem', padding: '0.875rem 1rem', cursor: 'pointer',
                  textAlign: 'left', width: '100%', transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--warning)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,179,71,0.2)')}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--warning)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{b.customerName} — {b.car}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.775rem', marginTop: '0.1rem' }}>
                    {b.zone} · {b.slot} · <span style={{ color: 'var(--warning)' }}>No partner assigned</span>
                  </div>
                </div>
                <span className="badge badge-warning" style={{ fontSize: '0.6rem', flexShrink: 0 }}>Unassigned</span>
                <ChevronRight size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Revenue chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Weekly Revenue</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '0.1rem' }}>Parts margin drives P&L</div>
            </div>
            <span className="badge badge-accent" style={{ fontSize: '0.6rem' }}>+18% WoW</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.35rem', height: '72px' }}>
            {revenueData.map((v, i) => {
              const days = ['M', 'T', 'W', 'T', 'F', 'S', 'Today'];
              const h = Math.max(4, Math.round((v / maxRev) * 62));
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                  <div style={{
                    width: '100%', height: `${h}px`,
                    background: i === 6 ? 'var(--accent)' : 'var(--bg-surface)',
                    border: `1px solid ${i === 6 ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: '3px 3px 0 0', transition: 'all 0.3s',
                  }} />
                  <span style={{ fontSize: '0.58rem', color: i === 6 ? 'var(--accent)' : 'var(--text-muted)' }}>{days[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Zone density */}
        <div className="card">
          <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Zone Density</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '0.875rem' }}>Partners per zone</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {ZONES.slice(0, 5).map(z => {
              const pct = (z.partnerCount / 12) * 100;
              return (
                <div key={z.id} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', width: '80px', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{z.name}</span>
                  <div style={{ flex: 1, height: '5px', background: 'var(--bg-surface)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)', borderRadius: '9999px' }} />
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 600, width: '18px', textAlign: 'right' }}>{z.partnerCount}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live jobs feed */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Live Jobs</div>
          <button onClick={() => setTab('bookings')} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}>
            View all →
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {bookings.filter(b => !['completed', 'quote-requested'].includes(b.status)).map(b => (
            <button key={b.id} onClick={() => openBooking(b.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.75rem',
                background: 'var(--bg-surface)', borderRadius: '0.6rem', border: '1px solid transparent',
                cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.customerName}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '0.1rem' }}>{b.car} · {b.zone}</div>
              </div>
              <StatusBadge status={b.status} />
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)' }}>{b.total > 0 ? fmt(b.total) : '—'}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{b.slot.replace('Today, ', '')}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── BOOKING LIST ─────────────────────────────────────────────────────────────
function BookingList({ bookings, onSelect, initialFilter }: {
  bookings: BookingMutable[];
  onSelect: (id: string) => void;
  initialFilter: string;
}) {
  const [filter, setFilter] = useState(initialFilter);
  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);
  const quoteCount = bookings.filter(b => b.status === 'quote-requested').length;

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {['all', 'pending', 'assigned', 'en-route', 'quote-requested', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            background: filter === f ? 'rgba(200,230,80,0.12)' : 'var(--bg-card)',
            border: filter === f ? '1px solid var(--accent)' : '1px solid var(--border)',
            borderRadius: '9999px', padding: '0.3rem 0.875rem',
            color: filter === f ? 'var(--accent)' : 'var(--text-muted)',
            fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
            transition: 'all 0.15s', display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
          }}>
            {f === 'quote-requested' ? 'Quote Queue' : f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'quote-requested' && quoteCount > 0 && (
              <span style={{ background: 'var(--danger)', color: '#fff', borderRadius: '9999px', padding: '0 0.35rem', fontSize: '0.62rem', fontWeight: 700 }}>
                {quoteCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          No bookings match this filter.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {filtered.map(b => {
          const isQuote = b.status === 'quote-requested';
          const isUrgent = isQuote || b.status === 'pending';
          return (
            <button key={b.id} onClick={() => onSelect(b.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                background: 'var(--bg-card)',
                border: isQuote ? '1px solid rgba(255,107,107,0.3)' : isUrgent ? '1px solid rgba(255,179,71,0.25)' : '1px solid var(--border)',
                borderRadius: '0.875rem', padding: '1rem 1.25rem',
                cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s', width: '100%',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = isQuote ? 'rgba(255,107,107,0.3)' : isUrgent ? 'rgba(255,179,71,0.25)' : 'var(--border)')}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{b.customerName}</span>
                  <TierBadge tier={b.tier} />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{b.id}</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{b.car} · {b.zone} · {b.slot}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '0.1rem' }}>
                  {b.partner ? `👤 ${b.partner}` : <span style={{ color: 'var(--warning)' }}>⚠ Unassigned</span>}
                  {' · '}{b.paymentMethod}
                  {isQuote && <span style={{ color: 'var(--danger)', marginLeft: '0.5rem' }}>· {elapsed(Date.now() - b.requestedAt)} waiting</span>}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <StatusBadge status={b.status} />
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: b.total > 0 ? 'var(--accent)' : 'var(--text-muted)', marginTop: '0.3rem' }}>
                  {b.total > 0 ? fmt(b.total) : 'Quote'}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── BOOKING DETAIL ───────────────────────────────────────────────────────────
function BookingDetail({ booking, onBack, onStatusChange, onAssign }: {
  booking: BookingMutable;
  onBack: () => void;
  onStatusChange: (id: string, status: BookingStatus) => void;
  onAssign: (bookingId: string, partnerName: string) => void;
}) {
  const [selectedPartner, setSelectedPartner] = useState<string | null>(booking.partner);
  const [assignConfirmed, setAssignConfirmed] = useState(!!booking.partner);

  const isQuote = booking.status === 'quote-requested';
  const partsMargin = booking.total > 0 ? Math.round(booking.total * 0.32) : 0;
  const availableForTier = PARTNERS.filter(p => p.status === 'available' && p.certified.includes(booking.tier));
  const currentIdx = STATUS_FLOW.indexOf(booking.status);
  const canAdvance = booking.status !== 'completed' && !isQuote && currentIdx >= 0;
  const nextStatus = canAdvance ? STATUS_FLOW[currentIdx + 1] : null;

  function handleConfirmAssign() {
    if (!selectedPartner) return;
    onAssign(booking.id, selectedPartner);
    setAssignConfirmed(true);
    if (booking.status === 'pending') onStatusChange(booking.id, 'assigned');
  }

  return (
    <div>
      {/* Breadcrumb */}
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.82rem', marginBottom: '1.5rem', padding: 0 }}>
        <ArrowLeft size={14} /> Bookings
      </button>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 className="font-display" style={{ fontSize: '1.5rem' }}>{booking.customerName}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {booking.id} · {booking.car} · <TierBadge tier={booking.tier} />
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
          <StatusBadge status={booking.status} />
          {isQuote && (
            <span style={{ fontSize: '0.72rem', color: 'var(--danger)' }}>
              <Clock size={11} style={{ display: 'inline', marginRight: '0.2rem' }} />
              Waiting {elapsed(Date.now() - booking.requestedAt)}
            </span>
          )}
        </div>
      </div>

      {/* Status progress bar */}
      {!isQuote && (
        <div className="card" style={{ marginBottom: '1.25rem', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflowX: 'auto' }}>
            {STATUS_FLOW.map((s, i) => {
              const isDone = i < currentIdx;
              const isCurrent = i === currentIdx;
              const labels = ['Pending', 'Assigned', 'Parts Ready', 'En Route', 'In Progress', 'Done'];
              return (
                <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STATUS_FLOW.length - 1 ? 1 : 'none' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
                    <div style={{
                      width: '1.6rem', height: '1.6rem', borderRadius: '50%',
                      background: isDone || isCurrent ? 'var(--accent)' : 'var(--bg-surface)',
                      border: isCurrent ? '2px solid var(--accent)' : isDone ? 'none' : '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {isDone
                        ? <CheckCircle size={11} color="#0B3B35" fill="#0B3B35" />
                        : isCurrent
                          ? <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#0B3B35' }} />
                          : <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--border)' }} />}
                    </div>
                    <span style={{ fontSize: '0.58rem', color: isCurrent ? 'var(--accent)' : isDone ? 'var(--text-muted)' : 'var(--border)', whiteSpace: 'nowrap', fontWeight: isCurrent ? 700 : 400 }}>
                      {labels[i]}
                    </span>
                  </div>
                  {i < STATUS_FLOW.length - 1 && (
                    <div style={{ flex: 1, height: '1px', background: isDone ? 'var(--accent)' : 'var(--border)', margin: '0 0.25rem', marginBottom: '1rem' }} />
                  )}
                </div>
              );
            })}
          </div>
          {canAdvance && nextStatus && (
            <button className="btn-accent" onClick={() => onStatusChange(booking.id, nextStatus)}
              style={{ marginTop: '1rem', width: '100%', justifyContent: 'center', fontSize: '0.875rem', padding: '0.75rem' }}>
              {STATUS_NEXT_LABEL[booking.status]} <ArrowRight size={15} />
            </button>
          )}
          {booking.status === 'completed' && (
            <div style={{ marginTop: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontSize: '0.875rem', fontWeight: 600 }}>
              <CheckCircle size={16} /> Job complete
            </div>
          )}
        </div>
      )}

      {/* Quote action panel */}
      {isQuote && (
        <div className="card" style={{ marginBottom: '1.25rem', background: 'rgba(255,107,107,0.05)', borderColor: 'rgba(255,107,107,0.25)' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <AlertTriangle size={18} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: '0.1rem' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, marginBottom: '0.35rem' }}>Luxury Quote — Action Required</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.55, marginBottom: '0.875rem' }}>
                {CAR_TIER_CONFIG[booking.tier].label} tier · Parts via {CAR_TIER_CONFIG[booking.tier].sourcing} · Lead time: {CAR_TIER_CONFIG[booking.tier].leadTime} · Sourcing surcharge: {CAR_TIER_CONFIG[booking.tier].surcharge * 100}%
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button className="btn-accent" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
                  <Phone size={13} /> Call Customer
                </button>
                <button className="btn-ghost" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
                  <Package size={13} /> Check Parts Availability
                </button>
                <button className="btn-ghost" onClick={() => onStatusChange(booking.id, 'pending')}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
                  <CheckCircle size={13} /> Confirm Quote → Proceed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Persona', value: booking.persona },
          { label: 'Zone', value: booking.zone },
          { label: 'Slot', value: booking.slot },
          { label: 'Payment', value: booking.paymentMethod },
          { label: 'Services', value: booking.services.join(', ') },
          { label: 'Car Tier', value: CAR_TIER_CONFIG[booking.tier]?.label },
        ].map(r => (
          <div key={r.label} className="stat-card" style={{ padding: '0.75rem 1rem' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{r.label}</div>
            <div style={{ fontWeight: 600, marginTop: '0.25rem', fontSize: '0.82rem' }}>{r.value}</div>
          </div>
        ))}
      </div>

      {/* Parts margin */}
      {booking.total > 0 && (
        <div className="card" style={{ marginBottom: '1.25rem', background: 'rgba(200,230,80,0.05)', borderColor: 'rgba(200,230,80,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Booking Value</div>
              <div className="font-display" style={{ fontSize: '1.75rem', color: 'var(--text-primary)', lineHeight: 1.1 }}>{fmt(booking.total)}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Parts Margin (~32%)</div>
              <div className="font-display" style={{ fontSize: '1.75rem', color: 'var(--accent)', lineHeight: 1.1 }}>{fmt(partsMargin)}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform Fee</div>
              <div className="font-display" style={{ fontSize: '1.75rem', color: 'var(--text-muted)', lineHeight: 1.1 }}>₹100</div>
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(200,230,80,0.15)', paddingTop: '0.75rem' }}>
            Parts markup is the primary P&L driver. Platform fee is a pricing anchor.
          </div>
        </div>
      )}

      {/* Partner assignment */}
      {!isQuote && (
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.875rem' }}>
            {assignConfirmed ? 'Assigned Partner' : 'Assign Partner'}
          </div>

          {assignConfirmed && booking.partner ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.75rem' }}>
                <Avatar name={booking.partner} size={40} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{booking.partner}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.1rem' }}>
                    {PARTNERS.find(p => p.name === booking.partner)?.zone} · ⭐ {PARTNERS.find(p => p.name === booking.partner)?.rating}
                  </div>
                </div>
                <span className="badge badge-accent">Assigned</span>
              </div>
              <button onClick={() => { setAssignConfirmed(false); setSelectedPartner(null); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}>
                Reassign partner
              </button>
            </div>
          ) : (
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.875rem' }}>
                Showing available partners certified for {CAR_TIER_CONFIG[booking.tier]?.label} tier, sorted by zone match.
              </p>
              {availableForTier.length === 0 && (
                <div style={{ color: 'var(--warning)', fontSize: '0.82rem', padding: '0.75rem', background: 'rgba(255,179,71,0.06)', borderRadius: '0.5rem' }}>
                  No available partners certified for this tier. Check Partners tab.
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.875rem' }}>
                {availableForTier.slice(0, 4).map(p => (
                  <button key={p.id} onClick={() => setSelectedPartner(p.name)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.875rem',
                      background: selectedPartner === p.name ? 'rgba(200,230,80,0.08)' : 'var(--bg-surface)',
                      border: selectedPartner === p.name ? '1px solid var(--accent)' : '1px solid var(--border)',
                      borderRadius: '0.75rem', padding: '0.75rem', cursor: 'pointer',
                      textAlign: 'left', transition: 'all 0.15s',
                    }}>
                    <Avatar name={p.name} size={34} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{p.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '0.1rem' }}>
                        {p.zone} · ⭐ {p.rating} · {p.jobs} jobs
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
                      {p.zone === booking.zone && <span className="badge badge-accent" style={{ fontSize: '0.58rem' }}>Same zone</span>}
                      {selectedPartner === p.name && <CheckCircle size={16} style={{ color: 'var(--accent)' }} />}
                    </div>
                  </button>
                ))}
              </div>
              {selectedPartner && (
                <button className="btn-accent" onClick={handleConfirmAssign}
                  style={{ width: '100%', justifyContent: 'center', padding: '0.875rem' }}>
                  Confirm — Assign {selectedPartner} <ArrowRight size={15} />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── PARTNERS TAB ─────────────────────────────────────────────────────────────
function PartnersTab({ bookings, openBooking }: {
  bookings: BookingMutable[];
  openBooking: (id: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const partner = selected ? PARTNERS.find(p => p.id === selected) : null;
  const partnerBooking = partner
    ? bookings.find(b => b.partner === partner.name && !['completed'].includes(b.status))
    : null;

  if (partner) {
    const statusCls = partner.status === 'available' ? 'badge-accent' : partner.status === 'on-job' ? 'badge-warning' : 'badge-muted';
    const statusLabel = partner.status === 'available' ? 'Available' : partner.status === 'on-job' ? 'On Job' : 'On Break';
    const unassignedBookings = bookings.filter(b =>
      b.status === 'pending' && !b.partner && b.zone === partner.zone
    );

    return (
      <div>
        <button onClick={() => setSelected(null)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.82rem', marginBottom: '1.5rem', padding: 0 }}>
          <ArrowLeft size={14} /> Partners
        </button>

        {/* Partner card */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Avatar name={partner.name} size={52} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{partner.name}</span>
                <span className={`badge ${statusCls}`} style={{ fontSize: '0.6rem' }}>{statusLabel}</span>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                <MapPin size={12} style={{ display: 'inline', marginRight: '0.2rem' }} />{partner.zone}
              </div>
              <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                {partner.certified.map(c => <span key={c} className="badge badge-muted" style={{ fontSize: '0.58rem' }}>{c}</span>)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'flex-end' }}>
                <Star size={14} fill="var(--accent)" style={{ color: 'var(--accent)' }} />
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>{partner.rating}</span>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '0.15rem' }}>{partner.jobs} jobs</div>
            </div>
          </div>
        </div>

        {/* Current job */}
        {partnerBooking ? (
          <div className="card" style={{ marginBottom: '1.25rem', borderColor: 'rgba(200,230,80,0.3)', background: 'rgba(200,230,80,0.03)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wrench size={14} style={{ color: 'var(--accent)' }} /> Current Job
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{partnerBooking.customerName} — {partnerBooking.car}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.2rem' }}>{partnerBooking.zone} · {partnerBooking.slot}</div>
            <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <StatusBadge status={partnerBooking.status} />
              <button onClick={() => openBooking(partnerBooking.id)} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}>
                Open booking →
              </button>
            </div>
          </div>
        ) : (
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No active job assigned.</div>
            {unassignedBookings.length > 0 && (
              <div style={{ marginTop: '0.875rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                  {unassignedBookings.length} unassigned booking{unassignedBookings.length > 1 ? 's' : ''} in {partner.zone}
                </div>
                {unassignedBookings.map(b => (
                  <button key={b.id} onClick={() => openBooking(b.id)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border)',
                      borderRadius: '0.6rem', padding: '0.6rem 0.875rem', cursor: 'pointer',
                      marginBottom: '0.4rem', transition: 'border-color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{b.customerName} — {b.car}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{b.slot}</div>
                    </div>
                    <span style={{ color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 600 }}>Assign →</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Partner roster
  const byStatus = ['available', 'on-job', 'break'] as const;
  const counts = { available: PARTNERS.filter(p => p.status === 'available').length, 'on-job': PARTNERS.filter(p => p.status === 'on-job').length, break: PARTNERS.filter(p => p.status === 'break').length };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {([['available', 'badge-accent', 'Available'], ['on-job', 'badge-warning', 'On Job'], ['break', 'badge-muted', 'On Break']] as const).map(([s, cls, label]) => (
          <div key={s} className="stat-card" style={{ textAlign: 'center' }}>
            <div className="font-display" style={{ fontSize: '1.75rem' }}>{counts[s]}</div>
            <span className={`badge ${cls}`} style={{ marginTop: '0.35rem', fontSize: '0.6rem' }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {PARTNERS.map(p => {
          const statusCls = p.status === 'available' ? 'badge-accent' : p.status === 'on-job' ? 'badge-warning' : 'badge-muted';
          const statusLabel = p.status === 'available' ? 'Available' : p.status === 'on-job' ? 'On Job' : 'On Break';
          const currentJob = bookings.find(b => b.partner === p.name && !['completed'].includes(b.status));
          return (
            <button key={p.id} onClick={() => setSelected(p.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '0.875rem', padding: '0.875rem 1.25rem',
                cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
              <Avatar name={p.name} size={38} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.name}</span>
                  <span className={`badge ${statusCls}`} style={{ fontSize: '0.58rem' }}>{statusLabel}</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.15rem' }}>
                  <MapPin size={11} style={{ display: 'inline', marginRight: '0.2rem' }} />{p.zone}
                  {currentJob && <span style={{ color: 'var(--warning)', marginLeft: '0.5rem' }}>· {currentJob.customerName}</span>}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>
                  <Star size={12} fill="var(--accent)" style={{ color: 'var(--accent)' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{p.rating}</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem', marginTop: '0.1rem' }}>{p.jobs} jobs</div>
              </div>
              <ChevronRight size={15} style={{ color: 'var(--border)', flexShrink: 0 }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── INVENTORY TAB ────────────────────────────────────────────────────────────
function InventoryTab({ bookings }: { bookings: BookingMutable[] }) {
  const [reordered, setReordered] = useState<Set<string>>(new Set());
  const lowStock = INVENTORY.filter(i => i.stock <= i.reorderAt);

  // Map part SKUs to which bookings need them
  function bookingsAtRisk(sku: string): BookingMutable[] {
    const skuToService: Record<string, string[]> = {
      'EO-STD-5W30': ['Engine Oil', 'Engine Oil Change'],
      'AF-STD-HB': ['Air Filter', 'Air Filter Replacement'],
      'ACF-UNI': ['AC Filter', 'AC Cabin Filter'],
      'BP-STD-SET': ['Brake Pad', 'Brake Pad Replacement'],
      'EO-PRM-0W40': ['Engine Oil', 'Engine Oil Change'],
      'AF-PRM-SUV': ['Air Filter', 'Air Filter Replacement'],
      'EO-LUX-BMW': ['Engine Oil', 'Engine Oil Change'],
      'BP-LUX-MB': ['Brake Pad', 'Brake Pad Replacement'],
    };
    const relevantServices = skuToService[sku] ?? [];
    return bookings.filter(b =>
      !['completed'].includes(b.status) &&
      b.services.some(s => relevantServices.some(r => s.toLowerCase().includes(r.toLowerCase())))
    );
  }

  return (
    <div>
      {lowStock.length > 0 && (
        <div className="card" style={{ marginBottom: '1.25rem', background: 'rgba(255,179,71,0.05)', borderColor: 'rgba(255,179,71,0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={17} style={{ color: 'var(--warning)', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{lowStock.length} item{lowStock.length > 1 ? 's' : ''} at or below reorder threshold</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.1rem' }}>
                {lowStock.map(i => i.part).join(' · ')}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {INVENTORY.map(item => {
          const isLow = item.stock <= item.reorderAt;
          const isReordered = reordered.has(item.id);
          const atRisk = bookingsAtRisk(item.sku);
          const tierClsMap: Record<string, string> = { standard: 'badge-accent', premium: 'badge-warning', luxury: 'badge-danger' };
          return (
            <div key={item.id} className="card" style={{
              borderColor: isReordered ? 'rgba(200,230,80,0.3)' : isLow ? 'rgba(255,179,71,0.3)' : 'var(--border)',
              background: isReordered ? 'rgba(200,230,80,0.03)' : isLow ? 'rgba(255,179,71,0.03)' : 'var(--bg-card)',
              transition: 'all 0.3s',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.part}</span>
                    <span className={`badge ${tierClsMap[item.tier] ?? 'badge-muted'}`} style={{ fontSize: '0.58rem' }}>{item.tier}</span>
                    {isLow && !isReordered && <span className="badge badge-warning" style={{ fontSize: '0.58rem' }}>⚠ Low Stock</span>}
                    {isReordered && <span className="badge badge-accent" style={{ fontSize: '0.58rem' }}>✓ Reorder Placed</span>}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>SKU: {item.sku}</div>
                  {atRisk.length > 0 && !isReordered && isLow && (
                    <div style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: 'var(--danger)' }}>
                      ⚠ {atRisk.length} active booking{atRisk.length > 1 ? 's' : ''} need this part: {atRisk.map(b => b.id).join(', ')}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: isLow && !isReordered ? 'var(--warning)' : 'var(--text-primary)' }}>{item.stock} units</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Reorder at {item.reorderAt}</div>
                </div>
              </div>

              <div style={{ marginTop: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{ flex: 1, height: '5px', background: 'var(--bg-surface)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: '9999px',
                    background: isReordered ? 'var(--accent)' : isLow ? 'var(--warning)' : 'var(--accent)',
                    width: `${Math.min((item.stock / 50) * 100, 100)}%`,
                    transition: 'width 0.5s ease',
                  }} />
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--accent)', flexShrink: 0 }}>{fmt(item.unitCost)}/unit</span>
                {isLow && !isReordered && (
                  <button onClick={() => setReordered(prev => new Set([...prev, item.id]))}
                    className="btn-accent"
                    style={{ padding: '0.3rem 0.875rem', fontSize: '0.72rem', flexShrink: 0 }}>
                    <RefreshCw size={11} /> Reorder
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview', label: 'Overview', icon: <Home size={15} /> },
  { id: 'bookings', label: 'Bookings', icon: <BarChart2 size={15} /> },
  { id: 'partners', label: 'Partners', icon: <Users size={15} /> },
  { id: 'inventory', label: 'Inventory', icon: <Package size={15} /> },
];

export default function AdminPage() {
  const [tab, setTab] = useState('overview');
  const [dateStr, setDateStr] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  // mutable booking state — all status/partner changes live here
  const [bookings, setBookings] = useState<BookingMutable[]>(() =>
    BOOKINGS.map(b => ({ ...b, requestedAt: seedTime(b.id) }))
  );

  useEffect(() => {
    setDateStr(new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  function handleStatusChange(id: string, status: BookingStatus) {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  }

  function handleAssign(bookingId: string, partnerName: string) {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, partner: partnerName } : b));
  }

  function openBooking(id: string) {
    setSelectedBookingId(id);
    setTab('bookings');
  }

  const quoteCount = bookings.filter(b => b.status === 'quote-requested').length;
  const selectedBooking = selectedBookingId ? bookings.find(b => b.id === selectedBookingId) : null;

  return (
    <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="label">Operations Centre</span>
          <h1 className="font-display" style={{ fontSize: '2rem', marginTop: '0.25rem' }}>
            Admin <span className="font-display-italic" style={{ color: 'var(--accent)' }}>Dashboard</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.35rem', fontSize: '0.82rem' }}>{dateStr}</p>
        </div>
        <Link href="/decisions" className="btn-ghost" style={{ textDecoration: 'none', fontSize: '0.82rem' }}>
          Decision Log <ArrowRight size={13} />
        </Link>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.75rem', background: 'var(--bg-surface)', padding: '0.3rem', borderRadius: '0.75rem', border: '1px solid var(--border)', overflowX: 'auto' }}>
        {TABS.map(t => {
          const isCurrent = tab === t.id;
          const showBadge = t.id === 'bookings' && quoteCount > 0;
          return (
            <button key={t.id} onClick={() => { setTab(t.id); if (t.id !== 'bookings') setSelectedBookingId(null); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                background: isCurrent ? 'var(--bg-card)' : 'transparent',
                border: isCurrent ? '1px solid var(--border)' : '1px solid transparent',
                borderRadius: '0.5rem', padding: '0.5rem 0.875rem',
                color: isCurrent ? 'var(--text-primary)' : 'var(--text-muted)',
                fontSize: '0.82rem', fontWeight: isCurrent ? 600 : 400, cursor: 'pointer',
                transition: 'all 0.15s', whiteSpace: 'nowrap', position: 'relative',
              }}>
              {t.icon} {t.label}
              {showBadge && (
                <span style={{ background: 'var(--danger)', color: '#fff', borderRadius: '9999px', padding: '0 0.35rem', fontSize: '0.6rem', fontWeight: 700, marginLeft: '0.1rem' }}>
                  {quoteCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <Overview bookings={bookings} setTab={setTab} openBooking={openBooking} />
      )}
      {tab === 'bookings' && !selectedBooking && (
        <BookingList
          bookings={bookings}
          onSelect={id => setSelectedBookingId(id)}
          initialFilter={quoteCount > 0 ? 'all' : 'all'}
        />
      )}
      {tab === 'bookings' && selectedBooking && (
        <BookingDetail
          booking={selectedBooking}
          onBack={() => setSelectedBookingId(null)}
          onStatusChange={handleStatusChange}
          onAssign={handleAssign}
        />
      )}
      {tab === 'partners' && (
        <PartnersTab bookings={bookings} openBooking={(id) => { openBooking(id); }} />
      )}
      {tab === 'inventory' && (
        <InventoryTab bookings={bookings} />
      )}
    </div>
  );
}
