const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const TEST_EMAIL = 'test1234@gmail.com';
const TEST_PASSWORD = 'Middle@2647';
const PROFILE_ID = '1757814718120';

async function testCompleteFlow() {
  try {
    console.log('🔧 Comprehensive Debug Test');
    console.log('=' .repeat(50));

    // Step 1: Authenticate
    console.log('\n1️⃣ Authenticating...');
    const authResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });

    const token = authResponse.data.token;
    const userId = authResponse.data.user.id;
    console.log('✅ Authentication successful');
    console.log(`👤 User ID: ${userId}`);
    console.log(`🎫 Token: ${token.substring(0, 30)}...`);

    // Step 2: Get portfolio profiles via API
    console.log('\n2️⃣ Getting portfolio profiles via API...');
    const profilesResponse = await axios.get(`${BASE_URL}/api/portfolio-profiles`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (profilesResponse.data.success) {
      console.log('✅ Portfolio profiles retrieved');
      console.log(`📊 Total profiles: ${profilesResponse.data.profiles.length}`);
      
      const targetProfile = profilesResponse.data.profiles.find(p => p.id === PROFILE_ID);
      if (targetProfile) {
        console.log(`✅ Target profile found: ${targetProfile.name}`);
      } else {
        console.log(`❌ Target profile not found in API response`);
        console.log('Available IDs:', profilesResponse.data.profiles.map(p => p.id));
        return;
      }
    } else {
      console.log('❌ Failed to get portfolio profiles');
      return;
    }

    // Step 3: Check database directly
    console.log('\n3️⃣ Checking database directly...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/creator-platform');
    
    const user = await User.findById(userId);
    if (user) {
      console.log('✅ User found in database');
      console.log(`👤 Name: ${user.name}`);
      console.log(`📊 Portfolio profiles: ${user.portfolioProfiles?.length || 0}`);
      
      const dbTargetProfile = user.portfolioProfiles?.find(p => p.id === PROFILE_ID);
      if (dbTargetProfile) {
        console.log(`✅ Target profile found in database: ${dbTargetProfile.name}`);
      } else {
        console.log(`❌ Target profile not found in database`);
        console.log('Available IDs:', user.portfolioProfiles?.map(p => p.id));
        await mongoose.disconnect();
        return;
      }
    } else {
      console.log('❌ User not found in database');
      await mongoose.disconnect();
      return;
    }

    await mongoose.disconnect();

    // Step 4: Test update endpoint with minimal data
    console.log('\n4️⃣ Testing update endpoint...');
    try {
      const updateResponse = await axios.put(`${BASE_URL}/api/portfolio-profiles/${PROFILE_ID}`, {
        name: 'Test Update'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Update successful!');
      console.log('Response:', updateResponse.data);

    } catch (updateError) {
      console.log('❌ Update failed');
      console.log('Status:', updateError.response?.status);
      console.log('Message:', updateError.response?.data?.error?.message);
      
      // Step 5: Try with different profile ID
      console.log('\n5️⃣ Trying with different profile ID...');
      const otherProfile = profilesResponse.data.profiles.find(p => p.id !== PROFILE_ID);
      if (otherProfile) {
        try {
          const otherUpdateResponse = await axios.put(`${BASE_URL}/api/portfolio-profiles/${otherProfile.id}`, {
            name: 'Test Update Other'
          }, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          console.log('✅ Update with other profile successful!');
          console.log('Response:', otherUpdateResponse.data);

        } catch (otherError) {
          console.log('❌ Update with other profile also failed');
          console.log('Status:', otherError.response?.status);
          console.log('Message:', otherError.response?.data?.error?.message);
        }
      }
    }

    // Step 6: Test with different HTTP method
    console.log('\n6️⃣ Testing with POST method...');
    try {
      const postResponse = await axios.post(`${BASE_URL}/api/portfolio-profiles/${PROFILE_ID}`, {
        name: 'Test POST Update'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ POST update successful!');
      console.log('Response:', postResponse.data);

    } catch (postError) {
      console.log('❌ POST update failed');
      console.log('Status:', postError.response?.status);
      console.log('Message:', postError.response?.data?.error?.message);
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testCompleteFlow();
