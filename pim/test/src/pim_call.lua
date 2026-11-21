-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Runs one PIM operation under the caller's actor (harness only): catalog
-- methods through the kickside.pim:catalog contract, plus the portable,
-- pullable and writable bindings.
local contract = require("contract")
local security = require("security")
local funcs = require("funcs")
local component = require("component")

local merge_fixture = require("merge_fixture")
local conflict_fixture = require("conflict_fixture")
local conflict_writer = require("conflict_writer")
local M = {}

local CATALOG_METHODS = { create = true, list = true, get_catalog = true, update = true, get_schema = true, plan_schema = true, apply_schema = true, get = true,
    query = true, list_history = true, apply = true, propose = true, decide = true, list_proposals = true, release = true, withdraw = true, rebuild = true,
    list_links = true, explain = true, list_changes = true, list_publications = true, get_release = true, list_releases = true, list_terms = true,
    adopt_asset = true, schema_options = true, configure_plugin = true, plugin_feed = true, plugin_context = true,
    get_model_release = true, wait_for_product = true }

type Service = { [string]: (Service, unknown) -> (unknown, error?) }

local function open(contract_id: string, binding: string?, context: { [string]: string }?): Service
    local def = assert(contract.get(contract_id))
    def = def:with_actor(security.actor()):with_scope(security.scope())
    if context then def = def:with_context(context) end
    return assert(def:open(binding)) :: Service
end

local function invoke(service: Service, method: string, arg: unknown): (unknown, error?)
    local fn = service[method]
    if not fn then return nil, errors.new({ kind = errors.INVALID, message = "no method " .. method }) end
    return fn(service, arg)
end

