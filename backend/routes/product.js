const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Business = require('../models/Business');
const mongoose = require('mongoose');
const { cloudinary } = require('../config/cloudinary');
const jwt = require('jsonwebtoken');
//const authenticate = require('../middleware/authenticate')
const { uploadProductImages, uploadProductMainImage } = require('../middleware/upload');

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

// Set product main image
router.post('/:id/mainImage',
  authenticate,
  uploadProductMainImage,
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      
      // Delete old main image if exists
      if (product.mainImage?.public_id) {
        await cloudinary.uploader.destroy(product.mainImage.public_id);
      }

      product.mainImage = {
        public_id: req.file.filename,
        url: req.file.path
      };

      await product.save();
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Add product gallery images
router.post('/:id/gallery',
  authenticate, (req, res, next) => {
  uploadProductImages(req, res, function (err) {
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
      const product = await Product.findById(req.params.id);
      
      const newImages = req.files.map(file => ({
        public_id: file.filename,
        url: file.path,
        altText: file.originalname
      }));

      product.gallery.push(...newImages);
      await product.save();
      
      res.status(201).json({gallery: product.gallery});
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Get single product by ID
router.get('/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate('business_id');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete business image
router.delete('/:id/gallery/:public_id', authenticate, async (req, res) => {
  try {
    const { id, public_id } = req.params;
    const decodedPublicId = decodeURIComponent(public_id);

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const imageIndex = product.gallery.findIndex(img => img.public_id === decodedPublicId);
    if (imageIndex === -1) return res.status(404).json({ error: 'Image not found' });

    await cloudinary.uploader.destroy(decodedPublicId);
    product.gallery.splice(imageIndex, 1);
    await product.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// Create product/service listing
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get products/services by business
router.get('/business/:businessId', async (req, res) => {
  try {
    const products = await Product.find({ business_id: req.params.businessId });
    res.json(products);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update product/service listing by ID
router.put('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    // Optionally: Validate productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    // Find and update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("error updating product",  error);
    res.status(400).json({ error: error.message });
  }
});

// Search products/services
router.get('/search', async (req, res) => {
  try {
    const { category, min_price, max_price, location, search } = req.query;
    const query = {};
    
    if (category) query.category = category;
    if (min_price) query.price = { $gte: min_price };
    if (max_price) {
      if (query.price) {
        query.price.$lte = max_price;
      } else {
        query.price = { $lte: max_price };
      }
    }
    if (location) query.location = { $regex: location, $options: 'i' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(query).populate('business_id');
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;