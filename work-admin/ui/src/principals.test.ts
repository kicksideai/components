// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it, vi } from 'vitest'
import { api } from '@wippy-fe/proxy'
import { principalLabel, resolveNames } from './principals'

it('uses the directory display name before email and never renders an opaque principal', async () => {
  const person = { kind: 'user', id: 'delivery@example.test' }
  expect(principalLabel(person)).toBe('delivery@example.test')
  vi.mocked(api.post).mockResolvedValue({ data: { success: true, data: { principals: [{ type: 'user', id: person.id, label: 'Robin Vale' }] } } })
  const labels = await resolveNames('board', [person])
  expect(principalLabel(person, labels)).toBe('Robin Vale')
  expect(api.post).toHaveBeenCalledWith('/api/v1/work-admin/boards/board/principal_labels', { refs: [{ type: 'user', id: person.id }] })
  expect(principalLabel({ kind: 'user', id: '3a98b689-8828-4e33-a973-1373176be0d0' })).toBe('Unavailable person')
})

it('rejects a host HTML fallback instead of accepting it as an empty name response', async () => {
  vi.mocked(api.post).mockResolvedValue({ data: '<html></html>' })
  await expect(resolveNames('board', [{ kind: 'user', id: 'unknown-person' }])).rejects.toThrow('invalid response envelope')
})

it('revalidates names on each read and does not carry labels across board authority', async () => {
  vi.mocked(api.post).mockClear().mockResolvedValue({ data: { success: true, data: { principals: [{ type: 'user', id: 'changing', label: 'First' }] } } })
  await resolveNames('one', [{ kind: 'user', id: 'changing' }])
  await resolveNames('two', [{ kind: 'user', id: 'changing' }])
  await resolveNames('one', [{ kind: 'user', id: 'changing' }])
  expect(api.post).toHaveBeenCalledTimes(3)
})
it('shares pending lookups for concurrent views of the same board', async () => {
  vi.mocked(api.post).mockClear().mockResolvedValue({ data: { success: true, data: { principals: [] } } })
  await Promise.all([resolveNames('shared', [{ kind: 'user', id: 'same' }]), resolveNames('shared', [{ kind: 'user', id: 'same' }])])
  expect(api.post).toHaveBeenCalledTimes(1)
})
