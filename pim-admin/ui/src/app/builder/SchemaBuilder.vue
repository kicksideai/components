<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import { Icon } from '@iconify/vue'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Message from 'primevue/message'
import SettingsRail from '@kickside/ui-kit/SettingsRail.vue'
import AdminError from '../../shared/AdminError.vue'
import NativeDialog from '../../shared/NativeDialog.vue'
import CatalogShare from '../CatalogShare.vue'
import LayoutEditor from '../LayoutEditor.vue'
import HistoryPanel from '../HistoryPanel.vue'
import SettingsActions from './SettingsActions.vue'
import { clone } from '../../state'
// Schema edits are reviewed and applied together; vocabulary terms save immediately.
import { computed, nextTick, onUnmounted, ref, useId, watch, type ComponentPublicInstance } from 'vue'
import { host, on } from '@wippy-fe/proxy'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { pim } from '../../api'
import type { CatalogRow, Declaration, PluginConfigs, RemoveDecl, SchemaOptions, SchemaPlan, SchemaView } from '../../types'
import BuilderFields from './BuilderFields.vue'
import BuilderDimensions from './BuilderDimensions.vue'
import BuilderVocabularies from './BuilderVocabularies.vue'
import BuilderFamilies from './BuilderFamilies.vue'
import BuilderChannels from './BuilderChannels.vue'
import BuilderPlugins from './BuilderPlugins.vue'
import { pluginPending, pluginStatus } from './plugin-state'
import BuilderPolicy from './BuilderPolicy.vue'
import BuilderDeclaration from './BuilderDeclaration.vue'
import { requestGeneration } from '../../shared/requests'
import { reconcileRemovals, reviewedRequest } from '../../state'
import { humanize } from '../../forms'
import { humanLabel } from '../../shared/labels'
import { presentError, SCHEMA_CONFLICT } from '../../shared/transport'

const props = defineProps<{ catalogId: string; embedded?: boolean; title?: string; catalog?: CatalogRow; backLabel?: string; focusBack?: boolean }>()
const emit = defineEmits<{ applied: [generation: number]; back: []; 'dirty-changed': [dirty: boolean] }>()

const navigation = {
  General: { question: 'What is this catalog for?', items: [
    { label: 'Overview', icon: 'tabler:layout-dashboard' },
    { label: 'History', icon: 'tabler:history' },
  ] },
  Products: { question: 'What does a product look like?', items: [
    { label: 'Families', icon: 'tabler:packages' },
    { label: 'Fields', icon: 'tabler:list-details' },
    { label: 'Form layout', icon: 'tabler:layout' },
  ] },
  Values: { question: 'Which values can products use?', items: [
    { label: 'Dimensions', icon: 'tabler:dimensions' },
    { label: 'Vocabularies', icon: 'tabler:book' },
  ] },
  Channels: { question: 'Where does product data come from and go?', items: [
    { label: 'Channels', icon: 'tabler:broadcast' },
    { label: 'Sources', icon: 'tabler:database-import' },
  ] },
  Access: { question: 'Who can use this catalog?', items: [{ label: 'Access', icon: 'tabler:users' }] },
  Plugins: { question: 'What can this catalog do?', items: [{ label: 'Plugins', icon: 'tabler:puzzle' }] },
}
type Section = keyof typeof navigation
const section = ref<Section>('General')
const view = ref('Overview')
const familyFilter = ref('')
const accessSummary = ref('')
const advanced = ref<'defaults' | 'declaration'>()
const advancedVisible = ref(false)
const content = ref<HTMLElement>()
const sectionOptions = (Object.keys(navigation) as Section[]).map(name => ({
  heading: name === 'Channels' ? 'Publishing and imports' : name,
  items: navigation[name].items.map(item => ({ ...item, value: item.label, section: name })),
}))
const sectionGroups = [
  ...sectionOptions.filter(group => group.items.length > 1),
  { heading: 'Manage catalog', items: sectionOptions.filter(group => group.items.length === 1).flatMap(group => group.items) },
]
const sectionItems = sectionGroups.flatMap(group => group.items)
const settingsGroups = computed(() => schema.value && options.value ? [
  { ...sectionGroups[0], heading: props.title || 'Catalog' },
  ...sectionGroups.slice(1),
] : [])
const allCatalogs = computed(() => props.backLabel ? {
  value: 'all-catalogs', label: props.embedded ? 'All catalogs' : props.backLabel, icon: 'tabler:table',
} : undefined)
const rail = ref<InstanceType<typeof SettingsRail>>()
watch(rail, value => {
  if (props.focusBack) value?.$el.querySelector('.kx-settings-rail-item')?.focus()
}, { flush: 'post', once: true })
function selectView(value: string | undefined) {
  if (value === 'all-catalogs') { emit('back'); return }
  const item = sectionItems.find(option => option.label === value)
  if (item) selectSection(item.section, item.label)
}
function selectSection(next: Section, nextView = navigation[next].items[0].label) {
  if (section.value === next && view.value === nextView) return
  section.value = next
  view.value = nextView
  if (content.value) content.value.scrollTop = 0
}
function openAdvanced(panel: 'defaults' | 'declaration') {
  advanced.value = panel
  advancedVisible.value = true
}
function showFields(family: string) {
  familyFilter.value = family
  selectSection('Products', 'Fields')
}
function count(amount: number, one: string, many = one + 's') {
  return amount + ' ' + (amount === 1 ? one : many)
}

