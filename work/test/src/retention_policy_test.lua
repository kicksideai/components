-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")
local uuid = require("uuid")
local tables = require("tables")
local race = require("race")
local M = {}
local OLD = "2000-01-01T00:00:00.000000000Z"

local count = steps.count_rows

local function set_count(board_id: string, item_id: string): integer
    local db = assert(store.open())
    local rows = assert(db:query("SELECT COUNT(*) AS n FROM " .. tables.names(board_id).set .. " WHERE item_id = $1", { item_id }))
    db:release()
    return tonumber(rows[1].n) :: integer
end

local sweep = steps.retention_sweep

local function define()
    test.describe("board retention policy", function()
        test.it("indexes every retained row class by board and eligibility timestamp", function()
            local db = assert(store.open())
            local query = db:type() == "postgres" and "SELECT indexname AS name, indexdef AS definition FROM pg_indexes WHERE schemaname = current_schema()"
                or "SELECT name, sql AS definition FROM sqlite_master WHERE type = 'index' AND sql IS NOT NULL"
            local indexes = assert(db:query(query, {}))
            db:release()
            local definitions: { [string]: string } = {}
            for _, index in ipairs(indexes) do definitions[index.name :: string] = index.definition :: string end
            for _, class in ipairs({
                { name = "item_expiry", column = "life, life_at", predicate = "life" },
                { name = "key_alias_expiry", column = "at" },
                { name = "change_at", column = "at" },
                { name = "interval_expiry", column = "ended_at", predicate = "ended_at" },
                { name = "generation_expiry", column = "applied_at" },
                { name = "receipt_expiry", column = "at" },
                { name = "operation_expiry", column = "(substr", predicate = "status" },
            }) do
                local definition = definitions["kickside_work_" .. class.name]
                test.not_nil(definition, class.name)
                test.is_true(definition:gsub("%(+", "("):find("(board_id, " .. class.column, 1, true) ~= nil, definition)
                if class.predicate then
                    test.is_true(definition:find("WHERE", 1, true) ~= nil, definition)
                    test.is_true(definition:find(class.predicate, 1, true) ~= nil, definition)
                end
            end
        end)

        test.it("preserves a restore accepted after the retention scan and before purge acceptance", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "Restored" })
            test.eq(steps.one(h, { op = "delete", item = id }).status, "applied")
            local db = assert(store.open())
            assert(db:execute("UPDATE kickside_work_item SET life_at = $1 WHERE board_id = $2", { OLD, h.id }))
            db:release()
            race.seed(h.id, id)
            sweep(function(): boolean return race.fired(h.id) end)
            assert(h.call("settle", {}))
            local got = assert(h.call("get", { item = { id = id } })).item
            test.eq(got.life, "live")
            test.eq(got.values.title, "Restored")
            for _, event in ipairs(steps.events(h)) do test.is_true(event.type ~= "kickside.work.events:item.purged") end
        end)

        test.it("purges expired trash through a trusted version-checked event and preserves live items", function()
            local h = fixture.board()
            assert(h.call("apply_schema", { declaration = { policy = { trash_days = 1 }, fields = { { code = "labels", form = "text", cardinality = "set", index = "key" } } } }))
            local labels: { string } = {}
            for i = 1, 105 do labels[i] = "tag" .. i end
            local expired = steps.create(h, "task", { title = "Expired", labels = labels })
            local live = steps.create(h, "task", { title = "Live" })
            test.eq(steps.one(h, { op = "comment", item = expired, body = "Owned" }).status, "applied")
            test.eq(steps.one(h, { op = "link", item = expired, type = "blocks", target = { item = live } }).status, "applied")
            test.eq(steps.one(h, { op = "delete", item = expired }).status, "applied")
            local version = steps.version(h, expired)
            local db = assert(store.open())
            assert(db:execute("UPDATE kickside_work_item SET life_at = $1 WHERE board_id = $2 AND item_id = $3", { OLD, h.id, expired }))
            assert(db:execute("UPDATE kickside_work_retention SET board_after = $1, inclusive = 0, item_after = '', deadline_ms = NULL WHERE owner_id = 'work'", { h.id }))
            db:release()
            sweep(function(): boolean
                assert(h.call("settle", {}))
                return count("kickside_work_item", h.id, " AND life = 'purged'") == 1
            end)
            local event = steps.events(h)
            local found = false
            for _, e in ipairs(event) do
                if e.type == "kickside.work.events:item.purged" then found = true; test.eq(e.body.item, expired) end
            end
            test.is_true(found)
            db = assert(store.open())
            local item = assert(store.item(db, h.id, expired))
            db:release()
            test.is_true(set_count(h.id, expired) > 0, "purge keeps excess generated set rows for bounded collection")
            test.eq(item.version, version + 1)
            test.is_nil(next(item.document))
            test.eq(assert(h.call("get", { item = { id = live } })).item.values.title, "Live")
            sweep(function(): boolean
                return count("kickside_work_comment", h.id) == 0 and count("kickside_work_link", h.id) == 0 and set_count(h.id, expired) == 0
            end)
        end)

        test.it("prunes audit intervals and tombstones by board windows and advances the feed floor", function()
            local h = fixture.board()
            assert(h.call("apply_schema", { declaration = { policy = { trash_days = 1, audit_days = 1, interval_days = 1, tombstone_days = 1 } } }))
            local id = steps.create(h, "task", { title = "Old" })
            local cursor = assert(h.call("list_changes", {})).next
            test.eq(steps.one(h, { op = "delete", item = id }).status, "applied")
            local db = assert(store.open())
            assert(db:execute("UPDATE kickside_work_item SET life_at = $1 WHERE board_id = $2", { OLD, h.id }))
            assert(db:execute("UPDATE kickside_work_change SET at = $1 WHERE board_id = $2", { OLD, h.id }))
            assert(db:execute("UPDATE kickside_work_interval SET started_at = $1, ended_at = $1 WHERE board_id = $2", { OLD, h.id }))
            assert(db:execute("UPDATE kickside_work_retention SET board_after = $1, inclusive = 0, item_after = '', deadline_ms = NULL WHERE owner_id = 'work'", { h.id }))
            db:release()
            sweep(function(): boolean
                assert(h.call("settle", {}))
                return count("kickside_work_item", h.id, " AND life = 'purged'") == 1
            end)
            db = assert(store.open())
            local item = assert(store.item(db, h.id, id))
            assert(db:execute("UPDATE kickside_work_item SET life_at = $1 WHERE board_id = $2", { OLD, h.id }))
            db:release()
            sweep(function(): boolean return count("kickside_work_item", h.id) == 0 end)
            db = assert(store.open())
            local board = assert(store.board(db, h.id))
            db:release()
            test.eq(board.tombstone_floor_seq, item.updated_seq)
            test.eq(count("kickside_work_interval", h.id), 0)
            test.eq(count("kickside_work_change", h.id, " AND at = '" .. OLD .. "'"), 0)
            test.eq(assert(h.call("list_changes", { cursor = cursor })).gap.floor, item.updated_seq)
        end)

        test.it("advances a durable orphan cursor beyond a full page of blocked prefixes", function()
            local h = fixture.board()
            assert(h.call("delete", {}))
            steps.deleted(h.id)
            local db = assert(store.open())
            local seeded: { string } = {}
            for i = 1, 101 do
                local prefix = "0" .. string.format("%03d", i) .. fixture.fresh_prefix()
                seeded[#seeded + 1] = prefix
                assert(db:execute("INSERT INTO kickside_work_prefix (prefix, board_id, claimed_seq, claim_version) VALUES ($1, $2, 1, 1)", { prefix, uuid.v4() }))
            end
            db:release()
            sweep(function(): boolean return count("kickside_work_prefix", h.id) == 0 end)
            db = assert(store.open())
            for _, prefix in ipairs(seeded) do assert(db:execute("DELETE FROM kickside_work_prefix WHERE prefix = $1", { prefix })) end
            db:release()
            test.eq(count("kickside_work_prefix", h.id), 0)
        end)

        test.it("bounds teardown pages and keeps the board shell until every owned row is gone", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "T" })
            local db = assert(store.open())
            for i = 1, 121 do
                assert(db:execute([[INSERT INTO kickside_work_comment (board_id, comment_id, item_id, body, mentions, author, version, deleted, created_at)
                    VALUES ($1, $2, $3, 'body', '[]', 'test', 1, 0, $4)]], { h.id, tostring(i), id, OLD }))
            end
            db:release()
            local before = count("kickside_work_comment", h.id)
            local out, err = h.call("delete", {})
            test.is_nil(err, steps.detail(err))
            test.is_true(out.success)
            test.is_true(out.in_progress)
            test.is_true(out.cleanup_pending)
            test.is_true(before - count("kickside_work_comment", h.id) <= 100)
            test.eq(count("kickside_work_board", h.id), 1)
            test.is_true(count("kickside_work_comment", h.id) > 0)
            steps.deleted(h.id)
            test.eq(count("kickside_work_board", h.id), 0)
            db = assert(store.open())
            local names = tables.names(h.id)
            local query = db:type() == "postgres" and "SELECT tablename AS name FROM pg_tables WHERE tablename = $1"
                or "SELECT name FROM sqlite_master WHERE type='table' AND name = $1"
            local rows = assert(db:query(query, { names.item }))
            db:release()
            test.eq(#rows, 0)
        end)
    end)
end
return { run = test.run_cases(define) }
