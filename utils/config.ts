// Keep a non-empty fallback so client requests never hit the frontend host by accident.
const DEFAULT_API_URL = 'http://localhost:5000';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
