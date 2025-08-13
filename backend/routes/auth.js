const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Business = require('../models/Business');

// Business registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, business_name, business_type, location } = req.body;
    
    // Validation
    if (!email || !password || !business_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if business already exists
    const existingBusiness = await Business.findOne({ email });
    if (existingBusiness) {
      return res.status(400).json({ error: 'Business already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create business
    const business = new Business({
      email,
      password: hashedPassword,
      business_name,
      business_type,
      location
    });

    await business.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: business._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.status(201).json({ 
      token,
      user: business
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message || 'Registration Failed'});
  }
});

// Business login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const business = await Business.findOne({ email });
    if (!business) {
      return res.status(401).json({ error: 'Email Does Not Exist' });
    }

    const isMatch = await bcrypt.compare(password, business.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Check Your Password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: business._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ 
      token,
      user: business
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;