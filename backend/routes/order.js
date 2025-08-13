const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Notification = require('../models/Notification');

// Create order
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    
    // Create notification for the supplier
    const notification = new Notification({
      business_id: req.body.supplier_id,
      type: 'new_order',
      message: `New order received from ${req.body.buyer_id}`,
      metadata: { order_id: order._id }
    });
    await notification.save();
    
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update order status (with QR verification)
router.put('/:id/status', async (req, res) => {
  try {
    const { status, verification_code } = req.body;
    
    // Verify QR code (simplified example)
    if (verification_code !== 'VALID_QR_CODE') {
      throw new Error('Invalid verification code');
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    // Create notification for status change
    const notification = new Notification({
      business_id: order.buyer_id,
      type: 'order_update',
      message: `Order #${order._id} status updated to ${status}`,
      metadata: { order_id: order._id }
    });
    await notification.save();
    
    res.json(order);
  } catch (error) {
    console.error("Unable to update order", error);
    res.status(400).json({ error: error.message });
  }
});

// Get orders for a business
router.get('/business/:businessId', async (req, res) => {
  try {
    const { type } = req.query; // 'buyer' or 'supplier'
    const column = type === 'buyer' ? 'buyer_id' : 'supplier_id';
    
    const orders = await Order.find({ [column]: req.params.businessId })
      .populate('product_id')
      .populate('supplier_id')
      .populate('buyer_id');
    
    res.json(orders);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('product_id')
      .populate('supplier_id')
      .populate('buyer_id');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;