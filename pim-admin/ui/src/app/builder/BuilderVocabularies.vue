<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Message from 'primevue/message'
import { CODE } from '../../state'
import DefinitionList from '../../shared/DefinitionList.vue'
import DefinitionRow from '../../shared/DefinitionRow.vue'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import ToggleSwitch from 'primevue/toggleswitch'
import { termLabel as label } from '../../forms'
// Vocabularies and their terms. Vocabularies are schema; terms are catalog
// data written at once through apply, so they are not part of the review.
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { host } from '@wippy-fe/proxy'
import { pim } from '../../api'
import type { ApplyItem, Declaration, RemoveDecl, SchemaView, TermRow, VocabularyDecl } from '../../types'
import { humanize } from '../../forms'

const props = defineProps<{ catalogId: string; draft: Declaration; schema: SchemaView }>()
const emit = defineEmits<{ remove: [kind: keyof RemoveDecl, id: string] }>()
// Mirrors pim/src/command/terms.lua, including its strict end and 128-byte limit.
const TERM_CODE = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}(?![\s\S])/
const canWrite = computed(() => props.schema.access.write)
const vocabs = computed(() => props.draft.vocabularies ?? [])
const newCode = ref('')
function add() {
  const code = newCode.value.trim()
  if (!CODE.test(code) || vocabs.value.some((v) => v.code === code)) return
  (props.draft.vocabularies ??= []).push({ code })
  newCode.value = ''
}
function remove(v: VocabularyDecl) {
  vocabs.value.splice(vocabs.value.indexOf(v), 1)
  if (props.schema.declaration.vocabularies?.some((x) => x.code === v.code)) emit('remove', 'vocabularies', v.code)
}
function declared(code: string): boolean {
  return !!props.schema.vocabularies[code]
}

// terms per vocabulary, loaded when its panel opens
const open = ref<Record<string, boolean>>({})
const terms = ref<Record<string, TermRow[]>>({})
const cursors = ref<Record<string, string | undefined>>({})
const pages = ref<Record<string, string | undefined>>({})
const busy = ref<Record<string, boolean>>({})
const error = ref<Record<string, string>>({})
const term = ref<Record<string, { code: string; label: string; parent: string }>>({})
async function loadTerms(code: string, after?: string) {
  busy.value[code] = true
  error.value[code] = ''
  try { const page = await pim.termsPage(props.catalogId, code, after); terms.value[code] = page.terms; pages.value[code] = after; cursors.value[code] = page.next } catch (e) { error.value[code] = e instanceof Error ? e.message : 'Could not load terms.' } finally { busy.value[code] = false }
}
function toggle(code: string) {
  open.value[code] = !open.value[code]
  if (open.value[code] && !terms.value[code]) void loadTerms(code)
}
function form(code: string) {
  return term.value[code] ?? (term.value[code] = { code: '', label: '', parent: '' })
}
async function addTerm(v: VocabularyDecl) {
  const f = form(v.code)
  if (!canWrite.value || !TERM_CODE.test(f.code)) return
  busy.value[v.code] = true
  error.value[v.code] = ''
  try {
    const item: ApplyItem = { term: { vocabulary: v.code, code: f.code }, labels: { en: f.label || humanize(f.code) } }
    if (v.hierarchical && f.parent) item.parent = f.parent
    const out = await pim.apply(props.catalogId, [item])
    const o = out.outcomes[0]
    if (o.outcome !== 'created' && o.outcome !== 'updated') throw new Error(o.findings?.[0]?.message ?? 'The term was not accepted.')
    term.value[v.code] = { code: '', label: '', parent: '' }
    pim.invalidateTerms(props.catalogId)
    await loadTerms(v.code, pages.value[v.code])
  } catch (e) { error.value[v.code] = e instanceof Error ? e.message : 'Could not add the term.' } finally { busy.value[v.code] = false }
}
async function retire(v: VocabularyDecl, t: TermRow, retired: boolean) {
  if (!canWrite.value) return
  if (retired && !await host.confirm({ header: 'Retire term?', message: `Retire ${label(t)}? Term changes save immediately. You can restore this term later.`, acceptLabel: 'Retire', rejectLabel: 'Cancel' })) return
  busy.value[v.code] = true
  error.value[v.code] = ''
  try {
    const out = await pim.apply(props.catalogId, [{ term: { vocabulary: v.code, code: t.code }, retired }])
    const outcome = out.outcomes[0]
    if (!outcome || !['updated', 'unchanged'].includes(outcome.outcome)) throw new Error(outcome?.findings?.map(f => f.message ?? f.code).join('; ') || 'The term change was not accepted.')
    pim.invalidateTerms(props.catalogId)
    await loadTerms(v.code, pages.value[v.code])
  } catch (e) { error.value[v.code] = e instanceof Error ? e.message : 'Could not change the term.' } finally { busy.value[v.code] = false }
}
</script>

