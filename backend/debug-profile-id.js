const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const TEST_EMAIL = 'test1234@gmail.com';
const TEST_PASSWORD = 'Middle@2647';
const PROFILE_ID = '1757814718120';

let authToken = '';
let userId = '';

async function authenticate() {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });

    if (response.data.token) {
      authToken = response.data.token;
      userId = response.data.user.id;
      console.log('✅ Authentication successful');
      console.log(`👤 User ID: ${userId}`);
      return true;
    }
  } catch (error) {
    console.log('❌ Authentication failed:', error.response?.data?.error?.message || error.message);
    return false;
  }
}

async function checkDatabaseDirectly() {
  try {
    console.log('\n🔍 Checking database directly...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/creator-platform');
    console.log('✅ Connected to MongoDB');

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ User not found in database');
      return;
    }

    console.log(`👤 User found: ${user.name}`);
    console.log(`📊 Portfolio profiles count: ${user.portfolioProfiles?.length || 0}`);

    if (user.portfolioProfiles && user.portfolioProfiles.length > 0) {
      console.log('\n📋 Portfolio profiles in database:');
      user.portfolioProfiles.forEach((profile, index) => {
        console.log(`\n   Profile ${index + 1}:`);
        console.log(`     🆔 ID: ${profile.id} (type: ${typeof profile.id})`);
        console.log(`     📝 Name: ${profile.name}`);
        console.log(`     🔄 Is Default: ${profile.isDefault}`);
        console.log(`     ✅ Is Active: ${profile.isActive}`);
        
        // Check if this matches our target ID
        if (profile.id === PROFILE_ID) {
          console.log(`     ✅ MATCHES TARGET ID!`);
        } else if (profile.id.toString() === PROFILE_ID) {
          console.log(`     ✅ MATCHES TARGET ID (as string)!`);
        } else if (parseInt(profile.id) === parseInt(PROFILE_ID)) {
          console.log(`     ✅ MATCHES TARGET ID (as number)!`);
        } else {
          console.log(`     ❌ Does not match target ID: ${PROFILE_ID}`);
        }
      });

      // Test the find operation that the server uses
      console.log(`\n🧪 Testing find operation with ID: ${PROFILE_ID}`);
      const foundProfile = user.portfolioProfiles.find(p => p.id === PROFILE_ID);
      console.log(`   Direct comparison (===): ${foundProfile ? 'FOUND' : 'NOT FOUND'}`);
      
      const foundProfileString = user.portfolioProfiles.find(p => p.id.toString() === PROFILE_ID);
      console.log(`   String comparison: ${foundProfileString ? 'FOUND' : 'NOT FOUND'}`);
      
      const foundProfileNumber = user.portfolioProfiles.find(p => parseInt(p.id) === parseInt(PROFILE_ID));
      console.log(`   Number comparison: ${foundProfileNumber ? 'FOUND' : 'NOT FOUND'}`);
    }

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.log('❌ Database check failed:', error.message);
    await mongoose.disconnect();
  }
}

async function testAPIEndpoint() {
  try {
    console.log('\n🧪 Testing API endpoint...');
    
    const response = await axios.get(`${BASE_URL}/api/portfolio-profiles`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (response.data.success) {
      console.log('✅ API endpoint working');
      console.log(`📊 Profiles returned: ${response.data.profiles.length}`);
      
      response.data.profiles.forEach((profile, index) => {
        console.log(`\n   API Profile ${index + 1}:`);
        console.log(`     🆔 ID: ${profile.id} (type: ${typeof profile.id})`);
        console.log(`     📝 Name: ${profile.name}`);
        
        if (profile.id === PROFILE_ID) {
          console.log(`     ✅ MATCHES TARGET ID!`);
        } else {
          console.log(`     ❌ Does not match target ID: ${PROFILE_ID}`);
        }
      });
    }
  } catch (error) {
    console.log('❌ API endpoint test failed:', error.response?.data?.error?.message || error.message);
  }
}

async function main() {
  console.log('🔧 Profile ID Debug Analysis');
  console.log('=' .repeat(50));
  
  const authSuccess = await authenticate();
  if (!authSuccess) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }
  
  await checkDatabaseDirectly();
  await testAPIEndpoint();
  
  console.log('\n💡 Recommendations:');
  console.log('   1. Check if there\'s a type mismatch between string and number');
  console.log('   2. Verify the profile ID format in the database');
  console.log('   3. Check if the profile is properly associated with the user');
}

main().catch(console.error);
