const mongoose = require('mongoose');

const ConnectionSchema = new mongoose.Schema({
  business1_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  business2_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  status: { type: String, default: 'pending' }, // e.g., pending, accepted, rejected
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Connection', ConnectionSchema);