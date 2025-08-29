import axios from "axios";

const setupAxios = () => {
  // Set base URL for all requests
  axios.defaults.baseURL = "https://ethiocapital-back.onrender.com/api/v1"; // Adjust for production if needed
  // axios.defaults.baseURL = 'https://ethio-capital-back-end-2.onrender.com/api/v1'; // Example base URL

  // Add request interceptor to include token and headers
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      // Ensure Content-Type is set appropriately if not already specified
      if (!config.headers["Content-Type"]) {
        config.headers["Content-Type"] = "application/json";
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export default setupAxios;