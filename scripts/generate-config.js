const fs = require('fs');
const path = require('path');

const target = path.resolve(__dirname, '..', 'miniprogram', 'config.js');

const cloudEnv = process.env.LEARNLAB_CLOUD_ENV;

if (!cloudEnv) {
  console.error('Error: LEARNLAB_CLOUD_ENV environment variable is not set.');
  console.error('Usage: LEARNLAB_CLOUD_ENV=cloud1-xxx node scripts/generate-config.js');
  process.exit(1);
}

const content = `module.exports = {
  cloudEnv: '${cloudEnv}',
};
`;

fs.writeFileSync(target, content, 'utf-8');
console.log('config.js generated successfully.');
