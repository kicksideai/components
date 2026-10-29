<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed} from 'vue'
const props=defineProps<{value:unknown}>()
const object=computed(()=>props.value!==null&&typeof props.value==='object'&&!Array.isArray(props.value)?props.value as Record<string,unknown>:null)
</script>
<template>
 <div class="nested-value">
  <ol v-if="Array.isArray(value)"><li v-for="(item,i) in value" :key="i"><NestedValue :value="item"/></li><li v-if="!value.length" class="muted">Empty list</li></ol>
  <dl v-else-if="object"><template v-for="(item,key) in object" :key="key"><dt>{{key}}</dt><dd><NestedValue :value="item"/></dd></template></dl>
  <span v-else>{{value===null||value===undefined?'—':String(value)}}</span>
 </div>
</template>
