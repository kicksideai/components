# Research

A registry-driven research module, self-contained as one module: a **page web
component**, a **dataflow**, and a **research-run thread kind** with its own
read model — each contributed through registry entries, no edits to the host.

## Flow

1. The Research page (`research-app` web component) takes a prompt and POSTs
   `{prompt, agent_id}` to `/research`. The HTTP adapter also accepts the published `topic` input.
2. `submit` calls the `kickside.research:request` contract, which ensures a
   canonical actor-scoped thread, appends the `request` event, and starts a
   dataflow: a web-research agent (`kickside.research.agents:researcher`,
   webscout `web_researcher` trait) → `deliver` node.
3. The agent uses Dataflow `arena.exit_schema` with `tool_calling: any` to
   finish with `{title, summary, key_points: string[], sources: {url, title}[]}`.
   `deliver` validates that object, renders it to markdown, and
   appends the `kickside.research.events:result` event to the run thread. A
   blank report is not a result: `deliver` fails closed and the dataflow routes
   both agent failures and delivery failures to `deliver_error`, which appends
   `kickside.research.events:failed`. Every run ends on exactly one of the two.
4. The run projection folds those events into `kickside_research_run`; the page
   loads that read model and follows the live thread events.

## What it ships

- Page web component, built to `./static`, served at `/research-app`.
- The research-run thread kind, its read-model projection, and the
  `request` / `progress` / `result` / `failed` event vocabulary.
- `submit` (`POST /research`) + the `deliver` / `deliver_error` dataflow
  terminals + the `researcher` agent + the `DeepResearch` agent tool.
- A strict `kickside.block/v1` Research wait Block. Its arm calls the same
  package-owned request contract and its terminal projection resumes the parked
  Dataflow Signal through `kickside.blocks:resume`.

## Boundary

Threads, projections, and retention live in `kickside/core`; the dataflow engine
in `wippy/dataflow`. Visual Workflows may discover the Block but are not required
by this module. The native page, request contract, and dataflow remain first-class.

Update through **System → Modules → Update all**, then restart the installation.
The module preserves published inputs and stored reports. Data-shape changes
belong to forward migrations shipped by the owning module.
