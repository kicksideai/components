// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { componentEvent } from '@kickside/ui-kit/componentRealtime'
import { on } from '@wippy-fe/proxy'
import type { createCoordinator } from './coordinator'
import { kanbanUiApp } from '../work/client'

export function subscribeBoard(
  board: string,
  coordinator: ReturnType<typeof createCoordinator>,
  snapshot: () => { generation: number, title: string },
) {
  const stopBoard = on('component.' + board, message => {
    const event = componentEvent(message, board, { last_event_seq: 'integer', generation: 'integer' })
    if (event?.event !== 'component.meta.changed') {
      coordinator.invalidate(undefined, true)
      return
    }
    const { last_event_seq, generation, ui_app, title, status } = event.meta
    const known = snapshot()
    const revalidate = typeof last_event_seq !== 'number'
      || typeof generation === 'number' && generation !== known.generation
      || typeof ui_app === 'string' && ui_app !== kanbanUiApp
      || typeof title === 'string' && title !== known.title
      || typeof status === 'string' && status !== 'ready'
      || event.deleted.includes('ui_app')
    coordinator.invalidate(typeof last_event_seq === 'number' ? last_event_seq : undefined, revalidate)
  })
  const stopReconnect = on('@reconnect', () => coordinator.invalidate(undefined, true))
  return () => {
    stopBoard()
    stopReconnect()
  }
}
