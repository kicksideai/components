-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Key prefixes: claims are decided on the installation registry before a schema event
-- is appended, renames touch two rows whatever the item count, keys derive from prefix
-- and number, and a purged board frees its prefixes.
local test = require("test")
local time = require("time")
local channel = require("channel")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")
local funcs = require("funcs")

type Map = { [string]: unknown }

local function count(statement: string, params: { unknown }): integer
    local db = assert(store.open())
    local rows = assert(db:query(statement, params))
    db:release()
    return math.tointeger(tonumber(rows[1].n)) :: integer
end

-- apply_schemas runs one apply_schema per board at once and returns result and error per board.
local function apply_schemas(boards: { fixture.Handle }, declaration: Map): { { result: Map?, err: error? } }
    local pending = {}
    for i, h in ipairs(boards) do
        local cmd, err = h.executor:async("app:work_call", { op = "apply_schema", board_id = h.id, request = { declaration = declaration } })
        assert(not err, tostring(err))
        pending[i] = cmd
    end
    local out = {}
    for i, cmd in ipairs(pending) do
        local deadline = time.after("120s")
        local selected = channel.select({ cmd:response():case_receive(), deadline:case_receive() })
        assert(selected.channel ~= deadline, "apply_schema timed out")
        local payload, err = cmd:result()
        if err then
            out[i] = { err = err }
        else
            local data, derr = payload:data()
            assert(not derr, tostring(derr))
            out[i] = { result = data :: Map }
        end
    end
    return out
end

