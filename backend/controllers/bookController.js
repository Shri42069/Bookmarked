const { validationResult } = require('express-validator');
const Book = require('../models/Book');

exports.getAllBooks = async (req, res) => {
  try {
    const { status, tag, search } = req.query;
    const filter = { user: req.user._id };

    if (status && status !== 'all') filter.status = status;
    if (tag) filter.tags = { $in: [tag] };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    const books = await Book.find(filter).sort({ updatedAt: -1 });

    const stats = await Book.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const statsMap = { 'want-to-read': 0, reading: 0, completed: 0 };
    stats.forEach((s) => { statsMap[s._id] = s.count; });

    res.json({
      books,
      stats: statsMap,
      total: await Book.countDocuments({ user: req.user._id }),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getBook = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, user: req.user._id });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createBook = async (req, res) => {
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
};

exports.updateBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const book = await Book.findOne({ _id: req.params.id, user: req.user._id });
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const allowedFields = ['title', 'author', 'tags', 'status', 'notes', 'coverColor'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) book[field] = req.body[field];
    });

    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTags = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }, 'tags');
    const allTags = [...new Set(books.flatMap((b) => b.tags))].filter(Boolean);
    res.json(allTags);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};