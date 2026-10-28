-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Core retention calls this on its tick: processed documents and runs past
-- their expiry are removed in bounded batches.
local store = require("store")
local repository = require("repository")

local BATCH = 200

local function run(_input: any): any
    local documents, documents_err = store.expire(BATCH)
    if documents_err then return { success = false, error = documents_err } end
    local runs, runs_err = repository.expire_runs(BATCH)
    if runs_err then return { success = false, error = runs_err } end
    return { success = true, deleted = documents + runs, needs_continue = documents == BATCH or runs == BATCH }
end

return { run = run }
