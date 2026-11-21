-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local reads = require("reads")
local domain = require("domain")

type Map = domain.JsonObject
type Input = { board_id: string, item: string, state: string, cursor: reads.ChangesCursor? }
type Config = { timeout_ms: integer? }
type Match = { id: string, state: string, version: integer }
type Result = { status: string, cursor: reads.ChangesCursor, item: Match? }
type Observation = reads.ReadStamp & { cursor: reads.ChangesCursor, item: Match? }
type Context = {
    input: Input,
    budget: reads.ReadBudget,
    deadline: domain.Deadline,
    cursor: reads.ChangesCursor?,
}
type ProjectionCursor = { id: string, status: string }

return {}
