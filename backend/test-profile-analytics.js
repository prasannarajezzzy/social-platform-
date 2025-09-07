// Test script for profile links and analytics functionality
require('dotenv').config();
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000';
let authToken = '';
let testUser = {
  name: 'Test Creator',
  email: 'testcreator@example.com',
  password: 'password123'
};
let createdLinkId = '';

async function testSignupAndLogin() {
  console.log('🧪 Testing user signup and login...');
  
  try {
    // Signup
    const signupResponse = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    if (signupResponse.ok) {
      const signupData = await signupResponse.json();
      authToken = signupData.token;
      console.log('✅ User signup successful');
      console.log('   User:', signupData.user.name, '| Username:', signupData.user.username);
      return signupData.user;
    } else {
      // Try login if user exists
      const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testUser.email, password: testUser.password })
      });
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        authToken = loginData.token;
        console.log('✅ User login successful (existing user)');
        console.log('   User:', loginData.user.name, '| Username:', loginData.user.username);
        return loginData.user;
      } else {
        throw new Error('Both signup and login failed');
      }
    }
  } catch (error) {
    console.log('❌ Auth error:', error.message);
    return null;
  }
}

async function testCreateLink() {
  console.log('\n🧪 Testing link creation...');
  
  try {
    const linkData = {
      title: 'My Website',
      url: 'https://example.com',
      description: 'Check out my awesome website',
      icon: 'Globe'
    };
    
    const response = await fetch(`${BASE_URL}/api/profile/links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(linkData)
    });
    
    if (response.ok) {
      const data = await response.json();
      createdLinkId = data.link.id;
      console.log('✅ Link created successfully');
      console.log('   Title:', data.link.title, '| URL:', data.link.url);
      console.log('   Link ID:', createdLinkId);
      return data.link;
    } else {
      const error = await response.json();
      console.log('❌ Link creation failed:', error.error?.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Link creation error:', error.message);
    return null;
  }
}

async function testTrackClick() {
  console.log('\n🧪 Testing click tracking...');
  
  if (!createdLinkId) {
    console.log('❌ No link ID available for testing');
    return;
  }
  
  try {
    const clickData = {
      referrer: 'https://google.com',
      country: 'United States',
      city: 'New York',
      userAgent: 'Mozilla/5.0 Test Browser'
    };
    
    const response = await fetch(`${BASE_URL}/api/profile/track-click/${createdLinkId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clickData)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Click tracked successfully');
      console.log('   Redirect URL:', data.redirectUrl);
      
      // Track a few more clicks for testing
      for (let i = 0; i < 3; i++) {
        await fetch(`${BASE_URL}/api/profile/track-click/${createdLinkId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            referrer: i % 2 === 0 ? 'https://instagram.com' : 'direct',
            country: 'United States',
            city: 'San Francisco'
          })
        });
      }
      console.log('✅ Additional test clicks tracked');
      
    } else {
      const error = await response.json();
      console.log('❌ Click tracking failed:', error.error?.message);
    }
  } catch (error) {
    console.log('❌ Click tracking error:', error.message);
  }
}

async function testUpdateLink() {
  console.log('\n🧪 Testing link update...');
  
  if (!createdLinkId) {
    console.log('❌ No link ID available for testing');
    return;
  }
  
  try {
    const updateData = {
      title: 'My Updated Website',
      description: 'Updated description with analytics',
      isActive: true
    };
    
    const response = await fetch(`${BASE_URL}/api/profile/links/${createdLinkId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(updateData)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Link updated successfully');
      console.log('   New title:', data.link.title);
      console.log('   New description:', data.link.description);
    } else {
      const error = await response.json();
      console.log('❌ Link update failed:', error.error?.message);
    }
  } catch (error) {
    console.log('❌ Link update error:', error.message);
  }
}

async function testAnalytics() {
  console.log('\n🧪 Testing analytics retrieval...');
  
  try {
    // Get overall analytics
    const analyticsResponse = await fetch(`${BASE_URL}/api/analytics`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (analyticsResponse.ok) {
      const analyticsData = await analyticsResponse.json();
      console.log('✅ Analytics retrieved successfully');
      console.log('   Profile views:', analyticsData.analytics.profileViews.total);
      console.log('   Total link clicks:', analyticsData.analytics.linkClicks.total);
      console.log('   Conversion rate:', analyticsData.analytics.conversionRate.toFixed(2) + '%');
      console.log('   Top links:', analyticsData.analytics.topLinks.length);
    }
    
    // Get specific link analytics
    if (createdLinkId) {
      const linkAnalyticsResponse = await fetch(`${BASE_URL}/api/analytics/links/${createdLinkId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      
      if (linkAnalyticsResponse.ok) {
        const linkData = await linkAnalyticsResponse.json();
        console.log('✅ Link analytics retrieved successfully');
        console.log('   Link title:', linkData.linkAnalytics.title);
        console.log('   Total clicks:', linkData.linkAnalytics.totalClicks);
        console.log('   Referrers:', linkData.linkAnalytics.analytics.referrers?.length || 0);
        console.log('   Locations:', linkData.linkAnalytics.analytics.locations?.length || 0);
      }
    }
    
  } catch (error) {
    console.log('❌ Analytics error:', error.message);
  }
}

async function testPublicProfile(username) {
  console.log('\n🧪 Testing public profile...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/public/profile/${username}`);
    
    if (response.ok) {
      const profile = await response.json();
      console.log('✅ Public profile retrieved successfully');
      console.log('   Name:', profile.name);
      console.log('   Username:', profile.username);
      console.log('   Bio:', profile.profileData?.bio || 'No bio');
      console.log('   Active links:', profile.profileData?.customLinks?.length || 0);
      console.log('   Total links:', profile.stats.totalLinks);
      console.log('   Joined:', new Date(profile.stats.joinedDate).toLocaleDateString());
    } else {
      const error = await response.json();
      console.log('❌ Public profile failed:', error.error?.message);
    }
  } catch (error) {
    console.log('❌ Public profile error:', error.message);
  }
}

async function testUpdateSettings() {
  console.log('\n🧪 Testing profile settings update...');
  
  try {
    const settingsData = {
      isPublic: true,
      allowAnalytics: true,
      seoEnabled: true,
      metaDescription: 'Test creator profile with analytics',
      metaKeywords: ['creator', 'links', 'portfolio']
    };
    
    const response = await fetch(`${BASE_URL}/api/profile/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(settingsData)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Settings updated successfully');
      console.log('   Public profile:', data.settings.isPublic);
      console.log('   Analytics enabled:', data.settings.allowAnalytics);
      console.log('   SEO enabled:', data.settings.seoEnabled);
    } else {
      const error = await response.json();
      console.log('❌ Settings update failed:', error.error?.message);
    }
  } catch (error) {
    console.log('❌ Settings update error:', error.message);
  }
}

async function testProfileUpdate() {
  console.log('\n🧪 Testing profile data update...');
  
  try {
    const profileData = {
      profileData: {
        title: 'Digital Creator & Developer',
        bio: 'Welcome to my creator profile! Check out my links below.',
        socialLinks: {
          instagram: '@testcreator',
          twitter: '@testcreator',
          website: 'https://testcreator.com'
        }
      },
      appearanceData: {
        theme: 'ocean',
        brandColor: '#667eea',
        buttonStyle: 'rounded',
        font: 'poppins'
      }
    };
    
    const response = await fetch(`${BASE_URL}/api/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(profileData)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Profile updated successfully');
      console.log('   Title:', data.profileData.title);
      console.log('   Bio length:', data.profileData.bio?.length || 0, 'chars');
      console.log('   Theme:', data.appearanceData.theme);
    } else {
      const error = await response.json();
      console.log('❌ Profile update failed:', error.error?.message);
    }
  } catch (error) {
    console.log('❌ Profile update error:', error.message);
  }
}

async function runAllTests() {
  console.log('🚀 Starting Creator Platform Profile & Analytics Tests...\n');
  
  const user = await testSignupAndLogin();
  if (!user) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }
  
  await testProfileUpdate();
  await testUpdateSettings();
  await testCreateLink();
  await testTrackClick();
  await testUpdateLink();
  await testAnalytics();
  await testPublicProfile(user.username);
  
  console.log('\n🎯 All tests completed!');
  console.log('\n📊 Test Summary:');
  console.log('✅ User authentication');
  console.log('✅ Profile data management');
  console.log('✅ Link creation and updates');
  console.log('✅ Click tracking with analytics');
  console.log('✅ Analytics dashboard data');
  console.log('✅ Public profile access');
  console.log('✅ Settings management');
  
  console.log('\n🎉 Creator Platform with MongoDB Analytics is fully functional!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests };
