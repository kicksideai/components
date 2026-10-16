<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { api } from '@wippy-fe/proxy'
import { useProps, useEvents } from '@wippy-fe/webcomponent-vue'

// The generic provider admin card (kickside-sso-provider). It is provider-
// agnostic: everything it renders comes from the `config` the shell hands it —
// the provider's settings namespace, the fields the admin endpoint listed, and
// the registry-declared presentation (icon, accent, intro, docs). It saves edits
// to the provider's own settings namespace. One Save per card (credentials persist
// before the enable toggle, which the backend validate_func gates on credentials).
// Secrets are write-only: blank keeps the stored value.
interface Field {
  key: string
  value_type: 'bool' | 'string' | 'secret' | 'json' | 'int' | 'duration'
  value?: unknown
  has_value?: boolean
  description?: string
  schema?: { kind?: string } | null
}
interface Ui { accent?: string, intro?: string, docs_url?: string, docs_label?: string }
interface Config { namespace: string, label: string, icon?: string, engine: string, fields: Field[], ui?: Ui | null }

const props = useProps<{ config?: Config | null }>()
const emit = useEvents<{ 'config-changed': { namespace: string, enabled: boolean, configured: boolean } }>()

const cfg = computed<Config | null>(() => props.value.config || null)
const ui = computed<Ui>(() => cfg.value?.ui || {})
const ns = computed(() => cfg.value?.namespace || '')
const fields = computed<Field[]>(() => cfg.value?.fields || [])
const byKey = computed(() => { const m: Record<string, Field> = {}; for (const f of fields.value) m[f.key] = f; return m })
function field(k: string): Field | undefined { return byKey.value[k] }

type Kind = 'bool' | 'secret' | 'list' | 'text'
function kindOf(f: Field): Kind {
  if (f.value_type === 'bool') return 'bool'
  if (f.value_type === 'secret') return 'secret'
  if (f.schema?.kind === 'string_list' || f.value_type === 'json') return 'list'
  return 'text'
}

const drafts = reactive<Record<string, unknown>>({})
const errs = reactive<Record<string, string>>({})
const saving = ref(false)
const savedTick = ref(false)

function toList(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String).filter(Boolean)
  if (typeof v === 'string') return v.split(/[\s,]+/).map(s => s.trim()).filter(Boolean)
  return []
}

function seed() {
  for (const f of fields.value) {
    switch (kindOf(f)) {
      case 'bool': drafts[f.key] = Boolean(f.value); break
      case 'secret': drafts[f.key] = ''; break
      case 'list': drafts[f.key] = toList(f.value).join(' '); break
      default: drafts[f.key] = String(f.value ?? '')
    }
  }
}
watch(cfg, seed, { immediate: true })

function readDraft(f: Field): unknown {
  switch (kindOf(f)) {
    case 'bool': return Boolean(drafts[f.key])
    case 'secret': return String(drafts[f.key] ?? '').length ? drafts[f.key] : undefined
    case 'list': {
      const arr = String(drafts[f.key] ?? '').split(/[\s,]+/).map(s => s.trim()).filter(Boolean)
      return f.value_type === 'json' ? arr : arr.join(' ')
    }
    default: return String(drafts[f.key] ?? '')
  }
}
function storedNorm(f: Field): unknown {
  switch (kindOf(f)) {
    case 'bool': return Boolean(f.value)
    case 'list': { const arr = toList(f.value); return f.value_type === 'json' ? arr : arr.join(' ') }
    default: return String(f.value ?? '')
  }
}
function changed(f: Field): boolean {
  const v = readDraft(f)
  if (v === undefined) return false
  if (kindOf(f) === 'secret') return true
  return JSON.stringify(v) !== JSON.stringify(storedNorm(f))
}

const enabledDraft = computed({
  get: () => Boolean(drafts['enabled']),
  set: (v: boolean) => { drafts['enabled'] = v },
})

// Connection fields are everything except the header toggle and the scopes group,
// ordered so an issuer (needed first) leads, then credentials, then a tenant.
const ORDER: Record<string, number> = { issuer: 0, client_id: 1, client_secret: 2, tenant: 3, allow_unverified_email: 4 }
const connectionFields = computed<Field[]>(() =>
  fields.value
    .filter(f => f.key !== 'enabled' && f.key !== 'scopes')
    .sort((a, b) => (ORDER[a.key] ?? 9) - (ORDER[b.key] ?? 9)))
const scopesField = computed<Field | undefined>(() => field('scopes'))

function isConfigured(): boolean {
  const idHas = String(drafts['client_id'] ?? '').trim().length > 0
  const sec = field('client_secret')
  const secHas = !!sec?.has_value || String(drafts['client_secret'] ?? '').length > 0
  return idHas && secHas
}

const dirty = computed(() => fields.value.some(changed))

// The settings writer returns a structured rejection { namespace, key, message }
// on a validation failure; read its human `message` field. The catch unwraps the
// same body from a non-2xx response.
function reason(v: unknown): string | undefined {
  if (v && typeof v === 'object' && typeof (v as { message?: unknown }).message === 'string') {
    return (v as { message: string }).message
  }
  return undefined
}
function caughtReason(e: unknown): string {
  const resp = e && typeof e === 'object' ? (e as { response?: { data?: unknown } }).response : undefined
  return reason(resp?.data) || (e instanceof Error ? e.message : '') || 'save failed'
}

