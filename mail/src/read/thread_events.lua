-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local security = require("security")
local content = require("content")
local types = require("types")
local json = require("json")
local events = require("events")

local M = {library_thread_id = content.library_component_id}

function M.open(): (types.LibraryThreads?, error?)
    local actor, actor_err = security.actor()
    if actor_err then return nil, actor_err end
    local scope, scope_err = security.scope()
    if scope_err then return nil, scope_err end
    local definition, err = contract.get("kickside.core:threads")
    if err then return nil, err end
    local caller, caller_err = definition:with_actor(actor)
    if caller_err then return nil, caller_err end
    local frame, frame_err = caller:with_scope(scope)
    if frame_err then return nil, frame_err end
    local instance, open_err = frame:open()
    return instance :: types.LibraryThreads?, open_err
end

function M.head(threads: types.LibraryThreads, subject: string?): (types.ThreadHead?, error?)
    local row, err = threads:find({thread_id = M.library_thread_id(), subject = subject})
    if err then return nil, err end
    if not row then
        return nil, errors.new({kind = errors.NOT_FOUND, message = "Mail library thread is unavailable",
            details = {code = "mail_library_thread_missing"}})
    end
    return row, nil
end

function M.event_at(threads: types.LibraryThreads, seq: integer): (types.ThreadEvent?, error?)
    local page, err = threads:list_events({thread_id = M.library_thread_id(), from_seq = seq, to_seq = seq, limit = 1})
    if err then return nil, err end
    if page.source_gap or not page.events[1] then
        return nil, errors.new({kind = errors.NOT_FOUND, message = "Mail library revision is unavailable",
            details = {code = "mail_revision_pruned"}})
    end
    return page.events[1], nil
end

function M.event_resource(event: types.ThreadEvent): (types.Resource?, error?)
    local decoded, decode_err = json.decode(event.body :: string)
    if decode_err then return nil, decode_err end
    local body = decoded :: types.LibraryEventBody
    local snapshot, content_err = events.content(body)
    if content_err then return nil, content_err end
    local item = snapshot :: types.Resource
    local state = body.state or (body.origin and "customized" or "created")
    item.state, item.origin, item.origin_label = state, body.origin, body.origin_label
    item.revision, item.seq, item.author = event.subject_version, event.seq, body.author
    return item, nil
end

function M.resource_at(threads: types.LibraryThreads, seq: integer): (types.Resource?, error?)
    local event, err = M.event_at(threads, seq)
    if err then return nil, err end
    return M.event_resource(event :: types.ThreadEvent)
end

function M.retained_boundary(threads: types.LibraryThreads): (integer?, error?)
    local page, err = threads:list_events({thread_id = M.library_thread_id(), limit = 1})
    if err then return nil, err end
    return page.max_pruned_seq, nil
end

function M.prune_boundary(threads: types.LibraryThreads): ({max_pruned_seq: integer}?, error?)
    return threads:prune_boundary({thread_id = M.library_thread_id()})
end

return M
