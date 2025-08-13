const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  type: { type: String, required: true }, // e.g., 'new_order', 'connection_request'
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  metadata: { type: Object }, // Additional data like order_id, connection_id, etc.
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);