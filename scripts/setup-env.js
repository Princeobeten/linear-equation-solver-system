#!/usr/bin/env node

/**
 * This script helps set up the .env.local file with required environment variables.
 * Run it with: node scripts/setup-env.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ENV_PATH = path.join(process.cwd(), '.env.local');

// Generate a random secret for NextAuth
const generateSecret = () => crypto.randomBytes(32).toString('base64');

console.log('🔧 Linear Equation Solver - Environment Setup\n');

// Check if .env.local already exists
if (fs.existsSync(ENV_PATH)) {
  console.log('⚠️  A .env.local file already exists. Overwrite it? (y/n)');
  rl.question('> ', (answer) => {
    if (answer.toLowerCase() !== 'y') {
      console.log('Setup cancelled. Your .env.local file remains unchanged.');
      rl.close();
      return;
    }
    setupEnv();
  });
} else {
  setupEnv();
}

function setupEnv() {
  console.log('\n📝 Please enter your MongoDB connection string:');
  console.log('   (Format: mongodb+srv://username:password@cluster.mongodb.net/database)');
  
  rl.question('> ', (mongodbUri) => {
    if (!mongodbUri) {
      console.log('❌ MongoDB URI is required. Setup cancelled.');
      rl.close();
      return;
    }

    const nextAuthSecret = generateSecret();
    
    console.log('\n🌐 Please enter your application URL (default: http://localhost:3000):');
    rl.question('> ', (nextAuthUrl) => {
      const url = nextAuthUrl || 'http://localhost:3000';
      
      // Create the .env.local content
      const envContent = `# MongoDB Connection
MONGODB_URI=${mongodbUri}

# NextAuth Configuration
NEXTAUTH_SECRET=${nextAuthSecret}
NEXTAUTH_URL=${url}

# Created on ${new Date().toISOString()}
`;

      // Write the .env.local file
      fs.writeFileSync(ENV_PATH, envContent);
      
      console.log('\n✅ .env.local file created successfully!');
      console.log('🚀 You can now start your application with: npm run dev');
      rl.close();
    });
  });
}
