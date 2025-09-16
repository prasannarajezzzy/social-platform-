const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const TEST_EMAIL = 'test1234@gmail.com';
const TEST_PASSWORD = 'Middle@2647';
const PROFILE_ID = '1757814718120';

async function testWithoutValidation() {
  try {
    console.log('🔧 Testing update without validation triggers...');
    console.log('=' .repeat(50));

    // Authenticate
    const authResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });

    const token = authResponse.data.token;
    console.log('✅ Authentication successful');

    // Test 1: Minimal update (no portfolioUsername)
    console.log('\n1️⃣ Testing minimal update...');
    try {
      const response = await axios.put(`${BASE_URL}/api/portfolio-profiles/${PROFILE_ID}`, {
        name: 'Minimal Update Test'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Minimal update successful!');
      console.log('Response:', response.data);

    } catch (error) {
      console.log('❌ Minimal update failed');
      console.log('Status:', error.response?.status);
      console.log('Message:', error.response?.data?.error?.message);
    }

    // Test 2: Empty body
    console.log('\n2️⃣ Testing with empty body...');
    try {
      const response = await axios.put(`${BASE_URL}/api/portfolio-profiles/${PROFILE_ID}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Empty body update successful!');
      console.log('Response:', response.data);

    } catch (error) {
      console.log('❌ Empty body update failed');
      console.log('Status:', error.response?.status);
      console.log('Message:', error.response?.data?.error?.message);
    }

    // Test 3: With portfolioUsername validation
    console.log('\n3️⃣ Testing with portfolioUsername validation...');
    try {
      const response = await axios.put(`${BASE_URL}/api/portfolio-profiles/${PROFILE_ID}`, {
        name: 'Validation Test',
        portfolioUsername: 'test-username-123'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Validation update successful!');
      console.log('Response:', response.data);

    } catch (error) {
      console.log('❌ Validation update failed');
      console.log('Status:', error.response?.status);
      console.log('Message:', error.response?.data?.error?.message);
      if (error.response?.data?.error?.details) {
        console.log('Validation details:', error.response.data.error.details);
      }
    }

    // Test 4: Invalid portfolioUsername
    console.log('\n4️⃣ Testing with invalid portfolioUsername...');
    try {
      const response = await axios.put(`${BASE_URL}/api/portfolio-profiles/${PROFILE_ID}`, {
        name: 'Invalid Username Test',
        portfolioUsername: 'ab' // Too short
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Invalid username update successful!');
      console.log('Response:', response.data);

    } catch (error) {
      console.log('❌ Invalid username update failed (expected)');
      console.log('Status:', error.response?.status);
      console.log('Message:', error.response?.data?.error?.message);
      if (error.response?.data?.error?.details) {
        console.log('Validation details:', error.response.data.error.details);
      }
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testWithoutValidation();