const schema = ref<SchemaView | null>(null)
const options = ref<SchemaOptions | null>(null)
const draft = ref<Declaration>({})
const removed = ref<RemoveDecl>({})
const pluginConfigs = ref<PluginConfigs>({})
const initialConfigs = computed(() => Object.fromEntries(Object.entries(pluginConfigs.value).filter(([id]) => draft.value.plugins?.some(p => p.use === id) && !schema.value?.plugins.some(p => p.plugin === id && p.active))))
const error = ref<ReturnType<typeof presentError>>()
const stale = ref(false)
const errorPanel = ref<ComponentPublicInstance | null>(null)
const busy = ref(false)
const editable = computed(() => schema.value?.access.admin === true)
const saved = ref('')
const plan = ref<SchemaPlan | null>(null)
const showReview = ref(false)
const acknowledgeRemoval = ref(false)
const reviewHeading = ref<HTMLHeadingElement | null>(null)
const reviewId = useId()
const reviewLabels: Record<string, string> = {
  unchanged: 'No changes',
  initial: 'First schema',
  cosmetic: 'Presentation only',
  additive: 'New fields or options',
  semantic: 'Affects product data',
  refused: 'Changes blocked',
}
const changeLabels: Record<string, string> = {
  'attribute order': 'Change the order on product forms',
  added: 'Add to this catalog',
  removed: 'Remove from this catalog',
  adopted: 'Enable these product filters',
  dropped: 'Disable these product filters',
  chosen: 'Enable this plugin',
  changed: 'Update what this plugin adds',
  audit: 'Change which updates are recorded',
  checks: 'Change installed readiness checks',
  'check implementation revised': 'Use the updated readiness check',
  requirements: 'Change what products need before release',
  fallback: 'Change where missing values come from',
  'catalog policy': 'Change the catalog override',
  'variation axes': 'Change which fields distinguish variants',
  cardinality: 'Number of values',
  default: 'Default value',
  scope: 'Dimensions',
  form: 'Value format',
  index: 'How products can be filtered or sorted',
  type: 'Field type',
  unique: 'Unique values',
  width: 'Change the width on product forms',
}
const reviewed = ref<ReturnType<typeof reviewedRequest> | null>(null)
const valid = ref(true)
const reviews = requestGeneration()
const canApply = computed(() => showReview.value && schemaDirty.value && (!destructive.value.length || acknowledgeRemoval.value) && !stale.value && valid.value && !!plan.value && plan.value.class !== 'refused' && !!reviewed.value?.matches(request.value, schema.value?.schema_generation ?? -1, initialConfigs.value))
const reviewChanges = computed(() => plan.value
  ? [...plan.value.refused, ...plan.value.changes.filter(change => change.class !== 'refused')]
  : [])


