-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Component access: every contract method under every access level, resources
-- of another catalog stay unreachable whatever id a caller names, and a
-- revoked grant takes effect on the next call.
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local types = require("types")
local access_cases = require("access_cases")

type Map = { [string]: unknown }
type Request = () -> Map

local READ, WRITE = access_cases.READ, access_cases.WRITE
local MISSING = access_cases.MISSING

local function denied(err: unknown, what: string)
    test.not_nil(err, what .. " must be denied")
    test.eq((err :: error):kind(), errors.PERMISSION_DENIED, what .. ": " .. tostring(err))
end


local shared: fixture.Handle? = nil
local function catalog(): fixture.Handle
    if shared then return shared :: fixture.Handle end
    local h = fixture.catalog()
    fixture.boot(h)
    shared = h
    return h
end

local function define()
    test.describe("access matrix", function()
        for _, method in ipairs(access_cases.methods()) do
            for _, level in ipairs(access_cases.LEVELS) do
                local admitted = level.rank >= access_cases.NEEDS[method]
                test.it(method .. " under " .. level.name .. (admitted and " is admitted" or " is denied"), function()
                    local h = catalog()
                    local call, id = fixture.user(h)
                    if level.mask > 0 then h.call("grant", { subject_id = id, mask = level.mask }) end
                    local out, err = call(method, access_cases.REQUESTS[method])
                    if admitted then access_cases.admitted(method, out, err) else denied(err, method) end
                end)
            end
        end
    end)

    test.describe("catalog listing", function()
        test.it("lists only the catalogs a caller can read", function()
            local h = catalog()
            local call, id = fixture.user(h)
            local before = call("list", {})
            for _, c in ipairs(before.catalogs) do test.is_false(c.catalog_id == h.id) end
            h.call("grant", { subject_id = id, mask = READ })
            local found = false
            for _, c in ipairs(call("list", {}).catalogs) do if c.catalog_id == h.id then found = true end end
            test.is_true(found)
        end)

        test.it("takes a revoked grant into account on the next call", function()
            local h = catalog()
            local call, id = fixture.user(h)
            h.call("grant", { subject_id = id, mask = READ })
            local _, ok = call("get", { product = { sku = "RDG" } })
            test.is_nil(ok)
            h.call("grant", { subject_id = id, mask = 0 })
            local _, gone = call("get", { product = { sku = "RDG" } })
            denied(gone, "revoked get")
            local _, plan = call("query", {})
            denied(plan, "revoked query")
        end)
    end)

    test.describe("catalog isolation", function()
        local function pair(): (fixture.Handle, fixture.Handle, { Map }, { Map })
            local a, b = fixture.catalog(), fixture.catalog()
            local made_a, made_b = fixture.boot(a), fixture.boot(b)
            return a, b, made_a.outcomes, made_b.outcomes
        end

        test.it("answers not found for another catalog's product id", function()
            local a, b = pair()
            local foreign = assert(steps.get(b, "RDG")).product.product_id
            local _, by_id = a.call("get", { product = { id = foreign } })
            test.eq((by_id :: error):kind(), errors.NOT_FOUND)
        end)

        test.it("refuses history, explain and releases by another catalog's product id", function()
            local a, b = pair()
            local foreign = assert(steps.get(b, "RDG")).product.product_id
            for _, case in ipairs({
                { "list_history", { product = { id = foreign } } },
                { "explain", { product = { id = foreign }, attr = "core.care" } },
                { "list_releases", { product = { id = foreign } } },
            } :: { { unknown } }) do
                local _, err = a.call(case[1] :: string, case[2])
                test.eq((err :: error):kind(), errors.NOT_FOUND, tostring(case[1]))
            end
        end)

        test.it("cannot read another catalog's release or decide its proposal", function()
            local a, b = pair()
            local item = assert(steps.get(b, "RDG-moss-40"))
            local rel = b.call("release", { items = { { product = { sku = "RDG-moss-40" }, expect_version = item.product.version } } })
            local _, gerr = a.call("get_release", { release_id = rel.outcomes[1].release_id })
            test.eq((gerr :: error):kind(), errors.NOT_FOUND)
            local p = b.call("propose", { items = { { product = { sku = "RDG" }, set = { { attr = "core.care", value = "x" } } } } })
            local _, derr = a.call("decide", { proposal_id = p.proposal_id, decision = "accept" })
            test.eq((derr :: error):kind(), errors.NOT_FOUND)
            test.eq(#b.call("list_proposals", { status = "pending" }).proposals, 1)
        end)

        test.it("cannot edit, trash or restore another catalog's product by id", function()
            local a, b = pair()
            local foreign = assert(steps.get(b, "RDG-moss-40")).product
            local edit = a.call("apply", { items = { { product = { id = foreign.product_id }, expect_version = foreign.version, status = "draft" } } })
            test.eq(edit.outcomes[1].outcome, "invalid")
            local trash = a.call("apply", { items = { { product = { id = foreign.product_id }, expect_version = foreign.version, delete = true } } })
            test.eq(trash.outcomes[1].outcome, "invalid")
            local restore = a.call("apply", { items = { { product = { id = foreign.product_id }, expect_version = "any", restore = true } } })
            test.eq(restore.outcomes[1].outcome, "invalid")
            test.eq(assert(steps.get(b, "RDG-moss-40")).product.status, "active")
        end)

        test.it("refuses a reference, parent or move target from another catalog", function()
            local a, b = pair()
            local foreign = assert(steps.get(b, "RDG-moss")).product.product_id
            local ref = a.call("apply", { items = { { product = { sku = "RDG" }, expect_version = "any",
                set = { { attr = "core.related", value = { { ref = { "product", foreign } } } } } } } })
            test.eq(ref.outcomes[1].outcome, "invalid")
            local child = a.call("apply", { items = { { product = { sku = "X1" }, create = { parent = { id = foreign } },
                set = { { attr = "core.size", value = 77 } } } } })
            test.eq(child.outcomes[1].outcome, "invalid")
            local move = a.call("apply", { items = { { product = { sku = "RDG-slate-40" }, expect_version = "any", move = { parent = { id = foreign } } } } })
            test.eq(move.outcomes[1].outcome, "invalid")
            local _, anchor = a.call("query", { parent = { id = foreign } })
            test.eq((anchor :: error):kind(), errors.NOT_FOUND)
        end)

        test.it("keeps query, feeds and links to the addressed catalog", function()
            local a, b, expected, foreign_products = pair()
            local mark = "only-in-b"
            b.call("apply", { items = { { product = { sku = "RDG-moss-40" }, expect_version = "any", set = { { attr = "core.gtin", value = mark } } } } })
            test.eq(#(a.call("query", { where = { field = "core.gtin", op = "eq", value = mark } }) :: types.QueryResult).items, 0)
            test.eq(#(b.call("query", { where = { field = "core.gtin", op = "eq", value = mark } }) :: types.QueryResult).items, 1)
            local actual_ids, expected_ids, foreign_ids = {}, {}, {}
            for _, item in ipairs(expected) do expected_ids[#expected_ids + 1] = item.product_id end
            for _, item in ipairs(foreign_products) do foreign_ids[item.product_id] = true end
            local cursor = nil
            for _ = 1, 10 do
                local feed, err = a.call("list_changes", { limit = 2, cursor = cursor })
                test.is_nil(err, tostring(err))
                for _, item in ipairs(feed.items) do
                    test.is_false(foreign_ids[item.product_id] == true)
                    actual_ids[#actual_ids + 1] = item.product_id
                end
                cursor = feed.next
                if not feed.has_more then break end
            end
            table.sort(actual_ids)
            table.sort(expected_ids)
            test.eq(#expected_ids, 9)
            test.eq(table.concat(actual_ids, ","), table.concat(expected_ids, ","))
            local foreign = assert(steps.get(b, "RDG")).product.product_id
            test.eq(#(a.call("list_links", { kind = "product", target = foreign }) :: types.LinksResult).items, 0)
        end)

        test.it("lets two catalogs hold the same sku and gtin", function()
            local a, b = pair()
            test.is_false(assert(steps.get(a, "RDG")).product.product_id == assert(steps.get(b, "RDG")).product.product_id)
            test.eq(assert(steps.get(a, "RDG-moss-40")).values["core.gtin"].value, assert(steps.get(b, "RDG-moss-40")).values["core.gtin"].value)
        end)
    end)
end

return { run = test.run_cases(define) }
