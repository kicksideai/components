<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# Work settings

The settings page and the embedded administrator surface edit the same board
declaration. They use platform PrimeVue controls, ui-kit header classes, and
shared principal/schema widgets. Opening an editor or selecting a graph element
does not mutate the declaration. Absent definition collections, options and policy objects stay absent until a user writes a value. Review freezes the exact declaration, plugin
configuration and generation submitted to Work; Apply uses that reviewed request
and a stable retry key. A successful Apply retains its committed generation as a
reset target until an accepted read reaches it, even if a notification supersedes
the first read; that reset is consumed once. Other concurrent drafts stay stale.
Board selection and Back ask through the shared host confirmation before
replacing unsaved schema, metadata or active plugin edits. Settings report the
combined dirty state through the widget boundary. Each editor clears its own
pending state on save or explicit discard.
The board directory frames its count, Create board and Application defaults.
An opened board uses the standalone settings rail. All boards returns focus to
the selected directory row. All sections use the shared UI Kit rail and
scrolling pane. General links to the Share board action in Access. The section header shows draft
actions when board settings have unsaved changes. Board titles wrap in both
surfaces, and the definition lists place metadata and row actions below the title
when the available space cannot fit the desktop columns. Field controls have
programmatic labels, and the reorder handle and row disclosure each have their
own tab stop.
Schemaless boards retain identity and independent access, and initialize through
the ordinary declaration review/apply path at generation 0. Service errors remain
retryable errors, separate from access denials. Duration controls contribute
validity for invalid attempted values and unsupported stored values, preserve the
last valid declaration value, and clear local validity on removal. Focus and blur leave the stored duration intact. Values below one minute open in seconds. Review remains
blocked while any visited editor has an invalid duration. Review uses display labels and saved and proposed values from the reviewed snapshot. Backend refusals remain visible with the draft. Blocked plan entries show the reason code, and failed requests show the typed error code when supplied. Native validation considers controls owned by the settings form, independently of auxiliary creation forms.

The process map uses Dagre's layered network-simplex layout. DFS identifies
cycle-closing arcs before ranking; returns and self loops occupy compact exterior
lanes beyond both cards and forward labels. Each return has a distinct track and a nonoverlapping padded label box with clear horizontal stubs,
ordered by span so longer returns sit farther out and nested returns do not cross
or share segments. Self loops occupy the nearest compact track. Every return chip
is centered on a horizontal segment with a gap in the painted line on both sides;
in top-to-bottom maps this leg may extend below the source departure to reserve the complete padded chip height before reaching the exterior vertical spine.
All routes use the same corner radius (short segments cap it to their clearance).
Wide settings maps lay out the process left to right and wrap long node and
transition labels in compact cards. Narrow maps use top-to-bottom ranks.
Card bounds reserve complete wrapped titles, captions, capacity, global actions
and port clearance. Transition chips participate in layout and share one opaque,
token-backed style. Rectilinear A* routing avoids padded card and chip bounds;
rounded orthogonal paths have an explicit gap around their own chip. Repeated
waypoints are simplified before path generation. All declared transition sources,
parallel-region exits and self loops remain represented. Parallel entry routes are
dotted; returns/self loops are dashed. Every route leaves the output side (right
or bottom) and enters the opposite side (left or top), with straight port stubs.
Completed/canceled states have no outgoing connection control, including when a
reopen transition is declared. Global transitions appear once as editable actions
on their target.

