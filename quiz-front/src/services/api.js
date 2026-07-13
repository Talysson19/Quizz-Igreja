import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || (
        window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8000/api'
        : 'https://quizz-igreja.onrender.com/api'
    ),
});

api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('@QuizIgreja:token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
