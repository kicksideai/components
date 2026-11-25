-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local uuid = require("uuid")
local time = require("time")
local json = require("json")
local events = require("events")
local types = require("types")
local thread_events = require("thread_events")

local M = {}
local MAIL_LIBRARY_NS = "a64c0ec5-f1ec-5cc0-a9ca-50571229ba25"

local function external(author: string, op: string, command_id: string, index: integer): types.ThreadExternal
    return {external_source = "actor:" .. author, external_version = "1",
        external_id = uuid.v5(MAIL_LIBRARY_NS, events.external_name(op, command_id, index))}
end

function M.find_command(threads: types.LibraryThreads, author: string, op: string, command_id: string,
    event_type: string): (types.ThreadEvent?, error?)
    local id = external(author, op, command_id, 1)
    local result, err = threads:find_event_by_external({thread_id = thread_events.library_thread_id(), event_type = event_type,
        external_source = id.external_source, external_id = id.external_id, external_version = id.external_version})
    if err then return nil, err end
    return result.event, nil
end

function M.replay(threads: types.LibraryThreads, author: string, op: string, command_id: string, event_type: string,
    signature: string, count: integer): (integer?, error?)
    local event, err = M.find_command(threads, author, op, command_id, event_type)
    if err or not event then return nil, err end
    local body, decode_err = json.decode(event.body)
    if decode_err then return nil, decode_err end
    if body.command_hash ~= signature then
        return nil, errors.new({kind = errors.CONFLICT, message = "Command ID already identifies another Mail library edit",
            details = {code = "mail_command_id_conflict"}})
    end
    return event.seq + count - 1, nil
end

function M.append(threads: types.LibraryThreads, author: string, op: string, command_id: string, expect: types.ThreadExpect, batch: {types.LibraryEvent}): (types.ThreadAppend?, error?)
    for i, event in ipairs(batch) do event.external = external(author, op, command_id, i) end
    return threads:append_events({thread_id = thread_events.library_thread_id(), expect = expect, events = batch})
end

function M.catch_up(threads: types.LibraryThreads, target: integer): (boolean?, error?)
    if target == 0 then return true, nil end
    local result, err = threads:catch_up_projection({
        thread_id = thread_events.library_thread_id(), kind = "kickside.mail:library_tables", target_seq = target,
        deadline = time.now():add(5 * time.SECOND):format(time.RFC3339),
    })
    if err then return nil, err end
    return result.done, nil
end

return M
