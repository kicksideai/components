<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, ref, watch } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import { work } from '../api'
import type { BoardRow } from '../types'
const props = defineProps<{ board?: BoardRow; compact?: boolean; detail?: boolean; subtitle?: string }>()
const emit = defineEmits<{ saved: [] }>()
const editing = ref(false), title = ref(''), description = ref(''), busy = ref(false), error = ref(''), message = ref('')
const admin = computed(() => props.board?.access?.admin === true)
function begin() { title.value = props.board?.title ?? ''; description.value = props.board?.description ?? ''; error.value = ''; message.value = ''; editing.value = true }
watch(admin, allowed => { if (!allowed) editing.value = false })
async function save() {
  if (!admin.value || !props.board || busy.value || !title.value.trim()) return
  const changes: { title?: string; description?: string } = {}
  if (title.value.trim() !== props.board.title) changes.title = title.value.trim()
  if (description.value !== (props.board.description ?? '')) changes.description = description.value
  if (!Object.keys(changes).length) { editing.value = false; message.value = 'Nothing changed.'; return }
  busy.value = true; error.value = ''
  try { const result = await work.updateBoard(props.board.board_id, changes); editing.value = false; message.value = result.status === 'unchanged' ? 'Nothing changed.' : 'Board saved.'; emit('saved') }
  catch (e) { error.value = e instanceof Error ? e.message : 'Could not save the board.' }
  finally { busy.value = false }
}
</script>
<template>
  <div class="work-board-identity work-stack work-tight">
    <form v-if="editing" class="work-identity-edit" aria-label="Edit board" @click.stop @submit.prevent="save">
      <label class="work-stack work-tight">Title<InputText v-model="title" required autofocus :disabled="busy" /></label>
      <label class="work-stack work-tight">Description<Textarea v-model="description" rows="1" :disabled="busy" /></label>
      <div class="work-row"><Button label="Save" severity="secondary" type="submit" :disabled="!title.trim() || busy" :loading="busy" outlined><template #icon><Icon icon="tabler:device-floppy" aria-hidden="true" /></template></Button><Button label="Cancel" severity="secondary" :disabled="busy" @click="editing = false" outlined><template #icon><Icon icon="tabler:x" aria-hidden="true" /></template></Button></div>
    </form>
    <template v-else><div class="work-row"><component :is="compact || detail ? 'h2' : 'h1'" :class="detail ? 'work-detail-title' : compact ? 'kx-card-name' : 'kx-title'">{{ board?.title || 'Untitled board' }}</component><slot v-if="compact" name="title-end" /><span v-if="compact" class="work-identity-actions"><Button v-if="admin" severity="secondary" text size="small" @click.stop="begin" aria-label="Edit board"><Icon icon="tabler:pencil" aria-hidden="true" /></Button><slot name="actions" /></span><Button v-else-if="admin" severity="secondary" text size="small" @click.stop="begin" aria-label="Edit board"><Icon icon="tabler:pencil" aria-hidden="true" /></Button><slot v-if="!compact" name="title-end" /></div><p v-if="!compact && (subtitle || board?.description)" class="kx-head-sub" :title="subtitle || board?.description">{{ subtitle || board?.description }}</p></template>
    <p v-if="error" class="kx-err work-inline" role="alert">{{ error }}</p><p v-if="message" class="work-muted work-small" role="status">{{ message }}</p>
  </div>
</template>
