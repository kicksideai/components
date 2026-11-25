// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
export type Format = 'bold' | 'italic' | 'code' | 'link' | 'bullet' | 'number' | 'check' | 'quote'

export interface Edit {
  text: string
  start: number
  end: number
}

const fence = /^(```|~~~)/

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function issueKeyPattern(prefix: string) {
  return new RegExp('(^|[^\\w/#-])(' + escapeRegExp(prefix) + '-\\d+)(?![\\w-])', 'g')
}

// Issue keys outside code and existing links become links the panel resolves by key.
export function linkIssueKeys(source: string, prefix: string | undefined, href: (key: string) => string | undefined) {
  if (!prefix) return source
  const pattern = issueKeyPattern(prefix)
  let inFence = false
  return source.split('\n').map(line => {
    if (fence.test(line.trimStart())) {
      inFence = !inFence
      return line
    }
    if (inFence) return line
    return line.split(/(`[^`]*`|\[[^\]]*\]\([^)]*\)|<[^>]+>)/).map((part, index) => index % 2
      ? part
      : part.replace(pattern, (match, lead: string, key: string) => {
        const target = href(key)
        return target ? lead + '[' + key + '](' + target + ')' : match
      })).join('')
  }).join('\n')
}

export function issueKeys(source: string, prefix: string | undefined) {
  if (!prefix) return []
  return [...new Set(Array.from(source.matchAll(issueKeyPattern(prefix)), match => match[2]))]
}

function lineBounds(text: string, start: number, end: number) {
  const from = text.lastIndexOf('\n', start - 1) + 1
  const next = text.indexOf('\n', end)
  return [from, next < 0 ? text.length : next] as const
}

export function applyFormat(text: string, start: number, end: number, format: Format): Edit {
  const selected = text.slice(start, end)
  const wrap = (before: string, after: string, placeholder: string) => {
    const inner = selected || placeholder
    const next = text.slice(0, start) + before + inner + after + text.slice(end)
    return { text: next, start: start + before.length, end: start + before.length + inner.length }
  }
  if (format === 'bold') return wrap('**', '**', 'bold text')
  if (format === 'italic') return wrap('_', '_', 'italic text')
  if (format === 'code') return selected.includes('\n') ? wrap('```\n', '\n```', 'code') : wrap('`', '`', 'code')
  if (format === 'link') {
    const label = selected || 'link text'
    const next = text.slice(0, start) + '[' + label + '](https://)' + text.slice(end)
    const url = start + label.length + 3
    return { text: next, start: url, end: url + 8 }
  }
  const [from, to] = lineBounds(text, start, end)
  const lines = text.slice(from, to).split('\n')
  const marker = (index: number) => format === 'bullet' ? '- ' : format === 'number' ? index + 1 + '. '
    : format === 'check' ? '- [ ] ' : '> '
  const prefixed = lines.map((line, index) => marker(index) + line)
  const block = prefixed.join('\n')
  return { text: text.slice(0, from) + block + text.slice(to), start: from + marker(0).length, end: from + block.length }
}

const listItem = /^(\s*)(- \[[ xX]\] |[-*+] |(\d+)\. |> )(.*)$/

// Enter inside a list item starts the next item; Enter on an empty item ends the list.
export function continueList(text: string, caret: number): Edit | undefined {
  const [from] = lineBounds(text, caret, caret)
  const line = text.slice(from, caret)
  const match = listItem.exec(line)
  if (!match) return
  const [, indent, marker, number, content] = match
  if (!content.trim()) {
    const next = text.slice(0, from) + text.slice(caret)
    return { text: next, start: from, end: from }
  }
  const following = number !== undefined ? Number(number) + 1 + '. ' : marker.startsWith('- [') ? '- [ ] ' : marker
  const insert = '\n' + indent + following
  return { text: text.slice(0, caret) + insert + text.slice(caret), start: caret + insert.length, end: caret + insert.length }
}

const units: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 31_536_000], ['month', 2_592_000], ['week', 604_800], ['day', 86_400], ['hour', 3_600], ['minute', 60],
]

export function relativeTime(value: string, now = Date.now()) {
  const time = new Date(value).valueOf()
  if (Number.isNaN(time)) return ''
  const seconds = Math.round((time - now) / 1000)
  const format = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return format.format(Math.round(seconds / size), unit)
  }
  return 'just now'
}

export function exactTime(value: string) {
  const time = new Date(value)
  return Number.isNaN(time.valueOf()) ? value
    : time.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}
