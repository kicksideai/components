<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import ProgressBar from 'primevue/progressbar'
import { library as libraryApi } from '../api'
import { useMail } from '../context'
import { describe, plural } from '../copy'
import { emailDocument } from '../editor/render'
import { useReturnFocus } from '../focus'
import ProblemNote from '../editor/ProblemNote.vue'
import { problemOf, type Problem } from '../editor/problems'

// Every message rendered with its sample values through the current library, at phone width. Messages are read a
// page at a time and each tile renders when it scrolls into view, a few at a time; closing stops everything.
const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ close: [] }>()
const { go } = useMail()
useReturnFocus(() => props.visible)

const CONCURRENCY = 3
interface Tile { name: string; title: string; state: 'waiting' | 'loading' | 'ready' | 'failed'; subject?: string; document?: string; problem?: Problem; failure?: string }
const tiles = ref<Tile[]>([])
const cursor = ref<string>()
const listing = ref(false), listError = ref('')
let generation = 0
let queue: Tile[] = []
let running = 0
let observer: IntersectionObserver | undefined

async function render(tile: Tile, run: number) {
  tile.state = 'loading'
  try {
    const result = await libraryApi.preview(tile.name, [])
    if (run !== generation) return
    tile.subject = result.subject
    tile.document = result.html ? emailDocument(result.html, result.inline_assets) : ''
    tile.state = 'ready'
  } catch (failure) {
    if (run !== generation) return
    tile.problem = problemOf(failure)
    tile.failure = tile.problem ? '' : describe(failure, 'This message could not be rendered.')
    tile.state = 'failed'
  }
}

function pump(run: number) {
  while (run === generation && running < CONCURRENCY && queue.length) {
    const tile = queue.shift() as Tile
    if (tile.state !== 'waiting') continue
    running++
    void render(tile, run).finally(() => {
      running--
      pump(run)
    })
  }
}

function request(tile: Tile) {
  if (tile.state !== 'waiting' || queue.includes(tile)) return
  queue.push(tile)
  pump(generation)
}

const list = ref<HTMLElement>()
function observe() {
  observer?.disconnect()
  if (typeof IntersectionObserver === 'undefined' || !list.value) {
    for (const tile of tiles.value) request(tile)
    return
  }
  observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      const tile = tiles.value.find(item => item.name === (entry.target as HTMLElement).dataset.name)
      if (tile) request(tile)
    }
  }, { root: list.value.closest('.p-dialog-content'), rootMargin: '200px' })
  for (const element of list.value.querySelectorAll('[data-name]')) observer.observe(element)
}

async function loadPage(run: number) {
  listing.value = true
  listError.value = ''
  try {
    const page = await libraryApi.page({ kind: 'message', cursor: cursor.value })
    if (run !== generation) return
    tiles.value = [...tiles.value, ...page.items.map(item => reactive<Tile>({ name: item.name, title: item.title, state: 'waiting' }))]
    cursor.value = page.next_cursor
    await nextTick()
    observe()
  } catch (failure) {
    if (run === generation) listError.value = describe(failure, 'The messages could not be listed.')
  } finally {
    if (run === generation) listing.value = false
  }
}

function stop() {
  generation++
  queue = []
  observer?.disconnect()
  observer = undefined
}

function start() {
  stop()
  tiles.value = []
  cursor.value = undefined
  void loadPage(generation)
}
function again() {
  const run = ++generation
  queue = []
  for (const tile of tiles.value) Object.assign(tile, { state: 'waiting', subject: undefined, document: undefined, problem: undefined, failure: undefined })
  void nextTick(() => { if (run === generation) observe() })
}
watch(() => props.visible, open => { if (open) start(); else stop() })
onBeforeUnmount(stop)

const done = computed(() => tiles.value.filter(tile => tile.state === 'ready' || tile.state === 'failed').length)
const failed = computed(() => tiles.value.filter(tile => tile.state === 'failed').length)
const progress = computed(() => {
  if (!tiles.value.length) return ''
  const count = `${done.value} of ${plural(tiles.value.length, 'message')}${cursor.value ? ' listed so far' : ''} rendered`
  return failed.value ? `${count}, ${failed.value} with a problem.` : count + '.'
})

function open(name: string) {
  emit('close')
  go({ name: 'resource', kind: 'message', resource: name, section: 'content' })
}
const dialogPt = { header: { class: 'mail-dialog-header' }, content: { class: 'mail-dialog-content' }, footer: { class: 'mail-dialog-footer' } }
</script>

<template>
  <Dialog :visible="visible" modal :draggable="false" class="mail-dialog mail-dialog-gallery" :pt="dialogPt" aria-label="Preview all messages"
    @update:visible="value => { if (!value) emit('close') }">
    <template #header>
      <span class="kx-modal-head-icon"><Icon icon="tabler:layout-grid" aria-hidden="true" /></span>
      <span class="kx-modal-head-text">
        <span class="kx-modal-head-title">All messages</span>
        <span class="kx-modal-head-sub">Each message with its sample values, through the current library.</span>
      </span>
    </template>
    <div v-if="tiles.length" class="mail-gallery-progress" role="status">
      <span>{{ progress }}</span>
      <ProgressBar :value="Math.round(done / tiles.length * 100)" :show-value="false" aria-hidden="true" />
    </div>
    <p v-if="listing && !tiles.length" class="kx-loading" role="status"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" />Listing messages…</p>
    <p v-else-if="!listing && !listError && !tiles.length" class="mail-muted">There are no messages yet.</p>
    <ul ref="list" class="mail-gallery">
      <li v-for="tile in tiles" :key="tile.name" :data-name="tile.name" class="mail-gallery-tile" :class="{ 'mail-gallery-failed': tile.state === 'failed' }">
        <Button text severity="secondary" class="mail-gallery-open" :aria-label="'Open ' + tile.title" @click="open(tile.name)">
          <span class="mail-gallery-title">{{ tile.title }}</span>
          <span class="mail-sub">{{ tile.subject ?? '' }}</span>
        </Button>
        <div class="mail-gallery-frame">
          <p v-if="tile.state === 'waiting'" class="mail-muted mail-gallery-wait">Renders when shown.</p>
          <p v-else-if="tile.state === 'loading'" class="kx-loading" role="status"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" />Rendering…</p>
          <div v-else-if="tile.state === 'failed'" class="mail-gallery-problem">
            <ProblemNote v-if="tile.problem" :problem="tile.problem" :draft="{ kind: 'message', name: tile.name }" />
            <p v-else role="alert">{{ tile.failure }}</p>
          </div>
          <iframe v-else sandbox="" :srcdoc="tile.document" :title="tile.title + ' preview'" tabindex="-1" />
        </div>
      </li>
    </ul>
    <div v-if="cursor || listError" class="mail-more">
      <span v-if="listError" class="kx-err inline" role="alert">{{ listError }}</span>
      <Button :label="listError ? 'Retry' : 'Show more messages'" severity="secondary" outlined :loading="listing" @click="loadPage(generation)" />
    </div>
    <template #footer>
      <Button label="Render again" severity="secondary" outlined :disabled="!tiles.length" @click="again"><template #icon><Icon icon="tabler:refresh" aria-hidden="true" /></template></Button>
    </template>
  </Dialog>
</template>
