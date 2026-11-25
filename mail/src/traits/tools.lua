-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local client = require("client")
local ctx = require("ctx")
local funcs = require("funcs")
local logger = require("logger")

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

local function workflow_label(ref: unknown): string
    if type(ref) ~= "table" then return "" end
    local title = ref.title
    if types.origin_text(title) then return title :: string end
    if type(ref.id) ~= "string" or ref.id == "" then return "" end
    local result, err = funcs.call("kickside.workflows.agent:flows_read", {
        action = "catalog", catalog_id = "flows:" .. ref.id,
    })
    if err then
        if err:kind() ~= errors.NOT_FOUND and err:kind() ~= errors.PERMISSION_DENIED then
            logger:warn("Mail workflow title lookup failed", {error = tostring(err)})
        end
        return ""
    end
    local item = result and result.item
    if type(item) == "table" and types.origin_text(item.title) then return item.title :: string end
    return ""
end

local function send(input: types.SendRequest): (types.SendResult?, error?)
    local run = ctx.get("run_context")
    if type(input) == "table" and type(run) == "table" and type(run.run_id) == "string" and run.run_id ~= "" then
        input.origin = {kind = "workflow", id = run.run_id, label = workflow_label(run.flow_ref)}
    end
    return client.send(input)
end

return {send = send, list_templates = list_templates, get_template = get_template, preview = preview}
