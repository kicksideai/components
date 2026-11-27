-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local library = require("library")
local jet = require("jet")

local M = {}

function M.list_templates(): (types.TemplateList?, error?)
    local denied = library.require_read()
    if denied then return nil, denied end
    local messages, err = library.resources({kind = "message"})
    if err then return nil, err end
    local rows = {}
    for i, item in ipairs(messages) do
        rows[i] = {name = item.name, title = item.title, description = item.description, variable_schema = item.schema}
    end
    return {templates = rows}, nil
end

function M.get_template(input: types.TemplateRequest): (types.Template?, error?)
    local denied = library.require_read()
    if denied then return nil, denied end
    local selected, err = library.live_message(type(input) == "table" and input.template or nil)
    if err then return nil, err end
    local item = selected :: types.Resource
    local name = jet.name(item)
    return {name = item.name, title = item.title, description = item.description, variable_schema = item.schema,
        parts = {html = name, text = name, subject = jet.name(item, "subject")}, sample = item.samples}, nil
end

return M
