import axios from 'axios';
const baseURL = 'https://e-commerce-backend-f254.onrender.com';
axios.defaults.baseURL =
  process.env.NODE_ENV !== 'production' ? 'http://localhost:3001' : baseURL;
