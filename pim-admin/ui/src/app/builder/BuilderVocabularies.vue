<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import AdminError from '../../shared/AdminError.vue'
import Tag from 'primevue/tag'
import AddSchemaCode from './AddSchemaCode.vue'
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
import { presentError, type AdminError as ErrorPresentation } from '../../shared/transport'
import type { ApplyItem, ApplyResult, Declaration, RemoveDecl, SchemaView, TermRow, VocabularyDecl } from '../../types'
import { humanize } from '../../forms'

const props = defineProps<{ catalogId: string; draft: Declaration; schema: SchemaView }>()
const emit = defineEmits<{ remove: [kind: keyof RemoveDecl, id: string] }>()
// Mirrors pim/src/command/terms.lua, including its strict end and 128-byte limit.
const TERM_CODE = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}(?![\s\S])/
const canEdit = computed(() => props.schema.access.admin)
const canWrite = computed(() => canEdit.value && props.schema.access.write)
const vocabs = computed(() => props.draft.vocabularies ?? [])
function add(code: string) {
  (props.draft.vocabularies ??= []).push({ code })
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
const loading = ref<Record<string, boolean>>({})
const saving = ref<Record<string, boolean>>({})
const failures = ref<Record<string, { errors: ErrorPresentation[]; read?: { after?: string } }>>({})
const term = ref<Record<string, { code: string; label: string; parent: string }>>({})
function busy(code: string): boolean {
  return !!(loading.value[code] || saving.value[code])
}
async function loadTerms(code: string, after?: string) {
  loading.value[code] = true
  delete failures.value[code]
  try {
    const page = await pim.termsPage(props.catalogId, code, after)
    terms.value[code] = page.terms
    pages.value[code] = after
    cursors.value[code] = page.next
    const entry = form(code)
    if (page.terms.some(t => t.retired && t.code === entry.parent)) entry.parent = ''
  } catch (e) {
    failures.value[code] = { errors: [presentError(e, 'Could not load terms.')], read: { after } }
  } finally { loading.value[code] = false }
}
function toggle(code: string) {
  open.value[code] = !open.value[code]
  if (open.value[code] && !busy(code) && !terms.value[code] && !failures.value[code]) void loadTerms(code)
}
function form(code: string) {
  return term.value[code] ?? (term.value[code] = { code: '', label: '', parent: '' })
}
function parentLabel(code: string, parent: string) {
  const entry = terms.value[code]?.find(t => t.code === parent)
  return entry ? label(entry) : humanize(parent)
}
function parentOptions(code: string) {
  return [{ value: '', label: 'No parent' }, ...(terms.value[code] ?? [])
    .filter(t => !t.retired).map(t => ({ value: t.code, label: label(t) }))]
}
function showTermFindings(code: string, outcome: ApplyResult['outcomes'][number] | undefined, message: string) {
  failures.value[code] = { errors: outcome?.findings?.length
    ? outcome.findings.map(f => ({ message: f.message ?? message, code: f.code }))
    : [{ message }] }
}
async function addTerm(v: VocabularyDecl) {
  const f = form(v.code)
  if (!canWrite.value || !TERM_CODE.test(f.code)) return
  saving.value[v.code] = true
  delete failures.value[v.code]
  try {
    const item: ApplyItem = { term: { vocabulary: v.code, code: f.code }, labels: { en: f.label || humanize(f.code) } }
    if (v.hierarchical && f.parent) item.parent = f.parent
    const out = await pim.apply(props.catalogId, [item])
    const o = out.outcomes[0]
    if (o?.outcome !== 'created' && o?.outcome !== 'updated') {
      showTermFindings(v.code, o, 'The term was not accepted.')
      return
    }
    term.value[v.code] = { code: '', label: '', parent: '' }
    pim.invalidateTerms(props.catalogId)
    await loadTerms(v.code, pages.value[v.code])
  } catch (e) {
    failures.value[v.code] = { errors: [presentError(e, 'Could not add the term.')] }
  } finally { saving.value[v.code] = false }
}
async function retire(v: VocabularyDecl, t: TermRow, retired: boolean) {
  if (!canWrite.value) return
  if (retired && !await host.confirm({ header: 'Retire term?', message: `Retire ${label(t)}? Term changes save immediately. You can restore this term later.`, acceptLabel: 'Retire', rejectLabel: 'Cancel' })) return
  saving.value[v.code] = true
  delete failures.value[v.code]
  try {
    const out = await pim.apply(props.catalogId, [{ term: { vocabulary: v.code, code: t.code }, retired }])
    const outcome = out.outcomes[0]
    if (!outcome || !['updated', 'unchanged'].includes(outcome.outcome)) {
      showTermFindings(v.code, outcome, 'The term change was not accepted.')
      return
    }
    if (retired && form(v.code).parent === t.code) form(v.code).parent = ''
    pim.invalidateTerms(props.catalogId)
    await loadTerms(v.code, pages.value[v.code])
  } catch (e) {
    failures.value[v.code] = { errors: [presentError(e, 'Could not change the term.')] }
  } finally { saving.value[v.code] = false }
}
</script>

<template>
  <DefinitionList :count="vocabs.length" :columns="['details']">
    <DefinitionRow route-section="vocabularies" :route-id="v.code" :title="humanize(v.code)" v-for="v in vocabs" :key="v.code">
      <template #details><span class="muted small">{{ v.hierarchical ? 'Hierarchical' : 'Flat' }}</span></template>
      <template #actions><Button v-if="canEdit" type="button" :aria-label="'Remove ' + humanize(v.code)" @click="remove(v)" text severity="secondary" size="small"><Icon icon="tabler:trash" /></Button></template>
      <div class="pim-aspect">
        <label class="row small"><ToggleSwitch :disabled="!canEdit" :aria-label="'Hierarchical ' + humanize(v.code)" :model-value="v.hierarchical === true" @update:model-value="$event ? (v.hierarchical = true) : delete v.hierarchical" /><span>Hierarchical</span></label>
        <Button v-if="declared(v.code)" type="button" @click="toggle(v.code)" severity="secondary" outlined size="small"><Icon icon="tabler:adjustments" aria-hidden="true" /> {{ open[v.code] ? 'Hide terms' : 'Terms' }}</Button>
        <span v-else-if="canEdit" class="muted small">Apply the schema before adding terms.</span>
        <div v-if="open[v.code]" class="pim-stack tight pim-terms">
          <p v-if="canWrite" class="muted small">Term changes save immediately.</p>
          <div v-if="loading[v.code]" class="kx-loading" role="status">Loading terms…</div>
          <template v-else-if="failures[v.code]">
            <AdminError v-for="(issue, i) in failures[v.code].errors" :key="i" :error="issue">
              <Button v-if="failures[v.code].read" type="button" @click="loadTerms(v.code, failures[v.code].read?.after)" severity="secondary" outlined size="small">Retry</Button>
            </AdminError>
          </template>
          <div v-if="(terms[v.code] ?? []).length" class="pim-responsive-table">
            <table class="pim-grid compact" aria-label="Vocabulary terms">
              <thead><tr><th>Term</th><th v-if="v.hierarchical">Parent</th><th v-if="canEdit"></th></tr></thead>
              <tbody><tr v-for="t in terms[v.code]" :key="t.code" :class="{ muted: t.retired }">
                <td>{{ label(t) }} <Tag v-if="t.retired" severity="secondary" value="Retired" /></td><td v-if="v.hierarchical" class="muted">{{ t.parent ? parentLabel(v.code, t.parent) : '—' }}</td>
                <td v-if="canEdit" class="num"><Button type="button" :disabled="!canWrite || busy(v.code)" @click="retire(v, t, !t.retired)" text severity="secondary" size="small">{{ t.retired ? 'Restore' : 'Retire' }}</Button></td>
              </tr></tbody>
            </table>
            <ul role="list" class="pim-stacked-list" aria-label="Vocabulary terms">
              <li v-for="t in terms[v.code]" :key="t.code" class="pim-stacked-row" :class="{ muted: t.retired }">
                <div>{{ label(t) }} <Tag v-if="t.retired" severity="secondary" value="Retired" /></div>
                <div v-if="v.hierarchical && t.parent" class="pim-stacked-meta muted small">Parent: {{ parentLabel(v.code, t.parent) }}</div>
                <Button v-if="canEdit" type="button" :disabled="!canWrite || busy(v.code)" @click="retire(v, t, !t.retired)" text severity="secondary" size="small">{{ t.retired ? 'Restore' : 'Retire' }}</Button>
              </li>
            </ul>
          </div>
          <p v-else-if="terms[v.code] && !busy(v.code) && !failures[v.code]" class="muted small">No terms yet.</p>
          <div class="row wrap">
            <Button type="button" :disabled="busy(v.code) || !pages[v.code]" @click="loadTerms(v.code)" severity="secondary" outlined size="small"><Icon icon="tabler:chevrons-left" aria-hidden="true" /> First terms</Button>
            <Button type="button" :disabled="busy(v.code) || !cursors[v.code]" @click="loadTerms(v.code, cursors[v.code])" severity="secondary" outlined size="small"><Icon icon="tabler:chevron-right" aria-hidden="true" /> Next terms</Button>
          </div>
          <div v-if="canEdit" class="row wrap pim-add-row">
            <InputText v-model="form(v.code).label" :disabled="!canWrite || busy(v.code)" aria-label="Term name in English" type="text" placeholder="Term name" />
            <InputText v-model="form(v.code).code" :disabled="!canWrite || busy(v.code)" type="text" aria-label="Short term name" placeholder="Short name for imports" class="narrow" />
            <Select v-if="v.hierarchical" v-model="form(v.code).parent" :disabled="!canWrite || busy(v.code)" class="narrow" aria-label="Parent term" placeholder="No parent" :options="parentOptions(v.code)" option-label="label" option-value="value" appendTo="self" />
            <Button type="button" :disabled="!canWrite || busy(v.code) || !TERM_CODE.test(form(v.code).code)" @click="addTerm(v)" severity="secondary" outlined size="small"><Icon icon="tabler:plus" aria-hidden="true" /> Add term</Button>
          </div>
          <Disclosure class="pim-ia-disclosure" label="Integration keys">
            <dl v-if="(terms[v.code] ?? []).length" class="pim-config-overrides">
              <template v-for="t in terms[v.code]" :key="t.code"><dt>{{ label(t) }}</dt><dd><code>{{ t.code }}</code></dd></template>
            </dl>
          </Disclosure>
        </div>
      </div>
    </DefinitionRow>
    <template v-if="canEdit" #add>
      <AddSchemaCode label="Vocabulary name" from-name action="Add vocabulary" :existing="vocabs.map(v => v.code)" @add="add">
        <span class="muted small">Select fields pick their values from a vocabulary's terms.</span>
      </AddSchemaCode>
    </template>
  </DefinitionList>
</template>
