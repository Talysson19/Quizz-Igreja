import axios from 'axios';

const api = axios.create({
    baseURL: 'https://quizz-igreja.onrender.com/api',
});

api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('@QuizIgreja:token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;