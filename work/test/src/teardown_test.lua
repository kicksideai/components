-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Deletable teardown and the public meta a board publishes after its projection commits.
local test = require("test")
local time = require("time")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")
local funcs = require("funcs")
local observer = require("observer")

local TABLES = {
    "kickside_work_receipt", "kickside_work_visibility", "kickside_work_plugin", "kickside_work_job", "kickside_work_comment", "kickside_work_change", "kickside_work_interval", "kickside_work_link", "kickside_work_field_usage", "kickside_work_item",
    "kickside_work_generation", "kickside_work_board" }

local function rows_of(board_id: string, name: string): integer
    local db = assert(store.open())
    local rows = assert(db:query("SELECT COUNT(*) AS n FROM " .. name .. " WHERE board_id = $1", { board_id }))
    db:release()
    return math.tointeger(tonumber(rows[1].n)) :: integer
end

local function define()
    test.describe("teardown", function()
        test.it("deletes every inventory row class through the platform job alone in fenced pages of at most 100 rows", function()
            local h = fixture.board()
            local id = steps.create(h, "task", { title = "T", labels = { "a", "b" } })
            test.eq(steps.one(h, { op = "comment", item = id, body = "Owned" }).status, "applied")
            local peer = steps.create(h, "task", { title = "Peer" })
            test.eq(steps.one(h, { op = "link", item = id, type = "blocks", target = { item = peer } }).status, "applied")
            local db = assert(store.open())
            local statements = {
                [[INSERT INTO kickside_work_receipt (board_id,command_key,request_hash,principal,at,result,seq) VALUES ($1,$2,'hash','test','2000-01-01T00:00:00.000000000Z','{}',1)]],
                [[INSERT INTO kickside_work_visibility (board_id,item_id,seq,document) VALUES ($1,$2,1,'{}')]],
                [[INSERT INTO kickside_work_plugin (board_id,plugin,attachment_id,impl_id,config,active,revision,applied_revision) VALUES ($1,$2,$2,'app:work_attachment','{}',0,1,1)]],
                [[INSERT INTO kickside_work_job (board_id,job_id,job_type,key,status) VALUES ($1,$2,'rebuild','k','done')]],
                [[INSERT INTO kickside_work_comment (board_id,comment_id,item_id,body,mentions,author,version,deleted,created_at) VALUES ($1,$2,$2,'body','[]','test',1,0,'2000')]],
                [[INSERT INTO kickside_work_change (board_id,seq,n,subject,kind,actor,at) VALUES ($1,10000 + CAST($2 AS INTEGER),1,'board','fixture','test','2000')]],
                [[INSERT INTO kickside_work_interval (board_id,item_id,field_id,start_seq,value_key,started_at) VALUES ($1,$2,'state',1,'open','2000')]],
                [[INSERT INTO kickside_work_link (board_id,from_id,type,to_board_id,to_id,at,seq) VALUES ($1,$2,'blocks',$1,$2,'2000',1)]],
                [[INSERT INTO kickside_work_field_usage (board_id,field_id,items) VALUES ($1,10000 + CAST($2 AS INTEGER),0)]],
                [[INSERT INTO kickside_work_item (board_id,item_id,number,type,state,category,process_generation,visit,path,version,life,document,created_seq,updated_seq,created_at,updated_at)
                    VALUES ($1,CAST($2 AS TEXT),10000 + CAST($2 AS INTEGER),'task','open','started',1,1,'/',1,'live','{}',1,1,'2000','2000')]],
                [[INSERT INTO kickside_work_generation (board_id,generation,declaration,compiled,maps,digest,class,actor,applied_seq,applied_at)
                    SELECT $1,10000 + CAST($2 AS INTEGER),declaration,compiled,maps,digest,class,actor,applied_seq,applied_at FROM kickside_work_generation WHERE board_id=$1 AND generation=1]],
            }
            for _, statement in ipairs(statements) do
                for n = 1, 105 do
                    local result = assert(db:execute(statement, { h.id, tostring(n) }))
                    test.eq(tonumber(result.rows_affected), 1, "inventory row producer")
                end
            end
            db:release()
            for _, name in ipairs(observer.OWNED) do
                local n = rows_of(h.id, name)
                test.is_true(n >= (name == "kickside_work_board" and 1 or 105), name .. " seeded rows: " .. n)
            end
            assert(h.call("delete", {}))
            steps.wait_for("committed deletion fence", function(): boolean
                local db = assert(store.open())
                local rows = assert(db:query("SELECT component_id FROM kickside_components WHERE component_id = $1 AND deleting_at IS NOT NULL", { h.id }))
                db:release()
                return #rows == 1 or rows_of(h.id, "kickside_work_board") == 0
            end)
            steps.wait_for("bounded teardown", function(): boolean
                return rows_of(h.id, "kickside_work_board") == 0
            end)
            steps.deleted(h.id)
            local pages = observer.pages(h.id)
            test.is_true(#pages > 10, "cleanup pages: " .. #pages)
            local removed = 0
            for _, page in ipairs(pages) do
                test.is_true(tonumber(page.removed) <= 100, "removed in one page: " .. page.removed)
                test.eq(tonumber(page.fenced), 1)
                if tonumber(page.remaining) > 0 then test.eq(tonumber(page.shell), 1) end
                removed = removed + (tonumber(page.removed) :: integer)
            end
            test.is_true(removed > 1100, "observed removals: " .. removed)
            for _, name in ipairs(observer.OWNED) do test.eq(rows_of(h.id, name), 0, name) end
        end)

        test.it("retention skips a deleting board and collects live boards without driving deletion", function()
            local deleting = fixture.board()
            local live = fixture.board()
            for _, board in ipairs({ deleting, live }) do
                assert(steps.apply(board, { { op = "create", type = "task" } }, { key = "expired" }))
            end
            observer.pause(deleting.id, true)
            local db = assert(store.open())
            for _, board in ipairs({ deleting, live }) do
                assert(db:execute("UPDATE kickside_work_receipt SET at='2000-01-01T00:00:00.000000000Z' WHERE board_id=$1", { board.id }))
            end
            assert(db:execute("UPDATE kickside_work_retention SET board_after='',inclusive=0,item_after='',deadline_ms=NULL WHERE owner_id='work'", {}))
            db:release()
            assert(deleting.call("delete", {}))
            local before = rows_of(deleting.id, "kickside_work_receipt")
            steps.retention_sweep()
            local remaining = rows_of(deleting.id, "kickside_work_receipt")
            local collected = rows_of(live.id, "kickside_work_receipt")
            local shell = rows_of(deleting.id, "kickside_work_board")
            observer.pause(deleting.id, false)
            steps.deleted(deleting.id)
            test.is_true(before > 0)
            test.eq(remaining, before, "retention leaves deleting board rows untouched")
            test.eq(shell, 1, "only the paused platform job owns board cleanup")
            test.eq(collected, 0, "retention continues collecting live boards")
        end)

        test.it("deletes through the component service and removes the component shell", function()
            local h = fixture.board()
            assert(h.call("delete", {}))
            steps.deleted(h.id)
            local db = assert(store.open())
            local rows = assert(db:query("SELECT COUNT(*) AS n FROM kickside_components WHERE component_id = $1", { h.id }))
            db:release()
            test.eq(tonumber(rows[1].n), 0)
        end)

        test.it("removes every board row and leaves other boards alone", function()
            local h = fixture.board()
            local other = fixture.board()
            for _, board in ipairs({ h, other }) do
                assert(board.call("apply_schema", { declaration = { plugins = { { use = "app:work_plugin" } } } }))
                local epic = steps.create(board, "epic", { title = "E" })
                local story = steps.create(board, "story", { title = "S" }, epic)
                steps.one(board, { op = "link", item = story, type = "relates", target = { item = epic } })
                assert(steps.apply(board, { { op = "comment", item = story, body = "hi" } }, { key = "teardown" }))
                steps.one(board, { op = "delete", item = story })
                steps.one(board, { op = "parent", item = story, parent = false })
            end
            local db = assert(store.open())
            assert(db:execute("INSERT INTO kickside_work_job (board_id, job_id, job_type, key, status) VALUES ($1, 'j1', 'rebuild', 'k', 'done')", { h.id }))
            assert(db:execute("INSERT INTO kickside_work_visibility (board_id, item_id, seq, document) SELECT board_id, item_id, updated_seq, '{}' FROM kickside_work_item WHERE board_id = $1 LIMIT 1", { h.id }))
            db:release()
            for _, name in ipairs(TABLES) do test.is_true(rows_of(h.id, name) > 0, name) end
            test.is_true(rows_of(h.id, "kickside_work_prefix") > 0, "prefix")
            local before = {}
            for _, name in ipairs(TABLES) do before[name] = rows_of(other.id, name) end
            local _, err = h.call("delete", {})
            test.is_nil(err, steps.detail(err))
            steps.deleted(h.id)
            for _, name in ipairs(TABLES) do test.eq(rows_of(h.id, name), 0, name) end
            test.is_true(rows_of(h.id, "kickside_work_prefix") > 0, "the prefix outlives the board until the retention owner releases it")
            for _, name in ipairs(TABLES) do test.eq(rows_of(other.id, name), before[name], name) end
            test.eq(rows_of(other.id, "kickside_work_prefix"), 1)
            local _, again = h.call("delete", {})
            test.not_nil(again)
            test.eq(again:kind(), errors.PERMISSION_DENIED)
        end)

        test.it("deletes a board for an owner who is a member only, without registry access", function()
            local h = fixture.board()
            steps.create(h, "task", { title = "T" })
            local member, id = fixture.user(h, nil, true)
            assert(h.call("grant", { subject_id = id, mask = 13 }))
            local _, err = member("delete", {})
            test.is_nil(err, steps.detail(err))
            steps.deleted(h.id)
            for _, name in ipairs(TABLES) do test.eq(rows_of(h.id, name), 0, name) end
        end)

        test.it("tears a board down on the trusted system delete path", function()
            local h = fixture.board()
            steps.create(h, "task", { title = "T" })
            local released, err
            steps.wait_for("system delete", function(): boolean
                released, err = funcs.call("app:system_delete", { board_id = h.id })
                return not (err and err:details().wait_for == "deletion_job")
            end)
            test.is_nil(err, steps.detail(err))
            test.is_true(released)
            local repeated, repeat_err = funcs.call("app:system_delete", { board_id = h.id })
            test.is_nil(repeat_err, steps.detail(repeat_err))
            test.is_true(repeated)
            for _, name in ipairs(TABLES) do test.eq(rows_of(h.id, name), 0, name) end
        end)
    end)

    test.describe("public meta", function()
        test.it("publishes counts and generation on the board component after the projection commits", function()
            local h = fixture.board()
            local epic = steps.create(h, "epic", { title = "E" })
            steps.create(h, "story", { title = "S" }, epic)
            local done = steps.create(h, "task", { title = "T" })
            steps.one(h, { op = "delete", item = done })
            local summary
            for _ = 1, 50 do
                local boards = assert(h.call("list", {})).boards
                summary = boards[1]
                if summary.item_count == 2 and summary.status == "ready" then break end
                time.sleep("100ms")
            end
            test.eq(summary.board_id, h.id)
            test.eq(summary.key_prefix, h.prefix)
            test.eq(summary.item_count, 2)
            test.eq(summary.open_count, 2)
            test.eq(summary.generation, 1)
            test.eq(summary.status, "ready")
            test.eq(summary.title, "Fixture board")
        end)
    end)
end

return { run = test.run_cases(define) }
