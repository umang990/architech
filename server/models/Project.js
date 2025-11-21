const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  path: { type: String, required: true },
  code: { type: String, required: true },
  language: { type: String, default: 'javascript' }
});

const logSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'success', 'error'], default: 'info' }
});

const chatSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'ai'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// NEW: Version Schema to store snapshots
const versionSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  name: { type: String, default: 'v1' }, // e.g. "v1", "v2 - Added Auth"
  files: [fileSchema],
  configuration: { type: Map, of: mongoose.Schema.Types.Mixed },
  prompt: String
});

const projectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a project name'],
    trim: true,
    default: 'Untitled Project'
  },
  originalPrompt: { type: String, required: true },
  configuration: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
  
  // Application State
  status: { 
    type: String, 
    enum: ['queued', 'generating', 'completed', 'failed', 'stopped'], 
    default: 'queued' 
  },
  progress: { type: Number, default: 0 },
  
  // Data
  files: [fileSchema], // Current Head
  versions: [versionSchema], // History
  logs: [logSchema],
  chatHistory: [chatSchema],
  
  // Version Control
  currentVersion: { type: Number, default: 1 }, // 1-based index tracking
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);