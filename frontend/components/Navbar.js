'use client';
import Link from 'next/link';
import { useAuth } from '../lib/auth';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav
      className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between"
      style={{
        background: 'rgba(250, 244, 232, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(74, 58, 45, 0.1)',
      }}
    >
      <Link href="/dashboard" className="flex items-center gap-2 no-underline">
        <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
          <rect x="4" y="3" width="16" height="22" rx="2" fill="var(--ink-deep)" opacity="0.15" />
          <rect x="6" y="3" width="16" height="22" rx="2" fill="var(--ink-deep)" opacity="0.5" />
          <rect x="8" y="3" width="16" height="22" rx="2" fill="var(--ink-deep)" />
          <line x1="12" y1="9" x2="20" y2="9" stroke="var(--parchment)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
          <line x1="12" y1="13" x2="20" y2="13" stroke="var(--parchment)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
          <line x1="12" y1="17" x2="17" y2="17" stroke="var(--parchment)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
        </svg>
        <span className="font-display text-xl font-bold tracking-tight" style={{ color: 'var(--ink-deep)' }}>
          Bookmarked
        </span>
      </Link>

      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm hidden sm:block" style={{ color: 'var(--ink-light)', fontStyle: 'italic' }}>
            {user.name}'s library
          </span>
          <button
            onClick={logout}
            className="text-sm px-4 py-1.5 rounded-sm transition-all"
            style={{
              color: 'var(--ink-soft)',
              border: '1px solid rgba(74, 58, 45, 0.2)',
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'rgba(74, 58, 45, 0.06)';
              e.currentTarget.style.borderColor = 'rgba(74, 58, 45, 0.4)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(74, 58, 45, 0.2)';
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </nav>
  );
}
