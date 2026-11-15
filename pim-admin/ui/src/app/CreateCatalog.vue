<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import NativeDialog from '../shared/NativeDialog.vue'
import { pim } from '../api'
defineProps<{ visible: boolean }>()
const emit = defineEmits<{ close: []; created: [id: string] }>()
const title = ref(''), error = ref(''), busy = ref(false)
async function create() {
  const name = title.value.trim()
  if (!name || busy.value) return
  busy.value = true; error.value = ''
  try {
    const result = await pim.createCatalog(name)
    title.value = ''; emit('close'); emit('created', result.catalog_id)
  } catch (e) { error.value = e instanceof Error ? e.message : 'Could not create the catalog.' }
  finally { busy.value = false }
}
</script>
<template>
  <NativeDialog :visible="visible" label="New catalog" :busy="busy" @close="emit('close')">
    <form class="dialog-box" @submit.prevent="create">
      <h2>New catalog</h2>
      <label class="pim-stack"><span class="small muted">Title</span><InputText v-model="title" autofocus placeholder="Catalog title" /></label>
      <Message v-if="error" severity="error">{{ error }}</Message>
      <div class="dialog-actions"><Button severity="secondary" outlined :disabled="busy" @click="emit('close')"><Icon icon="tabler:x" aria-hidden="true" /> Cancel</Button><Button type="submit" :disabled="busy || !title.trim()" :loading="busy">Create</Button></div>
    </form>
  </NativeDialog>
</template>
