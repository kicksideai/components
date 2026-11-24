-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local access = require("access")
local config = require("config")
local work = require("work")

type Context = {
    admission: access.Admission, settings: config.Config, board: work.Board, names: work.GeneratedNames,
    visibility: work.Condition,
}
type Request = {
    board_id: string, item: string?, from: string?, to: string?, person: string?, sprint: string?,
    group_by: string?, cursor: string?, limit: integer?, sort: string?,
}
type Window = { from: string, to: string }
type Row = { [string]: unknown }
type Summary = {
    item: string, minutes: integer, entry_count: integer, original_minutes: integer?, remaining_minutes: integer?,
    over_estimate: boolean,
}
type Group = {
    board_id: string, sprint: string?, person: string?, person_name: string?, week: string?,
    entry_count: integer, minutes: integer, original_minutes: integer?, points: number?,
}
type Report = {
    coverage: string, groups: { Group }?, cursor: string?, direct_minutes: integer?, subtree_minutes: integer?,
    entry_count: integer?, original_minutes: integer?, remaining_minutes: integer?, over_estimate: boolean?,
}
type Worklog = { id: string, item: string, person: string, person_name: string?, work_date: string,
    minutes: integer, version: integer, sprint: string?, note: string?, can_edit: boolean }
type Listing = { entries: { Worklog }, cursor: string? }
return { Context = Context, Request = Request, Window = Window, Row = Row, Summary = Summary,
    Group = Group, Report = Report, Worklog = Worklog, Listing = Listing }
