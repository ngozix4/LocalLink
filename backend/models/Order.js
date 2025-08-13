const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  status: { type: String, default: 'pending' }, // e.g., pending, completed, cancelled
  verification_code: { type: String },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);