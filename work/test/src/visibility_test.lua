-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local scoped = require("scoped")
local fixture = require("fixture")
local steps = require("steps")
local registry = require("registry")
local sql = require("sql")

local function declaration(): { [string]: unknown }
    return {
        key_prefix = fixture.fresh_prefix(),
        fields = {
            { code = "title", form = "text", index = "key", track = true },
            { code = "level", form = "text", index = "key", track = true },
            { code = "owner", type = "principal", index = "key" },
            { code = "secret", form = "int", index = "number", track = true, intervals = true,
                access = { read = { { field = "owner" } }, write = { { group = "app.security:work_admin" } } } },
        },
        item_types = { { id = "task", process = "flow", fields = { "title", "level", "owner", "secret" }, parent_types = { "task" } } },
        processes = { { id = "flow", initial = "open", states = { { id = "open", category = "started" } }, transitions = {
            { id = "check", from = { "open" }, to = "open", when = { field = "secret", op = "gte", value = 0 } },
            { id = "effect", from = { "open" }, to = "open", set = { { field = "secret", value = 9 } } },
            { id = "peer", from = { "open" }, to = "open", when = { rel = "blocks", q = "some", where = { field = "state", op = "eq", value = "open" } } },
        } } },
        relation_types = { { id = "blocks" } },
        visibility = { field = "level", bypass = "admin", levels = {
            { id = "internal", holders = { { group = "app.security:work_admin" }, { field = "owner" } } },
        } },
    }
end

