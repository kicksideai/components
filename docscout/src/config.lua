-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local json = require("json")
local registry = require("registry")
local M = {}
local function invalid(message)
    return errors.new({kind=errors.INVALID, message=message})
end
function M.validate(value)
    local entry, err = registry.get("kickside.docscout:config_schema")
    if err then return err end
    local schema,schema_err = json.decode(entry.data.schema_json)
    if schema_err then return schema_err end
    local valid, validation_err = json.validate(schema, value)
    if not valid then return invalid("Invalid configuration: " .. tostring(validation_err)) end
    local names, kinds = {}, {}
    for _, field in ipairs(value.fields) do
        if names[field.name] then return invalid("Field names must be unique") end
        names[field.name] = true
        if field.type == "enum" and #field.enum_values == 0 then return invalid("Enum fields need at least one value") end
    end
    for i, step in ipairs(value.workflow) do
        if kinds[step.kind] then return invalid("Workflow steps must be unique") end
        kinds[step.kind] = true
        if step.kind == "map" and i ~= 1 then return invalid("Map the document must stay first") end
    end
    if value.retrieval.overlap >= value.retrieval.chunk_size then return invalid("Overlap must be smaller than chunk size") end
    return nil
end
function M.validate_expected(fields,value)
    local properties,required={},{}
    local types={text="string",number="number",boolean="boolean",date="string",enum="string",list="array",object="object"}
    for _,field in ipairs(fields) do
        local spec={type={types[field.type],"null"}}
        if field.type=="enum" then
            spec={anyOf={{type="null"},{type="string",enum=field.enum_values}}}
        elseif field.type=="list" then spec.items={type=types[field.item_type]}
        elseif field.type=="date" then spec.format="date" end
        properties[field.name]=spec;required[#required+1]=field.name
    end
    local schema={type="object",additionalProperties=false}
    if #required>0 then schema.properties=properties;schema.required=required end
    local valid,err=json.validate(schema,value)
    if not valid then return invalid("Expected values do not match the fields: "..tostring(err)) end
    return nil
end
return M
