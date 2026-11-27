<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { MergeView } from '@codemirror/merge'
import { baseExtensions } from './codemirror'

// Read-only side-by-side comparison: the earlier source on the left, the newer on the right.
const props = defineProps<{ before: string; after: string; beforeLabel: string; afterLabel: string }>()
const host = ref<HTMLElement>()
let view: MergeView | undefined

onMounted(() => {
  const parent = host.value
  if (!parent) return
  view = new MergeView({
    root: parent.getRootNode() as Document | ShadowRoot,
    parent,
    a: { doc: props.before, extensions: baseExtensions(props.beforeLabel, true) },
    b: { doc: props.after, extensions: baseExtensions(props.afterLabel, true) },
    collapseUnchanged: { margin: 3, minSize: 6 },
    gutter: true,
  })
})
onBeforeUnmount(() => view?.destroy())
</script>

<template>
  <div class="mail-diff">
    <div class="mail-diff-labels" aria-hidden="true"><span>{{ beforeLabel }}</span><span>{{ afterLabel }}</span></div>
    <div ref="host" class="mail-diff-view" />
  </div>
</template>