async function save() {
  if (!ns.value || saving.value) return
  saving.value = true
  // Credentials before the enable toggle (the validate_func gate); save enabled last.
  const order = [...fields.value].sort((a, b) => ((a.key === 'enabled' ? 1 : 0) - (b.key === 'enabled' ? 1 : 0)))
  let ok = false
  for (const f of order) {
    if (!changed(f)) continue
    delete errs[f.key]
    try {
      const { data } = await api.put('/api/v1/settings', { namespace: ns.value, key: f.key, value: readDraft(f) })
      if (data?.success) {
        ok = true
        if (kindOf(f) === 'secret') f.has_value = true
        else f.value = readDraft(f)
      } else {
        errs[f.key] = reason(data) || 'save failed'
      }
    } catch (e) {
      errs[f.key] = caughtReason(e)
    }
  }
  saving.value = false
  if (ok) {
    seed()
    savedTick.value = true
    setTimeout(() => { savedTick.value = false }, 2000)
    emit('config-changed', { namespace: ns.value, enabled: Boolean(drafts['enabled']), configured: isConfigured() })
  }
}
</script>

<template>
  <div v-if="cfg" class="ap">
    <div class="ap-body">
      <header class="ap-bar">
        <span v-if="errs['enabled']" class="ap-msg-inline ap-err"><Icon icon="tabler:alert-triangle" aria-hidden="true" /> {{ errs['enabled'] }}</span>
        <span v-else-if="savedTick" class="ap-saved"><Icon icon="tabler:check" aria-hidden="true" /> Saved</span>
        <button class="ap-btn ap-btn-ghost" :disabled="!dirty || saving" @click="seed">Discard</button>
        <button class="ap-btn ap-btn-primary" :disabled="!dirty || saving" @click="save">
          <Icon :icon="saving ? 'tabler:loader-2' : 'tabler:device-floppy'" :class="saving && 'spin'" aria-hidden="true" />
          {{ saving ? 'Saving…' : 'Save' }}
        </button>
      </header>

      <div class="ap-cards">
        <section class="ap-card">
          <header class="ap-h"><Icon :icon="cfg.icon || 'tabler:plug'" aria-hidden="true" /> {{ cfg.label }}</header>
          <p v-if="ui.intro" class="ap-sub">
            {{ ui.intro }}
            <a v-if="ui.docs_url" :href="ui.docs_url" target="_blank" rel="noopener" class="ap-link">{{ ui.docs_label || 'Docs' }} <Icon icon="tabler:external-link" aria-hidden="true" /></a>
          </p>

          <div class="ap-toggle-row">
            <div class="ap-toggle-text">
              <span class="ap-toggle-name">Enabled</span>
              <span class="ap-toggle-desc">Turn this provider on once its credentials are set.</span>
            </div>
            <button type="button" class="ks-switch" :class="{ on: enabledDraft }" role="switch"
              :aria-checked="enabledDraft" :title="enabledDraft ? 'Enabled' : 'Disabled'"
              @click="enabledDraft = !enabledDraft">
              <span class="ks-switch-knob" />
            </button>
          </div>

          <template v-for="f in connectionFields" :key="f.key">
            <div v-if="kindOf(f) === 'bool'" class="ap-toggle-row">
              <div class="ap-toggle-text">
                <span class="ap-toggle-name">{{ f.description || f.key }}</span>
                <span v-if="errs[f.key]" class="ap-hint ap-hint-err">{{ errs[f.key] }}</span>
              </div>
              <button type="button" class="ks-switch" :class="{ on: Boolean(drafts[f.key]) }" role="switch"
                :aria-checked="Boolean(drafts[f.key])" :title="Boolean(drafts[f.key]) ? 'Enabled' : 'Disabled'"
                @click="drafts[f.key] = !Boolean(drafts[f.key])">
                <span class="ks-switch-knob" />
              </button>
            </div>
            <template v-else>
              <label class="ap-blabel">{{ f.description || f.key }}</label>
              <input v-if="kindOf(f) === 'secret'" type="password" autocomplete="off" class="ap-binput"
                :class="{ 'ap-binput-invalid': errs[f.key] }"
                :placeholder="f.has_value ? '•••••••• set — leave blank to keep' : 'Not set'"
                :value="drafts[f.key]" @input="drafts[f.key] = ($event.target as HTMLInputElement).value" />
              <input v-else class="ap-binput" :class="{ 'ap-binput-invalid': errs[f.key] }" :type="f.key === 'issuer' ? 'url' : 'text'"
                :placeholder="f.key === 'issuer' ? 'https://issuer.example.com' : ''"
                :value="drafts[f.key]" @input="drafts[f.key] = ($event.target as HTMLInputElement).value" />
              <p v-if="errs[f.key]" class="ap-hint ap-hint-err">{{ errs[f.key] }}</p>
            </template>
          </template>

          <template v-if="scopesField">
            <label class="ap-blabel">Scopes</label>
            <input class="ap-binput" placeholder="space or comma separated (optional)"
              :value="drafts['scopes']" @input="drafts['scopes'] = ($event.target as HTMLInputElement).value" />
            <p v-if="scopesField.description" class="ap-hint">{{ scopesField.description }}</p>
          </template>
        </section>
      </div>
    </div>
  </div>
</template>