const loads = requestGeneration()
const pluginReads = requestGeneration()
const loading = ref(false)
let editRevision = 0
watch([draft, removed, pluginConfigs], () => { editRevision++; closeReview() }, { deep: true, flush: 'sync' })
async function load(replaceDraft = false, preserveActiveConfigs = false) {
  if (dirty.value && !replaceDraft) return
  const generation = loads.begin(), revision = editRevision, id = props.catalogId
  const retainedConfigs = preserveActiveConfigs ? Object.entries(pluginConfigs.value).filter(([plugin]) => schema.value?.plugins.some(p => p.plugin === plugin && p.active)) : []
  loading.value = true
  error.value = undefined
  try {
    const [view, opts] = await Promise.all([pim.schema(id), pim.schemaOptions(id)])
    if (!loads.current(generation) || revision !== editRevision || id !== props.catalogId) return
    schema.value = view
    options.value = opts
    draft.value = clone(view.declaration)
    removed.value = {}
    pluginConfigs.value = Object.fromEntries(retainedConfigs.filter(([plugin]) => view.plugins.some(p => p.plugin === plugin && p.active)))
    closeReview()
    valid.value = true
    stale.value = false
  } catch (e) {
    if (loads.current(generation)) error.value = presentError(e, 'Could not load settings.')
  } finally {
    if (loads.current(generation)) loading.value = false
  }
}
let unsubscribe = () => {}
watch(() => props.catalogId, id => {
  unsubscribe()
  unsubscribe = on(`component.${id}`, () => {
    if (!dirty.value && !busy.value) void load()
    else if (view.value === 'Plugins' && !busy.value) void refreshPluginStatus()
  })
}, { immediate: true })
const visible = useHostVisibilityRefresh(async () => {
  if (!dirty.value && !busy.value) await load()
  else if (view.value === 'Plugins' && !busy.value) await refreshPluginStatus()
})
onUnmounted(() => { unsubscribe(); reviews.begin(); loads.begin(); pluginReads.begin() })
const pollPlugins = computed(() => visible.value !== false && view.value === 'Plugins' && !busy.value &&
  schema.value?.plugins.some(plugin => pluginPending(plugin, schema.value!.as_of)) === true)
watch(pollPlugins, (pending, _, cleanup) => {
  if (!pending) return
  let timer: ReturnType<typeof setTimeout>
  let active = true
  const schedule = () => {
    timer = setTimeout(async () => {
      if (await refreshPluginStatus() && active && pollPlugins.value) schedule()
    }, 2000)
  }
  schedule()
  cleanup(() => { active = false; clearTimeout(timer) })
})
watch(() => props.catalogId, () => { reviews.begin(); busy.value = false; stale.value = false; schema.value = null; options.value = null; discard(); void load() })

const removals = computed(() => Object.values(reconcileRemovals(draft.value, removed.value)).reduce((n, list) => n + (list?.length ?? 0), 0))
const schemaDirty = computed(() => !!schema.value && (JSON.stringify(draft.value) !== JSON.stringify(schema.value.declaration) || removals.value > 0 || Object.keys(initialConfigs.value).length > 0))
const dirty = computed(() => schemaDirty.value || Object.keys(pluginConfigs.value).length > 0)
watch(dirty, value => emit('dirty-changed', value), { immediate: true })
const families = computed(() => draft.value.families?.filter(family => family.code !== 'generic') ?? [])
const groups = computed(() => draft.value.aspects ?? [])
const fieldCount = computed(() => groups.value.reduce((n, group) => n + (group.attributes?.length ?? 0), 0))
const contributedFields = computed(() => {
  const selected = new Set(draft.value.plugins?.map(plugin => plugin.use))
  return Object.values(schema.value?.attributes ?? {}).filter(attr => attr.plugin && selected.has(attr.plugin)).length
})
const setupEmpty = computed(() => !fieldCount.value && !groups.value.length && !families.value.length)
const channels = computed(() => draft.value.channels ?? [])
const sources = computed(() => draft.value.sources ?? [])
const activePlugins = computed(() => schema.value?.plugins.filter(plugin => plugin.active) ?? [])
const overview = computed(() => [
  { section: 'Products' as const, label: 'Product setup', icon: 'tabler:packages',
    summary: [count(families.value.length, 'family', 'families'), count(fieldCount.value + contributedFields.value, 'field')].join(' · '),
    detail: families.value.map(family => humanize(family.code)).join(', ') || 'Create a family for products that share the same fields.' },
  { section: 'Values' as const, label: 'Allowed values', icon: 'tabler:list-details',
    summary: [count(draft.value.dimensions?.length ?? 0, 'dimension'), count(draft.value.vocabularies?.length ?? 0, 'vocabulary', 'vocabularies')].join(' · '),
    detail: draft.value.dimensions?.map(dimension => humanize(dimension.name)).join(', ') || 'Add dimensions when values vary by language, region or another context.' },
  { section: 'Channels' as const, label: 'Publishing and imports', icon: 'tabler:arrows-exchange',
    summary: [count(channels.value.length, 'channel'), count(sources.value.length, 'source')].join(' · '),
    detail: channels.value.map(channel => humanize(channel.id)).join(', ') || 'Add a release destination when products are ready to publish.' },
  { section: 'Plugins' as const, label: 'Catalog tools', icon: 'tabler:puzzle',
    summary: count(activePlugins.value.length, 'plugin') + ' enabled',
    detail: activePlugins.value.map(plugin => humanLabel(plugin.title, 'Catalog plugin')).join(', ') || 'Open Plugins to see which tools you can enable.' },
])
const questions: Record<string, string> = {
  Overview: navigation.General.question,
  History: 'What changed in this catalog?',
  Families: 'Which product forms and variants can editors use?',
  Fields: 'What values can products store?',
  'Form layout': 'In what order will editors see fields?',
  Dimensions: 'Where can product values differ?',
  Vocabularies: 'Which terms can product editors choose?',
  Channels: 'Where can products be published?',
  Sources: 'Which systems can send product data?',
  Access: navigation.Access.question,
  Plugins: navigation.Plugins.question,
}
const facts = computed(() => {
  const data = draft.value
  switch (view.value) {
    case 'Overview': {
      const products = props.catalog?.product_count ?? props.catalog?.item_count
      return [
        ...(typeof products === 'number' ? [count(products, 'product')] : []),
        ...(schema.value?.rebuilding ? ['Updating product readiness'] : []),
        ...(dirty.value ? ['Unsaved changes are reflected below'] : []),
      ]
    }
    case 'History': return ['Recent catalog settings changes']
    case 'Families': return [
      count(families.value.length, 'family', 'families'),
      count(families.value.filter(family => family.variation?.length).length, 'family with variants', 'families with variants'),
    ]
    case 'Fields':
    case 'Form layout': return [count(fieldCount.value + contributedFields.value, 'field'), count(groups.value.length, 'field group')]
    case 'Dimensions': return [count(data.dimensions?.length ?? 0, 'dimension')]
    case 'Vocabularies': return [count(data.vocabularies?.length ?? 0, 'vocabulary', 'vocabularies')]
    case 'Channels': return [
      count(data.channels?.length ?? 0, 'channel'),
      ...(!data.channels?.length ? ['Add a channel to give products a release destination'] : []),
    ]
    case 'Sources': return [count(data.sources?.length ?? 0, 'source')]
    case 'Access': return accessSummary.value ? [accessSummary.value] : []
    case 'Plugins': return [
      count(data.plugins?.length ?? 0, 'plugin') + ' selected',
      (options.value?.plugins.filter(plugin => plugin.installed).length ?? 0) + ' available',
      count(data.scopes?.length ?? 0, 'filter set') + ' selected',
      ...(schema.value?.plugins.some(plugin => plugin.active && ['failed', 'config', 'reset', 'paused', 'degraded', 'uninstalled'].includes(pluginStatus(plugin, schema.value!.as_of)?.kind ?? '')) ? ['Some plugins need attention'] : []),
    ]
    default: return []
  }
})

