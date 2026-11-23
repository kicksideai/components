# kickside/dashboard

A landing surface for opening features available to the signed-in account. Cards
use the effective navigation shared with the shell.

## What it does

- The `kickside-dashboard` web component reads `/api/v1/nav/list` using the
  authenticated host's API and uses the returned item paths, order, labels, and
  icons. A failed read gives the user a Retry action.
- `GET /api/v1/dashboard/overview` remains available for existing clients that
  use the installed-surface registry overview.
- Each card emits a `navigate` event so the host can route to the surface.
- The page is self-contained: it ships and serves its own built bundle, so the
  module needs no app code to render.

Module and administrator navigation changes are reflected when the Dashboard
becomes visible again.

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
