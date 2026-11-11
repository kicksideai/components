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

Every caller opens `kickside.docscout:extraction`, binding `kickside.docscout:engine`, under its execution identity. The `run` input has `extractor_id`, `upload_id`, `caller` (`ui`, `agent`, `workflow`, `eval`) an optional `pages: { first, last }`, and an optional RFC3339 deadline. Evaluation calls additionally identify the admitted evaluation and case. The contract accepts saved configuration; chat tuning edits that configuration through the configurator trait.

### One document per input

An extractor reads one document: a single instance of the record its fields describe. For an upload that bundles several documents, such as several invoices scanned into one PDF, start a run for each document with the same `upload_id` and its own `pages: { first: 2, last: 4 }`. Bounds are 1-based, inclusive integers within the real page count. Documents without page information reject a range with `INVALID`. Omitting `pages` reads the whole upload with unchanged behavior. No child uploads are created. Rules that relate one field's value to another, such as one date following another, belong to the consumer of the result.

Only selected-page text reaches processing contexts, embeddings and the reading stages. A chunk is included when any of its pages is selected; its visible text retains only in-range spans where page markers identify them. Outline sections are clipped to the range. Quotes keep real document page numbers. Processed copies and their built outlines are isolated by range. The existing `pages` result remains the full document page count; `page_range` stores the selection in results and run history, and trace steps carry `pages`.

The ordered stages read and process the document, map sections, prefetch evidence, scout, analyze deep fields, highlight, extract with structured output, and verify. Extract defaults to `class:fast`. Processed copies belong to extractor plus user, upload, checksum and processing settings. Chunks use `kickside/search-index` for keyword and vector retrieval. Exact page locations come from saved page spans; uncertain locations retain their range.

Map, Scout, Extract and Verify accept optional stage-local `temperature` settings. Map, Verify and Deep also accept `max_tokens`; Extract uses `max_output_tokens`. The highlighter accepts `retrieval.highlighter_temperature` and `retrieval.highlighter_max_tokens`. A free-text reply (Deep analysis, built-in agent scout) cut at its output limit fails with `model_reply_truncated` instead of passing on incomplete text. Map, Scout, Extract and Verify default to temperature 0 in new configurations, including UI creation payloads. Existing saved configurations keep their settings, and an omitted setting retains the provider default. These are requested settings: providers can omit unsupported sampling options or adjust output limits. A selected Scout agent retains its own model and sampling settings.

Deep `min_similarity` is a vector similarity threshold: a search hit is kept when its embedding similarity to the query reaches it, in semantic and hybrid search alike. Hybrid fusion ranks do not enter it, and a keyword match without a vector similarity is kept.

- UI: `POST /docscout/{id}/run`.
- Block: `kickside.docscout.blocks:extract`, with `extractor_id` and optional `pages` in config and `upload_id` in input. Its result contains values, fields with evidence, verification, run ID, pages, trace, revision, duration and tokens.
- Traits: `kickside.docscout.traits:reader` and `:configurator`, exposing DocscoutList, DocscoutExtract, DocscoutGet, DocscoutConfigure, DocscoutEvaluate and DocscoutEvaluation. Typed tool failures use `nil, err`.

Extract groups fields into calls by their expected reply size: a call takes fields while their estimated replies (value leaves, lists at five items, up to five quotes each) fit `max_output_tokens`, and at most `max_fields_per_call` fields. The estimate is a scheduling heuristic, not a validity check or a provider limit. A field whose estimate exceeds the allowance is sent alone; short replies still succeed and actual truncation uses the existing error path. Splitting can add calls, repeated input tokens, cost and latency for existing extractors; each call retains the configured output allowance. Each Extract call settles independently. A provider error, timeout, truncated reply or invalid structured reply fails every field in that call without retaining any of its reply. Other calls continue. Failed fields have no value (`nil` in Lua), `missing: false`, `failed: true`, `verified: false`, and an `error` envelope containing `kind`, `message`, `retryable` and provider details. Successful fields have `failed: false`; `missing: true` means the document did not supply a value. The nested `values` object contains successfully extracted fields. The JSON `value` key is optional: it is absent for failed or missing fields. Consumers, including the UI, must check `failed` before `missing` or `value`; `failed: true` with an absent value is an extraction error, and its `error` supplies the cause. It never means that the document lacks the field, and it scores zero even when the expected value is absent. The nested `values` object omits failed and missing fields. Renderers accept an absent value as `undefined` and display an empty value without coercing it to a number, string or Boolean. Explicit JSON null is also accepted for a failed field; a null sentinel is unnecessary.

