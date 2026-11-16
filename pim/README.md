<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kicksideai/docs/main/getting-started/assets/brand/kickside-logo-dark.png">
  <img src="https://raw.githubusercontent.com/kicksideai/docs/main/getting-started/assets/brand/kickside-logo-light.png" alt="KickSide" width="320">
</picture>

# KickSide PIM

`kickside/pim` keeps typed, contextual product information in catalogs. A catalog is a component: every change is an event on its thread, a projection folds events into product tables and a generated per-catalog item table, and commands validate against the projection at the thread head and append with a head check, so concurrent writers serialize without a lock of their own.

Plugins extend a catalog through declared seams: attribute types (`kickside.pim.type`), checks (`kickside.pim.check`), scopes (`kickside.pim.scope`), link targets (`kickside.pim:link_target`, bound per ref kind for the entities a plugin owns and products point at) and plugin manifests (`kickside.pim.plugin`). A manifest may carry a schema source - a static `template` or a `kickside.pim:schema_provider` binding - whose aspects and vocabularies join a catalog's schema as the catalog's own data when its admin names the plugin; the provider resolves per catalog, as the caller, from wherever the plugin keeps its field declarations.

This module lives in [kicksideai/components](https://github.com/kicksideai/components) and is published privately as `kickside/pim`. It contains the backend, HTTP contracts, agent tools and admin configuration contracts. The admin UI is delivered separately; consumer UI follows later. See the [module specification](docs/SPEC.md) for the full behavior and extension contracts.

## Agent tools

Three public traits call `kickside.pim:catalog` as the calling agent. The readonly trait supplies reads; the working trait adds product writes; the administration trait supplies structure and configuration and pairs with the working trait. Tools take `catalog_id` from the call, then trait context when the method accepts a catalog id, and add `success = true` to the contract result.

`kickside.pim.traits:pim_readonly`:

- `PIMCatalogs` → `list`
- `PIMSchemaGet` → `get_schema`
- `PIMSchemaOptions` → `schema_options`
- `PIMTerms` → `list_terms`
- `PIMQuery` → `query`
- `PIMGet` → `get`
- `PIMExplain` → `explain`
- `PIMHistory` → `list_history`
- `PIMLinks` → `list_links`
- `PIMProposals` → `list_proposals`
- `PIMReleases` → `list_releases`
- `PIMReleaseGet` → `get_release`
- `PIMPublications` → `list_publications`
- `PIMChanges` → `list_changes`

`kickside.pim.traits:pim_trait`:

- `PIMCatalogs` → `list`
- `PIMSchemaGet` → `get_schema`
- `PIMSchemaOptions` → `schema_options`
- `PIMTerms` → `list_terms`
- `PIMQuery` → `query`
- `PIMGet` → `get`
- `PIMExplain` → `explain`
- `PIMHistory` → `list_history`
- `PIMLinks` → `list_links`
- `PIMProposals` → `list_proposals`
- `PIMReleases` → `list_releases`
- `PIMReleaseGet` → `get_release`
- `PIMPublications` → `list_publications`
- `PIMChanges` → `list_changes`
- `PIMApply` → `apply`
- `PIMPropose` → `propose`
- `PIMDecide` → `decide`
- `PIMRelease` → `release`
- `PIMWithdraw` → `withdraw`

`kickside.pim.traits:pim_admin`:

- `PIMCatalogCreate` → `create`
- `PIMSchemaPlan` → `plan_schema`
- `PIMSchemaApply` → `apply_schema`
- `PIMConfigurePlugin` → `configure_plugin`
- `PIMRebuild` → `rebuild`
- `PIMCatalogs` → `list`
- `PIMSchemaGet` → `get_schema`
- `PIMSchemaOptions` → `schema_options`

Catalog rebuild is product-owned maintenance in the administration trait. `schema_provider` and `link_target` remain provider seams outside the traits. The readonly trait uses `kickside.pim.traits:build_reads` and the working trait `kickside.pim.traits:build` to contribute tools declared by active catalog plugins, or all installed plugin declarations when context omits `catalog_id`. Readonly contributes only tools whose sole required scope is `state.read`. Administration contributes no plugin tools. Plugins ship exact `tool_access` policies and no traits. Missing or non-tool declarations fail with `plugin_tool_invalid`; inactive plugin contracts refuse with `plugin_inactive`.

The platform MCP server expands static trait tools only; dynamic plugin contributions require upstream MCP support.

```sh
make setup
make lint
make test        # SQLite
make test-pg     # PostgreSQL on port 5434; dedicated database kickside_test_pim
```

License: [KickSide Community License 1.0](LICENSE) · [Third-party notices](https://github.com/kicksideai/components/blob/main/THIRD_PARTY_NOTICES.md).

[Documentation](https://github.com/kicksideai/docs) · [KickSide](https://kickside.ai)

A catalog activates plugins through explicit schema membership. PIM validates
configuration against each plugin's declaration; an `enabled` property has
meaning only when that plugin declares it. Deployment settings supply defaults
for activation and configuration commands.

Successful keyed commands, including no-ops, share an atomic request-hash reservation and retain replay receipts in PIM for
the catalog event window (90 days). Successful no-ops append no event. Proposals default to 256 KiB each, 1,000 per catalog and 30-day expiry;
validated deployment settings and catalog policy overrides control these limits. Retention prunes bounded pages
of receipts, proposals and completed work. Imports keep a durable one-shot job,
frozen batch commands and progress; retrying the same export resumes that job.
Plugin lifecycle jobs retry transient failures and periodically reconcile
registered projection revisions. Saving unchanged configuration appends nothing.
Release commands compare the requested channels’ published snapshot hashes and reuse matching releases; superseded snapshots,
publication tombstones and unreferenced schema generations and retired terms
expire after the audit window. Retention shares bounded work across teardown,
catalogs and row classes and continues while eligible pages remain.

Catalog creation reservations expire after 90 idle days by default while unregistered.
Matching retries renew that lifetime; registered partial creations keep their
instance provenance and can finish convergence. Retention reconciles aged pending
reservations against registered components in bounded global pages. Receipt
admission is fenced against catalog teardown, and global indexed expiry also
reclaims receipts with absent catalogs. Initial schema reservation requires
confirmed creation provenance at sequence zero. Release comparison seeks each
product's publications; removed-channel cleanup seeks only published rows.
Idle retention sweeps leave catalog checkpoints untouched when no scan advances.

Permanently purged products keep their tombstones until the retention owner has
retired their exact `p:`, `r:` and `model-release:` Core subjects. Core 0.3.17 or
newer is required. The Core call runs outside the PIM transaction; errors leave
the tombstone for an idempotent retry. Each product costs three subject seeks
plus its deletion against the existing callback budget. Only the retention
owner receives `threads.subjects.retire` on `pim.catalog`. Individual release
expiry and reusable vocabulary/code identities retain their subject versions.

Operating policy settings retain existing defaults and impose safe ceilings.
Catalog Policy exposes proposal, completed/abandoned release work and import
retention, proposal quotas/bytes, command time, rebuild rows, job batches and
import rows. Pending-creation expiry and maintenance row/catalog budgets are
deployment-wide settings, shown read-only in Catalog Policy. Blank overrides
inherit deployment settings.

Catalog discovery accepts `limit` (1–100) and the returned `after` offset.
`get_catalog` and `GET /pim/catalogs/{id}/summary` resolve one exact readable
catalog independently of discovery pages.

Portable input is bounded before decoding: 4 MiB per schema/config/product
file, 1,000 product lines (including blank lines), 1 MiB per product line, depth 24 and 65,536 structural
entries. Term export streams parent-first; product and publication continuations
use ordered tuple seeks.

Use Wippy v0.3.60a or newer. `make setup` installs the committed locks from the Hub; `make lockrefresh` explicitly refreshes published dependencies. Only `kickside/pim` is replaced by local source in the harness. `make verify` runs setup, lint, strict type checking, module checks and SQLite tests; `make test-pg` runs the PostgreSQL suite. `make pack` writes the backend artifact under `.wippy/`; `make release-check` validates private publication without publishing. Node.js 20+, Python 3 with PyYAML, Lua and PostgreSQL are required for the checks.

Audit history always expires: `audit_days = 0` selects the 365-day default,
including existing zero policies. Omitted catalog values inherit deployment
settings. Audit retention accepts 0–106751 days; trash and tombstone retention
accept 1–106751 days, consistently in settings and catalog declarations.
