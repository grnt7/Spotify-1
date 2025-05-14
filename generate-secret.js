import crypto from 'crypto';

const generateSecret = () => {
  // Generate a 64-byte (512-bit) random buffer
  const buffer = crypto.randomBytes(64);

  // Convert the buffer to a hexadecimal string
  const secret = buffer.toString('hex');

  console.log('Generated JWT Secret:', secret);
  console.log('Please copy this secret and paste it into your .env.local file as JWT_SECRET=...');
};

generateSecret();