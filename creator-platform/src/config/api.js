// API Configuration
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5000'
  },
  production: {
    // This will be set during build time via environment variables
    API_BASE_URL: process.env.REACT_APP_API_URL || 'https://social-platform-production.up.railway.app'
  }
};

const environment = process.env.NODE_ENV || 'development';
export const API_CONFIG = config[environment];

export default API_CONFIG;
