<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import { Icon } from '@iconify/vue'
import { ref, watch } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import AdminError from '../shared/AdminError.vue'
import { presentError } from '../shared/transport'
import NativeDialog from '../shared/NativeDialog.vue'
import { pim } from '../api'
const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ close: []; created: [id: string] }>()
const title = ref(''), error = ref<ReturnType<typeof presentError>>(), busy = ref(false)
let idempotencyKey: string
watch(() => props.visible, visible => {
  if (visible) {
    const words = crypto.getRandomValues(new Uint32Array(4))
    idempotencyKey = Array.from(words, word => word.toString(16).padStart(8, '0')).join('')
  }
}, { immediate: true })

async function create() {
  const name = title.value.trim()
  if (!name || busy.value) return
  busy.value = true; error.value = undefined
  try {
    const result = await pim.createCatalog(name, idempotencyKey)
    title.value = ''; emit('close'); emit('created', result.catalog_id)
  } catch (e) { error.value = presentError(e, 'Could not create the catalog.') }
  finally { busy.value = false }
}
</script>
<template>
  <NativeDialog :visible="visible" label="Create catalog" :busy="busy" @close="emit('close')">
    <form class="dialog-box" @submit.prevent="create">
      <h2>Create catalog</h2>
      <p class="muted">After creating it, set up the product families and fields it needs.</p>
      <label class="pim-stack"><span class="small muted">Catalog name</span><InputText v-model="title" autofocus placeholder="For example, Outdoor equipment" /></label>
      <Disclosure class="small pim-ia-disclosure" label="Catalog pack technical details">
        <p>To create a catalog with a UI app preset, pass the catalog pack registry ID as <code>pack</code> to <code>PIMCatalogCreate</code>.</p>
      </Disclosure>
      <AdminError v-if="error" :error="error" />
      <div class="dialog-actions"><Button severity="secondary" outlined :disabled="busy" @click="emit('close')"><Icon icon="tabler:x" aria-hidden="true" /> Cancel</Button><Button type="submit" :disabled="busy || !title.trim()" :loading="busy">Create catalog</Button></div>
    </form>
  </NativeDialog>
</template>
