# kickside/dashboard

Registry-driven overview of installed navigation and application surfaces.

This module installs independently into a [KickSide](https://kickside.ai) host.

## Quick start

In **System → Modules**, select the package from the Wippy Hub and review its
requirements. For CLI dependency setup, run from the host application directory:

```sh
wippy add kickside/dashboard
wippy install
```

Apply host bindings and migrations through the application install plan.
Install the module and bind the declared host resources. Its cards come from installed navigation and view metadata.

## Requirements

Wippy 0.3.x; repository validation uses 0.3.47a. Use current Hub dependencies
for the contracts declared by the module.
Host persistence uses SQLite or PostgreSQL. This module has no standalone SQL dialect matrix.
Frontend development also uses Node.js 22, npm, and Make.

## Development

From this module directory:

```sh
make lockrefresh
make lint
make test
```

Edit frontend source under `ui/` and run `make build` from this directory;
commit regenerated tracked assets with the source.

## Use

Open **Dashboard** to select an installed navigable surface. Cards come from visible navigation and view declarations. A missing card requires checking installation, declarations, and the caller’s access; the dashboard does not supply domain metrics.

## Reference

- [Module reference](src/README.md)

### Host requirements

Bind these exact requirement IDs through the module’s dependency declaration
or Hub plan.

| Requirement | Host binding or default |
| --- | --- |
| [`kickside.dashboard:api_router`](src/_index.yaml) | Host binds `app:api` |
| [`kickside.dashboard:ui_server`](src/_index.yaml) | Host binds `app:gateway` |
| [`kickside.dashboard.security:user_security_scope`](src/security/_index.yaml) | Default: `kickside.security.groups:members` |

## Links

- [KickSide](https://kickside.ai)
- [Module authoring](https://github.com/kicksideai/docs/blob/main/building-modules/index.md)
- [Wippy documentation](https://wippy.ai)
- [Wippy Hub](https://hub.wippy.ai/kickside/dashboard)

## License

[KickSide Community License 1.0](LICENSE). Vendored dependencies retain their own licenses.
