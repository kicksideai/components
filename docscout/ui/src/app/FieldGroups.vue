<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {ref,useId} from 'vue'
import {Icon} from '@iconify/vue'
import type {GroupNode} from '../config'
defineProps<{node:GroupNode}>()
defineSlots<{default(props:{index:number}):unknown;header(props:{path:string;label:string;count:number;first:boolean;last:boolean}):unknown}>()
const collapsed=ref(new Set<string>()),id=useId()
function toggle(path:string){if(collapsed.value.has(path))collapsed.value.delete(path);else collapsed.value.add(path)}
const count=(node:GroupNode):number=>node.indices.length+node.children.reduce((sum,child)=>sum+count(child),0)
</script>
<template>
 <div class="field-groups">
  <ul v-if="node.indices.length" class="rows"><li v-for="index in node.indices" :key="index"><slot :index="index"/></li></ul>
  <section v-for="(child,i) in node.children" :key="child.path" class="field-group" :aria-label="`Group ${child.path}`">
   <header class="field-group-head">
    <button type="button" class="tree-toggle kx-iconbtn kx-focus-outline" :aria-label="`${collapsed.has(child.path)?'Expand':'Collapse'} group ${child.path}`" :aria-expanded="!collapsed.has(child.path)" :aria-controls="`${id}-${child.path}`" @click="toggle(child.path)"><Icon :icon="collapsed.has(child.path)?'tabler:chevron-right':'tabler:chevron-down'"/></button>
    <slot name="header" :path="child.path" :label="child.name" :count="count(child)" :first="i===0" :last="i===node.children.length-1"><span class="group-title">{{child.name}}</span></slot>
   </header>
   <div v-show="!collapsed.has(child.path)" :id="`${id}-${child.path}`" class="group-content"><FieldGroups :node="child"><template #default="scope"><slot v-bind="scope"/></template><template #header="scope"><slot name="header" v-bind="scope"><span class="group-title">{{scope.label}}</span></slot></template></FieldGroups></div>
  </section>
 </div>
</template>
