<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { api } from '@wippy-fe/proxy'
import { useProps } from '@wippy-fe/webcomponent-vue'
import WcMount from './WcMount.vue'

// SSO admin shell. It owns only the module-wide Global settings; every provider
// is rendered by its own card web component, discovered from the registry. The
// admin endpoint returns each provider's settings namespace, its fields, its
// declared card presentation (ui), and an optional bespoke card tag. The shell
// mounts the declared card (defaulting to the shared kickside-sso-provider) per
// provider and passes its config — it holds no per-provider knowledge, so a new
// provider appears with no shell change.
//
// The Settings page mounts one instance per left-nav block and hands it a block
// `config` selecting the mode: { scope: "global" } shows only the Global
// section; { provider: "<id>" } shows only that provider's card.
interface FieldSchema { kind?: string, value_source?: string }
interface Setting {
  namespace: string
  key: string
  value: unknown
  value_type: 'string' | 'int' | 'bool' | 'duration' | 'json' | 'secret'
  has_value?: boolean
  description?: string
  schema?: FieldSchema | null
}
interface SettingMeta { namespace: string, key: string, value_type: Setting['value_type'], schema?: FieldSchema | null, description?: string, has_value?: boolean, value?: unknown }
interface ProviderUi { accent?: string, intro?: string, docs_url?: string, docs_label?: string }
interface Provider { id: string, label: string, icon?: string, engine: string, namespace: string, ui_component?: string, ui?: ProviderUi, fields: string[] }
interface ScopeOption { id: string, label: string }

type Kind = 'bool' | 'secret' | 'list' | 'group' | 'mapping' | 'text'
interface Pair { k: string, v: string }

const DEFAULT_GLOBAL_NS = 'kickside.sso'
const DEFAULT_CARD_TAG = 'kickside-sso-provider'
// public_base_path is intentionally excluded: the public mount path is set by the
// app's router prefix, not by us — it is not a user-editable option here.
const GLOBAL_KEYS = [
  'enabled', 'auto_provision', 'allowed_email_domains', 'default_group',
  'group_claim_name', 'group_mapping', 'post_login_redirect_allowlist',
]

function cid(namespace: string, key: string): string { return `${namespace}|${key}` }

// Block-selected mode. `provider` pins a single provider card; `scope: "global"`
// pins the Global section. Every mounted instance declares one mode.
interface BlockConfig { scope?: string, provider?: string }
const hostProps = useProps<{ config?: BlockConfig }>()
const blockConfig = computed<BlockConfig>(() => hostProps.value?.config || {})
const pinnedProvider = computed(() => {
  const p = blockConfig.value.provider
  return typeof p === 'string' && p.length ? p : ''
})
const showGlobal = computed(() => !pinnedProvider.value && blockConfig.value.scope === 'global')
const showProviders = computed(() => !!pinnedProvider.value)

const loading = ref(true)
const error = ref('')
const globalNs = ref(DEFAULT_GLOBAL_NS)
const providers = ref<Provider[]>([])
const settings = ref<Setting[]>([])
const scopes = ref<ScopeOption[]>([])
const drafts = reactive<Record<string, unknown>>({})
const fieldErrors = reactive<Record<string, string>>({})
const savedKeys = reactive<Record<string, boolean>>({})
const savingScope = ref('')

const byKey = computed(() => {
  const m: Record<string, Setting> = {}
  for (const s of settings.value) m[cid(s.namespace, s.key)] = s
  return m
})
function get(id: string): Setting | undefined { return byKey.value[id] }

const globalIds = computed(() => GLOBAL_KEYS.map(k => cid(globalNs.value, k)).filter(id => !!get(id)))

// Each instance renders the provider selected by its block.
const visibleProviders = computed(() => providers.value.filter(p => p.id === pinnedProvider.value))

