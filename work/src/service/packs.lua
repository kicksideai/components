-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local requests = require("requests")
local catalog = require("catalog")
local planner = require("planner")
local packs = require("packs")
local component = require("component")
local store = require("store")
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
    local plan, perr = planner.plan(input :: types.Request)
    if perr or not plan then return nil, perr end
    plan.prepared, plan.plugin_configs = nil, nil
    return plan, nil
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
    local placeholders: { string } = {}
    for i = 1, math.min(#(boards or {}), limit) do
        ids[i], placeholders[i] = boards[i].component_id, "$" .. i
    end
    if #ids == 0 then return { boards = {} }, nil end
    local db, derr = store.open()
    if not db then return nil, derr end
    local rows, rerr = db:query("SELECT board_id,pack,pack_version,pack_digest FROM kickside_work_board WHERE board_id IN (" ..
        table.concat(placeholders, ",") .. ") ORDER BY board_id", ids)
    db:release()
    if rerr then return nil, rerr end
    local result: { types.FleetRow } = {}
    local revisions: { [string]: { version: string, digest: string } | false } = {}
    for _, row in ipairs(rows or {}) do
        local pack = store.text(row.pack)
        if pack and (not request.pack or request.pack == pack) then
            local current = revisions[pack]
            if current == nil then
                local revision, err = catalog.revision(pack)
                if err then return nil, err end
                current = revision or false
                revisions[pack] = current
            end
            local board_id, ierr = store.need(row, "board_id")
            if ierr then return nil, ierr end
            local version, verr = store.need(row, "pack_version")
            if verr then return nil, verr end
            local digest, derr = store.need(row, "pack_digest")
            if derr then return nil, derr end
            result[#result + 1] = { board_id = board_id :: string, pack = pack, version = version :: string, digest = digest :: string,
                outdated = current == false or current.version ~= version or current.digest ~= digest }
        end
    end
    return { boards = result, next = more and (after + limit) or nil }, nil
end
return M