// request is what Apply sends: the draft plus the removals the sections recorded.
const request = computed<Declaration>(() => {
  const out = clone(draft.value)
  const reconciled = reconcileRemovals(out, removed.value)
  for (const [kind, values] of Object.entries(reconciled) as [keyof RemoveDecl, string[]][]) {
    const removal = out.remove ??= {}
    removal[kind] = [...new Set([...(removal[kind] ?? []), ...values])]
  }
  return out
})

watch(schemaDirty, (d) => { if (!d) closeReview() })
watch([request, initialConfigs], closeReview, { deep: true })

function changeSubject(code: string): string {
  const [kind, id] = code.split(' ', 2)
  if (kind === 'plugin' && id) return humanLabel(options.value?.plugins.find(p => p.plugin === id)?.title, 'Plugin')
  if (kind === 'scope' && id) return humanLabel(options.value?.scopes.find(s => s.id === id)?.title, 'Product filter set')
  if (id) return humanLabel(humanize(id), humanize(kind)) + (kind === 'aspect' ? ' field group' : '')
  if (code.startsWith('kickside.')) return 'Catalog setting'
  const [group, field] = code.split('.', 2)
  return field ? `${humanLabel(humanize(field), 'Field')} (${humanLabel(humanize(group), 'Field group')})` : humanLabel(humanize(code), 'Catalog setting')
}

