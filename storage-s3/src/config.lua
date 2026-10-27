local registry = require("registry")
local M = {}

function M.s3_entries(): (any?, any?)
    local entries, find_err = registry.find({ [".kind"] = "cloudstorage.s3" })
    if find_err then return nil, find_err end
    local runtime, runtime_err = registry.get("kickside.storage_s3.security:runtime")
    if runtime_err then return nil, runtime_err end
    local granted = {}
    for _, resource in ipairs(runtime.data.policy.resources) do granted[resource] = true end
    local result = {}
    for _, entry in ipairs(entries or {}) do
        if granted[entry.id] then result[#result + 1] = entry end
    end
    table.sort(result, function(left, right) return left.id < right.id end)
    return result, nil
end

function M.has_s3_entry(resource_id: any): (boolean?, any?)
    local entries, entries_err = M.s3_entries()
    if entries_err then return nil, entries_err end
    for _, entry in ipairs(entries or {}) do
        if entry.id == resource_id then return true, nil end
    end
    return false, nil
end

return M
