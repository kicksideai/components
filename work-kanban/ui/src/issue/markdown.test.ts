// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { describe, expect, it } from 'vitest'
import { applyFormat, continueList, issueKeys, linkIssueKeys, relativeTime } from './markdown'

const href = (key: string) => 'https://kanban.test/board#issue=' + key

describe('issue references', () => {
  it('links keys in prose and leaves code, links and other prefixes alone', () => {
    const source = [
      'Blocked by ROPS-12, see ROPS-4.',
      '`ROPS-7` stays code and [ROPS-8](https://x.test) stays a link.',
      '```', 'ROPS-9 in a fence', '```', 'XROPS-1 and OPS-2 are not keys.',
    ].join('\n')
    expect(linkIssueKeys(source, 'ROPS', href)).toBe([
      'Blocked by [ROPS-12](https://kanban.test/board#issue=ROPS-12), see [ROPS-4](https://kanban.test/board#issue=ROPS-4).',
      '`ROPS-7` stays code and [ROPS-8](https://x.test) stays a link.',
      '```', 'ROPS-9 in a fence', '```', 'XROPS-1 and OPS-2 are not keys.',
    ].join('\n'))
    expect(issueKeys(source, 'ROPS')).toEqual(['ROPS-12', 'ROPS-4', 'ROPS-7', 'ROPS-8', 'ROPS-9'])
  })
})

describe('formatting commands', () => {
  it('wraps the selection and selects the inserted placeholder', () => {
    expect(applyFormat('make it so', 5, 7, 'bold')).toEqual({ text: 'make **it** so', start: 7, end: 9 })
    expect(applyFormat('', 0, 0, 'code')).toEqual({ text: '`code`', start: 1, end: 5 })
    expect(applyFormat('docs', 0, 4, 'link')).toEqual({ text: '[docs](https://)', start: 7, end: 15 })
  })

  it('prefixes every selected line for lists and quotes', () => {
    expect(applyFormat('one\ntwo', 0, 7, 'number').text).toBe('1. one\n2. two')
    expect(applyFormat('one\ntwo', 2, 5, 'check').text).toBe('- [ ] one\n- [ ] two')
    expect(applyFormat('note', 0, 0, 'quote').text).toBe('> note')
  })

  it('continues and ends lists on Enter', () => {
    expect(continueList('- first', 7)).toEqual({ text: '- first\n- ', start: 10, end: 10 })
    expect(continueList('3. third', 8)?.text).toBe('3. third\n4. ')
    expect(continueList('- [x] done', 10)?.text).toBe('- [x] done\n- [ ] ')
    expect(continueList('- ', 2)).toEqual({ text: '', start: 0, end: 0 })
    expect(continueList('plain', 5)).toBeUndefined()
  })
})

describe('relative time', () => {
  it('describes recent and older moments', () => {
    const now = Date.parse('2026-11-23T12:00:00Z')
    expect(relativeTime('2026-11-23T11:59:40Z', now)).toBe('just now')
    expect(relativeTime('2026-11-23T11:55:00Z', now)).toMatch(/5 minutes ago/)
    expect(relativeTime('2026-11-21T12:00:00Z', now)).toMatch(/2 days ago/)
  })
})
