-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local consts = require("consts")
local failure = require("failure")
local store = require("store")
local schema = require("schema")
local declaration = require("declaration")
local seams = require("seams")
local scopes = require("scopes")
local links = require("links")
local plugins = require("plugins")
local attachments = require("attachments")
local terms = require("terms")
local values = require("values")
local types = require("types")
local changes_of = require("changes")

local M = {}
local EV = consts.EVENTS
local invalid = failure.invalid

function M.require_generation(expected: integer?, generation: integer): error?
    if expected ~= nil and expected ~= generation then
        return errors.new({ kind = errors.CONFLICT, message = "schema generation changed",
            details = { code = "schema_generation_conflict", expected_generation = expected, generation = generation } })
    end
    return nil
end

type SchemaPlan = { generation: integer, class: string, changes: { types.SchemaChange }, refused: { types.SchemaChange },
    effective: types.Declaration, compiled: types.Compiled, configs: { [string]: types.JsonObject }, unchanged: boolean }

-- Index checks reuse counts after classification rules out representation changes.
local function incompatible_index(previous: types.Compiled, compiled: types.Compiled,
    usage: { [integer]: types.AttributeUsage }): types.SchemaChange?
    local by_id = previous.by_id or {}
    local refused: types.Attribute? = nil
    local count = 0
    for _, attr in pairs(compiled.attributes) do
        local before, used = by_id[attr.id], usage[attr.id]
        if before and used and before.index ~= attr.index and (attr.index == "key" or attr.index == "number") then
            local violations = attr.index == "number" and attr.cardinality == "one" and used.order_violations or used.key_violations
            if violations > 0 and (not refused or attr.id < refused.id) then
                refused, count = attr, violations
            end
        end
    end
    if refused then
        return { code = refused.code, class = "refused",
            what = "incompatible stored values for the " .. refused.index .. " index in " .. count .. " live product(s)" }
    end
    return nil
end

