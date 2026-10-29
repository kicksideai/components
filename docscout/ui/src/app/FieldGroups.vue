<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import type {GroupNode} from '../config'
defineProps<{node:GroupNode}>()
defineSlots<{default(props:{index:number}):unknown;header(props:{path:string}):unknown}>()
</script>
<template>
 <ul v-if="node.indices.length" class="rows"><li v-for="index in node.indices" :key="index"><slot :index="index"/></li></ul>
 <details v-for="child in node.children" :key="child.path" class="field-group" open>
  <summary>{{child.name}}</summary>
  <div class="group-content"><slot name="header" :path="child.path"/><FieldGroups :node="child"><template #default="scope"><slot v-bind="scope"/></template><template #header="scope"><slot name="header" v-bind="scope"/></template></FieldGroups></div>
 </details>
</template>
