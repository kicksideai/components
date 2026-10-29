<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed,nextTick,ref,useId} from 'vue'
import {Icon} from '@iconify/vue'
import Menu from 'primevue/menu'
import GroupPathEditor from './GroupPathEditor.vue'
const props=defineProps<{path:string;name:string;count:number;first:boolean;last:boolean;maxLength:number;canAdd:boolean;readonly?:boolean}>()
const emit=defineEmits<{rename:[path:string];add:[];reorder:[delta:number];remove:[]}>()
const editing=ref(false),menuOpen=ref(false)
const heading=ref<HTMLElement>(),renameButton=ref<HTMLButtonElement>(),menu=ref<InstanceType<typeof Menu>>()
const menuId=useId()
const actions=computed(()=>[
 {label:'Move up',disabled:props.first,command:()=>emit('reorder',-1)},
 {label:'Move down',disabled:props.last,command:()=>emit('reorder',1)},
 {separator:true},
 {label:'Delete group and its fields',command:()=>emit('remove')},
])
function edit(){editing.value=true}
async function cancel(){editing.value=false;await nextTick();renameButton.value!.focus()}
async function save(path:string){
 const tree=heading.value!.closest('.field-tree')!
 editing.value=false;emit('rename',path)
 await nextTick();tree.querySelector<HTMLButtonElement>(`[data-group-rename="${path}"]`)!.focus()
}
</script>
<template>
 <div ref="heading" class="group-heading">
  <GroupPathEditor v-if="editing" :initial-value="path" :input-label="`Group path for ${path}`" save-label="Save group name" cancel-label="Cancel group rename" :max-length="maxLength" @save="save" @cancel="cancel"/>
  <template v-else>
   <span v-if="readonly" class="group-title" :title="path">{{name}}</span>
   <button v-else ref="renameButton" type="button" class="group-title group-name-button kx-btn kx-btn-ghost kx-focus-halo" :aria-label="`Rename group ${path}`" :data-group-rename="path" :title="path" @click="edit"><span>{{name}}</span><Icon icon="tabler:pencil" aria-hidden="true"/></button>
   <span class="count group-count" :aria-label="`${count} fields`">{{count}}</span>
   <div v-if="!readonly" class="group-actions">
    <button type="button" class="kx-iconbtn kx-focus-outline" :aria-label="`Add field to ${path}`" :disabled="!canAdd" title="Add field" @click="emit('add')"><Icon icon="tabler:plus"/></button>
    <button type="button" class="kx-iconbtn kx-focus-outline" :aria-label="`Actions for group ${path}`" aria-haspopup="menu" :aria-expanded="menuOpen" :aria-controls="menuId" @click="menu!.toggle($event)"><Icon icon="tabler:dots"/></button>
    <Menu :id="menuId" ref="menu" :model="actions" popup append-to="self" @show="menuOpen=true" @hide="menuOpen=false"/>
   </div>
  </template>
 </div>
</template>
