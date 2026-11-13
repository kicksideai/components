-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local component = require("component")
local fields = require("fields")
local values = require("values")
local store = require("store")
local access_rows = require("access_rows")
local domain = require("domain")
local types = require("types")
local M = require("prepare_context")
local R = {}

function R.target(raw: unknown, board_id: string): (domain.Target?, types.OpPlan?)
    if type(raw) ~= "table" then return nil, M.invalid("invalid_target", "relation target is { item, board? }", "target") end
    local ref = raw :: types.TargetRef
    if type(ref.item) ~= "string" or ref.item == "" or (ref.board ~= nil and (type(ref.board) ~= "string" or ref.board == "")) then
        return nil, M.invalid("invalid_target", "relation target is { item, board? }", "target")
    end
    for key in pairs(raw) do
        if key ~= "item" and key ~= "board" then return nil, M.invalid("invalid_target", "relation target is { item, board? }", "target") end
    end
    return { item = ref.item, board = ref.board or board_id }, nil
end

-- All local and cross-board references use the command's admitted peer snapshots.
function R.resolve(ctx: types.PrepareContext, target: domain.Target): (domain.Item?, types.OpPlan?)
    if target.board ~= ctx.board.board_id then
        local allowed, err = M.allows(ctx, target.board, component.ACCESS.READ :: integer)
        if err then return nil, M.failed(err) end
        if not allowed then return nil, M.result("denied", M.FREE, "target_denied", "target board is unavailable", "target") end
    end
    local peer: domain.Item?, err: error?
    if target.board == ctx.board.board_id then peer, err = M.read(ctx, target.item)
    else peer, err = store.item(ctx.db, target.board, target.item) end
    if err then return nil, M.failed(err) end
    local board = ctx.board
    if target.board ~= board.board_id then
        local loaded, lerr = store.board(ctx.db, target.board)
        if lerr then return nil, M.failed(lerr) end
        if not loaded then return nil, M.invalid("invalid_reference", "target board is unavailable", "target") end
        local admitted = ctx.peer_boards and ctx.peer_boards[target.board]
        if not admitted or admitted.digest ~= loaded.digest then
            return nil, M.failed(errors.new({ kind = errors.UNAVAILABLE, message = "target board rules changed", details = { code = "access_projection_changed" } }))
        end
        board = loaded
        board.caller = admitted.caller
    end
    board.dialect = ctx.dialect
    if peer then
        local allowed, aerr = access_rows.permits(ctx.db, board, peer.item_id)
        if aerr then return nil, M.failed(aerr) end
        if not allowed then peer = nil end
    end
    if not peer or peer.life ~= "live" then return nil, M.invalid("invalid_reference", "target item is unavailable", "target") end
    return peer, nil
end

function R.patch(ctx: types.PrepareContext, patch: { domain.PatchStep }): types.OpPlan?
    for _, step in ipairs(patch) do
        local field = ctx.board.model.by_id[step.f]
        if field and field.type == "item" and step.v ~= nil then
            for _, value in ipairs(values.members(fields.shape(field), step.v)) do
                local board, item = (value :: domain.Ref).ref[2]:match("^([^/]+)/(.+)$")
                local _, err = R.resolve(ctx, { board = board :: string, item = item :: string })
                if err then
                    if err.status == "unavailable" then return err end
                    return M.invalid("invalid_reference", "field reference is unavailable", field.code)
                end
            end
        end
    end
    return nil
end
return R