The settings map fits the complete graph on first open. Workflows with more
than six states open in List when the editor is narrower than 480 pixels.
Both layouts preserve the same editor actions. Fit restores the whole map after
panning or zooming. The inspector focuses the chosen card or transition at a readable scale when the fitted overview is smaller. The SVG height and viewBox use the same calculated height in
each render, including Fit and orientation changes, without waiting for a later
resize notification to reconcile them. Zoom centers on the canvas. Dragging pans, Ctrl+wheel and pinch
zoom, and arrow keys move between states. The map accepts arrow-key panning,
+/- zoom and 0 to fit. Selection/focus reveals off-screen states and transitions,
including after inspector resizing. A width change recomputes orientation and the
initial or width-fitted view. Switching process resets the viewport and pending
connection. Escape cancels a connection and clears selection. Styles load inside
the owning ShadowRoot and use platform tokens in both themes. Closing an inspector
with Escape or its close button returns focus to the map element or list action
that opened it. Opening an inspector focuses the panel and brings its initial
controls into view on narrow screens. Connectors support mouse drag and a
two-step click, tap or keyboard connection. Activate the connector, then activate
the destination state. Both layouts edit the same transition and state settings,
including the published Flow binding for automated states. The transition
inspector puts Remove transition beside Close. Delete and Backspace remove the
selected transition when focus is on the map transition or inspector panel.
Removal affects all routes for that transition, checks stage and timer references,
and updates the draft for Review. After removal, focus returns to the map or
the process tools in List.

Generated process identifiers respect Work’s 40-character bound while retaining the complete human title and a unique suffix. Manual transitions created by Add state never acquire an automatic default flag.
Splitting a default automatic edge preserves its automatic continuation.
Disabling automatic execution removes the default flag. Work validates automatic
cycles, route eligibility, plugin declarations and stored-data changes.

The ordinary settings sections expose every declaration property accepted by Work's settings
contract, including stage labels, awaiting principal sources, all automation
outcome routes, people visibility and evaluation order, rollup order/predicates,
formula/rollup result types, option categories, installed query filters, item key prefixes and visibility rules.
Derived identities and compiled generations are not editable schema controls. Item key prefixes change only through reviewed schema apply and its registry claim; the board metadata endpoint does not update them. Removal markers are generated by guarded removals.
Conditions also offer shared JSON editing for the complete backend predicate vocabulary and nesting depth. Validity combines both editors; disabling a condition clears its local validity failure. A capacity of zero is
an explicit limit and remains visible in the graph and inspector description.

Board creation sends only the declared create body. A nonempty description uses
the existing metadata update after creation. Failed metadata updates retain the
created board ID and retry that update without another creation; identity inputs
stay fixed. Invalid installed pack summaries remain disabled choices with their
problem reason. A missing title is shown as Unnamed pack. Valid packs and Empty board remain usable.


Board settings open in General. The Board setup rail group contains Item types,
Fields, Links and Workflow. Management contains Access and Plugins. In System, All boards is the first item in the section rail and
returns the operator to the board directory. The board name groups its General
settings. A schema draft shows Unsaved changes, Discard and Review changes in
the section header.
Review changes keeps the active section behind the review. Schema changes use
the existing plan/apply snapshot, including plugin activation and configuration.
Board identity, the opening-app binding and sharing use their existing independent
write endpoints. Board identity uses `wc-icon-picker`.
The administrator can choose a registered opening app by title where the Work
binding contract is available. Clearing the selection uses the installation
default. General presents the board name, app and key prefix as inline controls.
Narrow screens place board details controls below their descriptions. Name,
app, description and icon save together through the metadata action.
Item counts and pack status share one line above the recent changes disclosure.

Item types show a Workflow column on wide panels and a Workflow label on narrow
panels. Expand an item type to edit the fields it uses. Newly added item types
open automatically. The field and workflow creation actions open the existing
editors and return to the same item type. The field editor preselects the
originating type for placement, and the workflow editor assigns the created
workflow to it. The existing-item review message covers changes to saved
workflows. Fields defines fields shared by the board and can filter by item type.
Links defines relationships that appear
on both items. Add actions open the corresponding editor on demand. Cancel and
Escape close the inline name editor and return focus to the initiating action. Field
choices wrap within the available width, including when an individual label is
long. Item reference fields can choose a named target type. Top-level
placement beside named parents uses Work’s boolean marker. Integration
identifiers and configuration without a structured form are local disclosures.
Workflow shows caller-visible item counts for the committed workflow and edits
limits and requirements on the state where they apply. Map and List use the
same transition inspector. Installed checks and query filters come from Work
registry metadata. Each plugin row places its title and description beside the
activation switch. Turning on a plugin opens its row. A badge below the description
signals a pending change, configuration needed, or a health issue. An invalid
configuration shows its first field error even when the row is collapsed and
blocks review. Plugin, packed creation and field type configuration render in the
shared `wc-schema-form` from the manifest schema, including its titles, help and
defaults. Fields that declare `x-choices: board_item_types` choose from the board's
item types. Only entered overrides are sent for newly activated plugins, so Work can
apply deployment settings to omitted optional fields. Technical details shows projection health and
indexed progress. Reset projection explains the effect and asks for confirmation
before starting recovery.

