-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local json = require("json")
local canonical_json = require("canonical_json")
local error_envelope = require("error_envelope")
local resources = require("resources")
local jet = require("jet")
local client = require("client")

local M = {}

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

local function variable_name(issue: types.SchemaIssue?, properties: types.JsonObject): string
    if not issue then return "vars" end
    local unknown = issue.schema_path:match("^#/additionalProperties/(.*)$")
    if unknown then return unknown end
    local path = issue.instance_path
    local variable = ""
    for name in pairs(properties) do
        local prefix = "/" .. name
        if #name > #variable and (path == prefix or path:sub(1, #prefix + 1) == prefix .. "/") then
            variable = name
        end
    end
    return variable ~= "" and variable or "vars"
end

function M.validate_vars(schema: types.VariableSchema, vars: unknown): error?
    if type(vars) == "table" then vars = canonical_json.object(vars) end
    local valid, err = json.validate(schema, vars)
    if valid then return nil end
    local validation_err = err :: error
    local details = validation_err:details()
    local issue = details and details.errors and details.errors[1]
    local variable = variable_name(issue :: types.SchemaIssue?, schema.properties)
    return error_envelope.wrap(validation_err, "Invalid mail template variable " .. variable,
        {code = "invalid_template_vars", variable = variable})
end

return M
