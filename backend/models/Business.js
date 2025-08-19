const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const BusinessSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  images: [{
    public_id: String,
    url: String,
    altText: String
  }],
  logo: {
    public_id: String,
    url: String
  },
  business_name: { type: String, required: true },
  business_type: { type: String },
  location: { 
    address: { type: String },
    coordinates: {
      type: [Number],  // [longitude, latitude]
      index: '2dsphere'
}

  },
  description: { type: String },
  rating: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Hash password before saving
BusinessSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
BusinessSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Business', BusinessSchema);