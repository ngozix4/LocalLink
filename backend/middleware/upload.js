const multer = require('multer');
const { businessStorage, productStorage } = require('../config/cloudinary');

const uploadBusinessImages = multer({ 
  storage: businessStorage,
  limits: { files: 5 }
}).array('images'); // Max 5 images

const uploadBusinessLogo = multer({ 
  storage: businessStorage 
}).single('logo');

const uploadProductImages = multer({ 
  storage: productStorage,
    limits: { files: 10 }
}).array('gallery'); // Max 10 images

const uploadProductMainImage = multer({ 
  storage: productStorage 
}).single('mainImage');

module.exports = {
  uploadBusinessImages,
  uploadBusinessLogo,
  uploadProductImages,
  uploadProductMainImage
};