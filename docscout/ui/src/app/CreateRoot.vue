<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed,ref,watch} from 'vue'
import {useProps,useEvents} from '@wippy-fe/webcomponent-vue'
import {client} from '../client'
import {newConfig} from '../config'
import CreateForm from './CreateForm.vue'
const props=useProps<{parentId?:string;submitNonce?:string}>()
const emit=useEvents<{created:{id:string};close:Record<string,never>;'submit-state':{saving:boolean};error:{message:string;error:unknown}}>()
const saving=ref(false),error=ref(''),form=ref<InstanceType<typeof CreateForm>>()
const parentId=computed(()=>props.value.parentId)
watch(saving,s=>emit('submit-state',{saving:s}))
watch(()=>props.value.submitNonce,(v,old)=>{if(v&&v!==old)form.value?.submit()})
async function create(input:{title:string;description:string}){
 saving.value=true;error.value=''
 try{const result=await client.create({...input,config:newConfig(),...(parentId.value?{parent_id:parentId.value}:{})});emit('created',{id:result.component_id})}
 catch(e){error.value=e instanceof Error?e.message:String(e);emit('error',{message:error.value,error:e})}
 finally{saving.value=false}
}
</script>
<template><CreateForm ref="form" :saving="saving" :error="error" :in-popup="!!parentId" @submit="create"/></template>
