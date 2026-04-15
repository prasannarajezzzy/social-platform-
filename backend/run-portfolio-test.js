#!/usr/bin/env node

/**
 * Simple test runner for Portfolio Profile Update API
 * 
 * This script provides an easy way to run the portfolio profile update tests
 * with proper error handling and user-friendly output.
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Portfolio Profile Update API Test Runner');
console.log('=' .repeat(50));

// Check if axios is installed
const fs = require('fs');
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

if (!packageJson.dependencies.axios) {
  console.log('📦 Installing axios dependency...');
  const installProcess = spawn('npm', ['install', 'axios'], { 
    stdio: 'inherit',
    shell: true 
  });
  
  installProcess.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Axios installed successfully');
      runTests();
    } else {
      console.log('❌ Failed to install axios');
      process.exit(1);
    }
  });
} else {
  runTests();
}

function runTests() {
  console.log('🧪 Starting portfolio profile update tests...');
  console.log('📋 Make sure your backend server is running on http://localhost:5000');
  console.log('📋 Ensure MongoDB is connected and the test user exists');
  console.log('');

  const testProcess = spawn('node', ['test-portfolio-profile-update.js'], {
    stdio: 'inherit',
    shell: true
  });

  testProcess.on('close', (code) => {
    console.log('');
    console.log('=' .repeat(50));
    if (code === 0) {
      console.log('🎉 All tests completed successfully!');
    } else {
      console.log('⚠️  Tests completed with some issues (exit code:', code, ')');
    }
    console.log('📖 For detailed information, see TEST_README.md');
  });

  testProcess.on('error', (error) => {
    console.log('❌ Failed to run tests:', error.message);
    process.exit(1);
  });
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Test runner interrupted by user');
  process.exit(0);
});
