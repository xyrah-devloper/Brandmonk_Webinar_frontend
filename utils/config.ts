// Use an explicit backend URL if provided, otherwise fall back to a relative URL
// in the browser so Next.js rewrites can proxy /api/* to the backend.
// Server-side rendering keeps localhost for local dev / server calls.
const DEFAULT_API_URL = typeof window === 'undefined' ? 'http://localhost:5000' : '';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
