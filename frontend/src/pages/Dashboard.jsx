import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  FiDatabase, FiActivity, FiFileText, FiAlertCircle, 
  FiArrowRight, FiClock, FiCpu 
} from 'react-icons/fi'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import { getDatasets } from '../services/datasetService'
import { getReports } from '../services/analysisService'

function Dashboard() {
  const [datasets, setDatasets] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  // Safe parsing of user from localStorage
let user = {};
try {
  const storedUser = localStorage.getItem('user');
  // Check if it's a valid string and not the literal string "undefined"
  if (storedUser && storedUser !== 'undefined') {
    user = JSON.parse(storedUser);
  }
} catch (error) {
  console.error("Error parsing user from localStorage", error);
}

const firstName = user?.name ? user.name.split(' ')[0] : 'Analyst';

  useEffect(() => {
    async function fetchData() {
      try {
        const [dsRes, repRes] = await Promise.all([
          getDatasets().catch(() => ({ datasets: [] })),
          getReports().catch(() => ({ reports: [] })),
        ])
        setDatasets(dsRes.datasets || dsRes || [])
        setReports(repRes.reports || repRes || [])
      } catch (err) {
        console.error('Failed to load dashboard data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <Navbar />
      <div className="app-shell">
        <Sidebar />
        <main className="app-main">
          
          {/* Header */}
          <div style={styles.header}>
            <div>
              <h1 className="page-title">Welcome back, {firstName} 👋</h1>
              <p className="page-subtitle">Here is an overview of your data analysis workspace</p>
            </div>
            <Link to="/upload" className="btn-primary-orange" style={{ textDecoration: 'none' }}>
              + Upload New Dataset
            </Link>
          </div>

          {/* Stats Grid */}
          <div style={styles.statsGrid}>
            <StatCard label="Total Datasets" value={loading ? '—' : datasets.length} />
            <StatCard label="Analyses Run" value={loading ? '—' : datasets.length} />
            <StatCard label="Reports Generated" value={loading ? '—' : reports.length} />
            <StatCard label="AI Insights" value={loading ? '—' : Math.max(0, datasets.length - 2)} />
          </div>

          <div style={styles.mainGrid}>
            
            {/* Left Column: Recent Datasets */}
            <div style={styles.sectionBox}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}><FiDatabase /> Recent Datasets</h2>
                <Link to="/history" style={styles.viewAll}>View All <FiArrowRight /></Link>
              </div>
              
              {loading ? (
                <p style={{ color: '#888', fontSize: 13 }}>Loading recent datasets...</p>
              ) : datasets.length === 0 ? (
                <div style={styles.emptyState}>
                  No datasets uploaded yet. <Link to="/upload">Upload one now</Link>.
                </div>
              ) : (
                <div style={styles.list}>
                  {datasets.slice(0, 4).map(ds => (
                    <div key={ds._id} style={styles.listItem}>
                      <div style={styles.listIcon}><FiFileText /></div>
                      <div style={styles.listContent}>
                        <div style={styles.listTitle}>{ds.fileName || 'Dataset'}</div>
                        <div style={styles.listMeta}>
                          {ds.totalRows?.toLocaleString() || '0'} rows · {new Date(ds.uploadedAt || ds.createdAt || Date.now()).toLocaleDateString()}
                        </div>
                      </div>
                      <Link to={`/analysis/${ds._id}`} style={styles.actionLink}>View</Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: AI Findings & Activity */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* AI Findings Card */}
              <div style={styles.aiCard}>
                <h2 style={styles.sectionTitle}><FiCpu /> AI Finding of the Day</h2>
                <div style={styles.aiContent}>
                  <p style={styles.aiText}>
                    "Your recent datasets show consistent missing values in categorical columns. 
                    Consider applying automated imputation before running predictive models."
                  </p>
                  <div style={styles.aiTags}>
                    <span style={styles.aiTag}>Data Quality</span>
                    <span style={styles.aiTag}>Recommendation</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div style={styles.sectionBox}>
                <h2 style={styles.sectionTitle}><FiActivity /> Recent Activity</h2>
                <div style={styles.timeline}>
                  <div style={styles.timelineItem}>
                    <div style={styles.timelineDot}></div>
                    <div style={styles.timelineContent}>
                      <div style={styles.timelineTitle}>Account created</div>
                      <div style={styles.timelineTime}>Just now</div>
                    </div>
                  </div>
                  <div style={styles.timelineItem}>
                    <div style={{ ...styles.timelineDot, background: '#16845b' }}></div>
                    <div style={styles.timelineContent}>
                      <div style={styles.timelineTitle}>Logged in successfully</div>
                      <div style={styles.timelineTime}>Today</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </main>
      </div>
    </>
  )
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 },
  mainGrid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24, alignItems: 'start' },
  sectionBox: { background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: 24 },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 8 },
  viewAll: { fontSize: 12, fontWeight: 700, color: '#c2410c', display: 'flex', alignItems: 'center', gap: 4 },
  emptyState: { fontSize: 13, color: '#888', background: '#faf9f7', padding: 20, borderRadius: 8, textAlign: 'center' },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  listItem: { display: 'flex', alignItems: 'center', gap: 14, padding: 12, border: '1px solid var(--line)', borderRadius: 10 },
  listIcon: { width: 36, height: 36, borderRadius: 8, background: '#fff1e7', color: '#c2410c', display: 'grid', placeItems: 'center', fontSize: 16 },
  listContent: { flex: 1, minWidth: 0 },
  listTitle: { fontSize: 13, fontWeight: 700, color: '#30343b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  listMeta: { fontSize: 11, color: '#888', marginTop: 2 },
  actionLink: { fontSize: 12, fontWeight: 700, color: '#c2410c', padding: '6px 12px', background: '#fff7ed', borderRadius: 6 },
  aiCard: { background: 'linear-gradient(135deg, #fff7ed, #ffffff)', border: '1px solid #ffdfc2', borderRadius: 14, padding: 24 },
  aiContent: { marginTop: 16 },
  aiText: { fontSize: 14, fontStyle: 'italic', color: '#52525b', lineHeight: 1.6, margin: 0 },
  aiTags: { display: 'flex', gap: 8, marginTop: 14 },
  aiTag: { fontSize: 10, fontWeight: 750, background: '#fff', border: '1px solid #fed7aa', color: '#b45309', padding: '4px 10px', borderRadius: 20 },
  timeline: { display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 },
  timelineItem: { display: 'flex', gap: 12 },
  timelineDot: { width: 10, height: 10, borderRadius: '50%', background: '#f97316', marginTop: 4 },
  timelineContent: { flex: 1 },
  timelineTitle: { fontSize: 13, fontWeight: 600, color: '#30343b' },
  timelineTime: { fontSize: 11, color: '#888', marginTop: 2 },
}

export default Dashboard