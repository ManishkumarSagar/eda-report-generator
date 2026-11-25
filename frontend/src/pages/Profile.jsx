import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiUser, FiMail, FiLogOut, FiShield } from 'react-icons/fi'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { getProfile } from '../services/authService'

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      try {
        // Try fetching fresh profile from backend
        const data = await getProfile()
        setUser(data.user || data)
        localStorage.setItem('user', JSON.stringify(data.user || data))
      } catch (err) {
        // Fallback to localStorage if backend fails
        const localUser = localStorage.getItem('user')
        if (localUser) setUser(JSON.parse(localUser))
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="app-shell">
          <Sidebar />
          <main className="app-main">
            <p>Loading profile...</p>
          </main>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="app-shell">
        <Sidebar />
        <main className="app-main">
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Manage your account settings and preferences</p>

          <div style={styles.profileCard}>
            <div style={styles.avatarSection}>
              <div style={styles.avatar}>
                {user?.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
              </div>
              <div>
                <h2 style={styles.name}>{user?.name || 'Demo User'}</h2>
                <p style={styles.email}>{user?.email || 'user@example.com'}</p>
              </div>
            </div>

            <div style={styles.detailsGrid}>
              <div style={styles.detailItem}>
                <div style={styles.iconBox}><FiUser /></div>
                <div>
                  <div style={styles.detailLabel}>Full Name</div>
                  <div style={styles.detailValue}>{user?.name || 'Not provided'}</div>
                </div>
              </div>

              <div style={styles.detailItem}>
                <div style={styles.iconBox}><FiMail /></div>
                <div>
                  <div style={styles.detailLabel}>Email Address</div>
                  <div style={styles.detailValue}>{user?.email || 'Not provided'}</div>
                </div>
              </div>

              <div style={styles.detailItem}>
                <div style={styles.iconBox}><FiShield /></div>
                <div>
                  <div style={styles.detailLabel}>Account Security</div>
                  <div style={styles.detailValue}>JWT Protected</div>
                </div>
              </div>
            </div>

            <div style={styles.actions}>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                <FiLogOut /> Logout from Account
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

const styles = {
  profileCard: {
    background: '#fff',
    border: '1px solid var(--line)',
    borderRadius: 16,
    padding: 32,
    maxWidth: 720,
    marginTop: 24,
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    marginBottom: 32,
    paddingBottom: 32,
    borderBottom: '1px solid var(--line)',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'linear-gradient(135deg,#fb923c,#ea580c)',
    color: '#fff',
    display: 'grid',
    placeItems: 'center',
    fontSize: 32,
    fontWeight: 800,
    boxShadow: '0 8px 20px rgba(234,88,12,.2)',
  },
  name: { fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: '-.5px' },
  email: { fontSize: 14, color: '#667085', margin: '4px 0 0' },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 20,
    marginBottom: 32,
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: '#faf9f7',
    padding: 16,
    borderRadius: 12,
    border: '1px solid #ece7e2',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: '#fff',
    color: '#c2410c',
    display: 'grid',
    placeItems: 'center',
    fontSize: 18,
    border: '1px solid #ffdfc2',
  },
  detailLabel: { fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.5px' },
  detailValue: { fontSize: 14, fontWeight: 600, color: '#30343b', marginTop: 2 },
  actions: { display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--line)', paddingTop: 24 },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#fef2f2',
    color: '#b91c1c',
    border: '1px solid #fecaca',
    padding: '10px 18px',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
  },
}

export default Profile