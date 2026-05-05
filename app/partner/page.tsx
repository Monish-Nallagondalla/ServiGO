'use client';
import { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, Circle, MapPin, Phone, Clock, Package, Camera, Star, AlertTriangle, Navigation } from 'lucide-react';
import { BOOKINGS, PARTNERS } from '@/lib/data';
import Link from 'next/link';

// ── Partner login state (mock) ────────────────────────────────────────────────
const PARTNER = PARTNERS[2]; // Anand Raj — certified standard/premium/luxury

// ── Jobs assigned to this partner ────────────────────────────────────────────
const MY_JOBS = BOOKINGS.filter(b =>
  b.partner === PARTNER.name && b.status !== 'completed'
).concat(BOOKINGS.filter(b => b.status === 'completed').slice(0, 1));

const ALL_JOBS = [
  {
    id: 'BK001', customerName: 'Rahul Mehta', car: 'Hyundai Creta', tier: 'standard',
    zone: 'Koramangala', address: 'Flat 4B, Prestige Shantiniketan, Whitefield Main Rd',
    services: ['Engine Oil Change', 'Air Filter Replacement'],
    parts: [
      { sku: 'EO-STD-5W30', name: 'Engine Oil 5W-30 (1L × 4)', status: 'pending' as const },
      { sku: 'AF-STD-HB', name: 'Air Filter — Hyundai Creta', status: 'pending' as const },
    ],
    slot: 'Today, 3:00 PM', phone: '+91 98200 11234',
    status: 'assigned' as const, total: 1892, paymentMethod: 'UPI',
    beforePhoto: false, afterPhoto: false,
  },
  {
    id: 'BK004', customerName: 'Meera Singh', car: 'Tata Nexon', tier: 'standard',
    zone: 'HSR Layout', address: '12, 27th Main, HSR Layout Sector 2',
    services: ['Engine Oil Change', 'Air Filter Replacement', 'AC Cabin Filter'],
    parts: [
      { sku: 'EO-STD-5W30', name: 'Engine Oil 5W-30 (1L × 4)', status: 'pending' as const },
      { sku: 'AF-STD-HB', name: 'Air Filter — Tata Nexon', status: 'pending' as const },
      { sku: 'ACF-UNI', name: 'AC Cabin Filter — Universal', status: 'pending' as const },
    ],
    slot: 'Today, 5:00 PM', phone: '+91 98200 44567',
    status: 'parts-ready' as const, total: 2340, paymentMethod: 'Cash',
    beforePhoto: false, afterPhoto: false,
  },
  {
    id: 'BK002', customerName: 'Harshi Reddy', car: 'Maruti Baleno', tier: 'standard',
    zone: 'Indiranagar', address: '3rd Floor, Embassy Golf Links, Indiranagar',
    services: ['AC Cabin Filter'],
    parts: [
      { sku: 'ACF-UNI', name: 'AC Cabin Filter — Universal', status: 'picked' as const },
    ],
    slot: 'Today, 11:00 AM', phone: '+91 98200 22345',
    status: 'completed' as const, total: 768, paymentMethod: 'Card',
    beforePhoto: true, afterPhoto: true,
  },
];

type JobStatus = 'assigned' | 'parts-ready' | 'en-route' | 'in-progress' | 'completed';
type PartStatus = 'pending' | 'picked';

interface JobState {
  status: JobStatus;
  parts: { sku: string; name: string; status: PartStatus }[];
  beforePhoto: boolean;
  afterPhoto: boolean;
  rating: number;
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: JobStatus }) {
  const map: Record<JobStatus, { label: string; cls: string }> = {
    'assigned': { label: 'Assigned', cls: 'badge-warning' },
    'parts-ready': { label: 'Parts Ready', cls: 'badge-accent' },
    'en-route': { label: 'En Route', cls: 'badge-accent' },
    'in-progress': { label: 'In Progress', cls: 'badge-warning' },
    'completed': { label: 'Completed', cls: 'badge-muted' },
  };
  const { label, cls } = map[status];
  return <span className={`badge ${cls}`}>{label}</span>;
}

