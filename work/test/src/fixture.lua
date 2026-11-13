-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Creates boards under a persisted harness actor and runs work operations as it.
local security = require("security")
local funcs = require("funcs")
local uuid = require("uuid")
local json = require("json")
local actors = require("actors")

local M = {}

M.DECLARATION = {
    key_prefix = "ENG",
    fields = {
        { code = "title", form = "text", track = true },
        { code = "estimate", form = "int", index = "number", track = true },
        { code = "assignee", type = "principal", index = "key", track = true },
        { code = "labels", form = "text", cardinality = "set" },
        { code = "priority", type = "option", options = { { id = "p0", label = "Urgent", order = 1 }, { id = "p4", label = "None", order = 9 } },
          index = "number", track = true },
        { code = "number", type = "counter" },
    },
    item_types = {
        { id = "epic", title = "Epic", process = "delivery", parent_types = {}, fields = { "title", "assignee", "priority", "number" } },
        { id = "story", title = "Story", process = "delivery", parent_types = { "epic" },
          fields = { "title", "assignee", "priority", "estimate", "labels", "number" }, inherit = { "priority" } },
        { id = "task", title = "Task", process = "delivery", parent_types = { "story", "task" }, fields = { "title", "estimate", "labels" } },
    },
    relation_types = {
        { id = "blocks", outward = "blocks", inward = "blocked by" },
        { id = "relates", outward = "relates to", inward = "relates to", symmetric = true },
        { id = "duplicates", outward = "duplicates", inward = "duplicated by", cardinality = "one" },
    },
    processes = {
        { id = "delivery", initial = "open", states = { { id = "open", name = "Open", category = "started" } } },
    },
}

local function copy(value: unknown): { [string]: unknown }
    return assert(json.decode(assert(json.encode(value)))) :: { [string]: unknown }
end

