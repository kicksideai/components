<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# Docscout

Docscout configures owned, shareable document extractors. The workspace discovers its create and manage views through the `kickside.docscout:extractor` component kind.

Configuration lives in component private context. Updates require WRITE and an `expected_revision`; the component service commits configuration and public metadata atomically. READ grants expose Test and Runs. The public metadata contains title, description, field count, and status. Deletion uses the component service and removes the extractor's document, run, and evaluation case rows.

The manage view provides Fields, Workflow, Retrieval, Test, Evals, and Runs. Models use `wc-model-picker`; uploads use the shared async picker over the Uploads catalog. The configuration schema and defaults live in `src/config.schema.json` and serve both native validation and the UI.

`kickside.docscout:extraction.run` declares the single extraction interface. Block and agent caller declarations include their schemas and remain private until their execution targets exist. This module does not implement extraction, chunking, embeddings, evaluation execution, or tuning. Test and execution controls show unavailable states. Development fixtures live only in `ui/harness`, which the module package excludes.

The global `kickside.docscout.retention` duration setting defaults to `2h`. Processed documents and run tables carry ownership, upload references, and expiry. Their future writers and retention callback belong to the extraction engine. Evaluation cases persist upload references and typed expected values without reading or modifying upload storage.

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
