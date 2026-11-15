-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Declarative scopes (spec 3.5): items filtered by plugin rows in PIM's
-- database, with identifiers from the scope entry, values checked against its
-- declared types and ops, and the scope's access level enforced per caller.
local test = require("test")
local fixture = require("fixture")
local store = require("store")
local types = require("types")

type Map = { [string]: unknown }

local STOCK = "app:stock_scope"
local ADOPTED = { STOCK, "app:cost_scope", "app:ghost_scope" }

local function exec(statement: string, params: { unknown })
    local db = assert(store.open())
    local _, err = db:execute(statement, params)
    db:release()
    assert(not err, tostring(err))
end

-- stock boots a catalog that adopts the harness scopes and records stock for
-- three of its items.
local function stock(): fixture.Handle
    local h = fixture.catalog()
    fixture.boot(h)
    local _, aerr = h.call("apply_schema", { declaration = { scopes = ADOPTED } })
    assert(not aerr, tostring(aerr))
    exec([[CREATE TABLE IF NOT EXISTS pim_test_stock (catalog_id TEXT NOT NULL, product_id TEXT NOT NULL, location_id TEXT NOT NULL,
        available INTEGER NOT NULL)]], {})
    local rows = { { "RDG-moss-40", "WH1", 5 }, { "RDG-moss-41", "WH1", 0 }, { "RDG-moss-41", "WH2", 3 }, { "RDG-slate-40", "WH2", 9 } }
    for _, r in ipairs(rows) do
        local id = h.call("get", { product = { sku = r[1] } }).product.product_id
        exec("INSERT INTO pim_test_stock (catalog_id, product_id, location_id, available) VALUES ($1, $2, $3, $4)", { h.id, id, r[2], r[3] })
    end
    return h
end

local function skus(h: fixture.Handle, request: Map): { string }
    local out, err = h.call("query", request)
    assert(not err, tostring(err))
    local list: { string } = {}
    for _, item in ipairs((out :: types.QueryResult).items) do list[#list + 1] = item.sku end
    table.sort(list)
    return list
end

local function scoped(where: Map, id: string?): Map
    return { scopes = { { id = id or STOCK, where = where } } }
end

local function define()
    test.describe("scopes", function()
        test.it("filters items by plugin rows of their own catalog", function()
            local h = stock()
            local other = stock()
            local available = skus(h, scoped({ available = { gt = 0 } }))
            test.eq(#available, 3)
            test.eq(available[1], "RDG-moss-40")
            test.eq(available[2], "RDG-moss-41")
            test.eq(available[3], "RDG-slate-40")
            local wh1 = skus(h, scoped({ available = { gt = 0 }, location = { eq = "WH1" } }))
            test.eq(#wh1, 1)
            test.eq(wh1[1], "RDG-moss-40")
            test.eq(#skus(h, scoped({ location = { ["in"] = { "WH1", "WH2" } } })), 3)
            test.eq(#skus(h, scoped({ available = { gte = 3, eq = 3 } })), 1)
            test.eq(#skus(other, scoped({ available = { gt = 0 } })), 3)
        end)

        test.it("combines with other filters, sorts and pages", function()
            local h = stock()
            local request = scoped({ available = { gt = 0 } })
            request.where = { field = "core.color", op = "eq", value = "moss" }
            test.eq(#skus(h, request), 2)
            local page = h.call("query", { scopes = { { id = STOCK, where = { available = { gt = 0 } } } }, sort = { field = "core.size" }, limit = 2 })
            test.eq(#page.items, 2)
            local rest = h.call("query", { scopes = { { id = STOCK, where = { available = { gt = 0 } } } }, sort = { field = "core.size" }, limit = 2,
                after = page.after })
            test.eq(#rest.items, 1)
        end)

        test.it("refuses unknown scopes, filters, ops and value types", function()
            local h = stock()
            local cases: { Map } = {
                scoped({ available = { gt = 0 } }, "app:nope"),
                scoped({ available = { gt = 0 } }, "app:weight_check"),
                scoped({ shelf = { eq = "A" } }),
                scoped({ available = { lt = 3 } }),
                scoped({ available = { gt = "3" } }),
                scoped({ location = { eq = 4 } }),
                scoped({ location = { ["in"] = {} } }),
                scoped({ available = 3 }),
                { scopes = { { where = {} } } },
            }
            for i, request in ipairs(cases) do
                local _, err = h.call("query", request)
                test.not_nil(err, "case " .. i)
            end
        end)

        test.it("refuses a scope above the caller's access and serves it at that access", function()
            local h = stock()
            local reader, reader_id = fixture.user(h)
            h.call("grant", { subject_id = reader_id, mask = 1 })
            local _, denied = reader("query", scoped({ available = { gt = 0 } }, "app:cost_scope"))
            test.not_nil(denied)
            test.eq((denied :: error):kind(), errors.PERMISSION_DENIED)
            test.eq(#skus(h, scoped({ available = { gt = 0 } }, "app:cost_scope")), 3)
            local allowed, err = reader("query", scoped({ available = { gt = 0 } }))
            test.is_nil(err)
            test.eq(#(allowed :: types.QueryResult).items, 3)
        end)

        test.it("refuses a scope whose table is missing, and refuses to adopt a malformed scope", function()
            local h = stock()
            local _, missing = h.call("query", scoped({ available = { gt = 0 } }, "app:ghost_scope"))
            test.not_nil(missing)
            test.eq((missing :: error):details().code, "database_unavailable")
            local _, hostile = h.call("apply_schema", { declaration = { scopes = { "app:hostile_scope" } } })
            test.not_nil(hostile)
            local _, unknown = h.call("apply_schema", { declaration = { scopes = { "app:nope" } } })
            test.not_nil(unknown)
            test.eq(#skus(h, {}), 6)
        end)

        test.it("serves only the scopes the catalog adopted", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local _, unadopted = h.call("query", scoped({ available = { gt = 0 } }))
            test.not_nil(unadopted)
            test.eq((unadopted :: error):details().code, "scope_not_adopted")
            local adopted = stock()
            test.eq(#skus(adopted, scoped({ available = { gt = 0 } })), 3)
            local _, rerr = adopted.call("apply_schema", { declaration = { remove = { scopes = { STOCK } } } })
            test.is_nil(rerr)
            local _, dropped = adopted.call("query", scoped({ available = { gt = 0 } }))
            test.not_nil(dropped)
            local schema = adopted.call("get_schema", {})
            test.is_nil(schema.scopes[STOCK])
            test.is_true(schema.scopes["app:cost_scope"] == true)
        end)
    end)
end

return { run = test.run_cases(define) }
