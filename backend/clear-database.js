// Script to clear all data from the MongoDB database
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://prasannavadk_db_user:DcNyfo4h5BlmMkUp@cluster0.ojj7xdb.mongodb.net/creator-platform?retryWrites=true&w=majority';

async function clearDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    console.log('URI:', MONGODB_URI.replace(/:[^@]+@/, ':****@'));
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Atlas connected successfully!');
    
    console.log('\n🗑️  Clearing database...');
    
    // Get database name
    const dbName = mongoose.connection.db.databaseName;
    console.log(`📊 Database: ${dbName}`);
    
    // Count documents before deletion
    const userCount = await User.countDocuments();
    console.log(`👥 Users found: ${userCount}`);
    
    if (userCount === 0) {
      console.log('✅ Database is already empty!');
      return;
    }
    
    // Confirm deletion
    console.log('\n⚠️  WARNING: This will delete ALL data from the database!');
    console.log('This action cannot be undone.');
    
    // Delete all users (this will cascade to all related data)
    const deleteResult = await User.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} users`);
    
    // Clear all collections (in case there are orphaned documents)
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n🧹 Clearing all collections...');
    
    for (const collection of collections) {
      const collectionName = collection.name;
      const count = await mongoose.connection.db.collection(collectionName).countDocuments();
      if (count > 0) {
        await mongoose.connection.db.collection(collectionName).deleteMany({});
        console.log(`✅ Cleared collection: ${collectionName} (${count} documents)`);
      } else {
        console.log(`ℹ️  Collection ${collectionName} is already empty`);
      }
    }
    
    console.log('\n🎉 Database cleared successfully!');
    console.log('All user accounts, portfolios, and related data have been removed.');
    
  } catch (error) {
    console.error('❌ Error clearing database:', error.message);
    if (error.name === 'MongoNetworkError') {
      console.error('🔍 Network Error: Check your internet connection and MongoDB Atlas whitelist');
    }
    if (error.name === 'MongooseServerSelectionError') {
      console.error('🔍 Server Selection Error: Verify your MongoDB URI and credentials');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the script
if (require.main === module) {
  clearDatabase();
}

module.exports = clearDatabase;
