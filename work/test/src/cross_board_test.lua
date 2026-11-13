-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local scoped = require("scoped")
local fixture = require("fixture")
local steps = require("steps")
local time = require("time")
local store = require("store")
local directory_probe = require("directory_probe")
local component = require("component")

local function define()
    test.describe("cross-board query", function()
        test.it("links from a higher board head to a lower target head in atomic and independent commands", function()
            local owner = scoped.admin()
            for _, mode in ipairs({ "atomic", "independent" }) do
                local source, target = scoped.board(owner), scoped.board(owner)
                local from, to = steps.create(source, "task"), steps.create(target, "task")
                for i = 1, 4 do steps.one(source, { op = "comment", item = from, body = "Source advance " .. i }) end
                local source_events, target_events = steps.events(source), steps.events(target)
                test.is_true(source_events[#source_events].seq > target_events[#target_events].seq)
                local out = assert(steps.apply(source, { { op = "link", item = from, type = "blocks", target = { board = target.id, item = to } } }, { mode = mode }))
                test.is_true(out.applied)
                test.eq(out.outcomes[1].status, "applied")
                local links = assert(target.call("list_links", { item = { id = to }, direction = "inward" }))
                test.eq(#links.links, 1)
                test.eq(links.links[1].source.item, from)
                test.eq(links.links[1].source.board, source.id)
            end
        end)

        test.it("merges keyset pages with ties and nulls in both directions", function()
            local admin, member = scoped.admin(), scoped.member()
            local a, b = scoped.board(admin), scoped.board(admin)
            for _, h in ipairs({ a, b }) do
                assert(h.call("grant", { subject_id = member.id, mask = 1 }))
                for _, value in ipairs({ 1, 3, 3, 5 }) do steps.create(h, "task", { estimate = value }) end
                steps.create(h, "task")
            end
            for _, direction in ipairs({ "asc", "desc" }) do
                local cursor = nil
                local seen: { [string]: boolean } = {}
                local count, previous, previous_board, previous_id = 0, nil, "", ""
                local empty = false
                repeat
                    local response = member.http("POST", "/" .. a.id .. "/query", { boards = { b.id, a.id }, order = { field = "estimate", dir = direction }, limit = 3, cross_after = cursor })
                    test.eq(response.status, 200, tostring(response.body.message))
                    local data = response.body.data
                    for _, item in ipairs(data.items) do
                        test.is_false(seen[item.id] == true)
                        seen[item.id], count = true, count + 1
                        local value = item.values.estimate
                        if value == nil then empty = true else
                            test.is_false(empty)
                            if previous ~= nil then test.is_true(direction == "asc" and value >= previous or direction == "desc" and value <= previous) end
                            if value == previous then
                                test.is_true(item.board_id > previous_board or item.board_id == previous_board and item.id > previous_id)
                            end
                        end
                        previous, previous_board, previous_id = value, item.board_id, item.id
                    end
                    cursor = data.cross_after
                until cursor == nil
                test.eq(count, 10)
            end
            local readable = member.http("POST", "/" .. a.id .. "/query", { boards = "readable", order = { field = "estimate" } })
            test.eq(readable.status, 200)
            test.eq(#readable.body.data.items, 10)
        end)

        test.it("rejects 51 boards, unreadable boards and incompatible forms", function()
            local admin, member = scoped.admin(), scoped.member()
            local a = scoped.board(admin)
            assert(a.call("grant", { subject_id = member.id, mask = 1 }))
            local ids: { string } = {}
            for i = 1, 51 do ids[i] = tostring(i) end
            local cap = member.http("POST", "/" .. a.id .. "/query", { boards = ids })
            test.eq(cap.status, 400)
            test.eq(cap.body.details.cap, 50)
            local b = scoped.board(admin)
            test.eq(member.http("POST", "/" .. a.id .. "/query", { boards = { a.id, b.id } }).status, 403)
            local d = fixture.declaration(fixture.fresh_prefix())
            d.fields[2] = { code = "estimate", form = "time", index = "key" }
            local c = scoped.board(admin, d)
            local mismatch = admin.http("POST", "/" .. a.id .. "/query", { boards = { a.id, c.id }, order = { field = "estimate" } })
            test.eq(mismatch.status, 400)
            test.eq(#mismatch.body.details.boards, 2)
            local decimals = {}
            for _, scale in ipairs({ 2, 3 }) do
                local own = fixture.declaration(fixture.fresh_prefix())
                own.fields[2] = { code = "estimate", form = "dec", index = "number", config = { scale = scale } }
                decimals[#decimals + 1] = scoped.board(admin, own).id
            end
            mismatch = admin.http("POST", "/" .. a.id .. "/query", { boards = decimals, order = { field = "estimate" } })
            test.eq(mismatch.status, 400)
            test.eq(#mismatch.body.details.boards, 2)
        end)
        test.it("reads 50 boards with 25 visibility rules within two seconds through HTTP", function()
            local admin, member = scoped.admin(), scoped.member()
            local first
            for i = 1, 50 do
                local d = fixture.declaration(fixture.fresh_prefix())
                if i % 2 == 0 then
                    d.fields[#d.fields + 1] = { code = "level", form = "text", index = "key" }
                    d.item_types[3].fields[#d.item_types[3].fields + 1] = "level"
                    d.visibility = { field = "level", levels = { { id = "internal", holders = { { group = "app.security:work_admin" } } } } }
                end
                local h = scoped.board(admin, d)
                first = first or h.id
                assert(h.call("grant", { subject_id = member.id, mask = 1 }))
                steps.create(h, "task", { estimate = i })
                if i % 2 == 0 then steps.create(h, "task", { level = "internal", estimate = i }) end
            end
            for run = 1, 3 do
                local calls = directory_probe.calls(member.id)
                local started = time.now():unix_nano()
                local response = member.http("POST", "/" .. first .. "/query", { boards = "readable", order = { field = "estimate" }, limit = 100 })
                local elapsed = (time.now():unix_nano() - started) / 1e9
                local db = assert(store.open())
                assert(db:execute("CREATE TABLE IF NOT EXISTS app_work_cross_board_benchmark (board_id TEXT PRIMARY KEY, engine TEXT, seconds DOUBLE PRECISION)", {}))
                assert(db:execute("INSERT INTO app_work_cross_board_benchmark (board_id, engine, seconds) VALUES ($1,$2,$3)", { first .. ":" .. run, db:type(), elapsed }))
                db:release()
                test.eq(directory_probe.calls(member.id) - calls, 1)
                test.eq(response.status, 200, tostring(response.body.message))
                test.eq(#response.body.data.items, 50)
                test.is_true(elapsed < 2, tostring(elapsed))
            end
        end)

        test.it("refreshes groups per request and keeps ADMIN local to each board", function()
            local owner, reader = scoped.admin(), scoped.admin()
            local boards = {}
            for i = 1, 2 do
                local d = fixture.declaration(fixture.fresh_prefix())
                d.fields[#d.fields + 1] = { code = "level", form = "text", index = "key" }
                d.item_types[3].fields[#d.item_types[3].fields + 1] = "level"
                d.visibility = { field = "level", bypass = "admin", levels = {
                    { id = "internal", holders = { { group = "app.security:work_admin" } } },
                } }
                local h = scoped.board(owner, d)
                assert(h.call("grant", { subject_id = reader.id, mask = 1 }))
                steps.create(h, "task", { level = "internal" })
                boards[i] = h
            end
            table.sort(boards, function(a, b) return a.id < b.id end)
            local function read(): scoped.Reply
                local calls = directory_probe.calls(reader.id)
                local response = reader.http("POST", "/" .. boards[1].id .. "/query", { boards = { boards[1].id, boards[2].id } })
                test.eq(response.status, 200, tostring(response.body.message))
                test.eq(directory_probe.calls(reader.id) - calls, 1)
                return response
            end
            test.eq(#read().body.data.items, 2)
            local db = assert(store.open())
            assert(db:execute("DELETE FROM app_user_groups WHERE user_id=$1 AND group_id=$2", { reader.id, "app.security:work_admin" }))
            db:release()
            test.eq(#read().body.data.items, 0)
            assert(boards[1].call("grant", { subject_id = reader.id, mask = component.ACCESS.READ + component.ACCESS.ADMIN }))
            local response = read()
            test.eq(#response.body.data.items, 1)
            test.eq(response.body.data.items[1].board_id, boards[1].id)
        end)

        test.it("validates holder groups declared by later boards", function()
            local owner = scoped.admin()
            local boards = {}
            for i = 1, 2 do
                local d = fixture.declaration(fixture.fresh_prefix())
                d.fields[#d.fields + 1] = { code = "level", form = "text", index = "key" }
                d.item_types[3].fields[#d.item_types[3].fields + 1] = "level"
                d.visibility = { field = "level", levels = {
                    { id = "internal", holders = { { group = "app.security:work_admin" } } },
                } }
                boards[i] = scoped.board(owner, d)
            end
            table.sort(boards, function(a, b) return a.id < b.id end)
            assert(boards[2].call("apply_schema", { declaration = { visibility = { field = "level", levels = {
                { id = "internal", holders = { { group = "app.security:missing_group" } } },
            } } } }))
            local response = owner.http("POST", "/" .. boards[1].id .. "/query", { boards = { boards[1].id, boards[2].id } })
            test.eq(response.status, 503)
            test.eq(response.body.details.code, "contract_unavailable")
        end)

        test.it("refuses a digest change during principal resolution on both read paths", function()
            local owner, reader = scoped.admin(), scoped.member()
            for _, cross in ipairs({ false, true }) do
                local d = fixture.declaration(fixture.fresh_prefix())
                d.fields[#d.fields + 1] = { code = "level", form = "text", index = "key" }
                d.item_types[3].fields[#d.item_types[3].fields + 1] = "level"
                d.visibility = { field = "level", levels = {
                    { id = "internal", holders = { { group = "app.security:work_admin" } } },
                } }
                local h = scoped.board(owner, d)
                assert(h.call("grant", { subject_id = reader.id, mask = 1 }))
                directory_probe.change_digest(reader.id, h.id)
                local response = reader.http("POST", "/" .. h.id .. "/query", cross and { boards = { h.id } } or {})
                test.eq(response.status, 503)
                test.eq(response.body.details.code, "access_projection_changed")
            end
        end)

        test.it("caps the actor-scoped readable listing at 50 work boards", function()
            local admin, member = scoped.admin(), scoped.member()
            local first = nil
            for _ = 1, 51 do
                local h = scoped.board(admin)
                first = first or h.id
                assert(h.call("grant", { subject_id = member.id, mask = 1 }))
            end
            local response = member.http("POST", "/" .. first .. "/query", { boards = "readable" })
            test.eq(response.status, 400)
            test.eq(response.body.details.cap, 50)
        end)
    end)
end
return { run = test.run_cases(define) }
