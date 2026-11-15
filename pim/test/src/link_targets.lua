-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Harness link targets: a plugin that owns locations binds kickside.pim:link_target
-- and answers from its own table under the caller; every call is counted so
-- tests can assert one resolve per kind per command.
local sql = require("sql")
local security = require("security")

local M = {}

type Request = { catalog_id: string, ids: { string } }
type Row = { id: string, label: string, hidden: integer }

M.LOCATIONS = "pim_test_locations"
M.CALLS = "pim_test_link_calls"
M.DDL = {
    "CREATE TABLE IF NOT EXISTS pim_test_locations (id TEXT PRIMARY KEY, label TEXT NOT NULL, hidden INTEGER NOT NULL DEFAULT 0)",
    "CREATE TABLE IF NOT EXISTS pim_test_link_calls (method TEXT NOT NULL, catalog_id TEXT NOT NULL, ids INTEGER NOT NULL)",
}

local function open(): (sql.DB?, error?)
    local db, err = sql.get("app:db")
    if err or not db then return nil, err end
    for _, ddl in ipairs(M.DDL) do
        local _, derr = db:execute(ddl, {})
        if derr then db:release(); return nil, derr end
    end
    return db, nil
end

local function visible(method: string, request: Request): ({ Row }?, error?)
    if not security.actor() then return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = method .. " needs an actor" }) end
    local db, err = open()
    if err or not db then return nil, err end
    local _, cerr = db:execute("INSERT INTO " .. M.CALLS .. " (method, catalog_id, ids) VALUES ($1, $2, $3)", { method, request.catalog_id, #request.ids })
    if cerr then db:release(); return nil, cerr end
    local out: { Row } = {}
    for _, id in ipairs(request.ids) do
        local rows, qerr = db:query("SELECT id, label, hidden FROM " .. M.LOCATIONS .. " WHERE id = $1 AND hidden = 0", { id })
        if qerr then db:release(); return nil, qerr end
        for _, r in ipairs(rows :: { Row }) do out[#out + 1] = r end
    end
    db:release()
    return out, nil
end

function M.resolve(request: Request): (unknown, error?)
    local rows, err = visible("resolve", request)
    if err or not rows then return nil, err end
    local ids: { string } = {}
    for _, r in ipairs(rows) do ids[#ids + 1] = r.id end
    return { ids = ids }, nil
end

-- describe fails for the id "boom", so tests can reach a describe outage.
function M.describe(request: Request): (unknown, error?)
    for _, id in ipairs(request.ids) do
        if id == "boom" then return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "describe is offline", details = { code = "describe_offline" } }) end
    end
    local rows, err = visible("describe", request)
    if err or not rows then return nil, err end
    local targets: { [string]: { [string]: unknown } } = {}
    for _, r in ipairs(rows) do targets[r.id] = { label = r.label, data = { code = r.id:upper() } } end
    return { targets = targets }, nil
end

function M.offline(_request: Request): (unknown, error?)
    return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "location service is offline", details = { code = "location_offline" } })
end

return M
