<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { moveField } from '../state'
import SelectButton from 'primevue/selectbutton'
import Button from 'primevue/button'
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import type { AspectDecl, AttributeDecl, Declaration, SchemaView } from '../types'
import { humanize, FIELD_WIDTHS as WIDTHS, fieldWidth } from '../forms'

// The builder owns the draft, review and apply. This canvas edits only order and width.
const props = defineProps<{ draft: Declaration; schema: SchemaView }>()
const canEdit = computed(() => props.schema.access.admin)
const aspects = computed<AspectDecl[]>(() => props.draft?.aspects ?? [])

// pluginAspects are contributed by plugins and laid out by their manifests.
const pluginAspects = computed(() => {
  if (!props.schema) return [] as { aspect: string; plugin: string; codes: string[] }[]
  const declared = new Set((props.draft?.aspects ?? []).map((a) => a.namespace))
  const by = new Map<string, { aspect: string; plugin: string; codes: string[] }>()
  for (const [code, a] of Object.entries(props.schema.attributes)) {
    const ns = code.split('.')[0]
    if (declared.has(ns) || !a.plugin) continue
    if (!by.has(ns)) by.set(ns, { aspect: ns, plugin: a.plugin, codes: [] })
    by.get(ns)!.codes.push(code)
  }
  return [...by.values()]
})

function spanOf(ns: string, attr: AttributeDecl): number {
  return WIDTHS.find((w) => w.value === fieldWidth(props.schema, ns, attr))?.span ?? 6
}



// Drag and drop within one aspect; the drop target is the card under the pointer.
const dragging = ref<{ ns: string; index: number } | null>(null)
const over = ref<{ ns: string; index: number } | null>(null)

function dragStart(ns: string, index: number, event: DragEvent) {
  if (!canEdit.value) return
  dragging.value = { ns, index }
  event.dataTransfer?.setData('text/plain', ns + ':' + index)
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
}
function dragOver(ns: string, index: number, event: DragEvent) {
  if (!dragging.value || dragging.value.ns !== ns) return
  event.preventDefault()
  over.value = { ns, index }
}
function drop(aspect: AspectDecl, index: number) {
  if (canEdit.value && dragging.value?.ns === aspect.namespace) moveField(aspect.attributes ?? [], dragging.value.index, index)
  dragging.value = null
  over.value = null
}
function dragEnd() {
  dragging.value = null
  over.value = null
}

function typeName(ns: string, attr: AttributeDecl): string {
  const a = props.schema?.attributes[ns + '.' + attr.code]
  const t = a?.type ?? attr.type
  return t.includes(':') ? t.slice(t.indexOf(':') + 1).replace(/_/g, ' ') : t
}
</script>
<template>
  <div class="pim-table form pim-layout">
    <p v-if="canEdit" class="pim-layout-help muted">Arrange fields within each group and choose their widths. Review changes before applying the layout.</p>
    <div v-if="aspects.length === 0" class="kx-empty">This catalog has no field groups yet.<template v-if="canEdit"> Add a field group in Fields.</template></div>
    <section v-for="aspect in aspects" :key="aspect.namespace" class="pim-aspect">
      <header class="pim-aspect-head"><h3>{{ humanize(aspect.namespace) }}</h3><span v-if="canEdit" class="muted small">drag a field, or use its arrows</span></header>
      <div class="pim-canvas" @dragover.prevent>
        <div
          v-for="(attr, index) in aspect.attributes ?? []"
          :key="attr.code"
          class="pim-lcard"
          :class="{ dragging: dragging?.ns === aspect.namespace && dragging?.index === index, over: over?.ns === aspect.namespace && over?.index === index }"
          :style="{ gridColumn: 'span ' + spanOf(aspect.namespace, attr) }"
          :draggable="canEdit"
          @dragstart="dragStart(aspect.namespace, index, $event)"
          @dragover="dragOver(aspect.namespace, index, $event)"
          @drop.prevent="drop(aspect, index)"
          @dragend="dragEnd"
        >
          <div class="pim-lcard-top">
            <span v-if="canEdit" class="pim-grip" aria-hidden="true"><Icon icon="tabler:grip-vertical" /></span>
            <span class="pim-lcard-name">{{ humanize(attr.code) }}</span>
            <span class="pim-lcard-type">{{ typeName(aspect.namespace, attr) }}</span>
            <span v-if="canEdit" class="pim-lcard-move">
              <Button type="button" :disabled="index === 0" :aria-label="'Move ' + humanize(attr.code) + ' earlier'" @click="moveField(aspect.attributes ?? [], index, index - 1)" class="arrow" text severity="secondary" size="small"><Icon icon="tabler:arrow-left" /></Button>
              <Button type="button" :disabled="index === (aspect.attributes ?? []).length - 1" :aria-label="'Move ' + humanize(attr.code) + ' later'" @click="moveField(aspect.attributes ?? [], index, index + 1)" class="arrow" text severity="secondary" size="small"><Icon icon="tabler:arrow-right" /></Button>
            </span>
          </div>
          <SelectButton :disabled="!canEdit" :model-value="fieldWidth(schema, aspect.namespace, attr)" :options="WIDTHS" option-label="label" option-value="value" :allow-empty="false" :aria-label="'Width of ' + humanize(attr.code)" @update:model-value="attr.width = $event" />
        </div>
      </div>
    </section>
    <section v-for="p in pluginAspects" :key="p.aspect" class="pim-aspect">
      <header class="pim-aspect-head"><h3>{{ humanize(p.aspect) }}</h3><span class="muted small">Provided by a plugin</span></header>
      <div class="pim-canvas">
        <div v-for="code in p.codes" :key="code" class="pim-lcard fixed" :style="{ gridColumn: 'span ' + (WIDTHS.find((w) => w.value === schema!.attributes[code].width)?.span ?? 6) }">
          <div class="pim-lcard-top"><span class="pim-lcard-name">{{ humanize(code) }}</span><span class="pim-lcard-type">{{ schema!.attributes[code].type.replace('kickside.pim.types:', '').replace(/_/g, ' ') }}</span></div>
        </div>
      </div>
    </section>
  </div>
</template>
