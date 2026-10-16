// Research thread event vocabulary. The ids mirror kickside.research:consts
// (kickside.research.events:<name>) verbatim: the API returns the canonical
// event type string, so classification is an exact match, never a suffix guess.

export const EVENT_TYPES = {
  request: 'kickside.research.events:request',
  progress: 'kickside.research.events:progress',
  result: 'kickside.research.events:result',
  failed: 'kickside.research.events:failed',
} as const

export type EventKind = keyof typeof EVENT_TYPES

export interface RunEvent {
  type: string
  seq: number
  body: any
}

export type RunStatus = 'pending' | 'running' | 'complete' | 'failed'

const KIND_BY_TYPE: Record<string, EventKind> = Object.fromEntries(
  (Object.keys(EVENT_TYPES) as EventKind[]).map(kind => [EVENT_TYPES[kind], kind]),
)

export function eventKind(e: Pick<RunEvent, 'type'>): EventKind {
  return KIND_BY_TYPE[String(e?.type ?? '')] ?? 'progress'
}

function nonBlank(value: unknown): string {
  const text = typeof value === 'string' ? value : ''
  return text.trim() ? text : ''
}

// The report to render: the RESULT event's markdown when the live log carries
// it, else the projected read-model value. Blank strings never count as a report.
export function resultMarkdown(events: RunEvent[], projected?: string): string {
  for (const e of events) {
    if (eventKind(e) !== 'result') continue
    const md = nonBlank(e.body?.markdown)
    if (md) return md
  }
  return nonBlank(projected)
}

// What the report panel says when there is nothing to render for a run.
export function reportPlaceholder(status: RunStatus | string): string {
  if (status === 'failed') return 'No report was produced.'
  if (status === 'complete') return 'This run completed without a report.'
  return 'The report will appear here when the run completes.'
}
