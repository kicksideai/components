<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {ref} from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import {isOn,modelLabel,newConfig,stageLabels,type StageKey} from '../config'
const defaults=newConfig()
const steps=(Object.keys(stageLabels) as StageKey[]).filter(k=>isOn(defaults,k)).map(k=>stageLabels[k]).join(', ')
const extraction=modelLabel(defaults.stages.extract.model)
const search=defaults.retrieval.search_mode.replace(/^\w/,c=>c.toUpperCase())
const props=defineProps<{saving?:boolean;error?:string;inPopup?:boolean}>()
const emit=defineEmits<{submit:[input:{title:string;description:string}]}>()
const title=ref(''),description=ref(''),validation=ref('')
function submit(){if(props.saving)return;if(!title.value.trim()){validation.value='Name is required.';return}validation.value='';emit('submit',{title:title.value.trim(),description:description.value.trim()})}
defineExpose({submit})
</script>
<template><form class="create-pane" @submit.prevent="submit"><header><h2>New extractor</h2></header><label>Name<InputText v-model="title" autofocus placeholder="Invoice reader" maxlength="200"/></label><label>Description<Textarea v-model="description" rows="3" placeholder="Optional" maxlength="4000"/></label><div class="create-summary"><h2>Configuration</h2><dl><dt>Fields</dt><dd>None</dd><dt>Reading steps</dt><dd>{{steps}}</dd><dt>Extraction model</dt><dd>{{extraction}}</dd><dt>Search</dt><dd>{{search}}</dd></dl></div><p v-if="error||validation" role="alert" class="error">{{error||validation}}</p><footer v-if="!inPopup" class="row"><Button label="Create extractor" type="submit" :loading="saving" :disabled="!title.trim()"/></footer></form></template>
