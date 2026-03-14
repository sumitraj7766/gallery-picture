import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Add token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const authService = {
  signup: (data: any) => API.post('/auth/signup', data),
  login: (data: any) => API.post('/auth/login', data),
};

export const imageService = {
  search: (query: string) => API.get(`/images/search?q=${query}`),
  trackDownload: (imageURL: string) => API.post('/download', { imageURL }),
};

export const favoriteService = {
  add: (data: any) => API.post('/favorites/add', data),
  get: (userId: number) => API.get(`/favorites/${userId}`),
  remove: (id: number) => API.delete(`/favorites/${id}`),
};

export default API;
