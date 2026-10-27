export interface StorageResponseBody {
  error?: string
  saved?: boolean
}

export interface FailedStorageResponse {
  error: string
  savedNotice: string
}

export function failedStorageResponse(response?: StorageResponseBody): FailedStorageResponse
export function failedStorageRequest(error?: unknown): FailedStorageResponse
