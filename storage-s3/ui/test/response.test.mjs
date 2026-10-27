// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import test from 'node:test'
import assert from 'node:assert/strict'
import { failedStorageRequest } from '../src/response.js'

test('surfaces a non-2xx request body instead of the HTTP status message', () => {
  const cause = Object.assign(new Error('Request failed with status code 503'), {
    response: { data: { success: false, error: 'Storage upload verification failed' } },
  })
  assert.equal(failedStorageRequest(cause), 'Storage upload verification failed')
})

test('keeps a native request error detail', () => {
  assert.equal(failedStorageRequest(new Error('Connection refused')), 'Connection refused')
})

test('handles an absent or malformed error body', () => {
  const cause = Object.assign(new Error('Request failed with status code 502'), {
    response: { data: '<html>Bad gateway</html>' },
  })
  assert.equal(failedStorageRequest(cause), 'Request failed with status code 502')
  assert.equal(failedStorageRequest(), 'Storage request failed')
})
