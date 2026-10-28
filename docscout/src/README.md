<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# Docscout source

`_index.yaml` declares the extraction contract, engine binding, component lifecycle, retention setting and host requirements. See the package README for installation and public callers.

- `client.lua` opens the extraction contract in the current security frame.
- `engine/` processes Markdown artifacts, gathers evidence and records extraction traces.
- `persist/` owns fenced SQL transactions, processed copies, cases, runs and admitted evaluation snapshots.
- `evals/` admits Jobs atomically and runs saved snapshots under restored execution identities.
- `notify.lua` publishes committed-state wakeups through component fanout and the realtime contract.
- `api/`, `traits/` and `blocks/` expose HTTP, chat and Workflow entry points.
- `security/` separates module access, optional tools and worker capabilities.
- `migrations/` declares SQLite and PostgreSQL schemas.
