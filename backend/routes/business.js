const express = require('express');
const router = express.Router();
const Business = require('../models/Business');
const jwt = require('jsonwebtoken');
const { cloudinary } = require('../config/cloudinary');
const { uploadBusinessImages, uploadBusinessLogo } = require('../middleware/upload');

// Middleware to verify JWT
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('Authentication required');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Business.findById(decoded.userId);
    
    if (!req.user) throw new Error('User not found');
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// Add logo to business
router.post('/:id/logo', 
  authenticate,
  uploadBusinessLogo,
  async (req, res) => {
    try {
      const business = await Business.findById(req.params.id);
      
      // Delete old logo if exists
      if (business.logo?.public_id) {
        await cloudinary.uploader.destroy(business.logo.public_id);
      }

      business.logo = {
        public_id: req.file.filename,
        url: req.file.path
      };

      await business.save();
      res.json(business);
    } catch (error) {
      console.error("Failed Logo Upload", error);
      res.status(400).json({ error: error.message });
    }
  }
);

// Add multiple images to business
router.post('/:id/images',
  authenticate, (req, res, next) => {
  uploadBusinessImages(req, res, function (err) {
    if (err && err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'You can only upload a maximum of 5 images at once' });
    }
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
},
  async (req, res) => {
    try {
      const business = await Business.findById(req.params.id);
      
      const newImages = req.files.map(file => ({
        public_id: file.filename,
        url: file.path,
        altText: file.originalname
      }));

      business.images.push(...newImages);
      await business.save();
      
      res.status(201).json(business);
    } catch (error) {
      console.error("Failed Images Upload", error);
      res.status(400).json({ error: error.message });
    }
  }
);

// Delete business image
router.delete('/:id/images/:public_id', authenticate, async (req, res) => {
   console.log('Incoming public_id:', req.params.public_id);
  try {
    const { id, public_id } = req.params;

    // 1. Check if the business exists
    const business = await Business.findById(id);
    if (!business) {
      console.log("Business not found");
      return res.status(404).json({ error: 'Business not found' });
    }

    // 2. Check if the image exists in MongoDB
    const imageExists = business.images.some(img => img.public_id === public_id);
    if (!imageExists) {
      console.log("Image not found");
      return res.status(404).json({ error: 'Image not found' });
    }

    // 3. Delete from Cloudinary (if public_id is valid)
    await cloudinary.uploader.destroy(public_id);

    // 4. Remove from MongoDB
    await Business.findByIdAndUpdate(
      id,
      { $pull: { images: { public_id } }}
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});


// Get business profile
router.get('/:id', authenticate, async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) throw new Error('Business not found');
    res.json(business);
  } catch (error) {
    console.error("Error Here Man:", error);
    res.status(404).json({ error: error.message });
  }
});

// Update business profile
router.put('/:id', authenticate, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      throw new Error('Unauthorized to update this profile');
    }
    
    const business = await Business.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json(business);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Search businesses
router.get('/', async (req, res) => {
  try {
    const { business_type, location, search } = req.query;
    const query = {};
    
    if (business_type) query.business_type = business_type;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (search) {
      query.$or = [
        { business_name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const businesses = await Business.find(query);
    res.json(businesses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;