// The Global card: a master enable switch in the header, the rest grouped like a
// provider card. Keys absent from the registry are simply skipped.
const MASTER_KEY = 'enabled'
const GLOBAL_GROUPS: { title: string, icon: string, keys: string[] }[] = [
  { title: 'Provisioning', icon: 'tabler:user-plus', keys: ['auto_provision', 'allowed_email_domains', 'default_group'] },
  { title: 'Group sync', icon: 'tabler:users-group', keys: ['group_claim_name', 'group_mapping'] },
  { title: 'Redirects', icon: 'tabler:route', keys: ['post_login_redirect_allowlist'] },
]
const masterId = computed(() => cid(globalNs.value, MASTER_KEY))
const globalGroups = computed(() =>
  GLOBAL_GROUPS.map(g => ({ ...g, ids: g.keys.map(k => cid(globalNs.value, k)).filter(id => !!get(id)) }))
    .filter(g => g.ids.length))
const globalDirty = computed(() => globalIds.value.some(id => { const s = get(id); return s && changed(s) }))
const globalSaved = computed(() => globalIds.value.some(id => savedKeys[id]))

// ── value-kind classification (global controls only) ───────────────────────────
function kindOf(s: Setting): Kind {
  if (s.value_type === 'bool') return 'bool'
  if (s.value_type === 'secret') return 'secret'
  const k = s.schema?.kind
  if (k === 'string_list') return 'list'
  if (k === 'group_ref') return 'group'
  if (k === 'mapping') return 'mapping'
  return 'text'
}
function toList(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(x => String(x)).filter(Boolean)
  if (typeof v === 'string') return v.split(/[\s,]+/).map(x => x.trim()).filter(Boolean)
  return []
}
function toPairs(v: unknown): Pair[] {
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    return Object.entries(v as Record<string, unknown>).map(([k, val]) => ({ k, v: String(val ?? '') }))
  }
  return []
}

function seed(s: Setting) {
  const k = cid(s.namespace, s.key)
  switch (kindOf(s)) {
    case 'bool': drafts[k] = Boolean(s.value); break
    case 'secret': drafts[k] = ''; break
    case 'list': drafts[k] = toList(s.value).join(' '); break
    case 'mapping': drafts[k] = toPairs(s.value); break
    default: drafts[k] = String(s.value ?? '')
  }
}
function readDraft(s: Setting): unknown {
  const k = cid(s.namespace, s.key)
  switch (kindOf(s)) {
    case 'bool': return Boolean(drafts[k])
    case 'secret': return String(drafts[k] ?? '').length ? drafts[k] : undefined
    case 'list': {
      const arr = String(drafts[k] ?? '').split(/[\s,]+/).map(x => x.trim()).filter(Boolean)
      return s.value_type === 'json' ? arr : arr.join(' ')
    }
    case 'mapping': {
      const obj: Record<string, string> = {}
      for (const p of drafts[k] as Pair[]) { const key = p.k.trim(); if (key) obj[key] = p.v }
      return obj
    }
    default: return String(drafts[k] ?? '')
  }
}
function storedNormalized(s: Setting): unknown {
  switch (kindOf(s)) {
    case 'bool': return Boolean(s.value)
    case 'list': { const arr = toList(s.value); return s.value_type === 'json' ? arr : arr.join(' ') }
    case 'mapping': return (s.value && typeof s.value === 'object') ? s.value : {}
    default: return String(s.value ?? '')
  }
}
function changed(s: Setting): boolean {
  const v = readDraft(s)
  if (v === undefined) return false
  if (kindOf(s) === 'secret') return true
  return JSON.stringify(v) !== JSON.stringify(storedNormalized(s))
}
function addRow(id: string) { (drafts[id] as Pair[]).push({ k: '', v: '' }) }
function removeRow(id: string, idx: number) { (drafts[id] as Pair[]).splice(idx, 1) }

// ── provider card config (registry-declared, shell-agnostic) ───────────────────
function cardConfig(p: Provider) {
  const fields = p.fields.map((key) => {
    const s = get(cid(p.namespace, key))
    return {
      key,
      value_type: s?.value_type ?? 'string',
      value: s?.value,
      has_value: s?.has_value,
      description: s?.description,
      schema: s?.schema ?? null,
    }
  })
  return { namespace: p.namespace, label: p.label, icon: p.icon, engine: p.engine, ui: p.ui ?? null, fields }
}

