const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const TEST_EMAIL = 'test1234@gmail.com';
const TEST_PASSWORD = 'Middle@2647';
const PROFILE_ID = '1757814718120';

let authToken = '';

async function authenticate() {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });

    if (response.data.token) {
      authToken = response.data.token;
      console.log('✅ Authentication successful');
      console.log(`🎫 Token: ${authToken.substring(0, 30)}...`);
      return true;
    }
  } catch (error) {
    console.log('❌ Authentication failed:', error.response?.data?.error?.message || error.message);
    return false;
  }
}

async function testUpdateWithDetailedLogging() {
  try {
    console.log('\n🧪 Testing update with detailed logging...');
    console.log(`📤 Request URL: ${BASE_URL}/api/portfolio-profiles/${PROFILE_ID}`);
    console.log(`📤 Request Headers:`, {
      'Authorization': `Bearer ${authToken.substring(0, 30)}...`,
      'Content-Type': 'application/json'
    });
    
    const updateData = {
      name: 'Updated Test Profile Name',
      description: 'Updated test description'
    };
    
    console.log(`📤 Request Data:`, updateData);
    console.log(`📤 Profile ID Type: ${typeof PROFILE_ID}`);
    console.log(`📤 Profile ID Value: "${PROFILE_ID}"`);

    const response = await axios.put(`${BASE_URL}/api/portfolio-profiles/${PROFILE_ID}`, updateData, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Update successful!');
    console.log(`📥 Response Status: ${response.status}`);
    console.log(`📥 Response Data:`, JSON.stringify(response.data, null, 2));
    
    return true;
  } catch (error) {
    console.log('❌ Update failed');
    console.log(`📥 Error Status: ${error.response?.status}`);
    console.log(`📥 Error Message: ${error.response?.data?.error?.message || error.message}`);
    console.log(`📥 Full Error Response:`, JSON.stringify(error.response?.data, null, 2));
    
    // Let's also check what the server logs show
    console.log('\n🔍 Server-side debugging info:');
    console.log('   - Check your server console for any error logs');
    console.log('   - The server should log the profileId and user.id values');
    console.log('   - Verify that req.user.id matches the user ID from authentication');
    
    return false;
  }
}

async function testWithDifferentProfileId() {
  try {
    console.log('\n🧪 Testing with a different profile ID...');
    
    // First get all profiles to see what IDs are available
    const profilesResponse = await axios.get(`${BASE_URL}/api/portfolio-profiles`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (profilesResponse.data.success && profilesResponse.data.profiles.length > 0) {
      const firstProfile = profilesResponse.data.profiles[0];
      console.log(`📋 Testing with first profile: ${firstProfile.id}`);
      
      const updateData = {
        name: 'Updated First Profile',
        description: 'Updated description for first profile'
      };

      const response = await axios.put(`${BASE_URL}/api/portfolio-profiles/${firstProfile.id}`, updateData, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Update with first profile successful!');
      console.log(`📥 Response:`, JSON.stringify(response.data, null, 2));
      
      return true;
    }
  } catch (error) {
    console.log('❌ Update with different profile ID also failed');
    console.log(`📥 Error: ${error.response?.data?.error?.message || error.message}`);
    return false;
  }
}

async function main() {
  console.log('🔧 Update Test with Detailed Logging');
  console.log('=' .repeat(50));
  
  const authSuccess = await authenticate();
  if (!authSuccess) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }
  
  await testUpdateWithDetailedLogging();
  await testWithDifferentProfileId();
  
  console.log('\n💡 Next steps:');
  console.log('   1. Check your server console for any error logs');
  console.log('   2. Add console.log statements to the server update endpoint');
  console.log('   3. Verify the user ID and profile ID matching logic');
}

main().catch(console.error);
