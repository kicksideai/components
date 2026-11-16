<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { host } from '@wippy-fe/proxy'
import { onMounted, ref, watch } from 'vue'
import Button from 'primevue/button'
import ContentAction from '../ContentAction.vue'
import InputText from 'primevue/inputtext'
import { Icon } from '@iconify/vue'
import CreateBoard from '../CreateBoard.vue'
import { ensureTag } from '../mount'
import { canAdmin } from './model'
import { useBoards } from '../useBoards'
const dirty = ref(false), confirming = ref(false)
async function select(id: string) {
  if (selected.value === id || confirming.value) return
  if (dirty.value) {
    confirming.value = true
    try { if (!await host.confirm({ header: 'Discard changes?', message: 'Your unsaved board settings will be discarded.', acceptLabel: 'Discard', rejectLabel: 'Keep editing' })) return }
    finally { confirming.value = false }
  }
  dirty.value = false; selected.value = id
}
const selected = ref(''), creating = ref(false), ready = ref(false), widgetLoading = ref(true)
const { boards, loading, error, search, visibleBoards, load } = useBoards(false)
watch(boards, rows => { if (selected.value && !rows.some(board => board.board_id === selected.value && canAdmin(board.access))) selected.value = '' })
async function loadSettings() { widgetLoading.value = true; ready.value = await ensureTag('kickside-work-board-settings'); widgetLoading.value = false }
onMounted(loadSettings)
async function created(id: string) { await load(); await select(id) }
</script>
<template>
  <main class="work-admin-shell">
    <nav class="work-rail" aria-label="Board settings navigation">
      <header class="work-railhead"><h2>Boards <span class="work-count work-mono" :aria-label="boards.length + (boards.length === 1 ? ' board' : ' boards')">{{ boards.length }}</span></h2><Button aria-label="Create board" title="Create board" severity="secondary" text size="small" @click="creating = true"><Icon icon="tabler:plus" /></Button></header>
      <InputText v-model="search" type="search" aria-label="Search boards" placeholder="Search boards…" />
      <p v-if="search.trim()" class="work-muted work-small">{{ visibleBoards.length }} of {{ boards.length }} {{ boards.length === 1 ? 'board' : 'boards' }}</p>
      <p v-if="error" class="kx-err" role="alert">{{ error }}</p><p v-if="loading" class="kx-loading">Loading boards…</p>
      <div class="work-rail-group">Workspace</div>
      <ContentAction v-for="board in visibleBoards" :key="board.board_id" class="work-rail-row" :class="{ 'work-rail-active': selected === board.board_id }" :aria-label="'Settings for ' + board.title" :aria-current="selected === board.board_id ? 'page' : undefined" :disabled="!canAdmin(board.access)" @activate="select(board.board_id)">
        <span class="work-stack work-tight"><strong>{{ board.title || 'Untitled board' }}</strong><span class="work-row work-wrap"><code class="work-mono">{{ board.key_prefix || 'Board' }}</code></span><span class="work-muted work-small">{{ board.item_count ?? 0 }} {{ board.item_count === 1 ? 'item' : 'items' }} · {{ board.open_count ?? 0 }} open</span><span v-if="!canAdmin(board.access)" class="work-muted work-small">Administrator access required</span></span>
      </ContentAction>
      <p v-if="!loading && !visibleBoards.length" class="work-muted work-small">{{ boards.length ? 'No boards match this search.' : 'No readable boards.' }}</p>
    </nav>
    <section class="work-admin-main" aria-label="Board settings detail">
      <kickside-work-board-settings v-if="selected && ready" :key="selected" :board-id="selected" embedded="true" @dirty-change="dirty = $event.detail.dirty" />
      <p v-else-if="selected && widgetLoading" class="kx-loading" role="status">Loading board settings…</p>
      <p v-else-if="selected" class="kx-err" role="alert">Board settings are unavailable.<Button label="Reload settings" severity="secondary" outlined @click="loadSettings"><template #icon><Icon icon="tabler:refresh" /></template></Button></p>
      <div v-else class="kx-empty"><Icon class="kx-empty-ico" icon="tabler:adjustments" /><h2 class="kx-empty-title">Choose a board</h2><p class="kx-empty-sub">Select a board to edit its fields, process and policy.</p></div>
    </section>
    <CreateBoard :visible="creating" @close="creating = false" @created="created" />
  </main>
</template>
