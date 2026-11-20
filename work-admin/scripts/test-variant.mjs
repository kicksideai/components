// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { execFileSync } from 'node:child_process'
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse, stringify } from '../ui/node_modules/yaml/dist/index.js'

const test = fileURLToPath(new URL('../test/', import.meta.url))
const wippy = process.env.WIPPY || 'wippy'
const [variant, ...args] = process.argv.slice(2)
if (!['published', 'custom-scope'].includes(variant)) throw new Error('Expected published or custom-scope')

const readYaml = path => parse(readFileSync(path, 'utf8'))
const config = readYaml(join(test, '.wippy.yaml'))
const work = 'kickside/work'
const hostPath = join('src', '_index.yaml')
if (variant === 'published') delete config.workspace.replacements[work]
for (const [module, target] of Object.entries(config.workspace.replacements)) {
  config.workspace.replacements[module] = resolve(test, target)
}

const cache = join(test, '.wippy')
mkdirSync(cache, { recursive: true })
const cwd = mkdtempSync(join(cache, `${variant}-`))
const options = { cwd, stdio: 'inherit', env: { ...process.env, WIPPY: wippy } }
try {
  for (const file of ['src', 'wippy.yaml', 'wippy.lock', 'run.sh']) cpSync(join(test, file), join(cwd, file), { recursive: true })
  mkdirSync(join(cwd, '.wippy'))
  symlinkSync(join(cache, 'vendor'), join(cwd, '.wippy/vendor'), 'dir')
  writeFileSync(join(cwd, '.wippy.yaml'), stringify(config))
  if (variant === 'published') {
    const admin = readYaml(join(test, '..', hostPath))
    const constraint = admin.entries.find(entry => entry.component === work).version
    const minimum = /^>=(\d+\.\d+\.\d+)$/.exec(constraint)?.[1]
    if (!minimum) throw new Error('Work Admin must declare a minimum Work version')
    const host = readYaml(join(cwd, hostPath))
    host.entries.find(entry => entry.component === work).version = minimum
    writeFileSync(join(cwd, hostPath), stringify(host))
    const lockedWork = () => readYaml(join(cwd, 'wippy.lock')).modules.find(module => module.name === work)
    if (lockedWork()?.version !== minimum) execFileSync(wippy, ['update'], options)
    const locked = lockedWork()
    if (locked?.version !== minimum || !/^[a-f0-9]{64}$/.test(locked.hash)) {
      throw new Error(`Published harness requires the released Work ${minimum} artifact`)
    }
    execFileSync(wippy, ['install', work], options)
    execFileSync('./run.sh', [...args, 'flow_compatibility_test', 'board_administration_test'], options)
  } else {
    const host = readYaml(join(cwd, hostPath))
    host.entries.find(entry => entry.name === 'dep.admin').parameters.push({
      name: 'kickside.work.admin.security:user_security_scope', value: 'app.security:work_admin',
    })
    writeFileSync(join(cwd, hostPath), stringify(host))
    const adminPath = join(cwd, 'src/admin.yaml')
    const admin = readYaml(adminPath)
    admin.entries.find(entry => entry.name === 'admin_scope_expectation').members_have_access = false
    writeFileSync(adminPath, stringify(admin))
    execFileSync('./run.sh', [...args, 'admin_scope_test'], options)
  }
} finally {
  rmSync(cwd, { recursive: true, force: true })
}
