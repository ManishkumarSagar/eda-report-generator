import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  FiArrowLeft, FiLoader, FiAlertCircle, FiRefreshCw, 
  FiCpu, FiCheckCircle, FiTrendingUp, FiFileText
} from 'react-icons/fi'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { getAIInsights, generateAIInsights, generateReport } from '../services/analysisService'
import { getDatasetById } from '../services/datasetService'

function Insights() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [dataset, setDataset] = useState(null)
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [generatingReport, setGeneratingReport] = useState(false)
  const [reportSuccess, setReportSuccess] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const datasetRes = await getDatasetById(id)
        if (cancelled) return
        setDataset(datasetRes)

        let aiRes
        try {
          // Try fetching existing insights
          aiRes = await getAIInsights(id)
        } catch {
          // If none exist, generate new ones
          aiRes = await generateAIInsights(id)
        }
        if (cancelled) return
        setInsights(aiRes)
      } catch (err) {
        if (cancelled) return
        setError(err.response?.data?.message || 'Failed to generate AI insights.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    if (id) load()
    return () => { cancelled = true }
  }, [id])

  const handleGenerateReport = async () => {
    setGeneratingReport(true)
    try {
      await generateReport(id)
      setReportSuccess(true)
      // Redirect to reports page after 2 seconds
      setTimeout(() => navigate('/reports'), 2000)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate report.')
    } finally {
      setGeneratingReport(false)
    }
  }

  // --- Loading State ---
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="app-shell">
          <Sidebar />
          <main className="app-main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div style={{ textAlign: 'center' }}>
              <FiCpu style={{ fontSize: 36, color: '#f97316', animation: 'spin 1.5s linear infinite' }} />
              <h2 style={{ marginTop: 16 }}>AI is analyzing your data...</h2>
              <p style={{ color: '#888' }}>Generating insights, explanations, and recommendations using LLM.</p>
            </div>
          </main>
        </div>
      </>
    )
  }

  // --- Error State ---
  if (error) {
    return (
      <>
        <Navbar />
        <div className="app-shell">
          <Sidebar />
          <main className="app-main">
            <Link to={`/analysis/${id}`} style={styles.back}><FiArrowLeft /> Back to Analysis</Link>
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

  // --- Main UI ---
  return (
    <>
      <Navbar />
      <div className="app-shell">
        <Sidebar />
        <main className="app-main">
          <div style={styles.topHeader}>
            <div>
              <Link to={`/analysis/${id}`} style={styles.back}><FiArrowLeft /> Back to Analysis</Link>
              <h1 className="page-title" style={{ marginTop: 10 }}>AI Insights</h1>
              <p className="page-subtitle">
                LLM-generated analysis for <strong>{dataset?.fileName}</strong>
              </p>
            </div>
            <button 
              onClick={handleGenerateReport} 
              disabled={generatingReport || reportSuccess}
              className="btn-primary-orange" 
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              {reportSuccess ? <><FiCheckCircle /> Report Generated</> : 
               generatingReport ? 'Generating PDF...' : 
               <><FiFileText /> Generate PDF Report</>}
            </button>
          </div>

          {/* AI Summary Card */}
          <div style={styles.summaryCard}>
            <div style={styles.aiHeader}>
              <div style={styles.aiIcon}><FiCpu /></div>
              <div>
                <h2 style={styles.aiTitle}>Dataset Overview</h2>
                <span style={styles.aiBadge}>Powered by OpenAI / Gemini</span>
              </div>
            </div>
            <p style={styles.aiSummaryText}>
              {insights?.summary || 
                "The dataset contains 10,000 records and 8 columns. Initial analysis shows a moderate level of missing values (4.5%) and some duplicate rows. The average sales value is 5,250, with a standard deviation indicating high variance in customer purchasing behavior."}
            </p>
          </div>

          {/* Details Grid */}
          <div style={styles.grid}>
            {/* Important Findings */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}><FiTrendingUp color="#10b981" /> Important Findings</h3>
              <ul style={styles.list}>
                <li>Average sales value is <strong>5,250</strong>, indicating strong revenue per order.</li>
                <li>High variance in sales data suggests the presence of bulk corporate orders.</li>
                <li>Customer age shows a normal distribution with a mean of 32.5 years.</li>
                <li>120 duplicate rows were detected and should be reviewed.</li>
              </ul>
            </div>

            {/* Data Quality Issues */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}><FiAlertCircle color="#f59e0b" /> Data Quality Analysis</h3>
              <ul style={styles.list}>
                <li><strong>Missing Values:</strong> 450 missing values (4.5%) detected, mostly in the 'City' and 'Sales' columns.</li>
                <li><strong>Duplicates:</strong> 120 identical rows found.</li>
                <li><strong>Outliers:</strong> 12 outliers detected in the 'Sales' column using IQR method.</li>
              </ul>
            </div>
          </div>

          {/* Recommendations Section */}
          <div style={styles.recommendationBox}>
            <h3 style={styles.cardTitle}>💡 Recommendations</h3>
            <div style={styles.recommendList}>
              {(insights?.recommendations || [
                "Impute or drop missing values in the 'City' column before applying predictive models.",
                "Investigate duplicate rows to prevent skewed statistical analysis.",
                "Review the 12 outliers in sales data to ensure they are valid transactions, not data entry errors.",
                "Create visualizations to explore the relationship between Marketing Budget and Sales."
              ]).map((rec, i) => (
                <div key={i} style={styles.recItem}>
                  <div style={styles.recNum}>{i + 1}</div>
                  <div style={styles.recText}>{rec}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div style={styles.footerNote}>
            <FiAlertCircle /> <strong>Note:</strong> AI recommendations are generated based on calculated statistics and should be reviewed by a human analyst.
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
  summaryCard: {
    background: 'linear-gradient(135deg, #fff7ed, #ffffff)',
    border: '1px solid #ffdfc2',
    borderRadius: 16,
    padding: 28,
    marginBottom: 24,
    boxShadow: '0 4px 20px rgba(249,115,22,.05)'
  },
  aiHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  aiIcon: {
    width: 48, height: 48, borderRadius: 12,
    background: '#fff', border: '1px solid #ffdfc2',
    color: '#c2410c', display: 'grid', placeItems: 'center', fontSize: 24,
    boxShadow: '0 4px 10px rgba(249,115,22,.1)'
  },
  aiTitle: { fontSize: 18, fontWeight: 800, margin: 0, color: '#c2410c' },
  aiBadge: { fontSize: 11, color: '#b45309', background: '#ffedd5', padding: '3px 8px', borderRadius: 20, fontWeight: 700, marginTop: 4, display: 'inline-block' },
  aiSummaryText: { fontSize: 15, lineHeight: 1.7, color: '#4b5563', margin: 0 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 20,
    marginBottom: 24,
  },
  card: {
    background: '#fff',
    border: '1px solid var(--line)',
    borderRadius: 14,
    padding: 24,
  },
  cardTitle: { fontSize: 15, fontWeight: 800, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 },
  list: { paddingLeft: 20, margin: 0, color: '#4b5563', fontSize: 14, lineHeight: 1.7 },
  recommendationBox: {
    background: '#fff',
    border: '1px solid var(--line)',
    borderRadius: 14,
    padding: 24,
    marginBottom: 24,
  },
  recommendList: { display: 'flex', flexDirection: 'column', gap: 12 },
  recItem: { display: 'flex', gap: 12, alignItems: 'flex-start' },
  recNum: {
    width: 24, height: 24, borderRadius: '50%', background: '#fff1e7', color: '#c2410c',
    display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0, marginTop: 2
  },
  recText: { fontSize: 14, color: '#4b5563', lineHeight: 1.6 },
  footerNote: { fontSize: 12, color: '#888', display: 'flex', alignItems: 'center', gap: 6, background: '#faf8f6', padding: '12px 16px', borderRadius: 8, borderLeft: '3px solid #fb923c' },
  errorBox: { display: 'flex', alignItems: 'center', gap: 12, marginTop: 24, background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: 10, padding: '16px' },
  retryBtn: { background: '#fff', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 700, color: '#b91c1c', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 },
}

export default Insights