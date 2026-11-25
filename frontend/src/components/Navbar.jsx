import { Link, useNavigate } from 'react-router-dom'
import { FiLogOut, FiUser } from 'react-icons/fi'

function Navbar() {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <header style={{
      height: 64,
      background: '#fff',
      borderBottom: '1px solid var(--line)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 20
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: 'linear-gradient(135deg,#fb923c,#ea580c)',
          color: '#fff', display: 'grid', placeItems: 'center'
        }}>E</div>
        <div>
          EDA Generator
          <div style={{ fontSize: 9, letterSpacing: 1.2, color: 'var(--muted)' }}>WITH LLM</div>
        </div>
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#555' }}>
          <FiUser /> Profile
        </Link>
        <button onClick={logout} style={{
          border: '1px solid var(--line)', background: '#fff',
          borderRadius: 8, padding: '7px 12px', fontSize: 13, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6
        }}>
          <FiLogOut /> Logout
        </button>
      </div>
    </header>
  )
}

export default Navbar