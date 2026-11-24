-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local registry = require("registry")
local funcs = require("funcs")
local json = require("json")
local time = require("time")
local sql = require("sql")
local clock = require("clock")
local core_prune = require("core_prune")
local channel = require("channel")
local http_client = require("http_client")
local gateway = require("gateway")
local fixture = require("fixture")
local steps = require("steps")
local call = steps.call
type Map = steps.Map
type PluginSchema = { plugins: { steps.PluginView } }
local NS = "app.review_plugin:"
local PLUGIN, REGISTER, AUDIT = NS .. "plugin", NS .. "register", NS .. "audit"
local VIEW = { type = "change_review", columns = { "title", "risk" }, config = { show_score = true } }

local function active(h: fixture.Handle): steps.PluginView
    local schema = call(h, "get_schema", {}) :: PluginSchema
    for _, plugin in ipairs(schema.plugins) do
        if plugin.plugin == PLUGIN then return plugin end
    end
    error("Change Review is missing from the board schema")
end

local function enable(h: fixture.Handle, threshold: integer?)
    call(h, "apply_schema", { declaration = {
        plugins = { { use = PLUGIN } }, scopes = { REGISTER, NS .. "exact" },
    }, plugin_configs = threshold and { [PLUGIN] = { threshold = threshold } } or nil })
end

local function create(h: fixture.Handle, title: string, risk: integer): string
    return steps.create(h, "change", { title = title, risk = risk })
end

local function settled(h: fixture.Handle, seq: integer, kind: string?)
    local expected = kind or REGISTER
    steps.wait_for("Change Review " .. expected .. " through " .. seq, function(): boolean
        local p = active(h).projections[expected]
        return p ~= nil and not p.parked and not p.bootstrapping and p.last_seq >= seq
    end)
end

local function body(h: fixture.Handle, kind: string): Map
    for _, p in ipairs(call(h, "plugin_projections", {}).projections) do
        if p.kind == kind then return assert(json.decode(p.body)) :: Map end
    end
    error("missing projection " .. kind)
end

local function rejected(h: fixture.Handle, method: string, input: Map, code: string)
    local result, err = h.call(method, input)
    test.is_nil(result)
    test.not_nil(err)
    test.eq(assert(err):details().code, code, steps.detail(err))
end

local function operand(config: Map): Map
    return { field = "risk", op = "eq", value = { ["$operand"] = { id = NS .. "threshold", config = config } } }
end

