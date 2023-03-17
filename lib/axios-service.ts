import axios from 'axios';

// Create an axios instance with a custom config
const client = axios.create({
  baseURL: 'http://10.6.130.39:3000',
  headers: { 'Content-Type': 'application/json' }
});

export default client;
