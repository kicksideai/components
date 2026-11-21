<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { formatApiError } from '../transport'
import { Icon } from '@iconify/vue'
import { computed, ref, watch } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import { ensureTag } from './mount'
import { work } from '../api'
import type { BoardApp, BoardRow } from '../types'
const props = defineProps<{ board?: BoardRow; boardApps?: BoardApp[]; compact?: boolean; detail?: boolean; subtitle?: string }>()
const emit = defineEmits<{ saved: []; 'dirty-change': [dirty: boolean] }>()
const editing = ref(false), title = ref(''), description = ref(''), icon = ref(''), app = ref(''), iconReady = ref(false), busy = ref(false), error = ref(''), message = ref('')
const admin = computed(() => props.board?.access?.admin === true)
const original = ref({ title: '', description: '', icon: '', app: '' })
const appChoices = computed(() => [
  { id: '', title: 'Installation default' },
  ...(props.boardApps ?? []),
  ...(props.board?.ui_app && !props.boardApps?.some(choice => choice.id === props.board?.ui_app)
    ? [{ id: props.board.ui_app, title: props.boardApps ? 'Unavailable app' : 'Configured board app', disabled: true }] : []),
])
const currentApp = computed(() => appChoices.value.find(choice => choice.id === (props.board?.ui_app ?? ''))?.title)
const canChooseApp = computed(() => !!props.boardApps?.length || !!props.board?.ui_app)
function begin() {
  original.value = { title: props.board?.title ?? '', icon: props.board?.icon ?? '', description: props.board?.description ?? '', app: props.board?.ui_app ?? '' }
  title.value = original.value.title
  icon.value = original.value.icon
  description.value = original.value.description
  app.value = original.value.app
  error.value = ''; message.value = ''; editing.value = true
  void ensureTag('wc-icon-picker').then(ready => iconReady.value = ready)
}
const changes = computed(() => {
  const patch: { title?: string; description?: string; icon?: string; ui_app?: string } = {}
  if (title.value.trim() !== original.value.title) patch.title = title.value.trim()
  if (description.value !== original.value.description) patch.description = description.value
  if (icon.value !== original.value.icon) patch.icon = icon.value
  if (app.value !== original.value.app) patch.ui_app = app.value
  return patch
})
watch(admin, allowed => { if (!allowed) cancel() })
watch(() => editing.value && Object.keys(changes.value).length > 0, dirty => emit('dirty-change', dirty))
function cancel() { editing.value = false; error.value = '' }
async function save() {
  if (!admin.value || !props.board || busy.value || !title.value.trim()) return
  const patch = changes.value
  if (!Object.keys(patch).length) { editing.value = false; message.value = 'Nothing changed.'; return }
  busy.value = true; error.value = ''
  try { const result = await work.updateBoard(props.board.board_id, patch); editing.value = false; message.value = result.status === 'unchanged' ? 'Nothing changed.' : 'Board saved.'; emit('saved') }
  catch (e) { error.value = formatApiError(e, 'Could not save the board.') }
  finally { busy.value = false }
}
</script>
<template>
  <div class="work-board-identity work-stack work-tight">
    <form v-if="editing" class="work-identity-edit" aria-label="Edit board" @click.stop @submit.prevent="save">
      <label class="work-stack work-tight">Title<InputText v-model="title" required autofocus :disabled="busy" /></label>
      <label class="work-stack work-tight">Description<Textarea v-model="description" rows="1" :disabled="busy" /></label>
      <div class="work-stack work-tight"><span>Board icon</span><wc-icon-picker v-if="iconReady" :value="icon" fallback="tabler:layout-kanban" :inert="busy || undefined" @select="icon = ($event as CustomEvent<string>).detail" /><p v-else class="work-muted work-small">The icon picker is unavailable.</p></div>
      <label v-if="detail && canChooseApp" class="work-stack work-tight">Open board in
        <Select v-model="app" aria-label="Open board in" :options="appChoices" optionLabel="title" optionValue="id" optionDisabled="disabled" appendTo="self" :disabled="busy" />
        <span class="work-muted work-small">This is where people open the board from Work navigation.</span>
      </label>
      <div class="work-row"><Button label="Save" severity="secondary" type="submit" :disabled="!title.trim() || busy" :loading="busy" outlined><template #icon><Icon icon="tabler:device-floppy" aria-hidden="true" /></template></Button><Button label="Cancel" severity="secondary" :disabled="busy" @click="cancel" outlined><template #icon><Icon icon="tabler:x" aria-hidden="true" /></template></Button></div>
    </form>
    <div v-else-if="detail" class="work-row work-wrap work-identity-detail">
      <p class="work-spacer">Opens in <strong>{{ currentApp }}</strong></p>
      <Button v-if="admin" label="Edit board" severity="secondary" outlined @click.stop="begin">
        <template #icon><Icon icon="tabler:pencil" aria-hidden="true" /></template>
      </Button>
    </div>
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
