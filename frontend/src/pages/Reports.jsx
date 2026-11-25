import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  FiFileText, FiDownload, FiLoader, FiAlertCircle, 
  FiCalendar, FiDatabase, FiCheckCircle 
} from 'react-icons/fi'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { getReports, downloadReport } from '../services/analysisService'

function Reports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [downloadingId, setDownloadingId] = useState(null)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getReports()
      setReports(data.reports || data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reports.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (report) => {
    setDownloadingId(report._id)
    try {
      const response = await downloadReport(report._id)
      
      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', report.reportName || 'EDA-Report.pdf')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to download report.')
    } finally {
      setDownloadingId(null)
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
              <h1 className="page-title">Reports</h1>
              <p className="page-subtitle">Download your generated PDF reports</p>
            </div>
            <Link to="/upload" className="btn-primary-orange" style={{ textDecoration: 'none' }}>
              + New Analysis
            </Link>
          </div>

          {loading && (
            <div style={styles.centerBox}>
              <FiLoader style={{ fontSize: 32, color: '#f97316', animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: 16, fontWeight: 600 }}>Loading reports...</p>
            </div>
          )}

          {error && !loading && (
            <div style={styles.errorBox}>
              <FiAlertCircle /> {error}
            </div>
          )}

          {!loading && !error && reports.length === 0 && (
            <div style={styles.emptyBox}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
              <h3 style={{ margin: 0, fontSize: 18 }}>No reports yet</h3>
              <p style={{ color: '#888', marginTop: 8 }}>Upload a dataset and generate your first EDA report.</p>
            </div>
          )}

          {!loading && !error && reports.length > 0 && (
            <div style={styles.grid}>
              {reports.map((report) => (
                <div key={report._id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div style={styles.iconBox}><FiFileText /></div>
                    <div style={styles.statusBadge}>
                      <FiCheckCircle /> {report.reportStatus || 'Completed'}
                    </div>
                  </div>
                  
                  <h3 style={styles.reportName}>{report.reportName || 'EDA Analysis Report'}</h3>
                  
                  <div style={styles.metaList}>
                    <div style={styles.metaItem}>
                      <FiDatabase /> Dataset ID: {report.datasetId?.slice(-6) || 'N/A'}
                    </div>
                    <div style={styles.metaItem}>
                      <FiCalendar /> {new Date(report.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDownload(report)}
                    disabled={downloadingId === report._id}
                    className="btn-primary-orange"
                    style={styles.downloadBtn}
                  >
                    {downloadingId === report._id ? (
                      'Downloading...'
                    ) : (
                      <><FiDownload /> Download PDF</>
                    )}
                  </button>
                </div>
              ))}
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 },
  card: { background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  iconBox: { width: 44, height: 44, background: '#fff1e7', color: '#c2410c', borderRadius: 10, display: 'grid', placeItems: 'center', fontSize: 20 },
  statusBadge: { fontSize: 11, fontWeight: 700, color: '#16845b', background: '#e6f4f1', padding: '4px 10px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 4 },
  reportName: { fontSize: 16, fontWeight: 800, margin: '0 0 16px 0', color: '#30343b', lineHeight: 1.4 },
  metaList: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24, flex: 1 },
  metaItem: { fontSize: 12, color: '#667085', display: 'flex', alignItems: 'center', gap: 8 },
  downloadBtn: { width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, padding: '10px' }
}

export default Reports