function M.run(input: unknown): (unknown, error?)
    local op, id, req = input.op, input.catalog_id, input.request or {}
    if CATALOG_METHODS[op] then
        if op ~= "create" and op ~= "list" then req.catalog_id = id end
        local service = open("kickside.pim:catalog")
        return invoke(service, op, req)
    end
    if op == "apply_conflicted" then
        conflict_fixture.configure(id, req.changed_generation == true)
        return conflict_writer.apply(id, req.request)
    end
    if op == "apply_with_interleaved_guarded_receipt" then
        conflict_fixture.interleave_guarded_receipt(id, req.request)
        return conflict_writer.apply(id, req.request)
    end
    if op == "decide_with_source_revocation" then
        conflict_fixture.revoke_source(id, req.declaration, req.timing)
        return conflict_writer.decide(id, req.request)
    end
    if op == "interrupt_decision" then
        conflict_fixture.interrupt_command(req.phase)
        return conflict_writer.decide(id, req.request)
    end
    if op == "interrupt_submission" then
        conflict_fixture.interrupt_command("acknowledgement")
        return conflict_writer.propose(id, req.request)
    end
    if op == "plan_fold_merge" then return merge_fixture.plan(id, req.source) end
    if op == "batch" then
        local service = open("kickside.pim:catalog")
        local results = {}
        for i, r in ipairs(req.requests) do
            r.catalog_id = id
            local out, err = invoke(service, "apply", r)
            if err then return nil, err end
            results[i] = out
        end
        return { results = results }, nil
    end
    if op == "settle" then
        -- Settle the selected projection at the thread head.
        local threads = open("kickside.core:threads")
        return invoke(threads, "catch_up_projection", {
            thread_id = id, kind = req.kind or "kickside.pim:catalog_model", projection_key = req.projection_key,
            max_ticks = req.max_ticks or 1000,
        })
    end
    if op == "register_catalog_projection" then
        return invoke(open("kickside.core:threads"), "register_projection", {
            thread_id = id, kind = "kickside.pim:catalog_model", worker_ref = "func://kickside.pim.persist:projection",
            worker_input_mode = "prefetch_events", events = {input = req.inputs}, ensure = true,
            projection_key = req.projection_key, cursor_key = req.cursor_key,
        })
    end
    if op == "projection_padding" then
        local client = open("kickside.core:threads")
        for n=1,200 do
            local _,err=invoke(client,"register_projection",{thread_id=id,kind=string.format("aaa:padding_%03d",n),
                worker_ref="func://kickside.pim.persist:projection",worker_input_mode="prefetch_events",start_seq=0,events={input={{type="app:padding"}}}})
            if err then return nil,err end
        end
        return true,nil
    end
    if op == "remove_plugin_projection" then
        return invoke(open("kickside.core:threads"), "remove_projection", {
            thread_id = id, kind = req.kind, projection_key = req.projection_key,
        })
    end
    if op == "pause_plugin_projection" then
        return invoke(open("kickside.core:threads"), "pause_projection", {
            thread_id = id, kind = req.kind, projection_key = req.projection_key, cursor_key = req.cursor_key,
        })
    end
    if op == "resume_plugin_projection" then
        return invoke(open("kickside.core:threads"), "resume_projection", {
            thread_id = id, kind = req.kind, projection_key = req.projection_key,
        })
    end
    if op == "plugin_projections" then
        return invoke(open("kickside.core:threads"), "list_projections", { thread_id = id, limit = 1000 })
    end
    if op == "plugin_sync" then
        return funcs.call("kickside.pim.extensions:plugin_projections", { catalog_id = id })
    end
    if op == "events" then
        local threads = open("kickside.core:threads")
        return invoke(threads, "list_events", { thread_id = id, from_seq = 1, ascending = true, limit = 1000 })
    end
    if op == "inventory_stock_changed" then
        return invoke(open("kickside.core:threads"), "append_events", { thread_id = id,
            events = { { type = "app:inventory.stock.changed", body = req } } })
    end
    if op == "grant" then
        local service = assert(component.get_service())
        return service:grant_subtree({ root_component_id = id, subject = { subject_id = req.subject_id, subject_type = "user" },
            access_mask = req.mask })
    end
    if op == "portable" then
        local inst = open("kickside.contract:portable", "kickside.pim.binding:catalog", { component_id = id })
        return invoke(inst, req.method, req.args)
    end
    if op == "set_component_meta" then
        return assert(component.get_service()):set_meta({ component_id = id, fields = req })
    end
    if op == "component_meta" then
        local rows, err = component.query({ component_ids = { id }, include = { meta = true }, limit = 1 })
        if err then return nil, err end
        return rows[1].meta, nil
    end
    if op == "catalog_registrations" then
        local ids = {}
        local limit = 32
        repeat
            local rows, err = component.query({ impl_ids = { "kickside.pim.binding:catalog" }, access_mask = component.ACCESS.READ,
                order_by = { field = "component_id", direction = "ASC" }, offset = #ids, limit = limit })
            if err then return nil, err end
            for _, row in ipairs(rows or {}) do ids[#ids + 1] = row.component_id end
        until not rows or #rows < limit
        return ids, nil
    end
    if op == "delete_component" then
        return assert(component.get_service()):delete({ component_id = id })
    end
    if op == "delete_catalog_rows" then
        return funcs.new():with_context({ component_id = id }):call("kickside.pim.binding:delete_func", {})
    end
    if op == "rebuild_batch" then
        req.catalog_id = id
        return funcs.call("kickside.pim.jobs:rebuild_batch", req)
    end
    if op == "release_model_batch" then
        req.catalog_id = id
        return funcs.call("kickside.pim.jobs:release_model_batch", req)
    end
    if op == "pull_products" or op == "pull_proposals" then
        req.config = req.config or {}
        req.config.catalog_id = id
        local binding = op == "pull_products" and "kickside.pim.source:products" or "kickside.pim.source:proposals"
        return invoke(open("kickside.data:pullable", binding), "pull", req)
    end
    if op == "pull" then
        req.config = req.config or {}
        req.config.catalog_id = id
        return invoke(open("kickside.data:pullable", "kickside.pim.source:publications"), "pull", req)
    end
    if op == "sink" then
        req.config = req.config or {}
        req.config.catalog_id = id
        return invoke(open("kickside.data:writable", "kickside.pim.sink:products"), "write", req)
    end
    return nil, errors.new({ kind = errors.INVALID, message = "unknown op " .. tostring(op) })
end

return M