The run status is `completed` when it extracts values without field failures, `partial` when values survive alongside field failures, and `failed` when nothing is extracted or a shared stage fails. Extraction outcomes, including fully failed calls, return a result with fields and status through the contract and tool. Shared-stage errors return `nil, err` and retain their failed run and trace. The Block routes completed results to `result` and partial results to `partial`. Fully failed results return a native error through `failed`, with the complete extraction outcome in `err:details().result`; this uses the Workflow compiler's native error route.

| Stage | Error scope and reason |
| --- | --- |
| Read, Map | Run: processing and region selection establish the document every field reads. |
| Prefetch, Scout | Run: queries and evidence selection build the shared evidence pool. |
| Deep | Field: each analysis and its queries serve exactly one field; that field skips Extract after failure. |
| Highlight | Run: each batch rewrites passages shared across fields. |
| Extract | Call: all fields sharing a failed call fail together; later calls continue. |
| Verify | Run for native errors: document reads and support verdicts are shared. Unsupported values retain their value and fail verification. Failed extraction fields stay unverified. |

Support verification requires one verdict for every found, nonfailed field. One missing verdict rejects the entire reply with retryable `structured_reply_invalid`, fails the run, and returns a native error; the failed run and paid token usage remain recorded. This follows the shared-stage policy for Verify errors: support verdicts settle together, so an incomplete response cannot become a successful verification. A negative verdict in a complete reply keeps the value and marks it unverified. Docscout does not retry internally; a caller retry repeats the run's earlier stages and can add model cost.

Scout noise exclusions apply per field. A later citation or that field's own search readmits a passage; a later noise decision can exclude it again even when its historical provenance contains an earlier citation. Deep's own finds remain available to Deep's field. Extraction receives the union visible to its batch's fields within their selected regions; highlighting processes only passages usable by an extraction call. These decisions can change extracted values and prompt tokens for existing configurations. Provenance remains transient; stored runs keep their existing format.

Structured scouting requires evidence and note entries for every reviewed field; section summaries require every section; highlighting requires every supplied passage. Omitted or unknown entries reject the shared-stage response. Explicit empty evidence, blank notes and summaries, and empty highlight lists remain valid. Blank notes are suppressed, blank summaries remain absent, and passages with no genuine highlight are removed. The trace reports fields without cited evidence; completeness does not guarantee useful evidence.

### User-selected agents

For Scout's `mode: "agent"`, set `stages.scout.agent_id` to an agent component's bare id. Omitting it uses the built-in document loop. Scout is the configuration's agent-loop option; structured scouting uses `mode: "loop"`.

Save and update require READ access to the selected agent and reject components of another kind. Each run checks the runner's READ access again. Missing or unreadable agents return native typed errors with code `docscout_agent_access`. Sharing an extractor does not grant access to its selected agent.

The native Dataflow agent node resolves the selected agent through `wippy.agent:resolver` under the caller's execution identity. The agent retains its model, prompt, tools and traits, with Docscout's configured document tools added for that run. Those tools read only the caller's processed document under the extractor's READ grant. Both agent modes require positive `max_rounds` and `max_extra_queries`; switching from the structured scout's zero-round default requires setting a positive budget. Selected-agent runs use a native iteration limit of `max_rounds * max_extra_queries + 1`; the extra iteration permits final notes after tool use. Agents must complete synchronously without waiting. Trace steps include `agent_id`, `dataflow_id`, reported model reference, native tool calls and results, model tokens and document-tool embedding tokens. The built-in loop records its document tool calls too.

