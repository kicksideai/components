<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {ref} from 'vue'
import DocscoutPage from '../src/app/DocscoutPage.vue'
import CreateForm from '../src/app/CreateForm.vue'
import type {Snapshot} from '../src/models'
import {scenario} from './scenarios'
const params=new URLSearchParams(location.search)
const create=params.get('view')==='create',empty=params.get('state')==='empty'
const {data:initial,run:result,history:evaluations,current:evaluation}=scenario(params.get('state'))
if(empty&&initial.can_edit){initial.cases=[];initial.runs=[];initial.config.fields=[];initial.field_count=0}
const data=ref<Snapshot>(params.get('access')==='read'?{id:initial.id,title:initial.title,description:initial.description,field_count:initial.field_count,status:initial.status,retention:initial.retention,runs:initial.runs,can_edit:false,can_share:false}:initial)
</script>
<template><CreateForm v-if="create"/><DocscoutPage v-else :snapshot="data" :result="empty?null:result" :evaluations="empty?[]:evaluations" :evaluation="empty?undefined:evaluation"/></template>
