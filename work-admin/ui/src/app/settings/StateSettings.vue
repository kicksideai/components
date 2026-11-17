<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import InputNumber from 'primevue/inputnumber'
import CapacityControl from './CapacityControl.vue'
import ToggleSwitch from 'primevue/toggleswitch'
import Select from 'primevue/select'
import SelectButton from 'primevue/selectbutton'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import type { Declaration, Process, State } from '../../types'
import JsonInput from './JsonInput.vue'
import DurationControl from './DurationControl.vue'
import PrincipalsPicker from './PrincipalsPicker.vue'
import ConditionEditor from './ConditionEditor.vue'
import TimersEditor from './TimersEditor.vue'
import ChipPicker from './ChipPicker.vue'
import { uniqueId, stateTitle, kindTitle, transitionTitle } from './process'
import PrincipalSourceEditor from './PrincipalSourceEditor.vue'
import ApproversEditor from './ApproversEditor.vue'
const props = defineProps<{ state: State & { stage?: string }; process: Process; draft: Declaration; advanced: boolean; boardId?: string }>()
const emit = defineEmits<{ validity: [key: string, valid: boolean] }>()
const outcomeTransitions = computed(() => (props.process.transitions ?? []).filter(t => t.from === 'any' || t.from.includes(props.state.id)))
const kinds = [{ value: 'human', icon: 'user' }, { value: 'gate', icon: 'shield-check' }, { value: 'automated', icon: 'bolt' }, { value: 'parallel', icon: 'arrows-split' }]
function changeKind(value: string) {
  const s = props.state
  s.kind = value; delete s.run; delete s.release_when; delete s.regions; delete s.join; delete s.due; if (value === 'automated' || value === 'gate') delete s.awaiting
  if (value === 'automated') s.run = { stage: '', retry: { max: 1, backoff: 'PT1M' } }
  if (value === 'gate') s.release_when = { approvals: { min: 1, from: { group: '' }, prevent_self: true } }
  if (value === 'parallel') { s.regions = [{ id: 'region_1', initial: props.process.states.find(state => state.id !== s.id)?.id ?? '' }]; s.join = 'all' }
}
function failure(value: string | null) { if (!props.state.run) return; if (value) props.state.run.on_fail = value; else delete props.state.run.on_fail }

