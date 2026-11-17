<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# PIM administration

`kickside/pim-admin` configures PIM catalogs on **System → Catalogs**. It installs
two host-mounted web components: `kickside-pim-admin` selects and creates catalogs;
`kickside-pim-catalog-settings` edits one catalog, with `catalog-id` and `embedded`
inputs. It does not install a product navigation item or consumer pages.

The settings builder covers fields and types, dimensions, vocabularies and terms,
families and requirements, channels and sources, plugins and scopes, policy, form layout, history, and
the declaration. Schema edits remain one draft until review and apply. Applying
uses the exact reviewed declaration, plugin configuration, and expected schema
generation. Term writes and active plugin configuration save separately. Form layout
shares that draft and review; history reads the existing catalog audit endpoint. Product browsing and product editing are outside this module.

Bind `kickside.pim.admin:ui_server` to the host HTTP service and
`kickside.pim.admin:api_router` to an authenticated router with `token_auth` and
`endpoint_firewall`. The bundle is served at `/kickside-pim-admin`. The settings
tab uses `kickside.pim.api:apply_schema.endpoint` for discovery. The optional
`kickside.pim.admin.security:user_security_scope` binding defaults to platform
Members. Its public `module_access` policy composes exact discovery, endpoint,
and runtime grants for this module's entries; it grants no PIM catalog ACL.

All catalog calls use the signed-in user's PIM backend endpoints. Two helpers
verify catalog schema read access and catalog ADMIN access:

- `POST /pim-admin/catalogs/{id}/principal_labels` resolves at most 200 user/group references through the directory contract.
- `GET /pim-admin/catalogs/{id}/policy_defaults` reads only the `kickside.pim` namespace through Settings' public read contract, without granting the global settings listing or writes.

Install and authorize `kickside/pim` separately; readers and writers cannot apply
schemas or configure plugins.

```sh
make setup build typecheck test-ui
make lint strict check test pack
# Use a fresh dedicated database and drop it after this lane.
make test-pg PIM_ADMIN_PG_PORT=5434 \
  WIPPY_ARGS='--set vars.pg_host=localhost --set vars.pg_database=pim_admin_lane'
```

Use Wippy v0.3.60a or newer (`WIPPY=/path/to/wippy`). `test/.wippy.yaml` replaces
`kickside/pim-admin` with this source and, until PIM is published, `kickside/pim`
with the sibling `../../pim`. All platform dependencies remain published modules.
The harness mounts real HTTP endpoints and resolves persisted users' installation
scopes; it supplies no permissive policy to Members. SQLite runs start with a
fresh file; PostgreSQL runs require a caller-owned disposable database. The runner
fails on empty or failing suites. UI tests include Chromium checks of definition
columns in page and embedded settings panes, plus stacked definition, term, and
history rows at phone widths.

UI Kit is a locked build input, materialized from `kickside/ui-kit` into
`ui/.wippy`; it is not a consumer repository source replacement. `build` emits
only `admin.js`, `settings.js`, their shared chunks and metadata. `pack` checks
the reusable embedded artifact and a private publication dry run. Build inputs,
test entries, UI dependencies and source maps are excluded from the artifact.

Release Please owns versions and changelogs. The repository CI has SQLite and
PostgreSQL lanes and checks legal notices, SPDX headers and secrets. This module
is registered in `.github/modules.json` for independent private publication.

Catalog policy groups Retention and Proposals before a collapsed Advanced section
for processing limits. Deployment-wide controls remain read-only in Advanced.
Audit retention always expires: zero selects the 365-day default.
