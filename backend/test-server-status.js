const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

async function testServerStatus() {
  try {
    console.log('🔧 Testing Server Status');
    console.log('=' .repeat(50));

    // Test 1: Health check
    console.log('\n1️⃣ Testing health endpoint...');
    try {
      const response = await axios.get(`${BASE_URL}/health`);
      console.log('✅ Health check successful');
      console.log('Status:', response.status);
      console.log('Data:', response.data);
    } catch (error) {
      console.log('❌ Health check failed:', error.message);
      return;
    }

    // Test 2: Root endpoint
    console.log('\n2️⃣ Testing root endpoint...');
    try {
      const response = await axios.get(`${BASE_URL}/`);
      console.log('✅ Root endpoint successful');
      console.log('Status:', response.status);
      console.log('Available endpoints:', Object.keys(response.data.endpoints || {}));
    } catch (error) {
      console.log('❌ Root endpoint failed:', error.message);
    }

    // Test 3: Authentication
    console.log('\n3️⃣ Testing authentication...');
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: 'test1234@gmail.com',
        password: 'Middle@2647'
      });
      console.log('✅ Authentication successful');
      console.log('User ID:', response.data.user.id);
      console.log('Token length:', response.data.token.length);
    } catch (error) {
      console.log('❌ Authentication failed:', error.response?.data?.error?.message || error.message);
      return;
    }

    // Test 4: Get portfolio profiles
    console.log('\n4️⃣ Testing get portfolio profiles...');
    try {
      const authResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: 'test1234@gmail.com',
        password: 'Middle@2647'
      });

      const response = await axios.get(`${BASE_URL}/api/portfolio-profiles`, {
        headers: {
          'Authorization': `Bearer ${authResponse.data.token}`
        }
      });
      console.log('✅ Get portfolio profiles successful');
      console.log('Profiles count:', response.data.profiles.length);
      console.log('First profile ID:', response.data.profiles[0]?.id);
    } catch (error) {
      console.log('❌ Get portfolio profiles failed:', error.response?.data?.error?.message || error.message);
    }

    // Test 5: Check if server has our debug code
    console.log('\n5️⃣ Testing if server has debug code...');
    console.log('If you see debug output in your server console, the server is running updated code.');
    console.log('If not, the server might need to be restarted.');

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testServerStatus();
