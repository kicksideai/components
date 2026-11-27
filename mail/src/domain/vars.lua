-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local canonical_json = require("canonical_json")
local error_envelope = require("error_envelope")
local json = require("json")
local resource = require("resource")
local types = require("types")

local M = {}

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

function M.check_vars(vars: unknown): error?
    if type(vars) ~= "table" then return nil end
    return resource.check_json(vars, resource.MAX_VARIABLE_BYTES, "invalid_template_vars",
        "Template variables must be valid JSON of at most 65536 bytes")
end

function M.validate_vars(schema: types.VariableSchema, vars: unknown): error?
    local size_err = M.check_vars(vars)
    if size_err then return size_err end
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
