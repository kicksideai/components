<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# kickside/pim — Product Information Module specification

This document specifies the core backend and its extension contracts in `kicksideai/components/pim`. UI shells and plugin implementations are separate modules; their declarations below describe integration boundaries, not bundled deliverables. The admin module is delivered separately, with consumer UI planned later.

PIM is the product record: identity, typed values per context, hierarchy,
readiness and immutable releases. Everything else — pricing, inventory,
media, suppliers, channels, storefronts — is a plugin module that extends it
through the seams in §3 and §12.

## Modules

| Module | Holds | Depends on |
|---|---|---|
| `kickside/pim` | domain, persistence, projection, commands, reads, schema, release, proposals, history, trash, contracts `kickside.pim:catalog` and `kickside.pim:link_target`, backend extension types (type, aspect, check, scope), settings definitions, HTTP API, portability, retention owner, catalog component binding | core, component, jobs, execution, contract, migration, settings |
| `kickside/pim-ui` | the visual shell: `view.component` surfaces (catalog grid, product editor, schema, proposals), create/manage views, `ui.nav_item` (with `access`), UI extension types (editor, link view, panel, column, action), the extensions endpoint, and its own policy granting `registry.get` on its announced views | pim (HTTP + contract only) |
| `kickside/pim-flow` | integration: pullable sources (products, publications, proposals), writable sink, event ports, Blocks, agent tools trait — thin bindings over the catalog contract; imports nothing from `kickside.pim.persist` | pim, data, automation |

The backend imports nothing from the shell. It declares no views or navigation entries. Separate admin or consumer modules use the catalog contract and HTTP API and own their platform mounts.

Namespaces (one concern each):

- `kickside/pim`: `kickside.pim` (definition, deps, requirements, consts,
  types, requests, contracts `catalog` and `link_target`) · `.binding` (kind,
  deletable, service binding) · `.events` · `.domain` (document, resolve,
  evaluate, snapshot, policy) · `.schema` (compile, merge, classify, sections) ·
  `.persist` (store, read_model, proposal_rows, retention_rows, derived,
  item_index, projection, public_meta, materializer, tables) · `.migrations` ·
  `.command` (create, items, item_state, item_patch, writer, proposals, releases) ·
  `.read` (access, locate, reader, feeds, releases) · `.service` · `.api` · `.jobs`
  (rebuild) · `.retention` · `.types` · `.extensions` (checks) · `.settings` ·
  `.security` · `.portability`. Sink, source and ports live in `kickside/pim`
  until the `kickside/pim-flow` split (17).
- `kickside/pim-ui`: `kickside.pim.ui` (definition, static, views, nav item)
  · `.ui.api` · `.ui.extensions` · `.ui.security`.
- `kickside/pim-flow`: `kickside.pim.flow` · `.flow.source` · `.flow.sink` ·
  `.flow.ports` · `.flow.blocks` · `.flow.traits` · `.flow.security`. Plugins likewise split
backend entries (types, aspects, link targets, checks, scopes) from UI
entries (editors, link views, panels).

## 0. Invariants

1. **One log.** Every catalog change is an event on the catalog's Core
   thread. Catalog tables are written only by the projection and its jobs,
   with owner-held exceptions: creation provenance, frozen import work and replay admission; `proposal`, review state written by the
   `propose`/`decide` commands (§11), and retention pruning of expired
   change rows and tombstones (§5.8), which removes rows and never adds
   state.
2. **Serialized acceptance.** A command validates against the projection at
   thread head `S` and appends with `expect = { head = S }`; a concurrent
   append makes it retry, so every invariant is checked against exactly the
   state it extends, on both engines, without a PIM lock.
3. **Read your writes.** A command returns after the projection covers its
   append. Every read reports `as_of` and accepts `min_seq`.
4. **Stable meaning.** An attribute id never changes representation; equality,
   uniqueness and order come from built-in forms only.
5. **Explicit absence.** A coordinate is `absent`, `cleared` or `provided`.
   Only `absent` falls back.
6. **One resolver, one evaluator** (2.6, 2.7), used by projection, reads and
   release.
7. **Self-contained releases.** A release stores everything needed to read it
   and is never modified.
8. **Durable state, expiring log.** Events expire after retention; everything
   a reader, auditor or plugin needs later lives in projected state: products,
   change history (5.6), releases, publications, tombstones.
9. **Declared extension.** PIM core names no plugin. Plugins extend PIM only
   through the seams of §3 and §12; plugin code PIM runs is trusted installed
   code, referenced by registry id, and its failures are explicit — never a
   widened read, never a silently accepted write.
10. **Bounded work.** Every command, read, fold and job batch has a limit (16).
    A deadline retains fractional seconds when passed to Core: the transmitted
    timestamp and the local nanosecond comparison name the same instant.

## 1. Model

| Noun | Meaning |
|---|---|
| **Catalog** | Component (thread, ACL, lifecycle, settings) |
| **Schema** | Versioned declaration: dimensions, aspects, attributes, vocabularies, families, sources, channels, plugin membership |
| **Product** | Identity + value document; models (inner nodes) and items (leaves) |
| **Term** | Controlled value in a vocabulary |
| **Release** | Immutable snapshot of an item |
| **Proposal** | A command waiting for a decision |
| **Plugin** | A Kickside module that declares PIM extensions (§3) |

What Kickside supplies and PIM does not rebuild:

| Need | Platform mechanism |
|---|---|
| History, ordering, write serialization | Catalog thread events, `seq`, thread-row lock, `expect.head` |
| Product version | Subject `p:<product_id>`, `subject_version` |
| Idempotent retries | PIM receipt store with head-checked catalog facts; event `external` identity |
| Read models | Core projection (worker, cursor, catch-up) |
| Background work, retries | Jobs (`slot`, `demand`, `enqueue_tx`, attempt policy) under `kickside.execution` identity |
| Authorization | Component ACL READ / WRITE / ADMIN; security policies |
| Deletion | `kickside.contract:deletable` + reaper + cleanup cascade |

| Retention | `kickside.retention.owner` under the Core tick |
| Assets | Uploads owned by the catalog |
| Integration | Automation ports, `kickside.data:pullable` sources, `kickside.data:writable` sinks, Blocks |
| Configuration | `kickside.settings:definition` (admin-editable deployment defaults) |
| UI | `view.component` tags loaded by `loadByTagName`, `ui.nav_item`; Inbox review Block for optional proposal routing |

PIM is unpublished: one initial migration creates the final catalog, merge, retention, release-job, schema-work and teardown-queue tables in both SQL dialects, including the seeded retention position.

Native error codes identify conditions across entrypoints. Local infrastructure errors use `contract_unavailable`, `database_unavailable`, `row_corrupt` or `internal`; malformed stored JSON and required SQL columns share `row_corrupt`. Domain request conditions such as `unknown_source`, `proposal_not_found`, and `removal_target_not_found` retain distinct codes. Context wrapping preserves the received kind, retryability and details.

| Condition | Native kind | Code | Retryability |
|---|---|---|---|
| Missing contract or client | `UNAVAILABLE` | `contract_unavailable` | retryable at coded infrastructure boundaries |
| Missing or malformed persisted column | `INTERNAL` | `row_corrupt` | false |
| Settings read returns no usable result | `UNAVAILABLE` | `settings_unavailable` | true |
| Stored setting violates its declaration | `INTERNAL` | `settings_value_invalid` | false |
| Plugin id names no plugin entry | `INVALID` | `unknown_plugin` | false |
| Malformed plugin declaration | `INVALID` | `plugin_invalid` | false |
| Invalid contributed tool declaration | `INVALID` | `plugin_tool_invalid` | false |
| Invalid declared projection | `INVALID` | `plugin_projection_invalid` | false |
| Required plugin is not active, or deactivation leaves a dependent active | `INVALID` | `plugin_required` | false |
| Schema names a seam without its owning plugin active | `INVALID` | `plugin_seam_unowned` | false |
| Deactivation leaves an owned seam in the schema | `INVALID` | `plugin_seam_in_use` | false |
| Effective plugin configuration fails `config_schema` | `INVALID` | `plugin_config_invalid` | false |
| Plugin is inactive on the catalog | `NOT_FOUND` | `plugin_inactive` | false |
| Type id names no type entry | `INVALID` | `unknown_type` | false |
| Scope id names no scope entry | `INVALID` | `unknown_scope` | false |
| Link kind names no link-kind binding | `INVALID` | `unknown_link_kind` | false |
| Committed inventory publication remains | `UNAVAILABLE` | `publication_pending` | true, with `committed = true` and source cause |

`authentication_required` identifies a missing authenticated request actor.
The knowledge implementation currently uses `caller_required` for an absent
actor or internal execution scope, and `method_absent` for an unavailable
contract method. The Block adapter currently uses `INTERNAL /
contract_unavailable` for a missing method. These implementation boundaries
remain outside this batch; their vocabulary still requires convergence.
Native dependency failures retain their kind and received code.

The published component metadata operation authorizes
`component.runtime_meta.write` against a runtime component id, and execution
identity resolution requires `security.actor.create` against the selected
runtime principal plus access to its live policy groups. Those ids cannot be
enumerated in a static module declaration. The existing conditioned catalog
metadata and knowledge retrieval wildcard grants remain platform limitations;
replacing them requires platform-owned exact-entry operations that perform
these authorizations internally.


Keeper mechanisms PIM does not need, and why:

| Keeper | PIM |
|---|---|
| Outbox, input/output workers, retry processor | The Core thread is the outbox; the projection is the single input worker; Jobs and dataflow carry async work with their own retry policy |
| Same-transaction plugin hooks | Plugins never write inside a PIM transaction (§3.9) |
| Counter delta + boot repair + periodic sweep | Counters are projection fields written by the single writer in the fold transaction; nothing bypasses it |
| `audit_log` written by handlers | Change history is a projection (5.6) |
| Physical plugin columns (later folded into JSONB) | Values in the document, generated indexed columns per catalog |
| Hand-maintained capability lists in backend and frontend | Component ACL + per-seam `access` resolved server-side (§13) |

## 2. Values

### 2.1 Dimensions and contexts

```yaml
dimensions:
  - { name: channel, members: [web, amazon, b2b] }
  - { name: locale,  members: [en, de, de-AT, fr], fallback: { de-AT: [de] } }
```

An attribute's `scope` is a subset of dimensions. A context is a tuple over
the scope; each position is a member or `*`. Its key lists the scope
dimensions in declared order: `""` for the empty scope, else
`dim=member;dim=member`. Limits: ≤ 4 dimensions, ≤ 64 members, acyclic
fallback, ≤ 64 resolution candidates per attribute, ≤ 256 served contexts and
≤ 1,000 attributes per family.

### 2.2 Document

```json
{ "101": { "": {"p": 125000, "s": "erp"} },
  "205": { "locale=en": {"p": "Waterproof hiking boot"}, "locale=de": {"c": 1} } }
```

Attribute id → context key → `p` (canonical value) or `c` (cleared); `s` =
source that wrote it. Absent coordinates are not stored. ≤ 256 KB.

### 2.3 Forms

| Form | Canonical value |
|---|---|
| `text` | string, valid UTF-8, no U+0000 |
| `int` | integer, \|x\| < 2^53 |
| `dec` | `{"m": int, "e": int}` reduced, \|m\| < 10^15, −12 ≤ e ≤ 12 |
| `quantity` | `{"v": dec, "u": unit}` with the attribute's unit table |
| `bool` | `true` / `false` |
| `time` | `YYYY-MM-DD` or RFC3339 UTC `…Z` |
| `ref` | `{"ref": [kind, id]}`; kinds: `term`, `product`, `asset`, `component`, and link kinds (3.3) |
| `record` | object of named members whose values are forms; depth ≤ 3 |

Record depth counts record forms, including the attribute itself; list/set
containers do not add record levels. Compilation admits depth three and rejects
depth four before storing the declaration.

No JSON floats. Cardinality `one | list | set` is an attribute property; lists
and sets replace as a whole; sets are stored in key order without duplicates.

### 2.4 Keys and order

Forms, never plugins, define:

- **key** — the equality string (≤ 256 bytes) for sets, uniqueness, axes and
  key indexes. `dec`: normalized decimal; `quantity`: the exact amount in the
  canonical unit plus the unit, so `1 lb` equals `453.59237 g`; `text`: the
  string (case-folded when `case: insensitive`); `ref`: `kind:id`.
- **order** — for `index: number`, an int64 at the declared `scale` within the
  declared `range` (else rejected at write); quantities order by the
  canonical amount rounded half-up at that scale.

Quantity config: `units: { <unit>: "<decimal factor>" }`, `canonical`
(factor exactly `1`), `scale`, `range`. Values are entered as `"1.5 lb"` or
`{ value, unit }` and keep the authored unit. `money` is a `dec` with a
`currency` config.

### 2.5 References

Reference semantics descend through every record member and list/set element
according to its declared form and cardinality. A reference member declares
`target`; a term member also declares `vocabulary`. The same traversal drives
write/restore validation, derived link rows, release labels, term merges and
export/import remapping. Import defers the whole attribute value when any of
its members references a product, remaps those references and preserves every
other member. Link paths use zero-based list positions and slash-separated
record names (`~` and `/` in names escape as `~0` and `~1`); an unscoped scalar
reference retains path `0`.

`ref` values are also stored as rows `(product, attribute, context, path,
kind, target)` (5.3). `term` and `product` targets must exist and be active;
retiring or deleting a referenced term or product fails with a capped count;
a product's references to itself do not hold it, and survive its trash and restore.
`asset` targets are uploads owned by the catalog. `component` targets must be
readable by the principal. Link-kind targets are resolved by their owner
(3.3).

