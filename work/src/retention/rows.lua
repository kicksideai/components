-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
-- Retention positions and bounded collection of board-owned rows.
local sql = require("sql")
local time = require("time")
local store = require("store")
local lifecycle = require("lifecycle")
local clock = require("clock")
local policy = require("policy")
local domain = require("domain")
local tables = require("tables")
local operation_expiry = require("operation_expiry")
local jobs = require("jobs")
local threads = require("threads")
local M = {}


function M.position(db: sql.DB): (types.Position?, error?)
    local rows, err = db:query("SELECT board_after, inclusive, board_scan, deadline_ms FROM kickside_work_retention WHERE owner_id = 'work'", {})
    if err then return nil, err end
    if not rows or not rows[1] then return nil, errors.new({ kind = errors.INTERNAL, message = "retention position is missing", details = { code = "row_corrupt" } }) end
    local board_after, berr = store.need(rows[1], "board_after")
    if berr or not board_after then return nil, berr end
    local inclusive, ierr = store.need_int(rows[1], "inclusive")
    if ierr or not inclusive then return nil, ierr end
    local board_scan, perr = store.need(rows[1], "board_scan")
    if perr or not board_scan then return nil, perr end
    return { board_after = board_after, inclusive = inclusive, board_scan = board_scan, deadline_ms = store.int(rows[1].deadline_ms) }, nil
end

local PENDING = "retention_after IS NOT NULL"

-- Save the row continuations with the board scan position so another board
-- gets its turn even when the same board needs several collection pages.
function M.advance(position: types.Position, checkpoints: { types.Checkpoint }?, at_end: boolean?): (error?, boolean?)
    local pending, err = lifecycle.transaction(function(tx: sql.Transaction, _dialect: string): (boolean?, error?)
        for _, checkpoint in ipairs(checkpoints or {}) do
            local _, err = tx:execute("UPDATE kickside_work_board SET retention_after = $1 WHERE board_id = $2",
                { checkpoint.after or sql.NULL, checkpoint.board_id })
            if err then return nil, err end
        end
        local resume = false
        if at_end then
            local rows, pending_err = tx:query("SELECT board_id FROM kickside_work_board WHERE " .. PENDING .. " ORDER BY board_id LIMIT 1", {})
            if pending_err then return nil, pending_err end
            resume = rows ~= nil and rows[1] ~= nil
            position.board_after, position.inclusive, position.board_scan = "", 0, resume and "pending" or "all"
            if not resume then
                position.deadline_ms = nil
                local _, orphan_err = tx:execute("UPDATE kickside_work_retention SET orphan_after = '' WHERE owner_id = 'work' AND orphan_after <> ''", {})
                if orphan_err then return nil, orphan_err end
            end
        end
        local _, err = tx:execute([[UPDATE kickside_work_retention SET board_after = $1, inclusive = $2, board_scan = $3, deadline_ms = $4
            WHERE owner_id = 'work' AND (board_after <> $1 OR inclusive <> $2 OR board_scan <> $3
                OR COALESCE(deadline_ms, -1) <> COALESCE(CAST($4 AS bigint), -1))]],
            { position.board_after, position.inclusive, position.board_scan, position.deadline_ms or sql.NULL })
        return resume, err
    end)
    return err, pending
end

function M.boards(db: sql.DB, position: types.Position, limit: integer): ({ domain.Row }?, error?)
    local seek = position.inclusive == 1 and " >= $1" or " > $1"
    local filter = position.board_scan ~= "all" and (" AND " .. PENDING) or ""
    return db:query("SELECT board_id, retention_after FROM kickside_work_board WHERE board_id" .. seek .. filter ..
        " ORDER BY board_id LIMIT $2", { position.board_after, limit })
end

function M.record_floor(db: sql.DB | sql.Transaction, board_id: string, floor: integer): error?
    local _, err = db:execute("UPDATE kickside_work_board SET tombstone_floor_seq = $1 WHERE board_id = $2 AND tombstone_floor_seq < $1",
        { floor, board_id })
    return err
end

