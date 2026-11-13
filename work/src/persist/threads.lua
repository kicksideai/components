-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Typed access to the Core threads contract for board and registry threads.
-- Callers open the contract under the caller's actor and scope and get narrowed
-- results.
local contract = require("contract")
local json = require("json")
local security = require("security")
local store = require("store")
local types = require("types")

local THREADS = "kickside.core:threads"

local M = {}

local function field(v: unknown, name: string): unknown
    if type(v) ~= "table" then return nil end
    return (v :: { [string]: unknown })[name]
end

function M.open(): (types.ThreadClient?, error?)
    local def, err = contract.get(THREADS)
    if err then return nil, errors.wrap(err, "threads contract unavailable") end
    if not def then return nil, errors.new({ details = { code = "contract_unavailable" }, kind = errors.UNAVAILABLE, message = "threads contract unavailable" }) end
    local client, oerr = def:with_actor(security.actor()):with_scope(security.scope()):open()
    if oerr then return nil, errors.wrap(oerr, "threads open failed") end
    if type(client) ~= "table" and type(client) ~= "userdata" then
        return nil, errors.new({ details = { code = "contract_unavailable" }, kind = errors.UNAVAILABLE, message = "threads open returned no client" })
    end
    return client :: types.ThreadClient, nil
end

-- catch_up waits until the thread's projection of kind covers the thread head
-- or the deadline passes; done reports whether it got there.
function M.catch_up(c: types.ThreadClient, thread_id: string, kind: string, deadline: types.Deadline): (types.CatchUp?, error?)
    local result, err = c:catch_up_projection({ thread_id = thread_id, kind = kind, max_ticks = 1000, deadline = deadline.at })
    if err then return nil, errors.wrap(err, "projection catch-up failed") end
    local done = field(result, "done") == true
    local last_seq = store.int(field(result, "last_seq"))
    if done and not last_seq then return nil, errors.new({ details = { code = "row_corrupt" }, kind = errors.INTERNAL, message = "catch-up reported no last_seq" }) end
    return { done = done, last_seq = last_seq }, nil
end

-- mismatch reports whether err is the expect conflict named by reason
-- (head_mismatch or version_mismatch).
function M.mismatch(err: error, reason: string): boolean
    if err:kind() ~= errors.CONFLICT then return false end
    local details = err:details() or {}
    return details.reason == reason
end

-- find_marker narrows a Core event lookup for callers holding its read authority.
function M.find_marker(c: types.ThreadClient, thread_id: string, event_type: string, source: string, external_id: string): (types.ThreadMarker?, error?)
    local found, err = c:find_event_by_external({ thread_id = thread_id, event_type = event_type,
        external_source = source, external_id = external_id })
    if err then return nil, errors.wrap(err, "receipt lookup failed") end
    local event = field(found, "event")
    if type(event) ~= "table" then return nil, nil end
    local body = field(event, "body")
    if type(body) == "string" then
        local decoded, derr = json.decode(body)
        if derr then return nil, errors.wrap(derr, "marker event body is not JSON") end
        body = decoded
    end
    local seq = store.int(field(event, "seq"))
    if not seq then return nil, errors.new({ details = { code = "row_corrupt" }, kind = errors.INTERNAL, message = "marker event has no seq" }) end
    return { seq = seq, body = body }, nil
end

-- create registers a component with its thread.
function M.create(c: types.ThreadClient, request: types.ThreadRequest): (boolean, error?)
    local created, err = c:create(request)
    return created ~= nil and err == nil, err
end

return M
