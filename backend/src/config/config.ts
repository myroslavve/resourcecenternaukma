import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  graphqlPort: process.env.GRAPHQL_PORT || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/library',
  sessionSecret: process.env.SESSION_SECRET || 'your_super_secret_session_key',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Email configuration
  mailtrap: {
    host: process.env.MAILTRAP_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.MAILTRAP_PORT || '2525'),
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
    fromEmail: process.env.MAILTRAP_FROM_EMAIL || 'library@example.com',
  },

  // JWT (if needed)
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key',

  adminBootstrap: {
    username: process.env.ADMIN_BOOTSTRAP_USERNAME,
    password: process.env.ADMIN_BOOTSTRAP_PASSWORD,
    firstName: process.env.ADMIN_BOOTSTRAP_FIRST_NAME || 'Admin',
    lastName: process.env.ADMIN_BOOTSTRAP_LAST_NAME || 'User',
    emailDomain: process.env.ADMIN_BOOTSTRAP_EMAIL_DOMAIN || 'admin.local',
  },

  // Verification token expiry
  emailVerificationExpiry: process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY || '24h',
  verificationLinkExpiry: parseInt(
    process.env.VERIFICATION_LINK_EXPIRY || '86400000',
  ), // 24 hours in ms
};
