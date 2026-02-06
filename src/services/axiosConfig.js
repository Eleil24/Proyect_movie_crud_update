import axios from 'axios';

axios.interceptors.request.use(
    (config) => {
        const userAuthStr = localStorage.getItem('userAuth');

        if (userAuthStr) {
            const userAuth = JSON.parse(userAuthStr);

            if (userAuth.token) {
                config.headers.Authorization = `Bearer ${userAuth.token}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('userAuth');
            alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default axios;