// ── load + save ───────────────────────────────────────────────────────────────
async function refetchSettings(): Promise<Provider[]> {
  const { data } = await api.get('/api/v1/sso/providers')
  if (!data?.success) throw new Error(data?.error || 'failed to load providers')
  if (typeof data.global_namespace === 'string') globalNs.value = data.global_namespace
  const map = (data.settings || {}) as Record<string, SettingMeta>
  settings.value = Object.values(map).map(m => ({
    namespace: m.namespace,
    key: m.key,
    value_type: m.value_type,
    schema: m.schema ?? null,
    description: m.description,
    has_value: m.has_value,
    value: m.value,
  }))
  return data.providers as Provider[]
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const [provs, scopeRes] = await Promise.all([
      refetchSettings(),
      api.get('/api/v1/users/assignable-scopes').catch(() => ({ data: { success: false } })),
    ])
    providers.value = provs
    const sc = scopeRes.data?.success ? (scopeRes.data.scopes as any[]) : []
    scopes.value = sc.map(s => ({ id: s.id, label: s.label || s.id }))
    for (const s of settings.value) seed(s)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
}

function reason(e: any): string {
  return e?.response?.data?.error || e?.message || 'save failed'
}

async function persist(ids: readonly string[], scopeId: string) {
  savingScope.value = scopeId
  error.value = ''
  const saved: string[] = []
  try {
    for (const id of ids) {
      const s = get(id)
      if (!s || !changed(s)) continue
      delete fieldErrors[id]
      try {
        const { data } = await api.put('/api/v1/settings', { namespace: s.namespace, key: s.key, value: readDraft(s) })
        if (data?.success) { saved.push(id); savedKeys[id] = true }
        else fieldErrors[id] = data?.error || 'save failed'
      } catch (e) {
        fieldErrors[id] = reason(e)
      }
    }
    if (saved.length) {
      await refetchSettings()
      for (const id of saved) { const s = get(id); if (s) seed(s) }
      setTimeout(() => { for (const id of saved) delete savedKeys[id] }, 2500)
    }
  } finally {
    savingScope.value = ''
  }
}

async function saveGlobal() { await persist(globalIds.value, 'global') }

// A provider card saves itself; refresh our settings copy so a later reopen and
// the global Save reflect the new stored state.
async function onProviderChange() { try { await refetchSettings(); for (const s of settings.value) seed(s) } catch { /* ignore */ } }

onMounted(load)
</script>

