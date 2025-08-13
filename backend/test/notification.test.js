const request = require('supertest');
const app = require('../app');
const Notification = require('../models/Notification');
const Business = require('../models/Business');
const jwt = require('jsonwebtoken');



describe('Notification API', () => {
  let testNotification;
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

    testNotification = await Notification.create({
      business_id: testBusiness._id,
      type: 'test_notification',
      message: 'Test notification',
      read: false
    });
  });

  describe('GET /api/notifications/business/:businessId', () => {
    it('should get notifications for business', async () => {
      const response = await request(app)
        .get(`/api/notifications/business/${testBusiness._id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.some(n => n._id === testNotification._id.toString())).toBe(true);
    });
  });

  describe('PUT /api/notifications/:id/read', () => {
    it('should mark notification as read', async () => {
      const response = await request(app)
        .put(`/api/notifications/${testNotification._id}/read`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.read).toBe(true);
    });
  });
});