import axios from "axios";

// Production monolithic deploy (Render): VITE_API_URL must be unset so we use
// the relative "/api" path — same domain, zero CORS, zero DNS round-trip.
//
// Split deploy (Netlify frontend + Railway/Render backend): set VITE_API_URL
// to your backend URL in the hosting platform's environment variables.
//
// If VITE_API_URL is set but points to a DIFFERENT origin than the current
// page (wrong value in Render env), we fall back to "/api" at runtime to
// prevent all API calls failing silently.
const resolveBaseUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL;

    if (import.meta.env.MODE === "development") {
        return envUrl ? `${envUrl}/api` : "http://localhost:5001/api";
    }

    // Production — runtime same-origin guard
    if (envUrl) {
        try {
            const apiOrigin = new URL(envUrl).origin;
            // Only use VITE_API_URL when it's genuinely a different origin
            // (split deploy). If origins match or URL is wrong, use "/api".
            if (typeof window !== "undefined" && apiOrigin !== window.location.origin) {
                return `${envUrl}/api`;
            }
        } catch {
            // Malformed URL — fall through to relative path
        }
    }

    return "/api";
};

export const axiosInstance = axios.create({
    baseURL: resolveBaseUrl(),
    withCredentials: true,
    timeout: 15000, // 15 s — prevents hanging requests from blocking the UI
});
