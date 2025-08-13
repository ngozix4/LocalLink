const request = require('supertest');
const app = require('../app');
const { getTestBusiness, getAuthToken } = require('./setup');
const Product = require('../models/Product');
const Business = require('../models/Business');
const jwt = require('jsonwebtoken');



describe('Product API', () => {
  let testProduct;
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
      name: 'Test Product',
      price: 100,
      category: 'test'
    });
  });

  describe('POST /api/products', () => {
    it('should create a product', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          business_id: testBusiness._id,
          name: 'New Product',
          price: 50,
          category: 'new'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.name).toBe('New Product');
    });
  });

describe('PUT /api/products/:productId', () => {
  it('should update product with valid data', async () => {
    const updates = {
      name: 'Updated Product Name',
      price: 150,
      description: 'New description'
    };

    const response = await request(app)
      .put(`/api/products/${testProduct._id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updates);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updates.name);
    expect(response.body.price).toBe(updates.price);
    expect(response.body.description).toBe(updates.description);
  });
});

  describe('GET /api/products/business/:businessId', () => {
    it('should get products by business', async () => {
      const response = await request(app)
        .get(`/api/products/business/${testBusiness._id}`);
      
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/products/search', () => {
    it('should search products', async () => {
      const response = await request(app)
        .get('/api/products/search')
        .query({ category: 'test' });
      
      expect(response.status).toBe(200);
      expect(response.body.some(p => p._id === testProduct._id.toString())).toBe(true);
    });
  });
});