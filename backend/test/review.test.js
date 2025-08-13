const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Review = require('../models/Review');
const Business = require('../models/Business');
const jwt = require('jsonwebtoken');

describe('Review API', () => {
  let testBusiness;
  let testReviewer;
  let authToken;
  let testReview;

  beforeAll(async () => {
    // Create test businesses (one being reviewed, one as reviewer)
    testBusiness = await Business.create({
      email: 'business@test.com',
      password: 'password123',
      business_name: 'Business Being Reviewed'
    });

    testReviewer = await Business.create({
      email: 'reviewer@test.com',
      password: 'password123',
      business_name: 'Reviewing Business'
    });

    // Generate auth token for reviewer
    authToken = jwt.sign(
      { userId: testReviewer._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  beforeEach(async () => {
    // Clear reviews before each test
    await Review.deleteMany({});
  });

  afterAll(async () => {
    await Business.deleteMany({});
    await Review.deleteMany({});
  });

  describe('POST /api/reviews', () => {
    it('should create a new review and update business rating', async () => {
      const reviewData = {
        business_id: testBusiness._id,
        reviewer_id: testReviewer._id,
        rating: 4,
        comment: 'Great service!'
      };

      const response = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${authToken}`)
        .send(reviewData);

      expect(response.status).toBe(201);
      expect(response.body.rating).toBe(4);
      expect(response.body.comment).toBe('Great service!');

      // Verify business rating was updated
      const updatedBusiness = await Business.findById(testBusiness._id);
      expect(updatedBusiness.rating).toBe(4);
    });

    it('should reject invalid ratings', async () => {
      const response = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          business_id: testBusiness._id,
          reviewer_id: testReviewer._id,
          rating: 6, // Invalid
          comment: 'Too high rating'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/validation failed/i);
    });
  });

  describe('GET /api/reviews/business/:businessId', () => {
    beforeEach(async () => {
      // Create test reviews
      testReview = await Review.create({
        business_id: testBusiness._id,
        reviewer_id: testReviewer._id,
        rating: 5,
        comment: 'Excellent!'
      });
    });

    it('should get reviews for a business', async () => {
      const response = await request(app)
        .get(`/api/reviews/business/${testBusiness._id}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].rating).toBe(5);
      expect(response.body[0].reviewer_id.business_name).toBe('Reviewing Business');
    });

    it('should return empty array for business with no reviews', async () => {
      const newBusiness = await Business.create({
        email: 'new@business.com',
        password: 'password123',
        business_name: 'New Business'
      });

      const response = await request(app)
        .get(`/api/reviews/business/${newBusiness._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return 404 for invalid business ID', async () => {
      const response = await request(app)
        .get('/api/reviews/business/invalid_id');

      expect(response.status).toBe(404);
    });
  });
});