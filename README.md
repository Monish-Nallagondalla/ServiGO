# ServiGo — Doorstep Car Servicing

A product prototype built as an assessment submission for MVPRockets.

**Live:** https://servigo-mauve.vercel.app

---

## What is ServiGo?

ServiGo is a doorstep car servicing platform for Bangalore. Certified partners arrive at your home or office with OEM-verified parts, complete the service in a 2-hour window, and send before/after photo proof automatically.

The platform has three surfaces:

| Surface | Who uses it | URL |
|---|---|---|
| Customer Portal | Car owners booking services | `/customer` |
| Partner App | Field technicians managing jobs | `/partner` |
| Admin Dashboard | Operations team dispatching and monitoring | `/admin` |

---

## Product Thinking

The full product brief — market sizing, unit economics, AI roadmap, 18-month strategy — is documented inside the app at `/about`.

8 major product decisions are documented at `/decisions`, each with: the problem, options considered, what was chosen, rationale, and how to validate it.

---

## Tech Stack

- **Framework:** Next.js 16.2 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + CSS custom properties
- **Icons:** lucide-react
- **Data:** Mock data in `lib/data.ts` — no database
- **Deploy:** Vercel

---

## Key Product Decisions

**P&L model:** Parts markup (~32%) is the primary margin driver. The ₹100 platform fee is a psychological transparency anchor, not a revenue centre.

**Trust mechanism:** Before/after photos are enforced at the partner app UI level — the "Mark Complete" button is disabled without both uploads. Structural enforcement, not policy.

**Luxury tier:** BMW/Mercedes/Porsche cars trigger a quote-first flow instead of instant booking — parts lead times are 3–14 days and cannot be promised same-day.

**Data moat:** KM reading captured at onboarding powers proactive service reminders (retention) and builds a vehicle service history dataset that becomes defensible at scale.

Full rationale for all 8 decisions: https://servigo-mauve.vercel.app/decisions

---

## Running Locally

```bash
cd servigo
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
servigo/
├── app/
│   ├── globals.css        # Design system, CSS variables
│   ├── layout.tsx         # Root layout with Navbar
│   ├── page.tsx           # Landing page
│   ├── customer/          # 4-step booking flow
│   ├── partner/           # Job management app
│   ├── admin/             # Operations dashboard
│   ├── decisions/         # PM decision log (8 decisions)
│   └── about/             # Full product brief
├── components/
│   └── Navbar.tsx
└── lib/
    └── data.ts            # Mock data + pricing engine
```

---

Built by **Monish Nallagondalla Srinath**  
nsmonish@gmail.com · +91 95388 09196
