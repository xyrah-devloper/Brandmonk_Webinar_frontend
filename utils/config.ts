const isDev = process.env.NODE_ENV === 'development';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || (isDev ? 'http://localhost:5000' : '');
