// Central API configuration
const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Remove trailing slashes if provided
export const API_BASE_URL = rawApiUrl.replace(/\/+$/, '');
