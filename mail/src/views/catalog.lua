-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local registry = require("registry")
local json = require("json")
local canonical_json = require("canonical_json")
local error_envelope = require("error_envelope")

local M = {}

local function invalid_declaration(id: string, field: string): error
    return errors.new({kind = errors.INVALID, retryable = false,
        message = "Mail template " .. id .. " requires " .. field,
        details = {code = "invalid_template_declaration"}})
end

local function nonempty(value: unknown): boolean
    return type(value) == "string" and value:find("%S") ~= nil
end

local function descriptor(id: string, data: types.Record): (types.Template?, error?)
    local template = data.template :: types.Template
    if type(template) ~= "table" then return nil, invalid_declaration(id, "a template object") end
    for _, field in ipairs({"name", "title", "description"}) do
        if not nonempty(template[field]) then return nil, invalid_declaration(id, field) end
    end
    if type(template.parts) ~= "table" then return nil, invalid_declaration(id, "parts") end
    for _, part in ipairs({"subject", "html", "text"}) do
        if not nonempty(template.parts[part]) then return nil, invalid_declaration(id, "parts." .. part) end
    end
    local schema = template.variable_schema
    if type(schema) ~= "table" or schema.type ~= "object" or type(schema.properties) ~= "table" then
        return nil, invalid_declaration(id, "an object variable_schema with properties")
    end
    if type(template.sample) ~= "table" then return nil, invalid_declaration(id, "a sample object") end
    schema = canonical_json.normalize_schema(schema) :: types.VariableSchema
    schema.additionalProperties = false
    return {
        name = template.name,
        title = template.title,
        description = template.description,
        parts = template.parts,
        variable_schema = schema,
        sample = canonical_json.object(template.sample) :: types.JsonObject,
    }, nil
end

local function discover(): ({[string]: types.Template}?, error?)
    local entries, err = registry.find({[".kind"] = "registry.entry", ["meta.type"] = "kickside.mail:template"})
    if err then return nil, err end
    local templates: {[string]: types.Template} = {}
    for _, entry in ipairs(entries) do
        local template, declaration_err = descriptor(entry.id, entry.data :: types.Record)
        if declaration_err then return nil, declaration_err end
        if templates[template.name] then
            return nil, errors.new({kind = errors.INVALID, retryable = false,
                message = "Multiple mail declarations use the template name " .. template.name,
                details = {code = "duplicate_template_name"}})
        end
        templates[template.name] = template
    end
    return templates, nil
end

function M.list_templates(): (types.TemplateList?, error?)
    local templates, err = discover()
    if err then return nil, err end
    local rows = {}
    for _, template in pairs(templates) do
        rows[#rows + 1] = {
            name = template.name, title = template.title, description = template.description,
            variable_schema = template.variable_schema,
        }
    end
    table.sort(rows, function(a, b) return a.name < b.name end)
    return {templates = rows}, nil
end

function M.resolve(name: unknown): (types.Template?, error?)
    if not nonempty(name) then
        return nil, errors.new({kind = errors.INVALID, retryable = false,
            message = "A mail template name is required", details = {code = "invalid_template"}})
    end
    local templates, err = discover()
    if err then return nil, err end
    local template = templates[name :: string]
    if not template then
        return nil, errors.new({kind = errors.NOT_FOUND, retryable = false,
            message = "Mail template is not declared: " .. (name :: string), details = {code = "template_not_found"}})
    end
    return template :: types.Template?, nil
end

function M.get_template(input: types.TemplateRequest): (types.Template?, error?)
    return M.resolve(type(input) == "table" and input.template or nil)
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
