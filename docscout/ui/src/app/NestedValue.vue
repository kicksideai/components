<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed} from 'vue'
import type {ValueSchema} from '../models'
import {getValue} from '../config'
const props=defineProps<{value:unknown;schema?:ValueSchema}>()
const object=computed(()=>props.value!==null&&typeof props.value==='object'&&!Array.isArray(props.value)?props.value as Record<string,unknown>:null)
const keys=computed(()=>[...new Set([...Object.keys(props.schema?.properties??{}),...Object.keys(object.value??{})])])
function canBeAbsent(schema?:ValueSchema):boolean{
 if(!schema)return false
 if(Array.isArray(schema.type)&&schema.type.includes('null'))return true
 const members=Object.values(schema.properties??{})
 if(members.length)return members.every(canBeAbsent)
 return !!schema.items&&canBeAbsent(schema.items)
}
const absentLabel=computed(()=>canBeAbsent(props.schema)?'Missing':'—')
</script>
<template>
 <div class="nested-value">
  <ol v-if="Array.isArray(value)"><li v-for="(item,i) in value" :key="i"><NestedValue :value="item" :schema="schema?.items"/></li><li v-if="!value.length" class="muted">Empty list</li></ol>
  <dl v-else-if="object"><template v-for="key in keys" :key="key"><dt>{{key}}</dt><dd><NestedValue :value="getValue(object,key)" :schema="schema?.properties?.[key]"/></dd></template></dl>
  <span v-else>{{value===null||value===undefined?absentLabel:String(value)}}</span>
 </div>
</template>
