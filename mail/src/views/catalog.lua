-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local resources = require("resources")
local jet = require("jet")
local client = require("client")

local vars = require("vars")

local M = {check_vars = vars.check_vars, validate_vars = vars.validate_vars}

function M.list_templates(): (types.TemplateList?, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    local messages, err = resources.list({kind = "message"})
    if err then return nil, err end
    local rows = {}
    for i, item in ipairs(messages) do
        rows[i] = {name = item.name, title = item.title, description = item.description, variable_schema = item.schema}
    end
    return {templates = rows}, nil
end

function M.resolve(name: unknown): (types.Resource?, error?)
    if type(name) ~= "string" or not name:find("%S") then
        return nil, resources.error(errors.INVALID, "invalid_template", "A mail template name is required")
    end
    local item, err = resources.get({kind = "message", name = name})
    if err and err:kind() == errors.NOT_FOUND then
        return nil, resources.error(errors.NOT_FOUND, "template_not_found", "Mail template is not declared: " .. name)
    end
    if item and item.archived then
        return nil, resources.error(errors.NOT_FOUND, "mail_template_archived", "This mail template is archived", item)
    end
    return item, err
end

function M.get_template(input: types.TemplateRequest): (types.Template?, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    local selected, err = M.resolve(type(input) == "table" and input.template or nil)
    if err then return nil, err end
    local item = selected :: types.Resource
    local name = jet.name(item)
    return {name = item.name, title = item.title, description = item.description, variable_schema = item.schema,
        parts = {html = name, text = name, subject = jet.name(item, "subject")}, sample = item.samples}, nil
end

return M
