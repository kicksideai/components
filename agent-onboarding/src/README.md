# First-agent onboarding

`kickside/agent-onboarding` prompts each authenticated user to create their first
personal agent. It contributes a `ui.splash` with ID `first_agent`, `scope: user`,
priority 50, and a component step. The existing instance onboarding keeps its
own state and priority.

The eligibility function counts user-agent components whose `owner` metadata
matches the current actor. An owned agent suppresses the splash; access to
someone else's shared agent does not. The UI owner stores completion and
dismissal in the caller's `kickside.ui:seen_splashes` profile field through
`kickside.users.profile:profile`. Instance splash state uses the settings owner.
The module adds no persistence table.

## Installation

Declare an `ns.dependency` on `kickside/agent-onboarding` with `version: '*'`.
The module depends on agents, component, UI, users, settings, and widgets at `'*'`.
Bind `ui_server` to the host gateway, as shown in `../host-parameters.json`.
The host supplies the agents and widgets API/router/security bindings.

The host supplies the UI eligibility hook, sequential splash progression, and the shell's component `navigate` forwarding. Rebuild the shell through `make build MOD=app-main`.

## Capabilities

The initial selection contains `kickside.agents.traits:trait_master`
(**All Capabilities**), `kickside.agents.traits:artifacts` (**Artifacts**), and
`kickside.uploads.traits:file_manager` (**File Manager**). All Capabilities starts
with `inject_trait_catalog: true`. The member can change this selection using
the installed capability catalog.

The shared `wc-agent-trait-picker` reads `GET /api/v1/agents/traits` at runtime,
using the same public installed catalog as the Agents form. Installing any module
that contributes a public capability makes it available in the dropdown.
Private capabilities follow the agents catalog's visibility rules.

The user can select any set of capabilities. An empty selection omits `traits`
and `trait_contexts` from the create request, so the agents defaults apply.
A nonempty selection sends exactly the selected IDs and their picker contexts.
The initial UI selection supplies the defaults above; clearing it uses the
agents module's creation defaults.

## Component and creation

`kickside-agent-onboarding` uses the shared `wc-agent-trait-picker` for
capabilities and their contexts, and `wc-model-picker` for an optional model
override. The user supplies a name and optionally selects capabilities. Creation stays
blocked until model discovery confirms a generation model for the selected model
or the platform default `class:fast`. With no model, a Configure a model step
opens the existing Models onboarding component; completion rechecks persisted
configuration. Users without model settings access ask an administrator.
The component uses `--p-*` theme tokens, native details controls, and
PrimeVue inline controls.

Creation calls the agents owner's `POST /api/v1/user-agents` under the current
user's identity. The request omits `model` unless the user chooses one. The agents
owner applies its default model, assigns ownership, and checks trait access.
After creation, `GET /api/v1/agents/list` supplies the agent's canonical
`start_token`. The component emits the `navigate` CustomEvent with
`{path: '/sessions', startToken}`. The shell awaits splash persistence, navigates,
and opens chat through its existing controller. A failed chat lookup offers a
retry without creating a second agent. Creation and picker errors stay visible.
An older navigation response cannot restore a splash after successful dismissal.
`done` dismisses the splash through the shell when the user selects Skip for now.

## Reopen

An authenticated user can clear their mark with
`DELETE /api/v1/ui/splash/first_agent/seen` and reload the shell. The next
`GET /api/v1/nav/list` reevaluates eligibility. Reopening shows the splash only
while the user owns zero agents. The module provides no extra reopen button.

## Verification

Run backend setup and tests with the approved Wippy runtime:

```bash
make -C agent-onboarding setup
make -C agent-onboarding test
make -C agent-onboarding lint
make -C agent-onboarding test-ui
make -C agent-onboarding typecheck
make -C agent-onboarding build
```

The backend host supports `--profile postgres --set vars.pg_database=<scratch>`.
Create the scratch database before the gate and drop it after. Tests cover
eligibility, dismissal/reopen, per-user isolation, live fixture capabilities,
default creation equality with the agents registry, exact capability selection,
ownership, denied cross-user reads, and shared agents. Package and UI tests check
dependencies, default payloads, optional models, contexts, and error recovery.

