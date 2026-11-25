import { NavLink } from 'react-router-dom'
import {
  FiHome, FiUploadCloud, FiBarChart2, FiFileText,
  FiClock, FiUser
} from 'react-icons/fi'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
  { to: '/upload', label: 'Upload Dataset', icon: <FiUploadCloud /> },
  { to: '/reports', label: 'Reports', icon: <FiFileText /> },
  { to: '/history', label: 'History', icon: <FiClock /> },
  { to: '/profile', label: 'Profile', icon: <FiUser /> },
]

function Sidebar() {
  return (
    <aside style={{
      width: 240,
      background: '#fff',
      borderRight: '1px solid var(--line)',
      padding: '20px 14px',
      minHeight: 'calc(100vh - 64px)'
    }}>
      <div style={{ fontSize: 10, letterSpacing: 1.4, color: '#a1a1aa', fontWeight: 800, padding: '0 10px', marginBottom: 12 }}>
        MENU
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              color: isActive ? '#c2410c' : '#52525b',
              background: isActive ? 'var(--orange-soft)' : 'transparent'
            })}
          >
            {l.icon} {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar