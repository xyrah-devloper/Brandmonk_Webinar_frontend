// Keep a non-empty fallback so client requests never hit the frontend host by accident.
const DEFAULT_API_URL = 'https://brandmonk-backend-1.onrender.com';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
