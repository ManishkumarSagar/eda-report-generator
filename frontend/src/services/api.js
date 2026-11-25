import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 60000, // 60s — file upload + EDA ke liye
})

// Request interceptor: attach JWT token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: handle 401 (expired token) globally
// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token invalid/expired — clear and redirect to login
//       localStorage.removeItem('token')
//       localStorage.removeItem('user')
//       if (window.location.pathname !== '/login') {
//         window.location.href = '/login'
//       }
//     }
//     return Promise.reject(error)
//   }
// )

export default API