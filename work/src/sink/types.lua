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
return { Config = Config, Input = Input, Request = Request, Result = Result, Board = Board }
