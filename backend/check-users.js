const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/creator-platform');
    console.log('Connected to MongoDB');

    // Get all users with their basic info
    const users = await User.find({}, 'email name username portfolioProfiles');
    console.log('\n📊 Current users in database:');
    console.log('=' .repeat(60));
    
    if (users.length === 0) {
      console.log('❌ No users found in database.');
      console.log('\n💡 To create a test user, you can:');
      console.log('   1. Register through your frontend application');
      console.log('   2. Use the signup API endpoint');
      console.log('   3. Create a user manually in MongoDB');
      return;
    }

    users.forEach((user, index) => {
      console.log(`\n👤 User ${index + 1}:`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   👤 Name: ${user.name}`);
      console.log(`   🆔 Username: ${user.username || 'Not set'}`);
      console.log(`   📊 Portfolio Profiles: ${user.portfolioProfiles?.length || 0}`);
      
      if (user.portfolioProfiles && user.portfolioProfiles.length > 0) {
        console.log(`   📝 Portfolio Profile IDs:`);
        user.portfolioProfiles.forEach((profile, pIndex) => {
          console.log(`      ${pIndex + 1}. ID: ${profile.id}, Name: ${profile.name}`);
        });
      }
    });

    // Check for the specific profile ID we're testing
    const targetProfileId = '1757814718120';
    const userWithTargetProfile = users.find(user => 
      user.portfolioProfiles?.some(profile => profile.id === targetProfileId)
    );

    if (userWithTargetProfile) {
      console.log(`\n🎯 Found user with target profile ID ${targetProfileId}:`);
      console.log(`   📧 Email: ${userWithTargetProfile.email}`);
      console.log(`   👤 Name: ${userWithTargetProfile.name}`);
      
      const targetProfile = userWithTargetProfile.portfolioProfiles.find(p => p.id === targetProfileId);
      console.log(`   📝 Profile Name: ${targetProfile.name}`);
      console.log(`   📄 Description: ${targetProfile.description}`);
    } else {
      console.log(`\n❌ No user found with portfolio profile ID: ${targetProfileId}`);
      console.log('   Available profile IDs:');
      users.forEach(user => {
        if (user.portfolioProfiles && user.portfolioProfiles.length > 0) {
          user.portfolioProfiles.forEach(profile => {
            console.log(`      ${profile.id} (${profile.name})`);
          });
        }
      });
    }

    console.log('\n💡 To use these users in your test:');
    console.log('   1. Update the TEST_EMAIL in your test file');
    console.log('   2. Make sure you know the correct password');
    console.log('   3. Update PROFILE_ID if needed');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkUsers();
