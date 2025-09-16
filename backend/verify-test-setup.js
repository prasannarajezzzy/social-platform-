#!/usr/bin/env node

/**
 * Verification script to check if the test environment is properly set up
 * before running the portfolio profile update tests.
 */

const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const TEST_EMAIL = 'test1234@gmail.com';
const TEST_PASSWORD = 'Middle@2647';
const PROFILE_ID = '1757814718120';

async function checkServerHealth() {
  try {
    console.log('🔍 Checking server health...');
    const response = await axios.get(`${BASE_URL}/health`, { timeout: 5000 });
    
    if (response.status === 200) {
      console.log('✅ Server is running and healthy');
      console.log(`   📍 Server URL: ${BASE_URL}`);
      console.log(`   🕒 Uptime: ${response.data.uptime}s`);
      console.log(`   🗄️  Database: ${response.data.database}`);
      return true;
    } else {
      console.log(`❌ Server health check failed: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Server is not accessible');
    console.log(`   Error: ${error.message}`);
    console.log(`   Make sure the server is running on ${BASE_URL}`);
    return false;
  }
}

async function checkDatabaseConnection() {
  try {
    console.log('🔍 Checking database connection...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/creator-platform');
    console.log('✅ Database connection successful');
    
    // Import User model
    const User = require('./models/User');
    
    // Check if test user exists
    const user = await User.findOne({ email: TEST_EMAIL });
    if (user) {
      console.log('✅ Test user found');
      console.log(`   👤 Name: ${user.name}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🆔 User ID: ${user._id}`);
      console.log(`   📊 Portfolio Profiles: ${user.portfolioProfiles?.length || 0}`);
      
      // Check if target profile exists
      const targetProfile = user.portfolioProfiles?.find(p => p.id === PROFILE_ID);
      if (targetProfile) {
        console.log('✅ Target portfolio profile found');
        console.log(`   📝 Profile Name: ${targetProfile.name}`);
        console.log(`   🆔 Profile ID: ${targetProfile.id}`);
        console.log(`   🔄 Is Default: ${targetProfile.isDefault}`);
        console.log(`   ✅ Is Active: ${targetProfile.isActive}`);
        console.log(`   🌐 Is Public: ${targetProfile.portfolioData?.isPublic}`);
        console.log(`   👤 Portfolio Username: ${targetProfile.portfolioData?.portfolioUsername}`);
      } else {
        console.log('❌ Target portfolio profile not found');
        console.log(`   Looking for profile ID: ${PROFILE_ID}`);
        console.log(`   Available profiles: ${user.portfolioProfiles?.map(p => p.id).join(', ') || 'None'}`);
        return false;
      }
      
      return true;
    } else {
      console.log('❌ Test user not found');
      console.log(`   Looking for email: ${TEST_EMAIL}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Database connection failed');
    console.log(`   Error: ${error.message}`);
    return false;
  } finally {
    await mongoose.disconnect();
  }
}

async function testAuthentication() {
  try {
    console.log('🔍 Testing authentication...');
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    
    if (response.data.token) {
      console.log('✅ Authentication successful');
      console.log(`   🎫 Token received: ${response.data.token.substring(0, 20)}...`);
      console.log(`   👤 User: ${response.data.user.name}`);
      return true;
    } else {
      console.log('❌ No token received from authentication');
      return false;
    }
  } catch (error) {
    console.log('❌ Authentication failed');
    console.log(`   Error: ${error.response?.data?.error?.message || error.message}`);
    return false;
  }
}

async function testPortfolioProfileAccess() {
  try {
    console.log('🔍 Testing portfolio profile access...');
    
    // First authenticate
    const authResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    
    const token = authResponse.data.token;
    
    // Test getting portfolio profiles
    const response = await axios.get(`${BASE_URL}/api/portfolio-profiles`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.data.success && response.data.profiles) {
      console.log('✅ Portfolio profiles API accessible');
      console.log(`   📊 Total profiles: ${response.data.profiles.length}`);
      
      const targetProfile = response.data.profiles.find(p => p.id === PROFILE_ID);
      if (targetProfile) {
        console.log('✅ Target profile accessible via API');
        console.log(`   📝 Profile: ${targetProfile.name}`);
        console.log(`   📄 Description: ${targetProfile.description}`);
      } else {
        console.log('❌ Target profile not accessible via API');
        return false;
      }
      
      return true;
    } else {
      console.log('❌ Portfolio profiles API not working');
      return false;
    }
  } catch (error) {
    console.log('❌ Portfolio profile access test failed');
    console.log(`   Error: ${error.response?.data?.error?.message || error.message}`);
    return false;
  }
}

async function main() {
  console.log('🔧 Portfolio Profile Update Test - Environment Verification');
  console.log('=' .repeat(60));
  
  const checks = [
    { name: 'Server Health', fn: checkServerHealth },
    { name: 'Database Connection', fn: checkDatabaseConnection },
    { name: 'Authentication', fn: testAuthentication },
    { name: 'Portfolio Profile Access', fn: testPortfolioProfileAccess }
  ];
  
  let allPassed = true;
  
  for (const check of checks) {
    console.log(`\n${check.name}:`);
    try {
      const result = await check.fn();
      if (!result) {
        allPassed = false;
      }
    } catch (error) {
      console.log(`❌ ${check.name} failed with error: ${error.message}`);
      allPassed = false;
    }
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('📋 VERIFICATION SUMMARY');
  console.log('=' .repeat(60));
  
  if (allPassed) {
    console.log('🎉 All checks passed! Your test environment is ready.');
    console.log('✅ You can now run the portfolio profile update tests.');
    console.log('\n🚀 To run the tests:');
    console.log('   npm run test:portfolio');
    console.log('   or');
    console.log('   node test-portfolio-profile-update.js');
  } else {
    console.log('⚠️  Some checks failed. Please fix the issues above before running tests.');
    console.log('\n🔧 Common fixes:');
    console.log('   1. Start your backend server: npm start');
    console.log('   2. Check MongoDB connection');
    console.log('   3. Verify test user exists in database');
    console.log('   4. Ensure the target portfolio profile exists');
  }
  
  console.log('\n📖 For more information, see TEST_README.md');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Verification interrupted by user');
  process.exit(0);
});

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { checkServerHealth, checkDatabaseConnection, testAuthentication, testPortfolioProfileAccess };
