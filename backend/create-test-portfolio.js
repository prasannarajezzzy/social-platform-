const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const TEST_EMAIL = 'testuser@example.com';
const TEST_PASSWORD = 'testpassword123';

let authToken = '';

async function authenticate() {
  try {
    console.log('🔐 Authenticating test user...');
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });

    if (response.data.token) {
      authToken = response.data.token;
      console.log('✅ Authentication successful');
      return true;
    }
  } catch (error) {
    console.log('❌ Authentication failed:', error.response?.data?.error?.message || error.message);
    return false;
  }
}

async function createPortfolioProfile() {
  try {
    console.log('📝 Creating portfolio profile...');
    
    const portfolioData = {
      name: 'Test ML Engineer Portfolio',
      description: 'Test portfolio for ML engineer',
      portfolioData: {
        isPortfolioEnabled: true,
        profileName: 'Test ML Engineer',
        fullName: 'Test User',
        portfolioUsername: 'test-ml-engineer',
        resumeUrl: 'https://example.com/resume.pdf',
        contactInfo: {
          phone: '+1-234-567-8900',
          email: 'testuser@example.com',
          additionalContacts: []
        },
        sections: [
          {
            id: 'about',
            sectionName: 'About Me',
            title: 'About Me',
            bulletPoints: [
              'Experienced Machine Learning Engineer',
              'Passionate about AI and data science',
              'Building scalable ML solutions'
            ],
            order: 0,
            subsections: []
          },
          {
            id: 'experience',
            sectionName: 'Experience',
            title: 'Experience',
            bulletPoints: [],
            order: 1,
            subsections: [
              {
                id: 'exp1',
                title: 'ML Engineer at TestCorp',
                bulletPoints: [
                  'Developed machine learning models',
                  'Improved model accuracy by 20%',
                  'Led ML team initiatives'
                ],
                order: 0,
                dateRange: {
                  startDate: '2022-01',
                  endDate: '2024-12',
                  isCurrent: true
                },
                description: 'Leading ML development projects',
                tags: ['Machine Learning', 'Python', 'TensorFlow']
              }
            ]
          },
          {
            id: 'education',
            sectionName: 'Education',
            title: 'Education',
            bulletPoints: [
              'Master of Science in Computer Science - Test University (2020)',
              'Bachelor of Technology in Computer Science - Test Institute (2018)'
            ],
            order: 2,
            subsections: []
          },
          {
            id: 'skills',
            sectionName: 'Skills',
            title: 'Skills',
            bulletPoints: [
              'Machine Learning: TensorFlow, PyTorch, Scikit-learn',
              'Programming: Python, R, SQL, JavaScript',
              'Cloud Platforms: AWS, GCP, Azure',
              'Data Science: Pandas, NumPy, Matplotlib'
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
          backgroundPattern: '',
          textColor: '#ffffff',
          cardBorderRadius: 'medium',
          cardShadow: 'medium',
          subsectionLayout: 'grid',
          cardDensity: 'comfortable',
          customCSS: ''
        },
        theme: 'modern',
        isPublic: true
      },
      isDefault: true,
      isActive: true
    };

    const response = await axios.post(`${BASE_URL}/api/portfolio-profiles`, portfolioData, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      console.log('✅ Portfolio profile created successfully!');
      console.log(`   🆔 Profile ID: ${response.data.profile.id}`);
      console.log(`   📝 Profile Name: ${response.data.profile.name}`);
      console.log(`   👤 Portfolio Username: ${response.data.profile.portfolioData.portfolioUsername}`);
      
      return response.data.profile.id;
    }
  } catch (error) {
    console.log('❌ Failed to create portfolio profile:', error.response?.data?.error?.message || error.message);
    return null;
  }
}

async function updateTestFile(profileId) {
  console.log('\n📝 Updating test file with new credentials...');
  
  const testFileContent = `// Updated test configuration
const TEST_EMAIL = '${TEST_EMAIL}';
const TEST_PASSWORD = '${TEST_PASSWORD}';
const PROFILE_ID = '${profileId}';`;

  console.log('💡 Add these lines to your test file:');
  console.log(testFileContent);
  
  console.log('\n🔧 Or update the existing variables in test-portfolio-profile-update.js:');
  console.log(`   Line ~15: const TEST_EMAIL = '${TEST_EMAIL}';`);
  console.log(`   Line ~16: const TEST_PASSWORD = '${TEST_PASSWORD}';`);
  console.log(`   Line ~17: const PROFILE_ID = '${profileId}';`);
}

async function main() {
  console.log('🚀 Creating Test Portfolio Profile');
  console.log('=' .repeat(50));
  
  const authSuccess = await authenticate();
  if (!authSuccess) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }
  
  const profileId = await createPortfolioProfile();
  if (profileId) {
    await updateTestFile(profileId);
    
    console.log('\n🎉 Setup complete! You can now run your tests with:');
    console.log('   npm run test:portfolio');
  } else {
    console.log('❌ Failed to create portfolio profile');
  }
}

main().catch(console.error);
