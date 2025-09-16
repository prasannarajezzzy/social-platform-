const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const TEST_EMAIL = 'test1234@gmail.com';

// Common passwords to try
const possiblePasswords = [
  'testpassword123',
  'password123',
  'test1234',
  '12345678',
  'password',
  'test',
  '123456789',
  'admin123',
  'user123',
  'testuser123'
];

async function testAuthentication() {
  console.log('🔐 Testing authentication for user:', TEST_EMAIL);
  console.log('=' .repeat(50));

  for (const password of possiblePasswords) {
    try {
      console.log(`\n🧪 Trying password: ${password}`);
      
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: TEST_EMAIL,
        password: password
      });

      if (response.data.token) {
        console.log('✅ SUCCESS! Authentication successful');
        console.log(`   🎫 Token: ${response.data.token.substring(0, 30)}...`);
        console.log(`   👤 User: ${response.data.user.name}`);
        console.log(`   📧 Email: ${response.data.user.email}`);
        console.log(`   🆔 Username: ${response.data.user.username}`);
        
        console.log('\n💡 To fix your test, update the TEST_PASSWORD in your test file to:');
        console.log(`   const TEST_PASSWORD = '${password}';`);
        
        return password;
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('❌ Invalid password');
      } else {
        console.log(`❌ Error: ${error.message}`);
      }
    }
  }

  console.log('\n❌ None of the common passwords worked.');
  console.log('💡 You may need to:');
  console.log('   1. Reset the password for this user');
  console.log('   2. Create a new test user with known credentials');
  console.log('   3. Check the user registration process');
  
  return null;
}

async function createTestUser() {
  console.log('\n🔧 Creating a new test user...');
  
  const testUserData = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'testpassword123'
  };

  try {
    const response = await axios.post(`${BASE_URL}/api/auth/signup`, testUserData);
    
    if (response.data.token) {
      console.log('✅ Test user created successfully!');
      console.log(`   📧 Email: ${testUserData.email}`);
      console.log(`   🔑 Password: ${testUserData.password}`);
      console.log(`   🎫 Token: ${response.data.token.substring(0, 30)}...`);
      
      console.log('\n💡 To use this user in your test, update:');
      console.log(`   const TEST_EMAIL = '${testUserData.email}';`);
      console.log(`   const TEST_PASSWORD = '${testUserData.password}';`);
      
      return testUserData;
    }
  } catch (error) {
    if (error.response?.status === 400 && error.response.data.error.message.includes('already exists')) {
      console.log('❌ Test user already exists');
    } else {
      console.log(`❌ Error creating test user: ${error.response?.data?.error?.message || error.message}`);
    }
  }
  
  return null;
}

async function main() {
  console.log('🚀 Authentication Test Helper');
  console.log('=' .repeat(50));
  
  // First, try to authenticate with existing user
  const workingPassword = await testAuthentication();
  
  if (!workingPassword) {
    // If no password worked, try creating a new test user
    await createTestUser();
  }
  
  console.log('\n📖 Next steps:');
  console.log('   1. Update your test file with the correct credentials');
  console.log('   2. Run the portfolio profile update tests again');
  console.log('   3. If you created a new user, you may need to create a portfolio profile first');
}

main().catch(console.error);