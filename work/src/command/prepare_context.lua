-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local component = require("component")
local consts = require("consts")
local domain = require("domain")
local store = require("store")
local tree_rows = require("tree_rows")
local types = require("types")
local flow = require("flow")

local rules = require("rules")
local access_rows = require("access_rows")
local guard = require("guard")
local M = {}

-- Shared parts of prepare: the run context, plan results, item reads and access checks every op family uses.

M.FREE = "free"
local FREE = M.FREE

-- types.PrepareContext is the state of one prepare run: the items and comments it read (mutated
-- as ops are planned), the versions they had when first read, and the relations
-- planned so far.

function M.finding(code: string, message: string, field: string?): types.Finding
    return { code = code, message = message, field = field }
end

-- group_of assigns every outcome to the subject its request addresses.
function M.group_of(op: types.Op): string
    if op.op == "rank" then return M.FREE end
    if op.op == "comment" then return op.comment and ("c:" .. op.comment) or M.FREE end
    if op.item and op.op ~= "create" then return "i:" .. op.item end
    return M.FREE
end

function M.result(status: string, group: string, code: string?, message: string?, field: string?): types.OpPlan
    local plan: types.OpPlan = { status = status, events = {}, group = group }
    if code and message then plan.findings = { M.finding(code, message, field) } end
    return plan
end

function M.refused(group: string, f: domain.Finding): types.OpPlan
    return M.result("invalid", group, f.code, f.message, f.field)
end

function M.invalid(code: string, message: string, field: string?): types.OpPlan
    return M.result("invalid", FREE, code, message, field)
end

function M.failed(err: error): types.OpPlan
    local kind = err:kind()
    local status = kind == errors.PERMISSION_DENIED and "denied" or kind == errors.INVALID and "invalid" or "unavailable"
    local details = err:details() or {}
    local plan = M.result(status, FREE, type(details.code) == "string" and details.code or tostring(kind), err:message())
    return plan
end

function M.item_group(item_id: string): string
    return "i:" .. item_id
end

function M.event(event_type: string, subject: string, body: domain.EventBody): domain.Event
    return { type = event_type, subject = subject, body = body }
end

-- read returns the item as the command sees it: through the cache, with its
-- starting version remembered for the write's expectation.
function M.reservation(item: domain.Item): error?
    if item.move_id then return errors.new({ kind = errors.CONFLICT, message = "item has a prepared board move", details = { code = "item_move_pending" } }) end
    return nil
