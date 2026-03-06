'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth';
import { booksAPI } from '../../lib/api';
import Navbar from '../../components/Navbar';
import BookCard from '../../components/BookCard';
import BookModal from '../../components/BookModal';

const STATUS_FILTERS = [
  { value: 'all', label: 'All books' },
  { value: 'want-to-read', label: '📖 Want to Read' },
  { value: 'reading', label: '📘 Reading' },
  { value: 'completed', label: '✅ Completed' },
];

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({ 'want-to-read': 0, reading: 0, completed: 0 });
  const [total, setTotal] = useState(0);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (tagFilter) params.tag = tagFilter;
      if (search) params.search = search;

      const res = await booksAPI.getAll(params);
      setBooks(res.data.books);
      setStats(res.data.stats);
      setTotal(res.data.total);
    } catch (err) {
      setError('Failed to load your library');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, tagFilter, search]);

  const fetchTags = useCallback(async () => {
    try {
      const res = await booksAPI.getTags();
      setTags(res.data);
    } catch {}
  }, []);

  useEffect(() => {
    if (user) {
      fetchBooks();
      fetchTags();
    }
  }, [user, fetchBooks, fetchTags]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleSave = async (data) => {
    if (editingBook) {
      await booksAPI.update(editingBook._id, data);
    } else {
      await booksAPI.create(data);
    }
    setModalOpen(false);
    setEditingBook(null);
    fetchBooks();
    fetchTags();
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this book from your library?')) return;
    try {
      await booksAPI.delete(id);
      fetchBooks();
      fetchTags();
    } catch {
      alert('Failed to delete book');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await booksAPI.update(id, { status: newStatus });
      fetchBooks();
    } catch {
      alert('Failed to update status');
    }
  };

  const openAddModal = () => {
    setEditingBook(null);
    setModalOpen(true);
  };

  if (authLoading) return <LoadingScreen />;
  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ background: 'var(--parchment)' }}>
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Greeting */}
        <div className="mb-8 page-enter">
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-1" style={{ color: 'var(--ink-deep)' }}>
            Good {getTimeOfDay()}, {user.name.split(' ')[0]}.
          </h1>
          <p style={{ color: 'var(--ink-light)', fontStyle: 'italic' }} className="text-sm">
            {total === 0
              ? 'Your library is waiting to be filled.'
              : `${total} book${total !== 1 ? 's' : ''} in your collection.`}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard
            value={total}
            label="Total"
            accent="var(--ink-deep)"
            delay={0}
          />
          <StatCard
            value={stats['want-to-read']}
            label="Want to Read"
            emoji="📖"
            accent="#8B5E3C"
            delay={0.05}
          />
          <StatCard
            value={stats.reading}
            label="Reading"
            emoji="📘"
            accent="var(--spine-sage)"
            delay={0.1}
          />
          <StatCard
            value={stats.completed}
            label="Completed"
            emoji="✅"
            accent="var(--spine-slate)"
            delay={0.15}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              className="input-field pl-9"
              placeholder="Search by title or author…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <button
            onClick={openAddModal}
            className="btn-primary whitespace-nowrap flex items-center gap-2 justify-center"
          >
            <span className="text-lg leading-none">+</span>
            Add book
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {/* Status filters */}
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                background: statusFilter === f.value ? 'var(--ink-deep)' : 'rgba(74,58,45,0.06)',
                color: statusFilter === f.value ? 'var(--parchment)' : 'var(--ink-soft)',
                border: `1px solid ${statusFilter === f.value ? 'transparent' : 'rgba(74,58,45,0.15)'}`,
              }}
            >
              {f.label}
            </button>
          ))}

          {/* Divider */}
          {tags.length > 0 && (
            <span className="w-px self-stretch mx-1" style={{ background: 'rgba(74,58,45,0.15)' }} />
          )}

          {/* Tag filters */}
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setTagFilter(tagFilter === tag ? '' : tag)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
              style={{
                background: tagFilter === tag ? 'rgba(74,58,45,0.15)' : 'transparent',
                color: 'var(--ink-soft)',
                border: `1px solid ${tagFilter === tag ? 'rgba(74,58,45,0.4)' : 'rgba(74,58,45,0.15)'}`,
              }}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 mb-6 rounded-sm text-sm" style={{ background: 'rgba(176, 92, 58, 0.1)', color: 'var(--spine-rust)' }}>
            {error}
          </div>
        )}

        {/* Books grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : books.length === 0 ? (
          <EmptyState onAdd={openAddModal} hasFilters={statusFilter !== 'all' || tagFilter || search} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map((book, i) => (
              <div
                key={book._id}
                className="page-enter"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <BookCard
                  book={book}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Book modal */}
      {modalOpen && (
        <BookModal
          book={editingBook}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setEditingBook(null);
          }}
        />
      )}
    </div>
  );
}

function StatCard({ value, label, emoji, accent, delay }) {
  return (
    <div
      className="card p-4 page-enter"
      style={{ animationDelay: `${delay}s` }}
    >
      <div
        className="font-display text-3xl font-bold mb-0.5"
        style={{ color: accent || 'var(--ink-deep)' }}
      >
        {emoji ? <span className="text-2xl">{emoji}</span> : null}
        {value}
      </div>
      <div className="text-xs" style={{ color: 'var(--ink-light)' }}>{label}</div>
    </div>
  );
}

function EmptyState({ onAdd, hasFilters }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">
        {hasFilters ? '🔍' : '📚'}
      </div>
      <h3 className="font-display text-xl font-semibold mb-2" style={{ color: 'var(--ink-soft)' }}>
        {hasFilters ? 'No books match your filters' : 'Your shelves are empty'}
      </h3>
      <p className="text-sm mb-6" style={{ color: 'var(--ink-light)', fontStyle: 'italic', maxWidth: '300px' }}>
        {hasFilters
          ? 'Try adjusting your search or filters.'
          : 'Every great library begins with a single book. Add yours.'}
      </p>
      {!hasFilters && (
        <button onClick={onAdd} className="btn-primary">
          Add your first book
        </button>
      )}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">📚</div>
        <p style={{ color: 'var(--ink-light)', fontStyle: 'italic' }}>Opening your library…</p>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: 'rgba(74,58,45,0.2)', borderTopColor: 'var(--ink-soft)' }}
      />
      <p className="text-sm" style={{ color: 'var(--ink-light)', fontStyle: 'italic' }}>Loading…</p>
    </div>
  );
}

function SearchIcon({ className }) {
  return (
    <svg
      className={className}
      width="15" height="15"
      viewBox="0 0 15 15"
      fill="none"
      stroke="var(--ink-light)"
      strokeWidth="1.5"
    >
      <circle cx="6.5" cy="6.5" r="4.5" />
      <line x1="10" y1="10" x2="14" y2="14" strokeLinecap="round" />
    </svg>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
