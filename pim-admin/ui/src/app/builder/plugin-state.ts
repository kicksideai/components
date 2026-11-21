// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { PluginProjection, PluginView } from '../../types'

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