Listings accept `filter`, `limit` and `cursor`; `next_cursor` continues a stable component-ID order. The component service filters access and search text before paging.

Failed structured, generate and built-in agent calls include the usage and finish reason supplied by the LLM error details. A structured failure stopped at `length` reports `structured_reply_truncated`; other failures retain their kind, retryability and details. When the LLM module supplies neither metadata field, usage remains unreported and error handling stays unchanged.

When extraction finds no value in a field's selected sections within the searched pages, the field stays `missing: true` and records `codes: ["missing_in_sections"]` in both public and stored fields. With a `pages` range, the code means "not found in the selected sections within the searched pages"; other pages or sections may still contain the value. This informational code adds no `reason` and leaves verification, summary counts, statuses and trace messages unchanged. Earlier stored fields may omit `codes`.

Every run records its outcome and trace, including failed steps. Each trace step lists its model calls in `calls`: `stage` (`outline`, `summaries`, `select`, `scout`, `queries`, `analysis`, `highlight`, `extract`, `support`, `context` or `embed`), `model`, `prompt_tokens` and `completion_tokens` (absent when the provider reported no usage), `latency_ms`, `finish_reason`, `error_code`, and the known chunk ordinals (`sources`) carried by the request and field paths (`fields`) it serves. Outline and summary calls serve all configured fields; summary sources include only chunks whose text reaches the clipped excerpt. Selected-agent records preserve native finish reasons, errors, usage and step latency; source ordinals remain absent when the native agent does not report them. A selected agent can make its own internal tool or memory calls outside the primary-step records supplied by Dataflow. The run result and the stored run carry `summary`: field counts (`fields`, `found`, `missing`, `failed`, `verified`) and `unverified`, the number of unverified fields per cause, counted once per field (`no_passage`, `no_quote`, `shape_mismatch`, `format_unverified`, `quote_not_found`, `support_no_verdict`, `support_rejected`, `extraction_failed`, or `unchecked` when no check ran). An extractor's optional `config.retention` duration, such as `24h`, sets the lifetime of its new processed documents and runs. Set it in the Builder's document settings or through the extractor configuration API. When absent, `kickside.docscout.retention` applies (default `2h`). Existing documents and runs keep their stored expiry when configuration changes or the module updates; reusing a processed copy keeps its original expiry. An outline the Map model builds is kept on the processed copy under the identity of the complete resolved map model card, requested model reference, temperature, output limit, outline prompt/schema version, window and preview size, and later runs with the same identity reuse it; Map `outline: build` builds it again on every run. Reuse preserves the prior generated boundaries and titles, including an imperfect outline, until that identity changes, the processed copy expires, or a forced build replaces it. Editing a model card invalidates its cached outline; model-weight changes behind an unchanged provider/card identity require a forced build. One nullable cached outline and identity replace any earlier cache on each processed-document row. Existing rows first miss the cache; migration 02 adds columns without changing document contents, chunks, runs or expiries. Component teardown removes its documents, search-index rows, cases, runs and evaluations.

Call records contain metadata and references, without prompts, model responses or vectors. For a run with `C` reported requests, `N` processed chunks and `F <= 50` configured fields, added call storage is bounded by `C` records, at most `C * N` source references and `C * F` field references, plus scalar outcome metadata. The bound is input-dependent; tracing adds no requests or retries and does not omit calls to meet a fixed byte cap. Meters belong to one run and expire with its existing run row.

The summary counts produced field outcomes. A shared-stage failure before extraction therefore has zero produced fields; it does not claim every requested field failed extraction. A failed shared support call records `support_no_verdict` on each found, nonfailed field and retains the verification reason. The run status, error and failed trace step identify that shared failure.

Docscout requires Core >=0.3.9 and Jobs >=0.1.67. Committed document, run and evaluation admissions wake Core's existing retention service. The maintenance callback removes bounded expiry batches and checks up to 16 outstanding worker receipts. It reports the global next expiry or worker-check deadline through the existing Core timer; no separate service or periodic HTTP polling is used.

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

