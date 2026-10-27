<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed} from 'vue'
import {useProps} from '@wippy-fe/webcomponent-vue'
import Extractor from './Extractor.vue'
const props=useProps<{entryId?:string}>()
const id=computed(()=>props.value.entryId??'')
</script>
<template><Extractor :id="id"/></template>
