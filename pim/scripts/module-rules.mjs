// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { execFile } from 'node:child_process'

export function run(command, args, options = {}, input) {
  return new Promise((resolve, reject) => {
    const child = execFile(command, args, { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, ...options }, (err, stdout) => {
      if (err) reject(err)
      else resolve(stdout)
    })
    if (input !== undefined) child.stdin.end(input)
  })
}

export async function parseYamlDocuments(sources) {
  const result = await run('python3', ['-c', 'import json, sys, yaml; json.dump([yaml.safe_load(source) for source in json.load(sys.stdin)], sys.stdout)'], {}, JSON.stringify(sources))
  return JSON.parse(result)
}

export function checkDependencies(entries) {
  return entries.filter(entry => entry.kind === 'ns.dependency'
    && (typeof entry.version !== 'string' || !(entry.version === '*' || /^(>=|<=|>|<|\^|~)/.test(entry.version))))
    .map(entry => `${entry.name} ns.dependency must declare a compatibility range, never an exact version`)
}

export function checkEndpoints(entries) {
  const failures = []
  const byId = new Map(entries.map(entry => [entry.id, entry]))
  const incoming = new Map()
  for (const endpoint of entries.filter(entry => entry.kind === 'http.endpoint')) {
    const namespace = endpoint.id.split(':')[0]
    const target = typeof endpoint.func === 'string' && (endpoint.func.includes(':') ? endpoint.func : `${namespace}:${endpoint.func}`)
    const handler = byId.get(target)
    if (!handler || handler.kind !== 'function.lua' || handler.method !== 'handler') {
      failures.push(`${endpoint.id} must resolve to a handler function`)
      continue
    }
    incoming.set(target, (incoming.get(target) || 0) + 1)
  }
  for (const handler of entries.filter(entry => entry.kind === 'function.lua' && entry.method === 'handler')) {
    if (incoming.get(handler.id) !== 1) failures.push(`${handler.id} must be reachable from exactly one endpoint`)
  }
  return failures
}
