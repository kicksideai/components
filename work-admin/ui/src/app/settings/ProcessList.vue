<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import type { Process, State, Transition } from '../../types'
import { categoryTitle, kindTitle, stateTitle, transitionTitle } from './process'
defineProps<{ process: Process; selectedState?: State; selectedTransition?: Transition }>()
defineEmits<{ state: [state: State]; transition: [transition: Transition]; removeState: [state: State]; removeTransition: [transition: Transition]; addTransition: [] }>()
</script>
<template>
  <section class="work-process-list work-stack" aria-label="Process list">
    <label class="work-stack work-tight"
      >Process name<InputText v-model="process.name" aria-label="Process name"
    /></label>
    <h3>States</h3>
    <div class="work-table-scroll">
      <table class="work-settings-table work-process-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phase</th>
            <th>Kind</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="state in process.states" :key="state.id" :aria-selected="selectedState === state">
            <td><InputText v-model="state.name" :aria-label="'Name of ' + stateTitle(state)" /></td>
            <td>{{ categoryTitle(state.category) }}</td>
            <td>
              <Tag severity="secondary">{{ kindTitle(state.kind) }}</Tag>
            </td>
            <td class="work-process-list-actions">
              <Button
                size="small"
                text
                severity="secondary"
                aria-label="Edit state"
                @click="$emit('state', state)"
                ><Icon icon="tabler:pencil" /></Button
              ><Button
                size="small"
                text
                severity="danger"
                :aria-label="'Remove state ' + stateTitle(state)"
                @click="$emit('removeState', state)"
                ><Icon icon="tabler:trash"
              /></Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <h3>Transitions</h3>
    <div class="work-table-scroll">
      <table class="work-settings-table work-process-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>From</th>
            <th>To</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="transition in process.transitions ?? []"
            :key="transition.id"
            :aria-selected="selectedTransition === transition"
          >
            <td>
              <InputText
                v-model="transition.name"
                :placeholder="transitionTitle(transition)"
                :aria-label="'Name of ' + transitionTitle(transition)"
              />
            </td>
            <td>
              {{
                transition.from === 'any'
                  ? 'Any state'
                  : transition.from
                      .map((id) => stateTitle(process.states.find((s) => s.id === id)))
                      .join(', ')
              }}
            </td>
            <td>{{ stateTitle(process.states.find((s) => s.id === transition.to)) }}</td>
            <td class="work-process-list-actions">
              <Button
                size="small"
                text
                severity="secondary"
                aria-label="Edit transition"
                @click="$emit('transition', transition)"
                ><Icon icon="tabler:pencil" /></Button
              ><Button
                size="small"
                text
                severity="danger"
                :aria-label="'Remove transition ' + transitionTitle(transition)"
                @click="$emit('removeTransition', transition)"
                ><Icon icon="tabler:trash"
              /></Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Button label="Add transition" severity="secondary" outlined @click="$emit('addTransition')"
      ><template #icon><Icon icon="tabler:plus" /></template
    ></Button>
  </section>
</template>
