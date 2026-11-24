// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { describe, expect, it } from 'vitest'
import { parse, pathOf, type Route } from './route'

describe('Mail routes', () => {
  it('round-trips every System location of the Mail tab', () => {
    const routes: Route[] = [
      { name: 'library', section: 'all' },
      { name: 'library', section: 'messages' },
      { name: 'library', section: 'bases' },
      { name: 'library', section: 'parts' },
      { name: 'library', section: 'assets' },
      { name: 'resource', kind: 'message', resource: 'weekly-report', section: 'variables' },
      { name: 'resource', kind: 'base', resource: 'standard', section: 'history' },
      { name: 'resource', kind: 'part', resource: 'footer', section: 'used-by' },
      { name: 'activity' },
      { name: 'activity', message: '0b9f1c2e-1111-4222-8333-444455556666' },
      { name: 'activity', template: 'notice' },
    ]
    for (const route of routes) expect(parse(pathOf(route))).toEqual(route)
  })

  it('opens the first section for a missing or unknown section and falls back to the library for unknown paths', () => {
    expect(parse('messages/notice')).toEqual({ name: 'resource', kind: 'message', resource: 'notice', section: 'content' })
    expect(parse('bases/standard/variables')).toEqual({ name: 'resource', kind: 'base', resource: 'standard', section: 'content' })
    expect(parse('elsewhere/x')).toEqual({ name: 'library', section: 'all' })
    expect(parse('messages/%E0%A4%A')).toEqual({ name: 'library', section: 'all' })
  })
})
