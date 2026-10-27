import test from 'node:test'
import assert from 'node:assert/strict'
import { failedStorageRequest, failedStorageResponse } from '../src/response.js'

test('keeps a failed save response error and saved state visible', () => {
  const response = failedStorageResponse({ saved: true, error: 'Storage policy could not be applied' })
  assert.equal(response.error, 'Storage policy could not be applied')
  assert.equal(response.savedNotice, 'Storage policy was saved. Storage policy could not be applied')
})

test('uses the response error for ordinary failed requests', () => {
  const response = failedStorageResponse({ error: 'Storage upload verification failed' })
  assert.equal(response.error, 'Storage upload verification failed')
  assert.equal(response.savedNotice, '')
})

test('reads a non-2xx Axios response body', () => {
  const failed = failedStorageRequest({ response: { data: {
    saved: true, error: 'Storage policy could not be applied',
  } } })
  assert.equal(failed.error, 'Storage policy could not be applied')
  assert.equal(failed.savedNotice, 'Storage policy was saved. Storage policy could not be applied')
})

test('keeps a native request error detail', () => {
  const failed = failedStorageRequest(new Error('Connection refused'))
  assert.equal(failed.error, 'Connection refused')
  assert.equal(failed.savedNotice, '')
})
