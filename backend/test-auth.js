// Simple test script to verify authentication endpoints
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000/api/auth';

async function testSignup() {
  try {
    console.log('🧪 Testing signup endpoint...');
    
    const response = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Signup successful!');
      console.log('User:', data.user);
      console.log('Token received:', data.token ? 'Yes' : 'No');
      return data.token;
    } else {
      console.log('❌ Signup failed:', data.error?.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Signup error:', error.message);
    return null;
  }
}

async function testLogin() {
  try {
    console.log('\n🧪 Testing login endpoint...');
    
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('User:', data.user);
      console.log('Token received:', data.token ? 'Yes' : 'No');
      return data.token;
    } else {
      console.log('❌ Login failed:', data.error?.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
    return null;
  }
}

async function testProfile(token) {
  try {
    console.log('\n🧪 Testing profile endpoint...');
    
    const response = await fetch(`${BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Profile fetch successful!');
      console.log('Profile:', data);
      return true;
    } else {
      console.log('❌ Profile fetch failed:', data.error?.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Profile fetch error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting authentication tests...\n');

  // Test signup
  const signupToken = await testSignup();
  
  // Test login
  const loginToken = await testLogin();
  
  // Test profile with token from login
  if (loginToken) {
    await testProfile(loginToken);
  }

  console.log('\n🎯 Tests completed!');
}

// Only run if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testSignup, testLogin, testProfile };
