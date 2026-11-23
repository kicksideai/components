// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { describe, expect, it, vi } from 'vitest'
import { BoardCreation } from './newBoard'
import { kanbanPack, WorkError } from '../work/client'
import type { PackCatalog } from '../work/types'

const pack = { id: kanbanPack, title: 'Kanban', version: '1.0.0' }
const ready: PackCatalog = { packs: [pack], can_create_board: true }

describe('New board', () => {
  it('separates catalog readiness and creation access', async () => {
    const create = vi.fn()
    const form = new BoardCreation(create, () => 'key')
    for (const catalog of [
      { ...ready, can_create_board: false },
      { ...ready, packs: [{ ...pack, problem: { code: 'invalid_pack' } }] },
      { ...ready, packs: [{ ...pack, plugins: [{ plugin: 'planning', installed: false }] }] },
    ]) {
      expect(form.configure(catalog).enabled).toBe(false)
      expect(await form.submit('Delivery', '')).toBeUndefined()
    }
    expect(create).not.toHaveBeenCalled()
  })

  it('reuses the original request after an uncertain write', async () => {
    const create = vi.fn()
      .mockRejectedValueOnce(new WorkError())
      .mockResolvedValueOnce({ board_id: 'created', generation: 1 })
    const key = vi.fn(() => 'original-key')
    const form = new BoardCreation(create, key)
    form.configure(ready)
    await expect(form.submit('Delivery', 'DE')).rejects.toBeInstanceOf(WorkError)
    expect(form.awaitingConfirmation).toBe(true)
    await expect(form.submit('Modified', 'MO')).resolves.toMatchObject({ board_id: 'created' })
    expect(create.mock.calls[1]).toEqual(create.mock.calls[0])
    expect(key).toHaveBeenCalledOnce()
  })

  it('uses a new request when a definite error is corrected', async () => {
    const create = vi.fn()
      .mockRejectedValueOnce(new WorkError({ code: 'key_prefix_taken' }, 409))
      .mockResolvedValueOnce({ board_id: 'created', generation: 1 })
    const key = vi.fn().mockReturnValueOnce('first').mockReturnValueOnce('second')
    const form = new BoardCreation(create, key)
    form.configure(ready)
    await expect(form.submit('Delivery', 'DE')).rejects.toBeInstanceOf(WorkError)
    expect(form.awaitingConfirmation).toBe(false)
    await form.submit('Delivery', 'DEL')
    expect(create.mock.calls[1][0]).toMatchObject({ idempotency_key: 'second', declaration: { key_prefix: 'DEL' } })
  })
})