function changeText(what: string) {
  if (what.startsWith('renamed from ')) return 'Rename from ' + humanize(what.slice('renamed from '.length))
  if (what.startsWith('config.')) return 'Change ' + humanize(what.slice('config.'.length))
  if (what.endsWith(' owning level')) return 'Move a field to another variant level'
  return changeLabels[what] ?? humanize(what)
}
const destructive = computed(() => {
  const removal = request.value.remove
  return [
    ...(removal?.attributes?.length || removal?.aspects?.length ? ['Removing fields deletes the values stored in those fields.'] : []),
    ...(removal?.vocabularies?.length ? ['Removing a vocabulary deletes its saved terms.'] : []),
    ...(removal?.channels?.length ? ['Removing a release destination withdraws products already published to it.'] : []),
  ]
})
const localChanges = computed(() => {
  const previous = schema.value?.declaration
  if (!previous) return []
  return [
    ...(draft.value.channels ?? []).flatMap(channel => {
      const old = previous.channels?.find(current => current.id === channel.id)
      if (JSON.stringify(channel) === JSON.stringify(old)) return []
      return [{ subject: humanize(channel.id), effect: old ? 'Change which products can be released here and what they need first' : 'Add a release destination' }]
    }),
    ...(request.value.remove?.channels ?? []).map(id => ({ subject: humanize(id), effect: 'Remove this release destination' })),
    ...(draft.value.sources ?? []).flatMap(source => {
      const old = previous.sources?.find(current => current.id === source.id)
      if (JSON.stringify(source) === JSON.stringify(old)) return []
      return [{ subject: humanize(source.id), effect: old ? 'Update how this source can send product data' : 'Let this source send product updates' }]
    }),
    ...(request.value.remove?.sources ?? []).map(id => ({ subject: humanize(id), effect: 'Stop accepting updates from this source' })),
  ]
})

function reportSchemaError(cause: unknown, fallback: string) {
  error.value = presentError(cause, fallback)
  if (error.value.code !== SCHEMA_CONFLICT) return
  stale.value = true
  closeReview()
}

async function reloadSettings() {
  if (dirty.value && !await host.confirm({
    header: 'Discard unsaved changes?',
    message: 'Reloading will discard unsaved settings and plugin changes.',
    acceptLabel: 'Discard and reload',
    rejectLabel: 'Cancel',
  })) return
  busy.value = true
  saved.value = ''
  try { await load(true) } finally { busy.value = false }
}

async function review() {
  if (!schema.value || !schemaDirty.value || !valid.value || stale.value) return
  const generation = reviews.begin()
  const snapshot = reviewedRequest(request.value, schema.value.schema_generation, initialConfigs.value)
  busy.value = true
  error.value = undefined
  try {
    const response = await pim.planSchema(props.catalogId, snapshot.declaration, snapshot.generation, snapshot.pluginConfigs)
    if (!reviews.current(generation) || !snapshot.matches(request.value, schema.value.schema_generation, initialConfigs.value) || !valid.value) return
    reviewed.value = snapshot
    acknowledgeRemoval.value = false
    plan.value = response
    showReview.value = true
    await nextTick()
    reviewHeading.value?.focus()
  } catch (e) {
    if (!reviews.current(generation)) return
    reportSchemaError(e, 'Could not review the change.')
    closeReview()
    await nextTick()
    errorPanel.value?.$el.focus()
  } finally {
    if (reviews.current(generation)) busy.value = false
  }
}

async function apply() {
  if (!schema.value || !dirty.value || !canApply.value || !reviewed.value) return
  const id = props.catalogId, generation = reviews.begin()
  busy.value = true
  error.value = undefined
  saved.value = ''
  try {
    const out = await pim.applySchema(id, reviewed.value.declaration, reviewed.value.generation, reviewed.value.pluginConfigs)
    if (id !== props.catalogId || !reviews.current(generation)) return
    await load(true, true)
    if (id !== props.catalogId || !reviews.current(generation)) return
    saved.value = 'Catalog changes applied.'
    emit('applied', out.generation)
  } catch (e) {
    if (id !== props.catalogId || !reviews.current(generation)) return
    closeReview()
    reportSchemaError(e, 'Could not apply the change.')
    await nextTick()
    errorPanel.value?.$el.focus()
  } finally {
    if (reviews.current(generation)) busy.value = false
  }
}

async function refreshPluginStatus(showError = false) {
  const id = props.catalogId, current = schema.value, request = pluginReads.begin()
  try {
    const [updated, available] = await Promise.all([pim.schema(id), showError ? pim.schemaOptions(id) : undefined])
    if (!current || !pluginReads.current(request) || id !== props.catalogId || schema.value !== current) return false
    current.plugins = updated.plugins
    current.as_of = updated.as_of
    if (available) options.value = available
    return true
  } catch (cause) {
    if (showError && pluginReads.current(request) && id === props.catalogId) reportSchemaError(cause, 'Could not check plugin status.')
    return false
  }
}

