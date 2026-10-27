<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {ref,watch,onBeforeUnmount} from 'vue'
import {on} from '@wippy-fe/proxy'
import {client,type Snapshot} from '../client'
import DocscoutPage from './DocscoutPage.vue'
const props=defineProps<{id:string;back?:boolean}>()
const emit=defineEmits<{back:[]}>()
const snapshot=ref<Snapshot>(),error=ref(''),saving=ref(false)
let dispose:(()=>void)|undefined
async function load(){if(!props.id){error.value='No extractor selected.';return}const selected=props.id;try{const value=await client.get(selected);if(selected===props.id){snapshot.value=value;error.value=''}}catch(e){error.value=e instanceof Error?e.message:String(e)}}
watch(()=>props.id,()=>{snapshot.value=undefined;dispose?.();load();if(props.id)dispose=on(`component.${props.id}`,()=>load())},{immediate:true})
onBeforeUnmount(()=>dispose?.())
async function run(action:()=>Promise<unknown>){saving.value=true;error.value='';try{await action();await load()}catch(e){error.value=e instanceof Error?e.message:String(e)}finally{saving.value=false}}
const save=(input:Parameters<typeof client.update>[1])=>run(()=>client.update(props.id,input))
const addCase=(input:Parameters<typeof client.addCase>[1])=>run(()=>client.addCase(props.id,input))
const deleteCase=(caseId:string)=>run(()=>client.deleteCase(props.id,caseId))
</script>
<template><DocscoutPage v-if="snapshot" :snapshot="snapshot" :saving="saving" :error="error" :back="back" @back="emit('back')" @save="save" @add-case="addCase" @delete-case="deleteCase"/><p v-else-if="error" class="error pad-page" role="alert">{{error}}</p><p v-else class="empty pad-page" role="status">Loading Docscout…</p></template>
