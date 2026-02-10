import axios from 'axios';

axios.interceptors.request.use(
    (config) => {
        const userAuthStr = localStorage.getItem('userAuth');

        if (userAuthStr) {
            const userAuth = JSON.parse(userAuthStr);

            if (userAuth.token) {
                const token = userAuth.token;

                const tokenString = typeof token === 'object' ? (token.accessToken || token.token) : token;

                if (typeof tokenString === 'string') {
                    config.headers.Authorization = `Bearer ${tokenString}`;
                } else {
                    console.warn("Axios Interceptor - Token is not a string:", token);
                }
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