<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import { formatApiError } from '../transport'
import { Icon } from '@iconify/vue'
import { computed, ref, useId, watch } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import { ensureTag } from './mount'
import { work } from '../api'
import type { BoardApp, BoardRow } from '../types'
const props = defineProps<{ board?: BoardRow; boardApps?: BoardApp[]; compact?: boolean; detail?: boolean; subtitle?: string }>()
const emit = defineEmits<{ saved: []; 'dirty-change': [dirty: boolean] }>()
const editing = ref(false), appearanceOpen = ref(false), title = ref(''), description = ref(''), icon = ref(''), app = ref(''), iconReady = ref(false), busy = ref(false), error = ref(''), message = ref('')
const admin = computed(() => props.board?.access?.admin === true)
const nameId = useId(), appId = useId()
const original = ref({ title: '', description: '', icon: '', app: '' })
const appChoices = computed(() => [
  { id: '', title: 'Default app' },
  ...(props.boardApps ?? []),
  ...(props.board?.ui_app && !props.boardApps?.some(choice => choice.id === props.board?.ui_app)
    ? [{ id: props.board.ui_app, title: props.boardApps ? 'Unavailable app' : 'Configured board app', disabled: true }] : []),
])
const appLabel = computed(() => appChoices.value.find(choice => choice.id === app.value)?.title)
const canChooseApp = computed(() => !!props.boardApps?.length || !!props.board?.ui_app)
const boardDetails = computed(() => ({
  title: props.board?.title ?? '', icon: props.board?.icon ?? '',
  description: props.board?.description ?? '', app: props.board?.ui_app ?? '',
}))
function reset() {
  original.value = boardDetails.value
  title.value = boardDetails.value.title
  icon.value = boardDetails.value.icon
  description.value = boardDetails.value.description
  app.value = boardDetails.value.app
}
function loadIconPicker() {
  void ensureTag('wc-icon-picker').then(ready => iconReady.value = ready)
}
function begin() {
  reset()
  error.value = ''; message.value = ''
  editing.value = true
  loadIconPicker()
}
const changes = computed(() => {
  const patch: { title?: string; description?: string; icon?: string; ui_app?: string } = {}
  if (title.value.trim() !== original.value.title) patch.title = title.value.trim()
  if (description.value !== original.value.description) patch.description = description.value
  if (icon.value !== original.value.icon) patch.icon = icon.value
  if (app.value !== original.value.app) patch.ui_app = app.value
  return patch
})
const dirty = computed(() => (props.detail || editing.value) && Object.keys(changes.value).length > 0)
watch(boardDetails, () => { if (props.detail && !dirty.value) reset() }, { immediate: true })
watch(appearanceOpen, open => { if (open) loadIconPicker() })
watch(admin, allowed => { if (!allowed) cancel() })
watch(dirty, value => emit('dirty-change', value))
function cancel() { editing.value = false; error.value = ''; message.value = ''; reset() }
async function save() {
  if (!admin.value || !props.board || busy.value || !title.value.trim()) return
  const patch = changes.value
  if (!Object.keys(patch).length) { editing.value = false; message.value = 'Nothing changed.'; return }
  busy.value = true; error.value = ''
  try {
    const result = await work.updateBoard(props.board.board_id, patch)
    title.value = title.value.trim()
    original.value = { title: title.value, description: description.value, icon: icon.value, app: app.value }
    editing.value = false
    message.value = result.status === 'unchanged' ? 'Nothing changed.' : 'Board saved.'
    emit('saved')
  }
  catch (e) { error.value = formatApiError(e, 'Could not save the board.') }
  finally { busy.value = false }
}
</script>
<template>
  <form v-if="detail" class="work-board-identity" aria-label="Edit board details" @submit.prevent="save">
    <div class="work-settings-row">
      <label :for="nameId" class="work-row-main work-row-title">Board name</label>
      <InputText :id="nameId" v-model="title" required :disabled="busy || !admin" />
    </div>
    <div class="work-settings-row">
      <div class="work-row-main">
        <h3 class="work-row-title" :id="appId">Board app</h3>
        <p class="work-muted work-small">Opens the board from Work navigation.</p>
      </div>
      <Select v-model="app" :aria-labelledby="appId" :options="appChoices" :placeholder="appLabel" optionLabel="title" optionValue="id"
        optionDisabled="disabled" appendTo="self" :disabled="busy || !admin || !canChooseApp" />
    </div>
    <slot />
    <Disclosure v-model:open="appearanceOpen" class="work-board-appearance" label="Board description and icon">
      <div class="work-settings-grid">
        <label class="work-stack work-tight">Description<Textarea v-model="description" rows="1" :disabled="busy || !admin" /></label>
        <div class="work-stack work-tight">
          <span>Board icon</span>
          <wc-icon-picker v-if="iconReady" :value="icon" fallback="tabler:layout-kanban" :inert="busy || !admin || undefined"
            @select="icon = ($event as CustomEvent<string>).detail" />
          <p v-else class="work-muted work-small">The icon picker is unavailable.</p>
        </div>
      </div>
    </Disclosure>
    <div v-if="dirty || error || message" class="work-settings-row">
      <p v-if="error" class="kx-err" role="alert">{{ error }}</p>
      <p v-else-if="message && !dirty" class="work-muted work-small" role="status">{{ message }}</p>
      <template v-if="dirty">
        <Button label="Save board details" type="submit" size="small" :disabled="!title.trim() || busy || !admin" :loading="busy" />
        <Button label="Cancel" type="button" severity="secondary" text size="small" :disabled="busy" @click="cancel" />
      </template>
    </div>
  </form>
  <div v-else class="work-board-identity work-stack work-tight">
    <form v-if="editing" class="work-identity-edit" aria-label="Edit board" @click.stop @submit.prevent="save">
      <label class="work-stack work-tight">Title<InputText v-model="title" required autofocus :disabled="busy" /></label>
      <label class="work-stack work-tight">Description<Textarea v-model="description" rows="1" :disabled="busy" /></label>
      <div class="work-stack work-tight"><span>Board icon</span><wc-icon-picker v-if="iconReady" :value="icon" fallback="tabler:layout-kanban" :inert="busy || undefined" @select="icon = ($event as CustomEvent<string>).detail" /><p v-else class="work-muted work-small">The icon picker is unavailable.</p></div>
      <div class="work-row"><Button label="Save" severity="secondary" type="submit" :disabled="!title.trim() || busy" :loading="busy" outlined><template #icon><Icon icon="tabler:device-floppy" aria-hidden="true" /></template></Button><Button label="Cancel" severity="secondary" :disabled="busy" @click="cancel" outlined><template #icon><Icon icon="tabler:x" aria-hidden="true" /></template></Button></div>
    </form>
    <template v-else>
      <div class="work-row">
        <div class="work-row work-board-title">
          <Icon v-if="board?.icon" :icon="board.icon" aria-hidden="true" />
          <component :is="compact ? 'h2' : 'h1'" :class="compact ? 'kx-card-name' : 'kx-title'">{{ board?.title || 'Untitled board' }}</component>
        </div>
        <slot v-if="compact" name="title-end" />
        <span v-if="compact" class="work-identity-actions">
          <Button v-if="admin" severity="secondary" text size="small" @click.stop="begin" aria-label="Edit board"><Icon icon="tabler:pencil" aria-hidden="true" /></Button>
          <slot name="actions" />
        </span>
        <Button v-else-if="admin" severity="secondary" text size="small" @click.stop="begin" aria-label="Edit board"><Icon icon="tabler:pencil" aria-hidden="true" /></Button>
        <slot v-if="!compact" name="title-end" />
      </div>
      <p v-if="!compact && (subtitle || board?.description)" class="kx-head-sub" :title="subtitle || board?.description">{{ subtitle || board?.description }}</p>
    </template>
    <p v-if="error" class="kx-err work-inline" role="alert">{{ error }}</p><p v-if="message" class="work-muted work-small" role="status">{{ message }}</p>
  </div>
</template>
