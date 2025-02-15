import axios from 'axios';

// Set up the Authorization header globally with the token (middleware)
const setupAxios = () => {
  const token = localStorage.getItem("authToken");

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    console.log("No token found");
  }

  // Optionally set a base URL if needed
  axios.defaults.baseURL = 'https://ethio-capital-back-end-2.onrender.com/api/v1'; // Example base URL
};

export default setupAxios;


 