const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  name: { type: String, required: true },
  description: { type: String },
  gallery: [{
    public_id: String,
    url: String,
    altText: String
  }],
  mainImage: {
    public_id: String,
    url: String
  },
  category: { type: String},
  price: { type: Number, required: true },
  location: { type: String },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);