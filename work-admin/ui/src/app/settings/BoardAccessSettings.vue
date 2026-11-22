<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import { computed, onUnmounted, ref, watch } from 'vue'
import { api } from '@wippy-fe/proxy'
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { Icon } from '@iconify/vue'
import type { BoardRow, Declaration } from '../../types'
import { usePrincipalNames } from '../../principals'
import BoardShare from './BoardShare.vue'
import VisibilityEditor from './VisibilityEditor.vue'

const props = defineProps<{ boardId: string; draft: Declaration; active: boolean; board?: BoardRow; busy: boolean }>()
defineEmits<{ validity: [valid: boolean] }>()
interface Grant { subject_id: string; subject_type?: 'user' | 'group'; full_name?: string; email?: string; access_mask: number; owner?: boolean }
interface Capability { key: string; bit: number; label: string }
const grants = ref<Grant[]>()
const capabilities = ref<Capability[]>([])
const memberGroups = computed(() => grants.value?.filter(grant => grant.subject_type === 'group').length ?? 0)
const memberPeople = computed(() => (grants.value?.length ?? 0) - memberGroups.value)
const memberPreview = computed(() => [...(grants.value ?? [])]
  .sort((a, b) => Number(!!b.owner) - Number(!!a.owner) || b.access_mask - a.access_mask)
  .slice(0, 6).map(grant => ({ ...grant, permissions: memberPermissions(grant) })))
const memberRefs = computed(() => memberPreview.value.map(grant => ({ id: grant.subject_id, kind: grant.subject_type ?? 'user' })))
const names = usePrincipalNames(() => props.boardId, memberRefs)
function memberName(grant: Grant) {
  return grant.full_name || names.label({ id: grant.subject_id, kind: grant.subject_type ?? 'user', email: grant.email })
}
function memberPermissions(grant: Grant) {
  if (grant.owner) return 'Owner'
  return capabilities.value.filter(capability => (grant.access_mask & capability.bit) === capability.bit)
    .map(capability => capability.label).join(', ')
}
const grantsError = ref(false)
const beginRead = latestRequest()
async function load() {
  const current = beginRead()
  grantsError.value = false
  try {
    const [{ data }, model] = await Promise.all([
      api.get('/api/v1/component-access/grants/' + encodeURIComponent(props.boardId)),
      api.get('/api/v1/components/access-model'),
    ])
    if (!current()) return
    if (!data?.success || !Array.isArray(data.access)) throw new Error('Grants unavailable')
    grants.value = data.access
    capabilities.value = model.data?.success && Array.isArray(model.data.capabilities) ? model.data.capabilities : []
  } catch {
    if (current()) { grants.value = undefined; grantsError.value = true }
  }
}
onUnmounted(() => beginRead())
watch(() => [props.active, props.boardId], () => { if (props.active) void load() }, { immediate: true })
</script>

<template>
  <section class="work-ia-section">
    <section class="work-settings-list" aria-labelledby="work-sharing-title">
      <div class="work-settings-row">
        <div class="work-row-main">
          <h3 id="work-sharing-title" class="work-row-title">Members and sharing</h3>
          <p v-if="grants" class="work-muted work-small">{{ memberPeople }} {{ memberPeople === 1 ? 'person' : 'people' }} and {{ memberGroups }} {{ memberGroups === 1 ? 'group' : 'groups' }} with direct access</p>
        </div>
        <BoardShare v-if="board" :board="board" :busy="busy" @shared="load" />
      </div>
      <ul v-if="memberPreview.length" class="work-member-preview" aria-label="People and groups with direct access">
        <li v-for="member in memberPreview" :key="member.subject_type + member.subject_id" class="work-settings-row">
          <Icon :icon="member.subject_type === 'group' ? 'tabler:users' : 'tabler:user'" aria-hidden="true" />
          <strong class="work-spacer">{{ memberName(member) }}</strong>
          <Tag v-if="member.permissions" class="kx-tag-sm" severity="secondary" :value="member.permissions" />
        </li>
      </ul>
      <p v-if="grants && grants.length > memberPreview.length" class="work-settings-row work-muted work-small">
        See all {{ grants.length }} people and groups under Share board.
      </p>
      <p v-else-if="grants && !grants.length" class="work-settings-row work-muted">No direct grants yet.</p>
      <div v-else-if="grantsError" class="work-settings-row">
        <p class="work-spacer work-muted" role="alert">Member summary is unavailable.</p>
        <Button label="Reload members" severity="secondary" text @click="load" />
      </div>
      <p v-else-if="!grants" class="work-settings-row work-muted" role="status">Loading members…</p>
    </section>
    <Disclosure class="work-disclosure work-visibility-disclosure" :label="draft.visibility ? 'Advanced · Item visibility rules set' : 'Advanced · Item visibility'">
      <VisibilityEditor :board-id="boardId" :draft="draft" @validity="$emit('validity', $event)" />
    </Disclosure>
  </section>
</template>
