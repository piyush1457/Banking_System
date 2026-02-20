import axios from 'axios';

// All requests go to Vite dev server → proxied to Spring Boot :8080
const api = axios.create({
    baseURL: '/api',
    withCredentials: true,   // ← sends the HttpOnly JWT cookie automatically
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
