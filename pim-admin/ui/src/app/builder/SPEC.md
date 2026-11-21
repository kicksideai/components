<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# Catalog administration

The System surface lists only catalogs whose backend response grants ADMIN.
The catalog directory applies text and ADMIN filters before pagination. Each
request loads one page. Load more and Retry keep the text, administration filter
and page cursor. A successful read shows the selection prompt or empty result. The picker and
selected catalog share a rail frame with the same title, count and actions.
A draft shows Unsaved changes, Discard and Review changes in the section header.
Catalog creation selects General for the new catalog. Creation without a
declaration opens the setup summary with Set up products. The first definitions
use the same Review changes flow as later edits. The standalone settings
component accepts `catalog-id` and `embedded`.
Each component instance owns its draft and requests; it does not share routing
or selection state with other instances.

Products groups families, fields and form layout. Values groups dimensions and
vocabularies. Channels groups release destinations and sources. Plugins and
product filter sets are adjacent. Technical schema edits share the same draft. Reading a section must not create
absent fields in the draft. A review snapshots the declaration, removals, initial
plugin configuration and schema generation. Editing any reviewed input invalidates
the review. Apply sends that snapshot with its expected generation; backend
validation and access errors show their messages and offer typed codes in a
technical disclosure. Review opens a dialog and moves focus to its heading.
Apply follows the impact and named changes for an applicable plan. Removing
fields, groups, vocabularies or release destinations requires acknowledgement. A schema generation conflict
invalidates review and Apply. Reload settings asks for confirmation before
replacing a dirty draft. Cancel or a failed reload preserves the draft. Automatic
refresh preserves dirty drafts, and replies from an earlier catalog cannot replace
the current catalog’s draft.

Declared fields remain editable in type, cardinality and scope; declaration
presence does not establish authored values. The existing review/apply boundary
classifies or refuses those changes. Scope changes preserve defaults and the
same default editor remains available for scoped fields.
In the settings editor, visible field labels name their controls and related
controls use named groups. Field help uses the theme's full muted text color.

Term short names follow the backend grammar: 1–128 ASCII characters, beginning with
an alphanumeric character, then alphanumeric characters, underscores, dots or
hyphens. Declaration codes retain their separate grammar. Adding, retiring and
restoring terms in this administration UI require catalog ADMIN and WRITE.
Term reads and schema editing remain available to an administrator without WRITE.
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

General → Advanced can show deployment defaults and whether a catalog has
an override. Edit the defaults in System → Settings → Products. Existing
catalog overrides are preserved and can be edited or cleared in Technical schema.

System labels catalog administration **Catalogs** and retains the capability
boundary. Catalog ADMIN alone does not grant System access. Add actions open
inline name editors and add valid names to the draft. The names create
declaration keys according to the existing schema grammar.
Choose Single value, Ordered list or Unique set when editing a field. Closing
Technical schema discards invalid local text. Valid edits stay in the common draft.

The settings component emits `dirty-changed` with `{dirty}` for schema/removal
and plugin drafts. Switching catalogs asks the host to confirm discarding a dirty
draft; cancellation preserves selection and draft. Catalog ADMIN sees Share
catalog in Access, which loads the existing `kickside-share` widget with Component access/share URLs.
It owns principal selection, grant validation and last-owner protection.

Term panels state that term changes save immediately. Retirement asks for host
confirmation before writing. Restoration is immediate. The paginated list
includes active and retired terms, and only active terms can be parents. Reads
announce “Loading terms…”. Retry repeats a failed page, and the empty message
follows a successful empty read.
On narrow settings panes, definition rows stack their metadata below the title
and keep their actions in view. Vocabulary terms show the label and parent,
with the existing retire or restore action. Integration keys can be expanded
when needed.
Built-in type configuration comes from the backend's `config_schema` metadata
and renders through the shared `wc-schema-form`, including Quantity units and
canonical unit. Conversion factors and record members use its structured inputs.

Families show selected field groups in a multi-select. Family removal is
available inside the expanded family. Family variation axes are single-value fields from the selected field groups,
with no dimensions and a value form other than text or record. Each field can
be assigned to one variation level. Other unassigned fields can still be
owned by a level.

Fields uses keyboard-operable arrow buttons to reorder fields within a group.
Each group header opens its settings dialog for source write permissions and
group removal. Form layout is a Products view. History is a General view.
Form layout edits the same declaration as Fields. In Form layout, arrow
controls and drag/drop reorder fields within their own field group, and
widths are full, half, third or quarter, using compiled defaults until explicitly edited.
Plugin-owned groups remain read-only. Layout uses discovered field type titles,
and plugin and scope summaries present readable field and filter names.
Narrow screens stack cards while retaining
their declared widths. On phones, the directory and settings take turns using
the full width. All catalogs is the first item in the System section rail and
returns the operator to the directory. Long catalog names wrap in the rail.
The section's content header holds the draft actions, which wrap at their
standard button widths. Review changes
and Apply layout use the builder's shared review snapshot, removals, plugin configuration and expected generation. Discard
resets the whole shared draft. Layout does not own a second loader or write path.

Standalone settings let readers and editors expand definitions, browse terms,
view layout and policy, and read the catalog declaration. Schema and term
mutation controls stay unavailable. Catalog administrators can view deployment
defaults and resolve source account names through the admin endpoints.

History reads the existing PIM catalog history endpoint, newest first, in pages of
50 using its opaque `next` cursor as `before`. Administrators see actor names from
the catalog-scoped helper. For readers and editors, History shows the time,
subject, change and any source, and skips the actor resolver. Wide panes show a
table. Narrow panes stack each entry with the change first. The caption and
paging footer fit the pane in either layout.
Loading, empty, failure and Retry states remain visible. Notifications and host
visibility refresh restart the first page, stale replies are ignored, and unmount
or catalog changes dispose subscriptions. History remains readable during a schema
review and never changes the schema draft.

### Plugin recovery

Plugins show one status in the row. The expanded row gives the cause and
the next action. An incompatible package outside the catalog's active setup
shows Unavailable and stays collapsed until opened. A paused cursor can resume
at its current position. A stopped worker or pruned registration can reset after
confirmation. Reset
registers from a new catalog event and rebuilds the state index from current
products. Configuration errors keep the form available to catalog Admins
and preserve their edits through validation and refresh.

The Plugins section refreshes while an active plugin is setting up or a
cursor has work pending. It stops when the view is hidden or the work settles.
An uninstalled plugin uses its retained attachment title and opens a review of
the catalog references. Technical details contains registry IDs and diagnostics.
Clearing an unavailable app binding uses the catalog settings operation.
Deactivation and removal of affected filter sets use schema review before apply.