local function chain(id: string, length: integer): { [string]: unknown }
    local states, transitions = {}, {}
    for i = 0, length do states[#states + 1] = { id = "s" .. i, category = i == length and "completed" or "unstarted" } end
    for i = 0, length - 1 do
        transitions[#transitions + 1] = { id = "step" .. i, from = { "s" .. i }, to = "s" .. (i + 1), auto = true, default = true }
    end
    return { id = id, initial = "s0", states = states, transitions = transitions }
end

-- WORKFLOW_PROCESS is a human process with transitions, effects and entry requirements.
M.WORKFLOW_PROCESS = {
    id = "delivery", name = "Delivery", initial = "todo",
    states = {
        { id = "todo", name = "To do", category = "unstarted" },
        { id = "doing", name = "Doing", category = "started" },
        { id = "review", name = "Review", category = "started", require = { "estimate" } },
        { id = "done", name = "Done", category = "completed" },
        { id = "canceled", name = "Canceled", category = "canceled" },
    },
    transitions = {
        { id = "start", name = "Start", from = { "todo" }, to = "doing", require = { "assignee" },
          set = { { field = "started", value = "$now" }, { field = "closer", clear = true } } },
        { id = "to_review", name = "Review", from = { "doing" }, to = "review" },
        { id = "finish", name = "Finish", from = { "doing", "review" }, to = "done",
          set = { { field = "finished", value = "$now" }, { field = "closer", value = "$actor" }, { field = "snapshot", copy = "title" },
                  { field = "note", value = "shipped" } } },
        { id = "reopen", name = "Reopen", from = { "done", "canceled" }, to = "todo", set = { { field = "finished", clear = true } } },
        { id = "cancel", name = "Cancel", from = "any", to = "canceled" },
    },
}

-- workflow returns the reference declaration with the workflow process, the fields its effects write,
-- and two item types that run auto chains of 8 and 9 steps.
function M.workflow(prefix: string): { [string]: unknown }
    local d = M.declaration(prefix)
    local fields = d.fields :: { { [string]: unknown } }
    fields[#fields + 1] = { code = "started", form = "time" }
    fields[#fields + 1] = { code = "finished", form = "time", intervals = true }
    fields[#fields + 1] = { code = "closer", type = "principal" }
    fields[#fields + 1] = { code = "snapshot", form = "text" }
    fields[#fields + 1] = { code = "note", form = "text" }
    local item_types = d.item_types :: { { [string]: unknown } }
    for _, t in ipairs(item_types) do
        local carried = t.fields :: { string }
        for _, key in ipairs({ "started", "finished", "closer", "snapshot", "note" }) do carried[#carried + 1] = key end
        if t.id == "task" then carried[#carried + 1] = "assignee" end
    end
    item_types[1].process = "epic_flow"
    item_types[#item_types + 1] = { id = "short", process = "short_chain", parent_types = {}, fields = { "title" } }
    item_types[#item_types + 1] = { id = "long", process = "long_chain", parent_types = {}, fields = { "title" } }
    local delivery = copy(M.WORKFLOW_PROCESS)
    d.processes = { delivery, { id = "epic_flow", initial = "open", states = { { id = "open", category = "started" } } },
        chain("short_chain", 8), chain("long_chain", 9) }
    return d
end

type Call = (string, unknown) -> (unknown, error?)
type Handle = { id: string, prefix: string, actor: security.Actor, executor: unknown, call: Call }
M.Handle = Handle

local function handle_for(actor: security.Actor, board_id: string, prefix: string): Handle
    local scope = assert(security.new_scope({ assert(security.policy("app:user")) }))
    local executor = funcs.new():with_actor(actor):with_scope(scope)
    return {
        id = board_id, prefix = prefix, actor = actor, executor = executor,
        call = function(op: string, request: unknown): (unknown, error?)
            return executor:call("app:work_call", { op = op, board_id = board_id, request = request })
        end,
    }
end

-- fresh_prefix is an item key prefix no other board holds; prefixes are unique per installation.
function M.fresh_prefix(): string
    local hex = (uuid.v4()):gsub("-", ""):upper():sub(1, 8)
    return "W" .. hex
end

-- declaration returns the reference declaration under a key prefix, with a deep copy so tests may edit it.
function M.declaration(prefix: string): { [string]: unknown }
    local copy = json.decode(json.encode(M.DECLARATION)) :: { [string]: unknown }
    copy.key_prefix = prefix
    return copy
end

-- board(opts?) creates a board through the contract's create method as a fresh
-- actor (outside the work administrator group when member_only); returns a handle whose
-- call(op, request) runs as that actor.
function M.board(opts: { bare: boolean?, declaration: unknown?, member_only: boolean?, actor: security.Actor? }?): Handle
    local actor = opts and opts.actor or actors.make((uuid.v4()), opts and opts.member_only)
    local scope = assert(security.new_scope({ assert(security.policy("app:user")) }))
    local executor = funcs.new():with_actor(actor):with_scope(scope)
    local bare = opts and opts.bare == true
    local prefix = M.fresh_prefix()
    local declaration = opts and opts.declaration or M.declaration(prefix)
    if opts and opts.declaration then prefix = (opts.declaration :: { [string]: unknown }).key_prefix :: string end
    local created, cerr = executor:call("app:work_call", { op = "create",
        request = { idempotency_key = "fixture", title = "Fixture board", declaration = (not bare and not (opts and opts.actor)) and declaration or nil } })
    assert(not cerr, tostring(cerr))
    local h = handle_for(actor, created.board_id, prefix)
    if opts and opts.actor and not bare then
        local admin = handle_for(actors.real((uuid.v4()), true), h.id, prefix)
        assert(h.call("grant", { subject_id = admin.actor:id(), mask = 15 }))
        local applied, err = admin.call("apply_schema", { declaration = declaration })
        assert(not err, tostring(err))
        assert(applied.generation == 1, "schema generation")
        local owner_call = h.call
        h.call = function(op: string, request: unknown): (unknown, error?)
            if op == "apply_schema" then return admin.call(op, request) end
            return owner_call(op, request)
        end
        return h
    end
    if not bare then assert(created.generation == 1, "schema generation") end
    return h
end

-- user(h, policies?) returns a call function that runs operations on h's board (any board
-- when h is nil) as a new actor, and that actor's id. The caller's scope holds the given policies, by
-- default the permissive harness policy. A member_only actor is outside the work administrator group.
function M.user(h: Handle?, policies: { string }?, member_only: boolean?): (Call, string)
    local id = (uuid.v4())
    local actor = actors.make(id, member_only)
    local list = {}
    for _, name in ipairs(policies or { "app:user" }) do list[#list + 1] = assert(security.policy(name)) end
    local scope = assert(security.new_scope(list))
    local executor = funcs.new():with_actor(actor):with_scope(scope)
    local call = function(op: string, request: unknown): (unknown, error?)
        return executor:call("app:work_call", { op = op, board_id = h and h.id or nil, request = request })
    end
    return call, id
end

return M
