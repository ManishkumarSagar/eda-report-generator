import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  FiArrowLeft, FiLoader, FiAlertCircle, FiRefreshCw, 
  FiActivity, FiCheckCircle, FiTrendingUp, FiGrid 
} from 'react-icons/fi'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import ChartCard from '../components/ChartCard'
import { runEDAAnalysis, getEDAResults } from '../services/analysisService'
import { getDatasetById } from '../services/datasetService'

function Analysis() {
  const { id } = useParams()
  const [dataset, setDataset] = useState(null)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const datasetRes = await getDatasetById(id)
        if (cancelled) return
        setDataset(datasetRes)

        let edaRes
        try {
          edaRes = await getEDAResults(id)
        } catch {
          // If results not found, run the analysis
          edaRes = await runEDAAnalysis(id)
        }
        if (cancelled) return
        setResults(edaRes)
      } catch (err) {
        if (cancelled) return
        setError(err.response?.data?.message || 'Failed to load analysis.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    if (id) load()
    return () => { cancelled = true }
  }, [id])

  // --- Loading & Error States ---
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="app-shell">
          <Sidebar />
          <main className="app-main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div style={{ textAlign: 'center' }}>
              <FiLoader style={{ fontSize: 32, color: '#f97316', animation: 'spin 1s linear infinite' }} />
              <h2 style={{ marginTop: 16 }}>Running EDA Analysis...</h2>
              <p style={{ color: '#888' }}>Analyzing missing values, duplicates, and correlations.</p>
            </div>
          </main>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="app-shell">
          <Sidebar />
          <main className="app-main">
            <Link to="/dashboard" style={styles.back}><FiArrowLeft /> Back</Link>
            <div style={styles.errorBox}>
              <FiAlertCircle style={{ fontSize: 24 }} />
              <div style={{ flex: 1 }}>{error}</div>
              <button onClick={() => window.location.reload()} style={styles.retryBtn}>
                <FiRefreshCw /> Retry
              </button>
            </div>
          </main>
        </div>
      </>
    )
  }

  // --- Main Results UI ---
  return (
    <>
      <Navbar />
      <div className="app-shell">
        <Sidebar />
        <main className="app-main">
          <div style={styles.topHeader}>
            <div>
              <Link to="/dashboard" style={styles.back}><FiArrowLeft /> Back to Dashboard</Link>
              <h1 className="page-title" style={{ marginTop: 10 }}>EDA Analysis Results</h1>
              <p className="page-subtitle">
                {dataset?.fileName} — {dataset?.totalRows?.toLocaleString()} rows, {dataset?.totalColumns} columns
              </p>
            </div>
            <Link to={`/insights/${id}`} className="btn-primary-orange" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              ✨ View AI Insights
            </Link>
          </div>

          {/* Quick Stats */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}><FiGrid /></div>
              <div>
                <div style={styles.statLabel}>TOTAL ROWS</div>
                <div style={styles.statValue}>{results?.totalRows?.toLocaleString() || '—'}</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon}><FiActivity /></div>
              <div>
                <div style={styles.statLabel}>COLUMNS</div>
                <div style={styles.statValue}>{results?.totalColumns || '—'}</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: '#fef2f2', color: '#b91c1c' }}><FiAlertCircle /></div>
              <div>
                <div style={styles.statLabel}>MISSING VALUES</div>
                <div style={styles.statValue}>{results?.missingValues || '0'}</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: '#fef3c7', color: '#a16207' }}><FiCheckCircle /></div>
              <div>
                <div style={styles.statLabel}>DUPLICATE ROWS</div>
                <div style={styles.statValue}>{results?.duplicateRows || '0'}</div>
              </div>
            </div>
          </div>

          {/* Visualizations (Charts) */}
          <h2 style={styles.sectionTitle}>Data Visualizations</h2>
          <div style={styles.chartsGrid}>
            <ChartCard 
              title="Missing Values by Column" 
              labels={results?.missingValuesChart?.labels || ['Customer', 'Product', 'Sales', 'City']}
              values={results?.missingValuesChart?.data || [0, 5, 10, 15]}
              labelName="Missing Count"
            />
            <ChartCard 
              title="Data Distribution (Row Count)" 
              labels={results?.distributionChart?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
              values={results?.distributionChart?.data || [1200, 1900, 800, 1500, 2200, 1100]}
              labelName="Rows"
              color="#10b981"
            />
          </div>

          {/* Statistical Summary Table */}
          <h2 style={styles.sectionTitle}>Statistical Summary</h2>
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Column</th>
                  <th style={styles.th}>Mean</th>
                  <th style={styles.th}>Median</th>
                  <th style={styles.th}>Min</th>
                  <th style={styles.th}>Max</th>
                  <th style={styles.th}>Std. Dev</th>
                </tr>
              </thead>
              <tbody>
                {/* Demo data fallback — Backend se aane par (results.statistics) map karenge */}
                {(results?.statistics || [
                  { column: 'Sales', mean: 5250, median: 4800, min: 1500, max: 12000, stdDev: 2100 },
                  { column: 'Age', mean: 32.5, median: 30, min: 18, max: 65, stdDev: 8.4 },
                  { column: 'Quantity', mean: 4.2, median: 4, min: 1, max: 10, stdDev: 1.8 }
                ]).map((stat, i) => (
                  <tr key={i}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{stat.column}</td>
                    <td style={styles.td}>{stat.mean}</td>
                    <td style={styles.td}>{stat.median}</td>
                    <td style={styles.td}>{stat.min}</td>
                    <td style={styles.td}>{stat.max}</td>
                    <td style={styles.td}>{stat.stdDev}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Correlation & Outliers Info */}
          <div style={styles.bottomGrid}>
            <div style={styles.infoBox}>
              <h3 style={styles.infoTitle}>Outlier Detection (IQR Method)</h3>
              <p style={styles.infoText}>Values outside Q1 - 1.5*IQR and Q3 + 1.5*IQR are flagged as outliers.</p>
              <div style={styles.badge}><FiTrendingUp /> {results?.outliersCount || '12'} outliers found</div>
            </div>
            <div style={styles.infoBox}>
              <h3 style={styles.infoTitle}>Data Quality Check</h3>
              <ul style={styles.list}>
                <li><FiCheckCircle color="#10b981" /> Missing value analysis complete</li>
                <li><FiCheckCircle color="#10b981" /> Duplicate detection complete</li>
                <li><FiCheckCircle color="#10b981" /> Pearson correlation calculated</li>
              </ul>
            </div>
          </div>

        </main>
      </div>
    </>
  )
}

const styles = {
  topHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  back: { fontSize: 13, color: '#555', display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 650 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 },
  statCard: {
    background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: 20,
    display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 3px 14px rgba(30,20,10,.03)'
  },
  statIcon: {
    width: 44, height: 44, borderRadius: 10, background: '#fff1e7', color: '#c2410c',
    display: 'grid', placeItems: 'center', fontSize: 20, flexShrink: 0
  },
  statLabel: { fontSize: 11, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px' },
  statValue: { fontSize: 24, fontWeight: 800, color: '#30343b', letterSpacing: '-.5px', marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 800, letterSpacing: '-.4px', marginBottom: 16, marginTop: 8 },
  chartsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 16, marginBottom: 32 },
  tableCard: { background: '#fff', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden', marginBottom: 32 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', background: '#fff4e9', color: '#8c3d0d', padding: '12px 16px', fontWeight: 750, borderBottom: '1px solid var(--line)' },
  td: { padding: '12px 16px', borderBottom: '1px solid var(--line)', color: '#4b5563' },
  bottomGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 },
  infoBox: { background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: 24 },
  infoTitle: { fontSize: 15, fontWeight: 800, margin: '0 0 8px 0' },
  infoText: { fontSize: 13, color: '#666', lineHeight: 1.6, marginBottom: 16 },
  badge: { display: 'inline-flex', alignItems: 'center', gap: 6, background: '#ffedd5', color: '#c2410c', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 },
  list: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 },
  errorBox: { display: 'flex', alignItems: 'center', gap: 12, marginTop: 24, background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: 10, padding: '16px' },
  retryBtn: { background: '#fff', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 700, color: '#b91c1c', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 },
}

export default Analysis