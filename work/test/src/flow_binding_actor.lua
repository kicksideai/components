-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local repo = require("repo")
local workflow = require("workflow")
local publish = require("publish")
local component = require("component")
local automations = require("automations")
local identifiers = require("identifiers")
local registry = require("registry")
local json = require("json")
local schema_commands = require("schema_commands")
local security = require("security")
local M = {}
function M.run(input)
    if input.op == "pack" then
        local entry = assert(registry.get("app:binding_pack"))
        local d = input.declaration
        local changes = assert(registry.snapshot()):changes()
        changes:update({ id = "app:binding_pack", kind = entry.kind, meta = entry.meta, data = {
            schema = { key_prefix = d.key_prefix, fields = d.fields, item_types = d.item_types }, processes = d.processes,
            views = {}, automations = {}, traits = {}, requires = {}, starter = { items = {}, default = false },
        } })
        local _, err = changes:apply()
        if err then return nil, err end
        return true, nil
    end
    if input.op == "frozen" then
        local request = { board_id=input.board_id, declaration=input.declaration, expected_generation=0 }
        local plan, err = schema_commands.prepare_schema(request)
        if err then return nil,err end
        local service = assert(component.get_service())
        local _, revoke_err = service:revoke_subtree({ root_component_id=input.ref.id,
            subject={subject_type="user",subject_id=security.actor():id()} })
        if revoke_err then return nil,revoke_err end
        return schema_commands.apply_schema(request,plan)
    end
    if input.op == "installation" then return require("probe").read(input.board_id) end
    if input.op == "fault" then return require("probe").set(input.board_id, input.fault) end
    if input.op == "flow" then
        local created, err = repo.create("Bound Work Flow")
        if err then return nil, err end
        local _, aerr = workflow.apply(created.id, {
            { type = "node.add", body = { id = "start", kind = "start", config = { input_schema = input.schema or { type = "object" } } } },
            { type = "node.add", body = { id = "work", kind = "block", ref = "app:binding_block" } },
            { type = "node.add", body = { id = "finish", kind = "finish", config = { output_schema = { type = "object" } } } },
            { type = "edge.add", body = { id = "entry", source_id = "start", target_id = "work" } },
            { type = "edge.add", body = { id = "exit", source_id = "work", target_id = "finish" } },
        }, security.actor():id())
        if aerr then return nil, aerr end
        if not input.draft then
            local result, perr = publish.publish(created.id, security.actor():id())
            if perr then return nil, perr end
            assert(result.ok, require("json").encode(result))
        end
        return { kind = "flow", id = created.id, version = 1 }, nil
    end
    local id = assert(identifiers.uuid("kickside.work.launcher.v1\0" .. input.board_id))
    if input.op == "launcher" then
        local context, err = component.get_context(id, component.ACCESS.ADMIN)
        if err then return nil, err end
        local identity, ierr = automations.get_execution_identity(id)
        if ierr then return nil, ierr end
        return { id = id, context = context, identity = identity }, nil
    end
    if input.op == "occupy" then
        return assert(component.get_service()):register({ component_id = id, impl_id = "app:pack_automation", parent_id = input.board_id })
    end
    if input.op == "delete_flow" then return repo.delete(input.id) end
    if input.op == "block" then return input end
    return nil, errors.new({ kind = errors.INVALID, message = "unknown binding fixture operation" })
end
return M
