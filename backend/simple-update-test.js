const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const TEST_EMAIL = 'test1234@gmail.com';
const TEST_PASSWORD = 'Middle@2647';
const PROFILE_ID = '1757814718120';

async function testUpdate() {
  try {
    console.log('🔐 Authenticating...');
    const authResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });

    const token = authResponse.data.token;
    console.log('✅ Authentication successful');
    console.log(`👤 User ID from response: ${authResponse.data.user.id}`);

    console.log('\n🧪 Testing update endpoint...');
    const updateResponse = await axios.put(`${BASE_URL}/api/portfolio-profiles/${PROFILE_ID}`, {
      name: 'Updated Profile Name'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Update successful!');
    console.log('Response:', updateResponse.data);

  } catch (error) {
    console.log('❌ Update failed');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.error?.message || error.message);
    console.log('Full response:', JSON.stringify(error.response?.data, null, 2));
  }
}

testUpdate();
