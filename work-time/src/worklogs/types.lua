-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
type Create = { board_id: string, item: string, minutes: integer, work_date: string, key: string, note: string? }
type Edit = { board_id: string, id: string, expected_version: integer, minutes: integer?, work_date: string?, note: string? }
type Delete = { board_id: string, id: string, expected_version: integer }
type Result = { id: string, version: integer, replayed: boolean? }
type Entry = {
    id: string, item_id: string, person_id: string, version: integer, minutes: integer,
    work_date: string, sprint_id: string?, note: string?,
}
type Receipt = { id: string, version: integer, hash: string, item_id: string }
type Position = { board_id: string, attachment_id: string }
return { Create = Create, Edit = Edit, Delete = Delete, Result = Result, Entry = Entry, Receipt = Receipt, Position = Position }
