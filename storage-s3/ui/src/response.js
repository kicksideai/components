export function failedStorageResponse(response) {
  const error = response?.error || 'Storage request failed'
  return {
    error,
    savedNotice: response?.saved ? `Storage policy was saved. ${error}` : '',
  }
}

export function failedStorageRequest(cause) {
  const response = cause?.response?.data
  if (response?.error || response?.saved) return failedStorageResponse(response)
  const error = cause instanceof Error && cause.message ? cause.message : String(cause || 'Storage request failed')
  return failedStorageResponse({ error })
}
