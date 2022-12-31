import axios from 'axios';

// Create an axios instance with a custom config
const client = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' }
});

export default client;
