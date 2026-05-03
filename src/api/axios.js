import axios from 'axios'

/**
 * =====================================================
 * BACKEND URL SETUP
 * =====================================================
 * Option 1 (Recommended): Set in .env file
 *   VITE_API_URL=https://your-app.up.railway.app
 *
 * Option 2: Replace the fallback URL below directly
 *   const BASE = 'https://your-app.up.railway.app'
 * =====================================================
 */
const BASE = import.meta.env.VITE_API_URL || 'https://unigroupsbackend-production.up.railway.app/'

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
  withCredentials: false,
})

// Inject JWT token on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Auto-refresh token on 401
let refreshing = false
let queue = []
const drain = (err, token = null) => {
  queue.forEach(p => err ? p.reject(err) : p.resolve(token))
  queue = []
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const orig = err.config

    if (err.response?.status === 401 && !orig._retry) {
      if (refreshing) {
        return new Promise((res, rej) => queue.push({ resolve: res, reject: rej }))
          .then(t => { orig.headers.Authorization = `Bearer ${t}`; return api(orig) })
      }
      orig._retry = true
      refreshing  = true
      const ref   = localStorage.getItem('refresh_token')
      if (!ref) { localStorage.clear(); window.location.reload(); return Promise.reject(err) }
      try {
        const { data } = await axios.post(`${BASE}/api/auth/token/refresh/`, { refresh: ref })
        localStorage.setItem('access_token', data.access)
        drain(null, data.access)
        orig.headers.Authorization = `Bearer ${data.access}`
        return api(orig)
      } catch (e) {
        drain(e, null)
        localStorage.clear()
        window.location.reload()
        return Promise.reject(e)
      } finally {
        refreshing = false
      }
    }
    return Promise.reject(err)
  }
)

export default api
