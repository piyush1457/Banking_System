import axios from 'axios';

// In development: Vite proxy forwards /api → http://localhost:8080
// In production (Vercel): VITE_API_URL must be set to your deployed backend URL
//   e.g. https://your-backend.railway.app
const BASE_URL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api';          // dev fallback — handled by Vite proxy

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,   // send HttpOnly JWT cookie automatically
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
