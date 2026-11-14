-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local uuid = require("uuid")
local component = require("component")
local store = require("store")
local principals = require("principals")
local guard = require("guard")
local items = require("items")
local fields = require("fields")
local rules = require("rules")
local types = require("types")
local domain = require("domain")
local snapshot = require("snapshot")
local defaults = require("defaults")
local receipts = require("receipts")
local clock = require("clock")
local consts = require("consts")
local M = {}

local function refused(plan: types.MovePlan, code: string, message: string): types.MovePlan
    plan.allowed = false
    plan.findings[#plan.findings + 1] = { code = code, message = message }
    return plan
end
local function mapped(plan: types.MovePlan, result: types.OpPlan): boolean
    if result.status == "applied" or result.status == "unchanged" then return true end
    plan.allowed = false
    for _, finding in ipairs(result.findings or {}) do plan.findings[#plan.findings + 1] = finding end
    return false
end
function M.access(request: types.MoveRequest): error?
    local err = guard.require_access(request.board_id, guard.write_access())
    if err then return err end
    err = guard.require_access(request.board_id, component.ACCESS.DELETE :: integer)
    if err then return err end
    return guard.require_access(request.to_board, component.ACCESS.WRITE :: integer)
end

local function build(tx: sql.Transaction, source: domain.Board, target: domain.Board, request: types.MoveRequest, dialect: string, source_seq: integer): (types.MovePlan?, error?)
    local plan: types.MovePlan = { allowed = true, findings = {}, items = {}, links = {}, to_board = target.board_id,
        from_board = source.board_id, source_seq = math.max(source.applied_seq, source_seq), target_seq = target.applied_seq, target_digest = target.digest }
    local ctx = items.context(tx, source, guard.actor_id(), guard.stamp_now(), dialect)
    local root, rerr = items.read(ctx, request.item)
    if rerr then return nil, rerr end
    if not root or root.life ~= "live" then return refused(plan, "move_item_unavailable", "move requires a live visible item"), nil end
    local rows, err = tx:query([[SELECT item_id, parent_id FROM kickside_work_item WHERE board_id = $1 AND life = 'live'
        AND substr(path,1,$2) = $3 ORDER BY length(path), item_id LIMIT 5001]], { source.board_id, #root.path, root.path })
    if err then return nil, err end
    if #(rows or {}) > 5000 then return refused(plan, "move_subtree_limit", "move holds at most 5000 subtree items"), nil end
    local mapping = request.map
    local ids: { [string]: string } = {}
    for _, row in ipairs(rows or {}) do ids[row.item_id :: string] = uuid.v4() end
    plan.item = ids[root.item_id]
    local parents: { [string]: boolean } = {}
    for _, row in ipairs(rows or {}) do if type(row.parent_id) == "string" then parents[row.parent_id] = true end end
    for _, row in ipairs(rows or {}) do
        local id = row.item_id :: string
        local item, ierr = items.read(ctx, id)
        if ierr then return nil, ierr end
        if not item or item.life ~= "live" then return refused(plan, "move_subtree_unavailable", "every subtree item is live and visible"), nil end
        local from_type = source.model.item_types[item.type]
        if not from_type then return refused(plan, "move_type_unknown", "source type is absent"), nil end
        if parents[id] and from_type.move_children == "refuse" then
            return refused(plan, "move_children_refused", "item type refuses moving its children"), nil
        end
        local type_id = mapping.type and mapping.type[item.type] or item.type
        local carried = target.model.item_types[type_id]
        if not carried then return refused(plan, "move_type_unknown", "mapped target type is absent"), nil end
        local values: types.Map = {}
        local clear: { string } = {}
        local used: { [string]: boolean } = {}
        local carries: { [string]: boolean } = {}
        for _, code in ipairs(carried.fields) do carries[code] = true end
        for key, cell in pairs(item.document) do
            local field = source.model.by_id[math.tointeger(tonumber(key)) :: integer]
            if not field then return refused(plan, "move_field_unknown", "retained field needs a declared mapping"), nil end
            if field.type ~= "counter" and field.type ~= "rollup" and field.type ~= "formula" and field.type ~= "rank" then
                local code: string | boolean = mapping.fields and mapping.fields[field.code] ~= nil and mapping.fields[field.code] or field.code
                if mapping.fields and mapping.fields[field.code] == false then code = false end
                if code ~= false then
                    if not rules.field(source, field, "read", item.document) then return refused(plan, "move_field_denied", "move requires reading each mapped field"), nil end
                    local name = code :: string
                    local into = target.model.fields[name]
                    if not into or not carries[name] then return refused(plan, "move_field_unknown", "mapped target field is absent from the type"), nil end
                    if used[name] then return refused(plan, "move_field_collision", "two fields map to one target field"), nil end
                    used[name] = true
                    if cell.c == 1 then clear[#clear + 1] = name
                    elseif cell.p ~= nil then
                        local surface, serr = fields.surface(field, cell.p)
                        if serr then return nil, serr end
                        if field.type == "item" then
                            local function repoint(value: unknown): domain.Target
                                local ref = value :: domain.Target
                                if ref.board == source.board_id and ids[ref.item] then
                                    return { board = target.board_id, item = ids[ref.item] :: string }
                                end
                                return ref
                            end
                            if field.cardinality == "one" then surface = repoint(surface)
                            else
                                local refs: { domain.Target } = {}
                                for _, value in ipairs(surface :: { unknown }) do refs[#refs + 1] = repoint(value) end
                                surface = refs
                            end
                        end
                        values[name] = surface
                    end
                end
            end
        end
        local move: types.MoveItem = { from = id, item = ids[id] :: string, type = type_id, state = mapping.state and mapping.state[item.state] or item.state,
            values = values, clear = clear, parent = item.parent_id and ids[item.parent_id] or nil, version = item.version,
            old_key = store.key_of(source.key_prefix, item.number) }
        plan.items[#plan.items + 1] = move
    end
    local linked: { [string]: boolean } = {}
    for _, item in ipairs(plan.items) do
        local links, lerr = tx:query([[SELECT * FROM kickside_work_link WHERE board_id = $1 AND from_id = $2
            ORDER BY board_id,from_id,type,to_board_id,to_id]], { source.board_id, item.from })
        if lerr then return nil, lerr end
        for _, link in ipairs(links or {}) do
            local outward = link.board_id == source.board_id and ids[link.from_id :: string] ~= nil
            local from = outward and ids[link.from_id :: string] or ids[link.to_id :: string]
            local peer_board = outward and link.to_board_id :: string or link.board_id :: string
            local peer_id = outward and link.to_id :: string or link.from_id :: string
            if peer_board == source.board_id and ids[peer_id] then peer_board, peer_id = target.board_id, ids[peer_id] end
            local relation = mapping.relations and mapping.relations[link.type :: string] or link.type :: string
            local key = from .. ":" .. relation .. ":" .. peer_board .. ":" .. peer_id
            if not linked[key] then
                linked[key] = true
                plan.links[#plan.links + 1] = { item = from, type = relation, target = { board = peer_board, item = peer_id } }
            end
        end
    end
    return plan, nil
end
function M.prepare(plan: types.MovePlan, operation_id: string?): ({ types.Write }?, error?)
    local covered, cerr = receipts.covered(plan.to_board, clock.deadline(consts.LIMITS.command_deadline_ms))
    if cerr or not covered then return nil, cerr end
    local ops: { types.Op } = {}
    for _, item in ipairs(plan.items) do
        ops[#ops + 1] = { op = "create", item = item.item, type = item.type, state = item.state,
            values = item.values, clear = item.clear, parent = item.parent,
            moved_from = { board = plan.from_board :: string, item = item.from }, operation_id = operation_id }
    end
    for _, link in ipairs(plan.links) do ops[#ops + 1] = { op = "link", item = link.item, type = link.type, target = link.target } end
    local indices: { integer } = {}
    for i = 1, #ops do indices[i] = i end
    local settings, serr = defaults.read()
    if serr or not settings then return nil, serr end
    local db, err = store.open()
    if not db then return nil, err end
    local board, planned, perr = snapshot.read(db, plan.to_board, ops, indices, guard.actor_id(), guard.stamp_now(), settings, clock.deadline(consts.LIMITS.command_deadline_ms))
    db:release()
    if perr then return nil, perr end
    if not board then return nil, errors.new({ kind = errors.NOT_FOUND, message = "move target is absent", details = { code = "move_board_not_found" } }) end
    plan.target_seq = math.max(board.applied_seq, covered)
    for _, result in ipairs(planned) do if not mapped(plan, result) then return {}, nil end end
    return items.writes(planned, indices, ops), nil
end
function M.plan(request: types.MoveRequest): (types.MovePlan?, error?)
    local aerr = M.access(request)
    if aerr then return nil, aerr end
    if request.board_id == request.to_board then return nil, errors.new({ kind = errors.INVALID, message = "move requires different boards", details = { code = "move_same_board" } }) end
    local covered, cerr = receipts.covered(request.board_id, clock.deadline(consts.LIMITS.command_deadline_ms))
    if cerr or not covered then return nil, cerr end
    local db, err = store.open()
    if not db then return nil, err end
    local source, serr = store.board(db, request.board_id)
    local target, terr = store.board(db, request.to_board)
    if serr or terr then db:release(); return nil, serr or terr end
    if not source or not target then db:release(); return nil, errors.new({ kind = errors.NOT_FOUND, message = "move board is absent", details = { code = "move_board_not_found" } }) end
    local perr = principals.resolve(source)
    if not perr then perr = principals.resolve(target) end
    if perr then db:release(); return nil, perr end
    local settings, settings_err = defaults.read()
    if settings_err or not settings then db:release(); return nil, settings_err end
    local tx, berr = db:begin()
    if berr or not tx then db:release(); return nil, berr end
    if db:type() == sql.type.POSTGRES then
        local ierr = store.read_snapshot(tx)
        if ierr then tx:rollback(); db:release(); return nil, ierr end
    end
    local source_snapshot, source_err = snapshot.board(tx, request.board_id, source, settings, db:type())
    local target_snapshot, target_err = snapshot.board(tx, request.to_board, target, settings, db:type())
    if source_err or target_err or not source_snapshot or not target_snapshot then
        tx:rollback(); db:release(); return nil, source_err or target_err
    end
    local plan, err = build(tx, source_snapshot, target_snapshot, request, db:type(), covered)
    tx:rollback(); db:release()
    if err or not plan or not plan.allowed then return plan :: types.MovePlan?, err end
    local _, perr = M.prepare(plan :: types.MovePlan, nil)
    if perr then return nil, perr end
    return plan :: types.MovePlan, nil
end
return M
