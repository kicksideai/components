// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { checkDependencies, checkEndpoints, parseYamlDocuments, run } from './module-rules.mjs'
import { access, readFile, readdir, stat } from 'node:fs/promises'
import { dirname, extname, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
let failed = false

function report(message) {
  console.error(`check-module: ${message}`)
  failed = true
}

async function exists(path) {
  try { await access(path); return true } catch { return false }
}

async function walk(directory) {
  const out = []
  for (const item of await readdir(directory, { withFileTypes: true })) {
    if (item.isDirectory() && ['.git', '.wippy', '.local', 'node_modules'].includes(item.name)) continue
    const full = resolve(directory, item.name)
    if (item.isDirectory()) out.push(...await walk(full))
    else if (item.isFile()) out.push(full)
  }
  return out
}

const identity = { organization: 'kickside', module: 'work', namespace: 'kickside.work' }
const yamlFiles = (await walk(resolve(root, 'src'))).filter(path => /\.ya?ml$/.test(path))
const documents = await parseYamlDocuments(await Promise.all([
  readFile(resolve(root, 'wippy.yaml'), 'utf8'),
  ...yamlFiles.map(file => readFile(file, 'utf8')),
]))
const [moduleManifest, ...registries] = documents
const rootIndex = registries[yamlFiles.indexOf(resolve(root, 'src/_index.yaml'))]
const securityIndex = registries[yamlFiles.indexOf(resolve(root, 'src/security/_index.yaml'))]
if (moduleManifest.organization !== identity.organization) report('manifest organization differs from module identity')
if (moduleManifest.module !== identity.module) report('manifest module differs from module identity')
if (Object.hasOwn(moduleManifest, 'version')) report('manifest must leave the release version to the publisher')
if (rootIndex.namespace !== identity.namespace) report('root namespace differs from module identity')
if (!securityIndex.entries.some(entry => entry.default === 'kickside.security.groups:members')) report('member scope must use the platform default')
if (!registries.some(registry => registry.namespace === 'kickside.work.security' && registry.entries.some(entry => entry.meta?.intent === 'module_access'))) report('module_access capability is missing')
for (const pattern of ['test/**', 'test:**', '.wippy/**', 'wippy.lock']) {
  if (!moduleManifest.exclude.includes(pattern)) report(`manifest must exclude ${pattern}`)
}
const runtime = process.env.WIPPY || 'wippy'
const installed = JSON.parse(await run(runtime, ['registry', 'list', '--ns', 'kickside.work*', '--json'], { cwd: resolve(root, 'test') }))
if (installed.filter(entry => entry.kind === 'ns.definition').length !== 1) report('module needs one root ns.definition')
if (!installed.some(entry => entry.id === 'kickside.work:types' && entry.kind === 'library.lua')) report('shared root types are missing')

const entries = []
for (let index = 0; index < registries.length; index += 1) {
  const registry = registries[index]
  const file = yamlFiles[index]
  for (const entry of registry.entries) {
    if (typeof entry.default === 'string' && /^app[:.]/.test(entry.default)) report(`${relative(root, file)}:${entry.name} selects a host-owned default`)
    entries.push({ ...entry, id: `${registry.namespace}:${entry.name}` })
  }
  for (const failure of checkDependencies(registry.entries)) report(`${relative(root, file)}:${failure}`)
}
for (const failure of checkEndpoints(entries)) report(failure)
const installedIds = new Map(installed.map(entry => [entry.id, entry.kind]))
for (const entry of entries) {
  if (installedIds.get(entry.id) !== entry.kind) report(`${entry.id} is missing or has a different kind in the installed registry; run make setup`)
}
const sourceIds = new Set(entries.map(entry => entry.id))
for (const entry of installed) {
  if (!sourceIds.has(entry.id)) report(`${entry.id} is absent from the source registry; run make setup`)
}

for (const file of (await walk(resolve(root, 'src'))).filter(path => path.endsWith('.lua'))) {
  const source = await readFile(file, 'utf8')
  if (/errors\.wrap\([^\n]*\bor\s+["']missing["']|error\(tostring\(err\)\)/.test(source)) report(`${relative(root, file)} loses a native error boundary`)
  if (/:\s*any\b/.test(source)) report(`${relative(root, file)} uses any`)
  if (!file.endsWith('/types.lua') && /^type\s/m.test(source)) report(`${relative(root, file)} declares types outside types.lua`)
}

const markdownFiles = (await walk(root)).filter((path) => extname(path) === '.md')
for (const page of markdownFiles) {
  const markdown = await readFile(page, 'utf8')
  const sourceRelative = relative(root, page).split(sep).join('/')
  const lines = markdown.split('\n')
  let fenced = false
  for (let index = 0; index + 1 < lines.length; index += 1) {
    if (/^\s*(```|~~~)/.test(lines[index])) { fenced = !fenced; continue }
    if (!fenced && /^\s*\|.*\|\s*$/.test(lines[index])
        && /^\s*\|(?:\s*:?-{3,}:?\s*\|)+\s*$/.test(lines[index + 1])) {
      report(`${sourceRelative}:${index + 1} uses a pipe table unsupported by the Hub renderer`)
    }
  }
  for (const match of markdown.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].trim().replace(/^<|>$/g, '')
    if (!target || target.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue
    const fileTarget = target.split('#', 1)[0]
    if (!fileTarget) continue
    const resolved = resolve(dirname(page), decodeURIComponent(fileTarget))
    if (!resolved.startsWith(`${root}${sep}`) || !await exists(resolved)) report(`${sourceRelative} has a broken local link: ${target}`)
  }
}

const allFiles = await walk(root)
const secretPatterns = [
  /\b(?:gh[oprsu]_[A-Za-z0-9]{20,}|glpat-[A-Za-z0-9_-]{20,}|wpy_[A-Za-z0-9_-]{20,})\b/,
  /-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----/,
]
for (const file of allFiles) {
  const info = await stat(file)
  if (info.size > 4 * 1024 * 1024) continue
  const buffer = await readFile(file)
  if (buffer.includes(0)) continue
  const content = buffer.toString('utf8')
  if (secretPatterns.some((pattern) => pattern.test(content))) report(`${relative(root, file)} contains credential-like material`)
}


try {
  const tracked = (await run('git', ['ls-files'], {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  })).trim().split('\n').filter(Boolean)
  for (const path of tracked) {
    if (path === 'wippy.lock' || path.startsWith('.wippy/') || path.includes('/node_modules/')
        || path.endsWith('.wapp') || path.endsWith('.env') || path.endsWith('.map')) {
      report(`generated or sensitive file is tracked: ${path}`)
    }
  }
} catch {
  // The repository may be checked before its first git init. All other checks still run.
}

if (failed) process.exit(1)
console.log(`Module checks passed for ${identity.organization}/${identity.module}: every endpoint resolves to a handler and every handler has exactly one endpoint (${entries.filter(entry => entry.kind === 'http.endpoint').length} endpoints)`)