local function define()
    test.describe("parent history visibility", function()
        test.it("redacts the unreadable after side of a parent change", function()
            local admin, member = scoped.admin(), scoped.member()
            local h = scoped.board(admin, declaration())
            assert(h.call("grant", { subject_id = member.id, mask = 1 }))
            local parent = steps.create(h, "task", { level = "internal" })
            local child = steps.create(h, "task")
            test.eq(steps.one(h, { op = "parent", item = child, parent = parent }).status, "applied")
            local history = assert(member.call("list_history", { item = { id = child } }, h.id))
            local found = false
            for _, entry in ipairs(history.entries) do
                if entry.kind == "parent" then found = true; test.is_nil(entry.after) end
            end
            test.is_true(found)
        end)
    end)

    test.describe("item visibility and field access", function()
        test.it("rechecks principal and item visibility before returning keyed outcomes", function()
            local admin, member, peer = scoped.admin(), scoped.member(), scoped.member()
            local h = scoped.board(admin, declaration())
            for _, caller in ipairs({ member, peer }) do assert(h.call("grant", { subject_id = caller.id, mask = 3 })) end
            local id = steps.create(h, "task", { title = "Before" })
            local request = { key = "protected-replay", ops = { { op = "set", item = id, values = { title = "After" } } } }
            local first = assert(member.call("apply", request, h.id))
            test.eq(first.outcomes[1].status, "applied")
            local replay = assert(member.call("apply", request, h.id))
            test.eq(replay.outcomes[1].item, id)
            local out, err = peer.call("apply", request, h.id)
            test.is_nil(out)
            test.eq(err:kind(), errors.PERMISSION_DENIED)
            test.eq(err:details().code, "idempotency_principal_mismatch")
            steps.one(h, { op = "set", item = id, values = { level = "internal" } })
            local denied = assert(member.call("apply", request, h.id)).outcomes[1]
            test.eq(denied.status, "invalid")
            test.is_nil(denied.item)
            test.is_nil(denied.key)
            test.is_nil(denied.version)
        end)

        test.it("counts only caller-visible item populations in board discovery", function()
            local admin, member = scoped.admin(), scoped.member()
            local h = scoped.board(admin, declaration())
            assert(h.call("grant", { subject_id = member.id, mask = 1 }))
            steps.create(h, "task", { title = "Public" })
            local function summary()
                for _, board in ipairs(assert(member.call("list", {})).boards) do
                    if board.board_id == h.id then return board end
                end
                error("readable board is absent")
            end
            test.eq(summary().item_count, 1)
            local hidden = steps.create(h, "task", { level = "internal" })
            test.eq(summary().item_count, 1)
            test.eq(summary().open_count, 1)
            steps.one(h, { op = "delete", item = hidden })
            test.eq(summary().item_count, 1)
            test.eq(summary().trashed_count, 0)
        end)

        test.it("requires source and predicate field authority for rollups and dependent formulas", function()
            local admin, member = scoped.admin(), scoped.member()
            local d = declaration()
            d.visibility = nil
            d.fields[4].access.read = { { group = "app.security:work_admin" } }
            for _, field in ipairs({
                { code = "total", type = "rollup", form = "int", index = "number", of = "children", fn = "sum", field = "secret" },
                { code = "eligible", type = "rollup", form = "int", index = "number", of = "children", fn = "count", where = { field = "secret", op = "gte", value = 0 } },
                { code = "mirror", type = "formula", form = "int", index = "number", expression = "total" },
            }) do
                d.fields[#d.fields + 1] = field
                d.item_types[1].fields[#d.item_types[1].fields + 1] = field.code
            end
            local h = scoped.board(admin, d)
            assert(h.call("grant", { subject_id = member.id, mask = 1 }))
            local parent = steps.create(h, "task")
            steps.create(h, "task", { secret = 12345 }, parent)
            test.eq(assert(h.call("get", { item = { id = parent } })).item.values.total, 12345)
            for _, code in ipairs({ "total", "eligible", "mirror" }) do
                test.is_nil(assert(member.call("get", { item = { id = parent } }, h.id)).item.values[code], code)
                local _, err = member.call("query", { order = { field = code } }, h.id)
                test.eq(err:kind(), errors.PERMISSION_DENIED, code)
                local _, explain_err = member.call("explain", { where = { field = code, op = "gte", value = 0 } }, h.id)
                test.eq(explain_err:kind(), errors.PERMISSION_DENIED, code)
            end
            for _, item in ipairs(assert(member.call("list_changes", {}, h.id)).items) do
                for _, code in ipairs({ "total", "eligible", "mirror" }) do test.is_nil(item.values and item.values[code]) end
            end
            for _, entry in ipairs(assert(member.call("list_history", { item = { id = parent } }, h.id)).entries) do
                test.is_true(entry.field ~= "total" and entry.field ~= "eligible" and entry.field ~= "mirror")
            end
        end)

        test.it("keeps one visibility snapshot across unrelated edits", function()
            local admin = scoped.admin()
            local h = scoped.board(admin, declaration())
            local id = steps.create(h, "task", { title = "Before", level = "internal", owner = { kind = "user", id = admin.id } })
            local function count(): integer
                local db = assert(sql.get("app:db"))
                local rows = assert(db:query("SELECT COUNT(*) AS n FROM kickside_work_visibility WHERE board_id = $1 AND item_id = $2", { h.id, id }))
                db:release()
                return math.tointeger(tonumber(rows[1].n)) :: integer
            end
            test.eq(count(), 1)
            for i = 1, 5 do
                test.eq(steps.one(h, { op = "set", item = id, values = { title = "Edit " .. i } }).status, "applied")
                test.eq(count(), 1)
            end
        end)

        test.it("protects every item read under real scopes and endpoints", function()
            local admin, outside, holder, inside, outsider = scoped.admin(), scoped.member(), scoped.member(), scoped.admin(), scoped.outsider()
            local h = scoped.board(admin, declaration())
            for _, s in ipairs({ outside, holder, inside }) do assert(h.call("grant", { subject_id = s.id, mask = 3 })) end
            local hidden = steps.create(h, "task", { title = "Restricted", level = "internal", owner = { kind = "user", id = holder.id }, secret = 77 })
            local public = steps.create(h, "task", { title = "Public", secret = 88 })
            steps.one(h, { op = "comment", item = hidden, body = "Restricted comment" })
            steps.one(h, { op = "link", item = public, type = "blocks", target = { item = hidden } })
            local key = assert(h.call("get", { item = { id = hidden } })).item.key
            local view = assert(h.call("create_view", { board_id = h.id, view = { type = "list" } })).view_id
            local methods = {
                { method = "get", request = { item = { id = hidden }, include = { "transitions", "comments", "links", "children", "stage_runs" } }, point = true },
                { method = "get", request = { item = { key = key } }, point = true },
                { method = "list_history", request = { item = { id = hidden }, include = { "intervals" } }, point = true },
                { method = "list_links", request = { item = { id = hidden } }, point = true },
                { method = "list_comments", request = { item = { id = hidden } }, point = true },
                { method = "list_stage_runs", request = { item = { id = hidden } }, point = true },
                { method = "get_time_in_state", request = { item = { id = hidden } }, point = true },
                { method = "query", request = {} }, { method = "count", request = {} },
                { method = "list_changes", request = {} }, { method = "list_history", request = {} },
                { method = "explain", request = {} }, { method = "run_view", request = { view_id = view } },
            }
            local covered = { list = true, get_schema = true, plugin_context = true, plugin_feed = true, schema_options = true }
            for _, session in ipairs({ outside, holder, inside, admin, outsider }) do
                for _, method in ipairs({ "plugin_context", "plugin_feed" }) do
                    local value = { board_id = h.id, plugin = "app:work_plugin" }
                    if method == "plugin_feed" then value.kind = "app:item_fold" end
                    local context, err = session.call("contract_request", { contract = "kickside.work:board", method = method, value = value })
                    test.is_nil(context)
                    test.not_nil(err)
                    test.eq(err:kind(), session == outsider and errors.PERMISSION_DENIED or errors.NOT_FOUND)
                end
                local options, oerr = session.call("contract_request", { contract = "kickside.work:board", method = "schema_options", value = { board_id = h.id } })
                if session == admin then test.is_nil(oerr); test.not_nil(options.plugins)
                else test.is_nil(options); test.eq(oerr:kind(), errors.PERMISSION_DENIED) end
            end
            for _, row in ipairs(methods) do covered[row.method] = true end
            covered.list_packs = true
            for _, session in ipairs({ outside, holder, inside, admin, outsider }) do
                local response = session.http("GET", "/api/work/packs")
                test.eq(response.status, session == outsider and 403 or 200, "list_packs")
            end
            local writes = { pack_plan = true, pack_apply = true, update = true, bulk = true, cancel_bulk = true, plan_move = true, move = true, create = true, plan_schema = true, apply_schema = true, resume_migration = true, apply = true, approve = true, report = true, configure_plugin = true }
            for method, locator in pairs({ bulk_status = "bulk_id", move_status = "move_id" }) do
                covered[method] = true
                for _, s in ipairs({ outside, holder, inside, admin, outsider }) do
                    local response = s.http("POST", "/" .. h.id .. "/" .. method, { [locator] = "missing" })
                    test.eq(response.status, s == outsider and 403 or 404, method)
                end
            end
            for _, method in ipairs(assert(registry.get("kickside.work:board")).data.methods) do
                local name = method.name
                test.is_true(writes[name] == true or covered[name] == true, "method has an explicit read case or command classification: " .. name)
            end
            for _, s in ipairs({ outside, holder, inside, admin, outsider }) do
                local visible = s == holder or s == inside or s == admin
                for _, row in ipairs(methods) do
                    local path = row.method == "run_view" and ("/api/work/views/" .. view .. "/run") or ("/" .. h.id .. "/" .. row.method)
                    local response = s.http("POST", path, row.request)
                    local label = row.method .. " " .. s.id
                    test.eq(response.status, s == outsider and 403 or (row.point and not visible and 404 or 200), label)
                    if response.status == 200 then
                        local data = response.body.data
                        if row.method == "query" or row.method == "run_view" then
                            test.eq(#data.items, visible and 2 or 1, label)
                            for _, item in ipairs(data.items) do
                                if s ~= holder or item.id ~= hidden then test.is_nil(item.values.secret, label) end
                            end
                        end
                        if row.method == "count" then test.eq(data.total, visible and 2 or 1, label) end
                        if row.method == "list_changes" then test.eq(#data.items, visible and 2 or 1, label) end
                        if row.method == "get" then
                            test.eq(data.item.values.secret, s == holder and 77 or nil, label)
                            local check = false
                            for _, transition in ipairs(data.transitions or {}) do if transition.id == "check" then check = true end end
                            if row.request.include then test.eq(check, s == holder, label) end
                        end
                        if row.method == "list_history" then
                            for _, entry in ipairs(data.entries) do
                                if not visible then test.is_true(entry.subject ~= "i:" .. hidden, label) end
                                if s ~= holder then test.is_true(entry.field ~= "secret", label) end
                            end
                            for _, interval in ipairs(data.intervals or {}) do if s ~= holder then test.is_true(interval.field ~= "secret", label) end end
                        end
                    end
                end
            end
            test.eq(select(2, outside.call("get", { item = { key = key } })):kind(), errors.NOT_FOUND)
            local links = assert(outside.call("list_links", { item = { id = public } }, h.id))
            test.is_true(links.links[1].target.unavailable)
            test.is_nil(links.links[1].target.item)
            for _, method in ipairs({ "query", "count", "explain" }) do
                local response = outside.http("POST", "/" .. h.id .. "/" .. method, { where = { field = "secret", op = "eq", value = 77 } })
                test.eq(response.status, 403, method)
                test.eq(response.body.details.field, "secret")
            end
            test.eq(outside.http("POST", "/" .. h.id .. "/query", { order = { field = "secret" } }).status, 403)
            local changed = assert(outside.call("apply", { ops = { { op = "set", item = hidden, values = { title = "Guess" } } } }, h.id))
            test.eq(changed.outcomes[1].findings[1].code, "unknown_item")
            changed = assert(holder.call("apply", { ops = { { op = "set", item = hidden, values = { secret = 9 } } } }, h.id))
            test.eq(changed.outcomes[1].status, "denied")
            changed = assert(holder.call("apply", { ops = { { op = "transition", item = hidden, transition = "effect" } } }, h.id))
            test.eq(changed.outcomes[1].status, "applied")
            test.eq(assert(holder.call("get", { item = { id = hidden } }, h.id)).item.values.secret, 9)
            changed = assert(outside.call("apply", { ops = { { op = "transition", item = public, transition = "peer" } } }, h.id))
            test.eq(changed.outcomes[1].status, "denied")
            changed = assert(holder.call("apply", { ops = { { op = "transition", item = public, transition = "peer" } } }, h.id))
            test.eq(changed.outcomes[1].status, "applied")
            local cross = assert(outside.call("query", { boards = { h.id } }, h.id))
            test.eq(#cross.items, 1)
            test.is_nil(cross.items[1].values.secret)
            local feed = assert(holder.call("list_changes", {}, h.id))
            steps.one(h, { op = "set", item = hidden, values = { owner = { kind = "user", id = admin.id } } })
            local removed = assert(holder.call("list_changes", { cursor = feed.next }, h.id))
            test.eq(#removed.items, 1)
            test.eq(removed.items[1].op, "delete")
            test.is_nil(removed.items[1].values)
            test.is_true(removed.next.seq > feed.next.seq)
        end)

        test.it("advances filtered pages and invalidates cursors when live groups change", function()
            local admin, inside, outside = scoped.admin(), scoped.admin(), scoped.member()
            local h = scoped.board(admin, declaration())
            assert(h.call("grant", { subject_id = inside.id, mask = 3 }))
            assert(h.call("grant", { subject_id = outside.id, mask = 3 }))
            local hidden = steps.create(h, "task", { level = "internal" })
            local empty = assert(outside.call("list_changes", { limit = 1 }, h.id))
            test.eq(#empty.items, 0)
            test.is_true(empty.next.seq > 0)
            local end_page = assert(outside.call("list_changes", { cursor = empty.next, limit = 1 }, h.id))
            test.is_false(end_page.has_more)
            local before = assert(inside.call("list_changes", {}, h.id))
            test.eq(#before.items, 1)
            local db = assert(sql.get("app:db"))
            assert(db:execute("DELETE FROM app_user_groups WHERE user_id = $1 AND group_id = $2", { inside.id, "app.security:work_admin" }))
            db:release()
            test.eq(inside.http("POST", "/" .. h.id .. "/get", { item = { id = hidden } }).status, 404)
            local gap = assert(inside.call("list_changes", { cursor = before.next }, h.id))
            test.not_nil(gap.gap)
            test.eq(#gap.items, 0)
            test.eq(gap.next.seq, 0)
        end)

        test.it("rejects visibility indexes that collapse distinct level ids", function()
            local admin = scoped.admin()
            for _, field in ipairs({
                { code = "level", type = "option", index = "number", options = { { id = "internal", order = 1 }, { id = "legal", order = 1 } } },
                { code = "level", form = "text", index = "key", config = { case = "insensitive" } },
            }) do
                local d = declaration()
                d.fields[2] = field
                local response = admin.http("POST", "", { idempotency_key = fixture.fresh_prefix(), declaration = d })
                test.eq(response.status, 400)
            end
        end)

        test.it("fails closed when a declared holder group cannot resolve", function()
            local admin = scoped.admin()
            local d = declaration()
            local h = scoped.board(admin, d)
            local id = steps.create(h, "task")
            d.visibility.levels[1].holders = { { group = "app.security:missing_group" } }
            assert(h.call("apply_schema", { declaration = { visibility = d.visibility } }))
            for _, method in ipairs({ "get", "query", "count", "list_history", "list_changes", "list_links", "list_comments", "list_stage_runs", "get_time_in_state", "explain" }) do
                local request = method == "get" or method == "list_links" or method == "list_comments" or method == "list_stage_runs" or method == "get_time_in_state" or method == "list_history"
                local response = admin.http("POST", "/" .. h.id .. "/" .. method, request and { item = { id = id } } or {})
                test.eq(response.status, 503, method)
                test.eq(response.body.details.code, "contract_unavailable", method)
            end
        end)

        test.it("reindexes changed visibility and fences feed cursors from the previous schema", function()
            local admin, member = scoped.admin(), scoped.member()
            local d = declaration()
            local visibility = d.visibility
            d.visibility = nil
            local h = scoped.board(admin, d)
            assert(h.call("grant", { subject_id = member.id, mask = 1 }))
            local hidden = steps.create(h, "task", { level = "internal" })
            local before = assert(member.call("list_changes", {}, h.id))
            test.eq(#before.items, 1)
            local plan = assert(h.call("plan_schema", { declaration = { visibility = visibility } }))
            test.eq(plan.class, "semantic")
            assert(h.call("apply_schema", { declaration = { visibility = visibility } }))
            local db = assert(sql.get("app:db"))
            local jobs = assert(db:query("SELECT job_type FROM kickside_work_job WHERE board_id = $1 AND job_type = 'reindex'", { h.id }))
            db:release()
            test.eq(#jobs, 1)
            test.eq(member.http("POST", "/" .. h.id .. "/get", { item = { id = hidden } }).status, 404)
            local gap = assert(member.call("list_changes", { cursor = before.next }, h.id))
            test.not_nil(gap.gap)
            test.eq(#assert(member.call("query", {}, h.id)).items, 0)
        end)

        test.it("resolves field holders against created items and live principal groups", function()
            local admin, owner, member = scoped.admin(), scoped.member(), scoped.admin()
            local d = declaration()
            d.fields[#d.fields + 1] = { code = "note", form = "text", access = { read = { { field = "owner" } }, write = { { field = "owner" } } } }
            d.item_types[1].fields[#d.item_types[1].fields + 1] = "note"
            local h = scoped.board(admin, d)
            for _, s in ipairs({ owner, member }) do assert(h.call("grant", { subject_id = s.id, mask = 3 })) end
            local created = assert(owner.call("apply", { ops = { { op = "create", type = "task", values = { owner = { kind = "user", id = owner.id }, note = "Owned" } } } }, h.id))
            test.eq(created.outcomes[1].status, "applied")
            local id = created.outcomes[1].item
            local allowed = assert(owner.call("apply", { ops = { { op = "set", item = id, values = { note = "Edited" } } } }, h.id))
            test.eq(allowed.outcomes[1].status, "applied")
            local refused = assert(member.call("apply", { ops = { { op = "set", item = id, clear = { "note" } } } }, h.id))
            test.eq(refused.outcomes[1].status, "denied")
            steps.one(h, { op = "set", item = id, values = { owner = { kind = "group", id = "app.security:work_admin" } } })
            test.eq(assert(member.call("get", { item = { id = id } }, h.id)).item.values.note, "Edited")
            test.is_nil(assert(owner.call("get", { item = { id = id } }, h.id)).item.values.note)
        end)

        test.it("matches principal holder lists and sets in point and compiled reads", function()
            local admin, member, outside = scoped.admin(), scoped.member(), scoped.member()
            for _, cardinality in ipairs({ "list", "set" }) do
                local d = declaration()
                d.fields[3].cardinality = cardinality
                local h = scoped.board(admin, d)
                for _, s in ipairs({ member, outside }) do assert(h.call("grant", { subject_id = s.id, mask = 1 })) end
                local id = steps.create(h, "task", { level = "internal", owner = { { kind = "user", id = member.id } }, secret = 77 })
                test.eq(assert(member.call("get", { item = { id = id } }, h.id)).item.values.secret, 77)
                test.eq(#assert(member.call("query", {}, h.id)).items, 1)
                test.eq(assert(outside.call("count", {}, h.id)).total, 0)
                test.eq(outside.http("POST", "/" .. h.id .. "/get", { item = { id = id } }).status, 404)
            end
        end)

        test.it("redacts hidden parents and denies their use as order and filter keys", function()
            local admin, member = scoped.admin(), scoped.member()
            local h = scoped.board(admin, declaration())
            assert(h.call("grant", { subject_id = member.id, mask = 1 }))
            local parent = steps.create(h, "task", { level = "internal" })
            local child = steps.create(h, "task", {}, parent)
            local result = assert(member.call("get", { item = { id = child } }, h.id))
            test.is_nil(result.item.parent)
            for _, request in ipairs({ { order = { field = "parent" } }, { where = { field = "parent", op = "eq", value = parent } },
                { where = { field = "path_under", op = "has", value = parent } } }) do
                local response = member.http("POST", "/" .. h.id .. "/query", request)
                test.eq(response.status, 403)
                test.eq(response.body.details.code, "field_denied")
            end
            local history = assert(member.call("list_history", { item = { id = child } }, h.id))
            for _, entry in ipairs(history.entries) do if entry.kind == "created" then test.is_nil(entry.after.parent) end end
        end)

        test.it("keeps retired private field values out of durable history", function()
            local admin, member = scoped.admin(), scoped.member()
            local d = declaration()
            d.processes[1].transitions = {}
            local h = scoped.board(admin, d)
            assert(h.call("grant", { subject_id = member.id, mask = 1 }))
            local id = steps.create(h, "task", { owner = { kind = "user", id = member.id }, secret = 77 })
            local prior = assert(member.call("list_history", { item = { id = id } }, h.id))
            local held = false
            for _, entry in ipairs(prior.entries) do if entry.field == "secret" then held = true end end
            test.is_true(held)
            assert(h.call("apply_schema", { declaration = { remove = { fields = { "secret" } }, item_types = {
                { id = "task", process = "flow", fields = { "title", "level", "owner" }, parent_types = { "task" } },
            } } }))
            local history = assert(member.call("list_history", { item = { id = id } }, h.id))
            for _, entry in ipairs(history.entries) do test.is_true(entry.before ~= 77); test.is_true(entry.after ~= 77) end
        end)

        test.it("keeps visibility rollups under the declared board ADMIN bypass", function()
            local admin, member = scoped.admin(), scoped.member()
            local d = declaration()
            d.fields[4].access.read = { { group = "app.security:work_admin" } }
            d.fields[#d.fields + 1] = { code = "total", type = "rollup", form = "int", index = "number", of = "children", fn = "sum", field = "secret",
                where = { field = "secret", op = "gte", value = 0 } }
            d.item_types[1].fields[#d.item_types[1].fields + 1] = "total"
            for _, formula in ipairs({ { code = "mirror", expression = "total" }, { code = "copy", expression = "mirror" } }) do
                d.fields[#d.fields + 1] = { code = formula.code, type = "formula", form = "int", expression = formula.expression, index = "number" }
                d.item_types[1].fields[#d.item_types[1].fields + 1] = formula.code
            end
            local h = scoped.board(admin, d)
            assert(h.call("grant", { subject_id = member.id, mask = 3 }))
            local parent = steps.create(h, "task")
            steps.create(h, "task", { level = "internal", secret = 7 }, parent)
            test.eq(assert(h.call("get", { item = { id = parent } })).item.values.total, 7)
            local public = assert(member.call("get", { item = { id = parent }, include = { "children" } }, h.id))
            test.is_nil(public.item.values.total)
            test.is_nil(public.item.values.mirror)
            test.is_nil(public.item.values.copy)
            test.eq(#public.children, 0)
            for _, method in ipairs({ "query", "count", "explain" }) do
                for _, code in ipairs({ "total", "mirror", "copy" }) do
                    test.eq(member.http("POST", "/" .. h.id .. "/" .. method, { where = { field = code, op = "gte", value = 0 } }).status, 403, method)
                end
            end
            local history = assert(member.call("list_history", { item = { id = parent } }, h.id))
            for _, entry in ipairs(history.entries) do test.is_true(entry.field ~= "total") end
            local feed = assert(member.call("list_changes", {}, h.id))
            for _, item in ipairs(feed.items) do
                for _, code in ipairs({ "total", "mirror", "copy" }) do test.is_nil(item.values and item.values[code]) end
            end
        end)
    end)
end
return { run = test.run_cases(define) }
