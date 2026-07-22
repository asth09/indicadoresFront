// client/src/config.js
export const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://indicadores-back.vercel.app/api' 
    : 'http://localhost:3000/api');