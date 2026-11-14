-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local consts = require("consts")
local rollup_rows = require("rollup_rows")
local store = require("store")
local types = require("types")
local domain = require("domain")
local flow = require("flow")
local fields = require("fields")
local when = require("when")
local process = require("process")

local M = require("prepare_context")
local item_fields = require("item_fields")
local process_context = require("process_context")
local approval = require("approval")
local report = require("report")
local timer = require("timer")
local item_tree = require("item_tree")
local item_comments = require("item_comments")
-- Rank prepare validates neighbor identities; the fold chooses the order key.

local function plan_rank(ctx: types.PrepareContext, op: types.Op): types.OpPlan
    local item, err = M.locate(ctx, op.item)
    if err or not item then return err or M.invalid("item_required", "item required", "item") end
    if item.life ~= "live" then return M.invalid("item_trashed", "rank requires a live item", "item") end
    local neighbors: { [string]: string } = {}
    for _, name in ipairs({ "after", "before" }) do
        local value = op.after
        if name == "before" then value = op.before end
        if value ~= nil then
            if type(value) ~= "string" or value == "" or value == item.item_id then
                return M.invalid("invalid_neighbor", "rank neighbors name other live items on this board", name)
            end
            local neighbor, nerr = M.locate(ctx, value)
            if nerr then
                if nerr.status == "unavailable" then return nerr end
                return M.invalid("invalid_neighbor", "rank neighbor is unavailable", name)
            end
            if not neighbor or neighbor.life ~= "live" then return M.invalid("invalid_neighbor", "rank neighbor is unavailable", name) end
            neighbors[name] = value
        end
    end
    if neighbors.after and neighbors.after == neighbors.before then return M.invalid("invalid_neighbor", "rank neighbors are distinct", "before") end
    return { status = "applied", group = M.FREE, item = item.item_id, version = item.version,
        events = { M.event(consts.EVENTS.ITEM_RANKED, "rank", { item = item.item_id, after = neighbors.after, before = neighbors.before }) } }
end

local HANDLERS: { [string]: (types.PrepareContext, types.Op) -> types.OpPlan } = {
    approve = approval.plan, report = report.plan, advance = process_context.advance, timer = timer.plan,
    create = item_fields.plan_create,
    set = item_fields.plan_set,
    transition = item_fields.plan_transition,
    parent = item_tree.plan_parent,
    rank = plan_rank,
    comment = item_comments.plan_comment,
    link = function(ctx: types.PrepareContext, op: types.Op): types.OpPlan return item_tree.plan_link(ctx, op, true) end,
    unlink = function(ctx: types.PrepareContext, op: types.Op): types.OpPlan return item_tree.plan_link(ctx, op, false) end,
    delete = function(ctx: types.PrepareContext, op: types.Op): types.OpPlan return item_tree.plan_life(ctx, op, true) end,
    restore = function(ctx: types.PrepareContext, op: types.Op): types.OpPlan return item_tree.plan_life(ctx, op, false) end,
}

