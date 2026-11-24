-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Typed shortcuts for harness tests: one-op commands and item reads.
local funcs = require("funcs")
local json = require("json")
local sql = require("sql")
local time = require("time")
local domain = require("domain")
local fixture = require("fixture")
local lifecycle = require("lifecycle")

local M = {}

type Map = { [string]: unknown }
type PluginView = domain.PluginView
M.PluginView = PluginView

-- detail renders an error with its details for assertion messages.
function M.detail(err: unknown): string
    if err == nil then return "no error" end
    return tostring(err) .. " " .. json.encode((err :: error):details() or {})
end

function M.call(h: fixture.Handle, method: string, input: unknown): Map
    local out, err = h.call(method, input)
    assert(not err and out, M.detail(err))
    return out :: Map
end

-- wait_for polls a condition every 100ms for a minute and fails the test with what it waited for.
function M.wait_for(what: string, check: () -> boolean)
    for _ = 1, 600 do
        if check() then return end
        time.sleep("100ms")
    end
    error("timed out waiting for " .. what, 0)
end

-- A board behind the retention cursor becomes visible in the next complete sweep.
function M.retention_sweep(check: () -> boolean)
    local completed = 0
    repeat
        local result, err = funcs.call("kickside.work.retention:owner", {})
        assert(not err and result, M.detail(err))
        assert(result.success == true, M.detail(result.error))
        if check() then return end
        if result.needs_continue ~= true then completed = completed + 1 end
    until completed == 2
    error("retention does not reach the declared result after a complete sweep", 0)
end

local function component_exists(id: string): boolean
    local db = assert(sql.get("app:db"))
    local rows, err = db:query("SELECT component_id FROM kickside_components WHERE component_id = $1", { id })
    db:release()
    assert(rows and not err, M.detail(err))
    return #rows ~= 0
end

function M.deleted(id: string, what: string?)
    M.wait_for(what or "component deletion", function(): boolean return not component_exists(id) end)
end

function M.reaped(board: fixture.Handle, attachment: string)
    M.deleted(board.id, "owner board deletion")
    -- The board's delete callback has committed the lifecycle report.
    local result = M.call(board, "catch_up_projection", { thread_id = lifecycle.thread_id(), kind = "lifecycle.reap" })
    assert(result.done == true, "the lifecycle reaper did not reach the deletion report")
    assert(not component_exists(attachment), "an owned attachment remains after lifecycle reaping")
end

-- apply runs one command and returns its result.
function M.apply(h: fixture.Handle, ops: { Map }, extra: Map?): (Map?, error?)
    local request: Map = { ops = ops }
    for k, v in pairs(extra or {}) do request[k] = v end
    local out, err = h.call("apply", request)
    return out :: Map?, err
end

-- one applies a single op and returns its outcome, failing the test on a command error.
function M.one(h: fixture.Handle, op: Map): Map
    local out, err = M.apply(h, { op })
    assert(not err and out, M.detail(err))
    local outcomes = out.outcomes :: { Map }
    return outcomes[1] :: Map
end

-- create makes one item and returns its id.
function M.create(h: fixture.Handle, type_id: string, values: Map?, parent: string?): string
    local o = M.one(h, { op = "create", type = type_id, values = values or {}, parent = parent })
    assert(o.status == "applied", json.encode(o))
    return o.item :: string
end

-- get reads an item by id, with the given includes.
function M.get(h: fixture.Handle, id: string, include: { string }?): (Map?, error?)
    local out, err = h.call("get", { item = { id = id }, include = include })
    return out :: Map?, err
end

return M
