const { spawn } = require('child_process');
const path = require('path');

console.log('🔄 Restarting server to see debug output...');

// Kill existing server process
const killProcess = spawn('taskkill', ['/F', '/PID', '7644'], { 
  stdio: 'inherit',
  shell: true 
});

killProcess.on('close', (code) => {
  console.log('✅ Server process killed');
  
  // Start new server
  console.log('🚀 Starting new server...');
  const serverProcess = spawn('node', ['server.js'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname
  });

  serverProcess.on('error', (error) => {
    console.log('❌ Failed to start server:', error.message);
  });

  // Give server time to start
  setTimeout(() => {
    console.log('✅ Server should be running now');
    console.log('🧪 You can now run your tests to see debug output');
  }, 3000);
});
