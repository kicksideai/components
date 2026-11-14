-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local references = require("references")
local component = require("component")
local consts = require("consts")
local domain = require("domain")
local store = require("store")
local tree_rows = require("tree_rows")
local types = require("types")

local M = require("prepare_context")
local EV = consts.EVENTS
-- Prepare of hierarchy, relations and trash: parent moves, links, deletion and restoration.

-- subtree sees the paths produced by earlier parent ops in the prepare run.

local function plan_parent(ctx: types.PrepareContext, op: types.Op): types.OpPlan
    local item, perr = M.locate(ctx, op.item)
    if perr or not item then return perr or M.invalid("item_required", "item required", "item") end
    local group = M.item_group(item.item_id)
    local conflict = M.stale(op, item)
    if conflict then return conflict end
    if item.life ~= "live" then return M.result("invalid", group, "item_trashed", "item " .. item.item_id .. " is in the trash", "item") end
    local item_type = ctx.board.model.item_types[item.type]
    if not item_type then return M.result("invalid", group, "unknown_type", "item type " .. item.type .. " is no longer declared", "item") end
    local target: domain.Item? = nil
    if type(op.parent) == "string" then
        local found, ferr = M.locate(ctx, op.parent)
        if ferr or not found then return ferr or M.invalid("unknown_parent", "unknown parent", "parent") end
        target = found
    elseif op.parent ~= false then
        return M.result("invalid", group, "invalid_parent", "parent is an item id, or false to move to the root", "parent")
    end
    if (target and target.item_id or nil) == item.parent_id then return M.done(ctx, item, group, {}) end
    local stats, serr = tree_rows.subtree(ctx.db, ctx.board.board_id, ctx.moves, item.path, M.depth_of(item.path))
    if serr or not stats then return M.failed(serr or errors.new({ details = { code = "row_corrupt" }, kind = errors.INTERNAL, message = "subtree statistics are missing" })) end
    if stats.size > consts.LIMITS.subtree_rows then
        return M.result("invalid", group, "subtree_too_large", "a subtree move holds at most " .. consts.LIMITS.subtree_rows .. " rows", "parent")
    end
    local descendants, derr = tree_rows.descendants(ctx.db, ctx.board.board_id, ctx.moves, item.path, consts.LIMITS.subtree_rows + 1)
    if derr then return M.failed(derr) end
    for _, child in ipairs(descendants or {}) do
        local reserved = M.reservation(child)
        if reserved then return M.failed(reserved) end
    end
    if target then
        if target.path:find("/" .. item.item_id .. "/", 1, true) then
            return M.result("invalid", group, "cycle", "an item cannot move under itself or its descendants", "parent")
        end
        local violation = M.parent_violation(ctx.board, item_type, target)
        if violation then violation.group = group; return violation end
        local limit = M.child_limit(ctx, target)
        if limit then limit.group = group; return limit end
        local below = stats.depth - M.depth_of(item.path)
        if M.depth_of(target.path) + 1 + below > consts.LIMITS.depth then
            return M.result("invalid", group, "depth", "hierarchy is limited to " .. consts.LIMITS.depth .. " levels", "parent")
        end
    end
    local previous = item.parent_id
    M.reserve_child(ctx, previous, -1)
    M.reserve_child(ctx, target and target.item_id, 1)
    item.parent_id = target and target.item_id or nil
    local old_path = item.path
    item.path = (target and target.path or "/") .. item.item_id .. "/"
    ctx.moves[#ctx.moves + 1] = { previous = old_path, path = item.path }
    for id, cached in pairs(ctx.items) do
        if id ~= item.item_id and cached.path:sub(1, #old_path) == old_path then
            cached.path = item.path .. cached.path:sub(#old_path + 1)
        end
    end
    item.version = item.version + 1
    return M.done(ctx, item, group, { M.event(EV.ITEM_PARENTED, group, { item = item.item_id, parent = item.parent_id, previous = previous }) })
end

local function link_key(board_id: string, from: string, type_id: string, target: domain.Target): string
    return table.concat({ board_id, from, type_id, target.board, target.item }, "|")
end

local function plan_link(ctx: types.PrepareContext, op: types.Op, linking: boolean): types.OpPlan
    local item, perr = M.locate(ctx, op.item)
    if perr or not item then return perr or M.invalid("item_required", "item required", "item") end
    local group = M.item_group(item.item_id)
    local conflict = M.stale(op, item)
    if conflict then return conflict end
    if item.life ~= "live" then return M.result("invalid", group, "item_trashed", "item " .. item.item_id .. " is in the trash", "item") end
    local relation = op.type and ctx.board.model.relations[op.type]
    if not relation then return M.result("invalid", group, "unknown_relation", "unknown relation type " .. tostring(op.type), "type") end
    local ref, refusal = references.target(op.target,ctx.board.board_id)
    if refusal or not ref then
        local plan=refusal :: types.OpPlan
        plan.group=group
        return plan
    end
    local target, alias_err = store.endpoint(ctx.db, ref)
    if alias_err or not target then return M.failed(alias_err :: error) end
    if target.board == ctx.board.board_id and target.item == item.item_id then
        return M.result("invalid", group, "invalid_target", "an item cannot relate to itself", "target")
    end
    local from, to_board, to_id = item.item_id, target.board, target.item
    if relation.symmetric and to_board == ctx.board.board_id and to_id < from then from, to_id = to_id, from end
    local key = link_key(ctx.board.board_id, from, relation.id, { board = to_board, item = to_id })
    local existing = ctx.links[key]
    if existing == nil then
        local rows, err = tree_rows.link(ctx.db, ctx.board.board_id, from, relation.id, to_board, to_id)
        if err then return M.failed(err) end
        existing = rows ~= nil and rows[1] ~= nil
    end
    if linking then
        local _, err = references.resolve(ctx, target)
        if err then
            if err.status == "invalid" then return M.result("invalid", group, "unknown_target", "target item is unavailable", "target") end
            if err.status == "denied" then return M.result("denied", group, "target_denied", "target board is unavailable", "target") end
            return err
        end
    end
    if linking == existing then return M.done(ctx, item, group, {}) end
    local holders: { string } = { item.item_id }
    if relation.symmetric and target.board == ctx.board.board_id then holders[#holders + 1] = target.item end
    if linking and relation.cardinality == "one" then
        for _, holder in ipairs(holders) do
            local count: integer?, err: error?
            if relation.symmetric then count, err = tree_rows.incident(ctx.db, ctx.board.board_id, relation.id, holder)
            else
                local rows, rerr = tree_rows.outgoing_count(ctx.db, ctx.board.board_id, holder, relation.id)
                err = rerr
                count = rows and rows[1] and store.int(rows[1].n)
            end
            if err then return M.failed(err) end
            if (count or 0) + (ctx.child_delta["relation:" .. relation.id .. ":" .. holder] or 0) > 0 then
                return M.result("invalid", group, "relation_cardinality", "relation " .. relation.id .. " holds one target", "type")
            end
        end
    end
    if linking then
        local bound = M.link_limit(ctx, relation, item.item_id)
        if not bound and relation.symmetric and target.board == ctx.board.board_id then bound = M.link_limit(ctx, relation, target.item) end
        if bound then return bound end
    end
    ctx.links[key] = linking
    for _, holder in ipairs(holders) do
        local slot = "relation:" .. relation.id .. ":" .. holder
        ctx.child_delta[slot] = (ctx.child_delta[slot] or 0) + (linking and 1 or -1)
        if not linking then
            local bound = "link:" .. relation.id .. ":" .. holder
            ctx.child_delta[bound] = (ctx.child_delta[bound] or 0) - 1
        end
    end
    item.version = item.version + 1
    local body: domain.EventBody = { item = item.item_id, type = relation.id, target = target }
    return M.done(ctx, item, group, { M.event(linking and EV.ITEM_LINKED or EV.ITEM_UNLINKED, group, body) })
end

local function plan_life(ctx: types.PrepareContext, op: types.Op, deleting: boolean): types.OpPlan
    local item, perr = M.locate(ctx, op.item)
    if perr or not item then return perr or M.invalid("item_required", "item required", "item") end
    local group = M.item_group(item.item_id)
    local conflict = M.stale(op, item)
    if conflict then return conflict end
    local allowed, aerr = M.allows(ctx, ctx.board.board_id, component.ACCESS.DELETE :: integer)
    if aerr then return M.failed(aerr) end
    if not allowed then
        return M.result("denied", group, "delete_denied", "deleting and restoring items needs delete access", "item")
    end
    if deleting == (item.life == "trashed") then return M.done(ctx, item, group, {}) end
    if not deleting then
        if not ctx.board.model.item_types[item.type] then
            return M.result("invalid", group, "unknown_type", "item type " .. item.type .. " is no longer declared", "item")
        end
        if item.parent_id then
            local parent, err = M.read(ctx, item.parent_id)
            if err then return M.failed(err) end
            if not parent or parent.life ~= "live" then
                return M.result("invalid", group, "parent_trashed", "restore the parent " .. item.parent_id .. " first", "item")
            end
        end
    end
    local descendants, derr = tree_rows.descendants(ctx.db, ctx.board.board_id, ctx.moves, item.path, consts.LIMITS.subtree_rows + 1)
    if derr then return M.failed(derr) end
    if #(descendants or {}) > consts.LIMITS.subtree_rows then return M.invalid("subtree_too_large", "a lifecycle command holds at most " .. consts.LIMITS.subtree_rows .. " rows") end
    ctx.head_guard = ctx.board.applied_seq
    local marked = item.life_at
    local events: { domain.Event } = {}
    local guards: { [string]: integer } = {}
    local affected: { domain.Item } = { item }
    for _, row in ipairs(descendants or {}) do
        if row.item_id ~= item.item_id then
            local child = ctx.items[row.item_id] or row
            local reserved = M.reservation(child)
            if reserved then return M.failed(reserved) end
            if not ctx.items[row.item_id] then
                ctx.items[row.item_id] = child
                ctx.base[row.item_id] = row.version
            end
            if child.life == (deleting and "live" or "trashed") and (deleting or child.life_at == marked) then affected[#affected + 1] = child end
        end
    end
    for _, changed in ipairs(affected) do
        local subject = M.item_group(changed.item_id :: string)
        guards[subject] = ctx.base[changed.item_id]
        changed.life = deleting and "trashed" or "live"
        changed.life_at = deleting and ctx.now or nil
        changed.version = changed.version + 1
        events[#events + 1] = M.event(deleting and EV.ITEM_DELETED or EV.ITEM_RESTORED, subject, { item = changed.item_id :: string })
    end
    local plan = M.done(ctx, item, group, events)
    plan.guards = guards
    return plan
end


return { plan_parent = plan_parent, plan_link = plan_link, plan_life = plan_life }
