// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { PluginProjection, PluginState } from '../../types'

export function projectionError(projection: PluginProjection): string | undefined {
  return typeof projection.error === 'string' ? projection.error : projection.error?.message
}

export function projectionHealth(projection: PluginProjection, head: number): string {
  const cause = projectionError(projection)
  if (projection.parked) return 'Stopped: ' + (cause ?? 'Projection is parked')
  if (cause) return 'Degraded: ' + cause
  if (projection.bootstrapping) return 'Initializing'
  return projection.last_seq >= head ? 'Up to date' : 'Catching up'
}

export function pluginIssue(option: PluginState, state?: PluginState) {
  const failure = state?.lifecycle.error
  const problem = state?.problem ?? option.problem
  if (option.installed === false) {
    return { kind: 'missing', status: 'Not installed', cause: 'This board still references a plugin that is no longer installed.' } as const
  }
  if (problem?.code === 'plugin_config_invalid' || failure?.code === 'plugin_config_invalid') {
    return { kind: 'configuration', status: 'Misconfigured', cause: problem?.message ?? failure?.message } as const
  }
  if (problem) return { kind: 'manifest', status: 'Plugin unavailable', cause: problem.message } as const
  if (failure?.source === 'schema_provider') {
    return { kind: 'provider', status: 'Schema provider failed', cause: failure.message } as const
  }
  if (failure?.code === 'plugin_projection_gap') {
    return { kind: 'history', status: 'History gap', cause: failure.message, floor: failure.floor } as const
  }
  if (state?.lifecycle.state === 'failed') {
    return { kind: 'setup', status: 'Attachment setup failed', cause: failure?.message ?? 'Work could not prepare the plugin attachment.' } as const
  }
  const projections = Object.values(state?.projections ?? {})
  if (projections.some(projection => projection.parked)) return { kind: 'reset', status: 'Needs reset' } as const
  if (projections.some(projectionError)) return { kind: 'degraded', status: 'Degraded' } as const
}
