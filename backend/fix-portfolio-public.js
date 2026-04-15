const mongoose = require('mongoose');
const User = require('./models/User');

async function fixPortfolioPublic() {
  try {
    await mongoose.connect('mongodb://localhost:27017/creator-platform');
    console.log('Connected to MongoDB');

    const users = await User.find({});
    console.log('Users found:', users.length);

    for (let user of users) {
      if (user.portfolioProfiles && user.portfolioProfiles.length > 0) {
        console.log(`\nUser: ${user.name}`);
        let updated = false;
        
        for (let profile of user.portfolioProfiles) {
          console.log(`  Profile: ${profile.name}`);
          console.log(`    Username: ${profile.portfolioData?.portfolioUsername}`);
          console.log(`    Is Public: ${profile.portfolioData?.isPublic}`);
          console.log(`    Is Active: ${profile.isActive}`);
          
          // Set the first profile to public if it has a username
          if (profile.portfolioData?.portfolioUsername && !profile.portfolioData?.isPublic) {
            profile.portfolioData.isPublic = true;
            profile.portfolioData.isPortfolioEnabled = true;
            updated = true;
            console.log(`    ✅ Set to public`);
          }
        }
        
        if (updated) {
          await user.save();
          console.log(`  ✅ Updated user: ${user.name}`);
        }
      }
    }

    console.log('\n✅ Portfolio public status fixed!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixPortfolioPublic();