local function bulk_create(h: fixture.Handle, total: integer)
    local made = 0
    while made < total do
        local ops: { Map } = {}
        for _ = 1, math.min(200, total - made) do ops[#ops + 1] = { op = "create", type = "task", values = { title = "T" } } end
        local out, err = steps.apply(h, ops)
        assert(not err and out, steps.detail(err))
        made = made + #ops
    end
end

local function define()
    test.describe("prefix claims", function()
        test.it("lets exactly one of two boards claim a prefix applied at once and keeps both projections folding", function()
            for round = 1, 3 do
                local a = fixture.board({ bare = true })
                local b = fixture.board({ bare = true })
                local declaration = fixture.declaration(fixture.fresh_prefix())
                local results = apply_schemas({ a, b }, declaration)
                local applied, taken = 0, 0
                for _, r in ipairs(results) do
                    if r.err then
                        test.eq((r.err :: error):kind(), errors.INVALID, "round " .. round)
                        test.eq((r.err :: error):details().code, "key_prefix_taken", "round " .. round)
                        taken = taken + 1
                    else
                        applied = applied + 1
                    end
                end
                test.eq(applied, 1, "round " .. round)
                test.eq(taken, 1, "round " .. round)
                for _, h in ipairs({ a, b }) do
                    local caught, err = h.call("settle", {})
                    test.is_nil(err, steps.detail(err))
                    test.is_true((caught :: Map).done == true, "projection caught up")
                end
            end
        end)

        test.it("refuses a prefix a board holds and frees every prefix it held once the board is deleted and released", function()
            local holder = fixture.board()
            local renamed = fixture.fresh_prefix()
            assert(holder.call("apply_schema", { declaration = fixture.declaration(renamed) }))
            local first = fixture.board({ bare = true })
            local second = fixture.board({ bare = true })
            for _, prefix in ipairs({ holder.prefix, renamed }) do
                local _, err = first.call("apply_schema", { declaration = fixture.declaration(prefix) })
                test.not_nil(err)
                test.eq((err :: error):details().code, "key_prefix_taken")
            end
            local _, derr = holder.call("delete", {})
            test.is_nil(derr, steps.detail(derr))
            steps.deleted(holder.id)
            assert(funcs.call("kickside.work.retention:owner", {}).success)
            local applied, aerr = first.call("apply_schema", { declaration = fixture.declaration(holder.prefix) })
            test.is_nil(aerr, steps.detail(aerr))
            test.eq((applied :: Map).generation, 1)
            local other, oerr = second.call("apply_schema", { declaration = fixture.declaration(renamed) })
            test.is_nil(oerr, steps.detail(oerr))
            test.eq((other :: Map).generation, 1)
            test.eq(count("SELECT COUNT(*) AS n FROM kickside_work_prefix WHERE prefix = $1 AND board_id = $2", { holder.prefix, first.id }), 1)
        end)

        test.it("keeps every prefix a board claimed so a renamed board cannot lose the old one", function()
            local h = fixture.board()
            local fresh = fixture.fresh_prefix()
            assert(h.call("apply_schema", { declaration = fixture.declaration(fresh) }))
            local squatter = fixture.board({ bare = true })
            local _, err = squatter.call("apply_schema", { declaration = fixture.declaration(h.prefix) })
            test.not_nil(err)
            test.eq((err :: error):details().code, "key_prefix_taken")
            assert(h.call("apply_schema", { declaration = fixture.declaration(h.prefix) }))
            test.eq(count("SELECT COUNT(*) AS n FROM kickside_work_prefix WHERE board_id = $1", { h.id }), 2)
        end)

        test.it("denies a claim from a member outside the work administrator group", function()
            local h = fixture.board({ bare = true, member_only = true })
            local _, err = h.call("apply_schema", { declaration = fixture.declaration(fixture.fresh_prefix()) })
            test.not_nil(err)
            test.eq((err :: error):kind(), errors.PERMISSION_DENIED)
        end)
    end)

    test.describe("key derivation", function()
        test.it("renames the prefix of a board with many items by writing two rows", function()
            local h = fixture.board()
            bulk_create(h, 500)
            local last = steps.create(h, "task", { title = "Last" })
            local before = assert(h.call("get", { item = { id = last } })).as_of
            local fresh = fixture.fresh_prefix()
            assert(h.call("apply_schema", { declaration = fixture.declaration(fresh) }))
            test.eq(count("SELECT COUNT(*) AS n FROM kickside_work_item WHERE board_id = $1 AND updated_seq > $2", { h.id, before }), 0)
            test.eq(count("SELECT COUNT(*) AS n FROM kickside_work_key_alias WHERE board_id = $1", { h.id }), 0)
            test.eq(count("SELECT COUNT(*) AS n FROM kickside_work_prefix WHERE board_id = $1", { h.id }), 2)
            local old = assert(h.call("get", { item = { key = h.prefix .. "-501" } }))
            local new = assert(h.call("get", { item = { key = fresh .. "-501" } }))
            test.eq(old.item.id, last)
            test.eq(new.item.id, last)
            test.eq(new.item.key, fresh .. "-501")
        end)

        test.it("resolves a bare key across boards for readers only", function()
            local a = fixture.board()
            local b = fixture.board()
            local item_a = steps.create(a, "task", { title = "In A" })
            steps.create(b, "task", { title = "In B" })
            local anywhere = fixture.user(nil)
            local _, denied = anywhere("get", { item = { key = a.prefix .. "-1" } })
            test.not_nil(denied)
            test.eq((denied :: error):kind(), errors.NOT_FOUND)
            local _, missing = anywhere("get", { item = { key = fixture.fresh_prefix() .. "-1" } })
            test.not_nil(missing)
            test.eq((missing :: error):kind(), errors.NOT_FOUND)
            test.eq((denied :: error):details().code, (missing :: error):details().code)
            local reader, reader_id = fixture.user(nil)
            assert(a.call("grant", { subject_id = reader_id, mask = 1 }))
            local found = assert(reader("get", { item = { key = a.prefix .. "-1" } }))
            test.eq(found.item.id, item_a)
            local _, still = reader("get", { item = { key = b.prefix .. "-1" } })
            test.eq((still :: error):kind(), errors.NOT_FOUND)
            assert(b.call("grant", { subject_id = reader_id, mask = 1 }))
            test.eq(assert(reader("get", { item = { key = b.prefix .. "-1" } })).item.key, b.prefix .. "-1")
            test.eq(assert(reader("get", { item = { key = a.prefix .. "-1" } })).item.id, item_a)
        end)
    end)
end

return { run = test.run_cases(define) }
