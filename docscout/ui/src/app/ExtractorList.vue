<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed,onMounted,ref} from 'vue'
import {Icon} from '@iconify/vue'
import Button from 'primevue/button'
import {client,type ExtractorItem} from '../client'
import {newConfig} from '../config'
import CreateForm from './CreateForm.vue'
const emit=defineEmits<{open:[id:string]}>()
const items=ref<ExtractorItem[]>(),error=ref(''),creating=ref(false),saving=ref(false),createError=ref(''),filter=ref('')
async function load(){try{items.value=await client.list();error.value=''}catch(e){error.value=e instanceof Error?e.message:String(e)}}
onMounted(load)
const shown=computed(()=>{const q=filter.value.trim().toLowerCase();return (items.value??[]).filter(i=>!q||i.meta.title.toLowerCase().includes(q)||(i.meta.description??'').toLowerCase().includes(q))})
async function create(input:{title:string;description:string}){
 saving.value=true;createError.value=''
 try{const result=await client.create({...input,config:newConfig()});creating.value=false;emit('open',result.component_id)}
 catch(e){createError.value=e instanceof Error?e.message:String(e)}
 finally{saving.value=false}
}
const updated=(at:string)=>new Date(at).toLocaleDateString(undefined,{month:'short',day:'numeric'})
</script>
<template>
 <main class="docscout list-page">
  <div class="toolbar">
   <div class="toolbar-title"><h1>Docscout</h1><span v-if="items" class="count">{{items.length}}</span></div>
   <div class="toolbar-side"><input v-if="items?.length" v-model="filter" class="filter" type="search" placeholder="Filter extractors" aria-label="Filter extractors"/><Button label="New extractor" size="small" @click="creating=true"/></div>
  </div>
  <div class="page-body">
   <section v-if="creating" class="create-card" aria-label="New extractor">
    <CreateForm :saving="saving" :error="createError" @submit="create"/>
    <button type="button" class="icon-btn create-close" aria-label="Cancel" @click="creating=false"><Icon icon="tabler:x"/></button>
   </section>
   <p v-if="error" class="error" role="alert">{{error}}</p>
   <p v-else-if="!items" class="empty" role="status">Loading…</p>
   <div v-else-if="!items.length&&!creating" class="empty-state"><Icon icon="tabler:file-search" class="empty-icon"/><p>Create an extractor to pull typed fields from documents.</p><Button label="New extractor" size="small" @click="creating=true"/></div>
   <div v-else class="cards">
    <button v-for="i in shown" :key="i.component_id" type="button" class="card" @click="emit('open',i.component_id)">
     <span class="card-icon"><Icon icon="tabler:file-search"/></span>
     <span class="card-main"><span class="card-title">{{i.meta.title}}</span><span v-if="i.meta.description" class="card-desc">{{i.meta.description}}</span><span class="card-meta">{{i.meta.field_count??0}} {{i.meta.field_count==='1'?'field':'fields'}} · updated {{updated(i.updated_at)}}</span></span>
    </button>
    <p v-if="items.length&&!shown.length" class="empty">No extractors match.</p>
   </div>
  </div>
 </main>
</template>
