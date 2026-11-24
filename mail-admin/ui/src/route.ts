// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { TemplateKind } from './types'

export type LibrarySection = 'all' | 'messages' | 'bases' | 'parts' | 'assets'
export type ResourceSection = 'content' | 'variables' | 'used-by' | 'history'

export type Route =
  | { name: 'library'; section: LibrarySection; asset?: string }
  | { name: 'resource'; kind: TemplateKind; resource: string; section: ResourceSection }
  | { name: 'activity'; message?: string; template?: string }

const kindSegments: Record<TemplateKind, Exclude<LibrarySection, 'all' | 'assets'>> = {
  message: 'messages', base: 'bases', part: 'parts',
}
const segmentKinds = Object.fromEntries(Object.entries(kindSegments).map(([kind, segment]) => [segment, kind])) as Record<string, TemplateKind>
const resourceSections: readonly ResourceSection[] = ['content', 'variables', 'used-by', 'history']

export function sectionOf(kind: TemplateKind): Exclude<LibrarySection, 'all' | 'assets'> { return kindSegments[kind] }
export function kindOf(section: LibrarySection): TemplateKind | undefined { return segmentKinds[section] }

export function sectionsFor(kind: TemplateKind): readonly ResourceSection[] {
  return kind === 'base' ? ['content', 'used-by', 'history'] : resourceSections
}

export function pathOf(route: Route): string {
  if (route.name === 'activity') {
    if (route.message) return `activity/${encodeURIComponent(route.message)}`
    return route.template ? `activity/template/${encodeURIComponent(route.template)}` : 'activity'
  }
  if (route.name === 'library') {
    if (route.section === 'assets' && route.asset) return `assets/${encodeURIComponent(route.asset)}`
    return route.section === 'all' ? '' : route.section
  }
  return `${kindSegments[route.kind]}/${encodeURIComponent(route.resource)}/${route.section}`
}

export function parse(path: string | undefined): Route {
  const parts = (path ?? '').replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)
  const [head, name, section] = parts
  if (!head) return { name: 'library', section: 'all' }
  try {
    if (head === 'activity') {
      if (name === 'template' && section) return { name: 'activity', template: decodeURIComponent(section) }
      return name ? { name: 'activity', message: decodeURIComponent(name) } : { name: 'activity' }
    }
    if (head === 'assets') return name ? { name: 'library', section: 'assets', asset: decodeURIComponent(name) } : { name: 'library', section: 'assets' }
    const kind = segmentKinds[head]
    if (!kind) return { name: 'library', section: 'all' }
    if (!name) return { name: 'library', section: head as LibrarySection }
    const sections = sectionsFor(kind)
    const chosen = sections.find(candidate => candidate === section) ?? 'content'
    return { name: 'resource', kind, resource: decodeURIComponent(name), section: chosen }
  } catch {
    return { name: 'library', section: 'all' }
  }
}
