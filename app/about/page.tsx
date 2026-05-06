'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, ChevronDown, ChevronUp,
  Shield, Brain, BarChart2,
  CheckCircle, AlertTriangle, Lightbulb, Layers, DollarSign
} from 'lucide-react';

// ─── section toggle helper ────────────────────────────────────────────────────
function Section({ title, subtitle, children, defaultOpen = false }: {
  title: string; subtitle: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card" style={{ marginBottom: '1rem', padding: 0, overflow: 'hidden' }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', background: 'none', border: 'none', cursor: 'pointer',
        padding: '1.25rem 1.5rem', textAlign: 'left', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', gap: '1rem',
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{title}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.2rem' }}>{subtitle}</div>
        </div>
        <div style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>
      {open && (
        <div style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ paddingTop: '1.25rem' }}>{children}</div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{label}</span>
      <span style={{ fontWeight: 600, fontSize: '0.875rem', color: highlight ? 'var(--accent)' : 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}

function Callout({ icon, title, body, color = 'accent' }: { icon: React.ReactNode; title: string; body: string; color?: 'accent' | 'warning' | 'danger' }) {
  const bg = color === 'accent' ? 'rgba(200,230,80,0.06)' : color === 'warning' ? 'rgba(255,179,71,0.06)' : 'rgba(255,107,107,0.06)';
  const border = color === 'accent' ? 'rgba(200,230,80,0.2)' : color === 'warning' ? 'rgba(255,179,71,0.2)' : 'rgba(255,107,107,0.2)';
  const c = color === 'accent' ? 'var(--accent)' : color === 'warning' ? 'var(--warning)' : 'var(--danger)';
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: '0.75rem', padding: '1rem 1.25rem', marginBottom: '0.875rem', display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
      <span style={{ color: c, flexShrink: 0, marginTop: '0.1rem' }}>{icon}</span>
      <div>
        <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{title}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.6 }}>{body}</div>
      </div>
    </div>
  );
}

