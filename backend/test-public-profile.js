const mongoose = require('mongoose');
const User = require('./models/User');

// Load environment variables
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pivota';

async function testPublicProfile() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find a user with a username
    const user = await User.findOne({ username: { $exists: true, $ne: '' } });
    
    if (!user) {
      console.log('❌ No user found with username');
      return;
    }

    console.log(`📋 Testing user: ${user.username}`);
    console.log(`📋 Current isPublic setting: ${user.settings?.isPublic}`);

    // Set the profile to public
    if (!user.settings) user.settings = {};
    user.settings.isPublic = true;
    await user.save();

    console.log('✅ Profile set to public');

    // Test the public profile endpoint
    const fetch = require('node-fetch');
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
    
    try {
      const response = await fetch(`${baseUrl}/api/public/profile/${user.username}`);
      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ Public profile endpoint working!');
        console.log('📋 Profile data:', {
          name: data.name,
          username: data.username,
          title: data.profileData?.title,
          hasLinks: data.profileData?.customLinks?.length > 0
        });
      } else {
        console.log('❌ Public profile endpoint failed:', data.error?.message);
      }
    } catch (error) {
      console.log('❌ Error testing public profile endpoint:', error.message);
    }

    // Test with a non-existent username
    try {
      const response = await fetch(`${baseUrl}/api/public/profile/nonexistent`);
      const data = await response.json();
      
      if (response.status === 404) {
        console.log('✅ 404 handling working for non-existent profiles');
      } else {
        console.log('❌ Expected 404 for non-existent profile, got:', response.status);
      }
    } catch (error) {
      console.log('❌ Error testing non-existent profile:', error.message);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the test
testPublicProfile();
