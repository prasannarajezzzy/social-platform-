# MongoDB Connection Test

This script tests the connection to your MongoDB Atlas cluster and performs comprehensive database operations.

## Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the test script:**
   ```bash
   python test_mongodb.py
   ```

## What the Script Tests

### Connection Tests
- ✅ Basic connection to MongoDB Atlas
- ✅ Server ping and version check
- ✅ Database listing

### CRUD Operations
- ✅ **CREATE**: Insert single and multiple documents
- ✅ **READ**: Query documents by ID and criteria
- ✅ **UPDATE**: Modify existing documents
- ✅ **DELETE**: Remove test documents

### Advanced Operations
- ✅ **Aggregation**: Group and calculate statistics
- ✅ **Indexing**: Create and list indexes
- ✅ **Statistics**: Collection metadata and stats

## Connection Details

- **URI**: `mongodb+srv://prasannavadk_db_user:DcNyfo4h5BlmMkUp@cluster0.ojj7xdb.mongodb.net/`
- **Test Database**: `test_database`
- **Test Collection**: `test_collection`

## Script Options

When you run the script, you can choose:

1. **Full Test** (recommended): Comprehensive testing of all MongoDB operations
2. **Quick Test**: Just tests the connection without performing operations

## Troubleshooting

### Common Issues

1. **Connection Timeout**
   - Check your internet connection
   - Verify the MongoDB URI is correct
   - Ensure your IP address is whitelisted in MongoDB Atlas

2. **Authentication Failed**
   - Double-check username and password
   - Verify database user permissions

3. **SSL/TLS Errors**
   - Update your Python and pymongo versions
   - Check firewall settings

### Expected Output

On successful connection, you should see:
```
✅ Successfully connected to MongoDB!
✅ Document inserted with ID: ...
✅ Document retrieved successfully
✅ Documents modified: 1
🎉 ALL TESTS PASSED! MongoDB connection is working perfectly!
```

## Security Notes

- The connection string contains credentials - keep this file secure
- Consider using environment variables for production applications
- The script automatically cleans up test data after running

## Dependencies

- `pymongo>=4.6.0` - MongoDB Python driver
- Python 3.7+ recommended

