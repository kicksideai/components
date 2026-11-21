<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { host } from '@wippy-fe/proxy'
import { computed, nextTick, onMounted, ref, useId, watch } from 'vue'
import Button from 'primevue/button'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import ListRail from '@kickside/ui-kit/ListRail.vue'
import SettingsDirectoryActions from '@kickside/ui-kit/SettingsDirectoryActions.vue'
import { Icon } from '@iconify/vue'
import CreateBoard from '../CreateBoard.vue'
import { ensureTag } from '../mount'
import { canAdmin } from './model'
import { useBoards } from '../useBoards'
const dirty = ref(false), confirming = ref(false)
async function mayLeave() {
  if (confirming.value) return false
  if (!dirty.value) return true
  confirming.value = true
  try { return await host.confirm({ header: 'Discard changes?', message: 'Your unsaved board settings will be discarded.', acceptLabel: 'Discard', rejectLabel: 'Keep editing' }) }
  finally { confirming.value = false }
}
const focusBack = ref(false)
const selected = ref(''), currentBoard = ref(''), creating = ref(false), ready = ref(false), widgetLoading = ref(true)
const detail = ref<HTMLElement>(), list = ref<HTMLUListElement>(), searchField = ref<HTMLElement>()
const { boards, loading, error, search, visibleBoards, hasLoaded, load } = useBoards()
const boardMetaId = useId()
const boardGroups = computed(() => [
  { heading: 'Available', boards: visibleBoards.value.filter(board => canAdmin(board.access)) },
  { heading: 'Admin access required', boards: visibleBoards.value.filter(board => !canAdmin(board.access)) },
].filter(group => group.boards.length))
let offerDirectOpen = true
watch(search, () => { offerDirectOpen = false })

function select(id: string, focus = true) {
  offerDirectOpen = false
  focusBack.value = focus
  if (focus) detail.value?.focus({ preventScroll: true })
  currentBoard.value = selected.value = id
}
async function backToBoards() {
  if (!await mayLeave()) return false
  dirty.value = false
  selected.value = ''
  await nextTick()
  const target = list.value?.querySelector<HTMLButtonElement>('[aria-current="true"]') ?? searchField.value?.querySelector('input')
  target?.focus()
  return true
}
function createBoard() {
  offerDirectOpen = false
  creating.value = true
}

watch(boards, rows => {
  if (currentBoard.value && !rows.some(board => board.board_id === currentBoard.value && canAdmin(board.access))) {
    currentBoard.value = selected.value = ''
    dirty.value = false
  }
  if (!offerDirectOpen) return
  offerDirectOpen = false
  const only = rows[0]
  if (rows.length === 1 && only && canAdmin(only.access)) select(only.board_id, false)
})
async function loadSettings() {
  widgetLoading.value = true
  try { ready.value = await ensureTag('kickside-work-board-settings') }
  finally { widgetLoading.value = false }
}
onMounted(loadSettings)
async function created(id: string) {
  creating.value = false
  await load()
  select(id)
}
</script>
<template>
  <main class="kx-shell kx-settings-shell work-admin-shell" :class="{ 'work-board-selected': selected && ready }">
    <ListRail v-if="!selected || !ready" settings class="work-board-directory" title="Boards" :count="hasLoaded ? boards.length : undefined">
      <template #actions>
        <SettingsDirectoryActions create-label="Create board" @create="createBoard" @defaults="host.navigate('/system/settings')" />
      </template>
      <template #toolbar>
        <div ref="searchField" class="picker-search">
          <IconField>
            <InputIcon><Icon icon="tabler:search" aria-hidden="true" /></InputIcon>
            <InputText type="search" v-model="search" class="picker-search-input" aria-label="Search boards" placeholder="Search boards…" />
            <Button v-if="search" type="button" text severity="secondary" class="picker-search-clear" aria-label="Clear search" @click="search = ''; searchField?.querySelector('input')?.focus()">
              <template #icon><Icon icon="tabler:x" aria-hidden="true" /></template>
            </Button>
          </IconField>
        </div>
      </template>
      <p v-if="loading" class="kx-loading" role="status">Loading boards…</p>
      <div v-else-if="error" class="kx-err work-alert-actions">
        <p role="alert">{{ error }}</p>
        <Button label="Retry" severity="secondary" outlined @click="load(true)"><template #icon><Icon icon="tabler:refresh" aria-hidden="true" /></template></Button>
      </div>
      <ul v-if="boardGroups.length" ref="list" class="picker-list">
        <li v-for="group in boardGroups" :key="group.heading">
          <h2 v-if="boardGroups.length > 1 || group.heading !== 'Available'" class="picker-group">{{ group.heading }}</h2>
          <ul class="picker-list">
            <li v-for="board in group.boards" :key="board.board_id">
              <button type="button" class="picker-row work-rail-row"
                :aria-label="'Settings for ' + (board.title || 'Untitled board')" :aria-describedby="boardMetaId + '-' + board.board_id"
                :aria-current="currentBoard === board.board_id ? 'true' : undefined"
                :disabled="!canAdmin(board.access)" @click="select(board.board_id)">
                <span class="picker-name">{{ board.title || 'Untitled board' }}</span>
                <span :id="boardMetaId + '-' + board.board_id" class="work-sr-only"><template v-if="board.key_prefix">{{ board.key_prefix }} · </template>{{ board.open_count ?? 0 }}/{{ board.item_count ?? 0 }} open<template v-if="!canAdmin(board.access)"> · Admin access required</template></span>
              </button>
            </li>
          </ul>
        </li>
      </ul>
      <p v-if="hasLoaded && !loading && !error && !visibleBoards.length" class="picker-message" role="status">{{ boards.length ? 'No boards match. Try another name or key.' : 'Create a board or ask a board administrator to grant you access.' }}</p>
    </ListRail>
    <section ref="detail" class="work-admin-main" aria-label="Board settings detail" tabindex="-1">
      <kickside-work-board-settings v-if="selected && ready" :key="selected" :board-id="selected" embedded="true" :focus-back="String(focusBack)"
        :directory-count="hasLoaded ? boards.length : undefined"
        @back-to-boards="backToBoards" @dirty-change="dirty = $event.detail.dirty" />
      <p v-else-if="selected && widgetLoading" class="kx-loading" role="status">Loading board settings…</p>
      <p v-else-if="selected" class="kx-err" role="alert">Board settings are unavailable.<Button label="Back to boards" severity="secondary" text @click="backToBoards" /><Button label="Reload settings" severity="secondary" outlined @click="loadSettings"><template #icon><Icon icon="tabler:refresh" /></template></Button></p>
      <div v-else-if="hasLoaded && !error" class="kx-empty">
        <Icon class="kx-empty-ico" icon="tabler:adjustments" aria-hidden="true" />
        <h2 class="kx-empty-title">{{ boards.length ? 'Choose a board' : 'No boards yet' }}</h2>
        <p class="kx-empty-sub">{{ boards.length ? 'Select a board to manage its items, workflow, access and plugins.' : 'Create a board to set up its items, workflow, access and plugins.' }}</p>
      </div>
    </section>
    <CreateBoard :visible="creating" @close="creating = false" @created="created" />
  </main>
</template>
