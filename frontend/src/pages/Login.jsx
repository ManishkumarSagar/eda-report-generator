import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi'
import { loginUser } from '../services/authService'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

    const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await loginUser(form.email, form.password)
      
      // YE LINES CHECK KAREIN
      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user || data))
        navigate('/dashboard')
      } else {
        setError('Token not received from backend.')
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>E</div>
        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.subtitle}>Login to your EDA Generator account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <FiMail style={styles.icon} />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <FiLock style={styles.icon} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Logging in...' : <>Login <FiArrowRight /></>}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    background: 'linear-gradient(120deg, #fff7ed, #fff, #ffedd5)',
    padding: 20
  },
  card: {
    width: '100%',
    maxWidth: 400,
    background: '#fff',
    border: '1px solid var(--line)',
    borderRadius: 18,
    padding: '36px 30px',
    boxShadow: '0 8px 30px rgba(35,25,15,.08)'
  },
  logo: {
    width: 46, height: 46, borderRadius: 12,
    background: 'linear-gradient(135deg,#fb923c,#ea580c)',
    color: '#fff', display: 'grid', placeItems: 'center',
    fontWeight: 900, fontSize: 20, marginBottom: 18
  },
  title: { fontSize: 24, fontWeight: 800, letterSpacing: '-.6px', margin: 0 },
  subtitle: { color: 'var(--muted)', fontSize: 13, margin: '6px 0 22px' },
  error: {
    background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca',
    borderRadius: 8, padding: '9px 12px', fontSize: 12, marginBottom: 14
  },
  field: { position: 'relative', marginBottom: 12 },
  icon: { position: 'absolute', left: 13, top: 13, color: '#9ca3af', fontSize: 15 },
  input: {
    width: '100%', padding: '11px 12px 11px 38px',
    border: '1px solid var(--line)', borderRadius: 10,
    fontSize: 14, outline: 'none', background: '#fcfbfa'
  },
  btn: {
    width: '100%', marginTop: 8, padding: '11px',
    background: 'linear-gradient(135deg,#fb923c,#ea580c)',
    color: '#fff', border: 'none', borderRadius: 10,
    fontWeight: 700, fontSize: 14, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
  },
  footer: { textAlign: 'center', fontSize: 13, color: 'var(--muted)', marginTop: 18 }
}

export default Login