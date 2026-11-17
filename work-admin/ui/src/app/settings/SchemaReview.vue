<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed } from 'vue'
import type { Declaration } from '../../types'
import Tag from 'primevue/tag'
import Message from 'primevue/message'
import { classDescription, changeReason, type SchemaPlan } from './model'
const props = defineProps<{ declaration?: Declaration; plan?: SchemaPlan; generation: number; follows: string[]; configCount: number; packReview?: boolean }>()
const bindings = computed(() => props.declaration?.processes?.flatMap(process => process.states.filter(state => state.run?.flow_ref).map(state => ({ process: process.name || process.id, state: state.name || state.id, reference: state.run!.flow_ref! }))) ?? [])
</script>
<template>
      <section
        v-if="plan"
        class="work-settings-card work-schema-plan work-stack"
        aria-label="Schema review"
      >
        <p v-if="!plan.changes.length && !plan.refused.length && !configCount && !packReview">No changes to apply.</p>
        <template v-else>
        <header class="work-row">
          <h2>Review</h2>
          <Tag
            class="kx-tag-sm"
            :severity="plan.class === 'refused' ? 'danger' : plan.class === 'semantic' ? 'warn' : plan.class === 'additive' ? 'success' : 'secondary'"
           >{{ plan.class }}</Tag>
          <span class="work-muted work-small">Generation {{ generation }} → {{ plan.generation }}</span>
        </header>
        <p class="work-muted">{{ classDescription[plan.class] || 'Review the classified changes below.' }}</p>
        <p
          v-if="plan.migration"
          class="work-notice"
        >Migration needed: {{ plan.migration }}</p>
        <p
          v-else-if="follows.length"
          class="work-notice"
        >Follow migration: {{ follows.join(', ') }}. Existing items move to the new process generation;
          declared state maps apply.</p>
        <p
          v-else
          class="work-muted work-small"
        >No follow process migration is indicated by these changes.</p>
        <section v-if="bindings.length" class="work-stack work-tight" aria-label="Reviewed Flow bindings">
          <h3>Flow bindings</h3>
          <p v-for="binding in bindings" :key="binding.process + ':' + binding.state">{{ binding.process }} / {{ binding.state }}: {{ binding.reference.id }} · v{{ binding.reference.version }}</p>
          <p class="work-muted work-small">New entries use these exact published versions. Before replacing a binding, stop new entries, drain existing attempts and deliveries, pause the old launcher, save, then resume entries.</p>
        </section>
        <slot />
        <h3 v-if="plan.refused.length">Refused changes</h3>
        <Message v-for="(change, index) in plan.refused" :key="index" severity="error" role="alert">{{ change.code }} · {{ change.what }} · {{ changeReason(change) }}<span v-if="change.to"> → {{ change.to }}</span></Message>
        <table
          v-if="plan.changes.length"
          class="work-settings-table"
        >
          <thead>
            <tr>
              <th>Entry</th>
              <th>Class</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(change, index) in plan.changes"
              :key="index"
            >
              <td>{{ change.code }}</td>
              <td>
                <Tag
                  class="kx-tag-sm"
                  :severity="change.class === 'refused' ? 'danger' : change.class === 'semantic' ? 'warn' : change.class === 'additive' ? 'success' : 'secondary'"
                 >{{ change.class }}</Tag>
              </td>
              <td>{{ change.what }}
                <span v-if="change.detail"> · {{ change.detail }}</span>
                <span v-if="change.to"> → {{ change.to }}</span>
                <span v-if="change.count"> · {{ change.count }} items</span>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>No declaration changes are reported.</p>
        </template>
      </section>
</template>