<template>
  <DefinitionList :count="vocabs.length" :columns="['code', 'details']">
    <DefinitionRow :title="humanize(v.code)" :code="v.code" v-for="v in vocabs" :key="v.code">
      <template #details><span class="muted small">{{ v.hierarchical ? 'Hierarchical' : 'Flat' }}</span></template>
      <template #actions><Button type="button" :aria-label="'Remove ' + humanize(v.code)" @click="remove(v)" text severity="secondary" size="small"><Icon icon="tabler:trash" /></Button></template>
      <div class="pim-aspect">
        <label class="row small"><ToggleSwitch :aria-label="'Hierarchical ' + v.code" :model-value="v.hierarchical === true" @update:model-value="$event ? (v.hierarchical = true) : delete v.hierarchical" /><span>Hierarchical</span></label>
        <Button v-if="declared(v.code)" type="button" @click="toggle(v.code)" severity="secondary" outlined size="small"><Icon icon="tabler:adjustments" aria-hidden="true" /> {{ open[v.code] ? 'Hide terms' : 'Terms' }}</Button>
        <span v-else class="muted small">Apply the schema before adding terms.</span>
        <div v-if="open[v.code]" class="pim-stack tight pim-terms">
          <p class="muted small">Term changes save immediately.</p>
          <Message v-if="error[v.code]" severity="error" role="alert">{{ error[v.code] }} <Button type="button" :disabled="busy[v.code]" @click="loadTerms(v.code, pages[v.code])" severity="secondary" outlined size="small">Retry</Button></Message>
          <div v-if="(terms[v.code] ?? []).length" class="pim-responsive-table">
            <table class="pim-grid compact" aria-label="Vocabulary terms">
              <thead><tr><th>Code</th><th>Label</th><th v-if="v.hierarchical">Parent</th><th></th></tr></thead>
              <tbody><tr v-for="t in terms[v.code]" :key="t.code" :class="{ muted: t.retired }">
                <td class="mono">{{ t.code }}</td><td>{{ label(t) }}</td><td v-if="v.hierarchical" class="mono muted">{{ t.parent ?? '' }}</td>
                <td class="num"><Button type="button" :disabled="!canWrite || busy[v.code]" @click="retire(v, t, !t.retired)" text severity="secondary" size="small">{{ t.retired ? 'Restore' : 'Retire' }}</Button></td>
              </tr></tbody>
            </table>
            <ul role="list" class="pim-stacked-list" aria-label="Vocabulary terms">
              <li v-for="t in terms[v.code]" :key="t.code" class="pim-stacked-row" :class="{ muted: t.retired }">
                <div>{{ label(t) }}</div>
                <div class="pim-stacked-meta muted small"><span class="mono">{{ t.code }}</span><span v-if="v.hierarchical && t.parent">Parent: {{ t.parent }}</span></div>
                <Button type="button" :disabled="!canWrite || busy[v.code]" @click="retire(v, t, !t.retired)" text severity="secondary" size="small">{{ t.retired ? 'Restore' : 'Retire' }}</Button>
              </li>
            </ul>
          </div>
          <p v-else-if="!busy[v.code]" class="muted small">No terms yet.</p>
          <div class="row wrap">
            <Button type="button" :disabled="busy[v.code] || !pages[v.code]" @click="loadTerms(v.code)" severity="secondary" outlined size="small"><Icon icon="tabler:chevrons-left" aria-hidden="true" /> First terms</Button>
            <Button type="button" :disabled="busy[v.code] || !cursors[v.code]" @click="loadTerms(v.code, cursors[v.code])" severity="secondary" outlined size="small"><Icon icon="tabler:chevron-right" aria-hidden="true" /> Next terms</Button>
          </div>
          <div class="row wrap pim-add-row">
            <InputText v-model="form(v.code).code" :disabled="!canWrite || busy[v.code]" type="text" placeholder="code" class="mono narrow" />
            <InputText v-model="form(v.code).label" :disabled="!canWrite || busy[v.code]" type="text" placeholder="Label (en)" />
            <Select v-if="v.hierarchical" v-model="form(v.code).parent" :disabled="!canWrite || busy[v.code]" class="narrow" :options="[{ value: '', label: 'No parent' }, ...(terms[v.code] ?? []).map((t) => ({ value: t.code, label: String(label(t)) }))]" option-label="label" option-value="value" appendTo="self" />
            <Button type="button" :disabled="!canWrite || busy[v.code] || !TERM_CODE.test(form(v.code).code)" @click="addTerm(v)" severity="secondary" outlined size="small"><Icon icon="tabler:plus" aria-hidden="true" /> Add term</Button>
          </div>
        </div>
      </div>
    </DefinitionRow>
    <template #add>
    <div class="row pim-add-row">
      <InputText v-model="newCode" type="text" placeholder="new_vocabulary" @keydown.enter.prevent="add" class="mono" />
      <Button type="button" :disabled="!CODE.test(newCode)" @click="add" severity="secondary" outlined size="small"><Icon icon="tabler:plus" aria-hidden="true" /> Add vocabulary</Button>
      <span class="muted small">Select fields pick their values from a vocabulary's terms.</span>
    </div>
    </template>
  </DefinitionList>
</template>
