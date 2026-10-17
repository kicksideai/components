# kickside/research

Research page, agent, Dataflow, actor-scoped run threads, and reusable Research Block.

This module installs independently into a [KickSide](https://kickside.ai) host.

## Quick start

In **System → Modules**, select the package from the Wippy Hub and review its
requirements. For CLI dependency setup, run from the host application directory:

```sh
wippy add kickside/research
wippy install
```

Apply host bindings and migrations through the application install plan.
Configure model and search providers. Research stores each request and result in its actor-scoped run thread; the Research Block composes that lifecycle.

## Requirements

Wippy 0.3.x; repository validation uses 0.3.47a. Use current Hub dependencies
for the contracts declared by the module.
The standalone harness uses SQLite and declares a PostgreSQL test profile.
Frontend development also uses Node.js 22, npm, and Make.

## Development

From this module directory:

```sh
make lockrefresh
make lint
make test
(cd test && wippy test --profile postgres --set vars.pg_database=kickside_readme_test)
```

Create a dedicated PostgreSQL database before the profile run and drop it
afterward. Set the `pg_host`, `pg_port`, `pg_username`, and `pg_password`
variables in the harness configuration for your test server.
Edit frontend source under `ui/` and run `make build` from this directory;
commit regenerated tracked assets with the source.

## Use

Configure the research model and search provider, open **Research**, and submit a question with a selected agent. Inspect the run’s progress and terminal report or failure. The Research Block shares the request lifecycle and supports headless composition without visual Workflows.

## Reference

- [Module reference](src/README.md)

### Contracts

| Definition | Methods |
| --- | --- |
| [`kickside.research:request`](src/_index.yaml) | `request` |

### Agent tools

Tool names link to their input/output schemas. Capabilities and the caller’s
resource access determine which tools are available.

| Tool | Selection and paging inputs |
| --- | --- |
| [`ReportProgress`](src/_index.yaml) | See the operation schema |
| [`DeepResearch`](src/traits/_index.yaml) | See the operation schema |

### Host requirements

Bind these exact requirement IDs through the module’s dependency declaration
or Hub plan.

| Requirement | Required host binding |
| --- | --- |
| [`kickside.research:target_db`](src/_index.yaml) | `app:db` |
| [`kickside.research:api_router`](src/_index.yaml) | `app:api` |
| [`kickside.research:ui_server`](src/_index.yaml) | `app:gateway` |
| [`kickside.research.security:user_security_scope`](src/security/_index.yaml) | `kickside.security.groups:members` |

## Links

- [KickSide](https://kickside.ai)
- [Module authoring](https://github.com/kicksideai/docs/blob/main/building-modules/index.md)
- [Wippy documentation](https://wippy.ai)
- [Wippy Hub](https://hub.wippy.ai/kickside/research)

## License

[KickSide Community License 1.0](LICENSE). Vendored dependencies retain their own licenses.
