import API from './api'

/* ============ EDA APIs (Chapter 16.4) ============ */

/**
 * Start EDA analysis on a dataset
 * POST /api/eda/:id/analyze
 */
export const runEDAAnalysis = async (datasetId) => {
  const { data } = await API.post(`/eda/${datasetId}/analyze`)
  return data
}

/**
 * Get EDA results (missing values, duplicates, stats, outliers, correlation)
 * GET /api/eda/:id/results
 */
export const getEDAResults = async (datasetId) => {
  const { data } = await API.get(`/eda/${datasetId}/results`)
  return data
}

/* ============ AI APIs (Chapter 16.5) ============ */

/**
 * Generate AI insights using LLM
 * POST /api/ai/:id/insights
 */
export const generateAIInsights = async (datasetId) => {
  const { data } = await API.post(`/ai/${datasetId}/insights`)
  return data
}

/**
 * Retrieve previously generated AI insights
 * GET /api/ai/:id/insights
 */
export const getAIInsights = async (datasetId) => {
  const { data } = await API.get(`/ai/${datasetId}/insights`)
  return data
}

/* ============ Report APIs (Chapter 16.6) ============ */

/**
 * Generate a PDF report for an analyzed dataset
 * POST /api/reports/:id/generate
 */
export const generateReport = async (datasetId) => {
  const { data } = await API.post(`/reports/${datasetId}/generate`)
  return data
}

/**
 * Get report history for the logged-in user
 * GET /api/reports
 */
export const getReports = async () => {
  const { data } = await API.get('/reports')
  return data
}

/**
 * Download a report PDF
 * GET /api/reports/:id/download
 * Returns blob — use with createObjectURL for download
 */
export const downloadReport = async (reportId) => {
  const response = await API.get(`/reports/${reportId}/download`, {
    responseType: 'blob',
  })
  return response
}