const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Notification = require('../models/Notification');

// Send message
router.post('/', async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    
    // Create notification for the recipient
    const notification = new Notification({
      business_id: req.body.receiver_id,
      type: 'new_message',
      message: `New message from ${req.body.sender_id}`,
      metadata: { message_id: message._id }
    });
    await notification.save();
    
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get conversation between two businesses
router.get('/conversation', async (req, res) => {
  try {
    const { business1, business2 } = req.query;
    
    const messages = await Message.find({
      $or: [
        { sender_id: business1, receiver_id: business2 },
        { sender_id: business2, receiver_id: business1 }
      ]
    }).sort({ created_at: 1 });
    
    res.json(messages);
  } catch (error) {
    console.error("Unable to get Business Message", error);
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;