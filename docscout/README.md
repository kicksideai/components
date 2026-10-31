<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# Docscout

Docscout extracts typed fields from uploaded documents, with grounded quotes, sections and page locations. Extractors are shareable components of kind `kickside.docscout:extractor`. READ permits running an extractor; WRITE permits configuration, cases and evaluations. Each person sees their own runs.

## Installation

Provide these host bindings:

| Requirement | Host resource |
| --- | --- |
| `kickside.docscout:target_db` | The SQL database shared with component service and Jobs |
| `kickside.docscout:api_router` | An authenticated router with `token_auth` and `endpoint_firewall` |
| `kickside.docscout:ui_server` | The HTTP service serving the module assets |
| `kickside.docscout.security:user_security_scope` | The group allowed to use Docscout; defaults to platform Members |

Bind `target_db` to the same registry resource ID as Component and Jobs. The
Component existence fence and Jobs transactional enqueue participate in Docscout's
transaction; a separate database is not a supported placement. These owning APIs
preserve deletion safety and atomic evaluation admission without cross-database
coordination. Docscout does not rebind either dependency's database.

The host also supplies the declared requirements of the component, settings, uploads, models, execution, Jobs and realtime dependencies. Uploads must expose full primary Markdown artifacts through `kickside.contract:content_provider`. Extraction models must support structured output; embedding models must produce 512 dimensions. Assign the separate `kickside.docscout.security:tool_access` policy to enable the optional agent tools.

Caller scopes need the native contract capabilities `contract.security` on `security` and `contract.context` on `context` to bind the caller frame and upload identifier.

## Extraction and callers

Every caller opens `kickside.docscout:extraction`, binding `kickside.docscout:engine`, under its execution identity. The `run` input has `extractor_id`, `upload_id`, `caller` (`ui`, `agent`, `workflow`, `eval`) and an optional RFC3339 deadline. Evaluation calls additionally identify the admitted evaluation and case. The contract accepts saved configuration; chat tuning edits that configuration through the configurator trait.

The ordered stages read and process the document, map sections, prefetch evidence, scout, analyze deep fields, highlight, extract with structured output, and verify. Extract defaults to `class:fast`. Processed copies belong to extractor plus user, upload, checksum and processing settings. Chunks use `kickside/search-index` for keyword and vector retrieval. Exact page locations come from saved page spans; uncertain locations retain their range.

- UI: `POST /docscout/{id}/run`.
- Block: `kickside.docscout.blocks:extract`, with `extractor_id` in config and `upload_id` in input. Its result contains values, fields with evidence, verification, run ID, pages, trace, revision, duration and tokens.
- Traits: `kickside.docscout.traits:reader` and `:configurator`, exposing DocscoutList, DocscoutExtract, DocscoutGet, DocscoutConfigure, DocscoutEvaluate and DocscoutEvaluation. Typed tool failures use `nil, err`.

Each Extract call settles independently. A provider error, timeout, truncated reply or invalid structured reply fails every field in that call without retaining any of its reply. Other calls continue. Failed fields have no value (`nil` in Lua), `missing: false`, `failed: true`, `verified: false`, and an `error` envelope containing `kind`, `message`, `retryable` and provider details. Successful fields have `failed: false`; `missing: true` means the document did not supply a value. The nested `values` object contains successfully extracted fields. The JSON `value` key is optional: it is absent for failed or missing fields. Consumers, including the UI, must check `failed` before `missing` or `value`; `failed: true` with an absent value is an extraction error, and its `error` supplies the cause. It never means that the document lacks the field, and it scores zero even when the expected value is absent. The nested `values` object omits failed and missing fields. Renderers accept an absent value as `undefined` and display an empty value without coercing it to a number, string or Boolean. Explicit JSON null is also accepted for a failed field; a null sentinel is unnecessary.

The run status is `completed` when it extracts values without field failures, `partial` when values survive alongside field failures, and `failed` when nothing is extracted or a shared stage fails. Extraction outcomes, including fully failed calls, return a result with fields and status through the contract and tool. Shared-stage errors return `nil, err` and retain their failed run and trace. The Block routes completed results to `result` and partial results to `partial`. Fully failed results return a native error through `failed`, with the complete extraction outcome in `err:details().result`; this uses the Workflow compiler's native error route.

| Stage | Error scope and reason |
| --- | --- |
| Read, Map | Run: processing and region selection establish the document every field reads. |
| Prefetch, Scout | Run: queries and evidence selection build the shared evidence pool. |
| Deep | Field: each analysis and its queries serve exactly one field; that field skips Extract after failure. |
| Highlight | Run: each batch rewrites passages shared across fields. |
| Extract | Call: all fields sharing a failed call fail together; later calls continue. |
| Verify | Run for native errors: document reads and support verdicts are shared. Unsupported values retain their value and fail verification. Failed extraction fields stay unverified. |

### User-selected agents

