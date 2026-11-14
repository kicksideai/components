-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Peer references expose identifiers after board and item access resolve.
local component = require("component")
local store = require("store")
local access = require("access")
local access_rows = require("access_rows")
local guard = require("guard")
local domain = require("domain")
local types = require("types")
local M = {}


function M.catalog(board: domain.Board): { [string]: domain.Field }
    local out: { [string]: domain.Field } = {}
    for _, field in ipairs(board.compiled.fields) do if field.type == "item" then out[field.code] = field end end
    return out
end

function M.redactor(catalog: { [string]: domain.Field }): types.Redactor
    local cache: { [string]: boolean } = {}
    local function reference(raw: unknown): (unknown, error?)
        local target = raw :: { board: string, item: string }
        local key = target.board .. "/" .. target.item
        local visible = cache[key]
        if visible == nil then
            local allowed, err = M.visible(target.board, target.item)
            if err then return nil, err end
            visible, cache[key] = allowed, allowed
        end
        if not visible then return { unavailable = true }, nil end
        return raw, nil
    end
    return function(code: string, value: unknown): (unknown, error?)
        local field = catalog[code]
        if not field or value == nil then return value, nil end
        if field.cardinality == "one" then return reference(value) end
        local out: { unknown } = {}
        for _, member in ipairs(value :: { unknown }) do
            local surface, err = reference(member)
            if err then return nil, err end
            out[#out + 1] = surface
        end
        return out, nil
    end
end

function M.items<T>(items: { T }, redact: types.Redactor): error?
    for _, raw in ipairs(items) do
        local item = raw :: { values: { [string]: unknown }? }
        for code, value in pairs(item.values or {}) do
            local surface, err = redact(code, value)
            if err then return err end
            (item.values :: { [string]: unknown })[code] = surface
        end
    end
    return nil
end

function M.page(page: types.QueryPage, redact: types.Redactor): error?
    local err = M.items(page.items, redact)
    if err then return err end
    local function group_values(group: types.QueryGroupRow): error?
        local err = M.items(group.items, redact)
        if err then return err end
        local value, verr = redact(group.field, group.value)
        if verr then return verr end
        group.value = value
        return nil
    end
    for _, group in ipairs(page.groups or {}) do
        err = group_values(group)
        if err then return err end
        for _, subgroup in ipairs(group.groups or {}) do
            err = group_values(subgroup)
            if err then return err end
        end
    end
    return nil
end

function M.visible(board_id: string, item_id: string?): (boolean, error?)
    local _, err = component.validate_access(board_id, component.ACCESS.READ :: integer)
    local admitted, aerr = guard.authorization(err :: error?)
    if aerr or not admitted then return false, aerr end
    if not item_id then return true, nil end
    local result, rerr = access.with_snapshot(board_id, nil, function(tx: types.Executor, board: domain.Board, _dialect: string): ({ visible: boolean, as_of: integer?, generation: integer? }?, error?)
        local allowed, aerr = access_rows.permits(tx, board, item_id)
        if aerr then return nil, aerr end
        local item, ierr
        if allowed then item, ierr = store.item(tx, board_id, item_id) end
        if ierr then return nil, ierr end
        return { visible = allowed and item ~= nil }, nil
    end, { admitted = { [board_id] = true }, holders = {} })
    return result ~= nil and result.visible, rerr
end
return M