<template>
  <div class="ap">
    <!-- Provider mode: the provider card owns its own full .ap chrome (toolbar +
         card + gutter). Mount it flush so nothing is doubled. -->
    <div v-if="showProviders && !showGlobal" class="ap-providers">
      <div v-if="error" class="ap-msg ap-err">{{ error }}</div>
      <div v-if="loading" class="ap-loading"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" /> Loading…</div>
      <WcMount v-for="p in visibleProviders" :key="p.id"
        :tag="p.ui_component || DEFAULT_CARD_TAG" :config="cardConfig(p)"
        @change="onProviderChange" />
    </div>

    <div v-else class="ap-body">
      <!-- Sticky toolbar: right-aligned Discard/Save, shown for the Global pane. -->
      <header v-if="showGlobal" class="ap-bar">
        <span v-if="globalSaved" class="ap-saved"><Icon icon="tabler:check" aria-hidden="true" /> Saved</span>
        <button class="ap-btn ap-btn-ghost" :disabled="!globalDirty || savingScope === 'global'" @click="load">Discard</button>
        <button class="ap-btn ap-btn-primary" :disabled="!globalDirty || savingScope === 'global'" @click="saveGlobal">
          <Icon :icon="savingScope === 'global' ? 'tabler:loader-2' : 'tabler:device-floppy'" :class="savingScope === 'global' && 'spin'" aria-hidden="true" />
          {{ savingScope === 'global' ? 'Saving…' : 'Save' }}
        </button>
      </header>

      <div v-if="error" class="ap-msg ap-err">{{ error }}</div>
      <div v-if="loading" class="ap-loading"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" /> Loading…</div>

      <!-- Global — the same .ap-card chrome as the provider panes. -->
      <div v-else-if="showGlobal" class="ap-cards">
        <section class="ap-card">
          <header class="ap-h"><Icon icon="tabler:shield-lock" aria-hidden="true" /> Single sign-on</header>

          <div v-if="get(masterId)" class="ap-toggle-row">
            <div class="ap-toggle-text">
              <span class="ap-toggle-name">Enabled</span>
              <span v-if="get(masterId)!.description" class="ap-toggle-desc">{{ get(masterId)!.description }}</span>
            </div>
            <button type="button" class="ks-switch" :class="{ on: drafts[masterId] }" role="switch"
              :aria-checked="!!drafts[masterId]" @click="drafts[masterId] = !drafts[masterId]">
              <span class="ks-switch-knob" />
            </button>
          </div>

          <div v-for="g in globalGroups" :key="g.title" class="pv-group">
            <h3 class="pv-group-title"><Icon :icon="g.icon" aria-hidden="true" /> {{ g.title }}</h3>

            <div v-for="id in g.ids" :key="id" class="pv-field">
              <template v-if="kindOf(get(id)!) === 'bool'">
                <div class="ap-toggle-row">
                  <div class="ap-toggle-text">
                    <span class="ap-toggle-name">{{ get(id)!.description || get(id)!.key }}</span>
                  </div>
                  <button type="button" class="ks-switch" :class="{ on: drafts[id] }" role="switch"
                    :aria-checked="!!drafts[id]" @click="drafts[id] = !drafts[id]"><span class="ks-switch-knob" /></button>
                </div>
              </template>

              <template v-else>
                <label class="ap-blabel">{{ get(id)!.description || get(id)!.key }}</label>

                <select v-if="kindOf(get(id)!) === 'group'" class="ap-binput"
                  :value="drafts[id]" @change="drafts[id] = ($event.target as HTMLSelectElement).value">
                  <option value="">— none —</option>
                  <option v-for="o in scopes" :key="o.id" :value="o.id">{{ o.label }}</option>
                </select>

                <div v-else-if="kindOf(get(id)!) === 'mapping'" class="ks-map">
                  <div v-for="(row, i) in (drafts[id] as Pair[])" :key="i" class="ks-map-row">
                    <input class="ap-binput" placeholder="IdP group" :value="row.k"
                      @input="row.k = ($event.target as HTMLInputElement).value" />
                    <Icon icon="tabler:arrow-right" class="ks-map-arrow" aria-hidden="true" />
                    <select class="ap-binput" :value="row.v" @change="row.v = ($event.target as HTMLSelectElement).value">
                      <option value="">— select group —</option>
                      <option v-for="o in scopes" :key="o.id" :value="o.id">{{ o.label }}</option>
                    </select>
                    <button type="button" class="ap-icon-btn" title="Remove" aria-label="Remove mapping" @click="removeRow(id, i)"><Icon icon="tabler:trash" aria-hidden="true" /></button>
                  </div>
                  <button type="button" class="ap-icon-btn ks-map-add" title="Add mapping" aria-label="Add mapping" @click="addRow(id)"><Icon icon="tabler:plus" aria-hidden="true" /></button>
                </div>

                <input v-else type="text" class="ap-binput" :class="{ 'ap-binput-invalid': fieldErrors[id] }"
                  :placeholder="kindOf(get(id)!) === 'list' ? 'space or comma separated' : ''"
                  :value="drafts[id]" @input="drafts[id] = ($event.target as HTMLInputElement).value" />

                <p v-if="fieldErrors[id]" class="ap-hint ap-hint-err">{{ fieldErrors[id] }}</p>
              </template>
            </div>
          </div>
        </section>

        <!-- The selected provider owns its card chrome. -->
        <template v-if="showProviders">
          <WcMount v-for="p in visibleProviders" :key="p.id"
            :tag="p.ui_component || DEFAULT_CARD_TAG" :config="cardConfig(p)"
            @change="onProviderChange" />
        </template>
      </div>

    </div>
  </div>
</template>
