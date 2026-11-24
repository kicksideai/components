-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local client = require("client")
local ctx = require("ctx")

local function list_templates(): (types.ToolTemplateList?, error?)
    local mailer, err = client.open()
    if err then return nil, err end
    local result, list_err = (mailer :: types.Mailer):list_templates()
    if list_err then return nil, list_err end
    local rows = {}
    for i, template in ipairs(result.templates) do
        rows[i] = {name = template.name, title = template.title, description = template.description}
    end
    return {templates = rows}, nil
end

local function get_template(input: types.TemplateRequest): (types.Template?, error?)
    local mailer, err = client.open()
    if err then return nil, err end
    return (mailer :: types.Mailer):get_template(input)
end

local function preview(input: types.PreviewRequest): (types.PreviewResult?, error?)
    local mailer, err = client.open()
    if err then return nil, err end
    return (mailer :: types.Mailer):preview(input)
end

local function send(input: types.SendRequest): (types.SendResult?, error?)
    local run = ctx.get("run_context")
    if type(input) == "table" and type(run) == "table" and type(run.run_id) == "string" and run.run_id ~= "" then
        local ref = run.flow_ref
        local label = type(ref) == "table" and type(ref.id) == "string" and ref.id or run.run_id
        input.origin = {kind = "workflow", id = run.run_id, label = label}
    end
    return client.send(input)
end

return {send = send, list_templates = list_templates, get_template = get_template, preview = preview}
