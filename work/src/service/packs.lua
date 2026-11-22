-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local requests = require("requests")
local catalog = require("catalog")
local planner = require("planner")
local packs = require("packs")
local component = require("component")
local board_meta = require("board_meta")
local consts = require("consts")
local types = require("types")
local M = {}
function M.list_packs(input: unknown): (types.Discovery?, error?)
    local err = requests.parse("list_packs", input)
    if err then return nil, err end
    return catalog.list()
end
function M.pack_plan(input: unknown): (types.Plan?, error?)
    local err = requests.parse("pack_plan", input)
    if err then return nil, err end
    local execution, perr = planner.plan(input :: types.Request)
    if perr or not execution then return nil, perr end
    return execution.plan, nil
end
function M.pack_apply(input: unknown): (types.Result?, error?)
    local err = requests.parse("pack_apply", input)
    if err then return nil, err end
    return packs.apply(input :: types.Request)
end
function M.fleet(input: unknown): (types.Fleet?, error?)
    local err = requests.parse("list", input, "kickside.work:packs")
    if err then return nil, err end
    local request = input :: { pack: string?, limit: integer?, after: integer? }
    local limit, after = request.limit or 50, request.after or 0
    local boards, berr = component.query({ impl_ids = { consts.BOARD_IMPL }, access_mask = component.ACCESS.ADMIN :: integer,
        order_by = { field = "component_id", direction = "ASC" }, limit = limit + 1, offset = after })
    if berr then return nil, berr :: error end
    local more = #(boards or {}) > limit
    local ids: { unknown } = {}
    for i = 1, math.min(#(boards or {}), limit) do
        ids[i] = boards[i].component_id
    end
    local rows, rerr = board_meta.packs(ids, request.pack)
    if rerr or not rows then return nil, rerr end
    local result: { types.FleetRow } = {}
    local revisions: { [string]: types.Revision | false } = {}
    for _, row in ipairs(rows) do
        local current = revisions[row.pack]
        if current == nil then
            local revision, err = catalog.revision(row.pack)
            if err then return nil, err end
            current = revision or false
            revisions[row.pack] = current
        end
        result[#result + 1] = { board_id = row.board_id, pack = row.pack, version = row.version, digest = row.digest,
            outdated = catalog.is_outdated(current or nil, row.version, row.digest) }
    end
    return { boards = result, next = more and (after + limit) or nil }, nil
end
return M
