import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// THE INTERCEPTOR: Automatically attach the JWT token if it exists
api.interceptors.request.use(
  (config) => {
    // Look inside the browser's local storage for the wristband
    const token = localStorage.getItem("access_token");

    // If we have one, attach it to the Authorization header
    if (token) {
      console.log(`Attaching token to outgoing request to: ${config.url}`); // <-- ADD THIS TRACKER
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log(`No token found for request to: ${config.url}`); // <-- ADD THIS TRACKER
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
