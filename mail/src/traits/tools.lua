-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local client = require("client")
local ctx = require("ctx")

local function list_templates(): (types.ToolTemplateList?, error?)
    local mailer, err = client.mailer()
    if not mailer then return nil, err end
    local result, list_err = mailer:list_templates()
    if list_err then return nil, list_err end
    local rows = {}
    for i, template in ipairs(result.templates) do
        rows[i] = {name = template.name, title = template.title, description = template.description}
    end
    return {templates = rows}, nil
end

local function send(input: types.SendRequest): (types.SendResult?, error?)
    local run = ctx.get("run_context")
    if type(input) == "table" and type(run) == "table" and type(run.run_id) == "string" and run.run_id ~= "" then
        local ref = run.flow_ref
        local title = type(ref) == "table" and ref.title or nil
        input.origin = {kind = "workflow", id = run.run_id, label = types.origin_text(title) and title :: string or ""}
    end
    local mailer, err = client.mailer()
    if not mailer then return nil, err end
    return mailer:send(input)
end

local function get_template(input: types.TemplateRequest): (types.Template?, error?)
    local mailer, err = client.mailer()
    if not mailer then return nil, err end
    return mailer:get_template(input)
end

local function preview(input: types.PreviewRequest): (types.PreviewResult?, error?)
    local mailer, err = client.mailer()
    if not mailer then return nil, err end
    return mailer:preview(input)
end

return {send = send, list_templates = list_templates, get_template = get_template, preview = preview}
