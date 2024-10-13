import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.8',
  headers: {
    'Content-Type': 'application/json',
  },
});

const setBearerToken = (token) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export { api, setBearerToken };
