// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { Declaration, Item, Schema } from '../types'
export function schema(): Schema {
  const declaration: Declaration = {
    key_prefix: 'WORK', fields: [
      { code: 'title', form: 'text', index: 'key' }, { code: 'description', form: 'text' },
      { code: 'assignee', type: 'principal', form: 'ref', index: 'key' },
      { code: 'priority', type: 'option', form: 'text', index: 'key', options: [{ id: 'low', label: 'Low', order: 0 }, { id: 'normal', label: 'Normal', order: 1 }, { id: 'high', label: 'High', order: 2 }] },
      { code: 'due', form: 'time', config: { format: 'date' } }, { code: 'labels', form: 'text', cardinality: 'set', index: 'key' },
    ], item_types: [{ id: 'task', title: 'Task', process: 'delivery', fields: ['title', 'description', 'assignee', 'priority', 'due', 'labels'], parent_types: ['task'] }],
    relation_types: [{ id: 'relates', outward: 'relates to', inward: 'relates to' }, { id: 'blocks', outward: 'blocks', inward: 'blocked by' }],
    processes: [{ id: 'delivery', initial: 'todo', states: [{ id: 'todo', name: 'To do', category: 'unstarted' }, { id: 'doing', name: 'In progress', category: 'started' }, { id: 'done', name: 'Done', category: 'completed' }], transitions: [{ id: 'start', name: 'Start work', from: ['todo'], to: 'doing' }, { id: 'finish', name: 'Complete', from: ['todo', 'doing'], to: 'done' }, { id: 'reopen', name: 'Reopen', from: ['doing', 'done'], to: 'todo' }] }],
    policy: { wip: { doing: { limit: 5, hard: false } } },
  }
  return { declaration, compiled: { ...declaration, fields: declaration.fields?.map(f => ({ ...f, cardinality: f.cardinality ?? 'one' })) }, key_prefix: 'WORK', generation: 1, as_of: 1 }
}
export function item(id = 'i1', state = 'todo', version = 1): Item {
  return { id, key: `WORK-${id === 'i1' ? '1' : '2'}`, type: 'task', state, version, process_generation: 1, visit: 1, category: 'unstarted', values: { title: 'Original', priority: 'normal' }, value_states: { title: 'provided', description: 'absent', assignee: 'absent', priority: 'provided', due: 'absent', labels: 'absent' }, rank: id }
}
export function deferred<T>() {
  let resolve!: (value: T) => void, reject!: (reason: Error) => void
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}