Access is an ADMIN-only section. The board header and Access open the same shared
`kickside-share` widget for the board component’s grants and share routes.
The widget owns grant/revoke and its overlay. Each preview row shows one compact
badge listing its capabilities or Owner. Per-item visibility lives in Access under Advanced.

Native dialogs within the settings ShadowRoot are an owner-approved exception
to shared overlays. They retain browser top-layer modality, Escape handling,
focus restoration and busy handling. Shared headers and principal/schema
widgets remain in use.

Board administration links to application settings. That block composes the
existing `kickside-settings-provider` for `kickside.work`. Application defaults
owns audit, retention and comments limits. General shows existing overrides and
allows an administrator to return to the installation defaults through schema
review. Zero audit/interval days selects 365 days. Zero trash/tombstone days
permits immediate cleanup. State requirements apply on entry. Human-state due
duration measures elapsed time in that state. Self-approval prevention excludes
the person who entered the current gate visit.

Option IDs are nonempty, distinct strings without the field-identifier pattern. Their validity uses the editor instance identity so field removal or reordering cannot strand an invalid key.
Kind lists built-in and installed plugin field types together. Selecting a plugin
type updates the value form, clears incompatible search support and shows its
schema-defined configuration beside the field properties. Required configuration
blocks review, and the form reports validity only when it changes.
The Fields list keeps each row and the Add field action within the available width.
Existing items follow workflow changes. Review asks for a destination when
an occupied state is removed and confirmation when an occupied state is renamed.
The checked plan authorizes Apply against its exact draft.
Visibility supports eligible single text fields and option fields, explicit level
IDs, shared holder selection, and the complete JSON declaration path. The backend
validates limits and creates the required exact index.

Plugin status is explicitly the last read snapshot. Refresh status in the Plugins header uses the same
load path while preserving schema drafts and open editors for the same generation, and reporting newer schema generations
as stale. Pack requirements use exact `plugin` manifest identities. Upgrade and
initial installation share pack planning/apply, frozen generation/maps/conflict
choices, and initial configuration forms. Invalid configuration blocks Apply.
Review shows the target version and the plan's saved views, automations, traits and required plugins.
New board and Install pack can reload discovery and show unavailable choices with
their reasons. Install pack presents its choices in a scrollable list within the
dialog so scrolling keeps the choices available. Work decides whether a board
is eligible, including emptiness.
An accepted installation shows the operation status and both identifiers.
Continuing uses the same reviewed request and operation key.
Packed creation uses the same configuration editor as Install pack, with the title and schema from discovery. Values still travel under the exact manifest ID, join the frozen retry identity, and are validated by Work before admission. Empty board sends no plugin configuration.
Automated states retain `run.stage` as their editable run label. The shared
published Flow picker selects a Flow. The browser’s native version selector stays
usable inside the scrolling inspector. An explicit published-version choice writes
`run.flow_ref = {kind: flow, id, version}`. Selection in progress blocks review;
it never silently upgrades a saved version. Schema review shows the published Flow title and exact pinned version. Apply uses the existing frozen declaration/generation request.
The state panel shows the picker's Flow title and published version, with the
saved Flow ID available on hover instead of a duplicate ID line.
The version list and exact-version read expose deleted Flows, missing versions
and lost read access as an unavailable binding with its ID/version and error;
failed reads preserve the binding for explicit replacement or removal. Work
revalidates authority and compatibility during plan/apply. Legacy unbound runs
remain editable without introducing a Flow binding. No Automation setup or input
mapping UI is provided.
