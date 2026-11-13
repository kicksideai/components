-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local fixture = require("fixture")
local steps = require("steps")
local sql = require("sql")
local test = require("test")
type Map = { [string]: unknown }
local function call(h: fixture.Handle, method: string, input: Map): Map
    local out, err = h.call(method, input)
    assert(not err and out, steps.detail(err))
    return out :: Map
end
local function grant(source: fixture.Handle, target: fixture.Handle)
    assert(target.call("grant", { subject_id = source.actor:id(), mask = 15 }))
end
local function gate(h: fixture.Handle, release: boolean?)
    local db = assert(sql.get("app:db"))
    assert(db:execute("CREATE TABLE IF NOT EXISTS work_deferred_gate (board_id TEXT PRIMARY KEY, released INTEGER NOT NULL, arrived INTEGER NOT NULL, stop_after INTEGER NOT NULL DEFAULT 0)"))
    assert(db:execute([[INSERT INTO work_deferred_gate (board_id,released,arrived) VALUES ($1,$2,0)
        ON CONFLICT (board_id) DO UPDATE SET released = excluded.released]], { h.id, release and 1 or 0 }))
    db:release()
end
local function finished(h: fixture.Handle, id: unknown): Map
    local status: Map = {}
    steps.wait_for("bulk completion", function(): boolean
        status = call(h, "bulk_status", { bulk_id = id })
        return status.status == "done" or status.status == "failed" or status.status == "cancelled"
    end)
    return status
end
local function bulk(h: fixture.Handle, key: string): Map
    return call(h, "bulk", { key = key, query = { where = { field = "estimate", op = "eq", value = 1 } },
        ops_template = { { op = "set", values = { estimate = 2 } } } })
end
local function moved(h: fixture.Handle, request: Map): Map
    local started = call(h, "move", request)
    local status: Map = {}
    steps.wait_for("move completion", function(): boolean
        status = call(h, "move_status", { board_id = request.board_id, move_id = started.move_id })
        return status.status == "done" or status.status == "failed"
    end)
    test.eq(status.status, "done")
    return status
end
local function move_request(target: fixture.Handle, id: string, key: string): Map
    return { item = id, to_board = target.id, key = key, map = { type = {}, state = {}, fields = {}, relations = {} } }
end
local function page_gate(h: fixture.Handle, interrupt: boolean)
    local db = assert(sql.get("app:db"))
    assert(db:execute("CREATE TABLE IF NOT EXISTS work_bulk_page_gate (board_id TEXT PRIMARY KEY, arrived INTEGER NOT NULL, released INTEGER NOT NULL, interrupt INTEGER NOT NULL)"))
    assert(db:execute("INSERT INTO work_bulk_page_gate VALUES ($1,0,$2,$3)", { h.id, interrupt and 1 or 0, interrupt and 1 or 0 }))
    db:release()
end
local owned: { fixture.Handle } = {}
local function board(options: { bare: boolean?, declaration: unknown?, member_only: boolean? }?): fixture.Handle
    local h = fixture.board(options)
    owned[#owned + 1] = h
    return h
end
local function cleanup()
    for _, h in ipairs(owned) do
        assert(h.call("delete", {}))
        steps.deleted(h.id)
    end
    if #owned > 0 then
        steps.retention_sweep(function(): boolean
            local db = assert(sql.get("app:db"))
            local remaining = 0
            for _, h in ipairs(owned) do
                local rows = assert(db:query("SELECT COUNT(*) AS n FROM kickside_work_prefix WHERE board_id = $1", { h.id }))
                remaining = remaining + (tonumber(rows[1].n) :: integer)
            end
            db:release()
            return remaining == 0
        end)
    end
    owned = {}
end
return { board = board, cleanup = cleanup, page_gate = page_gate, call = call, grant = grant, gate = gate, finished = finished, bulk = bulk, moved = moved, move_request = move_request }
