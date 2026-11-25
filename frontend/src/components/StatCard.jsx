function StatCard({ label, value }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--line)',
      borderRadius: 12,
      padding: 20,
      boxShadow: '0 3px 14px rgba(30,20,10,.03)'
    }}>
      <div style={{ fontSize: 28, fontWeight: 800, color: '#c2410c', letterSpacing: '-.5px' }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700, marginTop: 4 }}>
        {label.toUpperCase()}
      </div>
    </div>
  )
}

export default StatCard