### 2.6 Resolution

`resolve(product, attribute, context)`:

1. `owner` = the product's ancestor or self at the attribute's owning level;
   above it the answer is `not_applicable`.
2. Candidates: per scope dimension `[member, fallbacks…, *]`, combined
   lexicographically (earlier dimensions most significant).
3. The first provided or cleared candidate in `owner`'s document wins
   (cleared → no value).
4. Else the attribute default, else `absent`. The default is normalized by the
   ordinary form path at compilation, for scoped and unscoped attributes alike;
   an explicit clear stops before this step.

Provenance: `{ level: own | inherited, context, fallback, default, source }`.

### 2.7 Evaluation

`evaluate(item_view, requirement_sets, cost)` over the complete item view:

1. family checks with admitted `cost` (`interactive` for readiness,
   `interactive + release` for release);
2. per requirement set: required attributes present; `authored` attributes
   resolved from the requested context itself (no fallback, no default).

Returns findings per set; view-wide findings belong to every set. A check
that fails to run yields `check_unavailable`.

## 3. Extension model

A plugin is an ordinary Kickside module (own namespace, migrations, tables,
endpoints) plus, when it has UI, a separate UI module. The backend module
depends on `kickside/pim` with `ns.dependency` and declares extensions as
registry entries or contract bindings; PIM discovers them by `meta.type` or
contract. Each seam below states what PIM runs, when, as whom, and how a
failure surfaces.

The owner is the catalog, identified by `catalog_id`; the host is
`kickside/pim`. The host
never knows a specific plugin; a plugin never reaches into host internals
(no imports of host implementation namespaces, no host tables, no private
functions): it uses the host contract, the declared seams and its own tables.

**Grant obligation.** PIM calls plugin code as two principals: the command
caller (types, link resolvers and enforced checks in prepare and validate)
and the catalog's execution identity (checks in the fold and release; it is
the identity the catalog projection is registered with — the creator, or a
service principal set by the catalog ADMIN — resolved live). Both reach plugin
entries through their groups. A plugin ships a `<plugin>.security:pim_access`
policy granting `registry.get` and `funcs.call` / `contract.call` on exactly
its seam entries, targeted by its `user_security_scope` requirement. Without
it the seam fails closed (`unavailable` / `check_unavailable`), never open;
discovery runs `registry.find` under the same principal, so an ungranted seam
is invisible rather than half-visible.

| Seam | Declared as | Runs | Failure |
|---|---|---|---|
| Type | `kickside.pim.type` entry | command prepare, as caller | item `invalid` / command `unavailable` |
| Plugin | `kickside.pim.plugin` entry; explicit schema membership; configuration in its attachment | host validates schema commands and configuration; lifecycle job converges | structured `problem` and per-plugin `lifecycle`; host and other plugins continue |
| Link kind | binding of contract `kickside.pim:link_target` | command prepare and release, as caller | item `invalid_reference` / command `unavailable` |
| Check | `kickside.pim.check` entry | fold and release as the catalog identity; enforced writes as caller | `check_unavailable` finding; enforced → item rejected |
| Scope | `kickside.pim.scope` entry (declarative) | query | query `invalid` / `unavailable` |
| Feeds | consume PIM sources (§12) | plugin's own dataflow | plugin's own retries |
| Writes | `apply` / sink as a registered source (§6) | PIM command | ordinary outcomes |
| UI (pim-ui) | `kickside.pim.ui.editor`, `.link`, `.panel`, `.column`, `.action` | browser | slot falls back to the shell's view |
| Shell | `ui.nav_item`, Blocks, tools | Kickside shell | Kickside's own |

PIM owns its extension vocabulary: `kickside.pim.type`, `kickside.pim.plugin`,
`kickside.pim.check`, `kickside.pim.scope` and the `kickside.pim:schema_provider`
contract. Scope entries address rows with `catalog_column` and `product_column`.

### 3.1 Types — `kickside.pim.type`

```yaml
- name: gtin
  kind: registry.entry
  meta:
    type: kickside.pim.type
    form: text
    indexes: [none, key]
    config_schema: { type: object, properties: { prefix: { type: string } } }
    functions:
      normalize: acme.gs1:gtin_normalize     # optional
      validate:  acme.gs1:gtin_validate      # optional
```

The form normalizes first; the type's `normalize` refines a valid form value
and its `validate` returns findings. Both are pure, batched per attribute
(`{ config, values[] }` → `{ results[] }`, one result per value in order:
`{ value } | { error }` from normalize, `{ findings: [{ code?, message }] }`
from validate), and run once per attribute per command in prepare, as the
caller, over the distinct values the command sets. A refused value makes its
item `invalid` (the error as the finding, or the findings); a function that
fails or answers out of shape makes the command `unavailable` (retryable,
code `contract_unavailable`). Compile checks an attribute's `config`
against the type's `config_schema`. Catalog import replays values accepted
when they were exported and skips the functions. They never run in the
projection or a rebuild, and never define key or order (0.4).

Built-in pack `kickside.pim.types`: `text`, `rich_text`, `identifier`,
`integer`, `number`, `quantity`, `money`, `boolean`, `date`, `datetime`,
`select` (term), `reference` (product or link kind), `asset`, `record`.

An attribute declaration may carry `width` (`full`, `half`, `third`,
`quarter`): its share of a form row in the product editor's twelve-column
grid. Compile defaults it from the form (`record`, text that cannot be
key-indexed and repeated values take the row; `bool`, `int`, `dec`, `time` a
third; the rest, quantity included, a half), `get_schema` reports the
resolved width on every attribute,
and a width change is cosmetic. Rows follow the declaration's attribute
order, so an admin lays a form out by ordering attributes and setting widths;
the schema admin page exposes the widths as one apply.

`schema_options` (READ) answers what a catalog's schema may name from the
registry: attribute types with forms, indexes and config schemas, product
scopes with their filters, every installed plugin in the §3.2 state shape
with `config_schema`, and bound link kinds. A declaration the engine refuses is listed
with its `problem` rather than hidden. The pages' schema builder and the
`PIMSchemaOptions` agent tool read it before planning a change; the builder
edits one draft (fields, dimensions, vocabularies and terms, families, channels
and sources, plugins and scopes, policy, raw JSON), reviews it with
`plan_schema` and applies it as one generation with `expected_generation`.
The pim-ui builder reads plugin options from this host backend response. It
edits membership as `plugins: [{ use }]`, keeps initial configuration in a
separate `plugin_configs` request field, and uses `configure_plugin` for later
configuration changes. It renders `active`, structured `problem`, `lifecycle`
and per-kind projection progress from the host's plugin list.

### 3.2 Plugin declaration, membership and configuration

The registry holds declarations only. A catalog's aspects and attributes are
data in its declaration (inline aspects), set by its ADMIN through
`apply_schema`; nothing in the write path reads aspect content from the
registry and nothing tracks registry drift.

One `registry.entry`, `meta.type: kickside.pim.plugin`, declares a plugin.

