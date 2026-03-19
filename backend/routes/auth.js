const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { signup, login, me } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/signup', [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], signup);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], login);

router.get('/me', protect, me);

module.exports = router;