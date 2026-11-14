-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local registry = require("registry")
local json = require("json")
local consts = require("consts")
local fixture = require("fixture")
local values = require("values")
local shape = require("shape")
type Map = { [string]: unknown }
local NS = "kickside.work.traits:"
local METHODS = {
    list_boards = "board.list", get_schema = "board.get_schema", find_items = "board.query", get_item = "board.get",
    count = "board.count", explain = "board.explain", list_history = "board.list_history", get_time_in_state = "board.get_time_in_state",
    list_links = "board.list_links", list_comments = "board.list_comments", list_stage_runs = "board.list_stage_runs", list_changes = "board.list_changes", bulk_status = "board.bulk_status",
    move_status = "board.move_status", list_packs = "board.list_packs", list_views = "view.list", get_view = "view.get", run_view = "view.run",
    apply = "board.apply", transition = "board.apply", comment = "board.apply", approve = "board.approve", report = "board.report",
    bulk = "board.bulk", cancel_bulk = "board.cancel_bulk", create_view = "view.create", save_view = "view.save", rename_view = "view.rename", delete_view = "view.delete",
    create_board = "board.create", update_board = "board.update", plan_schema = "board.plan_schema", apply_schema = "board.apply_schema",
    pack_plan = "board.pack_plan", pack_apply = "board.pack_apply", configure_plugin = "board.configure_plugin", plan_move = "board.plan_move", move = "board.move",
}
local EXCLUDED = {
    ["board.plugin_feed"] = "Host projection feed adds no agent tool.",
    ["board.plugin_context"] = "Host service admission adds no agent tool.",
    ["board.schema_options"] = "Host configuration discovery adds no agent tool.",
    ["board.resume_migration"] = "Maintenance resumes a parked migration.",
    ["packs.list"] = "Fleet provenance belongs to installation operations.",
    ["schema_provider.resolve"] = "Provider seam resolves declarations during schema preparation.",
    ["search_resolver.resolve_ids"] = "Provider seam resolves search candidates during reads.",
}
local function described(node: Map, path: string, shallow: boolean?)
    for name, raw in pairs(node.properties or {}) do
        local property = raw :: Map
        test.is_true(type(property.description) == "string" and #property.description > 0 and #property.description <= 200, path .. "." .. name)
        if not shallow then described(property, path .. "." .. name) end
    end
    if shallow then return end
    for _, key in ipairs({ "items", "additionalProperties" }) do
        if type(node[key]) == "table" then described(node[key] :: Map, path .. "." .. key) end
    end
    for _, key in ipairs({ "anyOf", "oneOf", "allOf" }) do
        for i, branch in ipairs(node[key] or {}) do described(branch :: Map, path .. "." .. key .. i) end
    end
end

local function define()
    test.describe("Work trait conformance", function()
        test.it("covers every contract method or records its explicit exclusion and keeps schemas equal", function()
            local methods = {}
            for _, entry in ipairs(assert(registry.find({ [".kind"] = "contract.definition" }))) do
                if entry.id:match("^kickside%.work:") then
                    for _, method in ipairs(entry.data.methods) do methods[entry.id:match(":(.+)$") .. "." .. method.name] = method end
                end
            end
            local ids, aliases, covered, reads = {}, {}, {}, {}
            for _, id in ipairs(assert(registry.get(NS .. "work_readonly")).data.tools) do reads[id] = true end
            for _, name in ipairs({ "work_readonly", "work", "work_admin" }) do
                local trait = assert(registry.get(NS .. name))
                for _, id in ipairs(trait.data.tools) do
                    local method = METHODS[id:sub(#NS + 1)]
                    test.not_nil(method, id)
                    test.not_nil(methods[method], id)
                    local tool = assert(registry.get(id))
                    test.eq(tool.meta.type, "tool")
                    test.eq(values.canonical(assert(json.decode(tool.meta.input_schema))), values.canonical(assert(json.decode(methods[method].input_schemas[1].definition))), id)
                described(assert(json.decode(tool.meta.input_schema)) :: Map, tool.id)
                described(assert(json.decode(methods[method].output_schemas[1].definition)) :: Map, tool.id, true)
                local output = assert(json.decode(tool.meta.output_schema))
                described(output :: Map, tool.id, true)
                local expected = assert(json.decode(methods[method].output_schemas[1].definition))
                expected.properties.success = output.properties.success
                expected.required = expected.required or {}
                expected.required[#expected.required + 1] = "success"
                test.eq(values.canonical(output), values.canonical(expected), tool.id)
                    test.not_nil(tool.meta.output_schema, id)
                    test.not_nil(tool.meta.title, id)
                    test.is_true(#tool.meta.llm_description > 40, id)
                local _, sentences = tool.meta.llm_description:gsub("%.", "")
                test.is_true(sentences <= 2, tool.id)
                    test.is_true(tool.meta.llm_alias:match("^Work[A-Z]%w+$") ~= nil, id)
                    test.eq(#tool.meta.mcp.required_scopes, 1, id)
                    test.eq(tool.meta.mcp.required_scopes[1], reads[id] and "state.read" or "state.write", id)
                    if name == "work_readonly" then test.eq(tool.meta.mcp.required_scopes[1], "state.read", id) end
                    if not ids[id] then test.is_nil(aliases[tool.meta.llm_alias], id); aliases[tool.meta.llm_alias] = id end
                    ids[id], covered[method] = true, true
                end
            end
            for key in pairs(methods) do test.is_true(covered[key] == true or EXCLUDED[key] ~= nil, key) end
            for key, reason in pairs(EXCLUDED) do test.not_nil(methods[key], key); test.is_nil(covered[key], key); test.is_true(#reason > 20) end
            local policy = assert(registry.get("kickside.work.security:work_tools"))
            local resources = {}
            for _, id in ipairs(policy.data.policy.resources) do test.is_nil(resources[id], id); resources[id] = true end
            local capabilities = {}
            for id in pairs(ids) do capabilities[id] = true end
            for _, name in ipairs({ "work", "work_readonly", "work_admin", "build_work", "build_readonly" }) do capabilities[NS .. name] = true end
            test.eq(values.canonical(resources), values.canonical(capabilities))
        end)
        test.it("declares unified plugin output and durable comment schemas", function()
            local methods = {}
            for _, method in ipairs(assert(registry.get("kickside.work:board")).data.methods) do
                methods[method.name] = assert(json.decode(method.output_schemas[1].definition))
            end
            local plugin = methods.get_schema.properties.plugins.items
            test.not_nil(plugin.properties.lifecycle)
            test.not_nil(plugin.properties.projections)
            test.not_nil(plugin.properties.problem)
            test.is_nil(plugin.properties.use)
            test.is_nil(plugin.properties.revision)
            test.is_nil(plugin.properties.projection)
            test.eq(methods.plugin_context.additionalProperties, false)
            test.not_nil(methods.plugin_context.properties.config)
            test.not_nil(methods.schema_options.properties.plugins.items.properties.config_schema)
            test.not_nil(methods.list_changes.properties.items.items.properties.comments)
            local h = fixture.board()
            local result = assert(h.call("get_schema", {}))
            local err = shape.check(shape.tolerant(methods.get_schema), result, "plugin schema output")
            test.is_nil(err, tostring(err))
        end)
        test.it("uses the accepted closed declaration sets and exposes accepted formula and process inputs", function()
            local methods = {}
            for _, method in ipairs(assert(registry.get("kickside.work:board")).data.methods) do methods[method.name] = assert(json.decode(method.input_schemas[1].definition)) end
            local function same(node: Map, set: Map)
                local got = {}
                for _, value in ipairs(node.enum or {}) do test.is_nil(got[value]); got[value] = true end
                test.eq(values.canonical(got), values.canonical(set))
            end
            local declaration_text: string? = nil
            for _, name in ipairs({ "create", "plan_schema", "apply_schema" }) do
                local text = values.canonical(methods[name].properties.declaration)
                if declaration_text then test.eq(text, declaration_text) else declaration_text = text end
                local declaration = methods[name].properties.declaration.anyOf[1].properties
                local field = declaration.fields.anyOf[1].items.properties
                same(field.form, consts.FORMS); same(field.cardinality, consts.CARDINALITIES); same(field.index, consts.INDEXES)
                same(field.options.anyOf[1].items.properties.category, consts.CATEGORIES)
                test.not_nil(field.expression)
                local process = declaration.processes.items.properties
                same(process.migration, consts.MIGRATIONS)
                same(process.states.items.properties.kind, consts.STATE_KINDS)
                same(process.states.items.properties.category, consts.CATEGORIES)
                same(process.states.items.properties.assign.items.properties.kind, consts.PRINCIPAL_KINDS)
                test.not_nil(process.states.items.properties.run)
                test.not_nil(process.states.items.properties.timers)
                test.not_nil(process.transitions.items.properties.guards)
                test.not_nil(process.initial)
            end
            same(methods.report.properties.outcome, consts.STAGE_OUTCOMES)
            test.not_nil(methods.update.properties.key_prefix)
            test.not_nil(methods.apply.properties.trace_context)
            test.not_nil(methods.apply.properties.ops.items.properties.visit)
            test.not_nil(methods.apply.properties.ops.items.properties.outcome)
            test.is_nil(methods.bulk.properties.ops_template.items.properties.item.type)
            test.not_nil(methods.bulk.properties.ops_template.items.properties.item.description:find("bulk_template_item",1,true))
            test.is_nil(methods.apply.properties.ops.items.properties.target.type)
            test.is_nil(methods.apply.properties.ops.items.properties.mentions.type)
            test.not_nil(methods.query.properties.boards)
            test.not_nil(methods.query.properties.cross_after)
            test.is_nil(methods.explain.properties.boards)
            test.is_nil(methods.explain.properties.cross_after)
            test.eq(values.canonical(methods.query.properties.after.properties.v.type), values.canonical({ "string", "integer" }))
            same(methods.query.properties.order.anyOf[1].properties.dir, { asc = true, desc = true })
            same(methods.apply.properties.mode, { atomic = true, independent = true })
            same(methods.approve.properties.decision, { approve = true, reject = true })
            for _, name in ipairs({ "get", "query", "count", "list_changes", "list_history", "list_links", "list_comments", "list_stage_runs", "explain" }) do
                test.eq(methods[name].properties.min_seq.description, methods.get.properties.min_seq.description)
                test.eq(values.canonical(methods[name].properties.budget), values.canonical(methods.get.properties.budget))
                test.eq(methods[name].properties.board_id.description, methods.get.properties.board_id.description)
            end
            test.eq(methods.apply.properties.ops.items.properties.item.type, "string")
            test.eq(methods.get.properties.item.type, "object")
            test.eq(methods.get_time_in_state.properties.after.type, "integer")
            test.eq(methods.get_time_in_state.properties.after.description, methods.list_changes.properties.cursor.description)
        end)
        test.it("compiles working and administration traits with each registry tool exactly once", function()
            local h = fixture.board()
            local result, err = h.executor:call("app:compile_work_agent", { board_id = h.id })
            assert(not err, tostring(err))
            local seen = {}
            for _, tool in pairs(result.tools) do test.is_nil(seen[tool.registry_id]); seen[tool.registry_id] = true end
            for name in pairs(METHODS) do test.is_true(seen[NS .. name]) end
        end)
    end)
end
return { run = test.run_cases(define) }