end
function M.read(ctx: types.PrepareContext, item_id: string): (domain.Item?, error?)
    local item = ctx.items[item_id]
    if not item then
        local allowed, aerr = access_rows.permits(ctx.db, ctx.board, item_id)
        if aerr or not allowed then return nil, aerr end
        local loaded, err = store.item(ctx.db, ctx.board.board_id, item_id)
        if err or not loaded then return nil, err end
        item = loaded
        for _, move in ipairs(ctx.moves) do
            if item.path:sub(1, #move.previous) == move.previous then item.path = move.path .. item.path:sub(#move.previous + 1) end
        end
        ctx.items[item_id] = item
        ctx.base[item_id] = item.version
    end
    local err = M.reservation(item)
    if err then return nil, err end
    return rules.visible(ctx.board, item.document) and item or nil, nil
end

function M.locate(ctx: types.PrepareContext, ref: string?): (domain.Item?, types.OpPlan?)
    if type(ref) ~= "string" or ref == "" then return nil, M.invalid("item_required", "item required", "item") end
    local item, err = M.read(ctx, ref)
    if err then return nil, M.failed(err) end
    if not item or item.life == "purged" then return nil, M.result("invalid", FREE, "unknown_item", "unknown item " .. ref, "item") end
    return item, nil
end

function M.depth_of(path: string): integer
    local _, slashes = path:gsub("/", "")
    return slashes - 1
end

function M.allows(ctx: types.PrepareContext, board_id: string, mask: integer): (boolean, error?)
    local key = board_id .. ":" .. mask
    local known = ctx.access[key]
    if known ~= nil then return known end
    local _, err = component.validate_access(board_id, mask)
    local allowed, aerr = guard.authorization(err :: error?)
    if aerr then return false, aerr end
    ctx.access[key] = allowed
    return allowed, nil
end

-- expected checks a caller-supplied expect_version against the item's version at this
-- point of the command; a stale one is the caller's conflict.
function M.stale(op: types.Op, item: domain.Item): types.OpPlan?
    if op.expect_version ~= nil and op.expect_version ~= item.version then
        local plan = M.result("conflict", M.item_group(item.item_id), "version_mismatch",
            "item " .. item.item_id .. " is at version " .. item.version)
        plan.item = item.item_id
        plan.version = item.version
        return plan
    end
    return nil
end

-- done answers an op on an existing item: its version after the op, and the
-- version the write must expect, which is the one the command first read.
function M.done(ctx: types.PrepareContext, item: domain.Item, group: string, events: { domain.Event }): types.OpPlan
    return { status = #events > 0 and "applied" or "unchanged", events = events, group = group, item = item.item_id,
        version = item.version, expected = ctx.base[item.item_id] }
end

-- child_limit checks projected children plus reservations from earlier ops.
function M.child_limit(ctx: types.PrepareContext, parent: domain.Item): types.OpPlan?
    local t = ctx.board.model.item_types[parent.type]
    local carries = false
    for _, key in ipairs(t and t.fields or {}) do
        if ctx.board.model.fields[key].rollup then carries = true end
    end
    if not carries then return nil end
    ctx.head_guard = ctx.board.applied_seq
    local count, err = tree_rows.children(ctx.db, ctx.board.board_id, parent.item_id)
    if err then return M.failed(err) end
    if (count or 0) + (ctx.child_delta[parent.item_id] or 0) >= consts.LIMITS.rollup_children then
        return M.invalid("children_limit", "parent holds at most " .. consts.LIMITS.rollup_children .. " children", "parent")
    end
    return nil
end

-- link_limit bounds the links a holder of a rollup over the relation can gain.
function M.link_limit(ctx: types.PrepareContext, relation: domain.Relation, holder: string): types.OpPlan?
    local carried = false
    for _, f in ipairs(ctx.board.compiled.fields) do
        if f.rollup and f.rollup.of == relation.id then carried = true end
    end
    if not carried then return nil end
    ctx.head_guard = ctx.board.applied_seq
    local count, err = tree_rows.incident(ctx.db, ctx.board.board_id, relation.id, holder)
    if err then return M.failed(err) end
    local slot = "link:" .. relation.id .. ":" .. holder
    if (count or 0) + (ctx.child_delta[slot] or 0) >= consts.LIMITS.rollup_links then
        return M.invalid("links_limit", "an item holds at most " .. consts.LIMITS.rollup_links .. " links of " .. relation.id, "target")
    end
    ctx.child_delta[slot] = (ctx.child_delta[slot] or 0) + 1
    return nil
end

function M.reserve_child(ctx: types.PrepareContext, id: string?, delta: integer)
    if id then ctx.child_delta[id] = (ctx.child_delta[id] or 0) + delta end
end

-- parent_violation reports why an item of item_type cannot sit under parent.
function M.parent_violation(board: domain.Board, item_type: domain.ItemType, parent: domain.Item): types.OpPlan?
    if parent.life ~= "live" then return M.invalid("parent_trashed", "parent " .. parent.item_id .. " is in the trash", "parent") end
    local allowed = false
    for _, t in ipairs(item_type.parent_types) do
        if t == parent.type then allowed = true end
    end
    if not allowed then return M.invalid("parent_type", "item type " .. item_type.id .. " cannot sit under " .. parent.type, "parent") end
    if M.depth_of(parent.path) + 1 > consts.LIMITS.depth then
        return M.invalid("depth", "hierarchy is limited to " .. consts.LIMITS.depth .. " levels", "parent")
    end
    return nil
end

-- context starts a prepare run for the actor and the command time.
function M.context(db: types.Executor, board: domain.Board, actor: string, now: string, dialect: string): types.PrepareContext
    return { auto = { steps = 0, chain = {} }, db = db, dialect = dialect, board = board, items = {}, base = {}, child_delta = {}, comments = {}, comment_base = {}, links = {}, moves = {}, access = {}, actor = actor, now = now }
end


local function copy<T>(value: T): T
    local out: { [unknown]: unknown } = {}
    for key, member in pairs(value :: { [unknown]: unknown }) do out[key] = member end
    return out :: T
end

function M.fork(ctx: types.PrepareContext): types.PrepareContext
    local out = copy(ctx)
    out.auto = { steps = ctx.auto.steps, chain = copy(ctx.auto.chain) }
    out.items = {}
    for id, item in pairs(ctx.items) do out.items[id] = flow.copy(item) end
    out.comments = {}
    for id, comment in pairs(ctx.comments) do out.comments[id] = copy(comment) end
    out.base, out.links = copy(ctx.base), copy(ctx.links)
    out.comment_base, out.child_delta, out.moves = copy(ctx.comment_base), copy(ctx.child_delta), copy(ctx.moves)
    return out
end

function M.adopt(ctx: types.PrepareContext, work: types.PrepareContext)
    ctx.auto = work.auto
    ctx.items, ctx.comments, ctx.base = work.items, work.comments, work.base
    ctx.links, ctx.comment_base, ctx.child_delta, ctx.moves = work.links, work.comment_base, work.child_delta, work.moves
end

return M
