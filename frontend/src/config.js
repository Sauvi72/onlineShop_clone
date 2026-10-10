// Central API configuration
const rawApiUrl = import.meta.env.VITE_API_URL || 'https://onlineshop-clone.onrender.com';

// Remove trailing slashes if provided
export const API_BASE_URL = rawApiUrl.replace(/\/+$/, '');

