const { spawn } = require('child_process');
const open = require('open');
const waitOn = require('wait-on');

const PORT = process.env.PORT || 3000;
const URL = `http://localhost:${PORT}`;

console.log('🚀 Starting AKSHARA dev server...\n');

// Start Next.js dev server directly
const nextDev = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT }
});

// Wait for server to be ready, then open browser
waitOn({
  resources: [URL],
  delay: 1000, // Wait 1 second after server is ready
  timeout: 60000, // 60 second timeout
  window: 1000,
})
  .then(() => {
    console.log(`\n✨ Server is ready! Opening ${URL} in your browser...\n`);
    open(URL);
  })
  .catch((err) => {
    console.error('Error waiting for server:', err);
  });

// Handle process termination
process.on('SIGINT', () => {
  nextDev.kill('SIGINT');
  process.exit();
});

process.on('SIGTERM', () => {
  nextDev.kill('SIGTERM');
  process.exit();
});

