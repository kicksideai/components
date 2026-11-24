-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Exercises the Work, component and thread contracts under the fixture session.
local contract = require("contract")
local security = require("security")
local component = require("component")
local component_envelope = require("component_envelope")

type Map = { [string]: unknown }

local function open(id: string)
    local definition = assert(contract.get(id))
    local acting = assert(definition:with_actor(security.actor()))
    local scoped = assert(acting:with_scope(security.scope()))
    return assert(scoped:open())
end

local function run(input: Map): (unknown, error?)
    local op = input.op :: string
    local id = input.board_id :: string?
    local request = (input.request or {}) :: Map
    if op == "events" then
        return open("kickside.core:threads"):list_events({
            thread_id = id, from_seq = 1, ascending = true, limit = 1000,
        })
    end
    if op == "append" then
        return open("kickside.core:threads"):append_events(request)
    end
    if op == "settle" then
        return open("kickside.core:threads"):catch_up_projection({
            thread_id = id, kind = "kickside.work:board_model", max_ticks = 1000,
        })
    end
    if op == "catch_up_projection" then
        return open("kickside.core:threads"):catch_up_projection(request)
    end
    if op == "grant" then
        return assert(component.get_service()):grant_subtree({
            root_component_id = id,
            subject = { subject_id = request.subject_id, subject_type = "user" },
            access_mask = request.mask,
        })
    end
    if op == "revoke" then
        return assert(component.get_service()):revoke_subtree({
            root_component_id = id,
            subject = { subject_id = request.subject_id, subject_type = "user" },
        })
    end
    if op == "delete" then
        local service, err = component.get_service()
        if err or not service then return nil, err end
        local result, delete_err = service:delete({ component_id = id, child_policy = request.child_policy })
        if delete_err then return nil, delete_err end
        local failure = component_envelope.error_of(result, "delete")
        if failure then return nil, failure end
        return result
    end

    if id then request.board_id = id end
    local board = open("kickside.work:board")
    return board[op](board, request)
end

return { run = run }
