const request = require('supertest');
const app = require('../app');
const Business = require('../models/Business');
const jwt = require('jsonwebtoken');

describe('Business API', () => {
  let testBusiness;
  let authToken;

  beforeAll(async () => {
    // Create a test business
    testBusiness = await Business.create({
      email: 'business@test.com',
      password: 'password',
      business_name: 'Test Business'
    });

    // Generate a JWT for authenticated requests
    authToken = jwt.sign(
      { userId: testBusiness._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  describe('GET /api/businesses/:id', () => {
    it('should get business profile with valid ID', async () => {
      const response = await request(app)
        .get(`/api/businesses/${testBusiness._id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      console.log('Business response:', {
        status: response.status,
        body: response.body
      });
      
      expect(response.status).toBe(200);
      expect(response.body.business_name).toBe('Test Business');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get(`/api/businesses/${testBusiness._id}`);
      
      console.log('Unauthorized response:', {
        status: response.status,
        body: response.body
      });
      
      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/businesses/:id', () => {
    it('should update business profile', async () => {
      const response = await request(app)
        .put(`/api/businesses/${testBusiness._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ business_name: 'Updated Name' });
      
      console.log('Update response:', {
        status: response.status,
        body: response.body
      });
      
      expect(response.status).toBe(200);
      expect(response.body.business_name).toBe('Updated Name');
    });
  });

  describe('GET /api/businesses', () => {
    it('should search businesses', async () => {
      await Business.create([
        { 
            email: 'restaurant@test.com', 
            password: 'password123', 
            business_name: 'Test Restaurant', 
            business_type: 'restaurant' 
        },
        { 
            email: 'retail@test.com', 
            password: 'password123', 
            business_name: 'Test Retail', 
            business_type: 'retail' 
        }
        ]);

      const response = await request(app)
        .get('/api/businesses')
        .query({ business_type: 'restaurant' });
      
      console.log('Search response:', {
        status: response.status,
        body: response.body
      });
      
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].business_type).toBe('restaurant');
    });
  });
  afterEach(async () => {
    const count = await Business.countDocuments();
    console.log(`Businesses in DB after test: ${count}`);
  });
});