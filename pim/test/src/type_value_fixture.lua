-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {}
type Batch = { config: { [string]: unknown }, values: { unknown } }
function M.normalize(batch: Batch): unknown
    local results: { { [string]: unknown } } = {}
    for i, v in ipairs(batch.values) do
        if type(v) ~= "string" then
            results[i] = { error = "text required" }
        else
            local refined = (v :: string):gsub("%s+", ""):upper()
            if refined == "" then results[i] = { error = "blank code" } else results[i] = { value = refined } end
        end
    end
    return { results = results }
end

function M.validate(batch: Batch): unknown
    local results: { { [string]: unknown } } = {}
    local length = batch.config.length
    for i, v in ipairs(batch.values) do
        local findings: { { [string]: unknown } } = {}
        if type(length) == "number" and type(v) == "string" and #(v :: string) ~= length then
            findings[1] = { code = "wrong_length", message = "code has " .. #(v :: string) .. " characters, not " .. length }
        end
        results[i] = { findings = findings }
    end
    return { results = results }
end

return M
