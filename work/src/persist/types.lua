-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
type Executor = sql.DB | sql.Transaction
-- Column names an inserted column; expr wraps its placeholder (the "%s").
type Column = { name: string, expr: string? }
type Finder = { find: (self: Finder, request: { [string]: unknown }) -> (unknown, error?) }
type ProjectionOutput = { body: unknown, last_seq: integer }
type MetaInput = { thread_id: string? }
type Published = { published: boolean }

type OwnedTable = { name: string, keys: string }
type Cleanup = { success: boolean, needs_continue: boolean, deleted: integer }

type StageRun = { item_id: string, state: string, visit: integer, attempt: integer, started: string, finished: string?, outcome: string? }

type Seed = { id: string, seq: integer, event_no: integer }
return { StageRun = StageRun, Seed = Seed, OwnedTable = OwnedTable, Cleanup = Cleanup, Executor = Executor, Column = Column, Finder = Finder, ProjectionOutput = ProjectionOutput, MetaInput = MetaInput, Published = Published }
