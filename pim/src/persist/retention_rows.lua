-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local failure=require("failure")
-- Retention statements: the scans and prunes the retention owner runs.
local store = require("store")
local sql = require("sql")
local time = require("time")
local clock = require("clock")
local types = require("types")

local json=require("json")
local M = {}


-- trashed pages expired trash in stable product order.
function M.trashed(db: types.Executor, catalog_id: string, before: string, limit: integer, after: string?): ({ types.Row }?, error?)
    local cursor: {at: string,id: string}={at="",id=""}
    if after and after~="" then
        local parsed,jerr=json.decode(after)
        if jerr or type(parsed)~="table" then return nil,failure.corrupt("trash retention cursor is malformed","product_after") end
        cursor=parsed :: {at:string,id:string}
    end
    local rows, err = db:query([[SELECT product_id,version,state_at FROM kickside_pim_product
        WHERE catalog_id=$1 AND state <> 'live' AND state='trashed' AND state_at < $2
        AND (state_at,product_id)>($3,$4) ORDER BY state_at,product_id LIMIT $5]],{catalog_id,before,cursor.at,cursor.id,limit})
    if err then return nil, errors.wrap(err, "trash scan failed") end
    return rows or {}, nil
end

-- Purged products are permanent, nonreusable identities. Their rows remain the
-- retry addresses until the owner retires all three Core subjects outside SQL.
type Tombstone = {product_id: string, updated_seq: integer}
M.Tombstone = Tombstone
function M.tombstones(tx: types.Executor, catalog_id: string, before: string, limit: integer): ({Tombstone}?, error?)
    local rows, err = tx:query([[SELECT product_id, updated_seq FROM kickside_pim_product WHERE catalog_id = $1 AND state <> 'live' AND state = $2
        AND state_at < $3 ORDER BY state_at, product_id LIMIT $4]], { catalog_id, "purged", before, limit })
    if err then return nil, errors.wrap(err, "tombstone scan failed") end
    local out: {Tombstone} = {}
    for _, raw in ipairs(rows or {}) do
        local row, derr = store.decode_row(raw, {product_id="text", updated_seq="int"})
        if derr or not row then return nil, derr end
        out[#out+1] = {product_id=row.product_id :: string, updated_seq=row.updated_seq :: integer}
    end
    return out, nil
end

-- Delete only the exact permanently purged page whose Core retirement succeeded.
function M.prune_tombstones(tx: types.Executor, catalog_id: string, tombs: {Tombstone}, floor_seq: integer): (integer?, error?)
    local floor = floor_seq
    for _, row in ipairs(tombs) do
        local _, err = tx:execute("DELETE FROM kickside_pim_product WHERE catalog_id=$1 AND product_id=$2 AND state='purged' AND updated_seq=$3", {catalog_id, row.product_id, row.updated_seq})
        if err then return nil, errors.wrap(err, "tombstone prune failed") end
        floor = math.max(floor, row.updated_seq)
    end
    if floor > floor_seq then
        local _, err = tx:execute("UPDATE kickside_pim_catalog SET tombstone_floor_seq=$1 WHERE catalog_id=$2", {floor, catalog_id})
        if err then return nil, errors.wrap(err, "tombstone floor update failed") end
    end
    return #tombs, nil
end

-- The owner holds the catalog lock. A reader's snapshot sees both the
-- withdrawals and their expiry floor before or after this transaction.
function M.prune_publications(tx: types.Executor, catalog_id: string, before: string, limit: integer): (integer?, error?)
    local rows, err = tx:query([[SELECT channel, product_id, seq FROM kickside_pim_publication
        WHERE catalog_id = $1 AND state <> 'published' AND updated_at < $2
        ORDER BY updated_at, channel, product_id LIMIT $3]], { catalog_id, before, limit })
    if err or not rows then return nil, err end
    for _, row in ipairs(rows) do
        local _, derr = tx:execute([[DELETE FROM kickside_pim_publication
            WHERE catalog_id = $1 AND channel = $2 AND product_id = $3]], { catalog_id, row.channel, row.product_id })
        if derr then return nil, derr end
        local _, ferr = tx:execute([[INSERT INTO kickside_pim_publication_floor (catalog_id, channel, seq, product_id)
            VALUES ($1, $2, $3, $4) ON CONFLICT (catalog_id, channel) DO UPDATE
            SET seq = excluded.seq, product_id = excluded.product_id
            WHERE (kickside_pim_publication_floor.seq, kickside_pim_publication_floor.product_id) < (excluded.seq, excluded.product_id)]],
            { catalog_id, row.channel, row.seq, row.product_id })
        if ferr then return nil, ferr end
    end
    return #rows, nil
end

function M.orphan_receipts(tx:types.Executor,limit:integer): (integer?,boolean?,error?)
    -- All expired receipts are eligible, regardless of catalog existence.
    local rows,err=tx:query("SELECT catalog_id,marker FROM kickside_pim_receipt WHERE expires_at<$1 ORDER BY expires_at,catalog_id,marker LIMIT $2",{clock.now(),limit})
    if err then return nil,nil,err end
    for _,row in ipairs(rows or {}) do
        local _,derr=tx:execute("DELETE FROM kickside_pim_receipt WHERE catalog_id=$1 AND marker=$2 AND expires_at<$3",{row.catalog_id,row.marker,clock.now()})
        if derr then return nil,nil,derr end
    end
    return #(rows or {}),#(rows or {})==limit,nil
end
function M.global_deadline(db:types.Executor,pending_days:integer): (integer?,error?)
    local earliest:integer?=nil
    for _,class in ipairs({{name="kickside_pim_creation",column="reserved_at",days=pending_days},{name="kickside_pim_receipt",column="expires_at",days=0}}) do
        local rows,err=db:query("SELECT "..class.column.." AS at FROM "..class.name.." WHERE "..class.column..">=$1 ORDER BY "..class.column.." LIMIT 1",{clock.ago(class.days)})
        if err then return nil,err end
        if rows and rows[1] then
            local instant,perr=time.parse(time.RFC3339,rows[1].at :: string)
            if perr or not instant then return nil,perr end
            local deadline=math.floor(instant:unix_nano()/1000000)+class.days*86400000+1000
            earliest=earliest and math.min(earliest,deadline) or deadline
        end
    end
    return earliest,nil
end

type Position = { catalog_id: string, inclusive: integer, product_after: string, deadline_ms: integer?, pending: integer?, cleanup_turn: integer? }
M.Position = Position

function M.position(db: types.Executor): (Position?, error?)
    local rows, err = db:query("SELECT catalog_id, inclusive, product_after, deadline_ms, pending, cleanup_turn FROM kickside_pim_retention WHERE owner_id = 'pim'", {})
    if err then return nil, err end
    if not rows or not rows[1] then return nil, failure.corrupt("retention position is missing") end
    local row, derr = store.decode_row(rows[1], { catalog_id = "text", inclusive = "int", product_after = "text", cleanup_turn = "int" })
    if derr or not row then return nil, derr end
    return { catalog_id = row.catalog_id :: string, inclusive = row.inclusive :: integer, product_after = row.product_after :: string,
        deadline_ms = tonumber(row.deadline_ms) :: integer?, pending = tonumber(row.pending) :: integer?, cleanup_turn = row.cleanup_turn :: integer }, nil
end

function M.advance(db: types.Executor, position: Position): error?
    local _, err = db:execute([[UPDATE kickside_pim_retention SET catalog_id = $1, inclusive = $2, product_after = $3,
        deadline_ms = $4, pending = $5, cleanup_turn = $6 WHERE owner_id = 'pim'
        AND (catalog_id<>$1 OR inclusive<>$2 OR product_after<>$3 OR COALESCE(deadline_ms,0)<>COALESCE(CAST($4 AS BIGINT),0)
            OR pending<>$5 OR cleanup_turn<>$6)]],
        { position.catalog_id, position.inclusive, position.product_after, position.deadline_ms or sql.NULL, position.pending or 0, position.cleanup_turn or 0 })
    return err
end

-- Take the key page before probing teardown so queued keys can advance the sweep.
function M.catalogs(db: types.Executor, position: Position, limit: integer): ({ types.Row }?, error?)
    local rows, err = db:query([[SELECT page.catalog_id, page.compiled, page.retention_after,
        COALESCE((SELECT 1 FROM kickside_pim_cleanup AS q WHERE q.catalog_id = page.catalog_id), 0) AS teardown
        FROM (SELECT catalog_id, compiled, retention_after FROM kickside_pim_catalog
            WHERE catalog_id >= $1 AND (catalog_id > $1 OR $2 = 1)
            ORDER BY catalog_id LIMIT $3) AS page ORDER BY page.catalog_id]],
        { position.catalog_id, position.inclusive, limit })
    if err then return nil, errors.wrap(err, "catalog scan failed") end
    return rows or {}, nil
end

type Cleanup = { catalog_id: string, cleaned: integer }
M.Cleanup=Cleanup

function M.enqueue_cleanup(tx: types.Executor, catalog_id: string, cleaned: boolean): error?
    local _, err = tx:execute([[INSERT INTO kickside_pim_cleanup (catalog_id, cleaned) VALUES ($1, $2)
        ON CONFLICT (catalog_id) DO UPDATE SET cleaned = excluded.cleaned]], { catalog_id, cleaned and 1 or 0 })
    return err
end

function M.cleanup_page(db: types.Executor,limit: integer): ({Cleanup}?,error?)
    local rows,err=db:query("SELECT catalog_id,cleaned FROM kickside_pim_cleanup ORDER BY attempted_at,catalog_id LIMIT $1",{limit})
    if err then return nil,err end
    local out:{Cleanup}={}
    for _,raw in ipairs(rows or {}) do
        local row,derr=store.decode_row(raw,{catalog_id="text",cleaned="int"})
        if derr or not row then return nil,derr end
        out[#out+1]={catalog_id=row.catalog_id :: string,cleaned=row.cleaned :: integer}
    end
    return out,nil
end

function M.attempt_cleanup(tx: types.Executor,catalog_id: string): error?
    local _,err=tx:execute("UPDATE kickside_pim_cleanup SET attempted_at=$1 WHERE catalog_id=$2",{clock.deadline(0).at,catalog_id})
    return err
end

function M.finish_cleanup(tx: types.Executor, catalog_id: string): error?
    local _, err = tx:execute("DELETE FROM kickside_pim_cleanup WHERE catalog_id = $1", { catalog_id })
    return err
end

-- The strict age comparison makes a row eligible in the next timestamp second.
function M.deadline(db: types.Executor, catalog_id: string, effective: types.Policy): (integer?, error?)
    local earliest: integer? = nil
    local classes = {
        { table = "kickside_pim_import_work",column="completed_at",days=effective.import_days },
        { table = "kickside_pim_proposal", column = "created_at", days = effective.proposal_days },
        { table = "kickside_pim_release_job", column = "completed_at", days = effective.completed_work_days,filter=" AND done=1" },
        { table = "kickside_pim_release_job", column = "created_at", days = effective.abandoned_work_days,filter=" AND done=0" },
        { table = "kickside_pim_product", column = "state_at", state = "trashed", days = effective.trash_days },
        { table = "kickside_pim_product", column = "state_at", state = "purged", days = effective.tombstone_days },
        { table = "kickside_pim_change", column = "at", days = effective.audit_days },
        { table = "kickside_pim_release",column="created_at",days=effective.audit_days },
        { table = "kickside_pim_generation",column="applied_at",days=effective.audit_days },
        { table = "kickside_pim_term",column="retired_at",days=effective.audit_days,filter=" AND retired=1" },
        { table = "kickside_pim_publication",column="updated_at",days=effective.audit_days,filter=" AND state<>'published'" },
    }
    for _, class in ipairs(classes) do
        if class.days > 0 then
            local filter = class.state and " AND state <> 'live' AND state=$3" or class.filter or ""
            if class.table=="kickside_pim_import_work" then filter=filter.." AND done=1" end
            local rows, err = db:query("SELECT " .. class.column .. " AS at FROM " .. class.table ..
                " WHERE catalog_id=$1 AND " .. class.column .. ">=$2" .. filter .. " ORDER BY " .. class.column .. " LIMIT 1",
                class.state and { catalog_id, clock.ago(class.days), class.state } or { catalog_id, clock.ago(class.days) })
            if err then return nil, errors.wrap(err, "retention deadline read") end
            local at = rows[1] and rows[1].at
            if at ~= nil and at ~= sql.NULL then
                local instant, perr = time.parse(time.RFC3339, at :: string)
                if perr then return nil, errors.wrap(perr, "retention timestamp") end
                local deadline = math.floor(instant:unix_nano() / 1000000) + class.days * 86400000 + 1000
                earliest = earliest and math.min(earliest, deadline) or deadline
            end
        end
    end
    return earliest, nil
end

return M
