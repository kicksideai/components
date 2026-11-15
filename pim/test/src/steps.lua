-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Typed shortcuts for harness tests: one-item commands and product reads.
local types = require("types")
local fixture = require("fixture")
local time = require("time")

local M = {}

function M.copy(value: unknown): unknown
    if type(value) ~= "table" then return value end
    local out: { [unknown]: unknown } = {}
    for key, item in pairs(value :: { [unknown]: unknown }) do out[key] = M.copy(item) end
    return out
end

-- get reads a live product by sku, or returns the read error.
function M.get(h: fixture.Handle, sku: string, context: types.Ctx?): (types.GetResult?, error?)
    local out, err = h.call("get", { product = { sku = sku }, context = context })
    return out :: types.GetResult?, err
end

function M.version(h: fixture.Handle, sku: string): integer
    local got = assert(M.get(h, sku))
    return got.product.version
end

-- apply runs one command and returns its result.
function M.apply(h: fixture.Handle, items: { types.ApplyItem }, mode: string?): (types.ApplyResult?, error?)
    local out, err = h.call("apply", { items = items, mode = mode })
    return out :: types.ApplyResult?, err
end

-- one applies a single item and returns its outcome.
function M.one(h: fixture.Handle, item: types.ApplyItem): types.Outcome
    local out, err = M.apply(h, { item })
    assert(not err and out, tostring(err))
    return out.outcomes[1]
end

-- set writes one value on the current version of sku.
function M.set(h: fixture.Handle, sku: string, attr: string, value: unknown, ctx: types.Ctx?): types.Outcome
    return M.one(h, { product = { sku = sku }, expect_version = M.version(h, sku), set = { { attr = attr, ctx = ctx, value = value } } })
end

function M.query(h: fixture.Handle, request: unknown): types.QueryResult
    local out, err = h.call("query", request)
    assert(not err and out, tostring(err))
    return out :: types.QueryResult
end

function M.count(h: fixture.Handle, request: unknown): integer
    return #M.query(h, request).items
end

-- rebuilt waits until the catalog's rebuild after a schema change finishes.
function M.rebuilt(h: fixture.Handle)
    for _ = 1, 400 do
        local q, err = h.call("query", { limit = 1 })
        assert(not err and q, tostring(err))
        if q and not (q :: types.QueryResult).rebuilding then return end
        time.after("50ms"):receive()
    end
    error("rebuild did not finish")
end

return M
