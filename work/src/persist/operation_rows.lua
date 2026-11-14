-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local uuid = require("uuid")
local jobs = require("jobs")
local identity = require("identity")
local store = require("store")
local types = require("types")
local expiry = require("expiry")
local M = {}

function M.get(db: sql.DB, board_id: string, id: string?, kind: string?, key: string?): (types.Owner?, error?)
    local before, berr = expiry.before()
    if berr or not before then return nil, berr end
    local params: { unknown } = id and { board_id, id, before } or { board_id, kind, key, before }
    local rows, err = db:query("SELECT * FROM kickside_work_operation WHERE board_id = $1 AND " .. (id and "operation_id = $2" or "kind = $2 AND key = $3") ..
        " AND NOT (" .. expiry.RETIRABLE .. " AND " .. expiry.at(db:type()) .. " < $" .. #params .. ")", params)
    if err then return nil, err end
    if not rows or not rows[1] then return nil, nil end
    local row = rows[1]
    local data, derr = store.stored(row.data, {} :: types.Map)
    if derr then return nil, derr end
    local counts, cerr = store.stored(row.counts, {} :: { [string]: integer })
    if cerr then return nil, cerr end
    return { board_id = board_id, operation_id = row.operation_id :: string, kind = row.kind :: string, key = row.key :: string,
        request_hash = row.request_hash :: string, actor_id = row.actor_id :: string, actor_context = row.actor_context :: string,
        data = data :: types.Map, counts = counts :: { [string]: integer }, processed = store.int(row.processed) :: integer,
        status = row.status :: string, error_code = store.text(row.error_code), job_id = row.job_id :: string }, nil
end

-- The owner and leased job commit together; identity stays on the owner.
function M.create(board_id: string, kind: string, key: string, hashed: string, data: types.Map, parked: boolean?): (types.Owner?, error?)
    local captured, ierr = identity.capture()
    if ierr then return nil, ierr :: error end
    local encoded, eerr = identity.to_row(captured)
    if eerr or not encoded then return nil, eerr :: error? end
    local _, retirement_err = expiry.retire(board_id,kind,key)
    if retirement_err then return nil,retirement_err end
    local db, err = store.open()
    if not db then return nil, err end
    local tx, terr = db:begin()
    if terr or not tx then db:release(); return nil, terr end
    local id = uuid.v4()
    local rows, rerr = tx:query([[INSERT INTO kickside_work_operation
        (board_id,operation_id,kind,key,request_hash,actor_id,actor_context,data,status,job_id)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'pending','') ON CONFLICT (board_id,kind,key) DO NOTHING RETURNING operation_id]],
        { board_id, id, kind, key, hashed, encoded.actor_id, encoded.actor_context, store.encode(data) })
    if rerr then tx:rollback(); db:release(); return nil, rerr end
    if rows and rows[1] then
        local job, jerr = jobs.enqueue_tx(tx, db:type(), { namespace = "kickside.work", scope = board_id, key = kind .. ":" .. id,
            owner_locator = { kind = "component", id = board_id }, job_type = "kickside.work.jobs:" .. kind,
            immutable_payload = { board_id = board_id, operation_id = id }, slot = true, parked = parked, wake_key = "work:" .. id })
        if jerr then tx:rollback(); db:release(); return nil, jerr end
        local _, uerr = tx:execute("UPDATE kickside_work_operation SET job_id = $1 WHERE board_id = $2 AND operation_id = $3", { job.id, board_id, id })
        if uerr then tx:rollback(); db:release(); return nil, uerr end
    end
    local _, cerr = tx:commit()
    if cerr then db:release(); return nil, cerr end
    local owner, oerr = M.get(db, board_id, nil, kind, key)
    db:release()
    if oerr or not owner then return nil, oerr end
    if owner.request_hash ~= hashed then return nil, errors.new({ kind = errors.CONFLICT, message = "operation key names another request", details = { code = "idempotency_conflict" } }) end
    if not parked then
        local _, werr = jobs.wake_job(owner.job_id, { control = true, ensure_due = true })
        if werr then return nil, werr end
    end
    return owner, nil
end

function M.update(owner: types.Owner, status: string, code: string?): error?
    local db, err = store.open()
    if not db then return err end
    local updated, uerr = db:query([[UPDATE kickside_work_operation SET status = CASE WHEN status = 'cancelled' THEN status ELSE $1 END,
        processed = $2, counts = $3, error_code = $4 WHERE board_id = $5 AND operation_id = $6 RETURNING status]],
        { status, owner.processed, store.encode(owner.counts), code or sql.NULL, owner.board_id, owner.operation_id })
    db:release()
    if uerr then return uerr end
    if not updated or not updated[1] then return errors.new({ kind = errors.NOT_FOUND, message = "operation owner is absent", details = { code = "operation_not_found" } }) end
    owner.status = updated[1].status :: string
    return nil
end

function M.resume(owner: types.Owner): (types.Owner?, error?)
    if owner.status ~= "failed" then return owner, nil end
    local db, err = store.open()
    if not db then return nil, err end
    local _, uerr = db:execute([[UPDATE kickside_work_operation SET status = 'pending', error_code = NULL
        WHERE board_id = $1 AND operation_id = $2 AND status = 'failed']], { owner.board_id, owner.operation_id })
    if uerr then db:release(); return nil, uerr end
    local current, rerr = M.get(db, owner.board_id, owner.operation_id, nil, nil)
    db:release()
    if rerr or not current then return nil, rerr end
    if current.status == "pending" then
        local _, werr = jobs.wake_job(current.job_id, { control = true, ensure_due = true })
        if werr then return nil, werr end
    end
    return current, nil
end

function M.status(owner: types.Owner): types.Status
    local ids: { string } = {}
    if owner.kind == "move" then
        for _, item in ipairs((owner.data.plan :: types.MovePlan).items) do ids[#ids + 1] = item.item end
    end
    local count = owner.counts
    return { bulk_id = owner.kind == "bulk" and owner.operation_id or nil, move_id = owner.kind == "move" and owner.operation_id or nil,
        job_id = owner.job_id, status = owner.status == "finishing" and "running" or owner.status, total = owner.kind == "bulk" and #(owner.data.ids :: { string }) or #ids,
        processed = owner.processed, applied = count.applied or 0, unchanged = count.unchanged or 0, invalid = count.invalid or 0,
        denied = count.denied or 0, conflict = count.conflict or 0, unavailable = count.unavailable or 0, error_code = owner.error_code,
        item = owner.kind == "move" and (owner.data.plan :: types.MovePlan).item or nil, items = owner.kind == "move" and ids or nil }
end
return M
