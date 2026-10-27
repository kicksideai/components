<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed,ref,watch,onBeforeUnmount} from 'vue'
import {useProps} from '@wippy-fe/webcomponent-vue'
import {on} from '@wippy-fe/proxy'
import {client,type Snapshot} from '../client'
import DocscoutPage from './DocscoutPage.vue'
const props=useProps<{entryId?:string}>()
const id=computed(()=>props.value.entryId??'')
const snapshot=ref<Snapshot>(),error=ref(''),saving=ref(false)
let dispose:(()=>void)|undefined
async function load(){if(!id.value){error.value='No extractor selected.';return}const selected=id.value;try{const value=await client.get(selected);if(selected===id.value){snapshot.value=value;error.value=''}}catch(e){error.value=e instanceof Error?e.message:String(e)}}
watch(id,()=>{snapshot.value=undefined;dispose?.();load();if(id.value)dispose=on(`component.${id.value}`,()=>load())},{immediate:true})
onBeforeUnmount(()=>dispose?.())
async function save(input:Parameters<typeof client.update>[1]){saving.value=true;error.value='';try{await client.update(id.value,input);await load()}catch(e){error.value=e instanceof Error?e.message:String(e)}finally{saving.value=false}}
async function addCase(input:Parameters<typeof client.addCase>[1]){saving.value=true;error.value='';try{await client.addCase(id.value,input);await load()}catch(e){error.value=e instanceof Error?e.message:String(e)}finally{saving.value=false}}
async function deleteCase(caseId:string){saving.value=true;error.value='';try{await client.deleteCase(id.value,caseId);await load()}catch(e){error.value=e instanceof Error?e.message:String(e)}finally{saving.value=false}}
</script>
<template><DocscoutPage v-if="snapshot" :snapshot="snapshot" :saving="saving" :error="error" @save="save" @add-case="addCase" @delete-case="deleteCase"/><p v-else-if="error" class="error" role="alert">{{error}}</p><p v-else class="empty" role="status">Loading Docscout…</p></template>
