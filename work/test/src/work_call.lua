-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Runs one work operation under the caller's actor (harness only): board
-- methods through the kickside.work:board contract, plus thread helpers.
local contract = require("contract")
local security = require("security")
local component = require("component")
local funcs = require("funcs")
local pack_batch = require("pack_batch")
local pack_views = require("pack_views")
local registry = require("registry")
local api_access = require("api_access")
local component_envelope = require("component_envelope")

local M = {}

local BOARD_METHODS = { plugin_feed = true, list_packs = true, pack_plan = true, pack_apply = true, update = true, move_status = true, bulk = true, bulk_status = true, cancel_bulk = true, plan_move = true, move = true, approve = true, report = true, create = true, list = true, get_schema = true, plan_schema = true, apply_schema = true, apply = true,
    list_links = true, list_comments = true, list_stage_runs = true, configure_plugin = true, explain = true, query = true, count = true, get = true, list_changes = true, list_history = true, get_time_in_state = true, resume_migration = true }

type Service = { [string]: (Service, unknown) -> (unknown, error?) }

local function open(contract_id: string, binding: string?, context: { [string]: string }?): (Service?, error?)
    local def, err = contract.get(contract_id)
    if err or not def then return nil, err or errors.new({ kind = errors.NOT_FOUND, message = "no contract " .. contract_id }) end
    local acting, aerr = def:with_actor(security.actor())
    if aerr or not acting then return nil, aerr or errors.new({ kind = errors.PERMISSION_DENIED, message = "actor refused" }) end
    local scoped, serr = acting:with_scope(security.scope())
    if serr or not scoped then return nil, serr or errors.new({ kind = errors.PERMISSION_DENIED, message = "scope refused" }) end
    if context then scoped = scoped:with_context(context) end
    local opened, oerr = scoped:open(binding)
    if oerr or not opened then return nil, oerr or errors.new({ kind = errors.PERMISSION_DENIED, message = "open refused" }) end
    return opened :: Service, nil
end

local function invoke(service: Service, method: string, arg: unknown): (unknown, error?)
    local fn = service[method]
    if not fn then return nil, errors.new({ kind = errors.INVALID, message = "no method " .. method }) end
    return fn(service, arg)
end

function M.run(input: unknown): (unknown, error?)
    local op, id, req = input.op, input.board_id, input.request or {}
    if op == "contract_request" then
        local service, err = open(req.contract)
        if err or not service then return nil, err end
        return invoke(service, req.method, req.value)
    end
    if op == "create_function" then return funcs.call("kickside.work.service:create", req) end
    if BOARD_METHODS[op] then
        if op ~= "create" and op ~= "list" and id ~= nil and req.board_id == nil then req.board_id = id end
        local service, err = open("kickside.work:board")
        if not service then return nil, err end
        return invoke(service, op, req)
    end
    if op == "set_setting" or op == "unset_setting" then
        local client = assert(open("kickside.settings:settings"))
        return invoke(client, op == "set_setting" and "set" or "unset", req)
    end
    if op == "attachment_context" then return component.get_context(req.id, component.ACCESS.READ) end
    if op == "get_view" or op == "list_views" or op == "create_view" or op == "save_view" or op == "run_view" or op == "rename_view" or op == "delete_view" then
        if op == "list_views" and req.board_id == nil then req.board_id = id end
        local service, err = open("kickside.work:view")
        if not service then return nil, err end
        local method = string.match(op :: string, "^(%a+)_views?$")
        return invoke(service, method :: string, req)
    end
    if op == "api_call" then
        local status, body = api_access.call(req.method, {})
        return { status = status, body = body }
    end
    if op == "view_revision" then
        local context, err = assert(component.get_service()):get_access_context({ component_id = req.view_id, access_mask = component.ACCESS.ADMIN, include_context = true })
        if err then return nil, err end
        return context.context_revision, nil
    end
    if op == "pack_view" then return pack_views.install(req.view_id, req.request, req.revision) end
    if op == "pack_step" then return pack_batch.batch(req) end
    if op == "direct" then return funcs.call(req.target, req.input) end
    if op == "operation_batch" then
        return funcs.call("kickside.work.jobs:operation_batch", { board_id = id, operation_id = req.operation_id })
    end
    if op == "worker_batch" then
        return funcs.call("kickside.work.jobs:" .. req.worker .. "_batch", { board_id = id, deadline = req.deadline })
    end
    if op == "discover" then
        return registry.find({ [".kind"] = req.kind, [".id"] = req.id })
    end
    if op == "declaration" then return registry.get(req.id) end
    if op == "plugin_sync" then return funcs.call("kickside.work.extensions:plugin_projections", { board_id = id }) end
    if op == "plugin_projections" then
        local threads, err = open("kickside.core:threads")
        if not threads then return nil, err end
        return invoke(threads, "list_projections", { thread_id = id, limit = 1000 })
    end
    if op == "settle" then
        local threads, err = open("kickside.core:threads")
        if not threads then return nil, err end
        return invoke(threads, "catch_up_projection", { thread_id = id, kind = "kickside.work:board_model", max_ticks = 1000 })
    end
    if op == "events" then
        local threads, err = open("kickside.core:threads")
        if not threads then return nil, err end
        return invoke(threads, "list_events", { thread_id = id, from_seq = (req :: { from_seq: integer? }).from_seq or 1, ascending = true, limit = 1000 })
    end
    if op == "trusted_append" then
        return funcs.call("app:trusted_append", req)
    end
    if op == "append" then
        local threads, err = open("kickside.core:threads")
        if not threads then return nil, err end
        return invoke(threads, "append_events", req)
    end
    if op == "revoke" then
        return assert(component.get_service()):revoke_subtree({ root_component_id = id, subject = { subject_id = req.subject_id, subject_type = req.subject_type or "user" } })
    end
    if op == "grant" then
        local service = assert(component.get_service())
        return service:grant_subtree({ root_component_id = id, subject = { subject_id = req.subject_id, subject_type = req.subject_type or "user" },
            access_mask = req.mask })
    end
    if op == "get_meta" then
        return assert(component.get_service()):get({ component_id = id })
    end
    if op == "set_runtime_meta" then
        return component.set_meta(id, req, { trusted_runtime = true })
    end
    if op == "delete_direct" then
        return funcs.new():with_context({ component_id = id }):call("kickside.work.binding:delete_func")
    end
    if op == "delete" then
        local service, err = component.get_service()
        if err or not service then return nil, err end
        local result, derr = service:delete({ component_id = id, child_policy = req.child_policy })
        if derr then return nil, derr end
        local failure = component_envelope.error_of(result, "delete")
        if failure then return nil, failure end
        return result, nil
    end
    return nil, errors.new({ kind = errors.INVALID, message = "unknown op " .. tostring(op) })
end

return M
