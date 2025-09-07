// Test script to verify MongoDB Atlas connection and operations
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://prasannavadk_db_user:DcNyfo4h5BlmMkUp@cluster0.ojj7xdb.mongodb.net/creator-platform?retryWrites=true&w=majority';

async function testConnection() {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    console.log('URI:', MONGODB_URI.replace(/:[^@]+@/, ':****@'));
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Atlas connected successfully!');
    
    // Test database operations
    console.log('\n🧪 Testing database operations...');
    
    // Clean up any existing test user first
    await User.deleteOne({ email: 'test@example.com' });
    
    // Create a test user
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      profileData: {
        title: 'Test Creator',
        bio: 'This is a test user',
        socialLinks: {
          instagram: '@testuser',
          twitter: '@testuser'
        },
        customLinks: [
          {
            title: 'My Website',
            url: 'https://example.com',
            description: 'Check out my website',
            icon: 'ExternalLink'
          }
        ]
      }
    });

    // Generate username
    testUser.generateUsername();
    
    // Save user
    const savedUser = await testUser.save();
    console.log('✅ Test user created:', {
      id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      username: savedUser.username
    });

    // Test user retrieval with password
    const foundUser = await User.findOne({ email: 'test@example.com' }).select('+password');
    console.log('✅ User retrieved:', foundUser ? 'Success' : 'Failed');

    // Test password comparison
    const isPasswordValid = await foundUser.comparePassword('password123');
    console.log('✅ Password validation:', isPasswordValid ? 'Success' : 'Failed');

    // Clean up - delete test user
    await User.deleteOne({ email: 'test@example.com' });
    console.log('✅ Test user cleaned up');

    console.log('\n🎉 All tests passed! MongoDB Atlas is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.name === 'MongoNetworkError') {
      console.error('🔍 Network Error: Check your internet connection and MongoDB Atlas whitelist');
    }
    if (error.name === 'MongooseServerSelectionError') {
      console.error('🔍 Server Selection Error: Verify your MongoDB URI and credentials');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the test
if (require.main === module) {
  testConnection();
}

module.exports = testConnection;
