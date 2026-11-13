-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local consts = require("consts")
local domain = require("domain")
local store = require("store")
local types = require("types")
local uuid = require("uuid")

local M = require("prepare_context")
local EV = consts.EVENTS
-- Prepare of comments: add, edit and delete.

local function mentions_of(raw: unknown): ({ domain.PrincipalDecl }?, types.OpPlan?)
    if raw == nil then return {}, nil end
    if type(raw) ~= "table" or #raw > consts.LIMITS.mentions then
        return nil, M.invalid("invalid_mentions", "mentions is a bounded list of principals", "mentions")
    end
    local count = 0
    local out: { domain.PrincipalDecl } = {}
    for k, value in pairs(raw) do
        if type(k) ~= "number" or k % 1 ~= 0 or k < 1 or k > #raw or type(value) ~= "table" then
            return nil, M.invalid("invalid_mentions", "mentions is a list of principals", "mentions")
        end
        count = count + 1
        if type(value.kind) ~= "string" or not consts.PRINCIPAL_KINDS[value.kind] or type(value.id) ~= "string"
            or value.id == "" or #value.id > consts.LIMITS.mention_id_bytes then
            return nil, M.invalid("invalid_mentions", "mention requires a principal kind and id", "mentions")
        end
        for field in pairs(value) do
            if field ~= "kind" and field ~= "id" then return nil, M.invalid("invalid_mentions", "mention carries kind and id", "mentions") end
        end
        out[k] = { kind = value.kind, id = value.id }
    end
    if count ~= #raw then return nil, M.invalid("invalid_mentions", "mentions is a dense list", "mentions") end
    return out, nil
end

local function same_mentions(a: { domain.PrincipalDecl }, b: { domain.PrincipalDecl }): boolean
    if #a ~= #b then return false end
    for i, value in ipairs(a) do if value.kind ~= b[i].kind or value.id ~= b[i].id then return false end end
    return true
end

local function plan_comment(ctx: types.PrepareContext, op: types.Op): types.OpPlan
    local item, perr = M.locate(ctx, op.item)
    if perr or not item then return perr or M.invalid("item_required", "item required", "item") end
    if item.life ~= "live" then return M.result("invalid", M.FREE, "item_trashed", "item " .. item.item_id .. " is in the trash", "item") end
    local mentions, merr = mentions_of(op.mentions)
    if merr or not mentions then return merr or M.invalid("invalid_mentions", "invalid mentions", "mentions") end
    if op.comment == nil then
        if type(op.body) ~= "string" or op.body == "" or #op.body > consts.LIMITS.comment_bytes then
            return M.invalid("invalid_body", "comment body is 1 to " .. consts.LIMITS.comment_bytes .. " bytes", "body")
        end
        local id = uuid.v4()
        local plan: types.OpPlan = { status = "applied", events = { M.event(EV.COMMENT_ADDED, "c:" .. id,
            { comment = id, item = item.item_id, body = op.body, mentions = mentions }) }, group = M.FREE, item = item.item_id, comment = id }
        return plan
    end
    local id = op.comment
    local group = "c:" .. id
    local comment = ctx.comments[id]
    if not comment then
        local found, err = store.comment(ctx.db, ctx.board.board_id, id)
        if err then return M.failed(err) end
        if not found or found.deleted or found.item_id ~= item.item_id then
            return M.result("invalid", group, "unknown_comment", "unknown comment " .. id, "comment")
        end
        comment = found
        ctx.comments[id] = comment
        ctx.comment_base[id] = comment.version
    end
    local plan: types.OpPlan = { status = "applied", events = {}, group = group, item = item.item_id, comment = id }
    plan.expected = ctx.comment_base[id]
    if op.delete == true then
        comment.deleted = true
        comment.version = comment.version + 1
        plan.events = { M.event(EV.COMMENT_DELETED, group, { comment = id, item = item.item_id }) }
        return plan
    end
    if type(op.body) ~= "string" or op.body == "" or #op.body > consts.LIMITS.comment_bytes then
        return M.result("invalid", group, "invalid_body", "comment body is 1 to " .. consts.LIMITS.comment_bytes .. " bytes", "body")
    end
    if op.body == comment.body and same_mentions(mentions, comment.mentions) then
        plan.status = "unchanged"
        return plan
    end
    comment.body = op.body
    comment.mentions = mentions
    comment.version = comment.version + 1
    plan.events = { M.event(EV.COMMENT_EDITED, group, { comment = id, item = item.item_id, body = op.body, mentions = mentions }) }
    return plan
end



return { plan_comment = plan_comment }
