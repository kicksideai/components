<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
defineProps<{label:string;disabled?:boolean}>()
const model=defineModel<boolean>({required:true})
</script>
<template>
 <button type="button" role="switch" class="switch" :aria-checked="model" :aria-label="label" :disabled="disabled" @click.stop="model=!model"><span/></button>
</template>
