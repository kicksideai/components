-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local M = {}

type Person = { person: string?, person_name: string? }

-- Resolve only IDs already admitted by the report. The Users directory runs
-- its lookup under its own store identity.
function M.attach<T>(rows: { T }): error?
    local refs: { { type: string, id: string } } = {}
    local requested: { [string]: boolean } = {}
    for _, raw in ipairs(rows) do
        local person = (raw :: Person).person
        if person and not requested[person] then
            refs[#refs + 1] = { type = "user", id = person }
            requested[person] = true
        end
    end
    if #refs == 0 then return nil end
    local definition, err = contract.get("kickside.contract:directory")
    if err or not definition then return err end
    local client, open_err = definition:open()
    if open_err or not client then return open_err end
    local result, resolve_err = client:resolve({ refs = refs })
    if resolve_err then return resolve_err end
    local by_id: { [string]: string } = {}
    for _, principal in ipairs(result.principals) do
        if requested[principal.id] then by_id[principal.id] = principal.label end
    end
    for _, raw in ipairs(rows) do
        local row = raw :: Person
        if row.person then row.person_name = by_id[row.person] end
    end
    return nil
end

return M
