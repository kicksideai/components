-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Committed desired configuration converges through the component service.
local component = require("component")
local component_envelope = require("component_envelope")
local component_types = require("component_types")
local domain = require("domain")
local teardown = require("teardown")
local M = {}

local function association(board_id: string, row: domain.PluginState): (boolean?, error?)
    local found, err = component.list_system({ component_ids = { row.attachment_id }, include = { private_context = true }, limit = 1 })
    if err then return nil, err :: error end
    local existing = found and found[1]
    if existing and (existing.impl_id ~= row.impl_id or not existing.private_context
        or existing.private_context.board_id ~= board_id or existing.private_context.plugin ~= row.plugin) then
        return nil, errors.new({ kind = errors.CONFLICT, message = "plugin attachment association differs", details = { code = "attachment_mismatch" } })
    end
    return existing ~= nil, nil
end

function M.remove(board_id: string, row: domain.PluginState): error?
    local exists, aerr = association(board_id, row)
    if aerr then return aerr end
    if not exists then return nil end
    local accepted, _, err = teardown.begin_delete(row.attachment_id, nil)
    if err then return err :: error end
    if not accepted then return errors.new({ kind = errors.INTERNAL, message = "plugin attachment deletion is not accepted", details = { code = "plugin_attachment_delete_not_accepted" } }) end
    return nil
end

function M.ensure(board_id: string, row: domain.PluginState): error?
    local existing, aerr = association(board_id, row)
    if aerr then return aerr end
    local service, serr = component.get_service()
    if serr or not service then return serr :: error? end
    if not existing then
        local registered, cerr = service:register({ component_id = row.attachment_id, impl_id = row.impl_id,
            private_context = { board_id = board_id, plugin = row.plugin, config = row.config }, meta = { title = row.plugin } })
        if cerr then return cerr :: error end
        local envelope_err = component_envelope.error_of(registered :: component_types.ServiceEnvelope, "register")
        if envelope_err then return envelope_err end
    end
    local _, merr = component.set_meta(row.attachment_id, { owner = board_id })
    if merr then return merr :: error end
    if existing then
        local _, uerr = component.update(row.attachment_id, { { type = "PATCH_CONTEXT", payload = { patch = { config = row.config } } } })
        if uerr then return uerr :: error end
    end
    return nil
end
return M