Value shapes have at most **four levels**, counting the field as level one and each property or list item as another level. This admits the acceptance agreement's deepest shapes while bounding model schemas and the property editor. Group segments do not consume value levels. Objects are closed to undeclared properties; required properties and enum choices appear in extraction schemas and verification. `expected_format` describes the requested representation to the model. For a `date` field whose `expected_format` is a date pattern, Verify also checks the value: numeric patterns use the tokens `YYYY`, `YY`, `MM`, `M`, `DD` and `D` in any letter case, separated by spaces or `- / . ,`. A value that does not parse as a real date in that pattern stays unverified with the reason. Patterns using `MMMM` or `MMM` leave the date unverified with the reason that the month-name language is unspecified; this applies equally to localized and English names. A format written in prose, such as `an ISO date`, only guides the model. Existing Verify-enabled extractors now check numeric date patterns and report unspecified month-name languages; values remain unchanged. Verify-disabled extractors keep their prior behavior.

Extraction calls share a group path and selected region, then split at the fields-per-call limit. Evaluation cases use the same nested values. Scoring follows declared types recursively: printed numbers, date digits, text overlap, order-free list F1 and mean scores over declared object properties. A property omitted from the expectation scores as absent.

Builder groups collapse independently; changing a group path renames its subtree, and the field inspector moves individual fields. Test, saved Runs and evaluation comparisons display object properties and list rows. Existing development configurations with free-text groups, untyped objects or `item_type` lists must be edited to declare their paths and shapes; there is no stored-config migration.

## Evaluations and realtime

Admission snapshots the config revision, configuration, case upload references, optional page ranges and expected values. It commits evaluation rows and all Jobs admissions together, then wakes the pool. Workers restore the starter's identity and run the admitted snapshot through the extraction contract. The last case writes aggregate scores. Native case failures retain kind, message, retryability and details. Partial and fully failed extraction results retain per-field scores: a failed field scores zero even when its expected value is absent, and its score records the error cause. These scored cases contribute to aggregate accuracy.

Jobs retries a failed run before its final attempt only when its native error is retryable and its kind is not deterministic under Jobs policy. A result retries only when every failed field meets that rule. Unclassified string errors are not transient by default. Structured truncation and schema-mismatch errors retain their existing retry classification. The existing three-attempt policy bounds whole-run retries; successful fields are recalculated, the final attempt supplies scores, and earlier successful values are not merged into it. Successful runs and permanent failures add no retry calls. Eligible failures can add two whole runs of model calls and their cost.

Evaluation runs store nullable evaluation and case references. Case and evaluation totals include every recorded attempt's tokens and execution duration, including when a settlement write fails. Historical runs and settled evaluations keep their stored totals. The existing retention transaction rolls expired pending-attempt usage into its case before removing the run, so usage survives run expiry without extending retention or adding attempt rows.

Committed config, case and evaluation writes wake the effective READ audience on `component.<id>`. Runs wake their maker on `docscout.runs.<id>`. Docscout wakeup payloads contain identifiers. Readers subscribe before loading and refetch committed state after wakeups and host visibility changes.

On the final Jobs attempt, returned evaluation-read and status-write failures settle the case and evaluation totals together while preserving the native worker failure. Every admitted case stores its real Job ID in the admission transaction. Jobs release hints trigger prompt reconciliation; a private 30-second check deadline provides recovery after a missed hint or restart. Pending/running workers keep their cases active. A terminal or retained-out Job without a stored case outcome settles that case as failed, preserving the available worker error. This never invents successful extraction scores or unrecorded usage.

Recovery advances only its own scheduling metadata before checking Jobs. All outcomes and metrics still pass the Component existence fence. A deletion race remains blocked until the next deadline; abandoning deletion can recover without an additional hint. Completed extractor cleanup removes its receipts, so it leaves no recovery timer. Retrying an already active `start` republishes retention and pool wakeups after a post-commit delivery failure.

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

Manual-worker fixtures enroll real Jobs with the public `parked=true` enqueue option: the job has no scheduled execution until explicitly woken. This keeps receipt validation real while tests invoke the worker themselves.