function Metric({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="stat-card" style={{ textAlign: 'center' }}>
      <div className="font-display" style={{ fontSize: '1.75rem', color: 'var(--accent)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontWeight: 600, fontSize: '0.78rem', marginTop: '0.3rem' }}>{label}</div>
      {sub && <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem', marginTop: '0.15rem' }}>{sub}</div>}
    </div>
  );
}

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>

      {/* ── HEADER ── */}
      <div style={{ marginBottom: '3rem' }}>
        <span className="label">Product Brief + Assessment Submission</span>
        <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.05, marginTop: '0.35rem' }}>
          ServiGo — <span className="font-display-italic" style={{ color: 'var(--accent)' }}>Full Brief</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '52ch', lineHeight: 1.7, marginTop: '0.75rem' }}>
          This page documents the complete product thinking behind ServiGo — market sizing, unit economics, assumptions, AI roadmap, and how every decision maps to the MVPRockets PM role. Built by Monish Nallagondalla Srinath as an assessment submission.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1.5rem', alignItems: 'center' }}>
          <a href="mailto:nsmonish@gmail.com" style={{ color: 'var(--accent)', fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            ✉ nsmonish@gmail.com
          </a>
          <span style={{ color: 'var(--border)' }}>·</span>
          <a href="tel:+919538809196" style={{ color: 'var(--accent)', fontSize: '0.875rem', textDecoration: 'none' }}>
            📞 +91 95388 09196
          </a>
          <span style={{ color: 'var(--border)' }}>·</span>
          <Link href="/decisions" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none' }}>
            8 Decision Log entries →
          </Link>
        </div>
      </div>

      {/* ── DOCS HUB ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ background: 'rgba(200,230,80,0.05)', borderColor: 'rgba(200,230,80,0.25)', padding: '1.25rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.625rem' }}>📋</div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.3rem' }}>Product Brief</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: 1.55, marginBottom: '1rem' }}>
            Market sizing, unit economics, assumptions, AI roadmap, 18-month plan, competitive analysis. Full McKinsey-level strategy doc.
          </div>
          <div style={{ color: 'var(--accent)', fontSize: '0.78rem', fontWeight: 600 }}>↓ You are here</div>
        </div>
        <Link href="/decisions" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ height: '100%', padding: '1.25rem', cursor: 'pointer', transition: 'border-color 0.2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)'}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.625rem' }}>🧠</div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.3rem' }}>Decision Log</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: 1.55, marginBottom: '1rem' }}>
              8 documented product decisions — problem, options, chosen, rationale, validation criteria. The thinking behind every feature.
            </div>
            <div style={{ color: 'var(--accent)', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              Open <ArrowRight size={13} />
            </div>
          </div>
        </Link>
      </div>

      {/* ── QUICK NAV ── */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1rem 1.5rem', background: 'rgba(200,230,80,0.04)', borderColor: 'rgba(200,230,80,0.2)' }}>
        <div style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>What's in this brief</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.4rem' }}>
          {[
            '01 — Problem & Opportunity',
            '02 — Market Sizing (TAM/SAM/SOM)',
            '03 — Unit Economics',
            '04 — Business Model Assumptions',
            '05 — User Personas & Jobs-to-be-Done',
            '06 — Product Architecture',
            '07 — Operations Model',
            '08 — Competitive Landscape',
            '09 — AI Roadmap',
            '10 — 18-Month Product Roadmap',
            '11 — Risks & Mitigations',
          ].map(item => (
            <div key={item} style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ color: 'var(--accent)', fontSize: '0.65rem' }}>▸</span> {item}
            </div>
          ))}
        </div>
      </div>

      {/* ── 01 PROBLEM ── */}
      <Section title="01 — Problem & Opportunity" subtitle="Why this market, why now, why doorstep" defaultOpen={true}>
        <Callout icon={<AlertTriangle size={16} />} title="The core problem" color="warning"
          body="Car servicing in India is broken for car owners. Authorised service centres have 2–4 week wait times, are geographically inconvenient, and are opaque on pricing and parts. Multi-brand workshops are cheaper but untrustworthy on parts authenticity. Neither builds a relationship with the car owner over time." />

        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem' }}>The five friction points ServiGo removes</div>
          {[
            { n: '1', title: 'Time friction', body: 'Dropping a car at a service centre costs half a day minimum. ServiGo comes to you in a 2-hour window.' },
            { n: '2', title: 'Pricing opacity', body: 'No service centre shows you the parts cost before you commit. ServiGo shows full breakdown — parts, labour, surcharge, GST — before booking confirmation.' },
            { n: '3', title: 'Parts authenticity', body: 'Multi-brand workshops use grey-market parts. ServiGo supplies OEM parts from verified distributors, with batch numbers traceable by the customer.' },
            { n: '4', title: 'Trust deficit', body: 'Customers have no proof of what was actually done. ServiGo enforces before/after photos at the partner app level — structurally, not by policy.' },
            { n: '5', title: 'Scheduling inertia', body: 'Most people delay servicing because booking is effortful. ServiGo captures KM at onboarding and proactively reminds — turning a reactive chore into a managed schedule.' },
          ].map(f => (
            <div key={f.n} style={{ display: 'flex', gap: '0.875rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', background: 'rgba(200,230,80,0.15)', border: '1px solid rgba(200,230,80,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>{f.n}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{f.title}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.15rem', lineHeight: 1.55 }}>{f.body}</div>
              </div>
            </div>
          ))}
        </div>

        <Callout icon={<Lightbulb size={16} />} title="Why now" color="accent"
          body="India crossed 30M registered private cars in 2023. UPI penetration means digital payments are frictionless even for cash-first customers. Gig economy normalisation means service partners are available and familiar with app-based job dispatch. The Swiggy/Zomato generation expects on-demand. Doorstep car servicing is the logical next category." />
      </Section>

      {/* ── 02 MARKET SIZING ── */}
      <Section title="02 — Market Sizing (TAM / SAM / SOM)" subtitle="Bottom-up and top-down, India and Bangalore">
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.875rem' }}>Top-down: India car servicing market</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
            <Metric value="₹1.1L Cr" label="TAM" sub="India car servicing market 2024" />
            <Metric value="₹12,000 Cr" label="SAM" sub="Organised, metro Tier-1 cities" />
            <Metric value="₹480 Cr" label="SOM Y3" sub="Bangalore + 2 cities at 4% share" />
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6, padding: '0.75rem', background: 'var(--bg-surface)', borderRadius: '0.6rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Assumptions:</strong> India has ~32M registered private cars. Average servicing frequency: 2×/year. Average spend per service: ₹3,500 (blended across tiers). Total = ₹32M × 2 × ₹3,500 = ₹2.24L Cr. Organised segment (authorised + multi-brand workshop) ~50% = ₹1.1L Cr TAM. SAM = metro Tier-1 (Delhi, Mumbai, Bangalore, Hyderabad, Chennai, Pune) = ~11M cars × 2 × ₹3,500 × 50% organised = ₹38,500 Cr narrowed to digitally-addressable (30%) = ₹11,550 Cr ≈ ₹12,000 Cr. SOM = Bangalore (2.8M cars) × 15% digital adoption × 2 services × ₹3,500 × 65% ServiGo average ticket × 4% market share = ₹480 Cr.
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.875rem' }}>Bottom-up: Bangalore unit build</div>
          {[
            { label: 'Bangalore registered private cars', value: '2.8M' },
            { label: 'Serviceable (within 8 zones, excludes commercial)', value: '1.4M' },
            { label: 'Digital-first, income bracket ₹8L+', value: '420,000' },
            { label: 'Willing to pay for convenience (est. 30%)', value: '126,000 addressable users' },
            { label: 'Y1 target (4% of addressable)', value: '5,040 active users' },
            { label: 'Avg bookings/user/year', value: '2.2' },
            { label: 'Avg booking value (blended)', value: '₹2,800' },
            { label: 'Y1 GMV target', value: '₹3.1 Cr' },
            { label: 'Y1 net revenue (32% margin on parts + ₹100 fee)', value: '₹99L' },
          ].map(r => <Row key={r.label} label={r.label} value={r.value} highlight={r.label.includes('Y1 net')} />)}
        </div>
      </Section>

      {/* ── 03 UNIT ECONOMICS ── */}
      <Section title="03 — Unit Economics" subtitle="Per booking, per partner, per month — fully modelled">
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.875rem' }}>Per booking (Standard tier — most common)</div>
          {[
            { label: 'Avg parts cost (OEM, ex-markup)', value: '₹950' },
            { label: 'ServiGo parts markup (32%)', value: '₹304', highlight: true },
            { label: 'Labour (flat, partner payout)', value: '₹300' },
            { label: 'Platform fee (customer-facing)', value: '₹100' },
            { label: 'GST collected (18% on pre-GST total)', value: '₹243' },
            { label: 'Total customer invoice', value: '₹1,897' },
            { label: 'Rider payout (labour + delivery allowance ₹80)', value: '₹380' },
            { label: 'Parts COGS', value: '₹950' },
            { label: 'Contribution margin per booking', value: '₹367 (19.4%)', highlight: true },
          ].map(r => <Row key={r.label} label={r.label} value={r.value} highlight={(r as any).highlight} />)}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.875rem' }}>Per partner per month</div>
          {[
            { label: 'Jobs/day target', value: '4–5' },
            { label: 'Working days/month', value: '24' },
            { label: 'Monthly jobs per partner', value: '96–120' },
            { label: 'Monthly GMV per partner', value: '₹1.82L–₹2.28L' },
            { label: 'Monthly contribution margin per partner', value: '₹35,300–₹44,200', highlight: true },
            { label: 'Partner monthly fixed cost (payout + kit + bike)', value: '₹18,000' },
            { label: 'Net margin per partner per month', value: '₹17,300–₹26,200', highlight: true },
          ].map(r => <Row key={r.label} label={r.label} value={r.value} highlight={(r as any).highlight} />)}
        </div>

        <Callout icon={<DollarSign size={16} />} title="Path to unit economics profitability" color="accent"
          body="A single partner hitting 4 jobs/day generates ₹17,300+ net margin/month for the platform. At 8 partners (current Bangalore mock), monthly platform margin = ₹1.38L–₹2.1L. Break-even at city level requires ~15 active partners at 80% utilisation. Bangalore break-even = Month 8 at current growth assumptions." />

        <div>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.875rem' }}>Luxury tier premium economics</div>
          {[
            { label: 'Avg parts cost (BMW 5 Series oil change)', value: '₹4,000' },
            { label: 'Parts markup (32% base + 30% sourcing surcharge)', value: '₹2,496', highlight: true },
            { label: 'Labour (flat)', value: '₹300' },
            { label: 'Platform fee', value: '₹100' },
            { label: 'Total pre-GST', value: '₹6,896' },
            { label: 'GST (18%)', value: '₹1,241' },
            { label: 'Customer invoice', value: '₹8,137' },
            { label: 'Net margin per booking', value: '₹2,316 (28.5%)', highlight: true },
          ].map(r => <Row key={r.label} label={r.label} value={r.value} highlight={(r as any).highlight} />)}
        </div>
      </Section>

      {/* ── 04 ASSUMPTIONS ── */}
      <Section title="04 — Business Model Assumptions" subtitle="Every number, every constraint, made explicit">
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem' }}>Demand assumptions</div>
          {[
            { label: 'Service frequency per car per year', value: '2.2× (CRISIL industry average)' },
            { label: 'Bangalore digital-first car owners', value: '420,000 (15% of 2.8M registered cars)' },
            { label: 'Willingness to pay convenience premium', value: '30% of digital-first (₹200–400 above workshop price)' },
            { label: 'Same-day booking conversion (Rahul persona)', value: '68% (urgency = high intent)' },
            { label: 'Repeat booking rate D30', value: '35% target (KM reminder trigger)' },
            { label: 'Fleet account % of GMV by Y2', value: '22% (50 accounts × 10 cars avg)' },
          ].map(r => <Row key={r.label} label={r.label} value={r.value} />)}
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem' }}>Supply assumptions</div>
          {[
            { label: 'Partner onboarding cost', value: '₹4,200 (training + toolkit + first kit)' },
            { label: 'Partner churn rate (monthly)', value: '8% (gig economy baseline)' },
            { label: 'Parts procurement lead time (standard)', value: 'Same day from local OEM distributor' },
            { label: 'Parts procurement lead time (luxury)', value: '3–7 days from authorised importer' },
            { label: 'Kiosk inventory working capital (per zone)', value: '₹1.8L (standard) / ₹4.2L (premium+luxury)' },
            { label: 'Parts spoilage / wastage rate', value: '2.5% of inventory value/month' },
          ].map(r => <Row key={r.label} label={r.label} value={r.value} />)}
        </div>

        <div>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem' }}>Pricing assumptions</div>
          {[
            { label: 'Parts markup — standard tier', value: '32% on OEM procurement cost' },
            { label: 'Parts markup — premium tier', value: '32% base + 15% sourcing surcharge' },
            { label: 'Parts markup — luxury tier', value: '32% base + 30% sourcing surcharge' },
            { label: 'Parts markup — ultra luxury', value: '32% base + 45% sourcing surcharge' },
            { label: 'Platform fee', value: '₹100 flat (psychological anchor, not revenue centre)' },
            { label: 'GST applicability', value: '18% on parts + labour + platform fee (pre-surcharge base)' },
            { label: 'Labour rate', value: 'Flat ₹150–500 per service (not tier-adjusted — labour is distribution cost)' },
          ].map(r => <Row key={r.label} label={r.label} value={r.value} />)}
        </div>
      </Section>

      {/* ── 05 PERSONAS ── */}
      <Section title="05 — User Personas & Jobs-to-be-Done" subtitle="5 personas, distinct JTBD, one product">
        {[
          {
            name: 'Rahul', tag: 'Deadline Driver', emoji: '🚗', priority: 'PRIMARY',
            jtbd: 'When I realise my service is overdue before a trip, I want to get it done today with zero friction, so I can stop worrying about it.',
            pain: 'Service centre 2-week wait, no same-day option, afraid car will break down.',
            value: 'Same-day booking, 60-second confirmation, 2-hour slot.',
            metric: 'D1 conversion rate > 65%, time-to-book < 4 minutes.',
            ltv: '₹6,160/year (2.2 bookings × ₹2,800 avg)',
          },
          {
            name: 'Harshi', tag: 'Time-Starved Pro', emoji: '💼', priority: 'RETENTION',
            jtbd: 'When my car is due for service, I want to be reminded and re-booked automatically, so I never have to think about it.',
            pain: 'No headspace for scheduling, misses services, worries about warranty.',
            value: 'KM-triggered reminders, saved car profile, one-tap re-book.',
            metric: 'D30 re-book rate > 40%, reminder open rate > 55%.',
            ltv: '₹11,200/year (4 bookings × ₹2,800, on subscription by Y1)',
          },
          {
            name: 'Vikram', tag: 'Car Enthusiast', emoji: '🏎️', priority: 'NPS DRIVER',
            jtbd: 'When I service my car, I want to verify every part used is genuine OEM with traceable batch numbers, so I know my car is not compromised.',
            pain: 'Cannot verify parts authenticity, no traceability, does not trust workshops.',
            value: 'Part SKU + batch number shown pre-service, before/after photos.',
            metric: 'NPS > 70 for Vikram segment, parts transparency rating > 4.8.',
            ltv: '₹18,000/year (luxury tier, 2 services × ₹9,000 avg)',
          },
          {
            name: 'Meera', tag: 'First-Time Owner', emoji: '🔑', priority: 'VOLUME',
            jtbd: 'When I need to service my car, I want to be guided through what I actually need without technical jargon, so I don\'t feel cheated.',
            pain: 'No idea what services are needed, afraid of being oversold, embarrassed to ask.',
            value: 'KM-based service recommendations, plain language, guided 4-step flow.',
            metric: 'Step 1 completion rate > 80%, upsell attach rate < 15% (do not oversell).',
            ltv: '₹5,600/year (2 bookings × ₹2,800)',
          },
          {
            name: 'Rajan', tag: 'Fleet Manager', emoji: '🏢', priority: 'ENTERPRISE WEDGE',
            jtbd: 'When I manage 12 company cars, I want consolidated billing, SLA tracking, and GST invoices, so I can manage the fleet without ops overhead.',
            pain: 'Multiple vendors, no consolidated view, GST compliance nightmare, no SLA.',
            value: 'Fleet dashboard, bulk booking, consolidated GST invoice, per-vehicle history.',
            metric: 'Fleet account churn < 5%/month, avg fleet size > 8 vehicles, invoice NPS > 80.',
            ltv: '₹74,000/year (10 cars × 2.2 services × ₹3,360 blended)',
          },
        ].map(p => (
          <div key={p.name} className="card" style={{ marginBottom: '0.875rem', background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.875rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{p.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700 }}>{p.name}</span>
                  <span className="badge badge-muted" style={{ fontSize: '0.58rem' }}>{p.tag}</span>
                  <span className="badge badge-accent" style={{ fontSize: '0.58rem' }}>{p.priority}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Est. LTV</div>
                <div style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '0.875rem' }}>{p.ltv}</div>
              </div>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '0.5rem', lineHeight: 1.55 }}>"{p.jtbd}"</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.75rem' }}>
              {[
                { l: 'Pain', v: p.pain },
                { l: 'Value prop', v: p.value },
                { l: 'Success metric', v: p.metric },
              ].map(item => (
                <div key={item.l} style={{ gridColumn: item.l === 'Success metric' ? 'span 2' : 'auto' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.15rem' }}>{item.l}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.v}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>

      {/* ── 06 PRODUCT ARCHITECTURE ── */}
      <Section title="06 — Product Architecture" subtitle="Three surfaces, one data layer, designed to compound">
        <Callout icon={<Layers size={16} />} title="The architecture principle" color="accent"
          body="ServiGo is not three separate apps. It is one data platform with three views. Every booking creates data that improves all three surfaces simultaneously — customer gets better recommendations, partner gets better dispatch, admin gets better ops visibility." />

        {[
          {
            surface: 'Customer Portal', icon: '👤', purpose: 'Acquisition, conversion, retention',
            flows: ['4-step booking flow (persona → car → services → schedule)', 'KM-based service recommendations', 'Instant pricing with GST breakdown', 'Quote flow for luxury/ultra tier', 'Post-service: before/after photos, part batch numbers', 'KM reminder re-engagement (retention engine)'],
            dataCapture: 'Car profile, KM reading, service history, payment preference, persona signal',
          },
          {
            surface: 'Partner App', icon: '🔧', purpose: 'Dispatch, execution, proof-of-service',
            flows: ['Job list sorted by slot time', 'Pre-departure parts checklist (blocked until complete)', 'Customer navigation via Maps', 'Before photo upload (blocked before service start)', 'Parts checklist execution', 'After photo upload (blocked before job completion)', 'Payment collection confirmation'],
            dataCapture: 'Parts consumed, service duration, part batch numbers, photo timestamps, location on arrival',
          },
          {
            surface: 'Admin Dashboard', icon: '📊', purpose: 'Ops control, P&L visibility, quality assurance',
            flows: ['Action Centre — quote queue + unassigned bookings with elapsed time', 'Partner assignment recommendation engine (zone + certification match)', 'Status progression with admin override', 'Parts margin per booking (32% target)', 'Inventory alerts with at-risk booking linkage', 'Zone density heatmap for supply planning'],
            dataCapture: 'Assignment patterns, SLA adherence, margin per booking, inventory velocity, partner utilisation',
          },
        ].map(s => (
          <div key={s.surface} className="card" style={{ marginBottom: '0.875rem', background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{s.surface}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{s.purpose}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Flows</div>
                {s.flows.map(f => (
                  <div key={f} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.3rem', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--accent)', fontSize: '0.6rem', marginTop: '0.25rem', flexShrink: 0 }}>▸</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Data captured</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{s.dataCapture}</div>
              </div>
            </div>
          </div>
        ))}
      </Section>

      {/* ── 07 OPS MODEL ── */}
      <Section title="07 — Operations Model" subtitle="How a job actually gets done, end to end">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {[
            { t: 'T+0', event: 'Customer books', detail: 'Booking confirmed, slot locked. Parts order triggered automatically from nearest kiosk inventory.' },
            { t: 'T+15m', event: 'Partner assigned', detail: 'Admin assigns nearest available certified partner. Partner receives job notification with customer address and parts list.' },
            { t: 'T–90m', event: 'Parts prepared', detail: 'Kiosk manager prepares parts kit per booking. Partner confirms pickup via app checklist. No departure until all parts ticked.' },
            { t: 'T–30m', event: 'Partner en route', detail: 'Partner departs kiosk. Customer notified with partner name, rating, and live location. 2-hour window begins.' },
            { t: 'T+0', event: 'Service slot', detail: 'Partner arrives. Before photo mandatory. Services performed. Part batch numbers logged.' },
            { t: 'T+2h', event: 'Job complete', detail: 'After photo mandatory. Job cannot be marked complete without both photos. Payment collected. Customer receives photo proof automatically.' },
            { t: 'T+24h', event: 'Data logged', detail: 'Service history updated. Next service date calculated from KM. Reminder scheduled. Parts consumption updates inventory.' },
          ].map((step, i) => (
            <div key={step.t} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: 'rgba(200,230,80,0.15)', border: '1px solid rgba(200,230,80,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>{step.t}</div>
                {i < 6 && <div style={{ width: '1px', flex: 1, background: 'var(--border)', margin: '0.25rem 0', minHeight: '1.5rem' }} />}
              </div>
              <div style={{ paddingBottom: '1rem', flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{step.event}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.2rem', lineHeight: 1.55 }}>{step.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 08 COMPETITIVE ── */}
      <Section title="08 — Competitive Landscape" subtitle="Where ServiGo sits and why it wins">
        <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['', 'Authorised SC', 'Multi-brand Workshop', 'GoMechanic / Carcility', 'ServiGo'].map(h => (
                  <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: h === 'ServiGo' ? 'var(--accent)' : 'var(--text-muted)', fontWeight: h === 'ServiGo' ? 700 : 500, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Doorstep service', '✗', '✗', '✓', '✓'],
                ['OEM parts verified', '✓', '✗', 'Partial', '✓'],
                ['Transparent pricing pre-booking', '✗', '✗', 'Partial', '✓'],
                ['Batch number traceability', '✓', '✗', '✗', '✓'],
                ['Same-day availability', '✗', '✓', '✓', '✓'],
                ['Before/after photo proof', '✗', '✗', '✗', '✓'],
                ['Fleet management', '✗', '✗', 'Basic', '✓'],
                ['KM-based proactive reminders', '✗', '✗', '✗', '✓'],
                ['Luxury car capability', '✓', '✗', '✗', '✓ (quote flow)'],
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{
                      padding: '0.5rem 0.75rem',
                      color: j === 4 ? 'var(--accent)' : cell === '✗' ? 'rgba(255,107,107,0.7)' : 'var(--text-muted)',
                      fontWeight: j === 4 || j === 0 ? 600 : 400,
                    }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout icon={<Shield size={16} />} title="Sustainable moat" color="accent"
          body="GoMechanic collapsed in 2023 due to unit economics fraud — they subsidised pricing and couldn't sustain it. ServiGo's moat is the opposite: parts markup is structurally embedded in the price, invisible to the customer, and defensible because OEM supply chain relationships compound over time. The data layer (vehicle service history) becomes the secondary moat at 18 months." />
      </Section>

      {/* ── 09 AI ROADMAP ── */}
      <Section title="09 — AI Roadmap" subtitle="5 AI features, prioritised by impact and build cost">
        <Callout icon={<Brain size={16} />} title="AI philosophy for ServiGo" color="accent"
          body="Every AI feature must reduce ops overhead, increase booking conversion, or improve retention. No AI for its own sake. Each feature below has a clear before/after metric and a defined trigger to build it." />

        {[
          {
            phase: 'Now — Ship at MVP',
            features: [
              {
                name: 'KM-based service recommender',
                what: 'Rules engine (not ML yet) that maps KM reading → recommended services. At 10,000 KM: oil change. At 15,000: air filter. At 30,000: brake pads.',
                why: 'Meera persona cannot self-diagnose. This removes the biggest drop-off point in Step 2. Also prevents overselling by setting explicit recommendation thresholds.',
                build: 'Already built in lib/data.ts as getRecommendation(). Zero ML required at this stage.',
                metric: 'Step 2 completion rate. Baseline without recommender vs with. Target +15%.',
              },
            ],
          },
          {
            phase: 'Month 3 — Post-PMF validation',
            features: [
              {
                name: 'Proactive service reminder engine',
                what: 'At booking, capture KM. Calculate next service date based on 5,000–7,500 KM increments (Maruti standard is 7,500 KM intervals). Send push + WhatsApp reminder at 90% of interval.',
                why: 'Harshi persona never re-books without a nudge. D30 re-book rate is the key retention metric. This is the invisible retention engine referenced in D001.',
                build: 'KM at last service + avg monthly KM driven (estimated from service history). Trigger at predicted 85% interval. WhatsApp Business API + push notification.',
                metric: 'D30 re-book rate. Baseline (no reminder): ~18%. With reminder: target >35%. Each 1% improvement = ~250 additional bookings/month at 25,000 users.',
              },
              {
                name: 'Smart partner dispatch (ML matching)',
                what: 'Instead of admin manually assigning partners, rank available partners by: (1) zone proximity score, (2) certification tier match, (3) current workload, (4) historical completion rate for this service type.',
                why: 'Manual dispatch is an ops bottleneck. At 50+ daily bookings, admin cannot review each one. Automating dispatch removes the human-in-the-loop for 80% of standard bookings.',
                build: 'Weighted scoring function initially (no ML). Collect assignment + outcome data for 3 months, then train a simple ranking model. Input: booking features + partner features. Output: ranked list.',
                metric: 'Admin time-per-dispatch. Current: ~4 min/booking. Target: <30 seconds (human reviews pre-ranked suggestion). At 50 bookings/day = 2.9 hours saved daily.',
              },
            ],
          },
          {
            phase: 'Month 6 — Scale operations',
            features: [
              {
                name: 'Dynamic pricing engine',
                what: 'Adjust parts markup by 2–5% based on demand signals: day-of-week, zone congestion, parts inventory level, seasonal demand spikes (pre-festival, monsoon onset).',
                why: 'Fixed 32% markup leaves money on the table during high-demand periods. Uber proved that surge pricing is accepted when framed as "slot availability" not "price increase".',
                build: 'Time-series demand model on booking data. Input: day, zone, car tier, inventory level. Output: recommended markup multiplier (0.95x to 1.08x). Human override always available.',
                metric: 'Blended margin %. Baseline 32%. Target 34–35% with dynamic pricing. On ₹3 Cr GMV = ₹6L additional annual margin.',
              },
              {
                name: 'Photo-based damage detection (CV)',
                what: 'Computer vision model trained on before/after photos to: (1) flag photos where car condition changed during service (potential damage), (2) verify before photo was taken pre-service (timestamp + EXIF), (3) auto-generate service report from photos.',
                why: 'Trust is ServiGo\'s core moat. One damage incident that goes undetected destroys 10 positive reviews. Structural detection is 100x more reliable than policy enforcement.',
                build: 'Fine-tune a pre-trained vision model (CLIP or ResNet) on annotated before/after pairs. Label: same condition / condition change. MVP: binary classifier. V2: damage localisation.',
                metric: 'Damage detection rate. False positive rate <2% (avoid false accusations). Customer trust score (post-service NPS). Target: damage incidents caught before customer complaint >90%.',
              },
              {
                name: 'Predictive inventory management',
                what: 'Forecast parts demand by SKU, zone, and week using booking history + seasonal patterns. Auto-generate purchase orders when projected stock-out risk > 15% within 7 days.',
                why: 'Wrong parts on arrival = rescheduled job = 1-star review + refund + ops cost. At scale, manual inventory management breaks. Predictive reorder prevents stock-outs before they happen.',
                build: 'Time-series model (Prophet or simple ARIMA) on weekly parts consumption by SKU and zone. Input: historical consumption, pending bookings, seasonal flags. Output: 7-day demand forecast + reorder recommendation.',
                metric: 'Stock-out rate. Baseline (manual): ~4% of bookings affected. Target with ML: <0.5%. Wrong-parts-on-arrival rate: target 0%.',
              },
            ],
          },
        ].map(phase => (
          <div key={phase.phase} style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
              <span className="badge badge-accent" style={{ fontSize: '0.62rem' }}>{phase.phase}</span>
            </div>
            {phase.features.map(f => (
              <div key={f.name} className="card" style={{ marginBottom: '0.75rem', background: 'var(--bg-surface)', borderLeft: '3px solid var(--accent)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Brain size={14} style={{ color: 'var(--accent)' }} /> {f.name}
                </div>
                {[
                  { l: 'What', v: f.what },
                  { l: 'Why (business case)', v: f.why },
                  { l: 'How to build', v: f.build },
                  { l: 'Success metric', v: f.metric },
                ].map(item => (
                  <div key={item.l} style={{ marginBottom: '0.6rem' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{item.l}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.v}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </Section>

      {/* ── 10 ROADMAP ── */}
      <Section title="10 — 18-Month Product Roadmap" subtitle="Sequenced by value delivery and de-risking">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {[
            {
              period: 'Month 0–2: Foundation (now)',
              theme: 'Prove the core loop works',
              bets: ['4-step customer booking flow (live)', 'Partner app with enforced checklist + photos (live)', 'Admin dispatch console with status management (live)', 'Manual OEM parts procurement (Koramangala + Indiranagar zones)', '20 bookings/day target. Validate: completion rate, NPS, margin %'],
              risk: 'Parts supply chain reliability. Mitigation: single trusted distributor per zone, 3-day buffer stock.',
            },
            {
              period: 'Month 3–5: Retention loop',
              theme: 'Turn Rahul into Harshi',
              bets: ['KM-triggered service reminders (WhatsApp + push)', 'Saved car profiles + one-tap re-book', 'Post-service photo delivery to customer (automated)', 'Expand to 4 more zones (HSR, Whitefield, Marathahalli, Jayanagar)', 'Fleet account pilot: 3 corporate accounts'],
              risk: 'D30 re-book rate below 20%. Mitigation: A/B test reminder copy and timing. Add explicit CTA in reminder.',
            },
            {
              period: 'Month 6–9: Scale supply',
              theme: 'Remove ops as the bottleneck',
              bets: ['Smart partner dispatch (auto-assignment for standard tier)', 'Predictive inventory reorder', 'Partner performance dashboard (rating trends, completion %, no-show rate)', 'Luxury tier at scale (3 certified luxury partners per zone)', 'GST invoice automation for fleet accounts'],
              risk: 'Partner quality degradation at scale. Mitigation: monthly certification renewal, performance-based incentive top-up.',
            },
            {
              period: 'Month 10–14: Data moat',
              theme: 'Build the asset that compounds',
              bets: ['Vehicle service history API (internal — powers recommendations)', 'Dynamic pricing engine (2–5% markup adjustment by demand signal)', 'Photo-based damage detection (CV model, v1)', 'Subscription tier launch (Harshi-optimised: ₹999/year = 2 reminders + priority slot)', 'City 2 launch (Hyderabad or Pune — fleet density > consumer density)'],
              risk: 'Subscription churn if reminder experience is poor. Mitigation: gate subscription on having 2+ completed bookings.',
            },
            {
              period: 'Month 15–18: Platform play',
              theme: 'ServiGo as the vehicle data platform',
              bets: ['Insurance partnership: verified service history reduces premium (pilot with 1 insurer)', 'Used car platform integration: Cars24/Spinny verified service badge', 'OEM data partnership: anonymised parts consumption data sold to OEMs', 'Series A narrative: 50,000 vehicles on platform, 2 cities, ₹18 Cr ARR run rate'],
              risk: 'Regulatory on data monetisation. Mitigation: explicit consent at onboarding for data sharing. Anonymised-only at MVP.',
            },
          ].map((phase, i) => (
            <div key={phase.period} className="card" style={{ background: 'var(--bg-surface)', borderLeft: `3px solid ${i === 0 ? 'var(--accent)' : 'var(--border)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{phase.period}</div>
                  <div style={{ color: 'var(--accent)', fontSize: '0.78rem', marginTop: '0.1rem', fontStyle: 'italic' }}>"{phase.theme}"</div>
                </div>
                {i === 0 && <span className="badge badge-accent" style={{ fontSize: '0.58rem' }}>Current</span>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Bets</div>
                  {phase.bets.map(b => (
                    <div key={b} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.3rem', alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--accent)', fontSize: '0.6rem', marginTop: '0.25rem', flexShrink: 0 }}>▸</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{b}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--danger)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Key risk</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{phase.risk}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 11 RISKS ── */}
      <Section title="11 — Risks & Mitigations" subtitle="What could kill this and how we de-risk each one">
        {[
          { risk: 'Parts supply chain failure', severity: 'HIGH', mitigation: 'Single-distributor dependency per zone. Mitigation: dual-source from day 1 for top 4 SKUs. Buffer stock = 3-day demand. No booking confirmed without parts availability check for luxury tier.' },
          { risk: 'Partner quality at scale', severity: 'HIGH', mitigation: 'Partners are the product. At >20 partners, quality degrades without structure. Mitigation: monthly recertification, photo quality score, customer rating floor (< 4.2 = retraining), performance-based incentive top-up.' },
          { risk: 'GoMechanic-style unit economics pressure', severity: 'HIGH', mitigation: 'GoMechanic subsidised prices and raised capital to cover the gap. ServiGo\'s margin is structural (parts markup), not subsidised. Monitor blended margin % weekly. If below 28%, immediately pause luxury tier expansion until supply costs normalise.' },
          { risk: 'Customer trust incident (damage claim)', severity: 'MEDIUM', mitigation: 'Structural mitigation: before/after photos mandatory. Parts batch numbers logged. ₹5,000 damage insurance per job (partner-side). Clear claims process within 24 hours. One mishandled damage claim = 10 negative reviews.' },
          { risk: 'Competitor clone (well-funded)', severity: 'MEDIUM', mitigation: 'Speed is the moat at MVP stage. OEM supply chain relationships take 6–9 months to build. Fleet account relationships are sticky (switching cost = retraining + new GST setup). Data moat kicks in at 10,000 vehicles — race to get there first.' },
          { risk: 'Regulatory (motor vehicle workshop licensing)', severity: 'LOW', mitigation: 'ServiGo is a marketplace, not a workshop. Partners operate as independent service technicians. Monitor CMVR amendments. Legal opinion before city 2 expansion.' },
        ].map(r => (
          <Callout key={r.risk} icon={<AlertTriangle size={15} />}
            title={`${r.risk} — Severity: ${r.severity}`}
            body={r.mitigation}
            color={r.severity === 'HIGH' ? 'danger' : r.severity === 'MEDIUM' ? 'warning' : 'accent'} />
        ))}
      </Section>

      {/* ── FOOTER CTA ── */}
      <div className="card" style={{ marginTop: '2rem', textAlign: 'center', background: 'rgba(200,230,80,0.05)', borderColor: 'rgba(200,230,80,0.2)', padding: '2rem' }}>
        <h3 className="font-display" style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Explore the prototype</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', maxWidth: '40ch', margin: '0 auto 1.5rem' }}>
          Every decision above is reflected in a specific interaction. The best way to evaluate the thinking is to use it.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/customer" className="btn-accent" style={{ textDecoration: 'none', fontSize: '0.875rem' }}>Customer Flow <ArrowRight size={14} /></Link>
          <Link href="/admin" className="btn-ghost" style={{ textDecoration: 'none', fontSize: '0.875rem' }}>Admin Dashboard</Link>
          <Link href="/decisions" className="btn-ghost" style={{ textDecoration: 'none', fontSize: '0.875rem' }}>Decision Log</Link>
        </div>
        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <a href="mailto:nsmonish@gmail.com" style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textDecoration: 'none' }}>nsmonish@gmail.com</a>
          <a href="tel:+919538809196" style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textDecoration: 'none' }}>+91 95388 09196</a>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Monish Nallagondalla Srinath</span>
        </div>
      </div>

    </div>
  );
}
