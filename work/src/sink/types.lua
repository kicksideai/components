-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local domain = require("domain")
local read_types = require("read_types")
local types = require("types")
type Config = { board_id: string?, source: string? }
type Input = { values: { [string]: unknown }?, clear: { string }?, unset: { string }? }
type Request = { config: Config?, input: Input?, identity_key: string?, idempotency_key: string?, origin: string?,
    automation_ref: unknown, sink_op: string?, trace_context: domain.TraceContext? }
type Result = { success: boolean, result: string?, dest_ref: { item_id: string? }? }
type Board = { get: (Board, read_types.GetRequest) -> (read_types.GetResult?, error?),
    apply: (Board, types.ApplyRequest) -> (types.ApplyResult?, error?) }
type Token = { board_id: string, item: string, visit: integer, attempt: integer }
type StageEntry = { board_id: string?, item: string?, visit: integer?, attempt: integer?, state: string?, flow_ref: domain.FlowRef? }
type Completion = { token: Token, run_id: string, dataflow_id: string, flow_ref: domain.FlowRef, status: string,
    started_at: string?, ended_at: string, error: { code: string, message: string }? }
type LaunchRequest = { config: { board_id: string?, flow_ref: domain.FlowRef?, completion: { component_id: string, token_fields: { string } }? }?,
    input: StageEntry?, sink_op: string?, automation_ref: { kind: string, id: string, revision: integer }?,
    origin: string?, identity_key: string?, idempotency_key: string?, trace_context: domain.TraceContext? }
type WorkflowResult = { success: boolean, result: string?, dest_ref: { run_id: string }?,
    error: { code: string, message: string, retriable: boolean, scope: string, retry_after_ms: integer? }?, retry_after_ms: integer? }
return { Token = Token, StageEntry = StageEntry, Completion = Completion, LaunchRequest = LaunchRequest, WorkflowResult = WorkflowResult, Config = Config, Input = Input, Request = Request, Result = Result, Board = Board }
