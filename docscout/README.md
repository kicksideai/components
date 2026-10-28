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

The host also supplies the declared requirements of the component, settings, uploads, models, execution, Jobs and realtime dependencies. Uploads must expose full primary Markdown artifacts through `kickside.contract:content_provider`. Extraction models must support structured output; embedding models must produce 512 dimensions. Assign the separate `kickside.docscout.security:tool_access` policy to enable the optional agent tools.

Caller scopes need the native contract capabilities `contract.security` on `security` and `contract.context` on `context` to bind the caller frame and upload identifier.

## Extraction and callers

Every caller opens `kickside.docscout:extraction`, binding `kickside.docscout:engine`, under its execution identity. The `run` input has `extractor_id`, `upload_id`, `caller` (`ui`, `agent`, `workflow`, `eval`) and an optional RFC3339 deadline. Evaluation calls additionally identify the admitted evaluation and case. The contract accepts saved configuration; chat tuning edits that configuration through the configurator trait.

The ordered stages read and process the document, map sections, prefetch evidence, scout, analyze deep fields, highlight, extract with structured output, and verify. Processed copies belong to extractor plus user, upload, checksum and processing settings. Chunks use `kickside/search-index` for keyword and vector retrieval. Exact page locations come from saved page spans; uncertain locations retain their range.

- UI: `POST /docscout/{id}/run`.
- Block: `kickside.docscout.blocks:extract`, with `extractor_id` in config and `upload_id` in input. Its result contains values, fields with evidence, verification, run ID, pages, trace, revision, duration and tokens.
- Traits: `kickside.docscout.traits:reader` and `:configurator`, exposing DocscoutList, DocscoutExtract, DocscoutGet, DocscoutConfigure, DocscoutEvaluate and DocscoutEvaluation. Typed tool failures use `nil, err`.

Listings accept `filter`, `limit` and `cursor`; `next_cursor` continues a stable component-ID order. The component service filters access and search text before paging.

Every run records its outcome and trace, including failed steps. Documents and runs expire after `kickside.docscout.retention` (default `2h`). Component teardown removes its documents, search-index rows, cases, runs and evaluations.

## Evaluations and realtime

Admission snapshots the config revision, configuration, case upload references and expected values. It commits evaluation rows and all Jobs admissions together, then wakes the pool. Workers restore the starter's identity and run the admitted snapshot through the extraction contract. The last case writes aggregate scores. Native case failures retain kind, message, retryability and details.

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
