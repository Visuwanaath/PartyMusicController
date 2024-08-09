import axios from 'axios';
axios.defaults.withCredentials = true;
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  withCredentials: true,
});

// api.interceptors.request.use((config) => {
//   const csrfCookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
//   console.log('CSRF cookie:', csrfCookie);
//   if (csrfCookie) {
//     const csrftoken = csrfCookie.split('=')[1];
//     config.headers['X-CSRFToken'] = csrftoken;
//   } else {
//     console.error('CSRF token not found in cookies');
//   }
  
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

export default api;
