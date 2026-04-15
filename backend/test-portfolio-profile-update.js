const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

// Import the User model
const User = require('./models/User');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const TEST_EMAIL = 'test1234@gmail.com';
const TEST_PASSWORD = 'Middle@2647';
const PROFILE_ID = '1757814718120'; // The profile ID from your MongoDB data

let authToken = '';
let userId = '';

// Helper function to make authenticated requests
const makeRequest = async (method, url, data = null) => {
  const config = {
    method,
    url: `${BASE_URL}${url}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    }
  };
  
  if (data) {
    config.data = data;
  }
  
  return axios(config);
};

// Test data for updates
const testUpdateData = {
  name: 'Updated ML Engineer Portfolio',
  description: 'Updated description for ML engineer portfolio',
  portfolioData: {
    profileName: 'Senior ML Engineer',
    fullName: 'Prasanna Rajendra Vaddkkepurakkal',
    portfolioUsername: 'prasanna-ml',
    resumeUrl: 'https://example.com/resume.pdf',
    contactInfo: {
      phone: '+1-234-567-8900',
      email: 'prasanna.ml@example.com',
      additionalContacts: [
        {
          label: 'LinkedIn',
          value: 'https://linkedin.com/in/prasanna-ml',
          type: 'social'
        }
      ]
    },
    sections: [
      {
        id: 'about',
        sectionName: 'About Me',
        title: 'About Me',
        bulletPoints: [
          'Experienced Machine Learning Engineer with 5+ years in AI/ML',
          'Specialized in deep learning, computer vision, and NLP',
          'Passionate about building scalable ML solutions'
        ],
        order: 0,
        subsections: []
      },
      {
        id: 'experience',
        sectionName: 'Professional Experience',
        title: 'Professional Experience',
        bulletPoints: [],
        order: 1,
        subsections: [
          {
            id: 'exp1',
            title: 'Senior ML Engineer at TechCorp',
            bulletPoints: [
              'Led development of computer vision models for autonomous vehicles',
              'Improved model accuracy by 15% through advanced feature engineering',
              'Mentored junior engineers and conducted ML workshops'
            ],
            order: 0,
            dateRange: {
              startDate: '2022-01',
              endDate: '2024-12',
              isCurrent: true
            },
            description: 'Leading ML initiatives for autonomous vehicle technology',
            tags: ['Computer Vision', 'Deep Learning', 'Python', 'TensorFlow']
          }
        ]
      },
      {
        id: 'education',
        sectionName: 'Education',
        title: 'Education',
        bulletPoints: [
          'Master of Science in Computer Science - Stanford University (2020)',
          'Bachelor of Technology in Computer Science - IIT Delhi (2018)'
        ],
        order: 2,
        subsections: []
      },
      {
        id: 'skills',
        sectionName: 'Technical Skills',
        title: 'Technical Skills',
        bulletPoints: [
          'Machine Learning: TensorFlow, PyTorch, Scikit-learn',
          'Programming: Python, R, SQL, JavaScript',
          'Cloud Platforms: AWS, GCP, Azure',
          'Data Science: Pandas, NumPy, Matplotlib, Seaborn'
        ],
        order: 3,
        subsections: []
      }
    ],
    appearance: {
      portfolioMode: 'tech',
      colorScheme: 'purple',
      layout: 'modern',
      fontFamily: 'roboto',
      fontSize: 'medium',
      backgroundType: 'gradient',
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundPattern: 'repeating-linear-gradient(45deg, rgba(102, 126, 234, 0.1) 0px, rgba(102, 126, 234, 0.1) 2px, transparent 2px, transparent 20px)',
      textColor: '#ffffff',
      cardBorderRadius: 'large',
      cardShadow: 'large',
      subsectionLayout: 'grid',
      cardDensity: 'comfortable',
      customCSS: '.portfolio-container { border-radius: 20px; }'
    },
    theme: 'modern',
    isPublic: true
  },
  isDefault: true,
  isActive: true
};

// Test suite
class PortfolioProfileUpdateTest {
  constructor() {
    this.testsPassed = 0;
    this.testsFailed = 0;
    this.testResults = [];
  }

  async runTest(testName, testFunction) {
    try {
      console.log(`\n🧪 Running test: ${testName}`);
      await testFunction();
      this.testsPassed++;
      this.testResults.push({ name: testName, status: 'PASSED' });
      console.log(`✅ ${testName} - PASSED`);
    } catch (error) {
      this.testsFailed++;
      this.testResults.push({ name: testName, status: 'FAILED', error: error.message });
      console.log(`❌ ${testName} - FAILED: ${error.message}`);
    }
  }

  async authenticate() {
    try {
      console.log('🔐 Authenticating user...');
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      });

      if (response.data.token) {
        authToken = response.data.token;
        userId = response.data.user.id;
        console.log('✅ Authentication successful');
        console.log(`👤 User ID: ${userId}`);
        console.log(`🎫 Token: ${authToken.substring(0, 20)}...`);
        return true;
      } else {
        throw new Error('No token received from authentication');
      }
    } catch (error) {
      console.log('❌ Authentication failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async testServerHealth() {
    const response = await axios.get(`${BASE_URL}/health`);
    if (response.status !== 200) {
      throw new Error(`Server health check failed: ${response.status}`);
    }
    console.log('✅ Server is healthy');
  }

  async testGetPortfolioProfiles() {
    const response = await makeRequest('GET', '/api/portfolio-profiles');
    if (response.status !== 200) {
      throw new Error(`Failed to get portfolio profiles: ${response.status}`);
    }
    
    const profiles = response.data.profiles;
    const targetProfile = profiles.find(p => p.id === PROFILE_ID);
    
    if (!targetProfile) {
      throw new Error(`Profile with ID ${PROFILE_ID} not found`);
    }
    
    console.log(`✅ Found target profile: ${targetProfile.name}`);
    console.log(`📊 Profile data:`, {
      id: targetProfile.id,
      name: targetProfile.name,
      isDefault: targetProfile.isDefault,
      isActive: targetProfile.isActive,
      portfolioUsername: targetProfile.portfolioData?.portfolioUsername
    });
  }

  async testUpdateProfileBasicInfo() {
    const updateData = {
      name: 'Updated ML Engineer Portfolio',
      description: 'Updated description for ML engineer portfolio'
    };

    const response = await makeRequest('PUT', `/api/portfolio-profiles/${PROFILE_ID}`, updateData);
    
    if (response.status !== 200) {
      throw new Error(`Update failed: ${response.status}`);
    }

    if (!response.data.success) {
      throw new Error('Update response indicates failure');
    }

    // Verify the update
    const getResponse = await makeRequest('GET', '/api/portfolio-profiles');
    const updatedProfile = getResponse.data.profiles.find(p => p.id === PROFILE_ID);
    
    if (updatedProfile.name !== updateData.name) {
      throw new Error(`Name not updated. Expected: ${updateData.name}, Got: ${updatedProfile.name}`);
    }

    if (updatedProfile.description !== updateData.description) {
      throw new Error(`Description not updated. Expected: ${updateData.description}, Got: ${updatedProfile.description}`);
    }

    console.log('✅ Basic profile info updated successfully');
  }

  async testUpdatePortfolioData() {
    const updateData = {
      portfolioData: {
        profileName: 'Senior ML Engineer',
        fullName: 'Prasanna Rajendra Vaddkkepurakkal',
        portfolioUsername: 'prasanna-ml',
        resumeUrl: 'https://example.com/resume.pdf',
        contactInfo: {
          phone: '+1-234-567-8900',
          email: 'prasanna.ml@example.com',
          additionalContacts: [
            {
              label: 'LinkedIn',
              value: 'https://linkedin.com/in/prasanna-ml',
              type: 'social'
            }
          ]
        }
      }
    };

    const response = await makeRequest('PUT', `/api/portfolio-profiles/${PROFILE_ID}`, updateData);
    
    if (response.status !== 200) {
      throw new Error(`Portfolio data update failed: ${response.status}`);
    }

    // Verify the update
    const getResponse = await makeRequest('GET', '/api/portfolio-profiles');
    const updatedProfile = getResponse.data.profiles.find(p => p.id === PROFILE_ID);
    
    if (updatedProfile.portfolioData.profileName !== updateData.portfolioData.profileName) {
      throw new Error(`Profile name not updated. Expected: ${updateData.portfolioData.profileName}, Got: ${updatedProfile.portfolioData.profileName}`);
    }

    if (updatedProfile.portfolioData.portfolioUsername !== updateData.portfolioData.portfolioUsername) {
      throw new Error(`Portfolio username not updated. Expected: ${updateData.portfolioData.portfolioUsername}, Got: ${updatedProfile.portfolioData.portfolioUsername}`);
    }

    console.log('✅ Portfolio data updated successfully');
  }

  async testUpdateSections() {
    const updateData = {
      portfolioData: {
        sections: [
          {
            id: 'about',
            sectionName: 'About Me',
            title: 'About Me',
            bulletPoints: [
              'Experienced Machine Learning Engineer with 5+ years in AI/ML',
              'Specialized in deep learning, computer vision, and NLP',
              'Passionate about building scalable ML solutions'
            ],
            order: 0,
            subsections: []
          },
          {
            id: 'experience',
            sectionName: 'Professional Experience',
            title: 'Professional Experience',
            bulletPoints: [],
            order: 1,
            subsections: [
              {
                id: 'exp1',
                title: 'Senior ML Engineer at TechCorp',
                bulletPoints: [
                  'Led development of computer vision models for autonomous vehicles',
                  'Improved model accuracy by 15% through advanced feature engineering',
                  'Mentored junior engineers and conducted ML workshops'
                ],
                order: 0,
                dateRange: {
                  startDate: '2022-01',
                  endDate: '2024-12',
                  isCurrent: true
                },
                description: 'Leading ML initiatives for autonomous vehicle technology',
                tags: ['Computer Vision', 'Deep Learning', 'Python', 'TensorFlow']
              }
            ]
          }
        ]
      }
    };

    const response = await makeRequest('PUT', `/api/portfolio-profiles/${PROFILE_ID}`, updateData);
    
    if (response.status !== 200) {
      throw new Error(`Sections update failed: ${response.status}`);
    }

    // Verify the update
    const getResponse = await makeRequest('GET', '/api/portfolio-profiles');
    const updatedProfile = getResponse.data.profiles.find(p => p.id === PROFILE_ID);
    
    if (!updatedProfile.portfolioData.sections || updatedProfile.portfolioData.sections.length === 0) {
      throw new Error('Sections not updated or empty');
    }

    const aboutSection = updatedProfile.portfolioData.sections.find(s => s.id === 'about');
    if (!aboutSection || aboutSection.bulletPoints.length === 0) {
      throw new Error('About section not updated properly');
    }

    console.log('✅ Sections updated successfully');
    console.log(`📝 Updated sections count: ${updatedProfile.portfolioData.sections.length}`);
  }

  async testUpdateAppearance() {
    const updateData = {
      portfolioData: {
        appearance: {
          portfolioMode: 'tech',
          colorScheme: 'purple',
          layout: 'modern',
          fontFamily: 'roboto',
          fontSize: 'medium',
          backgroundType: 'gradient',
          backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundPattern: 'repeating-linear-gradient(45deg, rgba(102, 126, 234, 0.1) 0px, rgba(102, 126, 234, 0.1) 2px, transparent 2px, transparent 20px)',
          textColor: '#ffffff',
          cardBorderRadius: 'large',
          cardShadow: 'large',
          subsectionLayout: 'grid',
          cardDensity: 'comfortable',
          customCSS: '.portfolio-container { border-radius: 20px; }'
        }
      }
    };

    const response = await makeRequest('PUT', `/api/portfolio-profiles/${PROFILE_ID}`, updateData);
    
    if (response.status !== 200) {
      throw new Error(`Appearance update failed: ${response.status}`);
    }

    // Verify the update
    const getResponse = await makeRequest('GET', '/api/portfolio-profiles');
    const updatedProfile = getResponse.data.profiles.find(p => p.id === PROFILE_ID);
    
    if (updatedProfile.portfolioData.appearance.colorScheme !== updateData.portfolioData.appearance.colorScheme) {
      throw new Error(`Color scheme not updated. Expected: ${updateData.portfolioData.appearance.colorScheme}, Got: ${updatedProfile.portfolioData.appearance.colorScheme}`);
    }

    if (updatedProfile.portfolioData.appearance.fontFamily !== updateData.portfolioData.appearance.fontFamily) {
      throw new Error(`Font family not updated. Expected: ${updateData.portfolioData.appearance.fontFamily}, Got: ${updatedProfile.portfolioData.appearance.fontFamily}`);
    }

    console.log('✅ Appearance settings updated successfully');
  }

  async testUpdateProfileStatus() {
    const updateData = {
      isDefault: true,
      isActive: true,
      portfolioData: {
        isPublic: true
      }
    };

    const response = await makeRequest('PUT', `/api/portfolio-profiles/${PROFILE_ID}`, updateData);
    
    if (response.status !== 200) {
      throw new Error(`Profile status update failed: ${response.status}`);
    }

    // Verify the update
    const getResponse = await makeRequest('GET', '/api/portfolio-profiles');
    const updatedProfile = getResponse.data.profiles.find(p => p.id === PROFILE_ID);
    
    if (updatedProfile.isDefault !== updateData.isDefault) {
      throw new Error(`Default status not updated. Expected: ${updateData.isDefault}, Got: ${updatedProfile.isDefault}`);
    }

    if (updatedProfile.isActive !== updateData.isActive) {
      throw new Error(`Active status not updated. Expected: ${updateData.isActive}, Got: ${updatedProfile.isActive}`);
    }

    if (updatedProfile.portfolioData.isPublic !== updateData.portfolioData.isPublic) {
      throw new Error(`Public status not updated. Expected: ${updateData.portfolioData.isPublic}, Got: ${updatedProfile.portfolioData.isPublic}`);
    }

    console.log('✅ Profile status updated successfully');
  }

  async testValidationErrors() {
    // Test invalid portfolio username
    try {
      const invalidData = {
        portfolioData: {
          portfolioUsername: 'ab' // Too short
        }
      };

      await makeRequest('PUT', `/api/portfolio-profiles/${PROFILE_ID}`, invalidData);
      throw new Error('Should have failed validation for short username');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Validation correctly rejected short username');
      } else {
        throw new Error(`Unexpected error: ${error.message}`);
      }
    }

    // Test invalid characters in username
    try {
      const invalidData = {
        portfolioData: {
          portfolioUsername: 'invalid@username' // Invalid characters
        }
      };

      await makeRequest('PUT', `/api/portfolio-profiles/${PROFILE_ID}`, invalidData);
      throw new Error('Should have failed validation for invalid characters');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Validation correctly rejected invalid characters');
      } else {
        throw new Error(`Unexpected error: ${error.message}`);
      }
    }
  }

  async testNonExistentProfile() {
    try {
      const nonExistentId = '9999999999999';
      await makeRequest('PUT', `/api/portfolio-profiles/${nonExistentId}`, { name: 'Test' });
      throw new Error('Should have failed for non-existent profile');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('✅ Correctly handled non-existent profile');
      } else {
        throw new Error(`Unexpected error: ${error.message}`);
      }
    }
  }

  async testUnauthorizedAccess() {
    try {
      const response = await axios.put(`${BASE_URL}/api/portfolio-profiles/${PROFILE_ID}`, {
        name: 'Unauthorized Update'
      });
      throw new Error('Should have failed without authentication');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Correctly rejected unauthorized access');
      } else {
        throw new Error(`Unexpected error: ${error.message}`);
      }
    }
  }

  async testFullUpdate() {
    const response = await makeRequest('PUT', `/api/portfolio-profiles/${PROFILE_ID}`, testUpdateData);
    
    if (response.status !== 200) {
      throw new Error(`Full update failed: ${response.status}`);
    }

    // Verify all updates
    const getResponse = await makeRequest('GET', '/api/portfolio-profiles');
    const updatedProfile = getResponse.data.profiles.find(p => p.id === PROFILE_ID);
    
    // Check basic info
    if (updatedProfile.name !== testUpdateData.name) {
      throw new Error(`Name mismatch: Expected ${testUpdateData.name}, Got ${updatedProfile.name}`);
    }

    // Check portfolio data
    if (updatedProfile.portfolioData.profileName !== testUpdateData.portfolioData.profileName) {
      throw new Error(`Profile name mismatch: Expected ${testUpdateData.portfolioData.profileName}, Got ${updatedProfile.portfolioData.profileName}`);
    }

    // Check sections
    if (!updatedProfile.portfolioData.sections || updatedProfile.portfolioData.sections.length !== testUpdateData.portfolioData.sections.length) {
      throw new Error(`Sections count mismatch: Expected ${testUpdateData.portfolioData.sections.length}, Got ${updatedProfile.portfolioData.sections?.length || 0}`);
    }

    // Check appearance
    if (updatedProfile.portfolioData.appearance.colorScheme !== testUpdateData.portfolioData.appearance.colorScheme) {
      throw new Error(`Color scheme mismatch: Expected ${testUpdateData.portfolioData.appearance.colorScheme}, Got ${updatedProfile.portfolioData.appearance.colorScheme}`);
    }

    console.log('✅ Full profile update completed successfully');
    console.log('📊 Final profile summary:', {
      id: updatedProfile.id,
      name: updatedProfile.name,
      description: updatedProfile.description,
      isDefault: updatedProfile.isDefault,
      isActive: updatedProfile.isActive,
      portfolioUsername: updatedProfile.portfolioData.portfolioUsername,
      sectionsCount: updatedProfile.portfolioData.sections.length,
      colorScheme: updatedProfile.portfolioData.appearance.colorScheme,
      lastUpdated: updatedProfile.updatedAt
    });
  }

  async runAllTests() {
    console.log('🚀 Starting Portfolio Profile Update Tests');
    console.log('=' .repeat(60));

    try {
      // Setup
      await this.runTest('Server Health Check', () => this.testServerHealth());
      await this.runTest('User Authentication', () => this.authenticate());
      
      // Basic functionality tests
      await this.runTest('Get Portfolio Profiles', () => this.testGetPortfolioProfiles());
      await this.runTest('Update Basic Profile Info', () => this.testUpdateProfileBasicInfo());
      await this.runTest('Update Portfolio Data', () => this.testUpdatePortfolioData());
      await this.runTest('Update Sections', () => this.testUpdateSections());
      await this.runTest('Update Appearance Settings', () => this.testUpdateAppearance());
      await this.runTest('Update Profile Status', () => this.testUpdateProfileStatus());
      
      // Error handling tests
      await this.runTest('Validation Error Handling', () => this.testValidationErrors());
      await this.runTest('Non-existent Profile Handling', () => this.testNonExistentProfile());
      await this.runTest('Unauthorized Access Handling', () => this.testUnauthorizedAccess());
      
      // Comprehensive test
      await this.runTest('Full Profile Update', () => this.testFullUpdate());

    } catch (error) {
      console.log(`❌ Test setup failed: ${error.message}`);
    }

    // Print results
    this.printResults();
  }

  printResults() {
    console.log('\n' + '=' .repeat(60));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('=' .repeat(60));
    
    console.log(`✅ Tests Passed: ${this.testsPassed}`);
    console.log(`❌ Tests Failed: ${this.testsFailed}`);
    console.log(`📈 Success Rate: ${((this.testsPassed / (this.testsPassed + this.testsFailed)) * 100).toFixed(1)}%`);
    
    if (this.testsFailed > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.testResults
        .filter(result => result.status === 'FAILED')
        .forEach(result => {
          console.log(`  • ${result.name}: ${result.error}`);
        });
    }
    
    console.log('\n✅ PASSED TESTS:');
    this.testResults
      .filter(result => result.status === 'PASSED')
      .forEach(result => {
        console.log(`  • ${result.name}`);
      });

    console.log('\n🎯 CONCLUSION:');
    if (this.testsFailed === 0) {
      console.log('🎉 All tests passed! The portfolio profile update API is working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Please review the issues above.');
    }
  }
}

// Run the tests
async function main() {
  const testSuite = new PortfolioProfileUpdateTest();
  
  try {
    await testSuite.runAllTests();
  } catch (error) {
    console.error('💥 Test suite failed:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Test suite interrupted by user');
  process.exit(0);
});

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = PortfolioProfileUpdateTest;
