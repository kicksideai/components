// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
export function failedStorageRequest(cause) {
  const response = cause?.response?.data
  if (typeof response?.error === 'string' && response.error) return response.error
  return cause instanceof Error && cause.message ? cause.message : 'Storage request failed'
}
