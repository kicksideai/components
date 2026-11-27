// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { onDate, originText, personLabel, plural } from '../copy'
import type { ResourceSection } from '../route'
import type { Resource, Revision, TemplateKind } from '../types'

export function resourceHeadings(kind: TemplateKind, section: ResourceSection, name: string, item?: Resource) {
  const users = item?.used_by?.messages?.length ?? 0
  const sender = item?.used_by?.recent_senders?.find(entry => entry.origin)
  const content: Record<TemplateKind, { title: string; description: string }> = {
    message: { title: 'Message', description: 'What recipients read.' + (sender?.origin ? ` Sent recently by “${originText(sender.origin)}”.` : '') },
    base: { title: 'Layout', description: users ? `The frame around the ${plural(users, 'message')} that ${users === 1 ? 'uses' : 'use'} ${name}.` : `The frame around messages that use ${name}.` },
    part: { title: 'Content', description: `Shown wherever ${name} is included.` },
  }
  const sections: Record<ResourceSection, { title: string; description: string }> = {
    content: content[kind],
    variables: kind === 'message'
      ? { title: 'Variables', description: 'The values a sender provides, with the samples used for previews and tests.' }
      : { title: 'Inputs', description: `The values passed to ${name} where it is included, with their defaults.` },
    'used-by': {
      title: 'Used by',
      description: kind === 'message' ? `Who sends ${name}.` : kind === 'base' ? `Messages that use ${name}.` : `Templates that include ${name}.`,
    },
    history: { title: 'History', description: `Every saved version of ${name}, newest first.` },
  }
  return sections[section]
}

export function customizationText(item?: Resource): string {
  if (item?.state !== 'customized') return ''
  return `Customized by ${personLabel(item.author_label, item.author)} ${onDate(item.updated_at)} from the version included with ${item.origin_label}.`
}

export function originalRevision(item?: Resource): Revision | undefined {
  if (!item?.original) return undefined
  const { kind, name, title, description } = item
  return { kind, name, seq: 0, version: 0, action: 'reset', state: 'original', author: '', created_at: 0,
    content: { kind, name, title, description, ...item.original } }
}
