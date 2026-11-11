<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Checkbox from 'primevue/checkbox'
import {Icon} from '@iconify/vue'
import {api, loadByTagName} from '@wippy-fe/proxy'
import {useEvents} from '@wippy-fe/webcomponent-vue'
interface CapabilityValue {traits:string[]; trait_contexts:Record<string, unknown>}
type View='loading'|'failed'|'model-setup'|'configuring'|'create'
const emit=useEvents<{done:{status:'skipped'}; navigate:{path:string;startToken:string}}>()
const DEFAULT_TITLE='My Assistant'
const DEFAULT_TRAITS=['kickside.agents.traits:trait_master','kickside.agents.traits:artifacts','kickside.uploads.traits:file_manager']
const title=ref(DEFAULT_TITLE)
const model=ref('')
const memory=ref(true)
const capabilities=ref<CapabilityValue>({traits:[...DEFAULT_TRAITS],trait_contexts:{'kickside.agents.traits:trait_master':{inject_trait_catalog:true}}})
const loading=ref(true)
const ready=ref(false)
const busy=ref(false)
const error=ref('')
const createdId=ref('')
const modelNames=ref<string[]>([])
const modelClasses=ref<string[]>([])
const defaultConfigured=computed(()=>modelClasses.value.includes('class:fast'))
const modelConfigured=computed(()=>modelNames.value.length>0)
const configuring=ref(false)
const hasModel=computed(()=>model.value?modelNames.value.includes(model.value)||modelClasses.value.includes(model.value):defaultConfigured.value)
const canCreate=computed(()=>ready.value&&!loading.value&&!busy.value&&!!title.value.trim()&&hasModel.value)
const view=computed<View>(()=>{
  if(loading.value) return 'loading'
  if(!ready.value) return 'failed'
  if(configuring.value) return 'configuring'
  return modelConfigured.value?'create':'model-setup'
})
function message(cause:unknown):string {
  const e=cause as {response?:{data?:{error?:string}};message?:string}
  return e?.response?.data?.error||e?.message||String(cause)
}
function capabilityChange(event:Event) {
  const value=(event as CustomEvent<CapabilityValue>).detail
  capabilities.value={traits:[...value.traits],trait_contexts:{...value.trait_contexts}}
}
function dismiss() {emit('done',{status:'skipped'})}
async function load() {
  loading.value=true;ready.value=false;error.value=''
  try {
    await Promise.all([
      loadByTagName('wc-model-picker',{timeoutMs:8000}),
      loadByTagName('wc-agent-trait-picker',{timeoutMs:8000}),
    ])
    const [modelsResponse,classesResponse]=await Promise.all([
      api.get('/api/v1/models/list?capability=generate'),
      api.get('/api/v1/models/classes'),
    ])
    if(modelsResponse.data?.success!==true||classesResponse.data?.success!==true) throw new Error('Could not check model configuration.')
    modelNames.value=modelsResponse.data.models.map((m:{name:string})=>m.name)
    modelClasses.value=classesResponse.data.classes
      .filter((c:{name:string;models:{name:string}[]})=>c.models.length>0&&modelNames.value.includes(c.models[0].name))
      .map((c:{name:string})=>`class:${c.name}`)
    ready.value=true
  } catch(cause) {error.value=message(cause)} finally {loading.value=false}
}
async function configureModel() {
  error.value=''
  try {
    await loadByTagName('kickside-onboard-models',{timeoutMs:8000})
    configuring.value=true
  } catch(cause) {error.value=message(cause)}
}
async function modelSetupDone() {
  configuring.value=false
  await load()
}
async function create() {
  if(!canCreate.value) return
  busy.value=true;error.value=''
  try {
    if(!createdId.value) {
      const input:{memory:boolean;title:string;model?:string;traits?:string[];trait_contexts?:Record<string,unknown>}={title:title.value.trim(),memory:memory.value}
      if(model.value) input.model=model.value
      if(capabilities.value.traits.length) {
        input.traits=[...capabilities.value.traits]
        input.trait_contexts={...capabilities.value.trait_contexts}
      }
      const {data}=await api.post('/api/v1/agent-onboarding/agents',input)
      if(data?.success!==true||!data.component_id) throw new Error(data?.error||'Could not create your agent.')
      createdId.value=data.component_id
    }
    const {data}=await api.get('/api/v1/agents/list')
    if(data?.success!==true) throw new Error(data?.error||'Could not open your agent.')
    const agent=data.agents.find((a:{name:string})=>a.name===`user_agent:${createdId.value}`)
    if(!agent?.start_token) throw new Error('Your agent is created. Chat is unavailable; retry to open it.')
    emit('navigate',{path:'/sessions',startToken:agent.start_token})
  } catch(cause) {error.value=message(cause)} finally {busy.value=false}
}
onMounted(load)
</script>

