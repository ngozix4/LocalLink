const express = require('express');
const router = express.Router();
const Connection = require('../models/Connection');
const Notification = require('../models/Notification');

// Create connection request
router.post('/', async (req, res) => {
  try {
    const connection = new Connection(req.body);
    await connection.save();
    
    // Create notification for the recipient
    const notification = new Notification({
      business_id: req.body.business2_id,
      type: 'connection_request',
      message: `Connection request from ${req.body.business1_id}`,
      metadata: { connection_id: connection._id }
    });
    await notification.save();
    
    res.status(201).json(connection);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update connection status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    const connection = await Connection.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    // Create notification for status change
    const notification = new Notification({
      business_id: connection.business1_id,
      type: 'connection_update',
      message: `Connection with ${connection.business2_id} is now ${status}`,
      metadata: { connection_id: connection._id }
    });
    await notification.save();
    
    res.json(connection);
  } catch (error) {
    console.error("Update Failed", error);
    res.status(400).json({ error: error.message });
  }
});

// Get connections for a business
router.get('/business/:businessId', async (req, res) => {
  try {
    const { status } = req.query;
    const query = {
      $or: [
        { business1_id: req.params.businessId },
        { business2_id: req.params.businessId }
      ]
    };
    
    if (status) query.status = status;
    
    const connections = await Connection.find(query)
      .populate('business1_id')
      .populate('business2_id');
    
    res.json(connections);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;