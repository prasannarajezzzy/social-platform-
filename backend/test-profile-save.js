const mongoose = require('mongoose');
const User = require('./models/User');

// Load environment variables
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pivota';

async function testProfileSave() {
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
    console.log(`📋 Current profile data:`, user.profileData);
    console.log(`📋 Current appearance data:`, user.appearanceData);

    // Test updating profile data
    const testProfileData = {
      title: 'Test Profile Title - Updated',
      bio: 'This is a test bio that was updated',
      username: user.username,
      socialLinks: {
        instagram: 'testuser',
        twitter: 'testuser',
        youtube: 'testuser'
      },
      customLinks: [
        {
          id: 'test-link-1',
          title: 'Test Link 1',
          url: 'https://example.com',
          description: 'Test description',
          icon: 'ExternalLink',
          isActive: true,
          order: 0
        }
      ]
    };

    const testAppearanceData = {
      theme: 'ocean',
      brandColor: '#667eea',
      backgroundColor: '#ffffff',
      buttonStyle: 'pill',
      buttonLayout: 'grid',
      font: 'poppins',
      customCSS: '/* Test custom CSS */'
    };

    // Update the user's profile
    user.profileData = testProfileData;
    user.appearanceData = testAppearanceData;
    user.lastProfileUpdate = new Date();
    
    await user.save();

    console.log('✅ Profile updated successfully');
    console.log(`📋 Updated profile data:`, user.profileData);
    console.log(`📋 Updated appearance data:`, user.appearanceData);

    // Test the public profile endpoint
    const fetch = require('node-fetch');
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
    
    try {
      const response = await fetch(`${baseUrl}/api/public/profile/${user.username}`);
      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ Public profile endpoint working!');
        console.log('📋 Public profile data:', {
          name: data.name,
          username: data.username,
          title: data.profileData?.title,
          bio: data.profileData?.bio,
          theme: data.appearanceData?.theme,
          brandColor: data.appearanceData?.brandColor,
          hasLinks: data.profileData?.customLinks?.length > 0
        });
      } else {
        console.log('❌ Public profile endpoint failed:', data.error?.message);
      }
    } catch (error) {
      console.log('❌ Error testing public profile endpoint:', error.message);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the test
testProfileSave();
