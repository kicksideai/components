# kickside/agent-onboarding

First-agent creation for every authenticated user who owns no agent.

Install the module in a KickSide host with `wippy add kickside/agent-onboarding`
and `wippy install`. Bind the host resources declared in
[host-parameters.json](host-parameters.json). The host supplies
the generic splash eligibility and navigation contract.

The platform setup wizard runs first for administrators. The personal prompt
then offers General-purpose (default) or any set of installed capabilities,
an agent name, and an optional model. Creation uses the agents module under
the current user's identity and opens the agent's chat. Owned agents suppress
the prompt; shared agents do not. Completion and dismissal persist per user.

[Registry and API reference](src/README.md) documents the live capability catalog, host bindings,
ownership, and the authenticated endpoint for reopening a dismissed prompt.

## Development

Wippy 0.3.44a, Node.js 22, npm, Make, and Python 3 supply the validation tools.
Run `make setup`, `make test`, `make test-ui`, `make typecheck`, `make build`,
and `make lint` in this directory. PostgreSQL uses the harness's `postgres`
profile and `vars.pg_database`; create a scratch database and drop it after
the gate. SQLite uses an in-memory database.

Commit regenerated `static/` assets with `ui/` changes. Releases use the
repository Release Please configuration.


## License

[KickSide Community License 1.0](LICENSE).
