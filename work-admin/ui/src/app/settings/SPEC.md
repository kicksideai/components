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
replacing an unsaved draft. Settings report dirty state across the widget boundary.
Schemaless boards retain identity and independent access, and initialize through
the ordinary declaration review/apply path at generation 0. Service errors remain
retryable errors, separate from access denials. Duration controls contribute
validity for invalid attempted values and unsupported stored values, preserve the
last valid declaration value, and clear local validity on removal. Review remains
blocked while any visited editor has an invalid duration. Backend refusal messages remain visible with the draft. Native validation considers controls owned by the settings form, independently of auxiliary creation forms.

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

Advanced settings expose every declaration property accepted by Work's settings
contract, including stage labels, awaiting principal sources, all automation
outcome routes, people visibility and evaluation order, rollup order/predicates,
formula/rollup result forms, option categories, query scopes, item key prefixes and visibility rules.
Derived identities and compiled generations are not editable schema controls. Item key prefixes change only through reviewed schema apply and its registry claim; the board metadata endpoint does not update them. Removal markers are generated by guarded removals.
Conditions also offer shared JSON editing for the complete backend predicate vocabulary and nesting depth. Validity combines both editors; disabling a condition clears its local validity failure. A capacity of zero is
an explicit limit and remains visible in the graph and inspector description.

Board creation sends only the declared create body. A nonempty description uses
the existing metadata update after creation. Failed metadata updates retain the
created board ID and retry that update without another creation; identity inputs
stay fixed. Invalid installed pack summaries remain disabled choices with their
problem reason; a missing title uses the declaration ID. Valid packs and Empty board remain usable.
