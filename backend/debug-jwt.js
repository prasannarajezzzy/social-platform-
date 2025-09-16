const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const TEST_EMAIL = 'test1234@gmail.com';
const TEST_PASSWORD = 'Middle@2647';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function authenticateAndDecodeToken() {
  try {
    console.log('🔐 Authenticating and decoding token...');
    
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });

    if (response.data.token) {
      const token = response.data.token;
      console.log('✅ Authentication successful');
      console.log(`🎫 Token: ${token.substring(0, 50)}...`);
      
      // Decode the JWT token
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('🔍 Decoded token:', decoded);
      
      return { token, decoded };
    }
  } catch (error) {
    console.log('❌ Authentication failed:', error.response?.data?.error?.message || error.message);
    return null;
  }
}

async function testDirectUserLookup(userId) {
  try {
    console.log(`\n🔍 Testing direct user lookup for ID: ${userId}`);
    
    const mongoose = require('mongoose');
    const User = require('./models/User');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/creator-platform');
    console.log('✅ Connected to MongoDB');
    
    const user = await User.findById(userId);
    if (user) {
      console.log('✅ User found in database');
      console.log(`👤 Name: ${user.name}`);
      console.log(`📧 Email: ${user.email}`);
      console.log(`📊 Portfolio profiles: ${user.portfolioProfiles?.length || 0}`);
      
      if (user.portfolioProfiles && user.portfolioProfiles.length > 0) {
        console.log('📋 Portfolio profiles:');
        user.portfolioProfiles.forEach((profile, index) => {
          console.log(`   ${index + 1}. ID: ${profile.id}, Name: ${profile.name}`);
        });
      }
    } else {
      console.log('❌ User not found in database');
    }
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.log('❌ Database lookup failed:', error.message);
  }
}

async function testAPIWithDecodedToken(token, userId) {
  try {
    console.log(`\n🧪 Testing API with decoded user ID: ${userId}`);
    
    // Test getting portfolio profiles
    const response = await axios.get(`${BASE_URL}/api/portfolio-profiles`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data.success) {
      console.log('✅ Portfolio profiles API working');
      console.log(`📊 Profiles returned: ${response.data.profiles.length}`);
      
      // Test update with first profile
      if (response.data.profiles.length > 0) {
        const firstProfile = response.data.profiles[0];
        console.log(`\n🧪 Testing update with profile: ${firstProfile.id}`);
        
        const updateResponse = await axios.put(`${BASE_URL}/api/portfolio-profiles/${firstProfile.id}`, {
          name: 'Test Update'
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('✅ Update successful!');
        console.log('Response:', updateResponse.data);
      }
    }
  } catch (error) {
    console.log('❌ API test failed:', error.response?.data?.error?.message || error.message);
  }
}

async function main() {
  console.log('🔧 JWT Token Debug Analysis');
  console.log('=' .repeat(50));
  
  const authResult = await authenticateAndDecodeToken();
  if (!authResult) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }
  
  const { token, decoded } = authResult;
  
  await testDirectUserLookup(decoded.id);
  await testAPIWithDecodedToken(token, decoded.id);
}

main().catch(console.error);
