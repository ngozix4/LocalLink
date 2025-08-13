const request = require('supertest');
const app = require('../app');
const Business = require('../models/Business');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Message = require('../models/Message');



describe('Message API', () => {
  let authToken;
  let testBusiness;
  const otherBusinessId = new mongoose.Types.ObjectId();

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

  describe('POST /api/messages', () => {
    it('should send a message', async () => {
      const response = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          sender_id: testBusiness._id,
          receiver_id: otherBusinessId,
          content: 'Test message'
        });
      
      testMessage = response.body;
      
      expect(response.status).toBe(201);
      expect(response.body.content).toBe('Test message');
    });
  });

  describe('GET /api/messages/conversation', () => {
    it('should get conversation between businesses', async () => {
      const response = await request(app)
        .get('/api/messages/conversation')
        .query({
          business1: testBusiness._id.toString(),
          business2: otherBusinessId.toString()
        });
      
      expect(response.status).toBe(200);
      console.log(response.body.content);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  afterEach(async () => {
      const count = await Message.countDocuments();
      console.log(`Message in DB after test: ${count}`);
    });
});