import API from './api'

/**
 * Register a new user
 * POST /api/auth/register
 */
export const registerUser = async (name, email, password) => {
  const { data } = await API.post('/auth/register', { name, email, password })
  return data
}

/**
 * Login an existing user
 * POST /api/auth/login
 */
export const loginUser = async (email, password) => {
  const { data } = await API.post('/auth/login', { email, password })
  return data
}

/**
 * Get the logged-in user's profile
 * GET /api/auth/profile
 */
export const getProfile = async () => {
  const { data } = await API.get('/auth/profile')
  return data
}