const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Get notifications for a business
router.get('/business/:businessId', async (req, res) => {
  try {
    const { read } = req.query;
    const query = { business_id: req.params.businessId };
    
    if (read !== undefined) query.read = read === 'true';
    
    const notifications = await Notification.find(query)
      .sort({ created_at: -1 });
    
    res.json(notifications);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    
    res.json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;