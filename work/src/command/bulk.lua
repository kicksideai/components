-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local guard = require("guard")
local receipts = require("receipts")
local query = require("query")
local store = require("store")
local rows = require("rows")
local types = require("types")
local M = {}

function M.owner(request: types.Locator, kind: string): (types.Owner?, error?)
    local err = guard.require_access(request.board_id, guard.write_access())
    if err then return nil, err end
    local db, derr = store.open()
    if not db then return nil, derr end
    local owner, oerr = rows.get(db, request.board_id, request.operation_id or request.bulk_id or request.move_id, nil, nil)
    db:release()
    if oerr then return nil, oerr end
    if not owner or owner.kind ~= kind then return nil, errors.new({ kind = errors.NOT_FOUND, message = "operation is absent", details = { code = "operation_not_found" } }) end
    local aerr = guard.owner_access(owner.board_id, owner.actor_id)
    if aerr then return nil, aerr end
    return owner, nil
end

function M.start(request: types.BulkRequest): (types.Status?, error?)
    local err = guard.require_access(request.board_id, guard.write_access())
    if err then return nil, err end
    for _, op in ipairs(request.ops_template) do
        if op.item ~= nil or op.op == "create" then return nil, errors.new({ kind = errors.INVALID, message = "bulk templates address each selected item", details = { code = "bulk_template_item" } }) end
    end
    local hashed = receipts.request_hash({ query = request.query, ops_template = request.ops_template })
    local db, derr = store.open()
    if not db then return nil, derr end
    local owner, oerr = rows.get(db, request.board_id, nil, "bulk", request.key)
    db:release()
    if oerr then return nil, oerr end
    if owner then
        local aerr = guard.owner_access(owner.board_id, owner.actor_id)
        if aerr then return nil, aerr end
        if owner.request_hash ~= hashed then return nil, receipts.conflict_of() end
        local resumed, rerr = rows.resume(owner)
        if rerr or not resumed then return nil, rerr end
        return rows.status(resumed), nil
    end
    request.query.board_id = request.board_id
    local ids, qerr = query.freeze(request.query)
    if qerr or not ids then return nil, qerr end
    local created, cerr = rows.create(request.board_id, "bulk", request.key, hashed, { ids = ids, ops_template = request.ops_template })
    if cerr or not created then return nil, cerr end
    local aerr = guard.owner_access(created.board_id, created.actor_id)
    if aerr then return nil, aerr end
    return rows.status(created), nil
end
function M.status(request: types.Locator): (types.Status?, error?)
    local owner, err = M.owner(request, "bulk")
    if err or not owner then return nil, err end
    return rows.status(owner), nil
end
function M.cancel(request: types.Locator): (types.Status?, error?)
    local owner, err = M.owner(request, "bulk")
    if err or not owner then return nil, err end
    if owner.status == "pending" or owner.status == "running" then
        local db, derr = store.open()
        if not db then return nil, derr end
        local _, cerr = db:execute("UPDATE kickside_work_operation SET status = 'cancelled' WHERE board_id = $1 AND operation_id = $2 AND status IN ('pending','running')", { owner.board_id, owner.operation_id })
        db:release()
        if cerr then return nil, cerr end
    end
    return M.status(request)
end
return M
