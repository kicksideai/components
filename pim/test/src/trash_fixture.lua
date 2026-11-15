-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local fixture = require("fixture")
local store = require("store")
local funcs = require("funcs")
local retention_rows = require("retention_rows")
local types = require("types")
local function trash(h: fixture.Handle, sku: string): string
    local found = h.call("get", { product = { sku = sku } })
    local out, err = h.call("apply", { items = { { product = { sku = sku }, expect_version = found.product.version, delete = true } } })
    assert(not err, tostring(err))
    assert(out.outcomes[1].outcome == "updated" and out.outcomes[1].trashed == true, out.outcomes[1].outcome)
    return found.product.product_id
end

local function restore(h: fixture.Handle, id: string): types.Outcome
    local db = assert(store.open())
    local p = assert(store.product(db, h.id, id))
    db:release()
    local out, err = h.call("apply", { items = { { product = { id = id }, expect_version = p.version, restore = true } } })
    assert(not err, tostring(err))
    return (out :: types.ApplyResult).outcomes[1]
end

local function exec(statement: string, params: { unknown })
    local db = assert(store.open())
    local _, err = db:execute(statement, params)
    db:release()
    assert(not err, tostring(err))
end

local function product(h: fixture.Handle, id: string): types.Product?
    local db = assert(store.open())
    local p, err = store.product(db, h.id, id)
    db:release()
    assert(not err, tostring(err))
    return p
end

-- run_owner runs one retention pass for h's catalog and waits until the
-- projection covers everything the pass appended.
type OwnerResult = { success: boolean, deleted: integer, needs_continue: boolean? }

local function run_owner(h: fixture.Handle): OwnerResult
    local db = assert(store.open())
    assert(not retention_rows.advance(db, { catalog_id = h.id, inclusive = 1, product_after = "" }))
    db:release()
    local out, err = funcs.call("kickside.pim.retention:owner", {})
    assert(not err, tostring(err))
    assert(out.success == true, tostring(out.error))
    local settled, serr = h.call("settle", {})
    assert(not serr and settled.done == true, tostring(serr))
    return out :: OwnerResult
end


return { trash = trash, restore = restore, exec = exec, product = product, run_owner = run_owner }
