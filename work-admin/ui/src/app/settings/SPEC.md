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
replacing an unsaved schema or metadata draft. Settings report both through the widget boundary. Saving or canceling metadata clears its pending state independently of the schema draft.
Schemaless boards retain identity and independent access, and initialize through
the ordinary declaration review/apply path at generation 0. Service errors remain
retryable errors, separate from access denials. Duration controls contribute
validity for invalid attempted values and unsupported stored values, preserve the
last valid declaration value, and clear local validity on removal. Focus and blur leave the stored duration intact. Values below one minute open in seconds. Review remains
blocked while any visited editor has an invalid duration. Review uses display labels and saved and proposed values from the reviewed snapshot. Backend refusals remain visible with the draft, with the typed error code when the response supplies one. Native validation considers controls owned by the settings form, independently of auxiliary creation forms.

The process map uses Dagre's layered network-simplex layout. DFS identifies
cycle-closing arcs before ranking; returns and self loops occupy compact exterior
lanes beyond both cards and forward labels. Each return has a distinct track and a nonoverlapping padded label box with clear horizontal stubs,
ordered by span so longer returns sit farther out and nested returns do not cross
or share segments. Self loops occupy the nearest compact track. Every return chip
is centered on a horizontal segment with a gap in the painted line on both sides;
in top-to-bottom maps this leg may extend below the source departure to reserve the complete padded chip height before reaching the exterior vertical spine.
All routes use the same corner radius (short segments cap it to their clearance). Short desktop flows run left to right;
narrow viewports and main paths longer than eight states use top-to-bottom ranks.
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

The initial view fits the complete graph when its scale is at least 80%; otherwise
it anchors readable text on the declared initial state and reports the visible
state count and continuation direction with a Show full process action. Fit fits
the width and expands the canvas height so long vertical processes remain readable
through the settings surface's normal scrolling. The fixture matrix's overviews
stay at least 80%. The SVG height and viewBox use the same calculated height in
each render, including Fit and orientation changes, without waiting for a later
resize notification to reconcile them. Zoom centers on the canvas. Dragging pans, Ctrl+wheel and pinch
zoom, and arrow keys move between states. The map accepts arrow-key panning,
+/- zoom and 0 to fit. Selection/focus reveals off-screen states and transitions,
including after inspector resizing. A width change recomputes orientation and the
initial or width-fitted view. Switching process resets the viewport and pending
connection. Escape cancels a connection and clears selection. Styles load inside
the owning ShadowRoot and use platform tokens in both themes.

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


Board sharing is an ADMIN-only header action that mounts the existing
`kickside-share` widget for the board component's grants/share routes. The widget
owns grant/revoke and its overlay. Board identity editing uses `wc-icon-picker`
and the existing metadata update, preserving every other metadata field.

Native dialogs within the settings ShadowRoot are an owner-approved exception
to shared overlays. They retain browser top-layer modality, Escape handling,
focus restoration and busy handling; shared headers and principal/schema widgets
remain in use. There is no Advanced section: all declaration controls remain in
their respective sections. Display labels use plain words; stored enum values and
identifiers are unchanged.

Board administration links to application settings, whose Work block links back
to board administration. That block composes the existing
`kickside-settings-provider` for `kickside.work`; all application settings remain
owned, validated and saved by the shared platform renderer. This module adds no
private settings editor. Boards can override comments per item in 1..100000;
blank inherits the application default. Blank retention windows also inherit.
Zero audit/interval days selects 365 days; zero trash/tombstone days permits
immediate cleanup. State requirements apply on entry. Human-state due duration
measures elapsed time in that state. Self-approval prevention excludes the person
who entered the current gate visit.

Option IDs are nonempty, distinct strings without the field-identifier pattern. Their validity uses the editor instance identity so field removal or reordering cannot strand an invalid key.
Visibility supports eligible single text fields and option fields, explicit level
IDs, shared holder selection, and the complete JSON declaration path. The backend
validates limits and creates the required exact index.

Plugin status is explicitly the last read snapshot. Refresh status uses the same
load path while preserving schema drafts and open editors for the same generation, and reporting newer schema generations
as stale. Pack requirements use exact `plugin` manifest identities. Upgrade and
initial installation share pack planning/apply, frozen generation/maps/conflict
choices, and initial configuration forms; invalid configuration blocks Apply.
Pack discovery also runs for unprovenanced boards. Their Install pack action
submits the ordinary pack plan; Work decides eligibility, including emptiness.
Packed creation uses the same configuration editor as Install pack, with the title and schema from discovery. Values still travel under the exact manifest ID, join the frozen retry identity, and are validated by Work before admission. Empty board sends no plugin configuration.
Automated states retain `run.stage` as their editable run label. The shared
published Flow picker selects a Flow; an explicit published-version choice writes
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
