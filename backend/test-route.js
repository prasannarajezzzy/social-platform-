const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const TEST_EMAIL = 'test1234@gmail.com';
const TEST_PASSWORD = 'Middle@2647';

async function testRoute() {
  try {
    console.log('🔧 Testing Test Route');
    console.log('=' .repeat(50));

    // Authenticate
    const authResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });

    const token = authResponse.data.token;
    console.log('✅ Authentication successful');

    // Test the test route
    console.log('\n🧪 Testing test route...');
    try {
      const response = await axios.put(`${BASE_URL}/api/test-route`, {
        test: 'data'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Test route successful!');
      console.log('Response:', response.data);

    } catch (error) {
      console.log('❌ Test route failed');
      console.log('Status:', error.response?.status);
      console.log('Message:', error.response?.data?.error?.message || error.message);
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testRoute();
