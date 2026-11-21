// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
// Response and declaration types used by the PIM administration.
export type ComponentProps = Record<string, unknown>

export interface PolicyDefaults { audit: 'fields' | 'off'; audit_days: number; trash_days: number; tombstone_days: number; proposal_days: number; completed_work_days: number; abandoned_work_days: number; import_days: number; pending_creation_days: number; proposal_count: number; proposal_bytes: number; command_deadline_ms: number; maintenance_rows: number; maintenance_catalogs: number; rebuild_rows: number; job_batches: number; import_rows: number }

export interface CatalogAccess { read: boolean; write: boolean; admin: boolean }

export interface CatalogRow {
  catalog_id: string
  title: string
  description?: string
  product_count?: number
  item_count?: number
  generation?: number
  access: CatalogAccess
}

export interface AttributeView {
  id: number
  type: string
  form: string
  scope: string[]
  cardinality: string
  index: string
  index_contexts: string[]
  unique: boolean
  vocabulary?: string
  default?: unknown
  plugin?: string
  config: Record<string, unknown>
  width: Width
}

export type Width = 'full' | 'half' | 'third' | 'quarter'
export interface AttributeDecl {
  id?: number; code: string; type: string; scope?: string[]; cardinality?: string; index?: string
  index_contexts?: Record<string, string>[]; unique?: boolean; vocabulary?: string; default?: unknown
  config?: Record<string, unknown>; width?: Width
}
export interface AspectDecl { namespace: string; write?: { sources?: string[] }; attributes?: AttributeDecl[] }
export interface DimensionDecl { name: string; members: string[]; fallback?: Record<string, string[]> }
export interface VocabularyDecl { code: string; hierarchical?: boolean }
export interface VariationDecl { axes?: string[]; own?: string[] }
export interface RequirementDecl { id: string; context?: Record<string, string>; require?: string[]; authored?: string[] }
export interface CheckDecl { check: string; reads?: string[]; cost?: string; config?: Record<string, unknown>; enforce?: string }
export interface FamilyDecl { code: string; aspects?: string[]; variation?: VariationDecl[]; requirements?: RequirementDecl[]; checks?: CheckDecl[] }
export interface SourceDecl { id: string; ordering?: string; writes?: string[]; principals?: string[]; audit?: boolean }
export interface ChannelDecl { id: string; requirements?: string[]; families?: string[] }
export interface PluginDecl { use: string; schema?: unknown }
export interface RemoveDecl { dimensions?: string[]; vocabularies?: string[]; aspects?: string[]; families?: string[]; sources?: string[]; channels?: string[]; attributes?: string[]; scopes?: string[]; plugins?: string[] }
export interface Declaration {
  dimensions?: DimensionDecl[]; vocabularies?: VocabularyDecl[]; aspects?: AspectDecl[]; families?: FamilyDecl[]
  sources?: SourceDecl[]; channels?: ChannelDecl[]; policy?: { [K in keyof PolicyDefaults]?: PolicyDefaults[K] | false }; scopes?: string[]
  plugins?: PluginDecl[]; remove?: RemoveDecl
}

export interface TypeOption { id: string; title?: string; form: string; indexes: string[]; target?: string; config_schema?: Record<string, unknown> }
export interface ScopeOption { id: string; title?: string; access: string; filters: Record<string, { type: string; ops: string[] }> }
export type PluginConfigs = Record<string, Record<string, unknown>>
export interface PluginIssue {
  code?: string; message: string; field?: string; projection?: string; start_seq?: number; max_pruned_seq?: number
}
export interface PluginProjection {
  cursor_id?: string; last_seq: number; parked: boolean; bootstrapping: boolean; status?: string; error?: string
}
export interface PluginReferences {
  fields: string[]; scopes: string[]; shell_bindings: string[]; checks?: string[]; plugins?: string[]
}
export interface PluginView {
  plugin: string; title?: string; description?: string; icon?: string; installed: boolean; active: boolean
  attachment_id?: string; config?: Record<string, unknown>; requires: string[]; tools: string[]
  lifecycle: { state: 'pending' | 'ready' | 'failed'; error?: PluginIssue & { kind: string } }
  projections: Record<string, PluginProjection>
  problem?: PluginIssue
  references?: PluginReferences
}
export interface PluginOption extends PluginView { config_schema: Record<string, unknown> }
export interface LinkKindOption { kind: string; binding: string; title?: string }
export interface SchemaOptions { types: TypeOption[]; scopes: ScopeOption[]; plugins: PluginOption[]; link_kinds: LinkKindOption[] }
export interface SchemaChange { code: string; class: string; what: string }
export interface SchemaPlan { generation: number; class: string; changes: SchemaChange[]; refused: SchemaChange[]; migration?: string }

export interface Dimension { name: string; members: string[]; fallback: Record<string, string[]> }
export interface Level { axes: string[] }
export interface Family {
  code: string
  owner: Record<string, number>
  levels: Level[]
  item_level: number
  requirements: { id: string; require: string[]; authored: string[] }[]
}
export interface Channel { id: string; requirements: string[]; families?: string[] }

export interface SchemaView {
  access: CatalogAccess
  schema_generation: number
  declaration: Declaration
  attributes: Record<string, AttributeView>
  families: Record<string, Family>
  channels: Record<string, Channel>
  dimensions: Dimension[]
  vocabularies: Record<string, { code: string; hierarchical: boolean }>
  sources: Record<string, { id: string; ordering: string }>
  plugins: PluginView[]
  as_of: number
  generation: number
  rebuilding: boolean
}

export interface TermRow { code: string; labels: Record<string, string>; parent?: string; retired: boolean }
export interface ListTermsResult { terms: TermRow[]; next?: string; as_of: number }

export interface ApplyItem { term: { vocabulary: string; code: string }; labels?: Record<string, string>; parent?: string; retired?: boolean }
export interface ApplyResult { applied: boolean; outcomes: { outcome: string; findings?: { code: string; message?: string }[] }[] }

export interface HistoryEntry {
  seq: number
  n: number
  subject: string
  sku?: string
  kind: string
  attribute?: string
  ctx?: string
  before?: unknown
  after?: unknown
  actor: string
  source?: string
  at: string
}
export interface HistoryResult { entries: HistoryEntry[]; next?: string; as_of: number }

export interface CatalogSettingsEvents {
  navigate: { route: string }
  'dirty-changed': { dirty: boolean }
  'open-catalog-picker': Record<string, never>
}
