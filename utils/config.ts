const isDev = process.env.NODE_ENV === 'development';

// Keep a non-empty production fallback so client requests never hit the frontend host by accident.
const DEFAULT_PROD_API_URL = 'https://brandmonk-backend-1.onrender.com';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || (isDev ? 'http://localhost:5000' : DEFAULT_PROD_API_URL);
