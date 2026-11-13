-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local domain = require("domain")
type Deadline = domain.Deadline
type JobLease = { token: string, execution_seq: integer }
type SlotJob = { id: string, lease_token: string, execution_seq: integer, scheduled_at: string?, deadline: string? }
type SlotInput = { job: SlotJob?, payload: { board_id: string?, trace_context: domain.TraceContext? }? }
type SlotResult = { self_completed: boolean?, completion: unknown }
type BoardBatchResult = { done: boolean?, candidates: integer?, stranded: integer? }
type RecomputeRequest = { board_id: string, deadline: string?, trace_context: domain.TraceContext? }
type RecomputeResult = { done: boolean }
type RebalanceRequest = { board_id: string, deadline: string?, trace_context: domain.TraceContext? }
type RebalanceResult = { done: boolean }

type BatchRequest = { board_id: string, deadline: string?, trace_context: domain.TraceContext? }
type BatchResult = { candidates: integer, moved: integer, stranded: integer }
type MigrationResult = { self_completed: boolean?, migrated: boolean?, completion: unknown }

type ProcessRequest = { board_id: string, item: string, state: string?, visit: integer?, timer: string?, attempt: integer?, scheduled_at: string?, deadline: string?, trace_context: domain.TraceContext? }
type ProcessResult = { rearm: string?, record: { status: string } }
type ProcessInput = { payload: ProcessRequest, job: SlotJob }
return { ProcessRequest = ProcessRequest, ProcessResult = ProcessResult, ProcessInput = ProcessInput, BoardBatchResult = BoardBatchResult, Deadline = Deadline, JobLease = JobLease, SlotJob = SlotJob, SlotInput = SlotInput, SlotResult = SlotResult, RecomputeRequest = RecomputeRequest,
    RecomputeResult = RecomputeResult, RebalanceRequest = RebalanceRequest, RebalanceResult = RebalanceResult,
    BatchRequest = BatchRequest, BatchResult = BatchResult, MigrationResult = MigrationResult }
