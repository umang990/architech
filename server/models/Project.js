// server/models/Project.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: 'javascript'
  }
});

const projectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assumes you will add authentication later
    required: false // Optional for now
  },
  name: {
    type: String,
    required: [true, 'Please add a project name'],
    trim: true,
  },
  originalPrompt: {
    type: String,
    required: true,
  },
  userAnswers: {
    type: Map,
    of: String, // Stores the Q&A responses
  },
  files: [fileSchema], // Array of generated files
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Project', projectSchema);