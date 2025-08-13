const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const Business = require('../models/Business');
const mongoose = require('mongoose');
const Connection = require('../models/Connection');




describe('Connection API', () => {
  let testConnection;
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

  describe('POST /api/connections', () => {
    it('should create connection request', async () => {
      const response = await request(app)
        .post('/api/connections')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          business1_id: testBusiness._id,
          business2_id: new mongoose.Types.ObjectId(), // Simulate another business
          status: 'pending'
        });
      
      testConnection = response.body;
      
      expect(response.status).toBe(201);
      expect(response.body.status).toBe('pending');
    });
  });

  describe('PUT /api/connections/:id', () => {
    it('should update connection status', async () => {
      const response = await request(app)
        .put(`/api/connections/${testConnection._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'accepted' });
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('accepted');
    });
  });

  afterEach(async () => {
    const count = await Connection.countDocuments();
    console.log(`Connections in DB after test: ${count}`);
  });
});