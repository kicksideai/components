// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import { computed, ref, watch, type Ref } from 'vue'
import { availablePack, packChoice, planUpgrade, upgradeRequest, type PackPlan, type PackRequest, type PackResult } from '../../packs'
import { formatApiError } from '../../transport'
import type { Schema } from '../../types'
import { usePackDiscovery } from '../usePackDiscovery'
import { settings } from './api'
import { clone, type PluginConfigs } from './model'

interface PackOperation { request: PackRequest; key: string; result: PackResult; draft: string }

export function usePackReview(context: {
  boardId: () => string
  schema: Ref<Schema | undefined>
  configs: Ref<PluginConfigs>
  busy: Ref<boolean>
  schemaDirty: () => boolean
  migrationPending: () => boolean
  canReview: () => boolean
  authorized: () => boolean
  draftSnapshot: () => string
  openReview: () => void
  clearSaved: () => void
  applied: (generation: number, draft: string) => Promise<void>
}) {
  const { schema, configs, busy } = context
  const { packs: discovered, loading, error, load, reset: resetDiscovery } = usePackDiscovery()
  const packs = computed(() => discovered.value.filter(availablePack))
  const choices = computed(() => discovered.value.map(packChoice))
  const installing = ref(false), installPack = ref('')
  const installChoice = computed(() => choices.value.find(pack => pack.id === installPack.value && !pack.disabled))

  const request = ref<PackRequest>(), preview = ref<PackPlan>()
  const reviewed = ref<{ request: PackRequest; key: string }>()
  const showPlan = ref(false), reviewError = ref('')
  const operation = ref<PackOperation>(), operationError = ref('')
  const result = computed(() => operation.value?.result)
  const inProgress = computed(() => !!result.value && result.value.status !== 'done')
  const dirty = computed(() => !!request.value || context.schemaDirty())
  const canManage = computed(() => !busy.value && !dirty.value && !context.migrationPending() && !inProgress.value)
  const plan = computed(() => showPlan.value ? preview.value : undefined)
  const isReviewed = computed(() => !!plan.value && !!reviewed.value && JSON.stringify(reviewed.value.request) === JSON.stringify(request.value))
  const canApply = computed(() => context.canReview() && !context.migrationPending() && !busy.value && isReviewed.value
    && plan.value?.class !== 'refused' && !plan.value?.refused.length
    && preview.value?.conflicts.every(conflict => !!request.value?.resolutions?.[conflict.path]))
  const plugins = computed(() => packs.value.find(pack => pack.id === request.value?.pack)?.plugins
    .filter(plugin => !schema.value?.plugins?.some(state => state.plugin === plugin.plugin && state.active))
    .map(plugin => ({ use: plugin.plugin })) ?? [])
  const title = computed(() => packs.value.find(pack => pack.id === schema.value?.pack?.id)?.title || 'Installed pack')
  const upgradeAvailable = computed(() => !error.value && !!schema.value?.outdated
    && choices.value.some(pack => pack.id === schema.value?.pack?.id && !pack.disabled))
  const upgradeReason = computed(() => error.value ? 'Reload packs to check available upgrades.'
    : inProgress.value ? 'Finish the current pack installation before upgrading.'
    : !upgradeAvailable.value ? 'Install an available version of this pack to upgrade.'
    : dirty.value ? 'Discard the current draft before upgrading.'
    : context.migrationPending() ? 'Finish the current migration before upgrading.'
    : busy.value ? 'Wait for the current request to finish.' : undefined)

  const beginReview = latestRequest()
  function changed() { reviewed.value = undefined }
  function invalidate() {
    beginReview()
    changed()
    showPlan.value = false
  }
  function clear() {
    request.value = undefined
    preview.value = undefined
    invalidate()
  }
  function reset() {
    clear()
    resetDiscovery()
    operation.value = undefined
    operationError.value = ''
  }
  function clearReviewError() { reviewError.value = '' }

  watch(configs, value => {
    if (!request.value) return
    if (Object.keys(value).length) request.value.plugin_configs = clone(value)
    else delete request.value.plugin_configs
  }, { deep: true, flush: 'sync' })

  async function review() {
    if (!request.value || busy.value || !context.canReview()) return
    const current = beginReview(), input = clone(request.value), before = JSON.stringify(request.value)
    busy.value = true
    clearReviewError()
    context.clearSaved()
    try {
      const response = await planUpgrade(input, input => settings.packPlan(context.boardId(), input))
      if (!current() || before !== JSON.stringify(request.value)) return
      preview.value = response.plan
      showPlan.value = true
      request.value = response.request
      reviewed.value = { request: clone(response.request), key: crypto.randomUUID() }
    } catch (e) {
      if (current()) {
        changed()
        reviewError.value = formatApiError(e, 'Could not review the pack.')
      }
    } finally { busy.value = false }
  }
  async function upgrade() {
    if (!schema.value?.pack || !canManage.value || !upgradeAvailable.value) return
    const installed = packs.value.find(pack => pack.id === schema.value?.pack?.id)
    if (!installed) return
    request.value = upgradeRequest(installed, schema.value.generation)
    context.openReview()
    await review()
  }
  async function install() {
    const pack = packs.value.find(pack => pack.id === installPack.value)
    if (!schema.value || !pack || !installChoice.value || !canManage.value || loading.value) return
    request.value = upgradeRequest(pack, schema.value.generation)
    installing.value = false
    context.openReview()
    await review()
  }
  async function applyRequest(request: PackRequest, key: string, draft: string) {
    const boardId = context.boardId()
    const response = await settings.packApply(boardId, request, key)
    if (context.boardId() !== boardId) return
    operation.value = { request, key, result: response, draft }
    await context.applied(response.generation, draft)
  }
  async function apply() {
    if (!canApply.value || !reviewed.value) return false
    busy.value = true
    clearReviewError()
    try {
      await applyRequest(clone(reviewed.value.request), reviewed.value.key, context.draftSnapshot())
      return true
    } catch (e) {
      reviewError.value = formatApiError(e, 'Could not apply the pack upgrade.')
      return false
    } finally { busy.value = false }
  }
  async function continueInstallation() {
    const pending = operation.value
    if (!pending || !inProgress.value || busy.value || !context.authorized()) return
    busy.value = true
    operationError.value = ''
    try { await applyRequest(pending.request, pending.key, pending.draft) }
    catch (e) { operationError.value = formatApiError(e, 'Could not continue the pack installation.') }
    finally { busy.value = false }
  }
  return {
    choices, loading, error, load, installing, installPack, installChoice, canManage, title, upgradeAvailable, upgradeReason,
    request, preview, plan, reviewError, isReviewed, canApply, plugins, result, inProgress, operationError,
    install, upgrade, review, apply, continueInstallation, changed, invalidate, clearReviewError, clear, reset,
  }
}
