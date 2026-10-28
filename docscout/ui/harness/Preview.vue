<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {ref} from 'vue'
import DocscoutPage from '../src/app/DocscoutPage.vue'
import CreateForm from '../src/app/CreateForm.vue'
import type {Snapshot} from '../src/models'
import {snapshot,result,evaluations,evaluation} from './fixtures'
const params=new URLSearchParams(location.search)
const create=params.get('view')==='create',empty=params.get('state')==='empty'
const initial=structuredClone(snapshot)
if(empty&&initial.can_edit){initial.cases=[];initial.runs=[];initial.config.fields=[];initial.field_count=0}
const data=ref<Snapshot>(params.get('access')==='read'?{id:initial.id,title:initial.title,description:initial.description,field_count:initial.field_count,status:initial.status,retention:initial.retention,runs:initial.runs,can_edit:false}:initial)
</script>
<template><CreateForm v-if="create"/><DocscoutPage v-else :snapshot="data" :result="empty?null:result" :evaluations="empty?[]:evaluations" :evaluation="empty?undefined:evaluation"/></template>
