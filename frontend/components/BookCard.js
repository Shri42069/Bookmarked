'use client';

const STATUS_CONFIG = {
  'want-to-read': { emoji: '📖', label: 'Want to Read', cls: 'status-want' },
  reading: { emoji: '📘', label: 'Reading', cls: 'status-reading' },
  completed: { emoji: '✅', label: 'Completed', cls: 'status-completed' },
};

const SPINE_COLORS = [
  '#3d5a80', '#6b4c6b', '#5f8060', '#8B5E3C', '#4a6070',
  '#7a5c3c', '#4f6b5c', '#6b5a3c', '#4a4a6b', '#6b3c4c',
];

export default function BookCard({ book, onEdit, onDelete, onStatusChange }) {
  const status = STATUS_CONFIG[book.status];
  const spineColor = book.coverColor || SPINE_COLORS[0];

  const handleStatusCycle = async () => {
    const statusOrder = ['want-to-read', 'reading', 'completed'];
    const nextIdx = (statusOrder.indexOf(book.status) + 1) % statusOrder.length;
    await onStatusChange(book._id, statusOrder[nextIdx]);
  };

  return (
    <div
      className="card group overflow-hidden transition-all duration-300 hover:shadow-md"
      style={{ animationDelay: `${Math.random() * 0.2}s` }}
    >
      {/* Colored spine accent */}
      <div className="flex">
        <div
          className="w-2 flex-shrink-0 transition-all duration-300 group-hover:w-3"
          style={{ background: spineColor }}
        />

        <div className="flex-1 p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0">
              <h3 className="font-display text-base font-semibold leading-snug line-clamp-2 mb-0.5"
                style={{ color: 'var(--ink-deep)' }}>
                {book.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--ink-light)', fontStyle: 'italic' }}>
                {book.author}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
              <button
                onClick={() => onEdit(book)}
                className="p-1.5 rounded-sm transition-colors"
                style={{ color: 'var(--ink-light)' }}
                onMouseOver={e => e.currentTarget.style.color = 'var(--ink-soft)'}
                onMouseOut={e => e.currentTarget.style.color = 'var(--ink-light)'}
                title="Edit"
              >
                <EditIcon />
              </button>
              <button
                onClick={() => onDelete(book._id)}
                className="p-1.5 rounded-sm transition-colors"
                style={{ color: 'var(--ink-light)' }}
                onMouseOver={e => e.currentTarget.style.color = 'var(--spine-rust)'}
                onMouseOut={e => e.currentTarget.style.color = 'var(--ink-light)'}
                title="Delete"
              >
                <TrashIcon />
              </button>
            </div>
          </div>

          {/* Status badge (clickable to cycle) */}
          <button
            onClick={handleStatusCycle}
            className={`status-badge ${status.cls} mb-3 transition-all hover:opacity-80`}
            title="Click to change status"
          >
            <span>{status.emoji}</span>
            <span>{status.label}</span>
          </button>

          {/* Tags */}
          {book.tags && book.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {book.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="tag-pill">{tag}</span>
              ))}
              {book.tags.length > 4 && (
                <span className="tag-pill">+{book.tags.length - 4}</span>
              )}
            </div>
          )}

          {/* Notes preview */}
          {book.notes && (
            <p className="mt-3 text-xs leading-relaxed line-clamp-2"
              style={{ color: 'var(--ink-light)', fontStyle: 'italic', borderTop: '1px solid rgba(74,58,45,0.08)', paddingTop: '0.5rem' }}>
              "{book.notes}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function EditIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10.5 1.5L13.5 4.5L5 13H2V10L10.5 1.5Z" strokeLinejoin="round"/>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 4h11M6 4V2h3v2M5 4v9h5V4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
