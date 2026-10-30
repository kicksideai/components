<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {onMounted,ref} from 'vue'
import {loadByTagName} from '@wippy-fe/proxy'
// The platform share popup, mounted by tag; it owns its own modal chrome.
const props=defineProps<{id:string;title:string}>()
const emit=defineEmits<{close:[]}>()
const host=ref<HTMLElement>(),error=ref('')
onMounted(async()=>{
 try{await loadByTagName('kickside-share',{timeoutMs:8000})}catch(e){error.value=`Sharing is unavailable: ${e instanceof Error?e.message:String(e)}`;return}
 const el=document.createElement('kickside-share')
 const id=encodeURIComponent(props.id)
 el.setAttribute('config',JSON.stringify({resource_id:props.id,title:props.title,access_url:`/api/v1/component-access/grants/${id}`,share_url:`/api/v1/component-access/share/${id}`}))
 el.style.display='block'
 el.addEventListener('close',()=>emit('close'))
 host.value?.appendChild(el)
})
</script>
<template><div ref="host"><p v-if="error" role="alert" class="error banner">{{error}}</p></div></template>
