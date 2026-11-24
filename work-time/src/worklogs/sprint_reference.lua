-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local registry = require("registry")
local sql = require("sql")
local plugin_rows = require("plugin_rows")
local M = {}
local CAPABILITY = "kickside.work.planning:sprint_reference"

-- Planning owns validation and may be absent. Its resolver runs as the
-- request actor and treats a captured sprint as the first date candidate.
function M.resolve(tx: sql.Transaction, board_id: string, item: string, work_date: string, sprint_id: string?): (string?, error?)
    local planning, err = plugin_rows.active(tx, board_id, "kickside.work.planning:plugin")
    if err or not planning then return nil, err end
    local entry, discovery_err = registry.get(CAPABILITY)
    if errors.is(discovery_err, errors.NOT_FOUND) then return nil, nil end
    if discovery_err or not entry then return nil, discovery_err end
    local definition, definition_err = contract.get(CAPABILITY)
    if definition_err or not definition then return nil, definition_err end
    local client, cerr = definition:open("kickside.work.planning:sprint_reference_binding")
    if cerr or not client then return nil, cerr end
    local result, rerr = client:resolve({ board_id = board_id, item = item, work_date = work_date, sprint_id = sprint_id })
    if rerr then return nil, rerr end
    if type(result) ~= "table" or (result.sprint_id ~= nil and (type(result.sprint_id) ~= "string" or result.sprint_id == "")) then
        return nil, errors.new({ kind = errors.INTERNAL, message = "Planning returned an invalid sprint reference",
            details = { code = "sprint_reference_invalid" } })
    end
    return result.sprint_id :: string?, nil
end

return M
