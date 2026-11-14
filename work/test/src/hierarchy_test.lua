-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Subtree validation and set-based descendant path rewrites.
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local rows = require("rows")
local store = require("store")
local materializer = require("materializer")
local domain = require("domain")

type Map = { [string]: unknown }

local function define()
    test.describe("descendant lifecycle acceptance", function()
        test.it("accepts one fenced lifecycle change across many descendant subjects", function()
            local h = fixture.board()
            local root = steps.create(h, "task")
            local ops = {}
            for _ = 1, 30 do ops[#ops + 1] = { op = "create", type = "task", parent = root } end
            local children = assert(steps.apply(h, ops)).outcomes
            test.eq(steps.one(h, { op = "delete", item = root }).status, "applied")
            for _, child in ipairs(children) do
                local item = assert(steps.get(h, child.item)).item
                test.eq(item.life, "trashed")
                test.eq(item.version, 2)
            end
        end)
        test.it("deletes and restores overlapping subtrees in one atomic command", function()
            local h = fixture.board()
            local parent = steps.create(h, "task")
            local child = steps.create(h, "task", nil, parent)
            local out = assert(steps.apply(h, {
                { op = "delete", item = parent },
                { op = "restore", item = child },
            }))
            test.is_false(out.applied)
            test.eq(out.outcomes[2].findings[1].code, "parent_trashed")
            local restored = assert(steps.apply(h, {
                { op = "delete", item = parent },
                { op = "restore", item = parent },
                { op = "set", item = child, values = { title = "restored" } },
            }))
            test.is_true(restored.applied)
            test.eq(steps.version(h, parent), 3)
            test.eq(steps.version(h, child), 4)
            test.eq(assert(steps.get(h, child)).item.values.title, "restored")
            test.eq(assert(steps.get(h, child)).item.life, "live")
        end)
        test.it("versions descendants and prepares later edits against their trashed state", function()
            local h = fixture.board()
            local parent = steps.create(h, "task")
            local child = steps.create(h, "task", { title = "child" }, parent)
            local out = assert(steps.apply(h, { { op = "delete", item = parent }, { op = "set", item = child, values = { title = "edit" } } }))
            test.is_false(out.applied)
            test.eq(out.outcomes[2].findings[1].code, "item_trashed")
            test.eq(steps.one(h, { op = "delete", item = parent }).status, "applied")
            test.eq(steps.version(h, child), 2)
            test.eq(steps.one(h, { op = "restore", item = parent }).status, "applied")
            test.eq(steps.version(h, child), 3)
        end)
    end)

    test.describe("hierarchy bounds", function()
        test.it("checks allowed parent types and counts the depth of a moved subtree", function()
            local h = fixture.board()
            local epic = steps.create(h, "epic")
            local story = steps.create(h, "story", nil, epic)
            local chain: { string } = { story }
            for _ = 1, 3 do chain[#chain + 1] = steps.create(h, "task", nil, chain[#chain]) end
            test.eq(steps.one(h, { op = "create", type = "task", parent = chain[4] }).status, "invalid")
            test.eq(steps.one(h, { op = "create", type = "epic", parent = story }).status, "invalid")
            test.eq(steps.one(h, { op = "parent", item = story, parent = chain[2] }).status, "invalid")
            local root = steps.create(h, "task")
            local child = steps.create(h, "task", nil, root)
            test.eq(steps.one(h, { op = "parent", item = root, parent = chain[3] }).status, "invalid")
            test.eq(steps.one(h, { op = "parent", item = root, parent = child }).status, "invalid")
            test.eq(steps.one(h, { op = "parent", item = root, parent = chain[2] }).status, "applied")
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_item WHERE board_id = $1 AND item_id = $2 AND path = $3",
                { h.id, child, "/" .. epic .. "/" .. story .. "/" .. chain[2] .. "/" .. root .. "/" .. child .. "/" }), 1)
        end)

        test.it("prepares later ops against descendant paths moved earlier in the command", function()
            local h = fixture.board()
            local root, target = steps.create(h, "task"), steps.create(h, "task")
            local leaf = root
            for _ = 1, 3 do leaf = steps.create(h, "task", nil, leaf) end
            local result = assert(steps.apply(h, {
                { op = "set", item = leaf, values = {} },
                { op = "parent", item = root, parent = target },
                { op = "create", type = "task", parent = leaf },
            }))
            test.eq(result.outcomes[3].status, "invalid")
            test.eq(result.outcomes[3].findings[1].code, "depth")
            test.is_nil(assert(steps.get(h, root)).item.parent)
        end)

        test.it("refuses a subtree beyond 5000 rows and accepts the boundary", function()
            local h = fixture.board()
            local root, target = steps.create(h, "task"), steps.create(h, "task")
            local db = assert(store.open())
            local tx = assert(db:begin())
            for i = 1, 5000 do
                local id = "descendant-" .. i
                assert(tx:execute([[INSERT INTO kickside_work_item (board_id, item_id, number, type, state, category, process_generation, visit,
                    parent_id, path, rank, version, life, document, created_seq, updated_seq, created_at, updated_at)
                    SELECT board_id, $1, $2, type, state, category, process_generation, visit, item_id, path || $1 || '/', rank, version, life, document,
                    created_seq, updated_seq, created_at, updated_at FROM kickside_work_item WHERE board_id = $3 AND item_id = $4]], { id, i + 2, h.id, root }))
            end
            assert(tx:commit())
            db:release()
            local refused = steps.one(h, { op = "parent", item = root, parent = target })
            test.eq(refused.status, "invalid")
            test.eq((refused.findings :: { Map })[1].code, "subtree_too_large")
            local db2 = assert(store.open())
            assert(db2:execute("DELETE FROM kickside_work_item WHERE board_id = $1 AND item_id = 'descendant-5000'", { h.id }))
            db2:release()
            test.eq(steps.one(h, { op = "parent", item = root, parent = target }).status, "applied")
            test.eq(rows.scalar("SELECT COUNT(*) AS n FROM kickside_work_item WHERE board_id = $1 AND path LIKE $2", { h.id, "/" .. target .. "/" .. root .. "/%" }), 5000)
        end)

        test.it("counts affected descendants toward the fold batch budget", function()
            local h = fixture.board()
            local root, target = steps.create(h, "task"), steps.create(h, "task")
            local child = steps.create(h, "task", nil, root)
            steps.create(h, "task", nil, child)
            local db = assert(store.open())
            local board = assert(store.board(db, h.id))
            local first = board.applied_seq + 1
            local events: { domain.RawEvent } = {
                { seq = first, type = "kickside.work.events:item.parented", body = { item = root, parent = target } },
                { seq = first + 1, type = "kickside.work.events:item.changed", body = { item = target, patch = {} } },
            }
            local tx = assert(db:begin())
            local folded = assert(materializer.fold(tx, db:type(), h.id, events, first + 1, 3))
            tx:rollback()
            test.eq(folded.last_seq, first)
            db:release()
        end)

        test.it("revalidates depth and cycles when earlier prepared moves change the tree", function()
            local h = fixture.board()
            local a, b = steps.create(h, "task"), steps.create(h, "task")
            local chain = a
            for _ = 1, 3 do chain = steps.create(h, "task", nil, chain) end
            local db = assert(store.open())
            local board = assert(store.board(db, h.id))
            local first = board.applied_seq + 1
            local events: { domain.RawEvent } = {
                { seq = first, type = "kickside.work.events:item.parented", body = { item = b, parent = chain } },
                { seq = first + 1, type = "kickside.work.events:item.parented", body = { item = a, parent = b } },
            }
            local tx = assert(db:begin())
            assert(materializer.fold(tx, db:type(), h.id, events, first + 1, 5000))
            local loaded = assert(store.item(tx, h.id, a))
            test.is_nil(loaded.parent_id)
            tx:rollback()
            db:release()
        end)
    end)
end

return { run = test.run_cases(define) }
