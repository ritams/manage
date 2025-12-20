
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            if (window.location.pathname !== '/login') {
                console.log('Redirecting to login due to 401/403');
                // Optional: You could redirect here or let the component handle it
                // window.location.href = '/login'; 
            }
        }
        return Promise.reject(error);
    }
);

// Admin API
export const getAdminStats = () => api.get('/admin/stats').then(res => res.data);
export const getAdminUsers = () => api.get('/admin/users').then(res => res.data);
export const getAdminUserDetails = (id) => api.get(`/admin/users/${id}`).then(res => res.data);

// Auth (needed for login)
export const googleLogin = (token) => api.post('/auth/google', { token }).then(res => res.data);
export const logout = () => api.post('/auth/logout').then(res => res.data);
export const getMe = () => api.get('/auth/me').then(res => res.data);

export default api;
