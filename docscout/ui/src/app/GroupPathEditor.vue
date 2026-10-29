<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {onMounted,ref,useId} from 'vue'
import {Icon} from '@iconify/vue'
import {groupPattern} from '../config'
const props=withDefaults(defineProps<{initialValue?:string;inputLabel:string;saveLabel:string;cancelLabel:string;maxLength?:number}>(),{initialValue:'',maxLength:320})
const emit=defineEmits<{save:[path:string];cancel:[]}>()
const draft=ref(props.initialValue),error=ref(''),input=ref<HTMLInputElement>(),errorId=useId()
onMounted(()=>{input.value!.focus();input.value!.select()})
function save(){
 const path=draft.value.trim()
 if(!path||!groupPattern.test(path)){error.value='Use a dotted path of snake_case group names.';return}
 if(path.length>props.maxLength){error.value='The group and its nested paths must fit within 320 characters.';return}
 emit('save',path)
}
</script>
<template>
 <form class="group-path-editor" @submit.prevent="save">
  <input ref="input" v-model="draft" :aria-label="inputLabel" :maxlength="maxLength" :aria-invalid="!!error" :aria-describedby="error?errorId:undefined" aria-required="true" autocomplete="off" spellcheck="false" placeholder="parties.borrower" @keydown.enter.prevent="save" @keydown.esc.stop.prevent="emit('cancel')"/>
  <button type="submit" class="kx-iconbtn kx-focus-outline" :aria-label="saveLabel" :title="saveLabel"><Icon icon="tabler:check"/></button>
  <button type="button" class="kx-iconbtn kx-focus-outline" :aria-label="cancelLabel" :title="cancelLabel" @click="emit('cancel')"><Icon icon="tabler:x"/></button>
  <p v-if="error" :id="errorId" class="field-error" role="alert">{{error}}</p>
 </form>
</template>
