const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function clearUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/social-platform');
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find({}, 'email name');
    console.log('Current users in database:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}, Name: ${user.name}`);
    });

    if (users.length === 0) {
      console.log('No users found in database.');
      process.exit(0);
    }

    // Ask for confirmation
    console.log('\n⚠️  WARNING: This will delete ALL users from the database!');
    console.log('If you want to proceed, run: node clear-users.js --confirm');
    
    if (process.argv.includes('--confirm')) {
      // Delete all users
      const result = await User.deleteMany({});
      console.log(`\n✅ Deleted ${result.deletedCount} users from the database.`);
      console.log('You can now register with any email address.');
    } else {
      console.log('\nTo clear all users, run: node clear-users.js --confirm');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

clearUsers();

