-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local scoped = require("scoped")
local fixture = require("fixture")
local steps = require("steps")
local provider = require("provider")
local store = require("store")
local tables = require("tables")
local materializer = require("materializer")
local values = require("values")
local uuid = require("uuid")
local json = require("json")
local domain = require("domain")
local reindex = require("reindex")

local function fragment(index: string?): { [string]: unknown }
    return { fields = { { code = "dynamic", form = "int", index = index or "none" } }, item_types = { { id = "task", fields = { "dynamic" } } } }
end
local function activate(admin: scoped.Session, h: fixture.Handle, id: string, key: string?): scoped.Reply
    return admin.http("POST", "/" .. h.id .. "/apply_schema", { declaration = { plugins = { { use = id } } }, key = key })
end
local function field(h: fixture.Handle, code: string): { [string]: unknown }?
    for _, f in ipairs(assert(h.call("get_schema", {})).compiled.fields) do if f.code == code then return f end end
    return nil
end
local function define()
    test.describe("plugin schema sources", function()
        test.after_each(function() reindex.release() end)
        test.it("composes template fields into board types with indexes and enforces access", function()
            local admin, member = scoped.admin(), scoped.member()
            local h = scoped.board(admin)
            test.eq(activate(admin, h, "app:schema_template").status, 200)
            local view = assert(h.call("get_schema", {}))
            test.eq(view.plugins[1].plugin, "app:schema_template")
            test.not_nil(view.plugins[1].digest)
            for _, own in ipairs(view.declaration.fields) do test.is_true(own.code ~= "plugin_score") end
            test.eq(assert(field(h, "plugin_score")).plugin, "app:schema_template")
            local a = steps.create(h, "task", { plugin_score = 7, plugin_secret = 9 })
            steps.create(h, "task", { plugin_score = 2 })
            local page = admin.http("POST", "/" .. h.id .. "/query", { where = { field = "plugin_score", op = "gte", value = 2 }, order = { field = "plugin_score", dir = "desc" } })
            test.eq(page.status, 200); test.eq(page.body.data.items[1].id, a); test.eq(#page.body.data.items, 2)
            local db = assert(store.open())
            local names = tables.names(h.id)
            local id = assert(field(h, "plugin_score")).id
            local rows = assert(db:query("SELECT f" .. id .. "_number AS score FROM " .. names.item .. " ORDER BY f" .. id .. "_number DESC", {}))
            test.eq(tonumber(rows[1].score), 7)
            local indexes
            if db:type() == "postgres" then indexes = assert(db:query("SELECT indexdef AS definition FROM pg_indexes WHERE tablename = $1", { names.item }))
            else indexes = assert(db:query("SELECT sql AS definition FROM sqlite_master WHERE type = 'index' AND tbl_name = $1", { names.item })) end
            local found = false
            for _, row in ipairs(indexes) do if tostring(row.definition):find("f" .. id .. "_number", 1, true) then found = true end end
            test.is_true(found)
            db:release()
            assert(h.call("grant", { subject_id = member.id, mask = 3 }))
            local read = member.http("POST", "/" .. h.id .. "/get", { item = { id = a } })
            test.eq(read.status, 200); test.is_nil(read.body.data.item.values.plugin_secret)
            local denied = member.http("POST", "/" .. h.id .. "/query", { order = { field = "plugin_secret" } })
            test.eq(denied.status, 403); test.eq(denied.body.details.code, "field_denied")
            local write = assert(member.call("apply", { ops = { { op = "set", item = a, values = { plugin_secret = 3 } } } }, h.id))
            test.eq(write.outcomes[1].status, "denied")
        end)

        test.it("pins provider answers refreshes named plugins and backfills new indexes", function()
            local admin = scoped.admin()
            local h = scoped.board(admin)
            provider.seed(h.id, fragment())
            test.eq(activate(admin, h, "app:schema_provider", "activate").status, 200)
            test.eq(provider.observe(h.id).actor, admin.id)
            local f = assert(field(h, "dynamic"))
            local item = steps.create(h, "task", { dynamic = 4 })
            local changed = fragment()
            changed.fields[#changed.fields + 1] = { code = "added", form = "text", index = "key" }
            changed.item_types[1].fields[#changed.item_types[1].fields + 1] = "added"
            provider.seed(h.id, changed)
            local calls_before_read = provider.observe(h.id).calls
            assert(h.call("get_schema", {}))
            test.eq(provider.observe(h.id).calls, calls_before_read)
            local view = admin.http("POST", "/" .. h.id .. "/get_schema", { check_plugins = true })
            test.eq(view.status, 200); test.is_true(view.body.data.plugins[1].outdated)
            test.eq(assert(field(h, "dynamic")).index, "none")
            local calls = provider.observe(h.id).calls
            test.eq(admin.http("POST", "/" .. h.id .. "/plan_schema", { declaration = { fields = { { code = "note", form = "text" } } } }).status, 200)
            test.eq(provider.observe(h.id).calls, calls)
            test.eq(admin.http("POST", "/" .. h.id .. "/apply_schema", { declaration = { fields = { { code = "note", form = "text" } } } }).status, 200)
            test.eq(provider.observe(h.id).calls, calls)
            test.eq(activate(admin, h, "app:schema_provider", "activate").status, 200)
            test.eq(provider.observe(h.id).calls, calls)
            local plan = admin.http("POST", "/" .. h.id .. "/plan_schema", { declaration = { plugins = { { use = "app:schema_provider" } } } })
            test.eq(plan.status, 200); test.eq(plan.body.data.class, "additive")
            test.eq(activate(admin, h, "app:schema_provider", "refresh").status, 200)
            test.eq(assert(field(h, "dynamic")).id, f.id)
            local previous = json.decode(provider.observe(h.id).previous :: string)
            test.eq(previous.digest, view.body.data.plugins[1].digest)
            changed.fields[1].index = "number"
            provider.seed(h.id, changed)
            plan = admin.http("POST", "/" .. h.id .. "/plan_schema", { declaration = { plugins = { { use = "app:schema_provider" } } } })
            test.eq(plan.status, 200); test.eq(plan.body.data.class, "semantic")
            reindex.hold(h.id)
            test.eq(activate(admin, h, "app:schema_provider", "index").status, 200)
            local rebuilding = admin.http("POST", "/" .. h.id .. "/query", { order = { field = "dynamic" } })
            test.eq(rebuilding.status, 200); test.is_true(rebuilding.body.data.reindexing)
            test.eq(#rebuilding.body.data.items, 0)
            reindex.release()
            steps.wait_for("plugin index backfill", function(): boolean
                local page = admin.http("POST", "/" .. h.id .. "/query", { where = { field = "dynamic", op = "eq", value = 4 } })
                test.eq(page.status, 200)
                if page.body.data.reindexing then test.eq(#page.body.data.items, 0); return false end
                test.eq(page.body.data.items[1].id, item)
                return true
            end)
            local db = assert(store.open())
            local board = assert(store.board(db, h.id))
            test.not_nil(board.model.fields.added)
            test.eq(tonumber(assert(db:query("SELECT f" .. f.id .. "_number AS v FROM " .. tables.names(h.id).item, {}))[1].v), 4)
            db:release()
            local calls_before_config = provider.observe(h.id).calls
            test.eq(admin.http("POST", "/" .. h.id .. "/configure_plugin", { plugin = "app:schema_provider", config = { extra = true } }).status, 200)
            test.eq(provider.observe(h.id).calls, calls_before_config)
            test.is_true(admin.http("POST", "/" .. h.id .. "/get_schema", { check_plugins = true }).body.data.plugins[1].outdated)
        end)

        test.it("keeps plugin field ids and held values across an explicit rename", function()
            local admin = scoped.admin()
            local h = scoped.board(admin)
            provider.seed(h.id, fragment("number"))
            test.eq(activate(admin, h, "app:schema_provider").status, 200)
            local id = assert(field(h, "dynamic")).id
            local item = steps.create(h, "task", { dynamic = 6 })
            provider.seed(h.id, { fields = { { id = id, code = "renamed", form = "int", index = "number" } }, item_types = { { id = "task", fields = { "renamed" } } } })
            local plan = admin.http("POST", "/" .. h.id .. "/plan_schema", { declaration = { plugins = { { use = "app:schema_provider" } } } })
            test.eq(plan.status, 200); test.eq(plan.body.data.class, "cosmetic")
            test.eq(activate(admin, h, "app:schema_provider").status, 200)
            test.eq(assert(field(h, "renamed")).id, id)
            local page = admin.http("POST", "/" .. h.id .. "/query", { where = { field = "renamed", op = "eq", value = 6 }, order = { field = "renamed" } })
            test.eq(page.status, 200); test.eq(page.body.data.items[1].id, item)
            test.eq(page.body.data.items[1].values.renamed, 6)
            test.is_nil(field(h, "dynamic"))
        end)

        test.it("activates template contributions at create and removes their columns with the plugin", function()
            local admin = scoped.admin()
            local d = fixture.declaration(fixture.fresh_prefix())
            d.plugins = { { use = "app:schema_template" } }
            local response = admin.http("POST", "", { idempotency_key = uuid.v4(), declaration = d })
            test.eq(response.status, 200)
            local id = response.body.data.board_id
            local view = assert(admin.call("get_schema", {}, id))
            local score
            for _, f in ipairs(view.compiled.fields) do if f.code == "plugin_score" then score = f.id end end
            test.not_nil(score)
            local removed = admin.http("POST", "/" .. id .. "/apply_schema", { declaration = { plugins = {} } })
            test.eq(removed.status, 200)
            view = assert(admin.call("get_schema", {}, id))
            for _, plugin in ipairs(view.plugins) do test.eq(plugin.active, false) end
            for _, f in ipairs(view.compiled.fields) do test.is_true(f.code ~= "plugin_score") end
            local db = assert(store.open())
            local columns
            if db:type() == "postgres" then
                columns = assert(db:query("SELECT column_name AS name FROM information_schema.columns WHERE table_name = $1", { tables.names(id).item }))
            else columns = assert(db:query("PRAGMA table_info(" .. tables.names(id).item .. ")", {})) end
            for _, column in ipairs(columns) do test.is_true(column.name ~= "f" .. score .. "_number") end
            db:release()
        end)

        test.it("refuses code id and section collisions naming both owners", function()
            local admin = scoped.admin()
            local h = scoped.board(admin)
            local estimate = assert(field(h, "estimate")).id
            local cases = {
                { fields = { { code = "title", form = "text" } } },
                { fields = { { id = estimate, code = "other", form = "int" } } },
                { item_types = { { id = "task", process = "delivery", fields = {} } } },
                { processes = { { id = "delivery", states = {} } } },
                { relation_types = { { id = "blocks" } } },
            }
            for _, fragment in ipairs(cases) do
                provider.seed(h.id, fragment)
                for _, method in ipairs({ "plan_schema", "apply_schema" }) do
                    local _, err = h.call(method, { declaration = { plugins = { { use = "app:schema_provider" } } } })
                    test.not_nil(err); test.not_nil(err:details(), steps.detail(err) .. json.encode(fragment)); test.eq(err:details().code, "plugin_schema_collision")
                    test.eq(err:details().first, "board"); test.eq(err:details().second, "app:schema_provider")
                    local response = admin.http("POST", "/" .. h.id .. "/" .. method, { declaration = { plugins = { { use = "app:schema_provider" } } } })
                    test.eq(response.status, 400); test.eq(response.body.details.code, "plugin_schema_collision")
                end
            end
            provider.seed(h.id, { fields = { { code = "plugin_score", form = "int" } } })
            local _, err = h.call("plan_schema", { declaration = { plugins = { { use = "app:schema_template" }, { use = "app:schema_provider" } } } })
            test.eq(err:details().code, "plugin_schema_collision")
            test.eq(err:details().first, "app:schema_template"); test.eq(err:details().second, "app:schema_provider")
            test.eq(assert(h.call("get_schema", {})).generation, 1)
            test.eq(activate(admin, h, "app:schema_template").status, 200)
            local score_id = assert(field(h, "plugin_score")).id
            provider.seed(h.id, { fields = { { id = score_id, code = "stolen", form = "int" } } })
            local _, stolen = h.call("plan_schema", { declaration = { plugins = { { use = "app:schema_template" }, { use = "app:schema_provider" } } } })
            test.eq(stolen:details().code, "plugin_schema_collision")
            test.eq(stolen:details().first, "app:schema_template"); test.eq(stolen:details().second, "app:schema_provider")
            for _, method in ipairs({ "plan_schema", "apply_schema" }) do
                local claim = admin.http("POST", "/" .. h.id .. "/" .. method, { declaration = { fields = { { id = score_id, code = "board_claim", form = "int" } } } })
                test.eq(claim.status, 400)
                test.eq(claim.body.details.code, "plugin_schema_collision")
                test.eq(claim.body.details.first, "app:schema_template"); test.eq(claim.body.details.second, "board")
            end
        end)

        test.it("validates fragment shape vocabulary size and full new types", function()
            local admin = scoped.admin()
            local h = scoped.board(admin)
            for _, bad in ipairs({ { key_prefix = "BAD" }, { plugins = {} }, { fields = { { code = "bad", mystery = true } } },
                { item_types = { { id = "new_type", fields = {} } } }, { fields = { { code = "big", form = "text", config = { huge = string.rep("x", 262145) } } } } }) do
                provider.seed(h.id, bad)
                local _, err = h.call("plan_schema", { declaration = { plugins = { { use = "app:schema_provider" } } } })
                test.not_nil(err)
                test.eq(err:kind(), errors.INVALID)
                if bad.fields and bad.fields[1].code == "big" then test.eq(err:details().code, "plugin_fragment_too_large") end
                local response = activate(admin, h, "app:schema_provider")
                test.eq(response.status, 400)
                test.eq(assert(h.call("get_schema", {})).generation, 1)
            end
            provider.seed(h.id, { fields = { { code = "plugin_value", form = "int" } },
                processes = { { id = "plugin_flow", states = { { id = "open", category = "started" } }, initial = "open" } },
                item_types = { { id = "plugin_type", process = "plugin_flow", fields = { "plugin_value" } } }, relation_types = { { id = "plugin_link" } } })
            test.eq(activate(admin, h, "app:schema_provider").status, 200)
            local view = assert(h.call("get_schema", {}))
            for _, section in ipairs({ "item_types", "processes", "relation_types" }) do
                local found = false
                for _, entry in ipairs(view.compiled[section]) do if entry.plugin == "app:schema_provider" then found = true end end
                test.is_true(found, section)
            end
        end)

        test.it("refuses deactivation while own declarations or another plugin reference contributions", function()
            local admin = scoped.admin()
            local h = scoped.board(admin)
            provider.seed(h.id, { fields = { { code = "shared", form = "int" } },
                processes = { { id = "plugin_flow", states = { { id = "open", category = "started" } }, initial = "open" } },
                item_types = { { id = "plugin_type", process = "plugin_flow", fields = { "shared" } } }, relation_types = { { id = "plugin_link" } } })
            test.eq(activate(admin, h, "app:schema_provider").status, 200)
            local refs = {
                { item_types = { { id = "own", process = "delivery", fields = { "shared" } } } },
                { item_types = { { id = "own", process = "plugin_flow", fields = {} } } },
                { item_types = { { id = "own", process = "delivery", fields = {}, parent_types = { "plugin_type" } } } },
                { processes = { { id = "own_flow", initial = "open", states = { { id = "open", category = "started" } },
                    transitions = { { id = "check", from = { "open" }, to = "open", when = { rel = "plugin_link", q = "some", where = { field = "state", op = "eq", value = "open" } } } } } } },
            }
            for _, ref in ipairs(refs) do
                ref.plugins = {}
                local _, err = h.call("plan_schema", { declaration = ref })
                test.not_nil(err); test.eq(err:details().code, "plugin_seam_in_use"); test.not_nil(err:details().reference)
                test.eq(err:details().plugin, "app:schema_provider")
                local response = admin.http("POST", "/" .. h.id .. "/apply_schema", { declaration = ref })
                test.eq(response.status, 400); test.eq(response.body.details.code, "plugin_seam_in_use")
            end
            -- The provider keeps a reference to the template's field.
            local other = scoped.board(admin)
            provider.seed(other.id, { item_types = { { id = "dependent", process = "delivery", fields = { "plugin_score" } } } })
            assert(other.call("apply_schema", { declaration = { plugins = { { use = "app:schema_template" }, { use = "app:schema_provider" } } } }))
            local _, err = other.call("apply_schema", { declaration = { plugins = { { use = "app:schema_provider" } } } })
            test.eq(err:details().code, "plugin_seam_in_use"); test.eq(err:details().owner, "app:schema_provider")
        end)

        test.it("rebuilds from events while the provider is offline and replays unchanged receipts", function()
            local admin = scoped.admin()
            local h = scoped.board(admin)
            provider.seed(h.id, fragment())
            test.eq(activate(admin, h, "app:schema_provider", "first").status, 200)
            test.eq(activate(admin, h, "app:schema_provider", "same").status, 200)
            local before = assert(h.call("get_schema", {}))
            provider.seed(h.id, fragment(), "offline")
            local calls = provider.observe(h.id).calls
            local retry = activate(admin, h, "app:schema_provider", "same")
            test.eq(retry.status, 200); test.is_true(retry.body.data.replayed)
            test.eq(provider.observe(h.id).calls, calls)
            local conflict = admin.http("POST", "/" .. h.id .. "/apply_schema", { declaration = { plugins = { { use = "app:schema_provider" } } }, key = "same", source = "different" })
            test.eq(conflict.status, 409)
            local events = steps.events(h) :: { domain.RawEvent }
            local db = assert(store.open())
            local tx = assert(db:begin())
            local rebuilt = uuid.v4()
            local _, err = materializer.fold(tx, db:type(), rebuilt, events, events[#events].seq :: integer, 5000)
            test.is_nil(err, steps.detail(err))
            local board = assert(store.board(tx, rebuilt))
            test.eq(values.canonical(board.compiled), values.canonical(before.compiled))
            local generation = assert(store.generation(tx, rebuilt, board.generation))
            test.eq(values.canonical(generation.declaration), values.canonical(before.declaration))
            assert(tx:rollback()); db:release()
            test.eq(provider.observe(h.id).calls, calls)
        end)

        test.it("refuses source failures without changing the generation and tolerates offline checks", function()
            local admin = scoped.admin()
            local h = scoped.board(admin)
            for _, id in ipairs({ "app:schema_ungranted", "app:schema_unresolvable", "app:schema_provider" }) do
                for _, method in ipairs({ "plan_schema", "apply_schema" }) do
                    local before = assert(h.call("get_schema", {})).generation
                    local response = admin.http("POST", "/" .. h.id .. "/" .. method, { declaration = { plugins = { { use = id } } } })
                    test.is_true(response.status >= 400)
                    test.eq(assert(h.call("get_schema", {})).generation, before)
                end
            end
            for _, mode in ipairs({ "offline", "malformed" }) do
                provider.seed(h.id, fragment(), mode)
                for _, method in ipairs({ "plan_schema", "apply_schema" }) do
                    local _, err = h.call(method, { declaration = { plugins = { { use = "app:schema_provider" } } } })
                    test.not_nil(err); test.eq(err:kind(), mode == "offline" and errors.UNAVAILABLE or errors.INTERNAL)
                    test.eq(assert(h.call("get_schema", {})).generation, 1)
                end
            end
            provider.seed(h.id, fragment())
            test.eq(activate(admin, h, "app:schema_provider").status, 200)
            provider.seed(h.id, fragment(), "offline")
            local view = admin.http("POST", "/" .. h.id .. "/get_schema", { check_plugins = true })
            test.eq(view.status, 200); test.eq(view.body.data.plugins[1].lifecycle.state, "failed")
            local calls = provider.observe(h.id).calls
            test.eq(admin.http("POST", "/" .. h.id .. "/apply_schema", { declaration = { plugins = {} } }).status, 200)
            test.eq(provider.observe(h.id).calls, calls)
            test.is_nil(field(h, "dynamic"))
        end)
    end)
end
return { run = test.run_cases(define) }
