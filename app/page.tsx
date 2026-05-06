'use client';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

const PERSONAS = [
  {
    emoji: '🚗',
    name: 'Rahul',
    tag: 'Deadline Driver',
    quote: 'Trip tomorrow, service overdue.',
    need: 'Same-day slot, 60-second confirmation',
    cta: 'Book Now',
    href: '/customer',
    highlight: true,
  },
  {
    emoji: '💼',
    name: 'Harshi',
    tag: 'Time-Starved Pro',
    quote: 'No bandwidth to think about this.',
    need: 'Auto-reminders, one-tap re-book',
    cta: 'Set & Forget',
    href: '/customer',
    highlight: false,
  },
  {
    emoji: '🏎️',
    name: 'Vikram',
    tag: 'Car Enthusiast',
    quote: 'Only OEM parts. Show me everything.',
    need: 'Part SKU, batch number, full traceability',
    cta: 'View Details',
    href: '/customer',
    highlight: false,
  },
  {
    emoji: '🔑',
    name: 'Meera',
    tag: 'First-Time Owner',
    quote: "I don't even know what I need.",
    need: 'Guided flow, plain language',
    cta: 'Guide Me',
    href: '/customer',
    highlight: false,
  },
  {
    emoji: '🏢',
    name: 'Rajan',
    tag: 'Fleet Manager',
    quote: '12 company cars. One dashboard.',
    need: 'Bulk booking, GST invoice, SLA tracking',
    cta: 'Fleet Portal',
    href: '/customer',
    highlight: false,
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Tell us your car', desc: 'Make, model, year, KM reading. We map the right OEM parts in seconds.' },
  { step: '02', title: 'Choose your services', desc: 'Transparent pricing before you confirm. Luxury cars get a dedicated quote flow.' },
  { step: '03', title: 'Pick your slot', desc: 'We come to you — home or office. 2-hour service window, no garage visits.' },
  { step: '04', title: 'Track everything', desc: 'Live partner location, before/after photos, part batch numbers on record.' },
];

const STATS = [
  { value: '100+', label: 'Certified Partners' },
  { value: '8', label: 'Bangalore Zones' },
  { value: '2 hrs', label: 'Service Window' },
  { value: '4.8★', label: 'Customer Rating' },
];


export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{ padding: '5rem 1.5rem 3rem', maxWidth: '72rem', margin: '0 auto' }}>
        <div className="fade-up fade-up-1" style={{ marginBottom: '1.5rem' }}>
          <span className="badge badge-accent">
            <Zap size={11} /> Now live across Bangalore
          </span>
        </div>

        <div className="fade-up fade-up-2">
          <h1 style={{ fontSize: 'clamp(2.75rem, 6vw, 5.5rem)', lineHeight: 1.0, marginBottom: '1.5rem', maxWidth: '18ch' }}>
            <span className="font-display">Your car serviced.</span><br />
            <span className="font-display-italic" style={{ color: 'var(--accent)' }}>At your door.</span>
          </h1>
        </div>

        <div className="fade-up fade-up-3">
          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '42ch', lineHeight: 1.7, marginBottom: '2.5rem' }}>
            OEM parts. Certified partners. A 2-hour promise.<br />No garage. No waiting.
          </p>
        </div>

        <div className="fade-up fade-up-4" style={{ marginBottom: '4rem' }}>
          <Link href="/customer" className="btn-accent" style={{ textDecoration: 'none', fontSize: '1rem', padding: '0.875rem 2rem' }}>
            Book a Service <ArrowRight size={17} />
          </Link>
        </div>

      </section>

      {/* ── STATS ── */}
      <section style={{ padding: '0 1.5rem 4rem', maxWidth: '72rem', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1px',
          background: 'var(--border)',
          border: '1px solid var(--border)',
          borderRadius: '1rem',
          overflow: 'hidden',
        }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--bg-card)' }}>
              <div className="font-display" style={{ fontSize: '2.25rem', color: 'var(--accent)', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem', letterSpacing: '0.03em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHO IS THIS FOR ── */}
      <section style={{ padding: '2rem 1.5rem 5rem', maxWidth: '72rem', margin: '0 auto' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="label">Sound familiar?</span>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginTop: '0.35rem' }}>
            <span className="font-display">We built this </span>
            <span className="font-display-italic" style={{ color: 'var(--accent)' }}>for you</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          {PERSONAS.map((p) => (
            <Link key={p.name} href={p.href} style={{ textDecoration: 'none' }}>
              <div
                className="card"
                style={{
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
                  height: '100%',
                  ...(p.highlight ? { borderColor: 'rgba(200,230,80,0.4)', background: 'rgba(200,230,80,0.04)' } : {}),
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.25)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = p.highlight ? 'rgba(200,230,80,0.4)' : 'var(--border)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                  <span style={{ fontSize: '1.75rem' }}>{p.emoji}</span>
                  {p.highlight && <span className="badge badge-accent" style={{ fontSize: '0.58rem' }}>Most common</span>}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{p.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>{p.tag}</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic', marginBottom: '0.6rem', lineHeight: 1.5 }}>
                  "{p.quote}"
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>{p.need}</p>
                <div style={{ color: 'var(--accent)', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  {p.cta} <ArrowRight size={13} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{
        padding: '4rem 1.5rem',
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="label">The experience</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginTop: '0.35rem' }}>
              <span className="font-display">How it </span>
              <span className="font-display-italic" style={{ color: 'var(--accent)' }}>works</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {HOW_IT_WORKS.map((h, i) => (
              <div key={h.step} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute', top: '-0.5rem', right: '1rem',
                  fontSize: '4rem', fontWeight: 800, color: 'rgba(200,230,80,0.07)',
                  fontFamily: 'DM Serif Display, serif', lineHeight: 1, pointerEvents: 'none',
                  userSelect: 'none',
                }}>
                  {h.step}
                </div>
                <div style={{
                  width: '2rem', height: '2rem', borderRadius: '50%',
                  background: 'rgba(200,230,80,0.15)', border: '1px solid rgba(200,230,80,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)',
                  marginBottom: '1rem',
                }}>
                  {i + 1}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{h.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.65 }}>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THREE PORTALS ── */}
      <section style={{ padding: '5rem 1.5rem', maxWidth: '72rem', margin: '0 auto' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="label">Explore the prototype</span>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginTop: '0.35rem' }}>
            <span className="font-display">Three views, </span>
            <span className="font-display-italic" style={{ color: 'var(--accent)' }}>one platform</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {[
            {
              title: 'Customer Flow',
              desc: 'Book a service, select your car, get live pricing, and confirm your slot. The full 4-step booking experience.',
              href: '/customer',
              icon: '👤',
              badge: 'B2C + Fleet',
              primary: true,
            },
            {
              title: 'Partner App',
              desc: 'Parts checklist, job navigation, before/after photo upload. The field partner\'s full job workflow.',
              href: '/partner',
              icon: '🔧',
              badge: 'Field team',
              primary: false,
            },
            {
              title: 'Admin Dashboard',
              desc: 'Live jobs, partner assignment, parts margin per booking, luxury quote queue, inventory alerts.',
              href: '/admin',
              icon: '📊',
              badge: 'Operations',
              primary: false,
            },
          ].map((portal) => (
            <Link key={portal.title} href={portal.href} style={{ textDecoration: 'none' }}>
              <div
                className="card"
                style={{
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
                  height: '100%',
                  ...(portal.primary ? { borderColor: 'rgba(200,230,80,0.35)' } : {}),
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.25)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = portal.primary ? 'rgba(200,230,80,0.35)' : 'var(--border)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2rem' }}>{portal.icon}</span>
                  <span className={`badge ${portal.primary ? 'badge-accent' : 'badge-muted'}`} style={{ fontSize: '0.58rem' }}>{portal.badge}</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.6rem' }}>{portal.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '1.25rem' }}>{portal.desc}</p>
                <div style={{ color: 'var(--accent)', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  Open <ArrowRight size={13} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── DECISION LOG CTA ── */}
      <section style={{ padding: '0 1.5rem 5rem', maxWidth: '72rem', margin: '0 auto' }}>
        <div className="card" style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          background: 'rgba(200,230,80,0.05)',
          borderColor: 'rgba(200,230,80,0.2)',
          padding: '2rem 2rem',
        }}>
          <div>
            <span className="label">Product thinking</span>
            <h3 className="font-display" style={{ fontSize: '1.5rem', marginTop: '0.3rem' }}>
              Read the Decision Log
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem', maxWidth: '48ch', lineHeight: 1.6 }}>
              8 documented decisions — the problem, options considered, what was chosen, and how we'd validate it. The thinking behind the product, not just the product.
            </p>
          </div>
          <Link href="/decisions" className="btn-accent" style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}>
            View Decision Log <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '2rem 1.5rem',
        maxWidth: '72rem',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'var(--accent)', borderRadius: '6px', width: '1.5rem', height: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#0B3B35', fontWeight: 800, fontSize: '0.8rem' }}>S</span>
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>ServiGo — Doorstep Car Servicing, Bangalore</span>
          <span style={{ color: 'var(--border)' }}>·</span>
          <Link href="/about" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textDecoration: 'none', opacity: 0.6 }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = '1'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = '0.6'}>
            Docs
          </Link>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {[
            { label: 'Book a Service', href: '/customer' },
            { label: 'Partner App', href: '/partner' },
            { label: 'Admin', href: '/admin' },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent)'}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)'}>
              {l.label}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
