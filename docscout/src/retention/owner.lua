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
    local deadline, deadline_err = repository.next_deadline_ms()
    if deadline_err then return { success = false, error = deadline_err } end
    local removed_documents, removed_runs = documents :: integer, runs :: integer
    return { success = true, deleted = removed_documents + removed_runs, deadline_ms = deadline,
        needs_continue = removed_documents == BATCH or removed_runs == BATCH }
end

return { run = run }