local function plan_schema(db: types.Executor, catalog: types.Catalog?, catalog_id: string, request: types.SchemaRequest): (SchemaPlan?, error?)
    local generation = catalog and catalog.generation or 0
    local conflict = M.require_generation(request.expected_generation, generation)
    if conflict then return nil, conflict end
    local prev = catalog and catalog.compiled or nil
    local prev_declaration: types.Declaration? = nil
    if catalog then
        local stored, derr = store.declaration(db, catalog_id, generation)
        if derr then return nil, derr end
        prev_declaration = stored
    end
    local shape_err = declaration.check_shape(request.declaration)
    if shape_err then return nil, shape_err end
    local incoming, rerr = declaration.resolve_plugins(request.declaration, prev_declaration,
        function(id: string, entry: types.PluginEntry, held: types.PluginEntry?): (types.PluginSchema?, error?)
            return plugins.resolve(catalog_id, id, entry, held, request.plugin_configs and request.plugin_configs[id] or (catalog and catalog.plugin_state[id] and catalog.plugin_state[id].config or nil))
        end)
    if rerr or not incoming then return nil, rerr end
    local effective, merr = declaration.merge(prev_declaration, incoming)
    if merr or not effective then return nil, merr end
    local next_compiled, cerr = schema.compile(prev, effective, {
        type_of = seams.load_type, check_digest = seams.check_digest, link_kind = links.has_kind,
        plugin = function(id: string): error?
            local _, err = plugins.load(id)
            return err
        end,
        scope = function(id: string): (boolean, error?)
            local scope, err = scopes.load(id)
            return scope ~= nil, err
        end,
    }, prev_declaration)
    if cerr or not next_compiled then return nil, cerr end
    local aerr = plugins.admit(next_compiled, prev)
    if aerr then return nil, aerr end
    if catalog then
        for id, intent in pairs(catalog.plugin_state) do
            if intent.active and intent.attachment_id and not next_compiled.plugins[id] then
                local cleanup_err = attachments.check_cleanup(intent.attachment_id)
                if cleanup_err then return nil, cleanup_err end
            end
        end
    end
    if prev then
        local herr = terms.check_hierarchy_change(db, catalog_id, prev.vocabularies, next_compiled.vocabularies)
        if herr then return nil, herr end
    end
    local compiled: types.Compiled = next_compiled
    local configs: { [string]: types.JsonObject } = {}
    for id, own in pairs(request.plugin_configs or {}) do
        if not next_compiled.plugins[id] or (prev and prev.plugins[id]) then
            return nil, invalid("plugin_configs names an activating plugin", { code = "plugin_config_invalid", plugin = id })
        end
    end
    for id in pairs(next_compiled.plugins) do
        if not prev or not prev.plugins[id] then
            local plugin, lerr = plugins.load(id)
            if lerr or not plugin then return nil, lerr end
            local config, eerr = plugins.effective(plugin, request.plugin_configs and request.plugin_configs[id])
            if eerr or not config then return nil, eerr end
            configs[id] = config
        end
    end
    declaration.stamp(effective, compiled)
    if prev and prev_declaration and prev.digest == compiled.digest and values.equal(prev_declaration, effective) then
        return { generation = generation, class = "unchanged", changes = {}, refused = {}, effective = effective, compiled = compiled, configs = configs, unchanged = true }, nil
    end
    local usage: { [integer]: types.AttributeUsage } = {}
    if catalog then
        local used, uerr = store.usage(db, catalog_id)
        if uerr or not used then return nil, uerr end
        usage = used
    end
    local product_usage: { [integer]: integer } = {}
    for id, used in pairs(usage) do product_usage[id] = used.products end
    local populated = catalog ~= nil and catalog.product_count > 0
    local family_occupied: { [string]: boolean } = {}
    if populated and prev then
        for code in pairs(prev.families) do
            if changes_of.family_needs_occupancy(prev, compiled, code, product_usage) then
                local occupied, ferr = store.family_occupied(db, catalog_id, code)
                if ferr then return nil, ferr end
                family_occupied[code] = occupied
            end
        end
    end
    local changes = changes_of.changes(prev, compiled,
        { usage = product_usage, family_occupied = family_occupied, populated = populated }, prev_declaration, effective)
    if prev and changes_of.highest(changes) ~= "refused" then
        local refusal = incompatible_index(prev, compiled, usage)
        if refusal then changes[#changes + 1] = refusal end
    end
    local refused: { types.SchemaChange } = {}
    for _, c in ipairs(changes) do if c.class == "refused" then refused[#refused + 1] = c end end
    return { generation = generation + 1, class = #refused > 0 and "refused" or changes_of.classify(prev, compiled, changes),
        changes = changes, refused = refused, effective = effective, compiled = compiled, configs = configs, unchanged = false }, nil
end

local MIGRATION = "add a new attribute, copy values to it with apply commands, remove the old attribute, then rename the new one by id"

local function schema_command(plan: SchemaPlan): (types.Plan?, error?)
    if plan.unchanged then
        return { result = { generation = plan.generation, class = "unchanged", changes = {} }, events = {} }, nil
    end
    if #plan.refused > 0 then
        return nil, invalid("schema change requires migrating stored values", { code = "migration_required",
            changes = plan.refused :: { types.JsonObject }, migration = MIGRATION })
    end
    local body: types.SchemaBody = { generation = plan.generation, declaration = plan.effective, compiled = plan.compiled,
        class = plan.class, changes = plan.changes, plugin_configs = next(plan.configs) ~= nil and plan.configs or nil }
    local event: types.Event = { type = EV.SCHEMA_APPLIED, subject = "schema", body = body }
    local result: types.SchemaResult = { generation = plan.generation, class = plan.class, changes = plan.changes }
    return { result = result, events = { event } }, nil
end

function M.preview(db: types.Executor, catalog: types.Catalog, catalog_id: string, request: types.SchemaRequest): (types.SchemaPlanResult?, error?)
    local plan, err = plan_schema(db, catalog, catalog_id, request)
    if err or not plan then return nil, err end
    return { generation = plan.generation, class = plan.class, changes = plan.changes, refused = plan.refused,
        migration = #plan.refused > 0 and MIGRATION or nil }, nil
end

function M.apply(db: types.Executor, catalog: types.Catalog?, catalog_id: string, request: types.SchemaRequest): (types.Plan?, error?)
    local plan, err = plan_schema(db, catalog, catalog_id, request)
    if err or not plan then return nil, err end
    return schema_command(plan)
end

return M
