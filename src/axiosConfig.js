import axios from 'axios';
const baseURL = process.env.BASE_URL;
console.log(baseURL);
axios.defaults.baseURL =
  process.env.NODE_ENV !== 'production' ? 'http://localhost:3001' : baseURL;
console.log(process.env.NODE_ENV);
