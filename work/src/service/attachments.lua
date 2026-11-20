-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Committed desired configuration converges through the component service.
local child_registration = require("child_registration")
local component = require("component")
local component_envelope = require("component_envelope")
local component_types = require("component_types")
local domain = require("domain")
local teardown = require("teardown")
local M = {}

local function association(board_id: string, row: domain.PluginAttachment): (component_types.ComponentRow?, error?)
    local found, err = component.list_system({ component_ids = { row.attachment_id }, include = { private_context = true }, limit = 1 })
    if err then return nil, err :: error end
    local existing = found and found[1]
    if existing and (existing.impl_id ~= row.impl_id or not existing.private_context
        or existing.private_context.board_id ~= board_id or existing.private_context.plugin ~= row.plugin) then
        return nil, errors.new({ kind = errors.CONFLICT, message = "plugin attachment association differs", details = { code = "attachment_mismatch" } })
    end
    return existing, nil
end

function M.remove(board_id: string, row: domain.PluginAttachment): error?
    local existing, aerr = association(board_id, row)
    if aerr then return aerr end
    if not existing then return nil end
    local accepted, _, err = teardown.begin_delete(row.attachment_id, nil)
    if err then return err :: error end
    if not accepted then return errors.new({ kind = errors.INTERNAL, message = "plugin attachment deletion is not accepted", details = { code = "plugin_attachment_delete_not_accepted" } }) end
    return nil
end

function M.ensure(board_id: string, row: domain.PluginAttachment): error?
    local existing, aerr = association(board_id, row)
    if aerr then return aerr end
    if not existing then
        local registered = child_registration.register_root_attachment({
            component_id = row.attachment_id,
            impl_id = row.impl_id,
            private_context = { board_id = board_id, plugin = row.plugin, config = row.config },
            meta = { title = row.plugin },
        }, board_id, row.plugin)
        return component_envelope.error_of(registered :: component_types.ServiceEnvelope, "register")
    end
    local _, uerr = component.update(row.attachment_id, { { type = "PATCH_CONTEXT", payload = { patch = { config = row.config } } } })
    return uerr :: error?
end
return M
