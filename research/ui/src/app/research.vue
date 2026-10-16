<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { api, loadByTagName, on } from '@wippy-fe/proxy'
import { eventKind, reportPlaceholder, resultMarkdown } from './events'
import type { EventKind, RunEvent, RunStatus } from './events'

// Research surface. Enter a prompt -> POST /research calls the kickside.research:request
// contract, which ensures a canonical owner thread + request event and starts an
// agent dataflow AS the requester. Progress + the final result land as events on
// that thread; the dataflow patches a read-model row (status / latest_step /
// result_md). This page loads the read-model once and then updates purely from the
// owner's realtime thread stream -- NO polling. The agent runs as the caller, so
// it can push to the user's hub; a realtime nudge triggers a single read-model
// refetch.
//
// Standalone WC: authenticated HTTP and realtime access come from the canonical
// proxy exports. No SPA composables; universal --p-* theme vocabulary.

interface Run {
  research_id: string
  thread_id: string
  agent_id: string
  status: RunStatus
  title?: string
  latest_step?: string
  result_md?: string
  urls?: string[]
  created_at?: string
  updated_at?: string
}

// The default research agent ships with the module (webscout web_researcher trait).
// agent_id is required by the contract; the UI sends this one.
const DEFAULT_AGENT = 'kickside.research.agents:researcher'
const OVERVIEW_TOPIC = 'kickside.threads'

const prompt = ref('')
const submitting = ref(false)
const error = ref('')
const selectedAgent = ref(DEFAULT_AGENT)
const iterations = ref(20)
const runs = ref<Run[]>([])
const expanded = ref<string>('')
const events = ref<RunEvent[]>([])
const loading = ref(true)

let unsub: (() => void) | null = null
let refetchTimer: ReturnType<typeof setTimeout> | null = null

async function loadRuns() {
  if (!api) return
  try {
    const { data } = await api.get('/api/v1/research/list?limit=100')
    if (data?.success) runs.value = (data.items ?? []) as Run[]
    error.value = ''
  } catch (e: any) {
    error.value = e?.message || 'failed to load research'
  } finally {
    loading.value = false
  }
}

// Canonical agent picker (wc-agent-picker) -> selected agent_id. multi=false so
// detail.selected is 0 or 1 id.
function onAgentChange(e: Event) {
  const detail = (e as CustomEvent).detail as { selected?: unknown } | undefined
  const ids = detail && Array.isArray(detail.selected) ? (detail.selected as unknown[]).map(String) : []
  selectedAgent.value = ids[0] || DEFAULT_AGENT
}

// The live progress log for the expanded run: its canonical thread events.
async function loadDetail(id: string) {
  if (!api || !id) return
  try {
    const { data } = await api.get(`/api/v1/research/${encodeURIComponent(id)}/events`)
    if (data?.success && expanded.value === id) events.value = (data.events ?? []) as RunEvent[]
  } catch { /* transient; next nudge retries */ }
}

// Realtime is a NUDGE, not data: on any owner thread update, refetch the read-model
// list AND (if a run is open) its event log -- both reflect the live state in one
// fetch. No polling.
function scheduleRefetch() {
  if (refetchTimer) return
  refetchTimer = setTimeout(() => {
    refetchTimer = null
    void loadRuns()
    if (expanded.value) void loadDetail(expanded.value)
  }, 400)
}

async function submit() {
  const p = prompt.value.trim()
  if (!p || submitting.value || !api) return
  submitting.value = true
  error.value = ''
  try {
    const agentId = selectedAgent.value || DEFAULT_AGENT
    const maxIter = Math.max(1, Math.min(Number(iterations.value) || 20, 50))
    const { data } = await api.post('/api/v1/research', { prompt: p, agent_id: agentId, max_iterations: maxIter })
    if (!data?.success) { error.value = data?.error || 'failed to start research'; return }
    prompt.value = ''
    // Optimistic insert; realtime + refetch will reconcile the canonical state.
    runs.value.unshift({
      research_id: data.research_id, thread_id: data.thread_id, agent_id: agentId,
      status: data.status || 'running', title: p,
    })
    // Auto-open the new run so its progress log streams in front of the user.
    expanded.value = data.research_id
    events.value = []
    void loadDetail(data.research_id)
  } catch (e: any) {
    error.value = e?.message || 'request failed'
  } finally {
    submitting.value = false
  }
}

function toggle(id: string) {
  if (expanded.value === id) { expanded.value = ''; events.value = []; return }
  expanded.value = id
  events.value = []
  void loadDetail(id)
}

function displayEvents(): RunEvent[] {
  return events.value.filter(e => eventKind(e) !== 'result')
}

