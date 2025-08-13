const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
  // Start in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  console.log('Using test MongoDB at:', mongoUri);
  
  // Override the MONGODB_URI before app connects
  process.env.MONGODB_URI = mongoUri;
  
  // Initialize mongoose connection
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  
  // Now require your app AFTER setting up the test DB
  require('../app');
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // Clean all collections between tests to ensure isolation
  const collections = mongoose.connection.collections;
  
  // List of collections to preserve (if needed)
  const preserveCollections = ["businesses", "connections", "messages",
    "notifications", "orders", "products"
  ]; // Empty array means clean everything
  
  for (const key in collections) {
    if (!preserveCollections.includes(key)) {
      try {
        await collections[key].deleteMany();
      } catch (error) {
        console.error(`Error cleaning collection ${key}:`, error);
      }
    }
  }
});