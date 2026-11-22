-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
type ResolverRequest = { board_id: string, query: string, limit: integer }
type Selection = { board_id: string, scope: string, generation: integer, as_of: integer }
type WorkerConfig = { board_id: string, attachment_id: string, plugin: string, start_seq: integer }
type ProjectionRequest = { thread_id: string, projection: { kind: string, body: { worker_config: WorkerConfig } },
    range: { from_seq: integer, to_seq: integer } }
type ProjectionResult = { last_seq: integer, patch: { token: string? }? }

return { ResolverRequest = ResolverRequest, Selection = Selection, ProjectionRequest = ProjectionRequest, ProjectionResult = ProjectionResult }
