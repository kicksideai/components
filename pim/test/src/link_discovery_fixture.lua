-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Two isolated owners claim the same kind; no catalog fixture adopts them.
local M = {}
function M.find_implementations(_contract: string): ({ string }, error?)
    return { "duplicate:first", "duplicate:second" }, nil
end
function M.get(id: string): (unknown, error?)
    return { id = id, meta = { kind = "duplicate.location", title = "Location" } }, nil
end
return M
