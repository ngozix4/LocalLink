const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Your Express app
const Business = require('../models/Business');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');
const { cloudinary } = require('../config/cloudinary');


describe('Product Image Upload API', () => {
  let authToken;
  let testBusiness;
  let testProduct;

  beforeAll(async () => {
    // Create a test business for authentication
    testBusiness = await Business.create({
        email: 'business@test.com',
        password: 'password',
        business_name: 'Test Business'
    });

    // Generate a JWT token for the test business
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

  describe('POST /api/products/:id/main-image', () => {
    it('should upload a main-image for the business', async () => {
      const response = await request(app)
        .post(`/api/products/${testProduct._id}/mainImage`)
        .set('Authorization', `Bearer ${authToken}`)
        .attach('mainImage', './test/fixtures/logo.png'); // You need a test image file

      expect(response.status).toBe(200);
      expect(response.body.mainImage).toHaveProperty('url');
      expect(response.body.mainImage).toHaveProperty('public_id');

      // Verify the main-image was saved in the database
      const updatedProduct = await Product.findById(testProduct._id);
      expect(updatedProduct.mainImage.url).toBe(response.body.mainImage.url);
    });

    it('should replace existing main-image when uploading new one', async () => {
      // First upload a main-image
      const firstUpload = await request(app)
        .post(`/api/products/${testProduct._id}/mainImage`)
        .set('Authorization', `Bearer ${authToken}`)
        .attach('mainImage', './test/fixtures/logo.png');

      const oldPublic_id = firstUpload.body.mainImage.public_id;

      // Upload a new main-image
      const response = await request(app)
        .post(`/api/products/${testProduct._id}/mainImage`)
        .set('Authorization', `Bearer ${authToken}`)
        .attach('mainImage', './test/fixtures/icon.png'); // Another test image

      expect(response.status).toBe(200);
      
      // Verify the old main-image was deleted from Cloudinary
      const { resources } = await cloudinary.api.resources_by_ids([oldPublic_id]);
      expect(resources).toHaveLength(0);
    });
   
  });

  describe('POST /api/products/:id/gallery', () => {
    it('should upload multiple gallery for the Product', async () => {
      const response = await request(app)
        .post(`/api/products/${testProduct._id}/gallery`)
        .set('Authorization', `Bearer ${authToken}`)
        .attach('gallery', './test/fixtures/image1.jpg')
        .attach('gallery', './test/fixtures/image2.jpg');

      expect(response.status).toBe(201);
      expect(response.body.gallery).toHaveLength(2);
      expect(response.body.gallery[0]).toHaveProperty('url');
      expect(response.body.gallery[0]).toHaveProperty('public_id');

      // Verify gallery were saved in the database
      const updatedProduct = await Product.findById(testProduct._id);
      expect(updatedProduct.gallery).toHaveLength(2);
    });
  });

  describe('DELETE /api/products/:id/gallery/:public_id', () => {
    it('should delete a business image', async () => {
      // First upload an image
      const uploadResponse = await request(app)
        .post(`/api/products/${testProduct._id}/gallery`)
        .set('Authorization', `Bearer ${authToken}`)
        .attach('gallery', './test/fixtures/image1.jpg');

      const public_id = String(uploadResponse.body.gallery[0].public_id);

      console.log('public_id:', public_id, typeof public_id); // Check value and type

      
      // Delete the image
      const response =  await request(app) 
     .delete(`/api/products/${testProduct._id}/gallery/${encodeURIComponent(public_id)}`)
     .set('Authorization', `Bearer ${authToken}`);

       console.log('Full response:', response.body); 
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

      // Verify image was deleted from Cloudinary
      const { resources } = await cloudinary.api.resources_by_ids([public_id]);
      expect(resources).toHaveLength(0);
    });

    it('should return 404 if image not found', async () => {
      const response = await request(app)
        .delete(`/api/products/${testProduct._id}/gallery/nonexistent-public-id`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

   afterAll(async () => {
  // Clean Cloudinary assets first
  if (testProduct.mainImage?.public_id) {
    await cloudinary.uploader.destroy(testProduct.mainImage.public_id);
  }
  
  if (testProduct.gallery?.length > 0) {
    await Promise.all(
      testProduct.gallery.map(img => 
        cloudinary.uploader.destroy(img.public_id)
      )
    );
  }

  // Then clean database
  await Product.deleteMany({});
  await Business.deleteMany({});
  
  // Close connections
  await mongoose.connection.close();
  });
});