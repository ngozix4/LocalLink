const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Business = require('../models/Business');

// Create review (would also interact with blockchain)
router.post('/', async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    
    // Update business rating
    await updateBusinessRating(req.body.business_id);
    
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get reviews for a business
router.get('/business/:businessId', async (req, res) => {
  try {
    const reviews = await Review.find({ business_id: req.params.businessId })
      .populate('reviewer_id');
    res.json(reviews);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Helper function to update business rating
async function updateBusinessRating(businessId) {
  const reviews = await Review.find({ business_id: businessId });
  
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  
  await Business.findByIdAndUpdate(businessId, { rating: averageRating });
}

module.exports = router;