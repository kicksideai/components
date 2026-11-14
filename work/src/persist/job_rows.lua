-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local storage = require("storage")
-- Job demand, population scans and progress updates.
local sql = require("sql")
local store = require("store")
local domain = require("domain")
local funcs = require("funcs")
local M = {}

local function marks(params: domain.SqlParams, values: { string }): string
    local list: { string } = {}
    for _, v in ipairs(values) do
        params[#params + 1] = v
        list[#list + 1] = "$" .. #params
    end
    return table.concat(list, ", ")
end

local function type_ids(board: domain.Board, p: domain.Process): { string }
    local out: { string } = {}
    for _, t in ipairs(board.compiled.item_types) do
        if t.process == p.id then out[#out + 1] = t.id end
    end
    return out
end

-- stale lists up to limit items that run an older definition of p and sit in a state the process declares or maps.
function M.stale(db: storage.Executor, board: domain.Board, p: domain.Process, limit: integer, dialect: string): ({ domain.Item }?, error?)
    local types_of = type_ids(board, p)
    if #types_of == 0 then return {}, nil end
    local params: domain.SqlParams = { board.board_id, p.generation, p.id }
    local type_marks = marks(params, types_of)
    params[#params + 1] = limit
    local definitions = dialect == sql.type.POSTGRES
        and "kickside_work_generation g CROSS JOIN LATERAL jsonb_array_elements(g.compiled::jsonb -> 'processes') p(value)"
        or "kickside_work_generation g, json_each(g.compiled, '$.processes') p"
    local process_id = dialect == sql.type.POSTGRES and "p.value ->> 'id'" or "json_extract(p.value, '$.id')"
    local migration = dialect == sql.type.POSTGRES and "p.value ->> 'migration'" or "json_extract(p.value, '$.migration')"
    local follows = "EXISTS (SELECT 1 FROM " .. definitions .. " WHERE g.board_id = i.board_id AND g.generation = i.process_generation AND "
        .. process_id .. " = $3 AND " .. migration .. " = 'follow')"
    local rows, err = db:query("SELECT i.item_id FROM kickside_work_item i WHERE i.board_id = $1 AND i.process_generation < $2 AND " .. follows
        .. " AND i.type IN (" .. type_marks .. ") ORDER BY i.item_id LIMIT $" .. #params, params)
    if err then return nil, errors.wrap(err, "stale item read failed") end
    local ids: { string } = {}
    for _, r in ipairs(rows or {}) do
        local decoded_1, decode_err = store.need(r, "item_id")
        if decode_err then return nil, decode_err end
        local decoded_1 = decoded_1 :: string
        ids[#ids + 1] = decoded_1
    end
    return store.items(db, board.board_id, ids)
end

function M.pending(db: storage.Executor, board_id: string, recompute: boolean?): ({ domain.Row }?, error?)
    local kind = recompute and "job_type IN ('reindex', 'recompute')" or "job_type = 'reindex'"
    return db:query("SELECT 1 FROM kickside_work_job WHERE board_id = $1 AND " .. kind .. " AND status <> 'done' LIMIT 1", { board_id })
end

function M.demand(db: storage.Executor, board_id: string, kind: string): ({ domain.Row }?, error?)
    return db:query("SELECT key, status, job_id FROM kickside_work_job WHERE board_id = $1 AND job_type = $2", { board_id, kind })
end

function M.population(db: storage.Executor, board_id: string): (integer?, error?)
    return store.count(db, "SELECT COUNT(*) AS n FROM kickside_work_item WHERE board_id = $1", { board_id })
end

function M.long_ranks(db: storage.Executor, board_id: string, limit: integer): (integer?, error?)
    return store.count(db, "SELECT COUNT(*) AS n FROM kickside_work_item WHERE board_id = $1 AND length(rank) > $2", { board_id, limit })
end

function M.range(db: storage.Executor, board_id: string, after: string, limit: integer): ({ domain.Row }?, error?)
    return db:query([[SELECT item_id FROM kickside_work_item WHERE board_id = $1 AND item_id > $2 AND life <> 'purged'
        ORDER BY item_id LIMIT $3]], { board_id, after, limit })
end

function M.finish_rebuild(db: storage.Executor, board_id: string, job_id: string, kind: string, key: unknown): (boolean, error?)
    local rows, err = db:query("UPDATE kickside_work_job SET status = 'done', error = NULL WHERE board_id = $1 AND job_id = $2 AND job_type = $3 AND key = $4 AND status <> 'done' RETURNING job_id", { board_id, job_id, kind, key })
    if err then return false, err end
    return rows ~= nil and rows[1] ~= nil, nil
end

function M.complete(board_id: string, job_id: string, kind: string, key: unknown): (boolean, error?)
    local db, err = store.open()
    if not db then return false, err end
    local done, derr = M.finish_rebuild(db, board_id, job_id, kind, key)
    db:release()
    if derr or not done then return done, derr end
    local _, perr = funcs.call("kickside.work.persist:publish_meta", { thread_id = board_id })
    return true, perr
end

function M.record(board_id: string, job_id: string, status: string, message: string?): error?
    local db, err = store.open()
    if not db then return err end
    local _, rerr = db:execute("UPDATE kickside_work_job SET status = $1, error = $2 WHERE board_id = $3 AND job_id = $4",
        { status, message or sql.NULL, board_id, job_id })
    db:release()
    if rerr then return rerr end
    local _, perr = funcs.call("kickside.work.persist:publish_meta", { thread_id = board_id })
    return perr
end

-- rebuilds reads the durable demand and failure state for query admission and public meta.
function M.rebuilds(db: storage.Executor, board_id: string): ({ domain.Row }?, error?)
    return db:query("SELECT job_type, key, status, error FROM kickside_work_job WHERE board_id = $1 AND job_type IN ('reindex', 'recompute') AND status <> 'done' ORDER BY job_type", { board_id })
end

return M
