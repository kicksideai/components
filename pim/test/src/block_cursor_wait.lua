-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local probe = require("probe")
local types = require("types")
local waiter = require("waiter")

local function run(input: { catalog_id: string, cursor: types.ChangesCursor }): (types.WaitProductResult?, error?)
    local sku = "RDG-moss-40"
    local seq: integer? = nil
    waiter.before_receive(function()
        local applied, err = funcs.call("app:pim_call", { op = "apply", catalog_id = input.catalog_id, request = { items = {
            { product = { sku = sku }, expect_version = "any", status = "draft" },
        } } })
        assert(applied and not err, tostring(err))
        assert(applied.outcomes[1].outcome == "updated")
        seq = applied.seq
    end)
    local matched, err = probe.product(input.catalog_id, {
        product = { sku = sku }, cursor = input.cursor, min_seq = input.cursor.seq + 1,
        predicate = { status = "draft" }, timeout_ms = 5000,
    })
    if err then return nil, err end
    assert(seq and matched and matched.cursor.seq >= seq, "wait did not observe the committed update")
    return matched, nil
end

return { run = run }
