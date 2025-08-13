const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Your Express app
const Business = require('../models/Business');
const jwt = require('jsonwebtoken');
const { cloudinary } = require('../config/cloudinary');


describe('Business Image Upload API', () => {
  let authToken;
  let testBusiness;

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
  });

  describe('POST /api/businesses/:id/logo', () => {
    it('should upload a logo for the business', async () => {
      const response = await request(app)
        .post(`/api/businesses/${testBusiness._id}/logo`)
        .set('Authorization', `Bearer ${authToken}`)
        .attach('logo', './test/fixtures/logo.png'); // You need a test image file

      expect(response.status).toBe(200);
      expect(response.body.logo).toHaveProperty('url');
      expect(response.body.logo).toHaveProperty('public_id');

      // Verify the logo was saved in the database
      const updatedBusiness = await Business.findById(testBusiness._id);
      expect(updatedBusiness.logo.url).toBe(response.body.logo.url);
    });

    it('should replace existing logo when uploading new one', async () => {
      // First upload a logo
      const firstUpload = await request(app)
        .post(`/api/businesses/${testBusiness._id}/logo`)
        .set('Authorization', `Bearer ${authToken}`)
        .attach('logo', './test/fixtures/logo.png');

      const oldPublic_id = firstUpload.body.logo.public_id;

      // Upload a new logo
      const response = await request(app)
        .post(`/api/businesses/${testBusiness._id}/logo`)
        .set('Authorization', `Bearer ${authToken}`)
        .attach('logo', './test/fixtures/icon.png'); // Another test image

      expect(response.status).toBe(200);
      
      // Verify the old logo was deleted from Cloudinary
      const { resources } = await cloudinary.api.resources_by_ids([oldPublic_id]);
      expect(resources).toHaveLength(0);
    });
   
  });

  describe('POST /api/businesses/:id/images', () => {
    it('should upload multiple images for the business', async () => {
      const response = await request(app)
        .post(`/api/businesses/${testBusiness._id}/images`)
        .set('Authorization', `Bearer ${authToken}`)
        .attach('images', './test/fixtures/image1.jpg')
        .attach('images', './test/fixtures/image2.jpg');

      expect(response.status).toBe(201);
      expect(response.body.images).toHaveLength(2);
      expect(response.body.images[0]).toHaveProperty('url');
      expect(response.body.images[0]).toHaveProperty('public_id');

      // Verify images were saved in the database
      const updatedBusiness = await Business.findById(testBusiness._id);
      expect(updatedBusiness.images).toHaveLength(2);
    });

    it('should enforce maximum of 5 images', async () => {
      // First upload 3 images
      const response = await request(app)
        .post(`/api/businesses/${testBusiness._id}/images`)
        .set('Authorization', `Bearer ${authToken}`)
        .attach('images', './test/fixtures/image1.jpg')
        .attach('images', './test/fixtures/image2.jpg')
        .attach('images', './test/fixtures/image3.jpg')
        .attach('images', './test/fixtures/image4.jpg')
        .attach('images', './test/fixtures/image5.jpg')
        .attach('images', './test/fixtures/image6.jpg');

      expect(response.status).toBe(400);
      expect(response.body.error).toMatch('Too many files');
    });
  });

  describe('DELETE /api/businesses/:id/images/:public_id', () => {
    it('should delete a business image', async () => {
      // First upload an image
      const uploadResponse = await request(app)
        .post(`/api/businesses/${testBusiness._id}/images`)
        .set('Authorization', `Bearer ${authToken}`)
        .attach('images', './test/fixtures/image1.jpg');

      const public_id = String(uploadResponse.body.images[0].public_id);

      console.log('public_id:', public_id, typeof public_id); // Check value and type

      
      // Delete the image
      const response =  await request(app) 
     .delete(`/api/businesses/${testBusiness._id}/images/${encodeURIComponent(public_id)}`)
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
        .delete(`/api/businesses/${testBusiness._id}/images/nonexistent-public-id`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

   afterAll(async () => {
    // Clean up any uploaded files from Cloudinary
    if (testBusiness.logo?.public_id) {
      await cloudinary.uploader.destroy(testBusiness.logo.public_id);
    }
    
    if (testBusiness.images?.length > 0) {
      for (const image of testBusiness.images) {
        await cloudinary.uploader.destroy(image.public_id);
      }
    }
    
    await Business.deleteMany({});
  });
});