function eventTitle(e: RunEvent): string {
  const kind: EventKind = eventKind(e)
  const b = e.body || {}
  if (kind === 'request') return 'Brief received'
  if (kind === 'failed') return 'Run failed'
  if (kind === 'result') return 'Report ready'
  return b.status ? String(b.status) : 'Progress update'
}

function eventLine(e: RunEvent): string {
  const b = e.body || {}
  const kind = eventKind(e)
  if (kind === 'request') return b.prompt || 'The research brief was queued.'
  if (kind === 'progress') return b.step || 'Working through the research plan.'
  if (kind === 'failed') return b.error || 'The research run failed.'
  return 'The final report is ready.'
}

function eventIcon(e: RunEvent): string {
  const kind = eventKind(e)
  if (kind === 'request') return 'tabler:clipboard-text'
  if (kind === 'failed') return 'tabler:alert-triangle'
  if (kind === 'result') return 'tabler:file-check'
  return 'tabler:activity'
}

function eventFindings(e: RunEvent): string[] {
  const findings = e.body && Array.isArray(e.body.findings) ? e.body.findings : []
  return findings.map(String).filter(Boolean)
}

function eventUrls(e: RunEvent): string[] {
  const urls = e.body && Array.isArray(e.body.urls) ? e.body.urls : []
  return urls.map(String).filter(Boolean)
}

function resultMd(run?: Run): string {
  return resultMarkdown(events.value, run?.result_md)
}

function sourceUrls(run: Run): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  const add = (value: unknown) => {
    const url = String(value || '').trim()
    if (!url || seen.has(url)) return
    seen.add(url)
    out.push(url)
  }
  for (const u of run.urls || []) add(u)
  for (const e of events.value) for (const u of eventUrls(e)) add(u)
  return out
}

function hostname(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return url }
}

