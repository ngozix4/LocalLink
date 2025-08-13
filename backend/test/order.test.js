const request = require('supertest');
const app = require('../app');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Business = require('../models/Business');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');





describe('Order API', () => {
  let testProduct;
  let testOrder;
  let authToken;
  let testBusiness;

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
    
    testProduct = await Product.create({
      business_id: testBusiness._id,
      name: 'Order Test Product',
      price: 200
    });

  });

  describe('POST /api/orders', () => {
    it('should create an order', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          buyer_id: testBusiness._id,
          supplier_id: testBusiness._id,
          product_id: testProduct._id,
          quantity: 2
        });
      
      testOrder = response.body;
      
      expect(response.status).toBe(201);
      expect(response.body.status).toBe('pending');
    });
  });

  describe('PUT /api/orders/:id/status', () => {
    it('should update order status with valid QR', async () => {
      const response = await request(app)
        .put(`/api/orders/${testOrder._id}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'completed',
          verification_code: 'VALID_QR_CODE'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('completed');
    });

    it('should reject invalid QR code', async () => {
      const response = await request(app)
        .put(`/api/orders/${testOrder._id}/status`)
        .send({
          status: 'completed',
          verification_code: 'INVALID_CODE'
        });
      
      expect(response.status).toBe(400);
    });
  });
});