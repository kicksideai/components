// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { computed, onUnmounted, watch, type Ref } from 'vue'
import { host } from '@wippy-fe/proxy'
import { pim } from '../../api'
import { clone } from '../../state'
import type { PluginProjection, PluginView, SchemaOptions, SchemaView } from '../../types'
import { requestGeneration } from '../../shared/requests'

const statuses = {
  failed: { label: 'Setup failed', severity: 'danger' },
  paused: { label: 'Background update paused', severity: 'warn' },
  degraded: { label: 'Degraded', severity: 'warn' },
  catchingUp: { label: 'Catching up', severity: 'info' },
  config: { label: 'Configuration needed', severity: 'warn' },
  reset: { label: 'Reset required', severity: 'warn' },
  uninstalled: { label: 'Uninstalled · still referenced', severity: 'warn' },
  pending: { label: 'Setting up', severity: 'info' },
} as const

export function projectionPending(projection: PluginProjection, position: number) {
  return !projection.parked && (projection.bootstrapping || projection.last_seq < position)
}

export function pluginPending(plugin: PluginView, position: number) {
  if (!plugin.active || !plugin.installed || plugin.problem || plugin.lifecycle.state === 'failed') return false
  return plugin.lifecycle.state === 'pending' || Object.values(plugin.projections).some(cursor => projectionPending(cursor, position))
}

export function pluginStatus(plugin: PluginView, position: number) {
  const error = plugin.problem ?? plugin.lifecycle.error
  const projections = Object.entries(plugin.projections)
  const projection = projections.find(([, cursor]) => cursor.parked)
    ?? projections.find(([, cursor]) => cursor.error)
    ?? projections.find(([, cursor]) => projectionPending(cursor, position))
  let kind: keyof typeof statuses | undefined
  if (plugin.active && !plugin.installed) kind = 'uninstalled'
  else if (error?.code === 'plugin_config_invalid') kind = 'config'
  else if (error?.code === 'plugin_projection_history_pruned') kind = 'reset'
  else if (error || plugin.lifecycle.state === 'failed') kind = 'failed'
  else if (plugin.active && projection?.[1].parked) kind = 'paused'
  else if (plugin.active && projection?.[1].error) kind = 'degraded'
  else if (plugin.active && projection) kind = 'catchingUp'
  else if (plugin.active && plugin.lifecycle.state === 'pending') kind = 'pending'
  return kind ? { kind, ...statuses[kind], error, projection } : undefined
}

export function installedInterfaceProblem(plugin: PluginView) {
  return (plugin.problem ?? plugin.lifecycle.error)?.code === 'plugin_interface_version_unsupported'
}

export function usePluginOperations({
  catalogId, shouldPoll, schema, options, busy, stale, editable, saved, clearError, reportError,
}: {
  catalogId: () => string
  shouldPoll: () => boolean
  schema: Ref<SchemaView | null>
  options: Ref<SchemaOptions | null>
  busy: Ref<boolean>
  stale: Readonly<Ref<boolean>>
  editable: Readonly<Ref<boolean>>
  saved: Ref<string>
  clearError: () => void
  reportError: (cause: unknown, fallback: string) => void
}) {
  const pluginReads = requestGeneration()
  const resetActions = requestGeneration()
  watch(catalogId, resetActions.begin)
  onUnmounted(() => { pluginReads.begin(); resetActions.begin() })

  async function refreshPluginStatus(showError = false) {
    const id = catalogId(), current = schema.value, request = pluginReads.begin()
    try {
      const [updated, available] = await Promise.all([pim.schema(id), showError ? pim.schemaOptions(id) : undefined])
      if (!current || !pluginReads.current(request) || id !== catalogId() || schema.value !== current) return false
      current.plugins = updated.plugins
      current.as_of = updated.as_of
      if (available) options.value = available
      return true
    } catch (cause) {
      if (showError && pluginReads.current(request) && id === catalogId()) reportError(cause, 'Could not check plugin status.')
      return false
    }
  }

  async function resetPlugin(plugin: string) {
    const id = catalogId()
    const active = schema.value?.plugins.find(row => row.plugin === plugin && row.active && row.installed)
    if (!active?.config || busy.value || stale.value || !editable.value) return
    if (!await host.confirm({
      header: 'Reset background updates?',
      message: 'Background updates will start from a new catalog event. Current product data will be rebuilt into the plugin’s index. Earlier events will be skipped.',
      acceptLabel: 'Reset background updates',
      rejectLabel: 'Cancel',
    }) || catalogId() !== id) return
    if (busy.value) return
    const action = resetActions.begin()
    pluginReads.begin()
    busy.value = true
    clearError()
    saved.value = ''
    try {
      await pim.configurePlugin(id, plugin, clone(active.config), true)
      if (resetActions.current(action) && await refreshPluginStatus(true) && resetActions.current(action)) {
        saved.value = 'Background update reset requested.'
      }
    } catch (e) {
      if (resetActions.current(action)) reportError(e, 'Could not reset background updates.')
    } finally { if (resetActions.current(action)) busy.value = false }
  }

  async function resumePluginProjection(cursorId: string) {
    const id = catalogId()
    if (busy.value || stale.value || !editable.value) return
    busy.value = true
    clearError()
    saved.value = ''
    try {
      await pim.resumePluginProjection(id, cursorId)
      if (catalogId() === id && await refreshPluginStatus(true)) saved.value = 'Background update resumed.'
    } catch (cause) {
      if (catalogId() === id) reportError(cause, 'Could not resume the background update.')
    } finally { if (catalogId() === id) busy.value = false }
  }

  async function clearShellBinding(binding: string) {
    const id = catalogId()
    if (busy.value || stale.value || !editable.value) return
    if (!await host.confirm({
      header: 'Clear catalog app binding?',
      message: 'The catalog will use the default app after this setting is saved.',
      acceptLabel: 'Clear binding',
      rejectLabel: 'Cancel',
    }) || catalogId() !== id || busy.value || !editable.value ||
      !schema.value?.plugins.some(plugin => plugin.references?.shell_bindings.includes(binding))) return
    busy.value = true
    clearError()
    saved.value = ''
    try {
      await pim.updateCatalogApp(id, '')
      if (catalogId() !== id) return
      if (await refreshPluginStatus(true)) saved.value = 'Catalog app binding cleared.'
    } catch (cause) {
      if (catalogId() === id) reportError(cause, 'Could not clear the catalog app binding.')
    } finally { if (catalogId() === id) busy.value = false }
  }

  const pollPlugins = computed(() => shouldPoll() && !busy.value &&
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

  return { refreshPluginStatus, resetPlugin, resumePluginProjection, clearShellBinding }
}
