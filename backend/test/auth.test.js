const request = require('supertest');
const app = require('../app');
const Business = require('../models/Business');
const bcrypt = require('bcryptjs');



describe('Auth API', () => {
  const testBusiness = {
    email: 'test@business.com',
    password: 'password123',
    business_name: 'Test Business'
  };

  beforeAll(async () => {
  // Create test business 
  const business = new Business(testBusiness);
  await business.save();
  
  // Verify the stored password
  const dbBusiness = await Business.findOne({ email: testBusiness.email });
  console.log('Stored password hash:', dbBusiness.password);
});

  describe('POST /api/auth/register', () => {
    it('should register a new business', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'new@business.com',
          password: 'newpassword',
          business_name: 'New Business'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe('new@business.com');
    });

    it('should fail with missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'incomplete@test.com' });
      
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with correct credentials', async () => {
  console.log('Trying to login with:', {
    email: testBusiness.email,
    password: testBusiness.password
  });
  
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: testBusiness.email,
      password: testBusiness.password
    });
  
    console.log('Login response:', {
      status: response.status,
      body: response.body
  });
  
  expect(response.status).toBe(200);
});

    it('should fail with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testBusiness.email,
          password: 'wrongpassword'
        });
      
      expect(response.status).toBe(401);
    });
  });

  afterEach(async () => {
  const count = await Business.countDocuments();
  console.log(`Businesses in DB after test: ${count}`);
});
});