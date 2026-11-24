// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { Json, JsonObject, ResourceContent, TemplateKind, VariableSchema } from './types'

export function properties(schema: VariableSchema): Record<string, JsonObject> {
  return Array.isArray(schema.properties) ? {} : schema.properties
}

export function samples(content: Pick<ResourceContent, 'samples'>): JsonObject {
  return Array.isArray(content.samples) ? {} : content.samples
}

export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

// The content a person edits: faces, subject, base, variables and samples.
export function draftOf(content: ResourceContent): ResourceContent {
  const copy = clone(content)
  return {
    kind: copy.kind, name: copy.name, title: copy.title, description: copy.description,
    html: copy.html, text: copy.text, base: copy.base, subject: copy.subject,
    schema: { ...copy.schema, properties: properties(copy.schema) }, samples: samples(copy),
  }
}

export function sameDraft(a: ResourceContent, b: ResourceContent): boolean {
  return JSON.stringify(draftOf(a)) === JSON.stringify(draftOf(b))
}

// Starting sources for a resource created from blank. Each renders on its own.
export function blank(kind: TemplateKind, name: string, title: string, description: string, base?: string): ResourceContent {
  const schema: VariableSchema = { type: 'object', properties: {} }
  if (kind === 'message') {
    return {
      kind, name, title, description, base, subject: title, schema, samples: {},
      html: '{{ block body() }}\n  <p>Write your message here.</p>\n{{ end }}\n',
      text: '{{ block body() }}\nWrite your message here.\n{{ end }}\n',
    }
  }
  if (kind === 'base') {
    return {
      kind, name, title, description, schema, samples: {},
      html: '<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <title>{{ message.subject }}</title>\n</head>\n<body>\n  {{ block body() }}{{ end }}\n</body>\n</html>\n',
      text: '{{ block body() }}{{ end }}\n',
    }
  }
  return { kind, name, title, description, schema, samples: {}, html: '<p>{{ site.title }}</p>\n', text: '{{ site.title }}\n' }
}

function literal(value: Json): string | undefined {
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return undefined
}

// An include of a part with each declared input filled from the part's sample or default.
export function includeSnippet(part: ResourceContent): string {
  const pairs: string[] = []
  const values = samples(part)
  for (const [name, schema] of Object.entries(properties(part.schema))) {
    const value = literal(values[name] ?? schema.default ?? (schema.type === 'string' ? '' : null))
    if (value !== undefined) pairs.push(`${JSON.stringify(name)}, ${value}`)
  }
  return pairs.length ? `{{ include "/part/${part.name}" map(${pairs.join(', ')}) }}` : `{{ include "/part/${part.name}" }}`
}

export function assetReference(name: string): string {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(name) ? `{{ assets.${name} }}` : `{{ assets[${JSON.stringify(name)}] }}`
}

export function assetSnippet(name: string, alt: string, width?: number): string {
  const size = width ? ` width="${width}"` : ''
  return `<img src="${assetReference(name)}" alt="${alt.replace(/"/g, '&quot;')}"${size} style="display:block;border:0;max-width:100%;height:auto;">`
}

// Render globals shadow variables of the same name; those are read through `vars`.
const globals = new Set(['site', 'sender', 'message', 'assets', 'vars'])
export function variableSnippet(name: string): string {
  if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(name) && !globals.has(name)) return `{{ ${name} }}`
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(name) ? `{{ vars.${name} }}` : `{{ vars[${JSON.stringify(name)}] }}`
}

export const bodySlot = '{{ block body() }}{{ end }}'
