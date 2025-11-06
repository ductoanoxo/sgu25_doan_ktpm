const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Prevent accidental connection to real database during tests
process.env.NODE_ENV = 'test';
process.env.MONGO_URL = 'mongodb://localhost:27017/test_in_memory'; // Will be overridden by MongoMemoryServer

// Setup before all tests
beforeAll(async () => {
  try {
    // Disconnect any existing connection (safety measure)
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    console.log(`[TEST] Using in-memory database: ${mongoUri}`);
    
    await mongoose.connect(mongoUri);
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  }
});

// Clean up database after each test to prevent data pollution
afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});

// Teardown after all tests
afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
  console.log('[TEST] In-memory database stopped');
});