function M.trash(db: sql.DB, board_id: string, days: integer, limit: integer): ({ domain.Row }?, error?)
    return db:query([[SELECT item_id, version FROM kickside_work_item WHERE board_id = $1 AND life <> 'live' AND life = 'trashed'
        AND life_at < $2 ORDER BY life_at, item_id LIMIT $3]], { board_id, clock.offset(-days * 86400), limit })
end

local function past_visit(name: string, dialect: string): string
    local root = dialect == "postgres" and "CAST(i.process_data::jsonb ->> 'visit' AS integer)"
        or "json_extract(i.process_data, '$.visit')"
    local regions = dialect == "postgres" and "jsonb_each(i.process_data::jsonb -> 'region_data') r"
        or "json_each(i.process_data, '$.region_data') r"
    local visit = dialect == "postgres" and "CAST(r.value ->> 'visit' AS integer)" or "json_extract(r.value, '$.visit')"
    return "NOT EXISTS (SELECT 1 FROM kickside_work_item i WHERE i.board_id=$1 AND i.item_id=" .. name .. ".item_id"
        .. " AND i.life<>'purged' AND (COALESCE(" .. root .. ",i.visit)=" .. name .. ".visit"
        .. " OR EXISTS (SELECT 1 FROM " .. regions .. " WHERE " .. visit .. "=" .. name .. ".visit)))"
end

-- The LIMIT barrier is inside the protection expression. Every retained
-- candidate consumes budget and supplies a durable continuation key.
function M.candidate_statement(name: string, projection: string, where: string, order: string, protection: string, seek: string, mark: string, later: string?, equal_order: string?): string
    local head="SELECT " .. projection .. " FROM " .. name .. " WHERE " .. where
    local tail=" ORDER BY " .. order .. " LIMIT " .. mark
    local candidates=head .. seek .. (later and (" ORDER BY " .. (equal_order or order) .. " LIMIT " .. mark) or tail)
    if later then
        -- SQLite cannot seek a row tuple whose first key is an expression.
        -- Two bounded index seeks cover its equal-age and later-age halves.
        candidates="SELECT * FROM (SELECT * FROM (" .. candidates .. ") same_age UNION ALL SELECT * FROM (" .. head .. later .. tail .. ") later_age) candidates" .. tail
    end
    return "SELECT " .. name .. ".*, CASE WHEN " .. protection .. " THEN 1 ELSE 0 END AS eligible FROM (" .. candidates .. ") " .. name
end

