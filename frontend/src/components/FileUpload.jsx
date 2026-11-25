import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUploadCloud, FiFile, FiX, FiAlertCircle } from 'react-icons/fi'

const ACCEPTED = {
  'text/csv': ['.csv'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-excel': ['.xls'],
}

const MAX_SIZE_MB = 20

function FileUpload({ onFileSelected, disabled = false }) {
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      setError('')

      // Handle rejection (wrong type / too big)
      if (rejectedFiles.length > 0) {
        const reason = rejectedFiles[0].errors[0]
        if (reason.code === 'file-too-large') {
          setError(`File too large. Max ${MAX_SIZE_MB} MB allowed.`)
        } else if (reason.code === 'file-invalid-type') {
          setError('Invalid file type. Only CSV, XLSX, XLS allowed.')
        } else {
          setError('File could not be accepted. Try another file.')
        }
        return
      }

      if (acceptedFiles.length > 0) {
        const f = acceptedFiles[0]
        setFile(f)
        onFileSelected?.(f)
      }
    },
    [onFileSelected]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxFiles: 1,
    maxSize: MAX_SIZE_MB * 1024 * 1024,
    disabled,
  })

  const removeFile = (e) => {
    e.stopPropagation()
    setFile(null)
    setError('')
    onFileSelected?.(null)
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  // If file already selected — show file chip
  if (file) {
    return (
      <div style={styles.fileCard}>
        <div style={styles.fileIcon}>
          <FiFile />
        </div>
        <div style={styles.fileInfo}>
          <div style={styles.fileName}>{file.name}</div>
          <div style={styles.fileMeta}>
            {formatSize(file.size)} · Ready to upload
          </div>
        </div>
        <button
          type="button"
          onClick={removeFile}
          style={styles.removeBtn}
          aria-label="Remove file"
        >
          <FiX />
        </button>
      </div>
    )
  }

  // Default dropzone
  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          ...styles.dropzone,
          ...(isDragActive ? styles.dropzoneActive : {}),
          ...(disabled ? styles.dropzoneDisabled : {}),
        }}
      >
        <input {...getInputProps()} />
        <div style={styles.icon}>
          <FiUploadCloud />
        </div>
        <div style={styles.title}>
          {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
        </div>
        <div style={styles.subtitle}>
          or <span style={styles.browse}>click to browse</span>
        </div>
        <div style={styles.formats}>
          <span style={styles.formatChip}>CSV</span>
          <span style={styles.formatChip}>XLSX</span>
          <span style={styles.formatChip}>XLS</span>
          <span style={styles.maxSize}>Max {MAX_SIZE_MB} MB</span>
        </div>
      </div>

      {error && (
        <div style={styles.error}>
          <FiAlertCircle /> {error}
        </div>
      )}
    </div>
  )
}

const styles = {
  dropzone: {
    border: '2px dashed #fed7aa',
    borderRadius: 14,
    padding: '44px 24px',
    textAlign: 'center',
    background: '#fffaf5',
    cursor: 'pointer',
    transition: 'all .18s ease',
  },
  dropzoneActive: {
    borderColor: '#f97316',
    background: '#fff1e7',
    transform: 'scale(1.01)',
  },
  dropzoneDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  icon: {
    fontSize: 40,
    color: '#f97316',
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: 700,
    color: '#30343b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#888',
    marginBottom: 14,
  },
  browse: {
    color: '#c2410c',
    fontWeight: 700,
    textDecoration: 'underline',
  },
  formats: {
    display: 'flex',
    gap: 6,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  formatChip: {
    fontSize: 10,
    fontWeight: 750,
    padding: '3px 9px',
    borderRadius: 20,
    background: '#fff1e7',
    color: '#b45309',
  },
  maxSize: {
    fontSize: 11,
    color: '#888',
    marginLeft: 6,
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    background: '#fef2f2',
    color: '#b91c1c',
    border: '1px solid #fecaca',
    borderRadius: 8,
    padding: '9px 12px',
    fontSize: 12,
  },
  fileCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    border: '1px solid var(--line)',
    background: '#fff',
    borderRadius: 12,
    padding: 14,
  },
  fileIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    background: '#fff1e7',
    color: '#c2410c',
    display: 'grid',
    placeItems: 'center',
    fontSize: 20,
    flexShrink: 0,
  },
  fileInfo: { flex: 1, minWidth: 0 },
  fileName: {
    fontSize: 14,
    fontWeight: 700,
    color: '#30343b',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  fileMeta: { fontSize: 12, color: '#888', marginTop: 2 },
  removeBtn: {
    background: '#f3ede6',
    border: 'none',
    borderRadius: 8,
    width: 32,
    height: 32,
    display: 'grid',
    placeItems: 'center',
    cursor: 'pointer',
    color: '#555',
    fontSize: 15,
  },
}

export default FileUpload