'use client';
import { useState, useEffect } from 'react';

const COVER_COLORS = [
  '#3d5a80', '#6b4c6b', '#5f8060', '#8B5E3C', '#4a6070',
  '#7a5c3c', '#4f6b5c', '#6b5a3c', '#4a4a6b', '#6b3c4c',
  '#c9a84c', '#b05c3a', '#4a8060', '#5a4a7a', '#7a4a3c',
];

export default function BookModal({ book, onSave, onClose }) {
  const isEdit = !!book;
  const [form, setForm] = useState({
    title: '',
    author: '',
    tags: '',
    status: 'want-to-read',
    notes: '',
    coverColor: COVER_COLORS[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (book) {
      setForm({
        title: book.title || '',
        author: book.author || '',
        tags: (book.tags || []).join(', '),
        status: book.status || 'want-to-read',
        notes: book.notes || '',
        coverColor: book.coverColor || COVER_COLORS[0],
      });
    }
  }, [book]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const tags = form.tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      await onSave({
        title: form.title.trim(),
        author: form.author.trim(),
        tags,
        status: form.status,
        notes: form.notes.trim(),
        coverColor: form.coverColor,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(26, 21, 16, 0.6)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg card p-8 page-enter"
        style={{ background: 'var(--parchment)', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold" style={{ color: 'var(--ink-deep)' }}>
            {isEdit ? 'Edit book' : 'Add a book'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-sm transition-colors"
            style={{ color: 'var(--ink-light)' }}
          >
            <CloseIcon />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-sm text-sm"
            style={{ background: 'rgba(176, 92, 58, 0.1)', color: 'var(--spine-rust)', border: '1px solid rgba(176, 92, 58, 0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink-soft)' }}>
              Title *
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="The Silent Patient"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink-soft)' }}>
              Author *
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Alex Michaelides"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink-soft)' }}>
              Reading status
            </label>
            <select
              className="input-field"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="want-to-read">📖 Want to Read</option>
              <option value="reading">📘 Reading</option>
              <option value="completed">✅ Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink-soft)' }}>
              Tags
              <span className="ml-1 font-normal" style={{ color: 'var(--ink-light)', fontStyle: 'italic' }}>
                (comma-separated)
              </span>
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="fiction, mystery, italian"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink-soft)' }}>
              Notes
            </label>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder="Your thoughts, quotes, or reminders…"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              maxLength={1000}
            />
          </div>

          {/* Cover color picker */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--ink-soft)' }}>
              Spine colour
            </label>
            <div className="flex flex-wrap gap-2">
              {COVER_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm({ ...form, coverColor: color })}
                  className="w-6 h-6 rounded-full transition-transform border-2"
                  style={{
                    background: color,
                    borderColor: form.coverColor === color ? 'var(--ink-deep)' : 'transparent',
                    transform: form.coverColor === color ? 'scale(1.25)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Add book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 5L15 15M15 5L5 15" strokeLinecap="round"/>
    </svg>
  );
}
