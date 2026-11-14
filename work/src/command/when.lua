-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Guards evaluate the command's working document through the shared predicate compiler.
local predicates = require("predicates")
local conditions = require("conditions")
local domain = require("domain")
local types = require("types")
local M = {}

function M.check(ctx: types.PrepareContext): domain.WhenCheck
    return function(item: domain.Item, where: unknown): (boolean, error?)
        if where == nil then return true, nil end
        local fields: { [string]: boolean } = {}
        local peer, err = predicates.inspect(where, fields, 1)
        if err then return false, err end
        if peer then ctx.head_guard = ctx.board.applied_seq end
        return conditions.point(ctx.db, ctx.board, item, where, ctx.actor, ctx.dialect, { items = ctx.items, links = ctx.links })
    end
end

return M