// ── Job List ──────────────────────────────────────────────────────────────────
function JobList({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div>
      {/* Partner header */}
      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '3.5rem', height: '3.5rem', borderRadius: '50%',
          background: 'rgba(200,230,80,0.15)', border: '2px solid var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent)',
        }}>
          {PARTNER.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: '1rem' }}>{PARTNER.name}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.1rem' }}>
            {PARTNER.zone} · ⭐ {PARTNER.rating} · {PARTNER.jobs} jobs completed
          </div>
          <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {PARTNER.certified.map(c => (
              <span key={c} className="badge badge-accent" style={{ fontSize: '0.6rem' }}>{c}</span>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className="badge badge-accent">Available</span>
        </div>
      </div>

      {/* Today's jobs */}
      <div style={{ marginBottom: '1rem' }}>
        <span className="label">Today's Jobs ({ALL_JOBS.length})</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {ALL_JOBS.map(job => (
          <button key={job.id} onClick={() => onSelect(job.id)}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '1rem', padding: '1.25rem', cursor: 'pointer',
              textAlign: 'left', width: '100%', transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{job.customerName}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.15rem' }}>{job.car} · {job.zone}</div>
              </div>
              <StatusBadge status={job.status} />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={13} style={{ color: 'var(--accent)' }} /> {job.slot}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={13} style={{ color: 'var(--accent)' }} /> {job.zone}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Package size={13} style={{ color: 'var(--accent)' }} /> {job.parts.length} parts
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {job.services.map(s => (
                <span key={s} className="badge badge-muted" style={{ fontSize: '0.65rem' }}>{s}</span>
              ))}
            </div>

            {/* Parts warning */}
            {job.parts.some(p => p.status === 'pending') && job.status !== 'completed' && (
              <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--warning)' }}>
                <AlertTriangle size={13} /> Parts pickup pending before departure
              </div>
            )}

            {job.status === 'completed' && (
              <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--accent)' }}>
                <CheckCircle size={13} /> Completed · Photos submitted · ₹{job.total.toLocaleString()}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Job Detail ────────────────────────────────────────────────────────────────
function JobDetail({ jobId, onBack }: { jobId: string; onBack: () => void }) {
  const base = ALL_JOBS.find(j => j.id === jobId)!;
  const [jobState, setJobState] = useState<JobState>({
    status: base.status,
    parts: base.parts.map(p => ({ ...p })),
    beforePhoto: base.beforePhoto,
    afterPhoto: base.afterPhoto,
    rating: 0,
  });

  const allPartsPicked = jobState.parts.every(p => p.status === 'picked');

  const togglePart = (sku: string) => {
    setJobState(prev => ({
      ...prev,
      parts: prev.parts.map(p => p.sku === sku ? { ...p, status: p.status === 'picked' ? 'pending' : 'picked' } : p),
    }));
  };

  const advance = () => {
    const flow: JobStatus[] = ['assigned', 'parts-ready', 'en-route', 'in-progress', 'completed'];
    const idx = flow.indexOf(jobState.status);
    if (idx < flow.length - 1) setJobState(prev => ({ ...prev, status: flow[idx + 1] }));
  };

  const nextLabel: Record<JobStatus, string> = {
    'assigned': 'Confirm Parts Pickup',
    'parts-ready': 'Start Navigation',
    'en-route': 'Arrive & Start Service',
    'in-progress': 'Mark Complete',
    'completed': 'Done',
  };

  const canAdvance = () => {
    if (jobState.status === 'assigned') return allPartsPicked;
    if (jobState.status === 'in-progress') return jobState.beforePhoto && jobState.afterPhoto;
    return true;
  };

  return (
    <div>
      {/* Back */}
      <button onClick={onBack} className="btn-ghost" style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem' }}>
        <ArrowLeft size={16} /> Back to Jobs
      </button>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 className="font-display" style={{ fontSize: '1.5rem' }}>{base.customerName}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{base.car} · {base.zone}</p>
        </div>
        <StatusBadge status={jobState.status} />
      </div>

      {/* Progress timeline */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflowX: 'auto', gap: '0' }}>
          {(['assigned', 'parts-ready', 'en-route', 'in-progress', 'completed'] as JobStatus[]).map((s, i, arr) => {
            const statusIdx = ['assigned', 'parts-ready', 'en-route', 'in-progress', 'completed'].indexOf(jobState.status);
            const isPast = i < statusIdx;
            const isCurrent = i === statusIdx;
            const labels = ['Assigned', 'Parts Ready', 'En Route', 'In Progress', 'Done'];
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < arr.length - 1 ? 1 : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
                  <div style={{
                    width: '1.75rem', height: '1.75rem', borderRadius: '50%',
                    background: isPast || isCurrent ? 'var(--accent)' : 'var(--bg-surface)',
                    border: isCurrent ? '2px solid var(--accent)' : isPast ? 'none' : '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isPast ? <CheckCircle size={12} color="#0B3B35" fill="#0B3B35" /> :
                      isCurrent ? <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0B3B35' }} /> :
                        <Circle size={12} color="var(--border)" />}
                  </div>
                  <span style={{ fontSize: '0.62rem', color: isCurrent ? 'var(--accent)' : 'var(--text-muted)', whiteSpace: 'nowrap', fontWeight: isCurrent ? 600 : 400 }}>
                    {labels[i]}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ flex: 1, height: '1px', background: isPast ? 'var(--accent)' : 'var(--border)', margin: '0 0.35rem', marginBottom: '1.1rem' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Customer info */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontWeight: 600, marginBottom: '0.875rem', fontSize: '0.875rem' }}>Customer & Location</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <Phone size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            <a href={`tel:${base.phone}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>{base.phone}</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <MapPin size={14} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '0.1rem' }} />
            {base.address}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <Clock size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            Slot: {base.slot}
          </div>
        </div>
        {jobState.status === 'en-route' || jobState.status === 'parts-ready' ? (
          <button className="btn-accent" style={{ marginTop: '0.875rem', width: '100%', justifyContent: 'center' }}>
            <Navigation size={15} /> Open in Maps
          </button>
        ) : null}
      </div>

      {/* Parts checklist */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Parts Checklist</div>
          <span style={{ fontSize: '0.78rem', color: allPartsPicked ? 'var(--accent)' : 'var(--warning)' }}>
            {jobState.parts.filter(p => p.status === 'picked').length}/{jobState.parts.length} picked
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {jobState.parts.map(part => (
            <button key={part.sku} onClick={() => jobState.status !== 'completed' && togglePart(part.sku)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.875rem',
                background: part.status === 'picked' ? 'rgba(200,230,80,0.06)' : 'var(--bg-surface)',
                border: part.status === 'picked' ? '1px solid rgba(200,230,80,0.25)' : '1px solid var(--border)',
                borderRadius: '0.6rem', padding: '0.75rem', cursor: jobState.status !== 'completed' ? 'pointer' : 'default',
                textAlign: 'left', width: '100%', transition: 'all 0.2s',
              }}>
              <div style={{
                width: '1.5rem', height: '1.5rem', borderRadius: '50%', flexShrink: 0,
                background: part.status === 'picked' ? 'var(--accent)' : 'transparent',
                border: part.status === 'picked' ? 'none' : '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {part.status === 'picked' && <Check size={12} color="#0B3B35" strokeWidth={3} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>{part.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>SKU: {part.sku}</div>
              </div>
              <span className={`badge ${part.status === 'picked' ? 'badge-accent' : 'badge-muted'}`} style={{ fontSize: '0.6rem' }}>
                {part.status === 'picked' ? 'Picked' : 'Pending'}
              </span>
            </button>
          ))}
        </div>
        {!allPartsPicked && jobState.status !== 'completed' && (
          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--warning)' }}>
            <AlertTriangle size={13} /> Confirm all parts before departing kiosk
          </div>
        )}
      </div>

      {/* Services */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontWeight: 600, marginBottom: '0.875rem', fontSize: '0.875rem' }}>Services to Perform</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {base.services.map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <CheckCircle size={14} style={{ color: jobState.status === 'completed' ? 'var(--accent)' : 'var(--border)' }} />
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* Photo proof — shown when in-progress or completed */}
      {(jobState.status === 'in-progress' || jobState.status === 'completed') && (
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem' }}>Photo Proof</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>
            Required before marking complete. Photos are shared with the customer automatically.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
            {[
              { key: 'beforePhoto' as const, label: 'Before Service', icon: '📷' },
              { key: 'afterPhoto' as const, label: 'After Service', icon: '✅' },
            ].map(({ key, label, icon }) => (
              <button key={key} onClick={() => jobState.status !== 'completed' && setJobState(prev => ({ ...prev, [key]: true }))}
                style={{
                  background: jobState[key] ? 'rgba(200,230,80,0.08)' : 'var(--bg-surface)',
                  border: jobState[key] ? '1px solid var(--accent)' : '1px dashed var(--border)',
                  borderRadius: '0.75rem', padding: '1.25rem', cursor: jobState.status !== 'completed' ? 'pointer' : 'default',
                  textAlign: 'center', transition: 'all 0.2s',
                }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>
                  {jobState[key] ? '✅' : icon}
                </div>
                <div style={{ fontSize: '0.8rem', color: jobState[key] ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 500 }}>
                  {jobState[key] ? 'Photo uploaded' : `Upload ${label}`}
                </div>
              </button>
            ))}
          </div>
          {!jobState.beforePhoto || !jobState.afterPhoto ? (
            <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={13} /> Both photos required to complete job
            </div>
          ) : null}
        </div>
      )}

      {/* Payment info */}
      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Collection Amount</div>
          <div className="font-display" style={{ fontSize: '1.5rem', color: 'var(--accent)' }}>₹{base.total.toLocaleString()}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Payment via</div>
          <div style={{ fontWeight: 600, marginTop: '0.15rem' }}>{base.paymentMethod}</div>
          {base.paymentMethod === 'Cash' && (
            <div style={{ fontSize: '0.72rem', color: 'var(--warning)', marginTop: '0.2rem' }}>Collect & log at office drop</div>
          )}
        </div>
      </div>

      {/* Rating after complete */}
      {jobState.status === 'completed' && (
        <div className="card" style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Job Complete! 🎉</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>Customer will rate this service. Your current rating: ⭐ {PARTNER.rating}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} onClick={() => setJobState(prev => ({ ...prev, rating: n }))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>
                <Star size={24} fill={n <= jobState.rating ? '#C8E650' : 'transparent'} color={n <= jobState.rating ? '#C8E650' : 'var(--border)'} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      {jobState.status !== 'completed' ? (
        <button className="btn-accent" onClick={advance} disabled={!canAdvance()}
          style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '1rem', opacity: canAdvance() ? 1 : 0.4, cursor: canAdvance() ? 'pointer' : 'not-allowed' }}>
          {nextLabel[jobState.status]} <ArrowRight size={18} />
        </button>
      ) : (
        <Link href="/admin" className="btn-accent" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', width: '100%', padding: '1rem' }}>
          View in Admin Dashboard <ArrowRight size={18} />
        </Link>
      )}
    </div>
  );
}

// ─── tiny Check icon used inside parts list ───────────────────────────────────
function Check({ size, color, strokeWidth }: { size: number; color: string; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth ?? 2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function PartnerPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div style={{ maxWidth: '42rem', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {!selected ? (
        <>
          <div style={{ marginBottom: '2rem' }}>
            <span className="label">Partner App</span>
            <h1 className="font-display" style={{ fontSize: '2rem', marginTop: '0.25rem' }}>
              Good morning, <span className="font-display-italic" style={{ color: 'var(--accent)' }}>{PARTNER.name.split(' ')[0]}</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem', fontSize: '0.9rem' }}>
              {ALL_JOBS.filter(j => j.status !== 'completed').length} active jobs today
            </p>
          </div>
          <JobList onSelect={setSelected} />
        </>
      ) : (
        <JobDetail jobId={selected} onBack={() => setSelected(null)} />
      )}
    </div>
  );
}
