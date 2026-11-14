-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Multi-row statements in bounded chunks, so a fold writes a batch of rows in a
-- few round trips. Chunks stay under the bind-parameter limits of SQLite and
-- PostgreSQL; placeholders are numbered in order of appearance.
local storage = require("storage")
local types = require("types")

local M = {}

local MAX_PARAMS = 30000

local function exec(db: storage.Executor, statement: string, params: types.SqlParams): error?
    local _, err = db:execute(statement, params)
    return err
end

-- insert writes rows (one parameter list per row, in column order) with as
-- few INSERT statements as the parameter limit allows. suffix is appended to
-- each statement (an ON CONFLICT clause).
function M.insert(db: storage.Executor, table_name: string, columns: { storage.Column }, rows: { types.SqlParams }, suffix: string?): error?
    if #rows == 0 then return nil end
    local names: { string } = {}
    for i, c in ipairs(columns) do names[i] = c.name end
    local per = math.max(1, MAX_PARAMS // #columns)
    local head = "INSERT INTO " .. table_name .. " (" .. table.concat(names, ", ") .. ") VALUES "
    for first = 1, #rows, per do
        local tuples: { string } = {}
        local params: types.SqlParams = {}
        for r = first, math.min(first + per - 1, #rows) do
            local marks: { string } = {}
            for i, c in ipairs(columns) do
                params[#params + 1] = rows[r][i]
                local mark = "$" .. #params
                marks[i] = c.expr and string.format(c.expr :: string, mark) or mark
            end
            tuples[#tuples + 1] = "(" .. table.concat(marks, ", ") .. ")"
        end
        local err = exec(db, head .. table.concat(tuples, ", ") .. (suffix or ""), params)
        if err then return errors.wrap(err, table_name .. " bulk insert failed") end
    end
    return nil
end

-- delete_in deletes the rows of table_name whose column is one of ids, within
-- the rows matching scope (a condition with leading parameters scope_params).
function M.delete_in(db: storage.Executor, table_name: string, scope: string?, scope_params: types.SqlParams, column: string, ids: { string }): error?
    if #ids == 0 then return nil end
    local per = MAX_PARAMS - #scope_params
    for first = 1, #ids, per do
        local params: types.SqlParams = {}
        for _, p in ipairs(scope_params) do params[#params + 1] = p end
        local marks: { string } = {}
        for i = first, math.min(first + per - 1, #ids) do
            params[#params + 1] = ids[i]
            marks[#marks + 1] = "$" .. #params
        end
        local where = column .. " IN (" .. table.concat(marks, ", ") .. ")"
        if scope then where = scope .. " AND " .. where end
        local err = exec(db, "DELETE FROM " .. table_name .. " WHERE " .. where, params)
        if err then return errors.wrap(err, table_name .. " bulk delete failed") end
    end
    return nil
end

return M
