-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local domain = require("domain")
local types = require("types")
type Config = { board_id: string?, where: domain.Where? }
type Request = { config: Config?, cursor: types.ChangesCursor?, limit: integer? }
type Item = { item_key: string, dedup_key: string, source_version: string, op: string, payload: types.ChangeItem? }
type Result = { success: boolean, items: { Item }?, next_cursor: types.ChangesCursor?, has_more: boolean? }
type Board = { list_changes: (Board, types.ChangesRequest) -> (types.ChangesResult?, error?) }

type Failure = { success: boolean, error: { code: string, message: string, retriable: boolean, scope: string, kind: string, details: unknown } }
return { Failure = Failure, Config = Config, Request = Request, Item = Item, Result = Result, Board = Board }