async function configure(plugin: string, config: Record<string, unknown>, reset = false) {
  if (busy.value || stale.value || !editable.value) return
  const id = props.catalogId, generation = loads.begin(), action = reviews.begin()
  pluginReads.begin()
  busy.value = true
  error.value = undefined
  saved.value = ''
  try {
    const snapshot = JSON.stringify(config)
    if (reset) await pim.configurePlugin(id, plugin, clone(config), true)
    else await pim.configurePlugin(id, plugin, clone(config))
    if (id !== props.catalogId || !loads.current(generation)) return
    if (!await refreshPluginStatus(true) || id !== props.catalogId || !loads.current(generation)) return
    if (!reset && JSON.stringify(pluginConfigs.value[plugin]) === snapshot) delete pluginConfigs.value[plugin]
    saved.value = reset ? 'Background update reset requested.' : 'Configuration saved'
  } catch (e) {
    if (id === props.catalogId && reviews.current(action)) reportSchemaError(e, reset ? 'Could not reset background updates.' : 'Could not save configuration.')
  } finally { if (reviews.current(action)) busy.value = false }
}

async function resetPlugin(plugin: string) {
  const id = props.catalogId
  const active = schema.value?.plugins.find(row => row.plugin === plugin && row.active && row.installed)
  if (!active?.config || busy.value || stale.value || !editable.value) return
  if (!await host.confirm({
    header: 'Reset background updates?',
    message: 'Background updates will start from a new catalog event. Current product data will be rebuilt into the plugin’s index. Earlier events will be skipped.',
    acceptLabel: 'Reset background updates',
    rejectLabel: 'Cancel',
  }) || props.catalogId !== id) return
  await configure(plugin, active.config, true)
}

async function resumePluginProjection(cursorId: string) {
  const id = props.catalogId
  if (busy.value || stale.value || !editable.value) return
  busy.value = true
  error.value = undefined
  saved.value = ''
  try {
    await pim.resumePluginProjection(id, cursorId)
    if (props.catalogId === id && await refreshPluginStatus(true)) saved.value = 'Background update resumed.'
  } catch (cause) {
    if (props.catalogId === id) reportSchemaError(cause, 'Could not resume the background update.')
  } finally { if (props.catalogId === id) busy.value = false }
}

async function clearShellBinding(binding: string) {
  const id = props.catalogId
  if (busy.value || stale.value || !editable.value) return
  if (!await host.confirm({
    header: 'Clear catalog app binding?',
    message: 'The catalog will use the default app after this setting is saved.',
    acceptLabel: 'Clear binding',
    rejectLabel: 'Cancel',
  }) || props.catalogId !== id || busy.value || !editable.value ||
    !schema.value?.plugins.some(plugin => plugin.references?.shell_bindings.includes(binding))) return
  busy.value = true
  error.value = undefined
  saved.value = ''
  try {
    await pim.updateCatalogApp(id, '')
    if (props.catalogId !== id) return
    if (await refreshPluginStatus(true)) saved.value = 'Catalog app binding cleared.'
  } catch (cause) {
    if (props.catalogId === id) reportSchemaError(cause, 'Could not clear the catalog app binding.')
  } finally { if (props.catalogId === id) busy.value = false }
}

async function openDefaults() {
  if (dirty.value && !await host.confirm({
    header: 'Leave this catalog?', message: 'Your unsaved catalog changes will be discarded.',
    acceptLabel: 'Discard and open settings', rejectLabel: 'Keep editing',
  })) return
  discard()
  advancedVisible.value = false
  host.navigate('/system/settings')
}
function closeReview() {
  showReview.value = false
  reviewed.value = null
}
function closeAdvanced() {
  advancedVisible.value = false
  valid.value = true
}
function discard() {
  pluginConfigs.value = {}
  valid.value = true
  if (schema.value) draft.value = clone(schema.value.declaration)
  removed.value = {}
  closeReview()
  saved.value = ''
}

// Records a pending removal; the section removes the entry from its draft.
function remove(kind: keyof RemoveDecl, id: string) {
  const list = removed.value[kind] ?? []
  if (!list.includes(id)) removed.value = { ...removed.value, [kind]: [...list, id] }
}

