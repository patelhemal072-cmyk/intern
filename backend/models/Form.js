const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: false,
    default: 'N/A'
  },
  program: {
    type: String,
    required: true
  },
  package: {
    type: String,
    required: false,
    default: 'N/A'
  },
  experience: {
    type: String,
    required: false,
    default: 'N/A'
  },
  readyToCommit: {
    type: String,
    required: false,
    default: 'N/A'
  },
  message: {
    type: String,
    required: false
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Form', formSchema);
