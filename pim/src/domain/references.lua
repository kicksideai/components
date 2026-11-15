-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Schema-directed reference traversal preserves record members and cardinality.
local types = require("types")
local M = {}

type Shape = types.ValueShape & { vocabulary: string? }
type Mapper = (types.Ref, string, string?) -> types.Ref
type Reference = { value: types.Ref, path: string, vocabulary: string? }
M.Reference = Reference

local function segment(name: string): string
    return (name:gsub("~", "~0"):gsub("/", "~1"))
end

-- valid_path admits a canonical zero-based position followed by escaped member segments.
function M.valid_path(path: string): boolean
    local position, rest = path:match("^(%d+)(.*)$")
    if not position or (#position > 1 and position:sub(1, 1) == "0") then return false end
    if rest ~= "" and rest:sub(1, 1) ~= "/" then return false end
    return (rest:gsub("~[01]", "")):find("~", 1, true) == nil
end

-- map copies only the containers whose references change; other values retain identity.
function M.map(shape: Shape, value: types.Value, fn: Mapper): types.Value
    local function walk(form: string, cardinality: string, config: types.AttributeConfig, vocabulary: string?,
        current: types.Value, path: string): types.Value
        if cardinality ~= "one" then
            local members = current :: { types.Scalar }
            local out: { types.Scalar }? = nil
            for i, member in ipairs(members) do
                local next_value = walk(form, "one", config, vocabulary, member, path .. tostring(i - 1)) :: types.Scalar
                if next_value ~= member then
                    if not out then out = {}; for j, v in ipairs(members) do out[j] = v end end
                    out[i] = next_value
                end
            end
            return out or current
        end
        if form == "ref" then return fn(current :: types.Ref, path, vocabulary) end
        if form ~= "record" then return current end
        local record = current :: types.Record
        local out: types.Record? = nil
        for name, member in pairs(config.members or {}) do
            local v = record[name]
            if v ~= nil then
                local member_path = path .. "/" .. segment(name)
                if (member.cardinality or "one") ~= "one" then member_path = member_path .. "/" end
                local next_value = walk(member.form, member.cardinality or "one", member, member.vocabulary, v, member_path)
                if next_value ~= v then
                    if not out then out = {}; for k, child in pairs(record) do out[k] = child end end
                    out[name] = next_value
                end
            end
        end
        return out or current
    end
    return walk(shape.form, shape.cardinality, shape.config, shape.vocabulary, value, shape.cardinality == "one" and "0" or "")
end

function M.collect(shape: Shape, value: types.Value): { Reference }
    local out: { Reference } = {}
    M.map(shape, value, function(ref: types.Ref, path: string, vocabulary: string?): types.Ref
        out[#out + 1] = { value = ref, path = path, vocabulary = vocabulary }
        return ref
    end)
    return out
end

return M
