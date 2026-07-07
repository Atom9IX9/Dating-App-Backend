import fs from 'fs';

if (fs.existsSync('.env.development')) {
  console.log('.env.development already exists.');
  process.exit(0);
}

fs.copyFileSync('.env.example', '.env.development');
console.log('Created .env.development from .env.example');
