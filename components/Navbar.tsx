'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, FileText } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const productLinks = [
    { href: '/', label: 'Home' },
    { href: '/customer', label: 'Book a Service' },
    { href: '/partner', label: 'Partner App' },
    { href: '/admin', label: 'Admin' },
  ];

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);
  const isDocsActive = ['/decisions', '/about'].some(p => pathname.startsWith(p));

  return (
    <nav style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '3.75rem' }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            background: 'var(--accent)', borderRadius: '8px',
            width: '2rem', height: '2rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#0B3B35', fontWeight: 800, fontSize: '1rem' }}>S</span>
          </div>
          <span className="font-display" style={{ color: 'var(--text-primary)', fontSize: '1.15rem' }}>ServiGo</span>
        </Link>

        {/* Desktop — product links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.125rem' }} className="hidden md:flex">
          {productLinks.map((l) => {
            const active = isActive(l.href);
            return (
              <Link key={l.href} href={l.href} style={{
                position: 'relative',
                color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                borderRadius: '0.5rem',
                padding: '0.4rem 0.875rem',
                fontSize: '0.875rem',
                fontWeight: active ? 600 : 400,
                textDecoration: 'none',
                transition: 'color 0.15s',
                background: active ? 'rgba(200,230,80,0.08)' : 'transparent',
              }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)'; }}>
                {l.label}
                {active && (
                  <span style={{
                    position: 'absolute', bottom: '-1px', left: '0.875rem', right: '0.875rem',
                    height: '2px', background: 'var(--accent)', borderRadius: '1px',
                  }} />
                )}
              </Link>
            );
          })}

          {/* Separator */}
          <div style={{ width: '1px', height: '1.25rem', background: 'var(--border)', margin: '0 0.5rem' }} />

          {/* Docs dropdown trigger */}
          <Link href="/about" style={{
            position: 'relative',
            display: 'flex', alignItems: 'center', gap: '0.35rem',
            color: isDocsActive ? 'var(--accent)' : 'var(--text-muted)',
            borderRadius: '0.5rem',
            padding: '0.4rem 0.875rem',
            fontSize: '0.8rem',
            fontWeight: isDocsActive ? 600 : 400,
            textDecoration: 'none',
            transition: 'color 0.15s',
            border: '1px solid',
            borderColor: isDocsActive ? 'rgba(200,230,80,0.3)' : 'var(--border)',
            background: isDocsActive ? 'rgba(200,230,80,0.06)' : 'transparent',
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(200,230,80,0.3)';
            }}
            onMouseLeave={e => {
              if (!isDocsActive) {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)';
              }
            }}>
            <FileText size={13} />
            Docs
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', padding: '0.25rem', borderRadius: '0.375rem' }}
          aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
          {productLinks.map((l) => {
            const active = isActive(l.href);
            return (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.875rem 1.5rem',
                color: active ? 'var(--accent)' : 'var(--text-muted)',
                fontSize: '0.95rem', fontWeight: active ? 600 : 400,
                textDecoration: 'none', borderBottom: '1px solid var(--border)',
                background: active ? 'rgba(200,230,80,0.05)' : 'transparent',
              }}>
                {l.label}
                {active && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent)' }} />}
              </Link>
            );
          })}
          <Link href="/about" onClick={() => setOpen(false)} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.875rem 1.5rem',
            color: isDocsActive ? 'var(--accent)' : 'var(--text-muted)',
            fontSize: '0.875rem', fontWeight: 500,
            textDecoration: 'none',
          }}>
            <FileText size={14} /> Docs & Product Brief
          </Link>
        </div>
      )}
    </nav>
  );
}
