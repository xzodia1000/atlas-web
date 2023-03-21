import axios from 'axios';

// Create an axios instance with a custom config
const client = axios.create({
  baseURL: 'https://atlas-backend-xtkhgxenvq-el.a.run.app:443',
  headers: { 'Content-Type': 'application/json' }
});

export default client;