-- plan_op plans one op.
local function plan_op(ctx: types.PrepareContext, op: types.Op): types.OpPlan
    local handler = HANDLERS[op.op]
    if not handler then
        return M.invalid("unsupported_op", "op " .. tostring(op.op) .. " is not available")
    end
    ctx.head_guard = nil
    local plan = handler(ctx, op)
    if plan.status == "applied" and plan.item and (op.op == "parent" or op.op == "link" or op.op == "unlink" or op.op == "restore" or op.op == "rank") then
        local item = ctx.items[plan.item]
        if item and item.life == "live" then
            local definition, perr = store.process(ctx.db, ctx.board, item)
            if perr then return M.failed(perr) end
            local settled, ferr, err = flow.settle(ctx.board, item, ctx.actor, ctx.now, when.check(ctx), definition, ctx.auto)
            if err then return M.failed(err) end
            if ferr then return M.refused(plan.group, ferr) end
            if #(settled or {}) > 0 then
                plan.guards = plan.guards or {}
                plan.guards[M.item_group(item.item_id)] = ctx.base[item.item_id]
                for _, event in ipairs(settled or {}) do plan.events[#plan.events + 1] = event end
                plan.version = item.version
            end
        end
    end
    if #plan.events > 0 then
        for _, event in ipairs(plan.events) do
            for _, step in ipairs(event.body.patch or {}) do
                local field = ctx.board.model.by_id[step.f]
                if field and step.v ~= nil then
                    local err = fields.validate(field, step.v :: domain.Value)
                    if err then return M.invalid("invalid_value", err:message(), field.code) end
                end
            end
        end
    end
    plan.head = ctx.head_guard
    return plan
end

local function wip(ctx: types.PrepareContext, before: types.PrepareContext, plan: types.OpPlan): types.OpPlan
    if plan.status ~= "applied" then return plan end
    local policies = ctx.board.compiled.policy.wip
    for state, rule in pairs(policies or {}) do
        local delta, previous = 0, 0
        for id, item in pairs(ctx.items) do
            local old, err = store.item(ctx.db, ctx.board.board_id, id)
            if err then return M.failed(err) end
            local held = old and old.life == "live" and process.holds_state(old, state) and 1 or 0
            delta = delta + (item.life == "live" and process.holds_state(item, state) and 1 or 0) - held
            local prior = before.items[id] or old
            previous = previous + (prior and prior.life == "live" and process.holds_state(prior, state) and 1 or 0) - held
        end
        if delta > previous then
            local count, err = store.state_count(ctx.db, ctx.board.board_id, state, ctx.dialect)
            if err then return M.failed(err) end
            if rule.hard then plan.head = ctx.board.applied_seq end
            if count + delta > rule.limit then
                local finding = M.finding("wip_limit", "state " .. state .. " exceeds WIP limit " .. rule.limit)
                if rule.hard then return M.refused(plan.group, finding) end
                plan.findings = plan.findings or {}
                plan.findings[#plan.findings + 1] = finding
            end
        end
    end
    return plan
end

function M.plan_op(ctx: types.PrepareContext, op: types.Op): types.OpPlan
    local work = M.fork(ctx)
    local plan = wip(work, ctx, plan_op(work, op))
    local dependent = false
    for _, field in ipairs(work.board.compiled.fields) do if field.rollup then dependent = true end end
    if dependent and plan.status == "applied" then
        local affected: { { [string]: integer } } = {}
        for _, event in ipairs(plan.events) do
            local seeds: { [string]: integer } = {}
            if event.body.item then seeds[event.body.item] = 1 end
            if event.body.target and event.body.target.board == work.board.board_id then seeds[event.body.target.item] = 1 end
            if event.body.parent then seeds[event.body.parent] = 1 end
            if event.body.previous then seeds[event.body.previous] = 1 end
            affected[#affected + 1] = seeds
        end
        local err = rollup_rows.admit(work.db, work.board, affected, consts.LIMITS.fold_rows, work.links)
        if err then return M.failed(err) end
    end
    if plan.status == "applied" or plan.status == "unchanged" then M.adopt(ctx, work) end
    return plan
end

-- writes groups the planned events into appends: ops without an existing subject
-- share one write, every existing item or comment gets its own with the
-- version it expects.
function M.writes(plans: { types.OpPlan }, indices: { integer }, ops: { types.Op }): { types.Write }
    local out: { types.Write } = {}
    local by_group: { [string]: types.Write } = {}
    for _, i in ipairs(indices) do
        local plan = plans[i]
        if #plan.events > 0 then
            local write = by_group[plan.group]
            if not write then
                write = { group = plan.group, events = {}, ops = {}, caller_expect = false }
                if plan.group ~= M.FREE then
                    write.expect_subject = plan.group
                    write.expect_version = plan.expected
                end
                by_group[plan.group] = write
                out[#out + 1] = write
            end
            if plan.head then write.expect_head = plan.head end
            if plan.guards then
                write.guards = write.guards or {}
                for subject, version in pairs(plan.guards) do write.guards[subject] = version end
            end
            if ops[i].expect_version ~= nil and #write.ops == 0 then write.caller_expect = true end
            for _, e in ipairs(plan.events) do write.events[#write.events + 1] = e end
            write.ops[#write.ops + 1] = i
        end
    end
    for _, write in ipairs(out) do
        write.ops = {}
        for _, i in ipairs(indices) do
            if M.group_of(ops[i]) == write.group then write.ops[#write.ops + 1] = i end
        end
    end
    return out
end

return M
