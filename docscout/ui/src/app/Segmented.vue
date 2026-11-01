<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts" generic="T extends string">
import {Icon} from '@iconify/vue'
import {ref} from 'vue'
const props=defineProps<{options:readonly {value:T;label:string;icon?:string}[];labelledBy:string;disabled?:boolean;name?:string}>()
const model=defineModel<T>({required:true})
const buttons=ref<HTMLButtonElement[]>([])
// Radio-group keyboard pattern: arrows, Home and End move and select; the checked option holds focus.
function move(event:KeyboardEvent,index:number){
 const last=props.options.length-1
 const next={ArrowRight:index+1,ArrowDown:index+1,ArrowLeft:index-1,ArrowUp:index-1,Home:0,End:last}[event.key]
 if(next===undefined)return
 event.preventDefault()
 const target=(next+props.options.length)%props.options.length
 model.value=props.options[target].value
 buttons.value[target]?.focus()
}
</script>
<template>
 <div class="segmented" role="radiogroup" :aria-labelledby="labelledBy">
  <button v-for="(o,i) in options" :key="o.value" ref="buttons" type="button" class="kx-btn kx-btn-ghost kx-focus-halo" role="radio" :aria-label="name?`${name}: ${o.label}`:undefined" :aria-checked="model===o.value" :tabindex="model===o.value?0:-1" :disabled="disabled" @click="model=o.value" @keydown="move($event,i)"><Icon v-if="o.icon" :icon="o.icon" aria-hidden="true"/><span>{{o.label}}</span></button>
 </div>
</template>
