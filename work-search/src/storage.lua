-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local registry = require("registry")
local json = require("json")
local index = require("index")

type Generation = { id: string, schema: integer, scope: string, registration: integer }
type State = { revision: integer?, active: Generation?, building: Generation?, retired: string?, token: string?, deleting: boolean? }
type Candidate = { item_id: string, item_key: string, source_seq: integer }

local M = { Generation = Generation, State = State, Candidate = Candidate }
local SPEC = {
    vectors = "", vector_key = "",
    rows = "kickside_work_search_row", row_key = "row_id", partition = "generation_id",
    columns = { "item_id", "item_key", "source_seq" }, fts = "kickside_work_search_fts",
    fts_key = "rowid", tsvector = "search_vector",
}

function M.open(): (sql.DB?, error?)
    local entry, err = registry.get("kickside.work_search:storage_config")
    if err then return nil, err end
    local id = entry and entry.meta.db_id
    if type(id) ~= "string" then
        return nil, errors.new({ kind = errors.UNAVAILABLE, message = "Work Search database is not configured",
            details = { code = "search_unavailable" } })
    end
    return sql.get(id)
end

function M.load(db: sql.DB | sql.Transaction, attachment_id: string): (State?, error?)
    local rows, err = db:query("SELECT state FROM kickside_work_search_state WHERE attachment_id = $1", { attachment_id })
    if err or not rows or not rows[1] then return nil, err end
    local state, decode_err = json.decode(rows[1].state :: string)
    return state :: State?, decode_err
end

function M.candidates(attachment_id: string, schema: integer, scope: string, text: string, limit: integer): ({ Candidate }?, error?)
    local db, err = M.open()
    if err or not db then return nil, err end
    local state, load_err = M.load(db, attachment_id)
    local active = state and not state.deleting and state.active
    local rows: { Candidate }? = nil
    if not load_err then
        if not active or active.schema ~= schema or active.scope ~= scope then
            load_err = errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "Work Search is building its index",
                details = { code = "search_indexing" } })
        else
            local key = text:match("^%s*([a-zA-Z][a-zA-Z0-9]*%-%d+)%s*$")
            if key then
                local matches
                matches, load_err = db:query([[SELECT item_id, item_key, source_seq FROM kickside_work_search_row
                    WHERE generation_id=$1 AND item_key=$2]], { active.id, key:upper() })
                rows = matches :: { Candidate }?
            else
                local matches, search_err = index.lexical_search(db, SPEC, text, { partition = active.id, limit = limit })
                rows, load_err = matches :: { Candidate }?, search_err :: error?
            end
        end
    end
    local _, release_err = db:release()
    return rows, load_err or release_err
end


-- Competing fold and teardown pages serialize on the attachment's state row.
function M.write<T>(attachment_id: string, board_id: string, operation: (sql.Transaction, boolean, State) -> (T?, error?)): (T?, error?)
    local db, err = M.open()
    if err or not db then return nil, err end
    local sqlite = db:type() == sql.type.SQLITE
    local tx, begin_err = db:begin()
    if begin_err or not tx then db:release(); return nil, begin_err end
    local locked, lock_err = tx:query([[INSERT INTO kickside_work_search_state (attachment_id, board_id, state)
        VALUES ($1,$2,'{}') ON CONFLICT (attachment_id) DO UPDATE SET board_id=excluded.board_id
        WHERE kickside_work_search_state.board_id=excluded.board_id RETURNING state]], { attachment_id, board_id })
    local result: T?
    local failure = lock_err
    if not failure then
        if not locked or not locked[1] then
            failure = errors.new({ kind = errors.CONFLICT, message = "search attachment belongs to a different board",
                details = { code = "search_attachment_mismatch" } })
        else
            local decoded, decode_err = json.decode(locked[1].state :: string)
            failure = decode_err
            if not failure then result, failure = operation(tx, sqlite, decoded :: State) end
        end
    end
    if failure then
        tx:rollback()
    else
        local _, commit_err = tx:commit()
        failure = commit_err
    end
    local _, release_err = db:release()
    if failure or release_err then return nil, failure or release_err end
    return result, nil
end

function M.save(tx: sql.Transaction, attachment_id: string, state: State): error?
    state.revision = (state.revision or 0) + 1
    local encoded, err = json.encode(state)
    if err or not encoded then return err end
    local _, save_err = tx:execute("UPDATE kickside_work_search_state SET state=$1 WHERE attachment_id=$2", { encoded, attachment_id })
    return save_err
end

function M.put(tx: sql.Transaction, sqlite: boolean, generation: string, item: Candidate, content: string): error?
    local rows, err = tx:query([[INSERT INTO kickside_work_search_row (generation_id,item_id,item_key,source_seq,content)
        VALUES ($1,$2,$3,$4,$5) ON CONFLICT (generation_id,item_id) DO UPDATE
        SET item_key=excluded.item_key,source_seq=excluded.source_seq,content=excluded.content
        RETURNING row_id]], { generation, item.item_id, item.item_key, item.source_seq, content })
    if err or not sqlite then return err end
    local row_id = rows[1].row_id
    local _, delete_err = tx:execute("DELETE FROM kickside_work_search_fts WHERE rowid=$1", { row_id })
    if delete_err then return delete_err end
    local _, insert_err = tx:execute("INSERT INTO kickside_work_search_fts (rowid,content) VALUES ($1,$2)", { row_id, content })
    return insert_err
end

function M.remove(tx: sql.Transaction, sqlite: boolean, generation: string, item_id: string): error?
    local rows, err = tx:query("DELETE FROM kickside_work_search_row WHERE generation_id=$1 AND item_id=$2 RETURNING row_id", { generation, item_id })
    if err or not sqlite or not rows or not rows[1] then return err end
    local _, fts_err = tx:execute("DELETE FROM kickside_work_search_fts WHERE rowid=$1", { rows[1].row_id })
    return fts_err
end

function M.drain(tx: sql.Transaction, sqlite: boolean, generation: string): (boolean?, error?)
    local page = "(SELECT row_id FROM kickside_work_search_row WHERE generation_id=$1 ORDER BY item_id LIMIT $2)"
    local args = { generation, 200 }
    if sqlite then
        local _, err = tx:execute("DELETE FROM kickside_work_search_fts WHERE rowid IN " .. page, args)
        if err then return nil, err end
    end
    local removed, err = tx:execute("DELETE FROM kickside_work_search_row WHERE row_id IN " .. page, args)
    if err or not removed then return nil, err end
    return removed.rows_affected < 200, nil
end

return M
