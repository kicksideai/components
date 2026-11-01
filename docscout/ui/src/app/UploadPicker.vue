<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {onMounted,ref} from 'vue'
import {loadByTagName} from '@wippy-fe/proxy'
defineProps<{value:string}>()
const emit=defineEmits<{select:[value:string,name:string]}>()
const ready=ref(false),error=ref('')
onMounted(async()=>{try{await loadByTagName('wc-multiselect',{timeoutMs:8000});ready.value=true}catch(e){error.value=String(e)}})
function select(event:Event){const d=(event as CustomEvent<{selected:string[];labels?:string[]}>).detail;emit('select',d.selected[0]||'',d.labels?.[0]||'')}
</script>
<template><wc-multiselect v-if="ready" source="/api/v1/uploads/list" response-key="uploads" id-key="uuid" label-key="filename" :multi="false" :selected="JSON.stringify(value?[value]:[])" placeholder="Choose an upload" @change="select"/><p v-else-if="error" role="alert">{{error}}</p><span v-else class="muted">Loading uploads…</span></template>
