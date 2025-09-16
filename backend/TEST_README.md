# Portfolio Profile Update API Test

This test file (`test-portfolio-profile-update.js`) comprehensively tests the portfolio profile update API endpoint `/api/portfolio-profiles/:profileId` to ensure it's working correctly.

## Prerequisites

1. **Backend server running**: Make sure your backend server is running on `http://localhost:5000` (or update `BASE_URL` in the test file)
2. **MongoDB connection**: Ensure your MongoDB database is accessible
3. **Test user exists**: The test uses the user with email `test1234@gmail.com` and password `testpassword123`
4. **Target profile exists**: The test targets the portfolio profile with ID `1757814718120`

## Installation

Install the required dependencies:

```bash
npm install axios
```

## Running the Test

### Option 1: Using npm script
```bash
npm run test:portfolio
```

### Option 2: Direct execution
```bash
node test-portfolio-profile-update.js
```

## Test Coverage

The test suite covers the following scenarios:

### ✅ Authentication & Authorization
- User login and token generation
- Authenticated API requests
- Unauthorized access handling

### ✅ Basic Profile Updates
- Profile name updates
- Profile description updates
- Profile status changes (isDefault, isActive)

### ✅ Portfolio Data Updates
- Profile name and full name
- Portfolio username
- Resume URL
- Contact information
- Additional contacts

### ✅ Section Management
- Adding/updating sections
- Section bullet points
- Subsections with detailed information
- Date ranges and tags

### ✅ Appearance Settings
- Portfolio mode and color scheme
- Layout and typography
- Background settings (solid, gradient, patterns)
- Custom CSS

### ✅ Validation & Error Handling
- Invalid portfolio username formats
- Non-existent profile handling
- Proper error responses

### ✅ Edge Cases
- Complete profile updates
- Data integrity verification
- Response format validation

## Test Data

The test uses realistic data that matches your MongoDB structure:

- **Profile ID**: `1757814718120` (from your provided data)
- **User Email**: `test1234@gmail.com`
- **User Password**: `testpassword123`

## Expected Output

The test will provide detailed output showing:
- ✅ Passed tests with green checkmarks
- ❌ Failed tests with error details
- 📊 Summary statistics
- 🎯 Final conclusion

## Configuration

You can modify these variables in the test file:

```javascript
const BASE_URL = 'http://localhost:5000';  // Backend server URL
const TEST_EMAIL = 'test1234@gmail.com';   // Test user email
const TEST_PASSWORD = 'testpassword123';   // Test user password
const PROFILE_ID = '1757814718120';        // Target profile ID
```

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Ensure the test user exists in your database
   - Check if the password is correct
   - Verify the backend server is running

2. **Profile Not Found**
   - Confirm the profile ID `1757814718120` exists in your database
   - Check if the user has portfolio profiles

3. **Connection Issues**
   - Verify the backend server is running on the correct port
   - Check MongoDB connection
   - Ensure CORS is properly configured

### Debug Mode

To enable more detailed logging, you can modify the test file to include additional console.log statements or use a debugger.

## Test Results Interpretation

- **All tests passed**: The portfolio profile update API is working correctly
- **Some tests failed**: Review the error messages and check the corresponding functionality
- **Authentication failed**: Check user credentials and server status

## API Endpoints Tested

- `POST /api/auth/login` - User authentication
- `GET /api/portfolio-profiles` - Get all portfolio profiles
- `PUT /api/portfolio-profiles/:profileId` - Update portfolio profile
- `GET /health` - Server health check

## Security Notes

- The test uses real credentials - ensure this is only run in a development environment
- The test modifies actual data in your database
- Consider using a separate test database for production testing
