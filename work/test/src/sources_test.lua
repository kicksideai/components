-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local registry = require("registry")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")
type Map = { [string]: unknown }
local function pull(h: fixture.Handle, name: string, config: Map?, cursor: unknown, limit: integer?): Map
    local c: Map = { board_id = h.id }
    for k, v in pairs(config or {}) do c[k] = v end
    local out, err = h.executor:call("kickside.work.source:pull_" .. name, { config = c, cursor = cursor, limit = limit })
    assert(not err, tostring(err))
    return out :: Map
end
local function define()
    test.describe("Work pullable sources", function()
        test.it("advances durable feed documents for comment creation edits and deletion", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "Comments" })
            local cursor = assert(h.call("list_changes", {})).next
            local added = steps.one(h, { op = "comment", item = id, body = "First" })
            local page = assert(h.call("list_changes", { cursor = cursor }))
            test.eq(#page.items, 1); test.eq(page.items[1].item_id, id)
            test.eq(page.items[1].comments[1].body, "First")
            cursor = page.next
            steps.one(h, { op = "comment", item = id, comment = added.comment, body = "Edited" })
            page = assert(h.call("list_changes", { cursor = cursor }))
            test.eq(page.items[1].comments[1].body, "Edited")
            cursor = page.next
            steps.one(h, { op = "comment", item = id, comment = added.comment, delete = true })
            page = assert(h.call("list_changes", { cursor = cursor }))
            test.eq(#page.items[1].comments, 0)
        end)
        test.it("declares standalone items and changes ports with board pickers", function()
            for _, name in ipairs({ "items", "changes" }) do
                local port = assert(registry.get("kickside.work.source:" .. name .. "_port"))
                local binding = assert(registry.get(port.data.binding))
                test.eq(binding.data.contracts[1].contract, "kickside.data:pullable")
                test.eq(port.data.config_schema.board_id.class, "work_board")
                test.eq(port.data.config_schema.board_id.role, "primary")
            end
        end)
        test.it("resumes both sources, preserves stable identities and sends deletes", function()
            for _, name in ipairs({ "items", "changes" }) do
                local h = fixture.board()
                local a = steps.create(h, "task", { title = "A" })
                local b = steps.create(h, "task", { title = "B" })
                local first = pull(h, name, nil, nil, 1)
                test.is_true(first.success == true)
                test.is_true(first.has_more == true)
                local one = (first.items :: { Map })[1]
                test.eq(one.item_key, a)
                test.eq(one.op, "upsert")
                test.eq(#(one.source_version :: string), 20)
                local replay = pull(h, name, nil, nil, 1)
                test.eq(((replay.items :: { Map })[1]).dedup_key, one.dedup_key)
                local rest = pull(h, name, nil, first.next_cursor, 10)
                test.eq(#(rest.items :: { Map }), 1)
                test.eq(((rest.items :: { Map })[1]).item_key, b)
                steps.one(h, { op = "delete", item = a })
                local news = pull(h, name, nil, rest.next_cursor, 10)
                local gone = (news.items :: { Map })[1]
                test.eq(gone.item_key, a)
                test.eq(gone.op, "delete")
                test.is_nil(gone.payload)
                test.is_true((gone.source_version :: string) > (one.source_version :: string))
                test.eq(#(pull(h, name, nil, news.next_cursor, 10).items :: { Map }), 0)
            end
        end)
        test.it("items queries declared filters and retracts records that leave the selection", function()
            local h = fixture.board()
            local a = steps.create(h, "task", { title = "Selected", estimate = 1 })
            steps.create(h, "task", { title = "Other", estimate = 2 })
            local config: Map = { where = { field = "estimate", op = "eq", value = 1 } }
            local page = pull(h, "items", config, nil, 10)
            test.is_true(page.success == true)
            local upserts = 0
            for _, item in ipairs(page.items :: { Map }) do
                if item.op == "upsert" then upserts = upserts + 1; test.eq(item.item_key, a) end
            end
            test.eq(upserts, 1)
            steps.one(h, { op = "set", item = a, values = { title = "Outside", estimate = 3 } })
            local next = pull(h, "items", config, page.next_cursor, 10)
            test.eq(((next.items :: { Map })[1]).op, "delete")
        end)
        test.it("reads a filtered change selection in cursor order and retracts departing items", function()
            local h = fixture.board()
            local a = steps.create(h, "task", { title = "Selected", estimate = 1 })
            steps.create(h, "task", { title = "Other", estimate = 2 })
            local selection = { field = "estimate", op = "eq", value = 1 }
            local page, err = h.call("list_changes", { selection = selection, limit = 10 })
            test.is_nil(err, tostring(err))
            local items = page.items :: { Map }
            test.eq(items[1].item_id, a)
            test.eq(items[1].op, "upsert")
            test.eq(items[2].op, "delete")
            steps.one(h, { op = "set", item = a, values = { estimate = 3 } })
            local next = assert(h.call("list_changes", { selection = selection, cursor = page.next }))
            test.eq(next.items[1].item_id, a)
            test.eq(next.items[1].op, "delete")
            test.is_nil(next.items[1].values)
        end)
        test.it("invalidates a cursor when its selection changes and refuses nonlocal filters", function()
            local h = fixture.board()
            steps.create(h, "task", { title = "Selected", estimate = 1 })
            local first = pull(h, "items", { where = { field = "estimate", op = "eq", value = 1 } }, nil, 10)
            local changed = pull(h, "items", { where = { field = "estimate", op = "eq", value = 2 } }, first.next_cursor, 10)
            test.eq((changed.error :: Map).code, "source_gap")
            for _, where in ipairs({
                { rel = "blocks", some = { field = "estimate", op = "eq", value = 1 } },
                { field = "created_at", op = "gte", value = { ["$now"] = "-P1D" } },
            }) do
                local bad = pull(h, "items", { where = where }, nil, 10)
                test.is_false(bad.success == true)
                test.eq((bad.error :: Map).code, "source_filter_unsupported")
            end
        end)
        test.it("binds actor-dependent selections to the cursor's calling principal", function()
            local declaration = fixture.declaration(fixture.fresh_prefix())
            local fields = declaration.fields :: { Map }
            fields[1].index = "key"
            local h = fixture.board({ declaration = declaration })
            local other = fixture.board()
            assert(h.call("grant", { subject_id = other.actor:id(), mask = 1 }))
            steps.create(h, "task", { title = h.actor:id() })
            local where = { field = "title", op = "eq", value = { ["$actor"] = "id" } }
            local page = pull(h, "items", { where = where }, nil, 10)
            test.is_true(page.success == true)
            local next = assert(other.executor:call("kickside.work.source:pull_items", {
                config = { board_id = h.id, where = where }, cursor = page.next_cursor, limit = 10 }))
            test.is_false(next.success == true)
            test.eq(next.error.code, "source_gap")
        end)
        test.it("classifies tombstone gaps and missing configuration without losing native kind", function()
            local h = fixture.board()
            steps.create(h, "task", { title = "A" })
            local page = pull(h, "changes", nil, nil, 10)
            local db = assert(store.open())
            assert(db:execute("UPDATE kickside_work_board SET tombstone_floor_seq = 10000 WHERE board_id = $1", { h.id }))
            db:release()
            for _, name in ipairs({ "items", "changes" }) do
                local gap = pull(h, name, nil, page.next_cursor, 10)
                test.is_false(gap.success == true)
                test.eq((gap.error :: Map).code, "source_gap")
                test.eq((gap.error :: Map).kind, errors.CONFLICT)
                local bad = assert(h.executor:call("kickside.work.source:pull_" .. name, {}))
                test.eq(bad.error.code, "invalid_config")
                test.eq(bad.error.kind, errors.INVALID)
            end
        end)
    end)
end
return { run = test.run_cases(define) }
