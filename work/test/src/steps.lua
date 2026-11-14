-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Typed shortcuts for harness tests: one-op commands and item reads.
local json = require("json")
local time = require("time")
local sql = require("sql")
local channel = require("channel")
local funcs = require("funcs")
local fixture = require("fixture")

local M = {}

type Map = { [string]: unknown }

-- detail renders an error with its details for assertion messages.
function M.detail(err: unknown): string
    if err == nil then return "no error" end
    return tostring(err) .. " " .. json.encode((err :: error):details() or {})
end

function M.retention_run(): Map
    local out, err = funcs.call("kickside.work.retention:owner", {})
    assert(not err, M.detail(err))
    local result = out :: Map
    assert(result.success == true, M.detail(result.error))
    return result
end

function M.count_rows(name: string, board_id: string, suffix: string?): integer
    local db = assert(sql.get("app:db"))
    local rows = assert(db:query("SELECT COUNT(*) AS n FROM " .. name .. " WHERE board_id = $1" .. (suffix or ""), { board_id }))
    db:release()
    return tonumber(rows[1].n) :: integer
end

-- A fixture behind the cursor becomes visible in the next complete sweep.
function M.retention_sweep(check: (() -> boolean)?, invoke: (() -> Map)?): (integer, Map)
    local runs, completed = 0, 0
    local call = invoke or M.retention_run
    while true do
        local result = call()
        runs = runs + 1
        if check and check() then return runs, result end
        if result.needs_continue ~= true then
            if not check then return runs, result end
            completed = completed + 1
            assert(completed < 2, "retention does not reach the declared result after a complete sweep")
        end
    end
end

-- wait_for polls a condition every 100ms for a minute and fails the test with what it waited for.
function M.wait_for(what: string, check: () -> boolean)
    for _ = 1, 600 do
        if check() then return end
        time.sleep("100ms")
    end
    error("timed out waiting for " .. what, 0)
end

function M.rebuilt(id: string, kind: string)
    M.wait_for(kind .. " completion", function(): boolean
        local db = assert(sql.get("app:db"))
        local rows = assert(db:query("SELECT status FROM kickside_work_job WHERE board_id = $1 AND job_type = $2", { id, kind }))
        db:release()
        assert(#rows == 1, kind .. " demand is missing")
        return rows[1].status == "done"
    end)
end

-- deleted waits until the component deletion job has removed the board.
function M.deleted(id: string)
    M.wait_for("component deletion", function(): boolean
        local db = assert(sql.get("app:db"))
        local rows = assert(db:query("SELECT component_id FROM kickside_components WHERE component_id = $1", { id }))
        db:release()
        return #rows == 0
    end)
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

-- version is the item's current version.
function M.version(h: fixture.Handle, id: string): integer
    local out, err = M.get(h, id)
    assert(not err and out, M.detail(err))
    return (out.item :: Map).version :: integer
end

-- events lists the board's events with decoded bodies, oldest first.
function M.events(h: fixture.Handle): { Map }
    local page = assert(h.call("events", {}))
    local out: { Map } = {}
    for i, e in ipairs(page.events) do
        local body = e.body
        if type(body) == "string" then body = json.decode(body) end
        out[i] = { id = e.id, trace_context = e.trace_context, seq = e.seq, type = e.type, body = body }
    end
    return out
end

-- parallel runs the apply requests at once and returns their results in order.
function M.parallel(h: fixture.Handle, requests: { Map }): { Map }
    local pending = {}
    for i, request in ipairs(requests) do
        local cmd, err = h.executor:async("app:work_call", { op = "apply", board_id = h.id, request = request })
        assert(not err, tostring(err))
        pending[i] = cmd
    end
    local out: { Map } = {}
    for i, cmd in ipairs(pending) do
        local deadline = time.after("120s")
        local selected = channel.select({ cmd:response():case_receive(), deadline:case_receive() })
        assert(selected.channel ~= deadline, "writer timed out")
        local payload, err = cmd:result()
        assert(not err, M.detail(err))
        local result, derr = payload:data()
        assert(not derr, tostring(derr))
        out[i] = result
    end
    return out
end

return M
