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
