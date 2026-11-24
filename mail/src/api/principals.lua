-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local identity = require("identity")
local types = require("types")

local M = {}

local function resolve(refs: {types.PrincipalRef}): ({types.DirectoryPrincipal}?, error?)
    local definition, lookup_err = contract.get("kickside.contract:directory")
    if lookup_err then return nil, lookup_err end
    local client, open_err = definition:open()
    if open_err then return nil, open_err end
    local result, err = (client :: types.PrincipalDirectory):resolve({refs = refs})
    if err then return nil, err end
    if not result then
        return nil, errors.new({kind = errors.UNAVAILABLE, message = "Principal directory returns no result"})
    end
    return result.principals, nil
end

local function label_rows(fields: {[string]: {types.Record}}): error?
    local labels: {[string]: types.PrincipalLabel} = {}
    local refs: {types.PrincipalRef} = {}
    for field, rows in pairs(fields) do
        for _, row in ipairs(rows) do
            local key = row[field]
            if type(key) == "string" and not labels[key] then
                local principal = identity.principal_of_key(key)
                local kind = principal and principal.kind or "unknown"
                local id = principal and principal.id or key
                labels[key] = {kind = kind, id = id, label = "Unknown account"}
                if kind == "user" then refs[#refs + 1] = {type = kind, id = id} end
            end
        end
    end
    if #refs > 0 then
        local principals, err = resolve(refs)
        if err and err:kind() ~= errors.PERMISSION_DENIED then return err end
        if principals then
            for _, item in ipairs(principals) do
                local label = labels[item.id]
                if label and label.kind == item.type and item.label ~= item.id and item.label:find("%S") then
                    label.label = item.label
                end
            end
        end
    end
    for field, rows in pairs(fields) do
        for _, row in ipairs(rows) do
            local key = row[field]
            if type(key) == "string" then row[field .. "_label"] = labels[key] end
        end
    end
    return nil
end

function M.resource(value: unknown, err: error?): (types.Record?, error?)
    if err then return nil, err end
    local row = value :: types.Record
    local usage = row.used_by :: types.UsedBy?
    local recent = usage and usage.recent_senders or {}
    local label_err = label_rows({author = {row}, sender = recent :: {types.Record}})
    if label_err then return nil, label_err end
    return row, nil
end

function M.item(field: string, value: unknown, err: error?): (types.Record?, error?)
    if err then return nil, err end
    local row = value :: types.Record
    local label_err = label_rows({[field] = {row}})
    if label_err then return nil, label_err end
    return row, nil
end

function M.page(field: string, value: unknown, err: error?): (types.Record?, error?)
    if err then return nil, err end
    local page = value :: types.Record
    local label_err = label_rows({[field] = page.items :: {types.Record}})
    if label_err then return nil, label_err end
    return page, nil
end

return M
