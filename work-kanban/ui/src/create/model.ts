// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { fieldsFor, issuePageLimit } from '../issue/model'
import type { IssueType, QueryCursor, Schema } from '../issue/types'

export function issueTypes(schema: Schema) {
  return schema.item_types.filter(type => type.id !== 'sprint' && type.id !== 'milestone')
}

export function needsParent(type?: IssueType) {
  return !!type?.parent_types.length && !type.parent_types.includes(false)
}

export function initialIssueType(schema: Schema) {
  return issueTypes(schema).find(type => !needsParent(type))
}

export function createFields(schema: Schema, type?: IssueType) {
  const process = schema.processes.find(entry => entry.id === type?.process)
  const initial = process?.states.find(state => state.id === process.initial)
  const required = new Set(initial?.require ?? [])
  const fields = fieldsFor(schema, type, initial?.require).filter(field => !field.transition_only && !field.formula && !field.rollup)
  return {
    required: fields.filter(field => required.has(field.code)),
    optional: fields.filter(field => !required.has(field.code)),
  }
}

export function parentQuery(type: IssueType, after?: QueryCursor) {
  return {
    where: { field: 'type', op: 'in', value: type.parent_types.filter(value => typeof value === 'string') },
    limit: issuePageLimit,
    ...(after === undefined ? {} : { after }),
  }
}
