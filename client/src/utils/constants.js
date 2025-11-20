// client/src/utils/constants.js

// Premium easing curve for Framer Motion
export const EASING = [0.25, 0.1, 0.25, 1];

// Brand Palette
export const OLIVE_COLOR = '#808000';
export const OLIVE_COLOR_LIGHT = '#A0A000';
export const OLIVE_COLOR_DARK = '#606000';

// Helper to inject color with opacity
export const getOliveWithOpacity = (opacityHex) => `${OLIVE_COLOR}${opacityHex}`;

// New: Mock data for the Holographic Blueprint visualization
export const MOCK_FILE_STRUCTURE = {
  base: ['server.js', 'package.json', '.env'],
  auth: ['controllers/authController.js', 'routes/authRoutes.js', 'models/User.js'],
  database: ['config/db.js', 'models/Data.js'],
  frontend: ['src/App.jsx', 'src/main.jsx'],
};