-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local clock = require("clock")
local rows = require("rows")
local defaults = require("defaults")
local policy = require("policy")
local component = require("component")
local consts = require("consts")
local store = require("store")
local lifecycle = require("lifecycle")
local threads = require("threads")
local domain = require("domain")
local registry = require("registry")
local append = require("append")
local types = require("types")
local sql = require("sql")
local operation_expiry = require("operation_expiry")

local limits = require("limits")
local M = {}

-- release appends the registry release of the claim the row records and removes the
-- row. A claim already released needs only the row removal. A version conflict leaves
-- the row for the next run.
local function release(c: domain.ThreadClient, prefix: string, claim_version: integer, board_id: string, at: string): (boolean, error?)
    local write, werr = registry.release(c, prefix, claim_version, board_id, at)
    if werr then return false, werr end
    if write then
        local _, aerr = append.writes(c, board_id, { write })
        if aerr then
            if threads.mismatch(aerr, "version_mismatch") then return false, nil end
            return false, errors.wrap(aerr, "prefix release failed")
        end
    end
    local db, err = store.open()
    if not db then return false, err end
    local derr = lifecycle.remove_prefix(db, prefix, board_id)
    db:release()
    if derr then return false, errors.wrap(derr, "prefix row delete failed") end
    return true, nil
end

-- retain spends a shared budget on guarded purge appends and row collection.
local function retain(client: domain.ThreadClient, base: domain.Policy, board_id: string, limit: integer, after: string): (integer?, integer?, boolean?, string?, error?)
    local db, err = store.open()
    if not db then return nil, nil, nil, nil, err end
    local board, berr = store.board(db, board_id)
    if berr or not board then db:release(); return 0, 0, false, "", berr end
    local effective, eerr = policy.effective(base :: domain.JsonObject, board.compiled.policy_overrides)
    if eerr or not effective then db:release(); return nil, nil, nil, nil, eerr end
    local expired, terr = rows.trash(db, board_id, effective.trash_days :: integer, limit, after)
    db:release()
    if terr then return nil, nil, nil, nil, terr end
    local purged, last = 0, after
    for _, item in ipairs(expired or {}) do
        local id, ierr = store.need(item, "item_id")
        if ierr or not id then return nil, nil, nil, nil, ierr end
        local version, verr = store.need_int(item, "version")
        if verr or not version then return nil, nil, nil, nil, verr end
        local subject = "i:" .. id
        local event: domain.Event = { type = "kickside.work.events:item.purged", subject = subject,
            body = { item = id, actor = "system:kickside.work.retention", at = clock.now(), source = "retention" } }
        local _, aerr = append.writes(client, board_id, { { group = subject, ops = {}, events = { event },
            expect_subject = subject, expect_version = version, caller_expect = false } })
        if aerr and not threads.mismatch(aerr, "version_mismatch") then return nil, nil, nil, nil, aerr end
        if not aerr then purged = purged + 1 end
    end
    local spent = #(expired or {})
    -- A native slot page can remove 100 runs, its slot and the Work owner row.
    if limit - spent < 105 then return purged, spent, true, last, nil end
    if after=="" or after:sub(1,11)=="operations:" then
        local operation_after=after:sub(1,11)=="operations:" and after:sub(12) or ""
        local retired,retirement_err,next_after=operation_expiry.retire(board_id,nil,nil,operation_after)
        if retirement_err then return nil,nil,nil,nil,retirement_err end
        if next_after then
            return purged+(retired and 1 or 0),spent+(retired and 105 or 2),true,"operations:" .. next_after,nil
        end
        after=""
    end
    local pruned, perr = rows.prune(board_id, base, limit - spent, after)
    if perr or not pruned then return nil, nil, nil, nil, perr end
    spent=spent+(pruned.spent or pruned.removed)
    if pruned.more then return purged+pruned.removed,spent,true,pruned.cursor or last,nil end
    if after:sub(1,6)~="timer:" then after="slots" end
    local slot_spent,slot_more,slot_after,slot_err=rows.slots(board_id,limit-spent,after)
    if slot_err then return nil,nil,nil,nil,slot_err end
    return purged+pruned.removed,spent+(slot_spent :: integer),slot_more or spent-(pruned.examined or 0)>0,slot_after,nil
end

local function deadline_for(db: sql.DB, board_id: string, base: domain.Policy): (integer?, error?)
    local board, berr=store.board(db,board_id)
    if berr or not board then return nil,berr end
    local effective,eerr=policy.effective(base :: domain.JsonObject,board.compiled.policy_overrides)
    if eerr or not effective then return nil,eerr end
    return rows.deadline(db,board_id,effective)
