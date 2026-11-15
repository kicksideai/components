-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Harness check functions that break the check contract in each way a plugin can.
local M = {}

function M.raises(_input: unknown): unknown
    error("check exploded")
end

function M.silent(_input: unknown): unknown
    return {}
end

function M.scalar(_input: unknown): unknown
    return 5
end

function M.wordless(_input: unknown): unknown
    return { findings = { { code = "x" } } }
end

-- reports turns what it received into findings, so a test can read them.
function M.reports(input: { config: { [string]: unknown }?, view: { [string]: unknown } }): unknown
    local keys: { string } = {}
    for k in pairs(input.view or {}) do keys[#keys + 1] = k end
    table.sort(keys)
    return { findings = { { code = "seen", message = tostring((input.config or {}).mark) .. "|" .. table.concat(keys, ",") } } }
end

return M
