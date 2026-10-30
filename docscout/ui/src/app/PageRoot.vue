<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed,ref,watch} from 'vue'
import {useProps,useEvents} from '@wippy-fe/webcomponent-vue'
import ExtractorList from './ExtractorList.vue'
import Extractor from './Extractor.vue'
const props=useProps<{route?:string}>()
const emit=useEvents<{navigate:string}>()
const current=ref('')
watch(()=>props.value.route,r=>{current.value=(r??'').split('/')[0]},{immediate:true})
function go(sub:string){current.value=sub;emit('navigate',sub)}
const id=computed(()=>current.value)
</script>
<template><Extractor v-if="id" :id="id" back @back="go('')"/><ExtractorList v-else @open="go"/></template>