end

function M.run(_input: unknown): types.Result
    local settings, settings_err = limits.read()
    if settings_err or not settings then return { success = false, error = settings_err } end
    local db, err = store.open()
    if not db then return { success = false, error = err } end
    local orphans, qerr = lifecycle.orphans(db, settings.retention_batch)
    db:release()
    if qerr then return { success = false, error = qerr } end
    local client, cerr = threads.open()
    if cerr or not client then return { success = false, error = cerr } end
    local found, deleted = orphans or {}, 0
    local blocked: { types.Blocked } = {}
    for _, row in ipairs(found) do
        local done, rerr = false, nil
        if not row.present then done,rerr=release(client, row.prefix, row.claim_version, row.board_id, clock.now()) end
        if rerr then blocked[#blocked + 1] = { component_id = row.board_id, prefix = row.prefix, error = rerr }
        elseif done then deleted = deleted + 1 end
    end
    local more = #found == settings.retention_batch
    local advance_err = lifecycle.advance_orphans(more and found[#found].prefix or "~")
    if advance_err then return { success = false, error = advance_err } end
    local left = settings.retention_batch - #found
    if left == 0 then return { success = true, deleted = deleted, blocked = blocked, needs_continue = true } end
    local base, serr = defaults.read()
    if serr or not base then return { success = false, error = serr } end
    db, err = store.open()
    if not db then return { success = false, error = err } end
    local position: types.Position?,poserr: error? = rows.position(db)
    local boards: { domain.Row }?
    if not poserr and position then boards, poserr = rows.boards(db, position, math.min(left,settings.cleanup_batch)+1) end
    db:release()
    if poserr or not position then return { success = false, error = poserr } end
    local deadline = position.deadline_ms
    local next_position: types.Position = { board_after = "", inclusive = 0, item_after = "" }
    local page = boards or {}
    local ids: { string } = {}
    for _, row in ipairs(page) do
        local id, ierr = store.need(row, "board_id")
        if ierr or not id then return { success = false, error = ierr } end
        ids[#ids + 1] = id
    end
    local deleting: { [string]: boolean } = {}
    if #ids > 0 then
        local components, cerr = component.list_system({ component_ids = ids, include = { meta = false }, limit = #ids })
        if cerr then return { success = false, error = cerr } end
        for _, entry in ipairs(components or {}) do deleting[entry.component_id] = entry.deleting_at ~= nil end
    end
    more = #page > math.min(left,settings.cleanup_batch)
    local first_error: error? = nil
    for i = 1, math.min(#page, math.min(left,settings.cleanup_batch)) do
        local board_id = ids[i]
        next_position = { board_after = board_id, inclusive = 0, item_after = "" }
        if not deleting[board_id] then
            local after = position.inclusive == 1 and position.board_after == board_id and position.item_after or ""
            local n, spent, again, last, rerr = retain(client, base, board_id, left, after)
            if not rerr then
                local deadline_db, derr = store.open()
                if derr or not deadline_db then return { success = false, error = derr } end
                local due: integer?
                due,rerr=deadline_for(deadline_db,board_id,base)
                deadline_db:release()
                if due then deadline = deadline and math.min(deadline, due) or due end
            end
            if rerr then
                if not first_error then first_error = rerr end
                next_position={board_after=board_id,inclusive=1,item_after=after}
                more=true
                break
            else
                deleted, left = deleted + (n :: integer), left - (spent :: integer)
                next_position = { board_after = board_id, inclusive = again and 1 or 0, item_after = again and (last :: string) or "" }
                if again or left == 0 then more = true; break end
            end
        end
    end
    if not more then next_position = { board_after = "", inclusive = 0, item_after = "" } end
    if deadline and deadline <= clock.deadline(0).ns // 1000000 then
        deadline = nil
        more = true
        next_position = { board_after = "", inclusive = 0, item_after = "" }
    end
    if more then next_position.deadline_ms = deadline end
    if not more then
        local orphan_err=lifecycle.advance_orphans("")
        if orphan_err then return {success=false,error=orphan_err} end
    end
    local saved = rows.advance(next_position)
    if saved then return { success = false, error = saved } end
    return { success = first_error == nil, error = first_error, deleted = deleted, blocked = blocked, needs_continue = more, deadline_ms = deadline }
end
return M