| Field | Meaning |
|---|---|
| `title`, `description`, `icon` | display |
| `attachment` | binding id of the plugin's attachment component kind; required |
| `config_schema` | JSON schema of the per-catalog configuration; no secret-annotated property at any depth (properties, items, allOf/anyOf/oneOf, `$defs`, local `$ref`); secrecy comes from the schema annotation, never from a property's name |
| `settings` | deployment defaults for configuration values only; a deployment default never activates a plugin |
| `schema` | optional schema provider (declaration fragment for the catalog's schema) |
| `requires` | plugin ids that must be active on the same catalog |
| `seams` | ids of the types, scopes, checks, guards and link kinds this plugin owns; a catalog's schema may name a seam only while its owning plugin is active there |
| `projections` | §3.11 |
| `tools` | agent tool ids contributed while active (§3.12) |

A declaration that fails validation is reported as an installed plugin with a
structured `problem { code, message, field? }`; it is never activatable, and it
never fails a listing, a read, the host projection or another plugin. Codes:
`unknown_plugin` (id names no plugin entry), `plugin_invalid` (malformed
declaration), `plugin_tool_invalid`, `plugin_projection_invalid`,
`plugin_required` (a dependency is not active), `plugin_seam_unowned`,
`plugin_config_invalid`, `plugin_inactive`. A registry or dependency failure
keeps its native kind and code; only a truly missing or malformed entry becomes
one of these `errors.INVALID` codes (`plugin_inactive` is `errors.NOT_FOUND`).
The same code set applies to types, scopes and link kinds: `unknown_type`,
`unknown_scope`, `unknown_link_kind`.

A plugin declares itself once with a `kickside.pim.plugin` entry:

```yaml
- name: plugin
  kind: registry.entry
  meta:
    type: kickside.pim.plugin
    title: Shipping
    settings: acme.shipping                # its deployment configuration defaults namespace
    attachment: acme.shipping:attachment   # required: attachment component kind
    tools: [acme.shipping.tools:quote]      # optional: registered meta.type tool ids
    config_schema: { type: object, properties: { carrier: { type: string } }, required: [carrier] }
    schema:                                # optional: where the fields it contributes come from (one of)
      template:                            # a static fragment: aspects and vocabularies, attributes without ids
        aspects: [ { namespace: shipping, attributes: [ { code: weight, type: kickside.pim.types:quantity, index: number,
          config: { units: { g: "1", kg: "1000" }, canonical: g, scale: 0 } } ] } ]
      provider: acme.shipping:schema       # or a kickside.pim:schema_provider binding resolving the fragment per catalog
```

Membership is explicit and lives in the catalog's schema declaration:
`plugins: [ { use: <plugin id> } ]`. Present means active, absent means inactive.
The list follows PIM's named-entry merge rule (§8), keyed by `use`: named
entries replace their predecessors, omitted entries remain, and
`remove.plugins: [<plugin id>, ...]` removes membership. There is no `enabled`
flag. Membership without field changes is cosmetic: a new generation, no
catalog rebuild.

Configuration is attachment data, never part of the schema declaration and
never a registry entry. Initial values come with the activating schema command
(`plugin_configs: { <plugin id>: { ... } }` on `create` or `apply_schema`);
later changes go through the host contract method
`configure_plugin { catalog_id, plugin, config }` (ADMIN), which appends one
catalog fact event. Both validate the effective configuration (deployment
defaults overlaid by the catalog's values) against `config_schema` before
anything is appended; an invalid effective configuration refuses with
`plugin_config_invalid` and nothing changes. The validated effective configuration is a snapshot at
activation or `configure_plugin`; changing deployment defaults affects the next
configuration command, not a running activation's services or workers.

Deactivation (the plugin leaves the list) is refused with `plugin_required`
while another active plugin requires it, and with `plugin_seam_in_use` while
the schema names one of its seams. Secrets never enter plugin configuration:
`format: password` and `writeOnly` annotations mark secrets. Credentials live
in the attachment (`credential_schema`) or a connection component that config
names by id.

One entry shape applies wherever plugin state is answered (`get_schema.plugins`,
a list, and the options listing):

```
{ plugin: <id>, title, description, icon, installed: boolean, active: boolean,
  attachment_id?: string, config?: object,          -- the validated effective configuration
  requires: [..], tools: [..],
  lifecycle: { state: "pending" | "ready" | "failed", error?: { kind, code, message } },
  projections: { <kind>: { last_seq, parked, bootstrapping, error? } },
  problem?: { code, message, field? } }
```

`get_schema.plugins` lists the catalog's active plugins plus inactive installed
ones (`active = false`). The options listing (`schema_options.plugins`, answered
by the host backend, never by a UI module) lists every installed plugin with
`config_schema`.

Plugins declare deployment defaults through `kickside.settings:definition`
entries in their `settings` namespace; deployment admins edit those values on
the Settings page. Defaults supply configuration values only.

The host contract method `plugin_context { catalog_id, plugin }` (READ) answers
`{ attachment_id, config, lifecycle, projections, retention: { event_days } }` for an active plugin and
refuses `errors.NOT_FOUND / plugin_inactive` otherwise. This is the only
admission a plugin service needs: no plugin parses `get_schema`, searches
components, reads private attachment context or validates configuration again.
Services and projection workers receive the same effective configuration. The context answers PIM’s catalog event-retention window from `catalog_event_retention_days`, independently of plugin configuration.
A service fails closed when attributes required by its operation are absent. Stored configuration is checked against the current declaration before service admission, without merging deployment defaults again.

**Plugin fields.** A plugin with a `schema` source contributes aspects and
vocabularies to every catalog that names it. PIM owns schema resolution through its plugin extension: when a request names a plugin entry, the write path
resolves the plugin's schema **as the caller** - the template as it stands,
or the provider binding's answer to `resolve({ catalog_id, plugin, config, current })` where `config` is the effective config and `current` the
copy the catalog holds - and stores the answer on the membership entry as
`schema: { fragment, version?, digest }`. The fragment compiles with the
catalog's own aspects: its attributes keep their ids by code across
resolutions, carry `plugin` in `get_schema.attributes`, index like any other
attribute (layout columns, rebuild) and are adopted by families like any
other aspect. A namespace or vocabulary both the catalog and a plugin, or
two plugins, declare is refused by name; a fragment attribute carrying an id
is refused; a request carrying `schema` on an entry is refused unless the
copy equals the one the catalog holds, so the declaration `get_schema`
answers re-applies as `unchanged`.

The copy is catalog data: the fold never calls a provider, a plugin release
or a change in the provider's own store reaches a catalog only when an ADMIN
names the entry again (`plan_schema` with the entry shows the diff,
`unchanged` when the source still agrees), and a provider failure fails the
plan and leaves the catalog on its copy. Export carries the copy; import
strips it and resolves again on the target, so a catalog never depends on a
plugin's store it cannot reach. `remove.plugins` drops the fields with the
entry (semantic when they hold values; families listing the aspect change in
the same request).

A provider lets a plugin own its field declarations wherever it keeps them -
a settings web component writing the plugin's own table, a connection's
remote schema - while PIM sees only declaration-shaped data: the "dynamic
fields" plugin is a provider plus the UI that edits its store and then names
the entry again on the catalogs it serves.

### 3.3 Link kinds — contract `kickside.pim:link_target`

A plugin that owns entities products point at (locations, suppliers,
brands, price lists) binds PIM's link-target contract:

```yaml
- name: location_target
  kind: contract.binding
  contracts:
    - contract: kickside.pim:link_target
      methods: { resolve: inventory.pim:resolve_locations, describe: inventory.pim:describe_locations }
  meta:
    kind: inventory.location               # the ref kind
    title: Location
```

`resolve({ catalog_id, ids })` runs as the caller and returns `{ ids }`, the
ids that exist and are visible to it; `describe({ catalog_id, ids })` returns
`{ targets: { [id] = { label, data? } } }` and is embedded into release
snapshots as `links["kind:id"]`, so a release reads without the owner (0.7).
Link ids are visible to every catalog reader; live labels and details come
through the owner, and labels embedded in a release are catalog-readable by
design. An attribute links with the built-in type `kickside.pim.types:link`
(form ref, index none or key) and `config: { target: inventory.location }`;
compile refuses a target no binding declares, and `product` and `term`,
which have their own types. A kind two bindings claim is a configuration
error. Payload fields on a link (Keeper's pivot columns) are a `record` with
one `ref` member.

- Values live in the document: links are atomic with the product, versioned,
  in history, exports and release snapshots; key-indexed link attributes
  filter through the item table and `list_links` finds the products that
  point at one target.
- Prepare resolves targets once per command per kind, as the caller: the
  first value of a kind collects every id of that kind the command's items
  set. An id the binding omits → item `invalid` (finding code
  `invalid_reference`); a binding error or timeout → command `unavailable`
  (retryable, code `contract_unavailable`), nothing applied.
- `invalid_reference` is the one finding code for a referent the catalog does
  not hold: an unresolved link id, an unknown parent, product or term. The
  sink (§12) answers an item that failed only on such findings as
  `dependency_missing`, retriable at item scope, so deliveries out of order
  retry instead of poisoning; a retired term is plain `invalid`.
- Release asks each kind's owner to describe the ids a snapshot carries; an
  id the owner no longer knows is left out of `links`; an owner that fails
  fails the release command.
- A target deleted later degrades: the ref stays, restore keeps it, the
  owner's UI shows it as unavailable, and the owner clears or re-points links
  through `apply` as a source, finding them with `list_links` (§7).

### 3.4 Checks — `kickside.pim.check`

```yaml
meta: { type: kickside.pim.check, comment: Net weight within the carrier's limit }
```

Pure: `{ config, view, product: { product_id, sku, family, level } }` →
`{ findings }`, where `view` holds the attributes the family's check entry
`reads`, by code and context. Families list checks
(`{ check, reads, cost, config, enforce }`); the projection evaluates
`interactive` checks into readiness; release adds `release` checks. Checks
are the only plugin code in the fold; a failure is a `check_unavailable`
finding, never a stalled projection.

`enforce: write` turns the check's findings into item rejections. Compile
accepts it only for `cost: interactive` checks whose `reads` are owned at
one level, so the check runs on that level's products and a model edit never
evaluates its descendants at the head. Enforced checks run in prepare, as the
caller, over the product as the item would leave it and before the command's
state changes; `check_unavailable` rejects. They run at `apply`, at `propose`
(propose plans the proposal's items at the head without appending, as the
proposer, and refuses a proposal whose items would be invalid) and at
`decide`. `restore` and catalog import are exempt: they bring back values
that were accepted when they were written.

### 3.5 Scopes — `kickside.pim.scope`

Plugin data that changes faster than product content (stock, live prices)
stays in plugin tables. A scope declares how PIM may filter items by it; PIM
generates the SQL with its dialect compiler, so no plugin SQL text exists:

```yaml
- name: stock
  kind: registry.entry
  meta:
    type: kickside.pim.scope
    table: inventory_stock                  # in PIM's database (target_db)
    catalog_column: catalog_id
    product_column: product_id
    filters:
      location:  { column: location_id, type: text,    ops: [eq, in] }
      available: { column: available,   type: integer, ops: [gt, gte, eq] }
```

A query names it: `scopes: [{ id: "inventory.pim:stock", where: { available:
{ gt: 0 }, location: { eq: "WH1" } } }]`. PIM validates identifiers against
`^[a-z_][a-z0-9_]{0,62}$`, values against the declared types and ops, and
ANDs `item.product_id IN (SELECT product_column FROM table WHERE
catalog_column = ? AND …)`. Predicates within one scope combine with AND.
An unknown scope or a missing table is `invalid`; a database error is
`unavailable`. The plugin owns the table, its retention and an index leading
with `(catalog_column, product_column)`; PIM cannot verify the index, so the
query scan cap (§7) is the guard.

A scope entry declares `access: read | write | admin` on the catalog; PIM
resolves it per caller and refuses the scope otherwise. Scope tables live in
PIM's database (install constraint). Scopes only filter: PIM never selects
plugin columns, so plugin values reach the UI through the plugin's own API
(3.7).

### 3.6 Feeds and writes

Plugins read PIM through the contract and the pullable sources (§12) and
write through `apply` or the sink as a registered source. A plugin read
model uses a declared `input: state` projection: the platform invokes the plugin
worker, which consumes `plugin_feed` with a host-issued opaque token (§3.11).
Ports only wake consumption.

A plugin publishes its own events on the catalog thread, so an automation on
a catalog picks a plugin event the same way it picks a catalog event. The
plugin declares its event types (`kickside.core.threads.event`) with
`meta.output_kind` naming a sibling kind it owns: a `contract.binding` whose
`meta.class` holds the catalog thread class `pim.catalog` and whose
`meta.events.output` lists the events as `system_only`. Core admits such an
event on a catalog thread from a producer holding `threads.output.publish`
on the event type; the plugin grants that to its own command functions
through a `service_only` policy. The plugin's ports bind
`kickside.pim.binding:catalog`, so their picker lists catalogs. A table-first
plugin publishes after its transaction commits and converges through its own
rows: each row that produces events carries a publication stamp, each event
carries the row id as its external identity, every command publishes the
unstamped rows before it answers, and the threads writer answers the stored
event for a repeated identity instead of a second one. PIM's own binding
declares no plugin event; the catalog projection folds only its own types.

### 3.7 UI extensions

UI extension declarations and browser widgets belong to the separate shell modules. The core exposes plugin schema options, caller-scoped catalog access and the backend extension contracts; it bundles no UI implementation or shared UI dependency.

### 3.8 Not extension points

- **Transaction or fold hooks.** In a command a hook writes state a lost
  append contradicts; in the projection a plugin fault blocks catch-up and
  so every command, upgrades drift read models, and late installs cannot
  backfill. Plugins use feeds (3.6) or independent declared cursors (3.11).
- **Plugin command handlers.** Plugins write as sources through `apply`.
- **Plugin key/order functions, SQL-returning scopes, read-enrichment hooks
  on `get`, purge participants, global plugin columns, DDL on registry
  reload.**

### 3.9 Plugin lifecycle per catalog

A plugin joins a catalog through the explicit schema membership in §3.2;
its aspects, sources, scopes and channels remain catalog data. No catalog is
configured by writing registry entries.

- The host owns the attachment: only a PIM-held successful creation record proves
  it may adopt an existing deterministic ID; kind, title, parent and caller-provided
  private context provide no provenance. A catalog creation uses the same rule.
  Component registration, context updates and deletion use public operations.
  It creates one attachment component per catalog
  and plugin at activation (identity derived from catalog, plugin and activation
  generation), stores the configuration in it, and removes it at deactivation
  through the platform deletion lifecycle. A plugin never creates, locates or
  deletes its attachment and never computes its identity. Deletion completion
  is the platform's lifecycle state; the host does not poll it.
- Convergence runs outside the host projection: the schema fold records the
  desired plugin state in the same transaction and enrolls a host lifecycle job
  (platform Jobs, leased, idempotent, resumable). The host projection acknowledges
  its batch independently of plugin outcomes. The job creates and removes
  attachments, registers and removes plugin projections, and writes `lifecycle`
  per plugin. A plugin whose declaration is invalid or missing is left as it is
  (nothing is torn down on an invalid declaration) and reported `failed` with
  its `problem`; every other plugin and the host continue.
- Catalog deletion tears down every attachment through the same lifecycle.
- Plugin teardown (`deletable` binding of the attachment) deletes the plugin's
  rows in bounded primary-key pages and answers the platform's native
  continuation while rows remain; the attachment association is removed last.

The attachment is owned by the catalog (`owner` meta = `catalog_id`). Its
credentials (`credential_schema`) are stripped on export; its execution
identity is set by the catalog ADMIN through the platform's identity path.

The lifecycle job bounds projection discovery by platform pages, retains only the current discovery cursor in pending intent and drains it on completion. Declared kinds use exact cursor lookups so unrelated projections cannot hide configuration resets.


Reactivation carries earlier attachment deletion obligations forward until the
public Component delete operation accepts them. A new attachment resets every
projection even when configuration and revision are unchanged. Retryable lifecycle
failures stay pending and reach Jobs as native errors; deterministic plugin
failures isolate. Removal uses stored attachment and projection identities without
requiring a loadable manifest. A bounded plugin scan reconciles ready registrations
every five minutes; revision changes append a host rebuild fact through the exact
producer policy on `plugin_batch`. Read-only entries hold no producer capability.
An unchanged lifecycle pass does not rewrite attachment owner/configuration,
catalog plugin state or the plugin scan position; an actual change still converges
through the same owner operations.

### 3.10 Where plugin data lives

| Data | Home | Why |
|---|---|---|
| Descriptive, releasable, reviewed (dimensions, materials, HS code) | adopted aspect values, written by users or the plugin as a source | versioned, readiness, releases, proposals |
| Pointers to plugin entities (supplier, location, brand) | link attributes | atomic, filterable, in snapshots |
| Operational, high-churn (stock, live prices, reservations) | plugin tables + scope + panel | no product versions per change |
| Derived from products (search index, feeds, counters) | plugin read model from the products feed | rebuildable from state |

### 3.11 Declared plugin projections

A plugin declaration carries projections in this shape:

```
projections:
  - kind: <id unique in the plugin>
    input: state | events
    worker_ref: func://<plugin function>
    events: [<host event kind>, ...]     # input: events only
    revision: <integer, default 1>
```

The host registers each declared projection of an active plugin on the catalog's
thread with the platform projection mechanism, removes it at deactivation, and
re-registers with a reset when the effective configuration or `revision` differs
from what the cursor was registered with.

A registration never replays history from sequence zero. Every (re)registration
is caused by a catalog event (activation, `configure_plugin`, or a host-appended
`plugin.rebuild` fact when only `revision` changed) and starts at that event:
`start_seq` is the causing event's sequence. History before it is not delivered:
it may already be pruned. Unchanged configuration and revision preserve the cursor.

- `input: state` is the way a plugin builds a read model of the catalog's records.
  The platform invokes the plugin's `worker_ref` itself as the registered worker,
  with ordinary callback authority. Each invocation calls the host contract
  `plugin_feed { catalog_id, plugin, kind, token? }` (READ, contract only; no HTTP
  route or agent tool) with the opaque token kept in its projection body. The host
  validates catalog READ and active plugin membership and answers
  `{ attachment_id, config, bootstrap, changes, token, done }`: one bounded page
  of its durable state feed (the one `list_changes` answers), with upserts carrying
  the record and deletes for trashed and purged records. An absent token starts
  from the beginning with `bootstrap: true`. The host owns the token format,
  paging, gap reset and bootstrap bookkeeping. The worker maps `changes` to its
  own store, stores the returned token in the body and reports progress; it
  acknowledges the triggering range only when `done` is true and its writes
  commit. `done` requires the host materialization to reach the catalog thread
  head sampled before reading the page, with no rebuild or remaining page.
  The worker does no paging logic, event decoding, attachment or configuration
  lookup and never interprets the token. `bootstrap` stays true until the feed
  reaches the registration position after a (re)registration; per-kind
  `bootstrapping` reads the host-issued token. The feed reports every record
  whose readable document changed, including descendants whose inherited or
  rolled-up values changed.
- `input: events` delivers declared host event kinds directly to `worker_ref`
  from the registration point in bounded native platform batches. The worker
  obtains attachment and configuration context from `plugin_context`. It is for
  reactions to facts (a record was purged), not for building a model of state.
- A worker error parks that projection only; the host and the other plugins
  continue. `projections[kind]` shows `last_seq`, `parked`, `bootstrapping`, `error`.
  Exact-id callback policies admit the platform process group; direct member
  calls to plugin workers are refused. The host has no nested worker adapter.

State feed upserts include the referenced terms' current labels alongside the
record's resolved values. A change to a referenced term's labels enrolls the
existing bounded catalog rebuild, so state consumers receive refreshed records
without scanning the catalog themselves. The state adapter acknowledges a range
only after any catalog rebuild affecting that range completes.

Registration sets the native cursor immediately before the causing event, so
activation alone delivers that event and bootstraps an otherwise idle catalog.

Known platform gap: the resolved owner scope refuses a nested plugin-worker
call, while published Core rejects a configured security frame on any projection
worker; producer metadata alone does not attach a policy to that frame.


Each worker is a `function.lua` with `meta.type: projection.worker`,
`method: run`, and no configured security frame. Core validates its `func://`
reference and worker binding before the host registers the cursor. A missing
worker, a wrong worker type or a malformed projection declaration is
`INVALID / plugin_projection_invalid` and becomes the plugin's structured
`problem`; native registry and dependency failures retain their kind and code.

The host uses a projection key scoped to the plugin; Core stores the catalog
execution identity on the cursor and wakes it after committed appends. The
host's platform callback receives `thread_id`, `cursor`, `projection`, events
and `range` and returns `{ body, last_seq }` only after committed worker writes
and bounded feed progress permit acknowledgement. It releases every DB handle;
writes are idempotent by thread and sequence or stable domain keys. Core
advances the event position, including filtered events, and owns event replay;
the host owns the state-feed cursor. Reading a historical schema generation
never requires its former plugin cursors to exist; its declaration retains
its membership and resolved schema copies.

A plugin cursor is not a fold hook (3.8): it has its own cursor, uses the
catalog execution identity stored by Core, and writes only its own read model
and KB behind its attachment. A worker never modifies products directly;
writeback uses the host `apply` contract as a registered source. Search and
Ask revalidate hits through the catalog contract under the caller, including
catalog ACL, scopes, fields and visibility, before returning evidence.
Plugin entries, attachment bindings with deletable, configuration schemas,
events with sibling `meta.output_kind`, ports, exact module access policies,
service-only producers, identity grants and UI slots are declarations.

### 3.12 Declared plugin tools

A `kickside.pim.plugin` registry declaration may carry `meta.tools`, a list of registry ids. Plugin declaration validation resolves every id and requires `meta.type: tool`; missing ids, non-tool entries and malformed lists refuse with native `errors.INVALID`, `details.code = "plugin_tool_invalid"`. Both `schema_options.plugins[]` and `get_schema.plugins[]` carry the declared `tools` list alongside the other declaration fields.

`kickside.pim.traits:pim_readonly` declares `build_func_id: kickside.pim.traits:build_reads` and `kickside.pim.traits:pim_trait` declares `build_func_id: kickside.pim.traits:build`; each trait names its own entry, so the role comes from the declaration. The platform invokes the build function once at compilation with `(prompt, merged_context)` and merges its `{ tools, prompt?, context? }` contribution into the trait. When context names `catalog_id`, the function calls the catalog contract as the caller and contributes tools only for plugins active there. A caller without catalog READ receives no contribution. Without a context catalog, it contributes tools from every valid installed declaration. Readonly includes only tools whose `mcp.required_scopes` is exactly `[state.read]`; working includes all declared plugin tools. `pim_admin` contributes none and its prompt says it pairs with the working trait. Working plus administration compiles each core tool exactly once.

Each tool maps to one exact contract method under the calling actor and scope. Its generic handler copies call arguments, uses trait context only for an omitted catalog id accepted by the method, calls the module client and adds `success = true`. Call arguments win, including invalid values that the contract must refuse. The contract owns validation, access and activation; an inactive catalog refuses with a native `errors.NOT_FOUND` whose `details.code` is `plugin_inactive`. Handlers do not repeat activation checks. Catalog access boundaries preserve the received error kind and source code; dependency denials without a code remain native dependency errors. Trait context reaches tools through `ctx.get`.

Every tool declares a title, a unique PascalCase product alias, a model-facing description of its action, access and result, exact contract input schema, output schema and `mcp.required_scopes`: `state.read` for reads, `state.write` for state changes. Every named input property, including nested filter nodes and value coordinates, carries an actionable description of at most 200 characters. Product references accept `{id}` or `{sku}` with id precedence; inventory locations accept `{id}` or `{code}` with non-empty id precedence. Context maps use dimension names and members declared by `PIMSchemaGet`, and write coordinates supply every dimension in the attribute scope. Proposal inputs expose only existing-product value and status edits. Apply versions are integers or the explicit string `any`; proposal versions are captured at creation, and releases require an integer version. Product and location references name at least one supported identity, stock reads supply a product or product-id list, and reservation lookups supply a key or reservation id. Request structure and top-level enums validate before planning: malformed envelopes return native `INVALID` with `details.code = invalid_request` without appending. Batch-item values judged by the pipeline remain open in schemas and produce their own outcomes, including malformed versions, unknown statuses and missing release versions. Unknown read status filters remain request errors. Search returns hits; ask may additionally return an answer when authorized passages exist. Release and withdrawal channel lists use declared channel codes; omission selects every channel and an empty list selects none. Non-string channel entries produce per-item `invalid_channel` findings; unknown string codes produce `unknown_channel`. Both leave that item unchanged and preserve the other items' outcomes. Registry conformance tests compare contract and tool input schemas in full, including descriptions, check nested description presence and length, compare answer schemas with the tool success field, enforce method coverage or a reasoned exclusion, and require each module's exact `tool_access` policy to equal its declared tools, traits and trait build functions. Trait discovery and build invocation require tool access independently of module membership. Plugins ship their own exact tool policies and no traits. Maintenance and provider seams stay outside traits.

Inventory contributes reads `list_locations`, `get_stock`, `get_reservation`, `list_reservations` and writes `receive`, `adjust`, `reserve`, `commit`, `release` through `kickside.pim.inventory:inventory`. `upsert_location` remains administration; `sweep` remains maintenance. Knowledge contributes the existing `search` tool and `ask`, both reads through `kickside.pim.knowledge:knowledge`; `status` stays outside. Core excludes `catalog.rebuild`, `schema_provider.resolve`, and `link_target.resolve`/`describe` as maintenance or provider seams. `configure_plugin` and contract-only `plugin_context` and `plugin_feed` have no agent tools; the declared agent tool list stays unchanged.

The platform MCP server expands only static trait `tools`; dynamic plugin contributions require upstream MCP support. Modules do not duplicate plugin tools into static traits.


### 3.13 Plugin obligations

A plugin's services admit a call with `plugin_context` and the host's access
rules, authorize every referenced record on the catalog the host resolves it
to (a record that belongs to another catalog than the one the call names is
refused), keep bounded, drained cleanup for every table (rows of removed or
published things do not accumulate on a living catalog), answer native errors
with kind and `details.code` through every boundary including HTTP, and ship
exact-id policies. A plugin ships no Block that duplicates a tool.


## 4. Families, hierarchy, vocabularies

```yaml
code: footwear
aspects:
- core
- marketing
- shipping
requirements:
- id: web
  context:
    locale: all
  require:
  - core.name
  - core.gtin
- id: regional_de
  context:
    locale: de
  require:
  - core.gtin
  - shipping.weight
  authored:
  - marketing.description
variation:
- axes:
  - core.color
  own:
  - core.materials
- axes:
  - core.size
  own:
  - core.gtin
  - shipping.weight
checks:
- check: app:weight_check
  reads:
  - shipping.weight
  config:
    max: '12'
```

- One family per product, fixed for life; descendants share the root's.
- Each attribute is owned by exactly one level (default 0). Values are
  written only at the owning level; no overrides.
- **Items** are leaves. Only items have readiness, releases and publications.
- Axes: key-indexable, scope `()`, cardinality one, always provided;
  `(parent, axis_key)` is unique.
- `unique` attributes: scope `()`, cardinality one, unique catalog-wide by
  key. SKU is unique catalog-wide among live products.
- Depth ≤ 2; descendants per root ≤ 2,000 (max 20,000). Items move between
  parents of the same family; products with live descendants cannot move or
  be deleted.
- **Vocabularies** hold terms (labels, parent, data, retired) changed by
  `apply` term items; codes unique per vocabulary; no cycles; a term in use
  cannot be retired. `term.merge` (§6) re-points values.

## 5. Persistence

### 5.1 Thread

The catalog thread carries schema, product, term, release and withdrawal
events. `meta.retention: { event_days: <requirement
catalog_event_retention_days, default 90> }`.

### 5.2 Events

All bodies carry `actor`, `source`, `origin?` (canonical `{ type, id }`), `provenance?` (reported detail; never
used for authorization).

| Type | Subject | Body |
|---|---|---|
| `pim.schema.applied` | `schema` | generation, declaration, digest, class, plan; activating `plugin_configs` carried outside the declaration |
| Plugin configuration fact from `configure_plugin` | plugin | plugin id and validated configuration change |
| `plugin.rebuild` catalog fact | plugin | plugin id and changed projection revision |
| `pim.product.created` | `p:<id>` | sku, family, parent, level, axis values, patch |
| `pim.product.changed` | `p:<id>` | patch, status?, previous_status? (with status), axis_key?, source_seq? |
| `pim.product.moved` | `p:<id>` | parent, axis_key |
| `pim.product.deleted` | `p:<id>` | — |
| `pim.product.restored` | `p:<id>` | current axis_key |
| `pim.product.purged` | `p:<id>` | — |
| `pim.term.changed` | `t:<vocabulary>:<code>` | labels, parent, data, retired |
| `pim.product.released` | `r:<id>` | release_id, product_id, version, generation, snapshot, hash, channels |
| `pim.product.withdrawn` | `r:<id>` | product_id, channels |

A patch is `[{a, c, before?, v | clear | unset, s?}]`. A product's version
counts its product events and equals Core's `subject_version` of `p:<id>`.
Events ≤ 4 MB; a release snapshot ≤ 512 KB.

Idempotency: successful commands, including successful no-ops, record receipts
in `kickside_pim_receipt`. Effectful commands carry the request hash and outcome
on their first fact, whose fold persists the receipt atomically with projection
coverage. Successful no-ops append no event: PIM records their result only in
its receipt store, under the catalog lock with a captured-position and winner
recheck. A moved position rebuilds the attempt.
A replay first catches up and consults the PIM store, returning the original
outcome; a different request under the same key is `CONFLICT /
idempotency_conflict`. Receipts expire after the catalog event-retention window (currently the catalog
binding's 90 days); retention removes at most the shared bounded page budget. No-op responses retain an absent domain `seq` and report the
covering `as_of`. Failed atomic commands create no receipt. Concurrent deliveries
replay the winner before returning a Core identity conflict. The UI and plugins
send one frozen key and body for each command.

### 5.3 Fixed tables (migration 01, both dialects)

Prefix `kickside_pim_`; every key leads with `catalog_id`.

| Table | Key | Content |
|---|---|---|
| `catalog` | catalog_id | plugin_state (current intent and draining removals), retention_after (trash/archive keysets and row-class rotation), generation, compiled, digest, layout_digest, item_table, applied_seq, rebuild_after, rebuild_seq, rebuild_job, product_count, item_count, trashed_count, tombstone_floor_seq |
| `generation` | catalog_id, generation | declaration, digest, class, actor, applied_seq |
| `term` | catalog_id, vocabulary, code | parent, labels, data, retired, retired_at, updated_seq |
| `product` | catalog_id, product_id | sku, family, parent_id, root_id, level, is_item, axis_key, version, status, state (`live`/`trashed`/`purged`), state_at (time of the last state change), document, source_seq, release_id, created_seq, updated_seq |
| `change` | catalog_id, seq, n | subject, kind, attribute_id, ctx, before, after, actor, source, origin, at |
| `ref` | catalog_id, product_id, attribute_id, ctx, path | kind, target |
| `unique_value` | catalog_id, attribute_id, value_key | product_id |
| `attribute_usage` | catalog_id, attribute_id | products |
| `release` | catalog_id, release_id | product_id, version, generation, snapshot, hash, channels, seq |
| `publication` | catalog_id, channel, product_id | release_id, state, seq |
| `proposal` | catalog_id, proposal_id | items, base, source, origin, status, result, created_by, decided_by |
| `job` | catalog_id, job_id | job_type, key, identity (captured row), status, error, created_at |

Indexes: `product(catalog_id, sku) WHERE state = 'live'`, `product(catalog_id,
parent_id, axis_key) WHERE state = 'live'`, `product(catalog_id,
updated_seq, product_id)`, `product(catalog_id, root_id)`,
`change(catalog_id, subject, seq)`, `change(catalog_id, at)`, `ref(catalog_id, kind, target)`,
`publication(catalog_id, channel, seq)`.

### 5.4 Generated tables (compiler)

Deterministic identifiers `pim_<catalog token>_g<n>_…` (≤ 63 bytes), columns
named by stable attribute ids:

- **Item table**: one row per live item — `product_id`, `root_id`,
  `family`, `status`, `version`, a typed column per indexed `(attribute,
  context)` holding the resolved value, `r_<set digest>` per requirement set,
  `findings` JSON.
- **Set table** `(product_id, col, value_key)` for indexed list/set
  attributes.
- **Search**: PostgreSQL `tsvector` + GIN; SQLite FTS5.
- Unique attributes get a unique index as a backstop.

Item tables derive entirely from `product` + schema and can always be
rebuilt. Indexed columns ≤ 400 per catalog.

### 5.5 Projection

A content-thread projection (`func://`, prefetch events) folds each batch in
one transaction with `catalog.applied_seq`; events at or below it are
skipped, so a redelivered batch is a no-op. Per event it updates `product`,
`ref`, `unique_value`, `attribute_usage`, `change`, counters, item rows (the
item, or every item under a changed model), terms, releases and
publications, and schedules jobs with `jobs.enqueue_tx`. Every product row
whose resolved view changes gets `updated_seq` = the event seq: a model edit
stamps each recomputed descendant (≤ 20,000), so the `list_changes` feed reports
inherited changes.

The fold has a 20,000-row budget. Item recomputation and schema fan-out both
consume it. Removed attribute references, unique claims, usage rows, generated
set/search rows and vocabulary terms are deleted in bounded pages; channel
withdrawals consume one row each. A schema event keeps its checkpoint before
the event until every page finishes. `schema_work(catalog_id, seq)` records
that phase with each partial commit; snapshot reads and export answer native
`UNAVAILABLE` with `details.code = schema_applying` until the final schema,
history and checkpoint commit clears it. Redelivery resumes from the remaining
rows. Ordinary product events stop after the event that reaches the budget.
Catch-up keeps read-your-writes by waiting for the seq. Schema folds record
plugin desired state and enroll the host lifecycle job in the fold transaction
(§3.9). The configuration fact from `configure_plugin` updates desired state
and enrolls the same job in its fold transaction. Plugin convergence never
gates the catalog checkpoint or acknowledgement. After commit the worker
publishes public meta (`component.set_meta`).

Lock order, everywhere: catalog row → product rows in `product_id` order →
generated tables. Commands take no table locks; they serialize on the thread
head.

### 5.6 Change history

`origin` is Core's canonical `{ type, id }` provenance (`kickside.core.provenance:source_ref`), `provenance` carries reported detail beside it (model, confidence, evidence), and `approval_item_id` names the accepted proposal. History rows store them together.

`change` is the catalog's history and audit trail; it outlives event
retention and `list_history` reads only it. Rows are keyed `(seq, n)` with
`subject` (`p:<id>`, `t:<vocabulary>:<code>`, `schema`), `kind`, attribute,
context, before, after, actor, source, origin and `at` (the command time,
stamped into every event body by the writer).

- Lifecycle, schema, term and release rows (`created`, `status`, `moved`,
  `deleted`, `restored`, `purged`, `schema`, `term`, `released`,
  `withdrawn`) are always written.
- Value rows (`set`, `clear`, `unset`, one per patch step) are written when
  the event body carries `audit: true`. Command prepare decides it: the
  catalog policy over the `audit` setting, then the source's `audit` switch.
  The fold reads nothing outside the log, so a cold settings cache never
  stalls catch-up, and a policy change applies from the next command.
- Rows are written exactly once, when the event is folded (redelivered
  batches are skipped by `applied_seq`); rebuilds never touch them. Rows per
  event are bounded by the command limits (§16).
- `list_history` pages newest first per product or per catalog with a `(seq, n)`
  cursor; queries by actor or attribute are not served. Retention comes
  from §5.9.

### 5.7 Trash

`delete` moves a product to `trashed` (SKU, unique values and axis slot are
released; item and ref rows removed, so trashed products block no term
retirement; publications withdrawn). Schema removals rewrite trashed
documents like live ones. `restore` within the trash window validates the
product at the head like a write: family exists, parent live, SKU, unique
values and axis slot free, references valid; otherwise `conflict` or
`invalid` with the clashing keys. Every stored coordinate and value is validated
against the current form, context, index and family ownership before append;
incompatible representations remain trashed. After the
trash window (§5.9) the retention owner (`kickside.pim.retention:owner`,
running as a `system:` actor) appends `pim.product.purged`, an output
declared `system_only: true`; the fold drops the document and refs and keeps a
tombstone row (`product_id`, `sku`, `state = purged`, `state_at`, `updated_seq`) so feeds
report the delete to consumers that come later. Tombstones older than
`tombstone_days` are removed by the retention owner, which advances
`catalog.tombstone_floor_seq`; a feed page whose cursor is below it carries
the pullable's `source_gap`, and the consumer resyncs from cursor zero.

### 5.8 Jobs and retention

| Job | Kind | Work |
|---|---|---|
| `rebuild` | slot per catalog | recompute rows after a semantic schema change (§8) |
| `release_model` | one-shot | release commands over a model's items |
| `term_merge` | one-shot, key `(vocabulary, from, into)` | rewrite values of a merged term |
| `import` | one-shot per file | import batches with frozen idempotency keys |
| host plugin lifecycle | leased, idempotent, resumable per catalog | converge stored desired plugin state, attachments, projections and per-plugin lifecycle (§3.9) |

Jobs carry no identity. Jobs that append events (`release_model`,
`term_merge`, `import`) store the requesting actor's captured identity
(`execution_identity.capture()` → row) on a PIM job row; the worker resolves
it with `kickside.execution.defer` on its exact worker entry and issues
ordinary commands as that actor. `rebuild` appends nothing and runs as the
catalog identity. The host plugin lifecycle job runs as the catalog's stored
execution identity; its revision-only `plugin.rebuild` appends use the host's
producer capability. One-shot jobs use Jobs' `max_attempts` and end `dead`. The `rebuild` slot
never dies: a run that fails with a retryable error is retried by Jobs; any
other failure is parked by the worker itself (it answers Jobs' `park` with a
failed record, since Jobs classifies failures by kind, not by `retryable`),
reads stay `rebuilding: true`, and the next
`apply_schema` or the ADMIN method `rebuild` wakes it to resume from its
cursor. Failure state lives only on the Jobs row (`last_error`, read with
`jobs.get_job` through `catalog.rebuild_job`); public meta shows it as
`rebuild_error` while the rebuild is pending. `kickside.pim.retention:owner` (`kickside.retention.owner`) purges trash past
its window, change rows and tombstones past theirs. Each invocation visits at
most ten catalogs and spends one 500-row budget across trash scans, audit pruning
and tombstone pruning. Teardown shares that budget, with a reserved half, and
one catalog receives at most 50 rows. The singleton `retention` row persists
the catalog scan position, pending-work aggregate and minimum future deadline;
each catalog retains its trash/archive keysets and row-class rotation. A version conflict keeps
the product and advances the scan so other rows and catalogs still progress.
`sweep_complete` marks the end of one sweep; `needs_continue` also signals work
deferred by a version conflict. Catalog failures retain their native errors
while the bounded page continues over other catalogs.

Owners return `deadline_ms`, the earliest future eligibility among retained
trash, tombstones and enabled audit history under the effective catalog policy.
A complete idle sweep still returns that deadline. Partial pages persist the
minimum with the discovery position. Each row class uses one indexed seek over
rows that are not yet eligible; retired products use the partial index on
`(catalog_id, state, state_at) WHERE state <> 'live'`. Thread activity wakes the
platform retention service; user writes and projection commits send no retention
notification. The service wakes at the deadline without another write.

The retention owner runs as `system:kickside.pim.retention`; purge events
record that actor.

Framework-only job, retention, teardown and migration callbacks have exact
invocation grants in the platform process scope, outside member runtime grants. Jobs begin as `system:kickside.jobs` and
resolve their owner's stored principal before domain work. Component deletion
runs as `system:kickside.component.retention`; retention invokes owners from its
process scope. Delegated batch and cleanup entrypoints also require framework invocation;
their bodies execute under the selected principal and retain their required
catalog or attachment access.

The dispatcher admits catalog and plugin projection calls in its framework
frame, then executes each callback under the stored principal's live scope.
The projection and post-commit entrypoints therefore require exact framework
invocation grants, with no member invocation grant. Metadata validation of a
plugin worker uses a separate read-only declaration capability.

`kickside.pim.persist:publish_meta` admits catalog readers and republishes stored
counts; `kickside.pim.extensions:plugin_projections` requires WRITE and enrolls
the host lifecycle job to converge only toward stored desired plugin state. It does not
perform convergence in the catalog projection or wait for attachment deletion.
Neither accepts caller-provided counts or plugin choices as authority.
These helpers remain callable by authorized members. Settings validators run in
the settings writer's caller frame.

Published runtime invocation denials can lack `details.code`; that platform
error remains visible rather than being reclassified by a product wrapper.

Every job reserves the command's five-second work budget inside
`input.job.deadline`, rearms before starting a batch that cannot fit, and passes
the enclosing deadline into commands and projection waits. Batch entry points
require the public command's catalog access before changing state: ADMIN for
rebuild and WRITE for model release.

### 5.9 Configuration

Deployment defaults are Kickside settings (namespace `kickside.pim`,
`kickside.settings:definition` entries in `kickside.pim.settings`, fields at
the entry's top level, value types from the closed set; edited by admins in
the settings UI):

| Key | Type | Default | Meaning |
|---|---|---|---|
| `audit` | string, `schema.enum: [fields, off]` + `validate_func` | `fields` | write `change` rows |
| `audit_days` | int, 0–106751 | 365 (0 = 365-day default) | bounded change-row retention |
| `trash_days` | int, 1–106751 | 14 | trash window before purge |
| `tombstone_days` | int, 1–106751 | 365 | tombstone retention |
| `proposal_days` | int, 1–3650 | 30 | Proposal retention (days) |
| `completed_work_days` | int, 1–3650 | 180 | Completed release work retention (days) |
| `abandoned_work_days` | int, 1–3650 | 180 | Abandoned release work retention (days) |
| `import_days` | int, 1–3650 | 180 | Completed import retention (days) |
| `pending_creation_days` | int, 1–3650 | 90 | Pending creation expiry (days) |
| `proposal_count` | int, 1–1000 | 1000 | Proposal quota |
| `proposal_bytes` | int, 1024–262144 | 262144 | Proposal size (bytes) |
| `command_deadline_ms` | int, 100–5000 | 5000 | Command execution budget (ms) |
| `maintenance_rows` | int, 20–500 | 500 | Maintenance work per callback |
| `maintenance_catalogs` | int, 1–10 | 10 | Catalogs per maintenance callback |
| `rebuild_rows` | int, 1–500 | 500 | Products per rebuild transaction |
| `job_batches` | int, 1–20 | 20 | Batches per job execution |
| `import_rows` | int, 1–200 | 200 | Rows per import batch |

Audit history is always bounded: `audit_days = 0` resolves to 365 days in both
deployment settings and catalog overrides, including previously stored zero values.
Omitting the override inherits the deployment value; an explicit zero selects 365
even when the deployment has a different finite value. Settings validation,
metadata schemas and catalog declarations enforce the same 106751-day duration
ceiling (matching Work). Trash and tombstone windows remain positive.

A catalog overrides these in its declaration (`policy`), except the installation-wide
`pending_creation_days`, `maintenance_rows` and `maintenance_catalogs`. Those
three belong to deployment settings; catalog overrides are refused. A key set
to `false` returns to its deployment default; unknown keys are refused and excludes sources from audit
(`sources: [{ id: erp, audit: false }]`, for bulk imports); an override is a
cosmetic schema change, versioned like any other, edited in the catalog
manage view (ADMIN). Settings namespaces render in the Kickside settings UI
by themselves; the catalog settings Policy section shows effective deployment
defaults and catalog overrides through shared controls. Event retention stays the deploy-time requirement
`catalog_event_retention_days`, because it is fixed in the binding's
`meta.retention`.

## 6. Commands

HTTP request readers enforce the 4 MiB runtime body limit while reading raw
bytes, before JSON decoding or catalog authorization; body-read errors remain
native. A proposal additionally admits the effective `proposal_bytes` of full request data
and `proposal_count` retained proposals per catalog (defaults 256 KiB and 1,000). Serialized catalog admission and a catalog
foreign key fence proposal insertion against deletion.

Every catalog request, including the complete proposal and all origin, source,
provenance, release channels and schema/configuration content, is admitted before
schema validation, planning or persistence: at most 4 MiB of compact JSON,
16 nested containers (the request is depth one), and 4,096 entries per array or
object. Exceeding a budget
answers non-retryable `INVALID / request_budget_exceeded` and stores nothing.
The product document and item-count limits apply in addition.

Schema boundaries by method (tool inputs equal their contract inputs):

| Method | Request-level validation | Per-item pipeline decisions |
|---|---|---|
| `apply` | object, top-level source/mode/keys, items list of objects, reference objects with id or sku, operation containers | status, expected version, source sequence, family/term codes, labels, attribute codes, contexts and authored values |
| `propose` | object, top-level source/origin/provenance/keys, items list of objects, product reference and edit containers | status, attribute codes, contexts and authored values; captures base versions |
| `release` | object, top-level keys, items list of objects, product reference and channel-list structure | missing or malformed expected version and channel codes |
| `withdraw` | object, top-level keys, items list of objects, product reference and channel-list structure | channel codes |
| PIM reads, schema operations, `create`, `decide`, `rebuild` | every parameter, including read status and decision enums | no batch-item boundary |
| Inventory `upsert_location`, `list_locations`, `get_stock`, `receive`, `adjust`, `reserve`, `commit`, `release`, `get_reservation`, `list_reservations`, `sweep` | every parameter; these methods have no command-item list; reservation state filters remain enums | none |
| Knowledge `search`, `ask`, `status` | every parameter; these methods have no command-item list | none |


Request validation checks the call object, top-level parameters, the `items`
list and its object members, and reference objects with `id` or `sku`.
Inside `apply`, `propose`, `release` and `withdraw` items, values the command
pipeline judges remain open in the input schema: status, versions, source
sequence, attribute codes and contexts, authored values, family and term
codes, labels and channel codes. Their descriptions declare accepted values;
conformance checks the status description against the status constant.
Missing release versions produce per-item `conflict`; malformed apply values
produce per-item `invalid`. Independent commands retain each outcome and commit
the valid items. Read filters remain request-level: unknown query statuses
return `INVALID / invalid_request`. Inventory commands and knowledge queries
have no batch item pipeline; their top-level inputs remain boundary-validated.

Contract `kickside.pim:catalog`, method `apply`:

```json
{ "catalog_id": "…",
  "idempotency": { "namespace": "ui", "key": "…" },
  "source": "erp",
  "mode": "atomic | independent",
  "items": [
    { "product": {"id": "…"} | {"sku": "B-100"},
      "expect_version": 12,
      "create": { "family": "footwear", "parent": {"sku": "B-100"} },
      "upsert": false,
      "set":   [ { "attr": "marketing.description", "ctx": {"locale": "de"}, "value": "…" } ],
      "clear": [ { "attr": "marketing.color_name", "ctx": {"locale": "de"} } ],
      "unset": [ { "attr": "shipping.hs_code" } ],
      "move":  { "parent": {"sku": "B-200"} },
      "status": "active", "delete": false, "restore": false, "seq": 41 },
    { "term": { "vocabulary": "colors", "code": "moss" }, "labels": { "en": "Moss" } },
    { "term_merge": { "vocabulary": "colors", "from": "olive", "into": "moss" } } ] }
```

Steps:

1. Authorize (catalog WRITE; READ for `propose`; ADMIN for schema and for
   portability restore, the import path that keeps each value's original
   source).
2. **Prepare**, once, outside any transaction: resolve codes, form and type
   `normalize`/`validate`, source bindings and aspect write rules, link-target
   and component resolution.
3. Catch up the projection; `S` = `catalog.applied_seq`.
4. Validate every item at `S`: `expect_version`, hierarchy and ownership,
   term and product references, SKU, unique values, axes, enforced checks.
   Each item sees earlier accepted items in the command, including pending
   term labels and references used by merges and relationship checks. A refused
   item contributes no state to later items.
   Read requested term references as distinct vocabulary/code pairs in bounded
   batches at this head, including stored absences. Share these immutable reads
   across item attempts; pending term edits take precedence. A command creating
   260 parentless items with only nonunique term values and no enforced checks
   needs at most two planning reads after catalog load (SKU holders and term references),
   independent of repeated references.
5. Build events; an unchanged item appends nothing. `independent` keeps
   failed items' outcomes; `atomic` fails the whole command.
6. Append with `expect = { head = S }`. On `head_mismatch` go to 2 if the
   schema generation changed, else 3. The command retains normalized values and
   resolved link targets between head conflicts in one generation and discards
   that preparation when the winning generation changes. It answers `busy` at
   the command deadline (5 s).
7. Catch up to the appended `max_seq`; return outcomes with versions and seq.

Outcomes: `created | updated | unchanged | conflict | invalid | forbidden`
with findings. Merge reference paging first selects distinct live holders under
the product limit, then returns all matching references for those holders. A
500-holder page completes within the 5 s command deadline.
Merge-generated edits use the ordinary product-edit validation,
including unique claims and enforced checks. Deferred merge identity and metadata
travel in the accepted term event and persist in its fold transaction.
`term_merge` validates every affected holder before retiring `from`, using the
ordinary product-edit rules and a 20,000-holder admission cap; exceeding that cap
refuses without changing state. An outstanding merge cannot be retargeted to a
second destination; intervening term-label edits retain the pending destination
within the same command. It then retires `from` (blocking new references),
then rewrites every value referencing it: up to 500 products in the command
itself (outcome `updated` with `term`, `rewritten`, `deferred`), beyond that
through the `term_merge` job, which repeats the merge command as the asking
actor with that actor's source until no reference remains (the merge of a
retired term continues the rewrite without retiring it again). The command
refuses a merge that would rewrite a variation axis, and one whose values sit
in an aspect the command's source may not write; a set keeps one copy of
`into`. Touched products gain a version like any change. Ordered sources (`ordering: sequence`) send `seq` per external key;
an older one is `unchanged` (`stale_source`).

### Event schema evolution

The fold parses every stored event against its type's declared body schema
before folding it, so event schemas evolve only compatibly: a schema may gain
optional properties; it never gains a required property, drops a property or
changes a property's type. A frozen baseline in the test suite enforces this.

## 7. Reads

Text search requires every maximal Unicode letter/number token, in any order,
across indexed text. Indexing and queries use that same token grammar on both
engines. Punctuation, including quotes, separates tokens; quotes do not request
phrases. Matching ignores Unicode letter case and preserves accents. An input
with no tokens has no text matches. SKU prefix matching also applies to the
original input, independently of text tokens.

Reads run in one read snapshot and return `as_of`. PostgreSQL snapshots use
a read-only repeatable-read transaction; SQLite uses one read transaction.
An export reads its declaration, terms and every product page in that same
snapshot. A `min_seq` beyond the committed projection answers `unavailable`
without waiting. During a rebuild reads report `rebuilding: true`.

Every request is parsed at the service boundary against its method's input
schema in the contract definition before the method acts; a malformed request
ends as `invalid` there. Parsing goes through the record engine's tolerant
schemas, which read an empty Lua table as both an empty list and an empty
object, the one place where JSON's `[]`/`{}` distinction is lost.

A layout column added by a schema change is write-only until the rebuild
that fills it completes: filters, sorts, readiness filters and text search
naming it answer `unavailable` (retryable) instead of serving a partial index.

Reads serve committed read-model state and never wait on the projection. A read
naming a `min_seq` the projection has yet to reach answers `unavailable`
(retryable, `details.code = projection_behind`) at once; commands wait for
coverage before they answer, so a caller reads its own writes.

HTTP follows the contract: reads are `GET` with query parameters (`/schema`,
`/product`, `/history`, `/proposals`, `/releases`, `/releases/{release_id}`,
`/links`, `/explain`, `/changes`, `/publications`), commands and the filter query
are `POST` (`/schema`, `/schema/plan`, `/query`, `/apply`, `/proposals`,
`/proposals/{proposal_id}/decision`, `/releases`, `/withdrawals`, `/rebuild`,
`/plugins/{plugin}/config`), all
under `/pim/catalogs/{id}`.

The catalog contract's `list` rows and `get_schema` response include required
`access: { read: boolean, write: boolean, admin: boolean }` for the ambient
caller. The HTTP reads `GET /pim/catalogs` and
`GET /pim/catalogs/{id}/schema` preserve that shape in `data`. Each boolean
reports its own component grant: ADMIN does not imply WRITE. `list` contains
only readable catalogs; `get_schema`, including a past generation, requires
current READ and reports current caller access. The shell consumes these
booleans directly: ADMIN controls Settings, Form layout and schema mutation
controls; WRITE controls product creation and editing. A refresh that removes
WRITE closes an open product creation dialog; restoring WRITE does not reopen
it. Catalog counts use
"1 catalog" and "N catalogs" for every other count.

Every read first admits the ambient caller as a reader of the catalog through
the component security system (READ); the read snapshot takes that reader,
so no read path reaches the catalog tables without it. Item queries are
compiled by one read-model query builder (`kickside.pim.read:select`) over
`sql.builder`: identifiers come only from the compiled layout (and, with
scopes, from validated scope declarations), values are bound, and the builder
writes the dialect's placeholders. Scopes gate on the reader's access (3.5).
The catalog is the security unit: READ sees every item of the catalog.

| Read | Returns |
|---|---|
| `get({ product, context?, min_seq? })` | product identity and lineage, values resolved for the context with provenance, readiness, `release_id`, and `publications: [{ channel, release_id, state }]` |
| `query({ where?, text?, family?, status?, parent?, root?, ready?, published?, scopes?, sort?, limit?, after?, count?, min_seq? })` | live items by a filter tree over item-table columns and set membership, text, readiness, hierarchy (`parent`/`root`: a product ref; `root` must name a root product, and both combine), publication (`published: { channel }`) and scopes (3.5); sorted on item-table columns; keyset pages (≤ 200); with `count: true`, `total` exact to 10,000 matches within the walk below, otherwise what it counted with `estimated: true`; a filtered query walks at most 200,000 rows per request and, stopping early, answers what it found with `incomplete: true` and `after` to continue from |
| `list_history({ product?, before?, limit? })` | change rows newest first (5.6) |
| `list_links({ kind, target, cursor?, limit? })` | products referencing a target, for every ref kind (`product`, `term`, `asset`, `component`, link kinds), from `ref(catalog_id, kind, target)` |
| `get_release({ release_id })` | the immutable snapshot, hash, version, generation and channels |
| `list_releases({ product, before?, limit? })` | a product's releases newest first |
| `get_schema({ generation? })` | the declaration and compiled public parts of the head (including an initially empty schema), or of a past generation; `plugins` is the per-catalog state list in §3.2 |
| `plugin_context({ catalog_id, plugin })` | contract-only READ; `{ attachment_id, config, lifecycle, projections }` for an active plugin (§3.2) |
| `plugin_feed({ catalog_id, plugin, kind, token? })` | contract-only READ; one bounded state page `{ attachment_id, config, bootstrap, changes, token, done }` for an active declared state projection (§3.11) |
| `explain({ product, attr, context })` | the resolution steps (2.6) and the findings behind readiness |
| `list_changes`, `list_publications` | the feeds (§12) |

`where` is the record engine's filter tree: a node is one of `{ and: [node] }`,
`{ or: [node] }`, `{ not: node }` or a leaf `{ field, ctx?, op, value }`, nesting
at most 6 levels with at most 64 leaves and 500 values. Single fields take `eq`,
`neq`, `in`, `nin`, `is_null`; ordered fields (numbers, quantities, time) also
take `lt`, `lte`, `gt`, `gte`, `between`; text fields also take `contains` and
`starts_with`, which read their operand as literal text; sets take `has`, `in`,
`nin`, `is_null`. `neq` and `nin` match empty values, and `not` is the exact
complement of its node.

A value may be an operand: `{ "$actor": "id" }` or `{ "$now": "<ISO 8601 duration>" }`
in weeks, days, hours, minutes and seconds. The engine's history and relation
conditions are not served by the catalog query (5.6); catalogs link through
link attributes, and the engine's fold-assigned `counter` form is refused in a
catalog schema.

`get` returns raw values; labels of link targets come from their owners'
UI.

### 7.1 Route and access inventory

The authenticated router exposes these exact paths, relative to the host API
prefix. All catalog endpoints belong to `kickside.pim.security:pim_endpoint_access`,
selected by `module_access`; method authorization then enforces the catalog ACL.
`CREATE` means an authenticated catalog creator; `list` discovers only catalogs
the caller can read. ADMIN and WRITE are independent grants, not implied by READ.

| Operation | HTTP | Path | Catalog access |
|---|---|---|---|
| `list` | GET | `/pim/catalogs` | READ |
| `create` | POST | `/pim/catalogs` | CREATE |
| `get_schema` | GET | `/pim/catalogs/{id}/schema` | READ |
| `apply_schema` | POST | `/pim/catalogs/{id}/schema` | ADMIN |
| `plan_schema` | POST | `/pim/catalogs/{id}/schema/plan` | ADMIN |
| `configure_plugin` | POST | `/pim/catalogs/{id}/plugins/{plugin}/config` | ADMIN |
| `get` | GET | `/pim/catalogs/{id}/product` | READ |
| `query` | POST | `/pim/catalogs/{id}/query` | READ |
| `list_history` | GET | `/pim/catalogs/{id}/history` | READ |
| `apply` | POST | `/pim/catalogs/{id}/apply` | WRITE |
| `propose` | POST | `/pim/catalogs/{id}/proposals` | READ |
| `list_proposals` | GET | `/pim/catalogs/{id}/proposals` | READ |
| `decide` | POST | `/pim/catalogs/{id}/proposals/{proposal_id}/decision` | WRITE |
| `release` | POST | `/pim/catalogs/{id}/releases` | WRITE |
| `list_terms` | GET | `/pim/catalogs/{id}/terms` | READ |
| `schema_options` | GET | `/pim/catalogs/{id}/schema/options` | READ |
| `list_releases` | GET | `/pim/catalogs/{id}/releases` | READ |
| `get_release` | GET | `/pim/catalogs/{id}/releases/{release_id}` | READ |
| `withdraw` | POST | `/pim/catalogs/{id}/withdrawals` | WRITE |
| `rebuild` | POST | `/pim/catalogs/{id}/rebuild` | ADMIN |
| `list_links` | GET | `/pim/catalogs/{id}/links` | READ |
| `explain` | GET | `/pim/catalogs/{id}/explain` | READ |
| `list_changes` | GET | `/pim/catalogs/{id}/changes` | READ |
| `list_publications` | GET | `/pim/catalogs/{id}/publications` | READ |
| shell extensions | GET | `/pim-ui/catalogs/{id}/extensions` | READ |

`plugin_context` and `plugin_feed` require catalog READ and are contract only;
they have no HTTP route or agent tool. `configure_plugin` has no agent tool.
`create` and
`apply_schema` accept `plugin_configs` separately from `declaration`; the
existing `PIMCatalogCreate` and `PIMSchemaApply` inputs carry that field.
`plan_schema` accepts the same activation configuration for validation and
provider resolution without appending.

The shell endpoint belongs to `kickside.pim.ui.security:member_endpoints` in
that module's `module_access`. Its response contains panels, columns, actions,
editors and link views filtered by catalog adoption and independent caller grants.
The fixture `test/src/spec_fixture.yaml` copies the family example and catalog
route inventory for executable conformance checks.

## 8. Schema evolution

CRM model: **merge** named entries (dimensions, vocabularies, aspects,
families, sources, channels by key; plugins by `use`; attributes by code or
by `id` for a rename). Named attributes take the incoming declaration order
and retain their ids; omitted previous attributes follow in their previous order.
`declaration.remove` destroys; **classify** each change against
usage facts (an attribute is used while a live product holds a set or cleared
cell of it):

| Class | Examples | Effect |
|---|---|---|
| cosmetic | rename by id, labels, policy, scope adoption, plugin choices | new generation |
| additive | new attribute, aspect, family, vocabulary, source, member; changes to unused attributes | new generation; layout altered in place |
| semantic | defaults, fallback, index, requirements, checks, re-adopted check digest, removal of a used attribute | new generation; layout altered; rebuild |
| refused | form, cardinality, vocabulary, representation config (`scale`, `range`, `case`, `members`, `target`, `units`, `canonical`, `currency`), scope or `unique` on a used attribute; axes or owning level in a family with products; removing a family with products; removing a dimension or member while the catalog holds products | `invalid`, `migration_required`, change list |

A refused change migrates explicitly: new attribute, copy through `apply`,
remove old, rename by id. The fold alters generated tables in place, deletes
rows of removed attributes and vocabularies, withdraws publications of
removed channels, and schedules `rebuild` when the compiled digest changed.
The rebuild walks live and trashed products in key order, 500 per
transaction, re-arming after 20 batches; it stamps every product it rewrites
with the `schema.applied` seq (`catalog.rebuild_seq`) unless a later event
already stamped it, and never touches `change`. Reads report `rebuilding` until it finishes.

## 9. Readiness and release

- Readiness is computed by the fold for every recomputed item
  (`cost = interactive`) into `r_<set>` and `findings`.
- `release(catalog, items: [{product, expect_version}])` (≤ 100): at head
  `S`, build the item view from `product` rows, embed referenced term labels,
  asset hashes and link `describe` results, evaluate the item's channels with `interactive + release`
  checks, append `pim.product.released` with the snapshot and its hash only when
  the snapshot or requested publications change. An unchanged release returns
  the existing ID/hash and appends nothing when the requested channels already
  publish that hash, independently of the latest product release pointer, including duplicate items within
  one release command.
  Releasing an active model with its current version appends
  `model.release_requested`; the fold persists `release_job` and enqueues the
  one-shot `release_model` job together. Its outcome is `queued` with the durable
  `request_id` and Jobs `job_id`, including receipt replay. The worker releases
  ready active item descendants as the captured requesting actor. Each page
  freezes its exact version-checked command before execution and advances its
  durable position from the frozen command's final product id after that command
  completes, so an interruption replays the same receipt. The pending page has
  no separate cursor column. The batch entry point requires catalog WRITE before preparing
  or completing its durable page, including direct calls by module members.
  `released`, `unchanged` and `not_ready` all advance the frozen page. A fresh
  request over already-published items reaches `done`. A refused item surfaces a
  native error on the Jobs row. Completed tasks expire 180 days after completion;
  abandoned unfinished tasks expire 180 days after request creation.
- `withdraw`, trashing and channel removal append or imply withdrawals.
- An item naming a channel the schema lacks is `invalid` in `release` and `withdraw`.
- Publication is the only channel-visibility signal. `status` is editorial:
  `release` requires `active`; changing status never withdraws by itself.
- Release rows are immutable. Current channel publications protect them;
  unreferenced superseded releases expire after the audit window in bounded
  indexed candidate pages. A retained `release_id` can be re-read through
  `get_release`; its schema generation is retained with it.
- A snapshot carries identity and lineage (`product_id`, `sku`, `family`,
  `parent_id`, `root_id`, `level`, `version`, `status`), values by attribute
  code and context, and referenced term labels; its `generation` names the
  schema that decodes it (`get_schema({ generation })`).

## 10. Channels and publications

PIM decides what is releasable per channel; it does not deliver. A channel
is `{ id, requirements: [set ids], families? }`. The fold records a
publication per ready channel (`published`, release_id, seq) and marks
withdrawals. Channel plugins consume the publications feed (§12).

## 11. Proposals

A proposal is PIM-owned state (Core requires WRITE for any append):

- `propose` (READ) stores items and base versions after prepare and enforced
  checks; attributes of source-restricted aspects cannot be proposed.
- `decide` (WRITE): accept claims the proposal with a conditional
  transition, runs `apply` (atomic) with the base versions, its source and
  `origin` with `approval_item_id` set to the proposal, idempotency `proposal/<id>`, then settles
  `accepted`, `conflict` (only stale versions stopped it; decidable again)
  or `failed` (an item refused outright; final); reject works from
  `pending`/`conflict`.
- Proposals are reviewed in the shell's proposals view by WRITE holders;
  public meta carries `pending_proposal_count`. Inbox routing is optional
  and built from platform parts: `pim-flow` exposes a `list_proposals` pullable,
  and an automation feeds it to the Inbox review Block under the
  application's assigner group, whose resolution calls `decide`.

## 12. Integration surface

The catalog contract exposes the feeds as methods (`list_changes({ catalog_id,
cursor, limit, families? })`, `list_publications({ catalog_id, channel,
after: { seq, product_id }, limit })`); a plugin may call them directly. The sink, the sources,
the event ports, the Blocks and the agent tools live in `kickside/pim` as thin
bindings over the catalog contract (the `kickside/pim-flow` split of §17
moves them unchanged).

| Surface | Kind | Contract |
|---|---|---|
| `kickside.pim.source:products` | `kickside.data:pullable` | live, trashed and tombstoned products in `(updated_seq, product_id)` order up to `applied_seq` (while `rebuilding`, up to the rebuilding generation's `schema.applied` seq − 1, so rows the rebuild stamps with that seq are never skipped); `op` upsert (live) or delete (trashed, purged); `item_key` = product id; `dedup_key` = `product_id:updated_seq`; `source_version` = 20-digit zero-padded `updated_seq`; payload: sku, family, parent, level, status, version, resolved values per served context; `source_gap` below the tombstone floor; config `{ catalog_id, families?, aspects? }` |
| `kickside.pim.source:publications` | `kickside.data:pullable` | per channel, `(seq, product_id)` order and cursor; upsert = published release snapshot, delete = withdrawal; `item_key` = product id, `dedup_key` = `channel:product_id:seq`, `source_version` = 20-digit zero-padded `seq` |
| `kickside.pim.source:proposals` | `kickside.data:pullable` | pending proposals in `(created_at, proposal_id)` order with the same tuple as the resumable cursor, for inbox routing (§11); `item_key`, `dedup_key` and `source_version` = proposal id, `occurred_at` = `created_at` |
| `kickside.pim.flow.sink:products` | `kickside.data:writable` | `upsert` items as a registered source; idempotency `sink/(origin, sink_op, key)` |
| collection ports | `kickside.automation.port` | standalone `kickside.pim.source:products_port`, `publications_port` and `proposals_port` bind their corresponding pullables |
| event ports | `kickside.automation.port` | one per event type; wake-ups, not state |
| Blocks | `kickside.block` (`kickside.pim.blocks`) | `get_product`, `query_products`, `apply`, `release`: one function Block per composed contract method; config `catalog_id` through the catalog picker, input = the method's request without it, run as the Flow's caller |
| Agent tools | `agent.trait` `kickside.pim.traits:pim_readonly` | `PIMCatalogs` → `list`, `PIMSchemaGet` → `get_schema`, `PIMSchemaOptions` → `schema_options`, `PIMTerms` → `list_terms`, `PIMQuery` → `query`, `PIMGet` → `get`, `PIMExplain` → `explain`, `PIMHistory` → `list_history`, `PIMLinks` → `list_links`, `PIMProposals` → `list_proposals`, `PIMReleases` → `list_releases`, `PIMReleaseGet` → `get_release`, `PIMPublications` → `list_publications`, `PIMChanges` → `list_changes` |
| Agent tools | `agent.trait` `kickside.pim.traits:pim_trait` | `PIMCatalogs` → `list`, `PIMSchemaGet` → `get_schema`, `PIMSchemaOptions` → `schema_options`, `PIMTerms` → `list_terms`, `PIMQuery` → `query`, `PIMGet` → `get`, `PIMExplain` → `explain`, `PIMHistory` → `list_history`, `PIMLinks` → `list_links`, `PIMProposals` → `list_proposals`, `PIMReleases` → `list_releases`, `PIMReleaseGet` → `get_release`, `PIMPublications` → `list_publications`, `PIMChanges` → `list_changes`, `PIMApply` → `apply`, `PIMPropose` → `propose`, `PIMDecide` → `decide`, `PIMRelease` → `release`, `PIMWithdraw` → `withdraw` |
| Agent tools | `agent.trait` `kickside.pim.traits:pim_admin` | `PIMCatalogCreate` → `create`, `PIMSchemaPlan` → `plan_schema`, `PIMSchemaApply` → `apply_schema`, `PIMCatalogs` → `list`, `PIMSchemaGet` → `get_schema`, `PIMSchemaOptions` → `schema_options` |

Feeds are cursor-resumable over durable state, so a plugin installed a year
later builds its read model from the state feed's beginning. For declared
`input: state` projections, the platform invokes the plugin worker, which calls
`plugin_feed` and stores its opaque token; the host owns paging and the feed
position (§3.11). Direct feed consumers remain
idempotent by `item_key` + `source_version`. The state-feed cursor is independent
of the event registration position; event history never replays from zero.

## 13. Access

Component ACL: READ — read, propose, feeds; WRITE — apply, decide, release,
withdraw, delete, restore; ADMIN — schema, plugin configuration, policy,
sources, channels, restore mode, export, rebuild. Aspect write rules and source
bindings narrow WRITE. Seams declare
`access` (panels, settings tabs) and PIM resolves it server-side per catalog;
the UI never infers capability. Security: `module_access` bundle (catalog
endpoints, views, inbox type), `kickside.pim.security:module_runtime` for
internal namespaces, exact endpoint ids, explicit `registry.get` grants for
announced views shipped by the module that owns the views (`pim-ui`, plugin UI
modules). Plugin seam grants: §3. Agents and automations act under their `kickside.execution`
identity bound to a source.

Core's thread routes retain their platform access rules: updating thread
attributes and retention requires WRITE; deleting the catalog thread requires
DELETE. Authorized deletion returns HTTP 202 while teardown is in progress.
These operations do not authorize appending catalog events.

Catalog events are appended by catalog commands alone. Every output event is
declared `system_only`, so Core refuses it on its thread endpoints whatever the
caller's component access. The producer capability is the private
`*_output_publish` policies in `kickside.pim.security`: declared on the writing functions
(`create`, `apply_schema`, `configure_plugin`, the host lifecycle job's
revision rebuild, `apply`, `decide`, `release`, `withdraw`, sink `write`,
`import_into`), held by no group, and used only after the function has checked
catalog access. A plugin module grants its users `registry.get` on its manifests
and `funcs.call` on the check functions they run; without those the plugin is
refused at adoption.

## 14. Interfaces

Request parsers derive method schemas once per registry version, using the
published Lua `registry.current_version():id()` for invalidation. Byte-integer
definitions validate every byte and convert in chunks of at most 4,096 bytes.
Malformed bytes return `INTERNAL / contract_schema_invalid`.

- Contract `kickside.pim:catalog` (binding `kickside.pim.service:catalog`):
  `create`, `list`, `get_schema`, `plan_schema`, `apply_schema`, `get`,
  `query`, `explain`, `list_history`, `list_links`, `list_changes`, `list_publications`,
  `get_release`, `list_releases`, `apply`, `propose`, `decide`, `list_proposals`,
  `release`, `withdraw`, `rebuild`, `list_terms`, `schema_options`,
  `configure_plugin`, `plugin_context`, `plugin_feed`.

  | Method | Access | Plugin contract |
  |---|---|---|
  | `create` | CREATE | optional initial declaration (empty when omitted) and separate `plugin_configs?`; always establishes generation 1 |
  | `apply_schema` | ADMIN | declaration, `expected_generation?`, idempotency and separate `plugin_configs?` |
  | `plan_schema` | ADMIN | schema request with initial `plugin_configs?`; validates without append |
  | `configure_plugin { catalog_id, plugin, config }` | ADMIN | validates effective attachment configuration before appending one catalog fact |
  | `plugin_context { catalog_id, plugin }` | READ | contract only; active plugin context (§3.2) |
  | `plugin_feed { catalog_id, plugin, kind, token? }` | READ | contract only; bounded durable state page and opaque token (§3.11) |

Successful `create` always establishes the initial schema through `apply_schema`
and waits for its projection before returning the required `generation`. Omitting
`declaration` is equivalent to `{}`: generation 1 has no custom definitions and
includes the built-in `generic` family. `get_schema`, `query` and the catalog
summary immediately read that head with current caller access and zero counts.
Commands before user definitions validate against this empty schema: generic
products are allowed; undeclared families or fields produce ordinary item
validation findings, never `catalog_not_found`. Applying definitions then advances
the head normally with `expected_generation = 1`. While its command receipt is
retained, a matching creation retry returns its original generation and does not
reset a later schema head.
Administration opens the new catalog's schema editor with “Define its schema”.

- Contract `kickside.pim:link_target` (3.3) bound by plugins.
- HTTP (pim): the exact method/path/access inventory is §7.1.
- Shell (pim-ui): `GET /pim-ui/catalogs/{id}/extensions`, `ui.nav_item`
  (Products), `view.component` surfaces (catalog grid, product editor,
  schema, proposal review), component create/manage views.
- Integration (pim-flow): sources, sink, ports, Blocks, tools (§12).
- Public meta: product_count, item_count, trashed_count,
  pending_proposal_count, generation, status, rebuild_error.
- Portable export/import rejects locally malformed requests with `INVALID`,
  `details.code = invalid_request` and `retryable = false` in its failure envelope.
- Realtime: every projection commit updates public meta, and Kickside's
  `set_meta` notifies every catalog reader on `component.<catalog_id>` with
  `component.meta.changed` (carrying `last_event_seq`). Clients treat it as a
  wake-up and read `list_changes` from their cursor; realtime carries no state and
  the feed is the durable source. Audience and delivery belong to the
  platform (`kickside/component`, `kickside/realtime`, relay).

## 15. Durability summary

A shortened retention setting takes effect at the next normal retention pass.

Command receipts live in PIM for the catalog event-retention window (90 days
from acceptance). This replay window includes successful no-ops, whose receipt
is their only stored row and which append no event.
Completed model-release and import work retain their terminal replay state for
180 days; bounded retention drains ID maps before removing import work.
Proposals expire after 30 days, including pending proposals.

| Failure | Behavior |
|---|---|
| Command retried after timeout within the receipt replay window | idempotency key returns the stored receipt |
| Concurrent writers | head CAS retry, then `busy` |
| Projection batch redelivered | skipped by `applied_seq` |
| Plugin type/link/check unavailable | command `unavailable` / finding; never accepted silently |
| Scope error | query fails, never widens |
| One-shot job keeps failing | `max_attempts` → dead; its error stays on the Jobs row |
| Rebuild fails deterministically | slot parks, `rebuild_error`, reads stay `rebuilding`, woken by schema_apply / `rebuild` |
| Plugin seam not granted | fails closed (§3) |
| Feed consumer far behind | `source_gap` below the tombstone floor → consumer resyncs from zero |
| Events expire | history, tombstones, releases and feeds are durable state |
| Plugin installed late | event registration starts at activation; host bootstraps state projections from the durable feed's beginning |
| Plugin declaration becomes invalid or missing | lifecycle fails for that plugin with structured `problem`; existing attachment and projections remain; host and other plugins continue |
| Plugin worker fails | that projection parks; progress and error remain visible; host and other plugins continue |
| Plugin UI tag missing | the shell's own view |
| Catalog deleted | `deletable` requires component DELETE access or a framework maintenance identity before changing rows; a supplied `component_id` context grants no authority. It spends one 500-row budget across generated tables and every fixed catalog row class, including merge intent, release jobs and schema work; partial commits atomically enqueue the catalog in the retention owner's durable cleanup queue and answer success so Core can unregister the component. Fresh retention invocations resume bounded per-catalog shares from durable rows within their overall 500-row budget, excluding queued catalogs from ordinary trash retention. Generated tables are dropped after their rows drain. The cleanup queue retains completion until `lifecycle_report.component_deleted` succeeds, so no lifecycle report precedes removal of every PIM-owned row and a restart between pages or before reporting loses no work. The reaper deletes owned components children-first and purges the thread |

## 16. Limits and scale

| Limit | Default |
|---|---|
| `apply` items / request bytes | 500 / 4 MB |
| document | 256 KB |
| release items / snapshot per item | 100 / 512 KB |
| scope dimensions per attribute | 3 (served contexts ≤ 256 per family keep a three-dimension scope, e.g. channel × locale × market at 4 × 8 × 8, inside the snapshot limit) |
| list / set members | 1,000 |
| dimensions / members / candidates | 4 / 64 / 64 |
| per family: contexts / attributes / checks | 256 / 1,000 / 100 |
| indexed columns per catalog | 400 |
| depth / descendants per root | 2 / 2,000 (max 20,000) |
| scopes per query / predicates per scope | 4 / 8 |
| link targets resolved per command | 2,000 |
| term merge inline / job batch | 500 / 500 products |
| change rows per event | bounded by apply items × patch steps (4 MB request) |
| Core projection page / affected-row fold budget / rebuild batch | 200 events / 20,000 rows / 500 products |
| command deadline | 5 s |
| query page / exact count / scan | 200 / 10,000 / 200,000 |
| feed page | 500 |

Reads have cardinality and scan limits, but no module-owned wall-clock deadline.
The published SQL API inherits the calling frame context and exposes no per-read
deadline setter; PIM cannot cancel all blocking read operations at one chosen
instant. Deployment/transport cancellation still applies. No `read_deadline_ms`
setting or two-second read guarantee is exposed.

The command deadline spans initial catch-up, planning, append and final
projection coverage. The item limit is an admission bound, not a completion
guarantee for every expanded workload. Success requires coverage; a deadline
after durable append returns retryable unavailability, and an idempotent retry
uses the stored receipt.

Compilation rejects declarations above the schema budgets before expanding
their combinations. The indexed-column budget includes text search sources.
Defaults satisfy the same equality-key and index-order constraints as authored
values before a declaration is accepted.

Capacity model: 10M items × 100 values, 20 indexed → one 10M-row item table
with ~20–40 indexed columns. Release gate (benchmarks ship with the
implementing PRs): both engines, 1M / 10M items, imports with concurrent
edits, 20,000-descendant root, full rebuild, feed backfill from zero.

## 17. Installation

PIM's `target_db` must be the Core database; plugin scope tables live in that same database. Sink, sources, ports, Blocks and agent tools are included in the core. UI shells and reference plugin implementations are delivered independently.

## 18. Non-goals

Pricing engine, inventory, orders, DAM storage, storefront search, MDM
matching, product configuration, delivery to channels. Each is a plugin.

## Core hardening details

Plugin findings and batched type results must be dense arrays: object keys,
holes and malformed elements fail closed. Numeric collection membership uses
equality keys; scalar numeric comparisons use order values. Quantity range checks
run after canonical-unit conversion and rounding. Publication filters with no
channel match any published channel.

PIM plugin feeds capture intent, configuration, products and their read stamp in
one SQL snapshot. Core registration is sampled before that snapshot and checked
against its captured sequence, attachment, configuration and revision; inconsistent
registrations fail closed. Schema reads retain the plugin intent from their schema
snapshot and validate sampled projection registrations against it. Plugin tools
resolve through `kickside.agents:tools`; incomplete MCP scope descriptors refuse
with `plugin_tool_invalid` before trait compilation.

DataError transport fields use only the shared contract's allowed codes; native
kind, retryability and condition code live inside `details`. Retention reports
per-component failures in `blocked` while preserving healthy continuation and
rotates cleanup attempts past blocked components. Trash pages use indexed
`(catalog_id,state,state_at,product_id)` keysets with the limit in the selection.
A bounded page of simultaneously failing cleanup owners is a known rare case.
Projection callbacks publish catalog counts; proposal commands publish only proposal counts, so a delayed projection callback cannot overwrite a newer proposal count.
Trace context survives event folding, Jobs admission and frozen child commands.
Imports freeze each command before execution and durably advance progress and ID
mappings after its receipt, under one captured requesting identity and Jobs lease.


### Storage and read guarantees

PIM creation provenance identifies a component creation instance, using a random
token reserved durably in PIM before registration and placed atomically in
private context at registration. A retry reuses that reservation and repeats
thread convergence, including recovery after a committed registration. Reuse requires the matching token and request. A replacement
component at a previously owned predictable ID is refused. Intentional PIM
attachment removal retires that instance's creation record; external repair
deletion preserves the record so a replacement still fails comparison.

Restore computes the axis key from the current compiled schema, checks that
current slot, and carries the replacement key in its restore event. Text-form
axes remain refused by current schema admission.

Saving an unchanged effective plugin configuration appends nothing. Any intent
advance whose `start_seq` differs from the registration resets that projection,
even when revision, configuration and attachment otherwise match.

A release with the same snapshot hash and already-current requested channel
publications returns the existing release ID and hash without appending or
rewriting release/publication rows. Publishing that snapshot to a changed channel
reuses the release and records the changed publication. Historical release
metadata keeps its original generation. A keyed unchanged command may create
only its replay receipt.

Superseded release snapshots (no channel currently publishes them), publication
tombstones, unreferenced obsolete schema generations and unreferenced retired
terms expire after the catalog audit window. A zero audit window retains that
explicit keep-history policy. Current channel publications protect their release
and its generation. Current/rebuilding/pending schema state protects its
required generations. Live value references, term children, pending merges and
current schema defaults protect terms. Release snapshots contain their own term
labels. Zero-count attribute usage rows are collected in bounded pages.

One owner invocation has a shared budget of 500 examined/deleted rows and visits
at most ten catalogs. Teardown reserves at most half the budget, and each
catalog receives at most 50 rows per pass. Trash and other row classes share
that catalog budget; exhausted classes rotate. Per-catalog keysets preserve
trash and archive progress across rotation. Archive candidate pages are indexed
and bounded even when every examined row is protected. Full pages request
continuation until that archive scan completes; completed scans stay complete
through continuation sweeps of the same drain cycle. The singleton reuses its
former product cursor to identify that cycle; catalog completion flags have
fixed size. Deletions reopen scans whose protections may have changed. A stable
protected-only installation eventually stops requesting continuation. Unchanged cursor values are not rewritten. Durable scan positions
may advance while traversing a multi-page installation; they have fixed size.

Durable term import seeks the next byte from its existing checkpoint, reads in
16 KiB pieces, examines at most 200 lines and consumes at most 3 MB per
batch, including whitespace-only lines, and freezes at most 200 terms or 3 MB
per command. Reads are bounded by the same byte budget. A term line is
bounded by the same 3 MB limit. Only consumed bytes enter the durable cursor;
read-ahead is discarded and reread after a retry. No batch decodes the whole
term file. The caller keeps the exported files immutable while an import is
active; changing them mid-import is an unsupported operator race. The
superseded non-durable importer is removed.

The snapshot regressions deterministically commit configuration and product
changes at the read snapshot's return boundary and before schema plugin
decoration. Both answers retain captured configuration, data and stamps.

A keyed eventful command and an eventless successful command reserve the same
receipt key under the catalog fold lock before committing either path. A pending
reservation fixes the request hash for the replay window but is not a completed
result: same-request retries may append; different requests conflict. The event
fold completes that reservation atomically with its projection changes.
Schema reference cleanup seeks `(catalog_id,attribute_id,product_id,ctx,path)`;
generated-set cleanup seeks and orders `(col,value_key,product_id)`.

### Lifecycle and bounded work

Unregistered creation reservations expire after 90 days without another matching
attempt. Preparing a matching retry renews the pending age while preserving its
token; registration confirmation clears that age permanently. Before expiry,
the retention owner checks the exact component IDs through the component contract.
Registered instances retain their provenance even if registration was interrupted
before confirmation, and catalog/thread convergence remains retryable. A single
registration call still running after its renewed 90-day lifetime is a known
operator repair race. Provenance for registered instances remains until accepted
PIM removal or catalog teardown; it is not an abandonment candidate.

Receipt admission shares the catalog fold/teardown lock and refuses pending
catalog cleanup. Eventless admission requires an existing catalog. The first
schema's eventful reservation instead requires sequence zero and confirmed catalog
creation provenance, locked against its removal. After teardown removes both
catalog and provenance, initial-schema admission cannot reopen receipt storage.
Folded receipts require a live catalog. Global expiry seeks reclaim receipts
including absent catalogs; their future eligibility and pending creation ages
contribute indexed deadline seeks. These bounded pages share the existing 500-row
owner budget. No write-path retention notification is introduced.

Release publication comparison seeks `(catalog_id, product_id)`; removing a channel
selects ordered products only from its currently published partial index, so each
50-row cleanup page has constant selection work as the withdrawn prefix grows.
Idle retention does not persist cycle/completion metadata alone when there are no
examined archive candidates and no prior scan position to clear. Durable scan
completion across busy multi-catalog cycles remains unchanged. Receipts are read
only from the receipt store; no event-marker receipt fallback remains.


### Permanent product subject retirement

Requires published Core >=0.3.17. Once a product's final purge event is projected,
its immutable ID is permanently unavailable to restore, commands, queued model
release batches, imports and ID reuse. Older planned writers lose the thread
head guard and rebuild against the permanent purge. The retention owner keeps
the purged tombstone as its durable address, selects an age-eligible bounded
page, closes the PIM transaction, and retires exact `p:<id>`, `r:<id>` and
`model-release:<id>` subjects through Core. Only after Core success does a new
catalog-locked PIM transaction delete those exact tombstones and advance the
feed floor. Errors and ambiguous results preserve addresses for idempotent retry.

No additional persistence or service is introduced. Each product charges four
work units (three exact Core subject seeks, including absent names, plus one
owner deletion) to the existing 500-row callback / 50-row catalog budget. Core
pages never exceed 33 products / 99 names. Only the retention owner's function
scope grants `threads.subjects.retire` on `pim.catalog`, never ordinary member or
WRITE authority. Release expiry on a live product does not retire `r:`. Reusable
term vocabulary/code subjects, shared schema and plugin subjects retain versions.

### Settings and portability rules

`list` returns at most 100 actor-readable catalog summaries and an optional
`after` offset; callers pass it unchanged for the next page. Ordering is by
component identity. Concurrent catalog insertion or removal may shift this
offset view. `get_catalog({catalog_id})` is an exact actor-scoped summary, also
available at `GET /pim/catalogs/{id}/summary`, and supplies the settings title.

Portable schema and plugin configuration files are bounded to 4 MiB during
reading, before JSON decoding. Product chunks additionally allow at most
1,000 lines, 1 MiB per line, depth 24 and 65,536 structural entries before any
row is decoded. Exports obey those chunk budgets and stream vocabulary terms
in parent-first order with a depth-bounded stack and indexed sibling seeks.
Live products seek `(level, product_id)` through a matching partial live index;
publication feeds seek `(seq, product_id)` through
`(catalog_id, channel, seq, product_id)`, including large equal-sequence groups.
