<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { library as libraryApi } from '../api'
import { useMail } from '../context'
import { describe } from '../copy'
import { emailDocument } from '../editor/render'
import { faceLabels, problemOf } from '../editor/problems'

// Every message rendered with its sample values through the current library, at phone width.
const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ close: [] }>()
const { library, go } = useMail()

interface Tile { name: string; title: string; state: 'loading' | 'ready' | 'failed'; subject?: string; document?: string; problem?: string }
const tiles = ref<Tile[]>([])
let generation = 0

async function render(tile: Tile, run: number) {
  try {
    const result = await libraryApi.preview(tile.name, [])
    if (run !== generation) return
    tile.subject = result.subject
    tile.document = result.html ? emailDocument(result.html, result.inline_assets) : ''
    tile.state = 'ready'
  } catch (failure) {
    if (run !== generation) return
    const found = problemOf(failure)
    const owner = found?.resource && found.resource.name !== tile.name ? (library.find(found.resource.kind, found.resource.name)?.title ?? found.resource.name) + ', ' : ''
    tile.problem = found ? `${owner}${found.face ? faceLabels[found.face] + ': ' : ''}${found.message}` : describe(failure, 'This message could not be rendered.')
    tile.state = 'failed'
  }
}

async function renderAll() {
  const run = ++generation
  tiles.value = library.ofKind('message').map(message => reactive<Tile>({ name: message.name, title: message.title, state: 'loading' }))
  const queue = [...tiles.value]
  const workers = Array.from({ length: 3 }, async () => {
    for (let tile = queue.shift(); tile; tile = queue.shift()) await render(tile, run)
  })
  await Promise.all(workers)
}
watch(() => props.visible, open => { if (open) void renderAll(); else generation++ })

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
    <p v-if="!tiles.length" class="mail-muted">There are no messages yet.</p>
    <ul class="mail-gallery">
      <li v-for="tile in tiles" :key="tile.name" class="mail-gallery-tile" :class="{ 'mail-gallery-failed': tile.state === 'failed' }">
        <button type="button" class="mail-gallery-open" :aria-label="'Open ' + tile.title" @click="open(tile.name)">
          <span class="mail-gallery-title">{{ tile.title }}</span>
          <span class="mail-sub">{{ tile.subject ?? '' }}</span>
        </button>
        <div class="mail-gallery-frame">
          <p v-if="tile.state === 'loading'" class="kx-loading" role="status"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" />Rendering…</p>
          <p v-else-if="tile.state === 'failed'" class="mail-gallery-problem" role="status"><Icon icon="tabler:alert-triangle" aria-hidden="true" />{{ tile.problem }}</p>
          <iframe v-else sandbox="" :srcdoc="tile.document" :title="tile.title + ' preview'" tabindex="-1" />
        </div>
      </li>
    </ul>
    <template #footer>
      <Button label="Render again" severity="secondary" outlined @click="renderAll"><template #icon><Icon icon="tabler:refresh" aria-hidden="true" /></template></Button>
    </template>
  </Dialog>
</template>
