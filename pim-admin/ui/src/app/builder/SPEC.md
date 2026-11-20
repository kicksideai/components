<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# Catalog administration

The System surface lists only catalogs whose backend response grants ADMIN.
Pagination and search operate within that list; catalog creation selects the new
catalog in the schema editor. Creation without a declaration supplies an empty
generation 1; the editor displays “Define its schema” and lets the administrator
review and apply the first definitions against that generation. The standalone settings component accepts `catalog-id` and `embedded`.
Each component instance owns its draft and requests; it does not share routing
or selection state with other instances.

Fields, form layout, dimensions, vocabularies, families, channels, sources, plugins, scopes
and policy are edited as one schema draft. Reading a section must not create
absent fields in the draft. A review snapshots the declaration, removals, initial
plugin configuration and schema generation. Editing any reviewed input invalidates
the review. Apply sends that snapshot with its expected generation; backend
validation and ACL failures show the message and the typed code when supplied.
Review results appear above the selected editor, and focus moves to the review
heading or error. The Apply action follows the review details and only appears
for an applicable plan. Refresh does not overwrite a dirty
draft, and replies for an old catalog cannot replace the current catalog's draft.

Declared fields remain editable in type, cardinality and scope; declaration
presence does not establish authored values. The existing review/apply boundary
classifies or refuses those changes. Scope changes preserve defaults and the
same default editor remains available for scoped fields.

Term codes follow the backend grammar: 1–128 ASCII characters, beginning with
an alphanumeric character, then alphanumeric characters, underscores, dots or
hyphens. Declaration codes retain their separate grammar. Adding, retiring and
restoring terms require catalog WRITE independently of ADMIN; term reads and
schema editing remain available to an administrator without WRITE.
Schema definition add forms use the same validation for typed input, the
button and Enter. A duplicate shows an inline message within its definition
list. Field codes are unique within their field group and requirement codes
within their family.
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
Module access and catalog access are independent. Consumer catalog browsing and
product editing are excluded from both components and their bundles.

Policy presents Retention and Proposals first. Advanced processing limits are
collapsed by default; opening or closing them preserves the draft and overrides.
Each control describes its catalog effect in plain language. Unfinished catalog
expiry and maintenance limits stay read-only, marked "Managed in deployment
settings", in Advanced. Audit retention is bounded: zero selects the 365-day
default, and the UI enforces the backend's 106751-day ceiling for audit, trash
and deleted-product notices.

System labels catalog administration **Catalogs** and retains the System capability
boundary. Catalog ADMIN alone does not grant System access. Aspects display as
**Field groups**; Values offers Single value, Ordered list and Unique set while
preserving the declaration wire values. Declaration remains a peer section.
Leaving Declaration discards its invalid local text and resets its local validity;
invalid JSON remains visibly blocked while the editor is active.

The settings component emits `dirty-changed` with `{dirty}` for schema/removal
and plugin drafts. Switching catalogs asks the host to confirm discarding a dirty
draft; cancellation preserves selection and draft. Catalog ADMIN sees Share,
which loads the existing `kickside-share` widget with Component access/share URLs.
It owns principal selection, grant validation and last-owner protection.

Term panels state that term changes save immediately. Retirement asks for host
confirmation before writing; restoration remains immediate. Administration
lists active and retired terms in the same paginated list and offers only active
terms as parents. Term reads clear
previous errors at the start and expose Retry while keeping failed reads visible.
On narrow settings panes, definition rows stack their metadata below the title
and keep their actions in view. Vocabulary terms show the label first, followed
by the code and any parent, with the same retire or restore action.
Built-in type configuration comes from the backend's `config_schema` metadata
and renders through the shared `wc-schema-form`, including Quantity units and
canonical unit. Conversion factors and record members use its structured inputs.

Family variation axes are single-value fields from the selected field groups,
with no dimensions and a value form other than text or record. Each field can
be assigned to one variation level. Other unassigned fields can still be
owned by a level.

Form layout and History are peer settings sections. Layout edits the same declaration
as Fields: arrow controls and drag/drop reorder fields within their own field group;
widths are full, half, third or quarter, using compiled defaults until explicitly edited.
Plugin-owned groups remain read-only. Narrow screens stack cards while retaining
their declared widths. The System catalog rail becomes a horizontal picker on
phone screens, leaving the full width for settings and their actions. Review changes
and Apply layout use the builder's shared review snapshot, removals, plugin configuration and expected generation. Discard
resets the whole shared draft. Layout does not own a second loader or write path.

History reads the existing PIM catalog history endpoint, newest first, in pages of
50 using its opaque `next` cursor as `before`. People resolve with the existing
catalog-scoped helper; unresolved people and references keep readable labels.
Wide panes show a table. Narrow panes stack each entry with the change first,
followed by the person, time and product or other subject. The caption and
paging footer fit the pane in either layout.
Loading, empty, failure and Retry states remain visible. Notifications and host
visibility refresh restart the first page, stale replies are ignored, and unmount
or catalog changes dispose subscriptions. History remains readable during a schema
review and never changes the schema draft.
