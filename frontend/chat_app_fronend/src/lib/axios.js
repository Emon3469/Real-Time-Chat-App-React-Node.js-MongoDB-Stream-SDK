import axios from "axios";

// In production the frontend is always served from the same domain as the
// backend (monolithic Render deploy), so we use a relative "/api" path.
// This makes VITE_API_URL irrelevant in production — any wrong value in
// the Render env vars can no longer break requests.
//
// In development we still allow VITE_API_URL to point at a local/remote
// backend for convenience.
const BASE_URL =
    import.meta.env.MODE === "development"
        ? import.meta.env.VITE_API_URL
            ? `${import.meta.env.VITE_API_URL}/api`
            : "http://localhost:5001/api"
        : "/api";

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 15000,
});
