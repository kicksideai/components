-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local function handler()
    local rows = db:query("SELECT id FROM acme_bad_item WHERE id = ?", { 1 })
    local other = db:query("SELECT name FROM other_table")
    local hook = "acme.bad.plugin:hook"
    return rows, other, hook
end
return { handler = handler }