local function define()
    test.describe("third-party Change Review plugin", function()
        local originals: { [string]: registry.Entry } = {}
        test.before_each(function()
            originals = {}
            assert(funcs.call(NS .. "initialize"))
        end)
        test.after_each(function()
            for id, original in pairs(originals) do
                local changes = assert(registry.snapshot()):changes()
                if registry.get(id) then changes:update(original) else changes:create(original) end
                assert(changes:apply())
            end
        end)
        local function revise(id: string, edit: ((Map) -> ())?)
            originals[id] = originals[id] or assert(registry.get(id))
            local changes = assert(registry.snapshot()):changes()
            if edit then
                local current = assert(registry.get(id))
                edit(current.meta :: Map)
                changes:update(current)
            else changes:delete(id) end
            assert(changes:apply())
        end

        test.it("installs a pack and exercises the schema, index, queries, workflow, audit, tools and saved presentation", function()
            local h = fixture.board({ bare = true })
            local pack = { pack = NS .. "pack", expected_generation = 0 }
            test.eq(call(h, "pack_plan", pack).version, "1.0.0")
            pack.key = "install-change-review"
            call(h, "pack_apply", pack)
            steps.wait_for("Change Review pack view", function(): boolean
                return #call(h, "list_views", {}).views == 1
            end)
            local plugin = active(h)
            test.eq(plugin.interface_version, 1)
            test.eq(plugin.version, "risk-v1")
            local id = create(h, "Replace the load balancer", 4)
            local seq = call(h, "get", { item = { id = id } }).as_of :: integer
            settled(h, seq)
            settled(h, seq, AUDIT)
            test.eq(body(h, AUDIT).created, 1)
            test.eq(call(h, "query", { where = operand({ value = 4 }) }).items[1].id, id)
            test.eq(call(h, "query", { scopes = { { id = REGISTER, where = { risk = { gte = 3 } } } }, min_seq = seq }).items[1].id, id)
            test.eq(call(h, "query", { where = { match = "LOAD BALANCER" }, min_seq = seq }).items[1].id, id)
            test.eq(call(h, "query", { where = { match = "change:replace the load balancer" }, min_seq = seq }).items[1].id, id)
            local view = call(h, "list_views", {}).views[1]
            test.eq(view.view.type, "change_review")
            local wc = assert(registry.get(NS .. "component")).meta
            test.eq(assert(registry.get(NS .. "table")).meta.component_tag, wc.tag_name)
            local asset = assert(http_client.request("GET", gateway.url("/" .. wc.base_path .. "/" .. wc.entry_point)))
            test.eq(asset.status_code, 200)
            test.is_true(asset.body:find(wc.tag_name, 1, true) ~= nil)
            test.eq(call(h, "run_view", { view_id = view.view_id }).items[1].id, id)
            test.eq(plugin.tools[1], NS .. "changes")
            local reader = assert(registry.get("kickside.work.traits:work_readonly")).data
            local built = assert(h.executor:call(reader.build_func_id, reader.prompt, { board_id = h.id }))
            test.eq(built.tools[1].id, NS .. "changes")
            test.eq(assert(h.executor:call(NS .. "changes", { board_id = h.id })).items[1].id, id)
            test.eq(steps.one(h, { op = "transition", item = id, transition = "approve" }).status, "applied")
            test.eq(steps.get(h, id).item.state, "approved")
        end)

        test.it("rejects provider configuration when the new validator excludes a stored risk score", function()
            local h = fixture.board()
            enable(h, 1)
            local low = create(h, "Rotate deployment keys", 2)
            local old = call(h, "get_schema", {})
            local config = { threshold = 4 }
            local proposal = { declaration = { plugins = { { use = PLUGIN } } }, plugin_configs = { [PLUGIN] = config } }
            local plan = call(h, "plan_schema", proposal)
            test.eq(plan.class, "refused")
            test.eq(plan.refused[1].what, "config.range")
            rejected(h, "apply_schema", proposal, "migration_required")
            rejected(h, "configure_plugin", { plugin = PLUGIN, config = config }, "migration_required")
            test.eq(call(h, "plugin_context", { plugin = PLUGIN }).config.threshold, 1)
            test.eq(call(h, "get_schema", {}).generation, old.generation)
            test.eq(steps.get(h, low).item.values.risk, 2)
        end)

        test.it("refuses invalid configuration and interface changes without adopting a malformed plugin", function()
            local h = fixture.board()
            local original = call(h, "get_schema", {}).generation
            rejected(h, "apply_schema", { declaration = { plugins = { { use = PLUGIN } } },
                plugin_configs = { [PLUGIN] = { threshold = 0 } } }, "plugin_config_invalid")
            revise(PLUGIN, function(meta) meta.interface_version = 2 end)
            rejected(h, "apply_schema", { declaration = { plugins = { { use = PLUGIN } } } }, "plugin_interface_version_unsupported")
            test.eq(call(h, "get_schema", {}).generation, original)
        end)

        test.it("isolates callback faults from ordinary edits, reads and the other plugin", function()
            local h = fixture.board()
            call(h, "apply_schema", { declaration = { plugins = { { use = PLUGIN }, { use = "app:folding_plugin" } } } })
            local id = create(h, "Routine", 3)
            local approved = create(h, "Already reviewed", 4)
            test.eq(steps.one(h, { op = "transition", item = approved, transition = "approve" }).status, "applied")
            for _, mode in ipairs({ "error", "timeout", "wrong" }) do
                test.eq(steps.one(h, { op = "set", item = id, values = { title = mode } }).status, "applied")
                local outcome = steps.one(h, { op = "transition", item = id, transition = "approve" })
                test.eq(outcome.status, "unavailable")
                test.eq(steps.get(h, id).item.state, "proposed")
                test.eq(steps.one(h, { op = "set", item = approved, values = { title = mode } }).status, "applied")
                test.eq(steps.get(h, approved).item.findings[1].code, "guard_unavailable")
                local result, err = h.call("query", { where = operand({ mode = mode }) })
                test.is_nil(result); test.not_nil(err)
            end
            local core = steps.create(h, "task", { title = "Core still writes" })
            local seq = call(h, "get", { item = { id = core } }).as_of :: integer
            steps.wait_for("other plugin core-item fold", function(): boolean
                local schema = call(h, "get_schema", {}) :: PluginSchema
                for _, plugin in ipairs(schema.plugins) do
                    if plugin.plugin == "app:folding_plugin" then
                        return plugin.projections["app:item_fold"].last_seq >= seq
                    end
                end
                return false
            end)
            test.eq(#call(h, "query", {}).items, 3)
        end)

        test.it("terminates an operand that never returns and releases the read", function()
            local h = fixture.board()
            enable(h)
            create(h, "Routine", 3)
            local future = assert(h.executor:async("app:work_call", { op = "query", board_id = h.id,
                request = { where = operand({ mode = "never" }) } }))
            local deadline = time.after("5s")
            local selected = channel.select({ future:response():case_receive(), deadline:case_receive() })
            if selected.channel == deadline then future:cancel() end
            test.is_true(selected.channel ~= deadline, "Work let an operand exceed the caller's deadline")
            local _, err = future:result()
            test.eq(assert(err):kind(), errors.TIMEOUT)
            test.eq(assert(err):details().code, "plugin_hook_timeout")
            test.eq(#call(h, "query", {}).items, 1)
        end)

        test.it("bounds a stuck guard on reads and commands and records a stuck check", function()
            local h = fixture.board()
            enable(h)
            local item = create(h, "never", 5)
            local approved = create(h, "Normal", 4)
            test.eq(steps.one(h, { op = "transition", item = approved, transition = "approve" }).status, "applied")
            rejected(h, "get", { item = { id = item }, include = { "transitions" } }, "plugin_hook_timeout")
            local refused = steps.one(h, { op = "transition", item = item, transition = "approve" })
            test.eq(refused.status, "unavailable")
            test.eq(refused.error.details.code, "plugin_hook_timeout")
            test.eq(steps.get(h, item).item.state, "proposed")
            test.eq(steps.one(h, { op = "set", item = approved, values = { title = "never" } }).status, "applied")
            test.eq(steps.get(h, approved).item.findings[1].code, "guard_unavailable")
        end)

        test.it("refuses a scope that names an undeclared projection", function()
            local h = fixture.board()
            revise(REGISTER, function(meta) meta.projection = NS .. "typo" end)
            local request = { declaration = { plugins = { { use = PLUGIN } }, scopes = { REGISTER } } }
            rejected(h, "plan_schema", request, "plugin_scope_projection_unknown")
            rejected(h, "apply_schema", request, "plugin_scope_projection_unknown")
            test.eq(call(h, "get_schema", {}).generation, 1)
        end)

        test.it("rejects an oversized guard finding before it becomes a command or stored check result", function()
            local h = fixture.board()
            enable(h)
            local id = create(h, "large", 4)
            local approved = create(h, "Normal", 4)
            test.eq(steps.one(h, { op = "transition", item = approved, transition = "approve" }).status, "applied")
            local outcome = steps.one(h, { op = "transition", item = id, transition = "approve" })
            test.eq(outcome.status, "unavailable")
            test.eq(outcome.error.details.code, "guard_result_invalid")
            test.eq(steps.one(h, { op = "set", item = approved, values = { title = "large" } }).status, "applied")
            test.eq(steps.get(h, approved).item.findings[1].code, "guard_unavailable")
            rejected(h, "query", { where = operand({ mode = "large" }) }, "operand_result_invalid")
        end)

        test.it("reports a removed view type on run and preserves the saved reference for repair", function()
            local h = fixture.board()
            enable(h)
            local item = create(h, "Roll database", 7)
            local view = call(h, "create_view", { board_id = h.id, title = "Tracked changes", view = VIEW })
            test.eq(#call(h, "run_view", { view_id = view.view_id }).items, 1)
            revise(NS .. "table")
            rejected(h, "run_view", { view_id = view.view_id }, "view_type_unavailable")
            test.eq(call(h, "get_view", { view_id = view.view_id }).view.type, "change_review")
            test.eq(steps.get(h, item).item.values.risk, 7)
            call(h, "save_view", { view_id = view.view_id, view = { type = "list", columns = { "title", "risk" } } })
            test.eq(#call(h, "run_view", { view_id = view.view_id }).items, 1)
        end)

        test.it("preserves data and reports references when the installed module disappears", function()
            local h = fixture.board()
            enable(h)
            local item = create(h, "Replace a certificate", 5)
            local seq = call(h, "get", { item = { id = item } }).as_of :: integer
            settled(h, seq)
            local view = call(h, "create_view", { board_id = h.id, title = "Change register", view = VIEW })
            local unused = fixture.board()
            enable(unused)
            local attachment = active(unused).attachment_id :: string
            steps.wait_for("unused attachment", function(): boolean return active(unused).lifecycle.state == "ready" end)
            revise(PLUGIN)
            revise(NS .. "table")
            local missing = active(h)
            test.is_true(missing.active)
            test.is_false(missing.installed)
            test.eq(missing.problem.code, "unknown_plugin")
            test.eq(missing.lifecycle.state, "failed")
            test.eq(steps.get(h, item).item.values.risk, 5)
            rejected(h, "run_view", { view_id = view.view_id }, "view_type_unavailable")
            test.eq(call(h, "get_view", { view_id = view.view_id }).view.type, "change_review")
            local removal = { declaration = { plugins = {}, scopes = {} } }
            test.eq(call(h, "plan_schema", removal).class, "refused")
            rejected(h, "apply_schema", removal, "migration_required")
            test.eq(steps.one(h, { op = "create", type = "task", values = { title = "Unrelated work" } }).status, "applied")
            call(unused, "apply_schema", removal)
            steps.deleted(attachment)
            for _, projection in ipairs(call(unused, "plugin_projections", {}).projections) do
                test.is_true(projection.projection_key ~= "kickside.work.plugin:" .. PLUGIN)
            end
        end)

        test.it("rejects two owners of the same field and attributes the conflict in declaration order", function()
            local h = fixture.board()
            local competitor = NS .. "competing_plugin"
            for _, order in ipairs({ { PLUGIN, competitor }, { competitor, PLUGIN } }) do
                local plan, err = h.call("plan_schema", { declaration = { plugins = { { use = order[1] }, { use = order[2] } } } })
                test.is_nil(plan)
                local details = assert(err):details()
                test.eq(details.code, "plugin_schema_collision")
                test.eq(details.reference, "risk")
                test.eq(details.first, order[1])
                test.eq(details.second, order[2])
            end
            test.eq(call(h, "get_schema", {}).generation, 1)
        end)

        test.it("refuses duplicate scope ids before admitting the resolver twice", function()
            local h = fixture.board()
            rejected(h, "plan_schema", { declaration = {
                plugins = { { use = PLUGIN } }, scopes = { NS .. "exact", NS .. "exact" },
            } }, "plugin_scope_duplicate")
        end)

        test.it("upgrades and downgrades the declared projection revision with bounded state replays", function()
            local h = fixture.board()
            enable(h)
            for batch = 1, 3 do
                local ops: { Map } = {}
                for index = 1, 70 do
                    ops[#ops + 1] = { op = "create", type = "change", values = {
                        title = "Import change " .. ((batch - 1) * 70 + index), risk = 3,
                    } }
                end
                local result = call(h, "apply", { ops = ops })
                for _, outcome in ipairs(result.outcomes) do test.eq(outcome.status, "applied") end
            end
            local head = call(h, "get_schema", {}).as_of :: integer
            settled(h, head)
            settled(h, head, AUDIT)
            test.eq(body(h, AUDIT).created, 210)
            local attachment = active(h).attachment_id
            local prior = body(h, REGISTER).token
            for _, revision in ipairs({ 2, 1 }) do
                revise(PLUGIN, function(meta) meta.projections[1].revision = revision end)
                assert(h.call("plugin_sync", {}))
                steps.wait_for("state projection revision " .. revision, function(): boolean
                    local got = body(h, REGISTER)
                    local health = active(h).projections[REGISTER]
                    return got.worker_config.revision == revision and not health.bootstrapping and not health.parked
                end)
                rejected(h, "plugin_feed", { plugin = PLUGIN, kind = REGISTER, token = prior }, "invalid_request")
                local projected = body(h, REGISTER)
                test.is_true(projected.pages >= 2)
                test.is_true(projected.largest_page <= 200)
                test.eq(active(h).attachment_id, attachment)
                test.eq(body(h, AUDIT).created, 210)
                test.eq(call(h, "count", { scopes = { { id = REGISTER, where = { risk = { eq = 3 } } } } }).total, 210)
                prior = projected.token
            end
        end)

        test.it("reports a retained-history gap while the state index and core remain usable", function()
            local h = fixture.board()
            local old = steps.create(h, "task", {})
            local db = assert(sql.get("app:db"))
            local gap = assert(core_prune.prune_thread(db, h.id, { cutoff = clock.offset(86400) }))
            db:release()
            local floor = gap.max_pruned_seq + 1
            revise(PLUGIN, function(meta) meta.projections[2].start_seq = floor - 1 end)
            enable(h)
            steps.wait_for("Change Review retention gap", function(): boolean return active(h).lifecycle.state == "failed" end)
            local failure = active(h).lifecycle.error
            test.eq(failure.code, "plugin_projection_gap")
            test.eq(failure.floor, floor)
            test.eq(steps.get(h, old).item.id, old)
            local item = create(h, "Retained change", 3)
            local seq = call(h, "get", { item = { id = item } }).as_of :: integer
            settled(h, seq)
            test.eq(call(h, "query", { where = { match = "retained" }, min_seq = seq }).items[1].id, item)
            revise(PLUGIN, function(meta) meta.projections[2].start_seq = floor end)
            assert(h.call("plugin_sync", {}))
            settled(h, seq, AUDIT)
            test.eq(active(h).lifecycle.state, "ready")
            test.eq(body(h, AUDIT).created, 1)
        end)

        test.it("keeps projection work and queries board-local as the plugin fleet grows", function()
            local boards: { fixture.Handle } = {}
            local items: { string } = {}
            for index = 1, 12 do
                local h = fixture.board()
                enable(h)
                boards[index] = h
                items[index] = create(h, "Fleet change " .. index, 5)
            end
            for index, h in ipairs(boards) do
                local seq = call(h, "get", { item = { id = items[index] } }).as_of :: integer
                settled(h, seq)
                settled(h, seq, AUDIT)
                test.eq(body(h, AUDIT).created, 1)
                test.eq(body(h, REGISTER).largest_page, 1)
                local found = call(h, "query", { scopes = { { id = REGISTER, where = { risk = { eq = 5 } } } },
                    limit = 1, min_seq = seq, budget = { rows = 2 } })
                test.eq(#found.items, 1)
                test.eq(found.items[1].id, items[index])
            end
        end)

        test.it("admits a named plugin feed independently of unrelated attachment data", function()
            local h = fixture.board()
            local neighbour = "app:folding_plugin"
            call(h, "apply_schema", { declaration = { plugins = { { use = PLUGIN }, { use = neighbour } } } })
            local id = create(h, "Change ahead of the index", 3)
            local seq = call(h, "get", { item = { id = id } }).as_of :: integer
            settled(h, seq)
            steps.wait_for("neighbour attachment registration", function(): boolean
                return call(h, "plugin_context", { plugin = neighbour }).lifecycle.state == "ready"
            end)
            local db = assert(sql.get("app:db"))
            local stored = assert(db:query("SELECT config FROM kickside_work_plugin WHERE board_id = $1 AND plugin = $2", { h.id, neighbour }))
            assert(db:execute("UPDATE kickside_work_plugin SET config = '{' WHERE board_id = $1 AND plugin = $2", { h.id, neighbour }))
            local feed, ferr = h.call("plugin_feed", { plugin = PLUGIN, kind = REGISTER })
            local context, cerr = h.call("plugin_context", { plugin = PLUGIN })
            assert(db:execute("UPDATE kickside_work_plugin SET config = $1 WHERE board_id = $2 AND plugin = $3", { stored[1].config, h.id, neighbour }))
            db:release()
            test.eq(assert(feed, steps.detail(ferr)).changes[1].item_id, id)
            test.eq(assert(context, steps.detail(cerr)).interface_version, 1)
            test.eq(steps.get(h, id).item.values.risk, 3)
        end)

        test.it("reports a schema provider failure separately from attachment setup", function()
            local h = fixture.board()
            enable(h)
            local view = call(h, "get_schema", {})
            settled(h, view.as_of :: integer)
            revise(PLUGIN, function(meta) meta.schema = { provider = NS .. "missing_provider" } end)
            local checked = call(h, "get_schema", { check_plugins = true }) :: PluginSchema
            for _, plugin in ipairs(checked.plugins) do
                if plugin.plugin == PLUGIN then
                    test.eq(plugin.lifecycle.state, "failed")
                    test.eq(assert(plugin.lifecycle.error).source, "schema_provider")
                    return
                end
            end
            error("Change Review is missing from the checked schema")
        end)

        test.it("rolls back a failed index batch and replays a parked state projection under admin control", function()
            local h = fixture.board()
            enable(h)
            local item = create(h, "Normal", 5)
            local prior = call(h, "get", { item = { id = item } }).as_of :: integer
            settled(h, prior)
            local old = body(h, REGISTER)
            local crash = steps.one(h, { op = "set", item = item, values = { risk = 6, title = "Crash after write" } })
            test.eq(crash.status, "applied")
            steps.wait_for("crashed review projection", function(): boolean return active(h).projections[REGISTER].parked == true end)
            local seq = call(h, "get", { item = { id = item } }).as_of :: integer
            rejected(h, "query", { where = { match = "crash" }, min_seq = seq }, "projection_pending")
            test.eq(body(h, REGISTER).token, old.token)
            test.eq(#call(h, "query", { scopes = { { id = REGISTER, where = { risk = { eq = 5 } } } } }).items, 1)
            test.eq(steps.one(h, { op = "set", item = item, values = { title = "Corrected" } }).status, "applied")
            local before = active(h)
            local reader, reader_id = fixture.user(h)
            assert(h.call("grant", { subject_id = reader_id, mask = 1 }))
            local _, denied = reader("configure_plugin", { plugin = PLUGIN })
            test.eq(assert(denied):kind(), errors.PERMISSION_DENIED)
            local retry = call(h, "configure_plugin", { plugin = PLUGIN })
            test.eq(retry.attachment_id, before.attachment_id)
            local repaired = call(h, "get", { item = { id = item } }).as_of :: integer
            settled(h, repaired)
            test.eq(assert(json.encode(active(h).config)), assert(json.encode(before.config)))
            test.eq(#call(h, "query", { where = { match = "corrected" }, min_seq = repaired }).items, 1)
        end)
    end)
end
return { run = test.run_cases(define) }
