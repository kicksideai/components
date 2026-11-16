-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- A transient owner failure reaches the Jobs one-shot attempt bound.
local sql = require("sql")
local M = {}
function M.run(input: { payload: { catalog_id: string } }): (unknown, error?)
    local db, err = sql.get("app:db")
    if err or not db then return nil, err end
    local _, cerr = db:execute("CREATE TABLE IF NOT EXISTS pim_test_job_attempts (catalog_id TEXT NOT NULL)", {})
    if cerr then db:release(); return nil, cerr end
    local _, ierr = db:execute("INSERT INTO pim_test_job_attempts (catalog_id) VALUES ($1)", { input.payload.catalog_id })
    db:release()
    if ierr then return nil, ierr end
    return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "owner is unavailable", details = { code = "fixture_job_unavailable" } })
end
return M
