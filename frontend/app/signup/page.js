'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/auth';

export default function SignupPage() {
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute h-px opacity-[0.04]"
            style={{ top: `${12 + i * 12}%`, left: 0, right: 0, background: 'var(--ink-deep)' }} />
        ))}
      </div>

      <div className="w-full max-w-md page-enter">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-6">
            <BookIcon />
            <span className="font-display text-2xl font-bold tracking-tight" style={{ color: 'var(--ink-deep)' }}>
              Bookmarked
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold mb-2" style={{ color: 'var(--ink-deep)' }}>
            Start your library
          </h1>
          <p style={{ color: 'var(--ink-light)', fontStyle: 'italic' }} className="text-sm">
            Every great collection begins here
          </p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="mb-5 p-3 rounded-sm text-sm" style={{ background: 'rgba(176, 92, 58, 0.1)', color: 'var(--spine-rust)', border: '1px solid rgba(176, 92, 58, 0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink-soft)' }}>
                Your name
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Jane Austen"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink-soft)' }}>
                Email
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink-soft)' }}>
                Password
              </label>
              <input
                type="password"
                className="input-field"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 pt-6 text-center" style={{ borderTop: '1px solid rgba(74,58,45,0.1)' }}>
            <span className="text-sm" style={{ color: 'var(--ink-light)' }}>
              Already have an account?{' '}
            </span>
            <Link href="/login" className="text-sm font-medium underline underline-offset-2" style={{ color: 'var(--ink-soft)' }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="4" y="3" width="16" height="22" rx="2" fill="var(--ink-deep)" opacity="0.15" />
      <rect x="6" y="3" width="16" height="22" rx="2" fill="var(--ink-deep)" opacity="0.5" />
      <rect x="8" y="3" width="16" height="22" rx="2" fill="var(--ink-deep)" />
      <line x1="12" y1="9" x2="20" y2="9" stroke="var(--parchment)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      <line x1="12" y1="13" x2="20" y2="13" stroke="var(--parchment)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      <line x1="12" y1="17" x2="17" y2="17" stroke="var(--parchment)" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
    </svg>
  );
}
