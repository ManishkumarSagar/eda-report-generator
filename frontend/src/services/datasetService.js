import API from './api'

/**
 * Upload a CSV or Excel dataset
 * POST /api/datasets/upload
 * @param {File} file - the file from React Dropzone
 * @param {function} onProgress - optional progress callback (0-100)
 */
export const uploadDataset = async (file, onProgress) => {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await API.post('/datasets/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        const percent = Math.round((e.loaded * 100) / e.total)
        onProgress(percent)
      }
    },
  })
  return data
}

/**
 * Get all datasets for the logged-in user
 * GET /api/datasets
 */
export const getDatasets = async () => {
  const { data } = await API.get('/datasets')
  return data
}

/**
 * Get a single dataset's details (metadata + preview rows)
 * GET /api/datasets/:id
 */
export const getDatasetById = async (id) => {
  const { data } = await API.get(`/datasets/${id}`)
  return data
}

/**
 * Get paginated preview rows of a dataset
 * GET /api/datasets/:id?page=1&limit=20
 */
export const getDatasetPreview = async (id, page = 1, limit = 20) => {
  const { data } = await API.get(`/datasets/${id}`, {
    params: { page, limit },
  })
  return data
}

/**
 * Delete a dataset
 * DELETE /api/datasets/:id
 */
export const deleteDataset = async (id) => {
  const { data } = await API.delete(`/datasets/${id}`)
  return data
}