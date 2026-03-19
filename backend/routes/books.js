const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getAllBooks, getBook, createBook, updateBook, deleteBook, getTags } = require('../controllers/bookController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/tags/all', getTags);
router.get('/', getAllBooks);
router.get('/:id', getBook);

router.post('/', [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('author').trim().notEmpty().withMessage('Author is required'),
  body('status').optional().isIn(['want-to-read', 'reading', 'completed']).withMessage('Invalid status'),
], createBook);

router.put('/:id', [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('author').optional().trim().notEmpty().withMessage('Author cannot be empty'),
  body('status').optional().isIn(['want-to-read', 'reading', 'completed']).withMessage('Invalid status'),
], updateBook);

router.delete('/:id', deleteBook);

module.exports = router;