For Scout's `mode: "agent"`, set `stages.scout.agent_id` to an agent component's bare id. Omitting it uses the built-in document loop. Scout is the configuration's agent-loop option; structured scouting uses `mode: "loop"`.

Save and update require READ access to the selected agent and reject components of another kind. Each run checks the runner's READ access again. Missing or unreadable agents return native typed errors with code `docscout_agent_access`. Sharing an extractor does not grant access to its selected agent.

The native Dataflow agent node resolves the selected agent through `wippy.agent:resolver` under the caller's execution identity. The agent retains its model, prompt, tools and traits, with Docscout's configured document tools added for that run. Those tools read only the caller's processed document under the extractor's READ grant. Both agent modes require positive `max_rounds` and `max_extra_queries`; switching from the structured scout's zero-round default requires setting a positive budget. Selected-agent runs use a native iteration limit of `max_rounds * max_extra_queries + 1`; the extra iteration permits final notes after tool use. Agents must complete synchronously without waiting. Trace steps include `agent_id`, `dataflow_id`, actual model, native tool calls and results, model tokens and document-tool embedding tokens. The built-in loop records its document tool calls too.

Listings accept `filter`, `limit` and `cursor`; `next_cursor` continues a stable component-ID order. The component service filters access and search text before paging.

Every run records its outcome and trace, including failed steps. Documents and runs expire after `kickside.docscout.retention` (default `2h`). Component teardown removes its documents, search-index rows, cases, runs and evaluations.

## Field groups and declared shapes

A field's `group` is empty for a top-level value or a dotted snake_case path such as `parties.borrower`. Its identity is the group plus its name (`parties.borrower.name`); names can repeat in different groups. A field path cannot also serve as a group path. Each extraction response includes `values` nested by group and `fields[]` entries with the leaf `name`, full `path`, value and evidence. The extraction contract, Block and agent tool use this same shape.

Objects declare a non-empty `properties` array. Each property has `name`, `type`, `description`, `enum_values`, `expected_format` and `required`, plus `properties` for an object or `item` for a list. Lists declare an `item` shape using those same value attributes, without a property name or required flag. For example, a list of payment objects declares:

```json
{
  "type": "list",
  "item": {
    "type": "object",
    "properties": [
      {"name": "amount", "type": "number", "description": "Payment amount", "enum_values": [], "expected_format": "", "required": true},
      {"name": "due", "type": "date", "description": "Due date", "enum_values": [], "expected_format": "YYYY-MM-DD", "required": false}
    ]
  }
}
```

Value shapes have at most **four levels**, counting the field as level one and each property or list item as another level. This admits the acceptance agreement's deepest shapes while bounding model schemas and the property editor. Group segments do not consume value levels. Objects are closed to undeclared properties; required properties and enum choices appear in extraction schemas and verification. `expected_format` describes the requested representation to the model.

Extraction calls share a group path and selected region, then split at the fields-per-call limit. Evaluation cases use the same nested values. Scoring follows declared types recursively: printed numbers, date digits, text overlap, order-free list F1 and mean scores over declared object properties. A property omitted from the expectation scores as absent.

Builder groups collapse independently; changing a group path renames its subtree, and the field inspector moves individual fields. Test, saved Runs and evaluation comparisons display object properties and list rows. Existing development configurations with free-text groups, untyped objects or `item_type` lists must be edited to declare their paths and shapes; there is no stored-config migration.

## Evaluations and realtime

Admission snapshots the config revision, configuration, case upload references and expected values. It commits evaluation rows and all Jobs admissions together, then wakes the pool. Workers restore the starter's identity and run the admitted snapshot through the extraction contract. The last case writes aggregate scores. Native case failures retain kind, message, retryability and details. Partial and fully failed extraction results retain per-field scores: a failed field scores zero even when its expected value is absent, and its score records the error cause. These scored cases contribute to aggregate accuracy.

Committed config, case and evaluation writes wake the effective READ audience on `component.<id>`. Runs wake their maker on `docscout.runs.<id>`. Docscout wakeup payloads contain identifiers. Readers subscribe before loading and refetch committed state after wakeups and host visibility changes.

On the final Jobs attempt, returned evaluation-read and status-write failures settle the case and evaluation totals together while preserving the native worker failure. Crashes, timeouts and failures that prevent settlement from committing still need an owner lifecycle hook in the platform Jobs API; that integration remains blocked in the supplied platform source.

## Development

```sh
make setup KICKSIDE_SOURCE_ROOT=/path/to/platform
make lint test KICKSIDE_SOURCE_ROOT=/path/to/platform
make verify KICKSIDE_SOURCE_ROOT=/path/to/platform
make postgres-up
make test-pg KICKSIDE_SOURCE_ROOT=/path/to/platform
make postgres-down
```

`test` uses SQLite and allocates a temporary HTTP port for endpoint tests. It requires local socket access. `verify` also typechecks, tests and builds the UI. The PostgreSQL target uses the harness profile; the compose targets manage its disposable database. Dependency refresh requires registry access. Release Please owns release metadata.
