<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import {api, loadByTagName} from '@wippy-fe/proxy'
import {useEvents} from '@wippy-fe/webcomponent-vue'
interface CapabilityValue {traits:string[]; trait_contexts:Record<string, unknown>}
const emit=useEvents<{done:{status:'skipped'}; navigate:{path:string;startToken:string}}>()
const DEFAULT_TITLE='My Assistant'
const DEFAULT_TRAITS=['kickside.agents.traits:trait_master','kickside.agents.traits:artifacts','kickside.uploads.traits:file_manager']
const title=ref(DEFAULT_TITLE)
const model=ref('')
const capabilities=ref<CapabilityValue>({traits:[...DEFAULT_TRAITS],trait_contexts:{'kickside.agents.traits:trait_master':{inject_trait_catalog:true}}})
const loading=ref(true)
const ready=ref(false)
const busy=ref(false)
const error=ref('')
const createdId=ref('')
const modelNames=ref<string[]>([])
const modelClasses=ref<string[]>([])
const defaultConfigured=computed(()=>modelClasses.value.includes('class:fast'))
const configuring=ref(false)
const hasModel=computed(()=>model.value?modelNames.value.includes(model.value)||modelClasses.value.includes(model.value):defaultConfigured.value)
const canCreate=computed(()=>ready.value&&!loading.value&&!busy.value&&!!title.value.trim()&&hasModel.value)
function message(cause:unknown):string {
  const e=cause as {response?:{data?:{error?:string}};message?:string}
  return e?.response?.data?.error||e?.message||String(cause)
}
function capabilityChange(event:Event) {
  const value=(event as CustomEvent<CapabilityValue>).detail
  capabilities.value={traits:[...value.traits],trait_contexts:{...value.trait_contexts}}
}
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
      const input:{title:string;model?:string;traits?:string[];trait_contexts?:Record<string,unknown>}={title:title.value.trim()}
      if(model.value) input.model=model.value
      if(capabilities.value.traits.length) {
        input.traits=[...capabilities.value.traits]
        input.trait_contexts={...capabilities.value.trait_contexts}
      }
      const {data}=await api.post('/api/v1/user-agents',input)
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
    <div class="onboarding-intro"><p>Your assistant starts with every installed capability. Rename it or adjust its capabilities, or remove them all for a general-purpose agent.</p></div>
    <p v-if="loading" role="status">Loading your choices…</p>
    <form v-else class="onboarding-form" @submit.prevent="create">
      <section v-if="!hasModel" aria-label="Configure a model">
        <h3>Configure a model</h3>
        <p>Connect a generation model before creating your agent. Ask an administrator to configure one if you do not have model settings access.</p>
        <Button type="button" label="Configure a model" @click="configureModel" />
        <Button type="button" label="Check model configuration" @click="load" />
        <component v-if="configuring" :is="'kickside-onboard-models'" @done="modelSetupDone" @back="configuring=false" />
      </section>
      <fieldset :disabled="busy || !!createdId || !ready">
        <label for="first-agent-title">Agent name</label>
        <InputText id="first-agent-title" v-model="title" name="title" autocomplete="off" maxlength="120" />
        <div class="capabilities">
          <wc-agent-trait-picker :value="JSON.stringify(capabilities)" aria-label="Agent capabilities" @change="capabilityChange" />
        </div>
        <details :open="!defaultConfigured"><summary>Choose a model <span v-if="defaultConfigured" class="hint">(optional)</span></summary>
          <p class="hint">Choose a configured model, or use the platform default when one is available.</p>
          <wc-model-picker :value="model" capability="generate" aria-label="Agent model" @select="model = $event.detail" />
        </details>
      </fieldset>
      <p v-if="error" class="error" role="alert">{{error}}</p>
      <Button v-if="!ready" type="button" label="Retry loading choices" @click="load" />
      <div class="actions">
        <Button type="button" data-dismiss label="Skip for now" severity="secondary" :disabled="busy" @click="emit('done',{status:'skipped'})" />
        <Button type="submit" :label="busy?'Creating…':createdId?'Open agent chat':'Create agent'" :disabled="!canCreate" />
      </div>
    </form>
  </div>
</template>
