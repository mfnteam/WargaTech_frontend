import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Accept: "application/json",
    },
});

// Request interceptor — auto-attach auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("wargatech_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// Response interceptor — handle 401 auto-logout
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("wargatech_token");
            localStorage.removeItem("wargatech_user");
            // Only redirect if not already on auth pages
            const authPaths = ["/login", "/register", "/verify"];
            if (
                !authPaths.some((p) => window.location.pathname.startsWith(p))
            ) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    },
);

export default api;
export { API_BASE_URL };
