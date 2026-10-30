<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {onMounted,ref} from 'vue'
import {loadByTagName} from '@wippy-fe/proxy'
defineProps<{value?:string;readonly?:boolean}>()
const emit=defineEmits<{select:[id:string]}>()
const ready=ref(!!customElements.get('wc-agent-picker')),error=ref('')
onMounted(async()=>{
 if(ready.value)return
 try{await loadByTagName('wc-agent-picker',{timeoutMs:8000});ready.value=true}
 catch(err){error.value=err instanceof Error?err.message:String(err)}
})
function change(event:Event){
 if(event.composedPath()[0]!==event.currentTarget)return
 const detail=(event as CustomEvent<{agent_id:string}>).detail
 emit('select',detail.agent_id)
}
</script>
<template>
 <div class="label-block"><span>Scout agent</span>
  <p v-if="readonly" class="muted">{{value||'Built-in scout'}}</p>
  <wc-agent-picker v-else-if="ready" :config="JSON.stringify({agent_id:value||''})" aria-label="Scout agent" placeholder="Choose your agent…" @change="change"/>
  <p v-else-if="error" class="field-error" role="alert">Could not load agent picker: {{error}}</p>
  <span v-else role="status" class="muted">Loading agents…</span>
  <small>Leave empty to use the built-in scout.</small>
 </div>
</template>
