-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local database = require("database")
local history = require("history_repo")
local keyset = require("keyset")
local live = require("live_repo")
local resource = require("resource")
local thread_events = require("thread_events")
local types = require("types")

local M = {}

local function metadata(row: types.HistoryRow): types.HistoryItem
    return {seq = row.seq, kind = row.kind, name = row.name, version = row.version, action = row.action,
        restored_from = row.restored_from, note = row.note, author = row.author, created_at = row.at}
end

function M.page(input: types.LibraryHistoryRequest): (types.LibraryHistoryPage?, error?)
    local bad = resource.check_key(input)
    if bad then return nil, bad end
    local limit, cursor, page_err = keyset.args(input)
    if page_err then return nil, page_err end
    local before = cursor and math.tointeger(tonumber(cursor)) or nil
    if cursor and (not before or before < 1) then
        return nil, resource.error(errors.INVALID, "invalid_mail_filter", "Use the next cursor from a library history page")
    end
    local api, open_err = thread_events.open()
    if open_err then return nil, open_err end
    local boundary, boundary_err = thread_events.retained_boundary(api :: types.LibraryThreads)
    if boundary_err then return nil, boundary_err end
    local size = limit :: integer
    return database.with_db(function(ex: types.Executor): (types.LibraryHistoryPage?, error?)
        local mark, mark_err = live.get(ex)
        if mark_err then return nil, mark_err end
        local rows, err = history.page(ex, input, size + 1, boundary :: integer, before)
        if err then return nil, err end
        local items: {types.HistoryItem} = {}
        for i = 1, math.min(size, #rows) do items[i] = metadata(rows[i] :: types.HistoryRow) end
        return {items = items, library_seq = mark.projected_seq :: integer,
            next_cursor = #rows > size and tostring(items[size].seq) or nil}, nil
    end)
end

function M.revision(key: types.ResourceKey, seq: integer?, api: types.LibraryThreads?): (types.Revision?, error?)
    local bad = resource.check_key(key)
    if bad then return nil, bad end
    if type(seq) ~= "number" or not math.tointeger(seq) or seq < 1 then
        return nil, resource.error(errors.INVALID, "invalid_mail_revision", "Provide a positive event sequence", key)
    end
    if not api then
        local open_err
        api, open_err = thread_events.open()
        if open_err then return nil, open_err end
    end
    local row, read_err = database.with_db(function(ex: types.Executor): (types.HistoryRow?, error?)
        return history.get(ex, key, seq)
    end)
    if read_err then return nil, read_err end
    local event, event_err = thread_events.event_at(api :: types.LibraryThreads, seq)
    if event_err then return nil, event_err end
    if not row or event.subject ~= resource.subject(key) then
        return nil, resource.error(errors.NOT_FOUND, "mail_revision_not_found", "Mail library revision was not found", key)
    end
    local detail = metadata(row) :: types.Revision
    if row.action == "archived" or row.action == "deleted" then return detail, nil end
    local item, err = thread_events.event_resource(event :: types.ThreadEvent)
    if err then return nil, err end
    detail.state, detail.origin, detail.content = item.state, item.origin, (item :: unknown) :: types.ResourceContent
    return detail, nil
end

function M.restore_source(key: types.ResourceKey, seq: integer, api: types.LibraryThreads?): (types.Resource?, error?)
    local detail, err = M.revision(key, seq, api)
    if err then return nil, err end
    if not detail.content then
        return nil, resource.error(errors.INVALID, "mail_revision_unrestorable", "This History event has no restorable content", key)
    end
    return detail.content :: types.Resource, nil
end

return M
