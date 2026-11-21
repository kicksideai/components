-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local failure=require("failure")
-- Typed access to the Core threads contract for catalog threads. Callers open
-- the contract under the caller's actor and scope and get narrowed results.
local contract = require("contract")
local security = require("security")
local clock = require("clock")
local narrow = require("narrow")
local types = require("types")

local THREADS = "kickside.core:threads"

type Request = { [string]: unknown }
type Client = {
    retire_subjects: (self: Client, request: {thread_id: string, subjects: {string}}) -> ({thread_id: string, retired: integer}?, error?),
    find: (self: Client, request: Request) -> ({ event_count: integer }?, error?),
    prune_boundary: (self: Client, request: Request) -> ({ max_pruned_seq: integer }?, error?),
    register_projection: (self: Client, request: Request) -> (unknown, error?),
    remove_projection: (self: Client, request: Request) -> (unknown, error?),
    list_projections: (self: Client, request: Request) -> (unknown, error?),
    get_projection_cursor: (self: Client, request: Request) -> (unknown, error?),
    create: (self: Client, request: Request) -> (unknown, error?),
    ensure_thread: (self: Client, request: Request) -> (unknown, error?),
    catch_up_projection: (self: Client, request: Request) -> (unknown, error?),
    append_events: (self: Client, request: Request) -> (unknown, error?),
}
-- last_seq is the cursor position once done; it is set only once done.
type CatchUp = { done: boolean, last_seq: integer? }
-- Expect is the append guard: the thread head (every command serializes on the
-- thread) or one subject's version (commands on different subjects proceed
-- independently).
type HeadExpect = { head: integer }
type SubjectExpect = { subject: string, version: integer }
type Expect = HeadExpect | SubjectExpect

local M = {}
M.Client = Client
M.CatchUp = CatchUp
M.Expect = Expect

local function field(v: unknown, name: string): unknown
    if type(v) ~= "table" then return nil end
    return (v :: { [string]: unknown })[name]
end

function M.open(): (Client?, error?)
    local def, err = contract.get(THREADS)
    if err then return nil, errors.wrap(err, "threads contract unavailable") end
    if not def then return nil, errors.new({ details = { code = "contract_unavailable" }, kind = errors.UNAVAILABLE, message = "threads contract unavailable" }) end
    local client, oerr = def:with_actor(security.actor()):with_scope(security.scope()):open()
    if oerr then return nil, errors.wrap(oerr, "threads open failed") end
    if type(client) ~= "table" and type(client) ~= "userdata" then
        return nil, errors.new({ details = { code = "contract_unavailable" }, kind = errors.UNAVAILABLE, message = "threads open returned no client" })
    end
    return client :: Client, nil
end

-- catch_up waits until the thread's projection of kind covers the thread head
-- or the deadline passes; done reports whether it got there.
function M.catch_up(c: Client, thread_id: string, kind: string, deadline: clock.Deadline): (CatchUp?, error?)
    local result, err = c:catch_up_projection({ thread_id = thread_id, kind = kind, max_ticks = 1000, deadline = deadline.at })
    if err then return nil, errors.wrap(err, "projection catch-up failed") end
    local done = field(result, "done") == true
    local last_seq = narrow.int(field(result, "last_seq"))
    if done and not last_seq then return nil, errors.new({ details = { code = "internal" }, kind = errors.INTERNAL, message = "catch-up reported no last_seq" }) end
    return { done = done, last_seq = last_seq }, nil
end

-- append writes events atomically under expect and returns the last seq.
function M.append(c: Client, thread_id: string, events: { types.Event }, expect: Expect?): (integer?, error?)
    local appended, err = c:append_events({ thread_id = thread_id, events = events, expect = expect })
    if err then return nil, err end
    local max_seq = narrow.int(field(appended, "max_seq"))
    if not max_seq then return nil, errors.new({ details = { code = "internal" }, kind = errors.INTERNAL, message = "append returned no max_seq" }) end
    return max_seq, nil
end

-- mismatch reports whether err is the expect conflict named by reason
-- (head_mismatch or version_mismatch).
function M.mismatch(err: error, reason: string): boolean
    if err:kind() ~= errors.CONFLICT then return false end
    local details = err:details() or {}
    return details.reason == reason
end

-- create registers a component with its thread; false when it exists.
function M.create(c: Client, request: Request): (boolean, error?)
    local created, err = c:create(request)
    return created ~= nil and err == nil, err
end

-- ensure creates the thread of an existing component when it has none.
function M.ensure(c: Client, request: Request): error?
    local _, err = c:ensure_thread(request)
    return err
end

return M