local function protected_page(tx: sql.Transaction, board_id: string, entry: types.Collection, before: string, limit: integer, anchor: types.CollectionPosition?): (types.Pruned?, error?)
    local keys: {string}={}
    for key in entry.keys:gmatch("[%w_]+") do keys[#keys+1]=key end
    local params: domain.SqlParams={board_id,before}
    local order=entry.order or entry.keys
    local columns: {string}={}
    local age=entry.age
    if age then columns[#columns+1]=age end
    for _,key in ipairs(keys) do columns[#columns+1]=key end
    local seek=""
    local later: string?=nil
    if anchor and #anchor.after>0 then
        local marks: {string}={}
        for _,value in ipairs(anchor.after) do params[#params+1]=value;marks[#marks+1]="$" .. #params end
        seek=" AND (" .. table.concat(columns,",") .. ")>(" .. table.concat(marks,",") .. ")"
        if age and age:find("COALESCE",1,true) then
            later=" AND " .. age .. ">" .. marks[1]
            local rest: {string}={}
            for i=2,#marks do rest[#rest+1]=marks[i] end
            seek=" AND " .. age .. "=" .. marks[1] .. " AND (" .. entry.keys .. ")>(" .. table.concat(rest,",") .. ")"
        end
    end
    local inspection_factor=later and 2 or 1
    local bound=limit//(inspection_factor+1)
    if bound==0 then return {removed=0,spent=0,examined=0,more=true,cursor="rows:" .. store.encode(anchor or {name=entry.name,after={}})},nil end
    params[#params+1]=bound
    local selected="*" .. (age and (", " .. age .. " AS retention_at") or "")
    local statement=M.candidate_statement(entry.name,selected,entry.where,order,entry.protection or "1=1",seek,"$" .. #params,later,entry.keys)
    local rows,err=tx:query(statement,params)
    if err then return nil,err end
    local removed=0
    local after: domain.SqlParams={}
    for _,row in ipairs(rows or {}) do
        local args: domain.SqlParams={board_id,before}
        local conditions: {string}={"board_id=$1"}
        after={}
        if age then after[#after+1]=row.retention_at end
        for _,key in ipairs(keys) do
            local value=row[key]
            after[#after+1]=value
            args[#args+1]=value
            conditions[#conditions+1]=key .. "=$" .. #args
        end
        if store.int(row.eligible)==1 then
            local action="DELETE FROM " .. entry.name
            if entry.name=="kickside_work_job" and (row.job_type=="reindex" or row.job_type=="recompute") then
                action="UPDATE kickside_work_job SET error=NULL, failed_at=NULL"
            end
            local _,derr=tx:execute(action .. " WHERE " .. entry.where .. " AND " .. table.concat(conditions," AND ") .. " AND (" .. (entry.protection or "1=1") .. ")",args)
            if derr then return nil,derr end
            removed=removed+1
        end
    end
    local n=#(rows or {})
    return {removed=removed,spent=n*inspection_factor+removed,examined=n*inspection_factor,more=n==bound,
        cursor=n==bound and ("rows:" .. store.encode({name=entry.name,after=after})) or nil},nil
end

-- Deleted comments are permanently nonreusable, including comments of purged
-- items. Rows remain the retry addresses until Core commits the exact page.
local function comments(board_id: string, limit: integer, item_id: string?, before: string?): (types.Pruned?, error?)
    local db,err=store.open()
    if not db then return nil,err end
    local bound=math.min(100,limit//2)
    if bound==0 then db:release(); return {removed=0,more=true},nil end
    local where=item_id and "item_id=$2" or "deleted=1 AND edited_at<$2"
    local params: domain.SqlParams={board_id,item_id or before,bound}
    local order=item_id and "comment_id" or "edited_at,comment_id"
    local page,perr=db:query("SELECT comment_id FROM kickside_work_comment WHERE board_id=$1 AND " .. where .. " ORDER BY " .. order .. " LIMIT $3",params)
    db:release()
    if perr then return nil,perr end
    if not page or #page==0 then return {removed=0,more=false},nil end
    local subjects: {string}={}
    local ids: {string}={}
    for _,row in ipairs(page) do
        local id,ierr=store.need(row,"comment_id")
        if ierr or not id then return nil,ierr end
        ids[#ids+1]=id;subjects[#subjects+1]="c:" .. id
    end
    local rerr=threads.retire(board_id,subjects)
    if rerr then return nil,rerr end
    return lifecycle.transaction(function(tx: sql.Transaction,_dialect: string): (types.Pruned?,error?)
        for _,id in ipairs(ids) do
            local _,err=tx:execute("DELETE FROM kickside_work_comment WHERE board_id=$1 AND comment_id=$2",{board_id,id})
            if err then return nil,err end
        end
        return {removed=#ids*2,more=#ids==bound},nil
    end)
end

-- collect seeks only incomplete purges. The item is the durable continuation
-- marker until every association and the native slot's bounded history drain.
function M.collect(board_id: string, limit: integer): (types.Pruned?, error?)
    local db, err = store.open()
    if not db then return nil, err end
    local rows, rerr = db:query([[SELECT item_id FROM kickside_work_item
        WHERE board_id=$1 AND life='purged' AND purge_pending=1 ORDER BY life_at,item_id LIMIT 1]], {board_id})
    db:release()
    if rerr then return nil, rerr end
    if not rows or not rows[1] then return {removed=0,more=false}, nil end
    -- Jobs removes at most 100 run rows and one slot; reserve that budget.
    if limit < 103 then return {removed=0,more=true}, nil end
    local id, ierr = store.need(rows[1], "item_id")
    if ierr or not id then return nil, ierr end
    local n, jerr = jobs.purge_slot({namespace="kickside.work",scope=board_id,key="advance:" .. id})
    if jerr then
        local details = jerr:details() or {}
        if details.cleanup_pending then return {removed=store.int(details.deleted_runs) or 0,more=true}, nil end
        return nil, jerr
    end
    local reserved = n == 1 and 101 or 0
    local comment_page,cerr=comments(board_id,limit-reserved,id)
    if cerr or not comment_page then return nil,cerr end
    reserved=reserved+comment_page.removed
    if comment_page.more or limit-reserved<2 then return {removed=reserved,more=true},nil end
    -- Keep the durable purged item until all dependent writers/slots drain.
    local retirement_err=threads.retire(board_id,{"i:" .. id})
    if retirement_err then return nil,retirement_err end
    reserved=reserved+1
    return lifecycle.transaction(function(tx: sql.Transaction, _dialect: string): (types.Pruned?, error?)
        local left = limit-reserved
        local names = tables.names(board_id)
        local classes = {
            {name=names.set, keys="item_id, col, value_key", where="item_id=$1", params={id}},
            {name="kickside_work_interval", keys="item_id, field_id, start_seq", where="board_id=$1 AND item_id=$2", params={board_id,id}},
            {name="kickside_work_stage_run", keys="item_id, visit, attempt", where="board_id=$1 AND item_id=$2", params={board_id,id}},
            {name="kickside_work_approval", keys="item_id, visit, actor", where="board_id=$1 AND item_id=$2", params={board_id,id}},
            {name="kickside_work_link", keys="from_id, type, to_board_id, to_id", where="board_id=$1 AND from_id=$2", params={board_id,id}},
            {name="kickside_work_link", keys="board_id, from_id, type, to_board_id, to_id", where="to_board_id=$1 AND to_id=$2", params={board_id,id}, order="board_id, from_id, type"},
        }
        for _, class in ipairs(classes) do
            local removed, more, perr = lifecycle.page(tx,class.name,class.keys,class.where,class.params,left-1,class.order)
            if perr or not removed then return nil, perr end
            left=left-removed
            if more then return {removed=limit-left,more=true}, nil end
        end
        local _, uerr = tx:execute("UPDATE kickside_work_item SET purge_pending=0 WHERE board_id=$1 AND item_id=$2 AND purge_pending=1", {board_id,id})
        if uerr then return nil,uerr end
        return {removed=limit-left+1,more=true}, nil
    end)
end


function M.prune(board_id: string, defaults: domain.Policy, limit: integer, cursor: string?, window: domain.EventWindow?): (types.Pruned?, error?)
    if not window then
        local db, err = store.open()
        if not db then return nil, err end
        window, err = policy.event_window(db, board_id)
        db:release()
        if err or not window then return nil, err end
    end
    local collected, collection_err = M.collect(board_id,limit)
    if collection_err or not collected then return nil,collection_err end
    if collected.more then collected.cursor = cursor; return collected,nil end
    local cutoff = window.before
    local comment_removed, comments_more = 0, false
    if cutoff then
        local comment_page, cerr = comments(board_id, limit, nil, cutoff)
        if cerr or not comment_page then return nil, cerr end
        comment_removed, comments_more = comment_page.removed, comment_page.more
    end
    limit = limit - comment_removed
    if limit == 0 then return { removed = comment_removed, more = true, cursor = cursor }, nil end
    local pruned: types.Pruned?, prune_err: error? = lifecycle.transaction(function(tx: sql.Transaction, dialect: string): (types.Pruned?, error?)
        local board, err = store.board(tx, board_id, dialect)
        if err then return nil, err end
        if not board then return { removed = 0, more = false }, nil end
        local effective, perr = policy.effective(defaults :: domain.JsonObject, board.compiled.policy_overrides)
        if perr or not effective then return nil, perr end
        local left = limit
        local examined=0
        local in_visibility=cursor and cursor:sub(1,11)=="visibility:"
        local row_anchor: types.CollectionPosition?=nil
        if cursor and cursor:sub(1,5)=="rows:" then
            local decoded,decode_err=store.stored(cursor:sub(6),{} :: types.CollectionPosition)
            if decode_err then return nil,decode_err end
            row_anchor=decoded
        end
        if cutoff and not in_visibility and not row_anchor then
            local anchor: types.VisibilityPosition={seq=board.tombstone_floor_seq,item=""}
            if cursor and cursor:sub(1,4)=="age:" then
                local decoded,decode_err=store.stored(cursor:sub(5),{} :: types.VisibilityPosition)
                if decode_err or not decoded then return nil,decode_err end
                anchor=decoded
            end
            -- Future snapshots consume inspection budget too: age eligibility
            -- is evaluated only after a bounded sequence candidate page.
            local bound=left
            local aged, age_err = tx:query([[SELECT item_id,seq,at FROM kickside_work_visibility
                WHERE board_id=$1 AND seq>$2 AND (seq,item_id)>($3,$4)
                ORDER BY seq,item_id LIMIT $5]],{board_id,board.tombstone_floor_seq,anchor.seq,anchor.item,bound})
            if age_err then return nil,age_err end
            local age_floor=board.tombstone_floor_seq
            for _,row in ipairs(aged or {}) do
                local seq,serr=store.need_int(row,"seq")
                if serr or not seq then return nil,serr end
                local id,ierr=store.need(row,"item_id")
                if ierr or not id then return nil,ierr end
                local at,aerr=store.need(row,"at")
                if aerr or not at then return nil,aerr end
                if at<cutoff then age_floor=math.max(age_floor,seq) end
                anchor={seq=seq,item=id}
            end
            if age_floor>board.tombstone_floor_seq then
                local uerr = M.record_floor(tx, board_id, age_floor)
                if uerr then return nil,uerr end
                board.tombstone_floor_seq=age_floor
            end
            examined=#(aged or {})
            left=left-examined
            if examined==bound then
                return {removed=limit-left-examined,spent=limit-left,examined=examined,more=true,cursor="age:" .. store.encode(anchor)},nil
            end
        end
        local function page(name: string, keys: string, where: string, params: domain.SqlParams, order: string?): (boolean, error?)
            local n, more, err = lifecycle.page(tx, name, keys, where, params, left, order)
            if err or not n then return false, err end
            left = left - n
            return more == true, nil
        end
        local pages: {types.Collection} = {
            { name = "kickside_work_receipt", keys = "command_key", where = "board_id = $1 AND at < $2",
                protection = "NOT (" .. operation_expiry.PROTECTED_RECEIPT .. ")", before = cutoff, age = "at", order = "at, command_key" },
            { name = "kickside_work_key_alias", keys = "key", where = "board_id = $1 AND at < $2", days = effective.tombstone_days, age="at", order = "at, key" },
            { name = "kickside_work_change", keys = "seq, n", where = "board_id = $1 AND at < $2", days = effective.audit_days, age="at", order = "at, seq, n" },
            { name = "kickside_work_interval", keys = "item_id, field_id, start_seq", where = "board_id = $1 AND ended_at < $2", days = effective.interval_days, age="ended_at", order = "ended_at, item_id, field_id, start_seq" },
            { name = "kickside_work_generation", keys = "generation", where = "board_id = $1 AND applied_at < $2", protection=[[generation < (SELECT generation FROM kickside_work_board WHERE board_id = $1)
                AND NOT EXISTS (SELECT 1 FROM kickside_work_item i WHERE i.board_id = $1 AND i.life IN ('live','trashed') AND i.process_generation <= kickside_work_generation.generation)
                AND NOT EXISTS (SELECT 1 FROM kickside_work_job j WHERE j.board_id = $1 AND j.status BETWEEN 'pending' AND 'running')]], days = effective.audit_days, age="applied_at", order = "applied_at, generation" },
            { name="kickside_work_approval", keys="item_id, visit, actor", where="board_id=$1 AND at<$2", protection=past_visit("kickside_work_approval",dialect), days=effective.audit_days, age="at", order="at, item_id, visit, actor" },
            { name="kickside_work_stage_run", keys="item_id, visit, attempt", where="board_id=$1 AND COALESCE(finished, started)<$2", protection=past_visit("kickside_work_stage_run",dialect), days=effective.audit_days, age="COALESCE(finished, started)", order="COALESCE(finished, started), item_id, visit, attempt" },
            { name="kickside_work_job", keys="job_id", where="board_id=$1 AND status='failed' AND failed_at<$2", days=effective.audit_days, age="failed_at", order="failed_at, job_id" },
        }
        if not in_visibility then
            local reached = row_anchor == nil
            for _,entry in ipairs(pages) do
                if row_anchor and row_anchor.name==entry.name then reached=true end
                if reached then
                    local before = entry.days and clock.offset(-entry.days * 86400) or entry.before
                    if before then
                        local result,err=protected_page(tx,board_id,entry,before,left,row_anchor)
                        if err or not result then return nil,err end
                        left=left-(result.spent :: integer)
                        examined=examined+(result.examined :: integer)
                        if result.more then return {removed=limit-left-examined,spent=limit-left,examined=examined,more=true,cursor=result.cursor},nil end
                    end
                    row_anchor=nil
                end
            end
        end
        local associated = {
            { name = "kickside_work_field_usage", keys = "field_id", where = "items = 0" },
            { name = "kickside_work_plugin", keys = "plugin", where = "active = 0 AND revision = applied_revision" },
            { name = "kickside_work_job", keys = "job_id", where = "status = 'done'" },

        }
        for _, entry in ipairs(associated) do
            local more, err = page(entry.name, entry.keys, "board_id = $1 AND (" .. entry.where .. ")", { board_id })
            if err then return nil, err end
            if more then return { removed = limit-left-examined, spent=limit-left, examined=examined, more=true },nil end
        end
        -- Limit candidates before evaluating baseline eligibility. Retained rows
        -- advance a keyset in the existing owner position, just like deleted rows.
        do
            local anchor: types.VisibilityPosition = {seq=-1,item=""}
            if cursor and cursor:sub(1,11)=="visibility:" then
                local decoded,decode_err=store.stored(cursor:sub(12),{} :: types.VisibilityPosition)
                if decode_err or not decoded then return nil,decode_err end
                anchor=decoded
            end
            local bound=left//2
            if bound==0 then return {removed=limit-left-examined,spent=limit-left,examined=examined,more=true,cursor="visibility:" .. store.encode(anchor)},nil end
            local candidates,candidate_err=tx:query([[SELECT item_id,seq FROM kickside_work_visibility
                WHERE board_id=$1 AND seq<=$2 AND (seq,item_id)>($3,$4)
                ORDER BY seq,item_id LIMIT $5]],{board_id,board.tombstone_floor_seq,anchor.seq,anchor.item,bound})
            if candidate_err then return nil,candidate_err end
            for _,row in ipairs(candidates or {}) do
                local id,ierr=store.need(row,"item_id")
                if ierr or not id then return nil,ierr end
                local seq,serr=store.need_int(row,"seq")
                if serr or not seq then return nil,serr end
                local deleted,delete_err=tx:query([[DELETE FROM kickside_work_visibility
                    WHERE board_id=$1 AND item_id=$2 AND seq=$3
                    AND (NOT EXISTS (SELECT 1 FROM kickside_work_item i WHERE i.board_id=$1 AND i.item_id=$2)
                        OR seq<(SELECT MAX(v.seq) FROM kickside_work_visibility v
                            WHERE v.board_id=$1 AND v.item_id=$2 AND v.seq<=$4)) RETURNING seq]],
                    {board_id,id,seq,board.tombstone_floor_seq})
                if delete_err then return nil,delete_err end
                examined=examined+1
                left=left-1-#(deleted or {})
                anchor={seq=seq,item=id}
            end
            if #(candidates or {})==bound then
                return {removed=limit-left-examined,spent=limit-left,examined=examined,more=true,cursor="visibility:" .. store.encode(anchor)},nil
            end
        end
        local tombs, terr = tx:query([[SELECT item_id, updated_seq FROM kickside_work_item WHERE board_id = $1 AND life <> 'live' AND life = 'purged'
            AND purge_pending=0 AND life_at < $2 ORDER BY life_at, item_id LIMIT $3]], { board_id, clock.offset(-(effective.tombstone_days :: integer) * 86400), left })
        if terr then return nil, terr end
        local floor = board.tombstone_floor_seq
        for _, tomb in ipairs(tombs or {}) do
            local id, ierr = store.need(tomb, "item_id")
            if ierr then return nil, ierr end
            local seq, serr = store.need_int(tomb, "updated_seq")
            if serr or not seq then return nil, serr end
            local _, derr = tx:execute("DELETE FROM kickside_work_item WHERE board_id = $1 AND item_id = $2", { board_id, id })
            if derr then return nil, derr end
            floor = math.max(floor, seq)
        end
        if floor > board.tombstone_floor_seq then
            local uerr = M.record_floor(tx, board_id, floor)
            if uerr then return nil, uerr end
        end
        local n = #(tombs or {})
        return { removed = limit - left - examined + n, spent = limit - left + n, examined = examined, more = (left > 0 and n == left) }, nil
    end)
    if prune_err or not pruned then return nil, prune_err end
    local spent = pruned.spent or pruned.removed
    pruned.spent = (spent :: integer) + comment_removed
    pruned.removed = pruned.removed + comment_removed
    pruned.more = pruned.more or comments_more
    return pruned, nil
end
-- deadline reads the earliest future eligibility for each retained row class.
function M.deadline(db: sql.DB, board_id: string, effective: domain.Policy, window: domain.EventWindow): (integer?, error?)
    local classes = {
        { name = "kickside_work_item", column = "life_at", state = "trashed", days = effective.trash_days },
        { name = "kickside_work_item", column = "life_at", state = "purged", days = effective.tombstone_days },
        { name = "kickside_work_key_alias", column = "at", days = effective.tombstone_days },
        { name = "kickside_work_change", column = "at", days = effective.audit_days },
        { name = "kickside_work_interval", column = "ended_at", where = " AND ended_at IS NOT NULL", days = effective.interval_days },
        { name = "kickside_work_generation", column = "applied_at", days = effective.audit_days },
        { name = "kickside_work_visibility", column = "at", ms = window.ms, before = window.before },
        { name = "kickside_work_comment", column = "edited_at", where = " AND deleted=1", ms = window.ms, before = window.before },
        { name = "kickside_work_receipt", column = "at", ms = window.ms, before = window.before },
        { name = "kickside_work_operation", column = operation_expiry.at(db:type()), where = " AND " .. operation_expiry.TERMINAL, ms = window.ms, before = window.before },
        { name="kickside_work_approval", column="at", days=effective.audit_days },
        { name="kickside_work_stage_run", column="COALESCE(finished, started)", days=effective.audit_days },
        { name="kickside_work_job", column="failed_at", where=" AND status='failed'", days=effective.audit_days },
    }
    local earliest: integer? = nil
    for _, class in ipairs(classes) do
        local window_ms = class.ms or (class.days and class.days * 86400000)
        if window_ms then
            local params: domain.SqlParams = { board_id, class.before or clock.deadline(-window_ms).at }
            if class.state then params[3] = class.state end
            local filter = class.state and " AND life <> 'live' AND life = $3" or (class.where or "")
            local rows, err = db:query("SELECT " .. class.column .. " AS at FROM " .. class.name ..
                " WHERE board_id = $1 AND " .. class.column .. " >= $2" .. filter .. " ORDER BY " .. class.column .. " LIMIT 1", params)
            if err then return nil, err end
            local at = rows and rows[1] and store.text(rows[1].at)
            if at then
                local instant, perr = time.parse(time.RFC3339, at)
                if perr or not instant then return nil, perr end
                local due = instant:unix_nano() // 1000000 + window_ms + 1
                earliest = earliest and math.min(earliest, due) or due
            end
        end
    end
    return earliest, nil
end

return M