// Chromium preserves focus-visible when a pointer clicks the already focused button.
function focusRailWithPointer(event: PointerEvent) {
  if (event.button === 0 && event.target instanceof Element) {
    event.target.closest<HTMLButtonElement>('.kx-settings-rail-item:focus-visible')?.blur()
  }
}
</script>
<template>
  <section class="pim-builder" :class="{ embedded }">
    <div class="pim-section-layout">
      <SettingsRail v-if="allCatalogs || (schema && options)" ref="rail" label="Catalog settings sections" :value="view"
        :groups="settingsGroups" :leading-item="allCatalogs" @update:value="selectView" @pointerdown="focusRailWithPointer" />
      <div class="kx-main">
        <section ref="content" class="kx-main-scroll" :aria-label="view">
          <header v-if="schema && options" class="system-section-head">
            <div class="system-section-head-text">
              <h1>{{ view }}</h1>
              <p>{{ questions[view] }}</p>
            </div>
            <div class="kx-head-actions">
              <SettingsActions :access="schema.access" :dirty="dirty" :busy="busy" :valid="valid && !stale && schemaDirty"
                @discard="discard" @review="review" />
            </div>
          </header>
          <div class="pim-builder-main">
            <AdminError v-if="error" ref="errorPanel" :error="error" tabindex="-1">
              <Button v-if="stale" type="button" severity="secondary" outlined size="small" :disabled="busy" @click="reloadSettings">Reload settings</Button>
              <Button v-else-if="!schema || !options" type="button" severity="secondary" outlined size="small" @click="load()">Retry</Button>
            </AdminError>
            <Message v-if="saved" severity="success" role="status">{{ saved }}</Message>
            <div v-if="loading && (!schema || !options)" class="kx-loading" role="status">Loading catalog settings…</div>
            <fieldset v-else-if="schema && options" class="pim-editor-surface" :disabled="busy" :inert="busy">
              <p v-if="facts.length" class="muted pim-section-facts">{{ facts.join(' · ') }}</p>
              <Message v-if="!editable" severity="info">You can view this catalog’s settings.</Message>

              <div :key="view" class="pim-ia-content">
                <HistoryPanel v-if="section === 'General' && view === 'History'" :catalog-id="catalogId" :can-resolve-actors="editable" />
                <template v-else-if="section === 'General'">
                  <div class="pim-overview-grid">
                    <section v-for="card in overview" :key="card.section" class="kx-card pim-overview-card">
                      <div class="kx-card-head">
                        <span class="kx-head-icon"><Icon :icon="card.icon" aria-hidden="true" /></span>
                        <div class="kx-card-id"><h3 class="kx-card-name">{{ card.label }}</h3><p class="kx-card-meta">{{ card.summary }}</p></div>
                      </div>
                      <p class="kx-card-desc">{{ card.detail }}</p>
                      <Button type="button" text size="small" severity="secondary" class="pim-overview-action" @click="selectSection(card.section)">
                        {{ card.section === 'Products' && setupEmpty ? 'Set up products' : 'View ' + card.section.toLowerCase() }}
                        <Icon icon="tabler:arrow-right" aria-hidden="true" />
                      </Button>
                    </section>
                  </div>
                  <Disclosure label="Advanced"><div class="pim-advanced-actions">
                    <div class="pim-ia-action">
                      <div><h3>Application defaults</h3><p>Review the audit, retention and processing settings this catalog inherits.</p></div>
                      <Button label="View defaults" severity="secondary" outlined @click="openAdvanced('defaults')" />
                    </div>
                    <div class="pim-ia-action">
                      <div><h3>Technical schema</h3><p>Inspect the complete definition, including integration keys and settings used by installed extensions.</p></div>
                      <Button label="Open declaration" severity="secondary" outlined @click="openAdvanced('declaration')" />
                    </div>
                  </div></Disclosure>
                </template>

                <template v-else-if="section === 'Products'">
                  <BuilderFamilies v-if="view === 'Families'" :draft="draft" :schema="schema" :options="options" @remove="remove" @fields="showFields" />
                  <BuilderFields v-else-if="view === 'Fields'" v-model:family="familyFilter" :draft="draft" :schema="schema" :options="options" @remove="remove" />
                  <LayoutEditor v-else :draft="draft" :schema="schema" :types="options.types" />
                </template>
                <template v-else-if="section === 'Values'">
                  <BuilderDimensions v-if="view === 'Dimensions'" :draft="draft" :schema="schema" @remove="remove" />
                  <BuilderVocabularies v-else :catalog-id="catalogId" :draft="draft" :schema="schema" @remove="remove" />
                </template>
                <BuilderChannels v-else-if="section === 'Channels'" :catalog-id="catalogId" :draft="draft" :schema="schema" :view="view === 'Sources' ? 'sources' : 'channels'" @remove="remove" />
                <CatalogShare v-else-if="section === 'Access'" :catalog-id="catalogId" :title="title || 'Catalog'" :access="schema.access" @summary="accessSummary = $event" />
                <BuilderPlugins v-else :draft="draft" :schema="schema" :options="options" :plugin-configs="pluginConfigs" :stale="stale" @configure="configure" @remove="remove" @reset="resetPlugin"
                  @refresh="refreshPluginStatus(true)" @resume="resumePluginProjection" @review="review" @clear-shell-binding="clearShellBinding" />
              </div>

              <NativeDialog v-if="advanced" :visible="advancedVisible" :label="advanced === 'defaults' ? 'Application defaults' : 'Technical schema'" @close="closeAdvanced" @closed="advanced = undefined">
                <div class="pim-ia-dialog">
                  <header class="pim-ia-dialog-head">
                    <h2>{{ advanced === 'defaults' ? 'Application defaults' : 'Technical schema' }}</h2>
                    <Button type="button" aria-label="Close" text severity="secondary" @click="closeAdvanced"><Icon icon="tabler:x" aria-hidden="true" /></Button>
                  </header>
                  <template v-if="advanced === 'defaults'">
                    <p class="muted">These settings apply across the application. Catalogs with an explicit override keep their chosen value.</p>
                    <BuilderPolicy :catalog-id="catalogId" :draft="draft" :disabled="!editable" defaults-only />
                    <div v-if="editable" class="dialog-actions">
                      <Button type="button" label="Open application settings" severity="secondary" outlined @click="openDefaults" />
                    </div>
                  </template>
                  <BuilderDeclaration v-else :draft="draft" :readonly="!editable" @replace="draft = $event" @validity="valid = $event; closeReview()" />
                </div>
              </NativeDialog>
            </fieldset>

            <NativeDialog class="pim-review-dialog" :visible="showReview" :busy="busy" label="Review changes" @close="closeReview" @closed="plan = null">
              <section v-if="plan" class="pim-ia-dialog pim-plan" :aria-labelledby="reviewId">
                <header class="pim-ia-dialog-head">
                  <div>
                    <h2 :id="reviewId" ref="reviewHeading" tabindex="-1" autofocus>Review changes</h2>
                    <p>Check what will happen when you apply this draft to {{ title || 'the catalog' }}.</p>
                  </div>
                  <Button type="button" aria-label="Close review" :disabled="busy" text severity="secondary" @click="closeReview"><Icon icon="tabler:x" aria-hidden="true" /></Button>
                </header>
                <div class="pim-ia-review-impact">
                  <h3>{{ reviewLabels[plan.class] || 'Catalog changes' }}</h3>
                  <p v-if="plan.class === 'unchanged'">The catalog already matches this draft.</p>
                  <p v-else-if="plan.class === 'initial'">Product editors will use these settings for new products.</p>
                  <p v-else-if="plan.class === 'cosmetic'">Catalog settings will update. Stored product values are kept.</p>
                  <p v-else-if="plan.class === 'additive'">The new options become available. Existing product values are kept.</p>
                  <p v-else-if="plan.class === 'semantic'">Applying changes can recalculate product values or release readiness across this catalog.</p>
                  <Message v-else-if="plan.class === 'refused'" severity="error">
                    These changes can’t be applied.
                    <span v-if="plan.migration && plan.refused.some(change => schema?.attributes[change.code])">
                      To change how a field stores values, add a new field and copy the existing values into it.
                      Then remove the original field and give the new field its name.
                    </span>
                  </Message>
                </div>
                <ul v-if="reviewChanges.length || localChanges.length" class="pim-plan-list">
                  <li v-for="(c, i) in reviewChanges" :key="i">
                    <Tag v-if="c.class === 'refused'" class="kx-tag-sm small" severity="danger">Blocked</Tag>
                    <strong v-if="c.code">{{ changeSubject(c.code) }}</strong>
                    <span>{{ changeText(c.what) }}</span>
                  </li>
                  <li v-for="change in localChanges" :key="change.subject + change.effect">
                    <strong>{{ change.subject }}</strong><span>{{ change.effect }}</span>
                  </li>
                </ul>
                <div v-if="destructive.length" class="pim-ia-review-impact">
                  <h3>Permanent changes</h3>
                  <p v-for="impact in destructive" :key="impact">{{ impact }}</p>
                  <div v-if="plan.class !== 'refused'" class="row pim-review-confirm">
                    <Checkbox v-model="acknowledgeRemoval" :input-id="reviewId + '-acknowledge'" binary :disabled="busy" />
                    <label :for="reviewId + '-acknowledge'">I understand the effects of these removals</label>
                  </div>
                </div>
                <footer class="dialog-actions pim-ia-dialog-actions">
                  <Button type="button" label="Back to editing" severity="secondary" outlined :disabled="busy" @click="closeReview" />
                  <Button v-if="schema?.access.admin && plan.class !== 'refused'" :disabled="!dirty || busy || !canApply" :loading="busy" @click="apply">
                    {{ view === 'Form layout' ? 'Apply layout' : 'Apply changes' }}
                  </Button>
                </footer>
              </section>
            </NativeDialog>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>