function formatTime(value?: string): string {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function statusIcon(s: string): string {
  if (s === 'complete') return 'tabler:circle-check'
  if (s === 'failed') return 'tabler:alert-circle'
  return 'tabler:loader-2'
}

function statusLabel(s: string): string {
  if (s === 'complete') return 'Complete'
  if (s === 'failed') return 'Failed'
  if (s === 'pending') return 'Queued'
  return 'Running'
}

const anyRunning = computed(() => runs.value.some(r => r.status === 'running' || r.status === 'pending'))

onMounted(async () => {
  try {
    loadByTagName('wc-agent-picker', { timeoutMs: 8000 }).catch(() => {})
    loadByTagName('wc-render-markdown', { timeoutMs: 8000 }).catch(() => {})
    await loadRuns()
    unsub = on(OVERVIEW_TOPIC, scheduleRefetch)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'host API unavailable'
    loading.value = false
  }
})

onBeforeUnmount(() => {
  if (unsub) { try { unsub() } catch { /* noop */ } }
  if (refetchTimer) clearTimeout(refetchTimer)
})
</script>

<template>
  <div class="kx">
    <header class="kx-head">
      <div class="kx-head-icon"><Icon icon="tabler:world-search" aria-hidden="true" /></div>
      <div class="kx-head-text">
        <h1 class="kx-title">Research</h1>
        <p class="kx-sub">Enter a prompt — an agent researches it and reports back here live.</p>
      </div>
    </header>

    <div class="kx-body">
      <form class="kx-compose" @submit.prevent="submit">
        <textarea
          v-model="prompt"
          rows="2"
          class="kx-input kx-prompt"
          placeholder="What should the agent research? e.g. The economic impact of solar power in 2026"
          :disabled="submitting"
        ></textarea>
        <div class="kx-controls">
          <label class="kx-field">
            <span class="kx-field-label">Agent</span>
            <wc-agent-picker
              placeholder="Pick an agent…"
              multi="false"
              :selected="JSON.stringify([selectedAgent])"
              @change="onAgentChange"
            ></wc-agent-picker>
          </label>
          <label class="kx-field">
            <span class="kx-field-label">Iterations</span>
            <input v-model.number="iterations" type="number" min="1" max="50" class="kx-input kx-iter-input" :disabled="submitting" />
          </label>
          <button type="submit" class="kx-btn kx-btn-primary kx-controls-btn" :disabled="submitting || !prompt.trim()">
            <Icon :icon="submitting ? 'tabler:loader-2' : 'tabler:search'" :class="submitting && 'spin'" aria-hidden="true" />
            {{ submitting ? 'Starting…' : 'Research' }}
          </button>
        </div>
      </form>

      <div v-if="error" class="kx-err">{{ error }}</div>

      <div v-if="loading" class="kx-empty"><div class="kx-empty-sub">Loading…</div></div>

      <section v-else-if="runs.length" class="kx-section">
        <h2 class="kx-section-title">
          Your research
          <Icon v-if="anyRunning" icon="tabler:loader-2" class="spin kx-live" aria-hidden="true" />
        </h2>
        <ul class="kx-list">
          <li v-for="r in runs" :key="r.research_id" class="kx-row" :class="{ open: expanded === r.research_id }">
            <button class="kx-row-head" @click="toggle(r.research_id)">
              <Icon
                :icon="statusIcon(r.status)"
                :class="['kx-row-ico', r.status, (r.status === 'running' || r.status === 'pending') && 'spin']"
                aria-hidden="true"
              />
              <div class="kx-id">
                <div class="kx-name" :title="r.title">{{ r.title || 'Untitled research' }}</div>
                <div class="kx-sub">
                  <template v-if="r.status === 'complete'">Complete</template>
                  <template v-else-if="r.status === 'failed'">Failed{{ r.latest_step ? ': ' + r.latest_step : '' }}</template>
                  <template v-else>{{ r.latest_step || 'Researching…' }}</template>
                </div>
              </div>
              <Icon :icon="expanded === r.research_id ? 'tabler:chevron-up' : 'tabler:chevron-down'" class="kx-chev" aria-hidden="true" />
            </button>
            <div v-if="expanded === r.research_id" class="kx-detail">
              <div class="kx-detail-head">
                <div class="kx-run-summary">
                  <span class="kx-status-pill" :class="r.status">
                    <Icon :icon="statusIcon(r.status)" :class="(r.status === 'running' || r.status === 'pending') && 'spin'" aria-hidden="true" />
                    {{ statusLabel(r.status) }}
                  </span>
                  <span v-if="formatTime(r.updated_at || r.created_at)" class="kx-run-time">{{ formatTime(r.updated_at || r.created_at) }}</span>
                </div>
                <div v-if="sourceUrls(r).length" class="kx-source-strip" aria-label="Sources">
                  <a v-for="u in sourceUrls(r).slice(0, 6)" :key="u" class="kx-source-chip" :href="u" target="_blank" rel="noreferrer">
                    <Icon icon="tabler:link" aria-hidden="true" />
                    {{ hostname(u) }}
                  </a>
                  <span v-if="sourceUrls(r).length > 6" class="kx-source-more">+{{ sourceUrls(r).length - 6 }}</span>
                </div>
              </div>

              <div class="kx-detail-grid">
                <section class="kx-panel kx-timeline-panel">
                  <div class="kx-panel-title">
                    <Icon icon="tabler:timeline-event" aria-hidden="true" />
                    Progress
                  </div>
                  <ol class="kx-timeline">
                    <li v-for="ev in displayEvents()" :key="ev.seq" class="kx-timeline-row" :class="eventKind(ev)">
                      <div class="kx-timeline-dot"><Icon :icon="eventIcon(ev)" aria-hidden="true" /></div>
                      <div class="kx-timeline-body">
                        <div class="kx-timeline-title">{{ eventTitle(ev) }}</div>
                        <div class="kx-timeline-text">{{ eventLine(ev) }}</div>
                        <ul v-if="eventFindings(ev).length" class="kx-finding-list">
                          <li v-for="(f, i) in eventFindings(ev)" :key="i">{{ f }}</li>
                        </ul>
                        <div v-if="ev.body && ev.body.eta" class="kx-next-step">Next: {{ ev.body.eta }}</div>
                      </div>
                    </li>
                    <li v-if="(r.status === 'running' || r.status === 'pending')" class="kx-timeline-row live">
                      <div class="kx-timeline-dot"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" /></div>
                      <div class="kx-timeline-body">
                        <div class="kx-timeline-title">{{ displayEvents().length ? 'Agent working' : 'Waiting for first update' }}</div>
                        <div class="kx-timeline-text">{{ r.latest_step || 'The run is active. Progress appears here as the agent reports back.' }}</div>
                      </div>
                    </li>
                  </ol>
                </section>

                <section class="kx-panel kx-report-panel">
                  <div class="kx-panel-title">
                    <Icon icon="tabler:file-analytics" aria-hidden="true" />
                    Report
                  </div>
                  <wc-render-markdown
                    v-if="resultMd(r)"
                    class="kx-result"
                    :source="resultMd(r)"
                  ></wc-render-markdown>
                  <div v-else class="kx-report-empty">
                    <Icon icon="tabler:hourglass" aria-hidden="true" />
                    <span>{{ reportPlaceholder(r.status) }}</span>
                  </div>
                </section>
              </div>
            </div>
          </li>
        </ul>
      </section>

      <div v-else class="kx-empty">
        <div class="kx-empty-title">No research yet</div>
        <div class="kx-empty-sub">Enter a prompt above to run a research pass. Progress appears here live.</div>
      </div>
    </div>
  </div>
</template>