<template>
  <div class="onboarding">
    <p v-if="view === 'loading'" class="status" role="status">Loading your choices…</p>

    <div v-else-if="view === 'failed'" class="stack">
      <p class="error" role="alert">{{error}}</p>
      <div class="actions">
        <Button type="button" data-dismiss label="Skip for now" severity="secondary" @click="dismiss" />
        <Button type="button" label="Retry" @click="load" />
      </div>
    </div>

    <section v-else-if="view === 'model-setup'" class="model-setup" aria-labelledby="model-setup-title">
      <header class="head">
        <span class="head-icon" aria-hidden="true"><Icon icon="tabler:cpu" /></span>
        <h2 id="model-setup-title" class="title">Set up a model</h2>
      </header>
      <p class="text">Agents need a language model to respond, and none is connected to this workspace yet. Connect a model provider to continue, or ask an administrator if you do not manage models.</p>
      <p v-if="error" class="error" role="alert">{{error}}</p>
      <div class="actions">
        <Button type="button" data-dismiss label="Cancel" severity="secondary" @click="dismiss" />
        <Button type="button" label="Set up a model" @click="configureModel" />
      </div>
    </section>

    <section v-else-if="view === 'configuring'" class="stack" aria-labelledby="model-config-title">
      <header class="head">
        <span class="head-icon" aria-hidden="true"><Icon icon="tabler:cpu" /></span>
        <h2 id="model-config-title" class="title">Set up a model</h2>
      </header>
      <component :is="'kickside-onboard-models'" class="model-config" @done.stop="modelSetupDone" @back.stop="configuring=false" />
    </section>

    <form v-else class="stack" aria-labelledby="create-agent-title" @submit.prevent="create">
      <h2 id="create-agent-title" class="title">Create your first agent</h2>
      <p class="intro">Your assistant starts with every installed capability. Rename it or adjust its capabilities, or remove them all for a general-purpose agent.</p>
      <fieldset :disabled="busy || !!createdId">
        <div class="field-row">
          <div class="field">
            <label for="first-agent-title">Agent name</label>
            <InputText id="first-agent-title" v-model="title" name="title" autocomplete="off" maxlength="120" fluid />
          </div>
          <div class="field">
            <span id="first-agent-model" class="label">Model</span>
            <wc-model-picker :value="model" capability="generate" aria-labelledby="first-agent-model" @select="model = $event.detail" />
            <p v-if="!defaultConfigured" class="hint">This workspace has no default model; choose one.</p>
          </div>
        </div>
        <div class="field">
          <div class="memory-choice">
            <Checkbox v-model="memory" input-id="first-agent-memory" binary />
            <label for="first-agent-memory">Personal memory</label>
          </div>
          <p class="hint">Remember your preferences and useful details across conversations.</p>
        </div>
        <wc-agent-trait-picker :value="JSON.stringify(capabilities)" aria-label="Agent capabilities" @change="capabilityChange" />
      </fieldset>
      <p v-if="error" class="error" role="alert">{{error}}</p>
      <div class="actions">
        <Button type="button" data-dismiss label="Skip for now" severity="secondary" :disabled="busy" @click="dismiss" />
        <Button type="submit" :label="busy?'Creating…':createdId?'Open agent chat':'Create agent'" :disabled="!canCreate" />
      </div>
    </form>
  </div>
</template>
