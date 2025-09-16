const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const TEST_EMAIL = 'test1234@gmail.com';
const TEST_PASSWORD = 'Middle@2647';
const PROFILE_ID = '1757814718120';

let authToken = '';

async function authenticate() {
  try {
    console.log('🔐 Authenticating...');
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });

    if (response.data.token) {
      authToken = response.data.token;
      console.log('✅ Authentication successful');
      return true;
    }
  } catch (error) {
    console.log('❌ Authentication failed:', error.response?.data?.error?.message || error.message);
    return false;
  }
}

async function getPortfolioProfiles() {
  try {
    console.log('📊 Getting portfolio profiles...');
    const response = await axios.get(`${BASE_URL}/api/portfolio-profiles`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (response.data.success) {
      console.log('✅ Portfolio profiles retrieved successfully');
      console.log(`📊 Total profiles: ${response.data.profiles.length}`);
      
      response.data.profiles.forEach((profile, index) => {
        console.log(`\n👤 Profile ${index + 1}:`);
        console.log(`   🆔 ID: ${profile.id}`);
        console.log(`   📝 Name: ${profile.name}`);
        console.log(`   📄 Description: ${profile.description}`);
        console.log(`   🔄 Is Default: ${profile.isDefault}`);
        console.log(`   ✅ Is Active: ${profile.isActive}`);
        console.log(`   👤 Portfolio Username: ${profile.portfolioData?.portfolioUsername}`);
      });
      
      return response.data.profiles;
    }
  } catch (error) {
    console.log('❌ Failed to get portfolio profiles:', error.response?.data?.error?.message || error.message);
    return null;
  }
}

async function testUpdateEndpoint(profileId) {
  try {
    console.log(`\n🧪 Testing update endpoint for profile ID: ${profileId}`);
    
    const updateData = {
      name: 'Updated Test Profile',
      description: 'This is an updated description'
    };

    console.log('📤 Sending update request...');
    console.log('Request URL:', `${BASE_URL}/api/portfolio-profiles/${profileId}`);
    console.log('Request data:', updateData);

    const response = await axios.put(`${BASE_URL}/api/portfolio-profiles/${profileId}`, updateData, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Update successful!');
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    return true;
  } catch (error) {
    console.log('❌ Update failed');
    console.log('Error status:', error.response?.status);
    console.log('Error message:', error.response?.data?.error?.message || error.message);
    console.log('Full error response:', JSON.stringify(error.response?.data, null, 2));
    
    return false;
  }
}

async function testServerLogs() {
  try {
    console.log('\n🔍 Checking server endpoint...');
    
    // Test if the endpoint exists by checking the server info
    const response = await axios.get(`${BASE_URL}/`);
    
    if (response.data.endpoints) {
      console.log('📋 Available endpoints:');
      Object.entries(response.data.endpoints).forEach(([key, value]) => {
        if (typeof value === 'string' && value.includes('portfolio-profiles')) {
          console.log(`   ${key}: ${value}`);
        }
      });
    }
  } catch (error) {
    console.log('❌ Failed to get server info:', error.message);
  }
}

async function main() {
  console.log('🔧 Portfolio Profile Update Debug');
  console.log('=' .repeat(50));
  
  const authSuccess = await authenticate();
  if (!authSuccess) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }
  
  const profiles = await getPortfolioProfiles();
  if (!profiles) {
    console.log('❌ Cannot proceed without portfolio profiles');
    return;
  }
  
  // Test the specific profile ID
  const targetProfile = profiles.find(p => p.id === PROFILE_ID);
  if (targetProfile) {
    console.log(`\n🎯 Found target profile: ${targetProfile.name}`);
    await testUpdateEndpoint(PROFILE_ID);
  } else {
    console.log(`\n❌ Target profile ID ${PROFILE_ID} not found`);
    console.log('Available profile IDs:', profiles.map(p => p.id));
    
    // Test with the first available profile
    if (profiles.length > 0) {
      console.log(`\n🧪 Testing with first available profile: ${profiles[0].id}`);
      await testUpdateEndpoint(profiles[0].id);
    }
  }
  
  await testServerLogs();
}

main().catch(console.error);
