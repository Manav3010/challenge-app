import axios from 'axios';

// In-memory access token
let accessToken = null;

// Logout state to prevent refresh retry loops
let isLoggingOut = false;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
};

export const markLoggingOut = () => {
  isLoggingOut = true;
};

export const unmarkLoggingOut = () => {
  isLoggingOut = false;
};

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Send refresh token cookie
});

// ➕ Attach token to all outgoing requests
instance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔁 Handle token expiration + refresh
instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // Skip if we're logging out or already retried
    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      !isLoggingOut
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${instance.defaults.baseURL}/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = res.data.token;
        setAccessToken(newToken);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return instance(originalRequest);
      } catch (refreshErr) {
        clearAccessToken();
        markLoggingOut(); // 🛑 Prevent future refresh attempts
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default instance;
