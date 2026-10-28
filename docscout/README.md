<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# Docscout

Docscout extracts typed fields from uploaded documents, with a quote, section and page for every value. Each extractor is a shareable component of kind `kickside.docscout:extractor`: WRITE edits its configuration, cases and evaluations; READ runs it.

## Extraction

The engine reads an upload's extracted Markdown through `kickside.contract:content_provider`, splits it into chunks that keep sections and tables, and indexes them for keyword and vector search through `kickside/search-index` in Docscout's own tables. A processed copy belongs to the user and upload and is reused while fresh for the same content, chunking settings and resolved models. Then the configured stages run in order: Map, Prefetch, Scout (structured loop or agent with document tools), Deep analysis, the optional highlighter, Extract per field group, and Verify. Document text is treated as untrusted data in every prompt, every model output is bounded by the configuration, and Verify checks each quote against the stored chunks.

Every run is recorded with a per-step trace of time, tokens, queries and messages. Processed documents and runs expire after the global `kickside.docscout.retention` duration (default `2h`); the `kickside.retention.owner` callback removes them.

## Callers

- Test tab: `POST /docscout/{id}/run` with an upload.
- Contract `kickside.docscout.callers:extraction`, method `run`.
- Workflow Block `kickside.docscout.callers:block.extract`: config picks the extractor, input carries `upload_id`; output has `values`, `fields`, `verified`, `run_id`, `pages`, and failures route to the `failed` port.
- Agent tools DocscoutList, DocscoutExtract, DocscoutGet, DocscoutConfigure, DocscoutEvaluate and DocscoutEvaluation, exposed by the traits `reader` and `configurator`.

All callers run under their own identity and need READ on the extractor and access to the upload.

## Evaluations

Cases pair an upload with the values it states; a field left out is one the document does not state. An evaluation runs every case as its own `kickside/jobs` job through the extraction contract, under the identity of the person who started it, resolved again when each job runs. Values are scored by field type: numbers as printed, dates by their digits, text by word overlap, lists as order-free F1 and objects by their expected keys. The last case writes per-field accuracy. Cases, evaluations and their results go with the extractor.

## Development

Use the production Wippy runtime selected for the application and a supported Node/npm toolchain. The standalone harness resolves sibling KickSide sources through `KICKSIDE_SOURCE_ROOT` and other dependencies from the Hub.

```sh
make lockrefresh KICKSIDE_SOURCE_ROOT=/path/to/kickside
make ui-install build typecheck test-ui
make lint test KICKSIDE_SOURCE_ROOT=/path/to/kickside
make test-pg KICKSIDE_SOURCE_ROOT=/path/to/kickside WIPPY_ARGS='--set vars.pg_database=<scratch-database>'
```

Create and drop the Postgres scratch database around that gate. The harness defaults to SQLite. `make preview` serves development fixtures; the production build emits the module's served `static/` assets.

## Compatibility

This is a new package. No published component kind, endpoint, contract, requirement, event, or stored shape changes. Its forward migration creates only Docscout-owned tables and indexes. It does not change upload tables or migrate legacy registry-based Docscout groups. Release metadata and publication remain separate work.
