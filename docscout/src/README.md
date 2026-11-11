<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# Docscout source

`_index.yaml` declares the extraction contract, engine binding, component lifecycle, retention setting and host requirements. See the package README for installation and public callers.

- `client.lua` opens the extraction contract in the current security frame.
- `engine/` processes Markdown artifacts, gathers evidence, assembles independent extraction outcomes and records traces. `user_agent.lua` invokes the native Dataflow agent node; `document_tool.lua` exposes document tools under the caller's identity.
- `persist/` owns fenced SQL transactions, processed copies, cases, runs and admitted evaluation snapshots.
- `evals/` admits Jobs atomically and runs saved snapshots under restored execution identities.
- `notify.lua` publishes committed-state wakeups through component fanout, the realtime contract and Core's existing retention notifier.
- `retention/` owns the privileged maintenance callback, bounded expiry batches and the global next-expiry deadline reported to Core.
- `api/`, `traits/` and `blocks/` expose HTTP, chat and Workflow entry points.
- `security/` separates module access, optional tools and worker capabilities.
- `migrations/` declares SQLite and PostgreSQL schemas.

An extraction input can include `pages: { first: 2, last: 4 }` to read an
inclusive range of the uploaded document's real page numbers. Both bounds are
integers, start at one, and must fit the page count recorded by the processed
document's page markers. Documents without page information reject this input
with `INVALID`. Omitting `pages` reads the whole document.

Every chunk overlapping the range is included. Only its in-range page spans
are retained where markers identify them; heading metadata is rebuilt from
selected text. Chunk ordinals are local to the processed copy, while evidence
keeps the document's real page numbers. Context generation, embeddings, map,
scout, search, extraction, verification and deep reads use that same copy.
Processed-copy keys include the range. The existing `pages` result stays a
page count; `page_range` carries the optional selection in the result and stored
run, and trace steps carry `pages`. The Workflow Block accepts `pages` in its
configuration, and the contract, HTTP endpoint and agent tool accept it in the
run input.

Evaluation cases accept the same optional `pages` alongside `upload_id` and
`expected`. Admission copies the range into each evaluation result's immutable
inputs, so deleting or replacing the case does not change the queued run. A
nullable `pages` column in cases and evaluation results preserves older rows;
runs keep their selection in their existing result JSON.
