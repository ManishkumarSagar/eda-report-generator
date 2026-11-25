import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import FileUpload from '../components/FileUpload'
import { uploadDataset } from '../services/datasetService'

function UploadDataset() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null) // { datasetId, fileName }

  const handleUpload = async () => {
    if (!file) return
    setError('')
    setUploading(true)
    setProgress(0)

    try {
      const result = await uploadDataset(file, (percent) => {
        setProgress(percent)
      })
      setSuccess({
        datasetId: result.datasetId || result._id,
        fileName: file.name,
        totalRows: result.totalRows,
        totalColumns: result.totalColumns,
      })
      // Auto-redirect to analysis page after 1.5s
      setTimeout(() => {
        navigate(`/analysis/${result.datasetId || result._id}`)
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.')
      setUploading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="app-shell">
        <Sidebar />
        <main className="app-main">
          <h1 className="page-title">Upload Dataset</h1>
          <p className="page-subtitle">
            Upload a CSV or Excel file to start your automated EDA
          </p>

          <div style={styles.card}>
            {success ? (
              // Success state
              <div style={styles.successBox}>
                <div style={styles.successIcon}>
                  <FiCheckCircle />
                </div>
                <h2 style={styles.successTitle}>Upload successful!</h2>
                <p style={styles.successText}>
                  <strong>{success.fileName}</strong> uploaded
                  {success.totalRows && ` — ${success.totalRows.toLocaleString()} rows`}
                  {success.totalColumns && `, ${success.totalColumns} columns`}
                </p>
                <p style={styles.successHint}>
                  Redirecting to analysis page...
                </p>
              </div>
            ) : (
              <>
                <FileUpload
                  onFileSelected={setFile}
                  disabled={uploading}
                />

                {error && (
                  <div style={styles.errorBox}>
                    <FiAlertCircle /> {error}
                  </div>
                )}

                {uploading && (
                  <div style={styles.progressWrap}>
                    <div style={styles.progressBar}>
                      <div
                        style={{
                          ...styles.progressFill,
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                    <div style={styles.progressText}>
                      Uploading... {progress}%
                    </div>
                  </div>
                )}

                <div style={styles.actions}>
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="btn-primary-orange"
                    style={{
                      ...styles.btn,
                      ...(!file || uploading ? styles.btnDisabled : {}),
                    }}
                  >
                    {uploading ? (
                      'Uploading...'
                    ) : (
                      <>Upload & Analyze <FiArrowRight /></>
                    )}
                  </button>
                </div>

                <div style={styles.tipBox}>
                  <strong>Tip:</strong> Files are validated for type, size, and
                  structure before processing. Supported formats: CSV, XLSX,
                  XLS (max 20 MB).
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  )
}

const styles = {
  card: {
    background: '#fff',
    border: '1px solid var(--line)',
    borderRadius: 16,
    padding: 28,
    marginTop: 24,
    maxWidth: 720,
  },
  actions: {
    marginTop: 20,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 14,
    padding: '11px 22px',
  },
  btnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  progressWrap: {
    marginTop: 18,
  },
  progressBar: {
    height: 8,
    background: '#f2ece5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg,#fb923c,#ea580c)',
    transition: 'width .3s ease',
  },
  progressText: {
    fontSize: 12,
    color: 'var(--muted)',
    textAlign: 'center',
    marginTop: 6,
    fontWeight: 650,
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    background: '#fef2f2',
    color: '#b91c1c',
    border: '1px solid #fecaca',
    borderRadius: 8,
    padding: '10px 13px',
    fontSize: 13,
  },
  tipBox: {
    marginTop: 20,
    fontSize: 12,
    color: '#777',
    background: '#faf8f6',
    borderLeft: '3px solid #fb923c',
    padding: '10px 13px',
    lineHeight: 1.6,
  },
  successBox: {
    textAlign: 'center',
    padding: '20px 10px',
  },
  successIcon: {
    fontSize: 48,
    color: '#16845b',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 10,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 800,
    margin: 0,
    color: '#16845b',
  },
  successText: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 8,
  },
  successHint: {
    fontSize: 12,
    color: '#888',
    marginTop: 10,
    fontStyle: 'italic',
  },
}

export default UploadDataset