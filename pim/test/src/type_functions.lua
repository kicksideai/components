-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Harness type functions: a code type that uppercases and strips spaces, and
-- validates length against its config; every call is counted so tests can
-- assert one call per attribute per command.
local sql = require("sql")

local common = require("common")
local M = {}

type Batch = { config: { [string]: unknown }, values: { unknown } }

M.CALLS = "pim_test_type_calls"

local function count(fn: string, n: integer)
    local db = assert(sql.get("app:db"))
    assert(db:execute("CREATE TABLE IF NOT EXISTS " .. M.CALLS .. " (fn TEXT NOT NULL, n INTEGER NOT NULL)", {}))
    assert(db:execute("INSERT INTO " .. M.CALLS .. " (fn, n) VALUES ($1, $2)", { fn, n }))
    db:release()
end

function M.normalize(batch: Batch): unknown
    count("normalize", #batch.values)
    return common.normalize(batch)
end

function M.validate(batch: Batch): unknown
    count("validate", #batch.values)
    return common.validate(batch)
end

function M.broken(_batch: Batch): unknown
    return { results = {} }
end

return M
