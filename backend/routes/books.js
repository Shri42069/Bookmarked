const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Book = require('../models/Book');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// GET /api/books - Get all books for current user
router.get('/', async (req, res) => {
  try {
    const { status, tag, search } = req.query;
    const filter = { user: req.user._id };

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (tag) {
      filter.tags = { $in: [tag] };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    const books = await Book.find(filter).sort({ updatedAt: -1 });

    // Stats
    const stats = await Book.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const statsMap = { 'want-to-read': 0, reading: 0, completed: 0 };
    stats.forEach((s) => {
      statsMap[s._id] = s.count;
    });

    res.json({ books, stats: statsMap, total: await Book.countDocuments({ user: req.user._id }) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/books - Create a book
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('author').trim().notEmpty().withMessage('Author is required'),
    body('status')
      .optional()
      .isIn(['want-to-read', 'reading', 'completed'])
      .withMessage('Invalid status'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { title, author, tags, status, notes, coverColor } = req.body;

      const book = await Book.create({
        user: req.user._id,
        title,
        author,
        tags: tags || [],
        status: status || 'want-to-read',
        notes: notes || '',
        coverColor: coverColor || '#6366f1',
      });

      res.status(201).json(book);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// GET /api/books/:id - Get a single book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, user: req.user._id });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/books/:id - Update a book
router.put(
  '/:id',
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('author').optional().trim().notEmpty().withMessage('Author cannot be empty'),
    body('status')
      .optional()
      .isIn(['want-to-read', 'reading', 'completed'])
      .withMessage('Invalid status'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const book = await Book.findOne({ _id: req.params.id, user: req.user._id });

      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      const allowedFields = ['title', 'author', 'tags', 'status', 'notes', 'coverColor'];
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          book[field] = req.body[field];
        }
      });

      await book.save();
      res.json(book);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// DELETE /api/books/:id - Delete a book
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/books/tags/all - Get all unique tags for user
router.get('/tags/all', async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }, 'tags');
    const allTags = [...new Set(books.flatMap((b) => b.tags))].filter(Boolean);
    res.json(allTags);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
