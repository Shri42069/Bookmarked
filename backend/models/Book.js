const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
      maxlength: [100, 'Author name cannot exceed 100 characters'],
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags) {
          return tags.length <= 10;
        },
        message: 'Cannot have more than 10 tags',
      },
    },
    status: {
      type: String,
      enum: ['want-to-read', 'reading', 'completed'],
      default: 'want-to-read',
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
      default: '',
    },
    coverColor: {
      type: String,
      default: '#6366f1',
    },
  },
  { timestamps: true }
);

// Index for faster queries
bookSchema.index({ user: 1, status: 1 });
bookSchema.index({ user: 1, tags: 1 });

module.exports = mongoose.model('Book', bookSchema);
