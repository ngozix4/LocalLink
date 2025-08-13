require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Only connect to MongoDB if not in test environment
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
}



// Models
require('./models/Business');5
require('./models/Product');
require('./models/Review');
require('./models/Order');
require('./models/Message');
require('./models/Connection');
require('./models/Notification');

// Routes
const authRoutes = require('./routes/auth');
const businessRoutes = require('./routes/business');
const productRoutes = require('./routes/product');
const reviewRoutes = require('./routes/review');
const orderRoutes = require('./routes/order');
const messageRoutes = require('./routes/message');
const connectionRoutes = require('./routes/connection');
const notificationRoutes = require('./routes/notification');

app.use('/api/auth', authRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  if (!err) {
    console.error('Received undefined error');
    err = new Error('Unknown error occurred');
  }
  console.error(err.stack || err.toString());
  res.status(err.status || 500).json({ 
    error: err.message || 'Something went wrong!' 
  });
});

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;