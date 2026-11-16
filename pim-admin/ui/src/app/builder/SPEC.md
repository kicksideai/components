<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# Catalog administration

The System surface lists only catalogs whose backend response grants ADMIN.
Pagination and search operate within that list; catalog creation selects the new
catalog in the schema editor. Creation without a declaration supplies an empty
generation 1; the editor displays “Define its schema” and lets the administrator
review and apply the first definitions against that generation. The standalone settings component accepts `catalog-id` and `embedded`.
Each component instance owns its draft and requests; it does not share routing
or selection state with other instances.

Fields, dimensions, vocabularies, families, channels, sources, plugins, scopes
and policy are edited as one schema draft. Reading a section must not create
absent fields in the draft. A review snapshots the declaration, removals, initial
plugin configuration and schema generation. Editing any reviewed input invalidates
the review. Apply sends that snapshot with its expected generation; backend
validation and ACL failures remain visible. Refresh does not overwrite a dirty
draft, and replies for an old catalog cannot replace the current catalog's draft.

Term writes use PIM's apply endpoint and only term-shaped requests. Active plugin
configuration saves separately and must preserve unrelated schema drafts and
other unsaved plugin configuration. Deployment policy defaults are read through
a catalog ADMIN endpoint using Settings' public read contract, without global
listing or write authority; an explicit false resets a catalog override to
inheritance. Global controls remain deployment settings.

Principal labels resolve through a catalog-scoped endpoint after READ and ADMIN
checks, under the caller's actor and scope. References are a dense list of at
most 200 user/group references; named object keys and malformed references are
rejected. Grants list exact owned entry IDs.
Module access and catalog access are independent. Consumer catalog browsing,
product editing, layout editing and history are excluded from both components
and their bundles.

Policy presents Retention and Proposals first. Advanced processing limits are
collapsed by default; opening or closing them preserves the draft and overrides.
Each control describes its catalog effect in plain language. Unfinished catalog
expiry and maintenance limits stay read-only, marked "Managed in deployment
settings", in Advanced. Audit retention is bounded: zero selects the 365-day
default, and the UI enforces the backend's 106751-day ceiling for audit, trash
and deleted-product notices.
