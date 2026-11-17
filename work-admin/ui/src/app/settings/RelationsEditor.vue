<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import DefinitionRow from './DefinitionRow.vue'
import DefinitionList from './DefinitionList.vue'
import Checkbox from 'primevue/checkbox'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import type { Declaration } from '../../types'
import { humanize } from '../../forms'
import { removeEntry, type RemovalGuard } from './model'
const props = defineProps<{ draft: Declaration; guardRemoval?: RemovalGuard }>()
const relations = computed(() => props.draft.relation_types ?? [])
const id = ref(''), error = ref(''), busy = ref(false)
const valid = computed(() => /^[a-z][a-z0-9_]*$/.test(id.value) && !relations.value.some(r => r.id === id.value))
function add() { if (!valid.value) return; (props.draft.relation_types ??= []).push({ id: id.value, outward: humanize(id.value).toLowerCase(), inward: humanize(id.value).toLowerCase(), cardinality: 'many' }); id.value = '' }
async function remove(id: string) {
  if (busy.value) return
  busy.value = true; error.value = ''
  try { const refusal = await props.guardRemoval?.('relation_types', id); if (refusal) error.value = refusal; else removeEntry(props.draft, 'relation_types', id) }
  finally { busy.value = false }
}
</script>
<template>
  <section
    class="work-stack"
    aria-label="Relation types editor"
  >
    <header class="work-section-heading">
      <div>
        <h2>Relation types</h2>
        <p class="work-muted work-small">Give each direction a clear label. A used relation keeps its identity and
          shape.</p>
      </div>
      <Tag class="kx-tag-sm" severity="secondary">{{ relations.length }} {{ relations.length === 1 ? 'relation' : 'relations' }}</Tag>
    </header>
    <p
      v-if="error"
      class="kx-err"
      role="alert"
    >{{ error }}</p>
    <DefinitionList columns="relations" :count="relations.length">
    <DefinitionRow :title="humanize(relation.id)" :code="relation.id" :kind="relation.symmetric ? 'Same both ways' : 'Different each way'"
      v-for="(relation, index) in relations"
      :key="index"
      class="work-stack"
    >
      <template #usage><span class="work-definition-meta work-muted work-small">{{ relation.outward || 'Related work' }} · {{ relation.inward || 'Reverse relation' }}</span></template><template #actions>
        <Button

          severity="secondary"
          text
          :disabled="busy"
          @click="remove(relation.id)" aria-label="Remove relation" size="small"><Icon icon="tabler:trash" aria-hidden="true" /></Button>
      </template>
      <div class="work-settings-grid">
        <label class="work-stack work-tight">Identifier
          <InputText
            v-model="relation.id"
            required
            pattern="[a-z][a-z0-9_]*"
            aria-label="Relation ID"
          />
        </label>
        <label class="work-stack work-tight">Outward label
          <InputText
            v-model="relation.outward"
            aria-label="Outward label"
          />
        </label>
        <label class="work-stack work-tight">Inward label
          <InputText
            v-model="relation.inward"
            aria-label="Inward label"
          />
        </label>
        <label class="work-stack work-tight">Links allowed
          <Select
            :model-value="relation.cardinality ?? 'many'" @update:model-value="relation.cardinality = $event"

            aria-label="Links allowed"
           appendTo="self" optionLabel="label" optionValue="value" optionDisabled="disabled" :options="[{ label: 'One link', value: 'one', disabled: false }, { label: 'Many links', value: 'many', disabled: false }]" />
        </label>
        <label class="work-row">
          <Checkbox
            v-model="relation.symmetric"
            aria-label="Same meaning in both directions" binary />Same meaning in both directions
        </label>
      </div>
      <p class="work-relation-preview work-small">
        <strong>This item</strong> {{ relation.outward || 'relates to' }}
        <strong>another item</strong>
        <span class="work-muted"> · reverse: {{ relation.symmetric ? relation.outward : relation.inward }}</span>
      </p>
    </DefinitionRow>
    <p
      v-if="!relations.length"
      class="kx-empty"
    >No relation types yet. Add one to link related work.</p>
    <div class="work-row work-add-definition">
      <label class="work-stack work-tight">New relation ID
        <InputText
          v-model="id"
          placeholder="related_to"
          @keydown.enter.prevent="add"
        />
      </label>
      <Button
        label="Add relation"
        severity="secondary"
        :disabled="!valid"
        @click="add" outlined><template #icon><Icon icon="tabler:plus" aria-hidden="true" /></template></Button>
    </div>
    </DefinitionList>
  </section>
</template>
