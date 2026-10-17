# kickside/dashboard

A registry-driven deployment overview. The dashboard is the landing surface that
answers "what is installed here?" without any hardcoded knowledge of the
deployment — it discovers the installed navigable surfaces from the registry and
renders each one as a card with its icon, name, and a human description.

## What it does

- `GET /api/v1/dashboard/overview` discovers the installed navigable surfaces via
  `registry.find` (`view.component` and `ui.nav_item` entries), pulls a human
  description for each from the entry meta and the owning module's
  `ns.definition`, and returns `[{ id, label, description, icon, route_name }]`.
- The `kickside-dashboard` web component fetches that list and renders a card
  grid. Each card is clickable and emits a `navigate` event (and updates the
  host location) so the host can route to the surface.
- The page is self-contained: it ships and serves its own built bundle, so the
  module needs no app code to render.

Adding or removing any module that declares a surface changes the dashboard
automatically — there is no central list to edit.

## Layout

```
src/_index.yaml        registration surface (namespace kickside.dashboard)
src/overview.lua       GET /dashboard/overview handler
src/discovery.lua      registry discovery + description resolution (testable lib)
src/types.lua          registry meta.type vocabulary + defaults
src/overview_test.lua  discovery unit test (stub registry)
ui/                    kickside-dashboard web component package
static/                built bundle (served by http.static)
```

## Build

```
make build      # cd ui && npm install && npm run build  → static/index.js
make lint       # wippy lint
```

## Wiring

The consuming host wires this module via `ns.dependency`:

- `api_router` (host-supplied authenticated router) — the router `/dashboard/overview` attaches to.
  It enforces token authentication and endpoint access; the handler and
  discovery retain caller-scoped visibility.
- `ui_server` (host-supplied HTTP server) — the HTTP server the static bundle mount
  attaches to.

The module declares its own `ui.nav_item` (route_name `home`,
`render: component`, `component_tag: kickside-dashboard`); installing the module
adds the Dashboard surface to the nav, uninstalling removes it.