</script>
<template>
  <section class="work-state-settings work-stack" aria-label="State settings">
    <h4 class="work-process-group">Who moves the item on</h4>
    <SelectButton
      class="work-process-kinds"
      :model-value="state.kind ?? 'human'"
      :options="
        kinds.map((kind) => ({
          ...kind,
          label: kindTitle(kind.value),
          disabled: !advanced && kind.value !== 'human' && kind.value !== state.kind,
        }))
      "
      optionLabel="label"
      optionValue="value"
      optionDisabled="disabled"
      :allow-empty="false"
      aria-label="Who moves the item on"
      @update:model-value="changeKind"
    >
      <template #option="{ option }"
        ><span class="work-process-kind"
          ><Icon :icon="'tabler:' + option.icon" /><span>{{ option.label }}</span></span
        ></template
      >
    </SelectButton>
    <template v-if="advanced">
      <template v-if="state.kind === 'gate' && state.release_when">
        <h4 class="work-process-group">Approval</h4>
        <ApproversEditor
          v-if="state.release_when.approvals"
          :board-id="boardId"
          :approvals="state.release_when.approvals"
          @validity="emit('validity', 'approvers', $event)"
        />
        <details class="work-process-options">
          <summary>Release options</summary>
          <div class="work-stack">
            <label class="work-row"
              ><span class="work-spacer">Require approvals</span
              ><ToggleSwitch :model-value="!!state.release_when.approvals" aria-label="Require approvals" @update:model-value="state.release_when.approvals = $event ? { min: 1, from: { group: '' }, prevent_self: true } : undefined" /></label>
            <DurationControl v-model="state.release_when.wait" label="Wait before release" @validity="(valid, key) => emit('validity', key, valid)" />
            <ConditionEditor
              label="Release when"
              :draft="draft"
              :board-id="boardId"
              v-model="state.release_when.when"
              @validity="emit('validity', 'release', $event)"
            />
          </div>
        </details>
      </template>
      <template v-if="state.kind === 'automated' && state.run">
        <h4 class="work-process-group">Automation</h4>
        <label class="work-stack work-tight"
          >What runs<InputText v-model="state.run.stage" aria-label="Stage" required
        /></label>
        <DurationControl v-model="state.run.timeout" label="Attempt timeout" @validity="(valid, key) => emit('validity', key, valid)" />
        <small class="work-muted">Blank uses the board timeout, or one hour.</small>
        <label class="work-row"><span class="work-spacer">Maximum visits</span><InputNumber
          :model-value="state.run.max_visits ?? null" aria-label="Maximum visits" :min="1" :useGrouping="false"
          placeholder="Board default" @update:model-value="state.run.max_visits = $event ?? undefined" /></label>
        <label class="work-stack work-tight">When visits are exhausted<Select
          :model-value="state.run.on_exhausted" aria-label="When visits are exhausted" appendTo="self"
          optionLabel="label" optionValue="value" showClear
          :options="(process.transitions ?? []).filter(t => !t.auto).map(t => ({ label: transitionTitle(t), value: t.id }))"
          @update:model-value="state.run.on_exhausted = $event || undefined" /></label>
        <small class="work-muted">Blank records a failed run and stops automation. A route must leave every incoming state or be global.</small>
        <label class="work-row"
          ><span class="work-spacer">Retry if it fails</span
          ><ToggleSwitch
            :model-value="!!state.run.retry"
            aria-label="Retry if it fails"
            @update:model-value="state.run.retry = $event ? { max: 1, backoff: 'PT1M' } : undefined"
        /></label>
        <template v-if="state.run.retry"
          ><label class="work-row"
            ><span class="work-spacer">Maximum attempts</span
            ><InputNumber v-model="state.run.retry.max" :min="1" :useGrouping="false" /></label
          ><DurationControl v-model="state.run.retry.backoff" label="Wait between attempts" @validity="(valid, key) => emit('validity', key, valid)"
        /></template>
        <label v-for="route in ([{ key: 'on_pass', label: 'On success' }, { key: 'on_cancel', label: 'On cancellation' }] as const)" :key="route.key" class="work-stack work-tight">{{ route.label }}<Select :model-value="state.run[route.key]" :aria-label="route.label" appendTo="self" optionLabel="label" optionValue="value" showClear :options="outcomeTransitions.map(t => ({ label: transitionTitle(t), value: t.id }))" @update:model-value="state.run[route.key] = $event || undefined" /></label>
        <label class="work-stack work-tight"
          >If it fails, go to<Select
            :model-value="state.run.on_fail"
            @update:model-value="failure"
            appendTo="self"
            optionLabel="label"
            optionValue="value"
            showClear
            :options="
              outcomeTransitions.map((t) => ({
                label: transitionTitle(t) + ' → ' + stateTitle(process.states.find((s) => s.id === t.to)),
                value: t.id,
              }))
            "
        /></label>
      </template>
      <template v-if="state.kind === 'parallel' && state.regions">
        <h4 class="work-process-group">Lanes</h4>
        <div
          v-for="(region, index) in state.regions"
          :key="index"
          class="work-process-value work-stack work-tight"
        >
          <div class="work-row">
            <span>Lane {{ index + 1 }}</span
            ><span class="work-spacer"></span
            ><Button
              severity="danger"
              text
              size="small"
              aria-label="Remove lane"
              @click="state.regions.splice(index, 1)"
              ><Icon icon="tabler:trash"
            /></Button>
          </div>
          <label class="work-stack work-tight"
            >Starts at<Select
              v-model="region.initial"
              appendTo="self"
              optionLabel="label"
              optionValue="value"
              :options="
                process.states
                  .filter((s) => s.id !== state.id)
                  .map((s) => ({ label: stateTitle(s), value: s.id }))
              "
          /></label>
        </div>
        <Button
          label="Add lane"
          severity="secondary"
          outlined
          size="small"
          @click="
            state.regions.push({
              id: uniqueId('region', state.regions),
              initial: process.states.find((s) => s.id !== state.id)?.id ?? '',
            })
          "
          ><template #icon><Icon icon="tabler:plus" /></template
        ></Button>
        <label class="work-stack work-tight"
          >Finish rule<Select
            :model-value="typeof state.join === 'number' ? 'count' : (state.join ?? 'all')"
            appendTo="self"
            :options="[
              { label: 'All must pass', value: 'all' },
              { label: 'Any may pass', value: 'any' },
              { label: 'A number must pass', value: 'count' },
            ]"
            optionLabel="label"
            optionValue="value"
            @update:model-value="state.join = $event === 'count' ? 1 : $event"
        /></label>
        <label v-if="typeof state.join === 'number'" class="work-row"
          ><span class="work-spacer">Lanes needed</span
          ><InputNumber v-model="state.join" :min="1" :max="state.regions.length" :useGrouping="false"
        /></label>
      </template>
    </template>
    <p v-else-if="state.kind && state.kind !== 'human'" class="work-muted work-small">
      Enable Advanced to edit this state's execution settings.
    </p>
    <h4 class="work-process-group">Limit</h4>
    <label class="work-row"
      ><span class="work-spacer">Items allowed here</span
      ><CapacityControl :draft="draft" :state="state.id" label="Items allowed here" /></label>
    <label class="work-row"
      ><span class="work-spacer"
        >Refuse moves over the limit<small class="work-muted work-block">Off only warns</small></span
      ><CapacityControl :draft="draft" :state="state.id" label="Refuse moves over the limit" hard /></label>
    <h4 class="work-process-group">Before leaving</h4>
    <ChipPicker
      label="Required fields"
      :options="draft.fields?.map((f) => ({ value: f.code, label: f.title || f.code })) ?? []"
      v-model="state.require"
    />
    <DurationControl v-if="!state.kind || state.kind === 'human'" v-model="state.due" label="Due after" @validity="(valid, key) => emit('validity', key, valid)" />
    <template v-if="advanced">
      <h4 class="work-process-group">Assignment and conditions</h4>
      <label class="work-stack work-tight">Stage label<InputText :model-value="state.stage" aria-label="Stage label" @update:model-value="state.stage = $event || undefined" /></label>
      <template v-if="!state.kind || state.kind === 'human' || state.kind === 'parallel'">
        <label class="work-row"><ToggleSwitch :model-value="!!state.awaiting" aria-label="Awaiting people" @update:model-value="state.awaiting = $event ? { group: '' } : undefined" />Awaiting people</label>
        <PrincipalSourceEditor v-if="state.awaiting" v-model="state.awaiting" :draft="draft" :board-id="boardId" label="Awaiting" @validity="emit('validity', 'awaiting', $event)" />
      </template>
      <PrincipalsPicker :board-id="boardId" v-model="state.assign" label="Assign to" />
      <JsonInput
        label="State checks"
        :example="['installed-check']"
        :model-value="state.invariants"
        shape="array"
        @update:model-value="state.invariants = $event as string[]"
        @validity="emit('validity', 'invariants', $event)"
      />
      <TimersEditor
        :state="state"
        :draft="draft"
        @validity="(key, valid) => emit('validity', 'timer-' + key, valid)"
      />
    </template>
  </section>
</template>
