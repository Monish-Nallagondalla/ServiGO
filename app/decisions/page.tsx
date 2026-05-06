'use client';
import { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Decision {
  id: string;
  category: string;
  title: string;
  problem: string;
  options: { label: string; pro: string; con: string }[];
  chosen: string;
  rationale: string;
  measure: string;
  deferred?: string;
  insight?: string;
}

// ── All decisions ─────────────────────────────────────────────────────────────
const DECISIONS: Decision[] = [
  {
    id: 'D001',
    category: 'Strategy',
    title: 'Primary persona: Rahul (Deadline Driver) over Harshi (Recurring Pro)',
    problem: 'Two distinct customer jobs exist — urgency-driven single booking (Rahul) and low-friction recurring need (Harshi). Optimising for both simultaneously dilutes the experience for both.',
    options: [
      { label: 'Design for Rahul', pro: 'High urgency = high conversion. He tells 10 people if it works. Acquisition engine.', con: 'Low repeat rate. CAC-heavy if he never comes back.' },
      { label: 'Design for Harshi', pro: 'Predictable recurring revenue. Lower CAC over time. Subscription candidate.', con: 'Longer onboarding. Harder to demonstrate value on first visit.' },
      { label: 'Design for both equally', pro: 'Wider appeal.', con: 'Classic product dilution. Neither persona feels the product was built for them.' },
    ],
    chosen: 'Design for Rahul. Build the retention engine invisibly for Harshi.',
    rationale: 'Rahul drives first conversion and word-of-mouth. But the product secretly optimises for Harshi — KM captured at onboarding enables proactive service reminders, saved car profile enables one-tap re-book. Harshi benefits without a dedicated onboarding path. Rahul becomes Harshi after his second booking.',
    measure: 'D30 rebooking rate. If >35% of Rahul-type users rebook within 30 days without a reminder, the invisible retention loop is working. If <20%, add explicit reminder nudge.',
    insight: 'The KM field in onboarding is not just for pricing. It is the entire retention engine. One data point unlocks proactive outreach, service scheduling, and the subscription tier at 6 months.',
  },
  {
    id: 'D002',
    category: 'Strategy',
    title: 'Real P&L is parts margin, not platform fee',
    problem: 'The interview noted a ₹100 platform fee. At 20 services/partner/month, that is ₹2,000 platform revenue against ₹30,000 payroll cost. The math does not work unless we find the real margin driver.',
    options: [
      { label: 'Increase platform fee to ₹500+', pro: 'Direct revenue uplift.', con: 'Price-sensitive market. Competitors undercut immediately. Feels like a tax.' },
      { label: 'Parts markup as primary margin', pro: '30–40% margin on OEM parts is defensible. Customer sees a total price, not a parts markup.', con: 'Requires tight inventory management. Working capital tied up in stock.' },
      { label: 'Subscription model from day one', pro: 'Predictable MRR.', con: 'Too early. No trust built. Churn risk before product-market fit.' },
    ],
    chosen: 'Parts markup (30–40%) as primary P&L. Platform fee stays at ₹100 as a psychological anchor.',
    rationale: 'Customers see one total price. The ₹100 platform fee signals transparency without revealing that parts markup is where margin lives. This is how every successful auto parts business works — Bosch, Castrol, and OEM dealers all make money on parts, not labour. Labour (partner payroll) is the cost of distribution, not the business model.',
    measure: 'Gross margin per booking. Target: >32% blended across all tiers. Track separately for standard vs premium vs luxury. If luxury margin falls below 40% after sourcing surcharge, reprice the surcharge.',
    insight: 'ServiGo is a parts distribution business that uses doorstep servicing as the delivery mechanism. This reframe changes everything — inventory management becomes a core competency, not a back-office function.',
  },
  {
    id: 'D003',
    category: 'Product',
    title: 'Luxury and ultra-luxury cars get a quote-first flow, not instant booking',
    problem: 'BMW, Mercedes, Audi parts cannot be pre-stocked at scale. Lead times are 3–14 days. Promising a 2-hour slot for a BMW 5 Series oil change and then failing to deliver is a brand-destroying moment.',
    options: [
      { label: 'Block luxury cars entirely at MVP', pro: 'Zero ops risk.', con: 'Leaves high-margin segment on the table. Vikram persona underserved.' },
      { label: 'Instant booking for all tiers', pro: 'Consistent UX.', con: 'Operational impossibility. Parts not available same day for luxury.' },
      { label: 'Quote-first flow for luxury and ultra', pro: 'Honest with customer. Parts check before slot confirmation. High-value customers expect white-glove anyway.', con: 'Adds friction. Conversion rate will be lower.' },
    ],
    chosen: 'Quote-first flow for luxury and ultra-luxury tiers.',
    rationale: 'Luxury car owners are not price-sensitive — they are experience-sensitive. A quote-first flow that includes a personal call, parts confirmation, and a dedicated slot feels premium, not broken. The flow mirrors how authorised service centres work. Vikram expects this. Meera would be confused by it — which is why the flow only triggers for luxury tier.',
    measure: 'Quote-to-booking conversion rate. Target >60%. If below 40%, the call response time is the problem — measure time from quote submission to first call attempt. Should be under 30 minutes.',
    deferred: 'Automated parts availability API integration. At MVP, admin manually checks inventory and calls customer. Automate at scale.',
  },
  {
    id: 'D004',
    category: 'Trust',
    title: 'Trust mechanism: before/after photos enforced at partner app level, not policy level',
    problem: 'Letting a stranger service your car at home is a higher-trust ask than an Uber ride. Car damage is not reversible in 10 minutes. Trust cannot be built through promises alone — it needs structural enforcement.',
    options: [
      { label: 'Policy-based trust (T&Cs, training)', pro: 'Zero engineering cost.', con: 'Unenforceable. First incident destroys trust company-wide.' },
      { label: 'Partner rating system only', pro: 'Market pressure on partners.', con: 'Ratings are lagging indicators. Damage has already occurred.' },
      { label: 'Enforced photo upload — job cannot be completed without both photos', pro: 'Structural. No discretion. Customer gets proof automatically.', con: 'Adds 2 minutes to every job. Partners need data connectivity.' },
      { label: 'Live video stream during service', pro: 'Maximum transparency.', con: 'Privacy concerns. Bandwidth. Over-engineered for MVP.' },
    ],
    chosen: 'Enforced before/after photo upload. Job completion is blocked at UI level without both photos.',
    rationale: 'This is a product decision, not a policy decision. The partner app\'s "Mark Complete" button is disabled until both photos are uploaded. This creates accountability without requiring human oversight at every job. Photos are automatically sent to the customer as part of the completion notification — turning a trust mechanism into a delight moment.',
    measure: 'Photo compliance rate (target 100% — it is enforced). Customer-reported trust score in post-service survey. Damage claim rate (target <0.1% of jobs).',
    insight: 'OEM part batch numbers shown to customer before arrival serve a second trust function — Vikram can verify the part grade independently. Zero cost to implement, very high signal to a car enthusiast.',
  },
  {
    id: 'D005',
    category: 'Operations',
    title: 'Partner inventory: pre-job parts checklist enforced before departure, not on arrival',
    problem: 'A partner arriving at a BMW owner\'s home without the correct grade of synthetic oil is not a minor inconvenience — it is a rescheduled job, a refund, and a 1-star review. The failure point is departure, not arrival.',
    options: [
      { label: 'Partners carry full inventory always', pro: 'No pre-check needed.', con: 'Massive working capital per partner. Wrong parts still possible for complex jobs.' },
      { label: 'Parts assigned but no checklist enforcement', pro: 'Simpler partner app.', con: 'Human error. Partners forget or substitute.' },
      { label: 'Enforced pre-departure checklist in partner app', pro: 'Structural enforcement. "Confirm Parts Pickup" button locked until all parts ticked.', con: 'Adds 5 minutes to kiosk workflow.' },
    ],
    chosen: 'Enforced pre-departure parts checklist. "Confirm Parts Pickup" is locked until all job parts are marked as picked.',
    rationale: 'Same logic as the photo enforcement. Policy compliance is unpredictable. UI enforcement is 100%. The kiosk manager dispatches parts per job — the partner ticks each item. Admin sees parts status in real-time. If a part is missing, the problem surfaces before the partner leaves, not at the customer\'s home.',
    measure: 'Wrong-parts-on-arrival rate. Target 0%. If any incident occurs, root cause is kiosk dispatch error or inventory data mismatch — both are traceable.',
    deferred: 'Barcode scan per part for verification. At MVP, manual tick is sufficient. Add scan at 500+ jobs/day.',
  },
  {
    id: 'D006',
    category: 'Growth',
    title: 'Fleet manager (Rajan) is the enterprise wedge, not a persona afterthought',
    problem: 'Every other candidate will design for Rahul and Harshi. The fleet manager persona — one account, 10–20 cars, consolidated GST billing, SLA tracking — is where the real business volume lives.',
    options: [
      { label: 'B2C only at MVP', pro: 'Simpler. One customer type.', con: 'Leaves highest LTV segment for a competitor to capture.' },
      { label: 'B2B product from day one', pro: 'Enterprise revenue.', con: 'Completely different sales motion, onboarding, billing. Too early.' },
      { label: 'B2C product with fleet-aware features', pro: 'Rajan can use the same product. Fleet dashboard, GST invoice, bulk booking added as features, not a separate product.', con: 'Some B2C UX decisions conflict with B2B needs.' },
    ],
    chosen: 'B2C-first product with fleet-aware features built in from MVP.',
    rationale: '50 fleet accounts averaging 10 cars each = 500 recurring vehicles without a single consumer marketing rupee. The same booking flow works — Rajan just books for multiple cars. GST invoice generation is a feature, not a product. Fleet dashboard is an admin view filter. The product architecture supports it without a separate build.',
    measure: 'Fleet account MoM growth. Revenue per fleet account vs individual account (target: 8x). Fleet churn rate (target <5% monthly — these are commercial relationships, not impulse purchases).',
    insight: 'At Series A, the fleet segment is the enterprise story. Insurance companies, logistics firms, cab aggregators all have fleet servicing needs. ServiGo\'s data on vehicle service history across Bangalore is the moat.',
  },
  {
    id: 'D007',
    category: 'Strategy',
    title: 'The data layer is the 18-month play, not the product',
    problem: 'Doorstep servicing is defensible until a well-funded competitor enters. What makes ServiGo truly defensible at scale?',
    options: [
      { label: 'Geographic moat (expand cities fast)', pro: 'Network effects per city.', con: 'Capital intensive. Uber tried this. Ops quality degrades with speed.' },
      { label: 'Brand moat (become the trusted name)', pro: 'Sustainable.', con: 'Takes years and marketing spend.' },
      { label: 'Data moat (service history across thousands of vehicles)', pro: 'Unique. Not replicable. Compounds over time.', con: 'Requires privacy framework. Monetisation is indirect.' },
    ],
    chosen: 'Build toward the data moat while winning on trust and ops in year one.',
    rationale: 'ServiGo will know the make, model, year, KM, service history, and parts used for every car in its network. Insurance companies price premiums on service history. Used car platforms (Cars24, Spinny) pay for verified service records. OEMs want real-world parts consumption data. None of this requires building a new product — it requires not throwing away the data already being collected.',
    measure: 'Data asset value proxy: number of unique vehicles with 2+ service records in the ServiGo system. Target: 10,000 vehicles by end of year one in Bangalore.',
    deferred: 'Data monetisation partnerships. Build the asset first, monetise at Series A when the dataset has density.',
    insight: 'This is the Pichai move — the platform play hiding inside what looks like a services business.',
  },
  {
    id: 'D008',
    category: 'Product',
    title: 'Chatbot deprioritised — lower acceptance criteria, not dropped',
    problem: 'Engineering capacity is finite. Chatbot was identified as a nice-to-have in the interview. The question is whether to cut it or ship a lower-fidelity version.',
    options: [
      { label: 'Drop chatbot entirely from MVP', pro: 'Zero engineering cost.', con: 'Some users (Meera) genuinely need guidance. Drop-off risk at booking step 1.' },
      { label: 'Full conversational AI chatbot', pro: 'Best experience.', con: 'High engineering cost. LLM latency. Scope creep.' },
      { label: 'Rule-based FAQ bot with lower acceptance criteria', pro: 'Ships fast. Covers 80% of Meera\'s questions. Honest about limitations.', con: 'Not "intelligent". Cannot handle edge cases.' },
    ],
    chosen: 'Rule-based FAQ bot shipped with lower acceptance criteria. Handles: "what does my car need?", "how long does it take?", "are your parts genuine?", "what happens if something goes wrong?"',
    rationale: 'Meera does not need a conversational AI. She needs 4 questions answered before she trusts the product enough to book. A rule-based bot covers this at 10% of the engineering cost. Ship it, measure drop-off at step 1 of onboarding, and upgrade to LLM if the data justifies it.',
    measure: 'Step 1 completion rate with and without bot interaction. If bot users complete step 1 at >15% higher rate, the investment is justified. Then upgrade.',
    deferred: 'LLM-powered conversational assistant. Post-MVP when we have real user questions to train on.',
  },
];

const CATEGORIES = ['All', 'Strategy', 'Product', 'Operations', 'Trust', 'Growth'];

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DecisionsPage() {
  const [category, setCategory] = useState('All');
  const [allOpen, setAllOpen] = useState(false);

  const filtered = category === 'All' ? DECISIONS : DECISIONS.filter(d => d.category === category);

  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <span className="label">Product thinking</span>
        <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '0.25rem', lineHeight: 1.1 }}>
          Decision <span className="font-display-italic" style={{ color: 'var(--accent)' }}>Log</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem', fontSize: '0.95rem', maxWidth: '52ch', lineHeight: 1.65 }}>
          Every major product decision made during the design of ServiGo — the problem, options considered, what was chosen, and how we'd validate it. This is the thinking behind the prototype, not just the prototype itself.
        </p>

        {/* Meta */}
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Decisions documented', value: DECISIONS.length },
            { label: 'Categories', value: CATEGORIES.length - 1 },
            { label: 'Deferred items', value: DECISIONS.filter(d => d.deferred).length },
          ].map(m => (
            <div key={m.label} style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline' }}>
              <span className="font-display" style={{ fontSize: '1.5rem', color: 'var(--accent)' }}>{m.value}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{
              background: category === c ? 'rgba(200,230,80,0.12)' : 'var(--bg-card)',
              border: category === c ? '1px solid var(--accent)' : '1px solid var(--border)',
              borderRadius: '9999px', padding: '0.35rem 0.875rem',
              color: category === c ? 'var(--accent)' : 'var(--text-muted)',
              fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
            }}>
              {c}
            </button>
          ))}
        </div>
        <button onClick={() => setAllOpen(!allOpen)} className="btn-ghost" style={{ padding: '0.35rem 0.875rem', fontSize: '0.78rem' }}>
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      {/* Decision cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '3rem' }}>
        {filtered.map(d => (
          <div key={d.id + allOpen} >
            <DecisionCardControlled d={d} forceOpen={allOpen} />
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="card" style={{ background: 'rgba(200,230,80,0.05)', borderColor: 'rgba(200,230,80,0.2)', textAlign: 'center' }}>
        <h3 className="font-display" style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>See the decisions in action</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
          Every decision above is reflected in a specific screen or interaction in the prototype.
        </p>
        <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/customer" className="btn-ghost" style={{ textDecoration: 'none', fontSize: '0.875rem' }}>Customer Flow</Link>
          <Link href="/partner" className="btn-ghost" style={{ textDecoration: 'none', fontSize: '0.875rem' }}>Partner App</Link>
          <Link href="/admin" className="btn-accent" style={{ textDecoration: 'none', fontSize: '0.875rem' }}>Admin Dashboard <ArrowRight size={14} /></Link>
        </div>
      </div>
    </div>
  );
}

// Controlled version that respects forceOpen
function DecisionCardControlled({ d, forceOpen }: { d: Decision; forceOpen: boolean }) {
  const [localOpen, setLocalOpen] = useState(false);
  const open = forceOpen || localOpen;
  const catColors: Record<string, string> = {
    Strategy: 'badge-accent',
    Product: 'badge-warning',
    Operations: 'badge-muted',
    Trust: 'badge-danger',
    Growth: 'badge-accent',
  };

  return (
    <div className="card" style={{ transition: 'border-color 0.2s' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
      <button onClick={() => setLocalOpen(!localOpen)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 600 }}>{d.id}</span>
              <span className={`badge ${catColors[d.category] ?? 'badge-muted'}`} style={{ fontSize: '0.6rem' }}>{d.category}</span>
            </div>
            <h3 style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>{d.title}</h3>
            {!open && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.4rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {d.problem}
              </p>
            )}
          </div>
          <div style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '0.2rem' }}>
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
      </button>

      {open && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <span className="label" style={{ color: 'var(--danger)', marginBottom: '0.4rem' }}>The Problem</span>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.65 }}>{d.problem}</p>
          </div>
          <hr className="divider" />
          <div style={{ marginBottom: '1.25rem' }}>
            <span className="label" style={{ marginBottom: '0.75rem' }}>Options Considered</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {d.options.map((o, i) => (
                <div key={i} style={{ padding: '0.875rem 1rem', background: 'var(--bg-surface)', borderRadius: '0.6rem', border: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>Option {i + 1}: {o.label}</div>
                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '120px' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase' }}>Pro </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{o.pro}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: '120px' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--danger)', fontWeight: 700, textTransform: 'uppercase' }}>Con </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{o.con}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <hr className="divider" />
          <div style={{ marginBottom: '1.25rem', padding: '1rem', background: 'rgba(200,230,80,0.06)', border: '1px solid rgba(200,230,80,0.2)', borderRadius: '0.75rem' }}>
            <span className="label" style={{ color: 'var(--accent)', marginBottom: '0.4rem' }}>What We Chose</span>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.55 }}>{d.chosen}</p>
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <span className="label" style={{ marginBottom: '0.4rem' }}>Why</span>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.65 }}>{d.rationale}</p>
          </div>
          <div style={{ marginBottom: d.deferred || d.insight ? '0.875rem' : 0, padding: '0.875rem 1rem', background: 'var(--bg-surface)', borderRadius: '0.6rem', border: '1px solid var(--border)' }}>
            <span className="label" style={{ marginBottom: '0.35rem', color: 'var(--text-muted)' }}>How We'd Validate</span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{d.measure}</p>
          </div>
          {d.deferred && (
            <div style={{ marginTop: '0.875rem', marginBottom: d.insight ? '0.875rem' : 0, padding: '0.875rem 1rem', background: 'rgba(255,179,71,0.05)', borderRadius: '0.6rem', border: '1px solid rgba(255,179,71,0.2)' }}>
              <span className="label" style={{ marginBottom: '0.35rem', color: 'var(--warning)' }}>Deferred to Post-MVP</span>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{d.deferred}</p>
            </div>
          )}
          {d.insight && (
            <div style={{ marginTop: '0.875rem', padding: '0.875rem 1rem', background: 'rgba(200,230,80,0.04)', borderRadius: '0.6rem', border: '1px solid rgba(200,230,80,0.15)' }}>
              <span className="label" style={{ marginBottom: '0.35rem', color: 'var(--accent)' }}>Deeper Insight</span>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.65, fontStyle: 'italic' }}>{d.insight}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
