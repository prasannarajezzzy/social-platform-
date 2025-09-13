// Production Configuration
module.exports = {
  // MongoDB connection string - set this in Railway environment variables
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://prasannavadk_db_user:DcNyfo4h5BlmMkUp@cluster0.ojj7xdb.mongodb.net/creator-platform?retryWrites=true&w=majority',
  
  // JWT Secret - IMPORTANT: Change this in production
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production-2024-secure',
  
  // Server Configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: 'production',
  
  // Security Settings
  BCRYPT_ROUNDS: 12,
  
  // CORS Settings - Update with your frontend domain
  CORS_ORIGIN: process.env.FRONTEND_URL || ['https://your-frontend-domain.vercel.app', 'https://your-custom-domain.com']
};
