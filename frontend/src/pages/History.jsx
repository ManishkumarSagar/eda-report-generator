import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  FiClock, FiDatabase, FiLoader, FiAlertCircle, 
  FiArrowRight, FiTrash2, FiCheckCircle 
} from 'react-icons/fi'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { getDatasets, deleteDataset } from '../services/datasetService'

function History() {
  const navigate = useNavigate()
  const [datasets, setDatasets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getDatasets()
      setDatasets(data.datasets || data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load history.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this dataset and all its analyses? This cannot be undone.')) return
    
    setDeletingId(id)
    try {
      await deleteDataset(id)
      setDatasets(datasets.filter(d => d._id !== id))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete dataset.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <Navbar />
      <div className="app-shell">
        <Sidebar />
        <main className="app-main">
          <div style={styles.topHeader}>
            <div>
              <h1 className="page-title">History</h1>
              <p className="page-subtitle">All your uploaded datasets and past analyses</p>
            </div>
            <Link to="/upload" className="btn-primary-orange" style={{ textDecoration: 'none' }}>
              + Upload Dataset
            </Link>
          </div>

          {loading && (
            <div style={styles.centerBox}>
              <FiLoader style={{ fontSize: 32, color: '#f97316', animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: 16, fontWeight: 600 }}>Loading history...</p>
            </div>
          )}

          {error && !loading && (
            <div style={styles.errorBox}>
              <FiAlertCircle /> {error}
            </div>
          )}

          {!loading && !error && datasets.length === 0 && (
            <div style={styles.emptyBox}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🗂️</div>
              <h3 style={{ margin: 0, fontSize: 18 }}>No history found</h3>
              <p style={{ color: '#888', marginTop: 8 }}>Upload a dataset to start building your analysis history.</p>
            </div>
          )}

          {!loading && !error && datasets.length > 0 && (
            <div style={styles.tableCard}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>File Name</th>
                    <th style={styles.th}>Uploaded Date</th>
                    <th style={styles.th}>Size / Rows</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {datasets.map((ds) => (
                    <tr key={ds._id}>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={styles.fileIcon}><FiDatabase /></div>
                          <span style={{ fontWeight: 600, color: '#30343b' }}>{ds.fileName || 'Dataset'}</span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#667085' }}>
                          <FiClock /> {new Date(ds.uploadedAt || ds.createdAt || Date.now()).toLocaleString()}
                        </div>
                      </td>
                      <td style={styles.td}>
                        {ds.totalRows ? `${ds.totalRows.toLocaleString()} rows` : '—'} 
                        {ds.fileSize ? ` / ${(ds.fileSize / 1024).toFixed(1)} KB` : ''}
                      </td>
                      <td style={styles.td}>
                        <span style={styles.badgeSuccess}><FiCheckCircle /> Analyzed</span>
                      </td>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button 
                            onClick={() => navigate(`/analysis/${ds._id}`)}
                            style={styles.actionBtn}
                            title="View Analysis"
                          >
                            View <FiArrowRight />
                          </button>
                          <button 
                            onClick={() => handleDelete(ds._id)}
                            disabled={deletingId === ds._id}
                            style={styles.deleteBtn}
                            title="Delete Dataset"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </>
  )
}

const styles = {
  topHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 16 },
  centerBox: { textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: 16, border: '1px solid var(--line)' },
  errorBox: { display: 'flex', alignItems: 'center', gap: 8, background: '#fef2f2', color: '#b91c1c', padding: 16, borderRadius: 10, border: '1px solid #fecaca' },
  emptyBox: { textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: 16, border: '1px solid var(--line)' },
  tableCard: { background: '#fff', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', background: '#fffaf5', color: '#c2410c', padding: '14px 20px', fontWeight: 750, borderBottom: '1px solid var(--line)' },
  td: { padding: '16px 20px', borderBottom: '1px solid var(--line)', color: '#4b5563', verticalAlign: 'middle' },
  fileIcon: { width: 32, height: 32, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', display: 'grid', placeItems: 'center', color: '#64748b' },
  badgeSuccess: { display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#16845b', background: '#e6f4f1', padding: '4px 10px', borderRadius: 20 },
  actionBtn: { background: '#fff1e7', border: '1px solid #fed7aa', color: '#c2410c', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 },
  deleteBtn: { background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center' }
}

export default History