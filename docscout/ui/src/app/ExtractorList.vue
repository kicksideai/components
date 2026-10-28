<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {onBeforeUnmount,ref,watch} from 'vue'
import {useHostVisibilityRefresh} from '@wippy-fe/webcomponent-vue'
import {Icon} from '@iconify/vue'
import Button from 'primevue/button'
import {client,type ExtractorItem} from '../client'
import {newConfig} from '../config'
import CreateForm from './CreateForm.vue'
import {when} from '../format'
const emit=defineEmits<{open:[id:string]}>()
const items=ref<ExtractorItem[]>(),nextCursor=ref<string>(),loading=ref(false),error=ref(''),creating=ref(false),saving=ref(false),createError=ref(''),filter=ref('')
let read=0
async function load(cursor?:string){
 const request=++read
 loading.value=true
 try{
  const listed=await client.list({filter:filter.value.trim(),...(cursor?{cursor}:{})})
  if(request!==read)return
  items.value=cursor?[...(items.value??[]),...listed.items]:listed.items
  nextCursor.value=listed.next_cursor;error.value=''
 }catch(e){if(request===read)error.value=e instanceof Error?e.message:String(e)}
 finally{if(request===read)loading.value=false}
}
watch(filter,()=>{items.value=undefined;nextCursor.value=undefined;void load()})
useHostVisibilityRefresh(()=>load())
onBeforeUnmount(()=>{read++})
async function create(input:{title:string;description:string}){
 saving.value=true;createError.value=''
 try{const result=await client.create({...input,config:newConfig()});creating.value=false;emit('open',result.component_id)}
 catch(e){createError.value=e instanceof Error?e.message:String(e)}
 finally{saving.value=false}
}
// Access bits: READ 1, WRITE 2, DELETE 4, ADMIN 8. Admins own or manage the extractor.
function shared(i:ExtractorItem):string{
 const level=i.access_level??15
 if(level&8)return ''
 return level&2?'Shared · can edit':'Shared · can run'
}
</script>
<template>
 <main class="docscout list-page">
  <div class="toolbar">
   <div class="toolbar-title"><h1>Docscout</h1><span v-if="items" class="count">{{items.length}}{{nextCursor?'+':''}}</span></div>
   <div class="toolbar-side"><input v-model="filter" class="filter" type="search" placeholder="Filter extractors" aria-label="Filter extractors"/><Button label="New extractor" size="small" @click="creating=true"/></div>
  </div>
  <div class="page-body">
   <section v-if="creating" class="create-card" aria-label="New extractor">
    <CreateForm :saving="saving" :error="createError" @submit="create"/>
    <button type="button" class="kx-iconbtn kx-focus-outline create-close" aria-label="Cancel" @click="creating=false"><Icon icon="tabler:x"/></button>
   </section>
   <p v-if="error" class="error" role="alert">{{error}}</p>
   <p v-else-if="!items" class="empty" role="status">Loading…</p>
   <div v-else-if="!items.length&&!creating" class="empty-state"><Icon icon="tabler:file-search" class="empty-icon"/><p>{{filter.trim()?'No extractors match.':'Create an extractor to pull typed fields from documents.'}}</p><Button v-if="!filter.trim()" label="New extractor" size="small" @click="creating=true"/></div>
   <div v-else class="cards">
    <button v-for="i in items" :key="i.component_id" type="button" class="card kx-focus-halo" @click="emit('open',i.component_id)">
     <span class="card-icon"><Icon icon="tabler:file-search"/></span>
     <span class="card-main"><span class="card-title-row"><span class="card-title">{{i.meta.title}}</span><span v-if="shared(i)" class="access">{{shared(i)}}</span></span><span v-if="i.meta.description" class="card-desc">{{i.meta.description}}</span><span class="card-meta">{{i.meta.field_count??0}} {{i.meta.field_count==='1'?'field':'fields'}} · updated {{when(i.updated_at)}}<template v-if="shared(i)&&i.meta.owner"> · from {{i.meta.owner}}</template></span></span>
    </button>
    <Button v-if="nextCursor" label="Load more" size="small" severity="secondary" :loading="loading" :disabled="loading" @click="load(nextCursor)"/>
   </div>
  </div>
 </main>
</template>
