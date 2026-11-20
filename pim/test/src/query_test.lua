-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Reads over the item table: filter validation per column kind, set and term
-- filters, keyset paging with nulls and ties, hierarchy anchors, text search,
-- and the get/explain/links views.
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local types = require("types")
local json = require("json")

type Map = { [string]: unknown }

local function query(h: fixture.Handle, request: Map): (types.QueryResult?, error?)
    local out, err = h.call("query", request)
    return out :: types.QueryResult?, err
end

local function count(h: fixture.Handle, request: Map): integer
    local out = assert(query(h, request))
    return #out.items
end

local function refused(h: fixture.Handle, op: string, request: Map, label: string)
    local _, err = h.call(op, request)
    test.not_nil(err, label)
end

-- drain pages a query with limit per page and returns the skus in order.
local function drain(h: fixture.Handle, request: Map, limit: integer): { string }
    local out: { string } = {}
    local after: types.Cursor? = nil
    for _ = 1, 50 do
        local page_request: Map = { limit = limit, after = after }
        for k, v in pairs(request) do page_request[k] = v end
        local page = assert(query(h, page_request))
        for _, item in ipairs(page.items) do out[#out + 1] = item.sku end
        after = page.after
        if not after then return out end
    end
    error("query paging did not end")
end

local function distinct(list: { string }): boolean
    local seen: { [string]: boolean } = {}
    for _, v in ipairs(list) do
        if seen[v] then return false end
        seen[v] = true
    end
    return true
end

local function define()
    test.describe("filters", function()
        test.it("refuses unknown ops, empty lists and missing values", function()
            local h = fixture.catalog()
            fixture.boot(h)
            refused(h, "query", { where = { field = "core.size", op = "ne", value = 40 } }, "ne")
            refused(h, "query", { where = { field = "core.size", op = "like", value = 40 } }, "like")
            refused(h, "query", { where = { field = "core.size", op = "in", value = {} } }, "empty in")
            refused(h, "query", { where = { field = "core.size", op = "eq" } }, "eq without value")
        end)

        test.it("refuses filters on unindexed, text-indexed and unknown attributes", function()
            local h = fixture.catalog()
            fixture.boot(h)
            refused(h, "query", { where = { field = "core.care", op = "eq", value = "x" } }, "unindexed")
            refused(h, "query", { where = { field = "core.name", op = "eq", value = "x", ctx = { locale = "en" } } }, "text index")
            refused(h, "query", { where = { field = "core.nope", op = "eq", value = "x" } }, "unknown")
        end)

        test.it("normalizes number filters to the attribute's scale", function()
            local h = fixture.catalog()
            fixture.boot(h)
            refused(h, "query", { where = { field = "core.size", op = "eq", value = "abc" } }, "not a number")
            refused(h, "query", { where = { field = "logistics.net_weight", op = "eq", value = "0.7405" } }, "finer than scale")
            test.eq(count(h, { where = { field = "core.size", op = "eq", value = 41 } }), 2)
            test.eq(count(h, { where = { field = "logistics.net_weight", op = "eq", value = "0.741" } }), 2)
            test.eq(count(h, { where = { field = "core.size", op = "gte", value = 41 } }), 4)
            test.eq(count(h, { where = { field = "core.size", op = "lt", value = 41 } }), 2)
            test.eq(count(h, { where = { field = "core.size", op = "in", value = { 40, 42 } } }), 4)
        end)

        test.it("filters terms by code or reference and sets by any member", function()
            local h = fixture.catalog()
            fixture.boot(h)
            test.eq(count(h, { where = { field = "core.color", op = "eq", value = "moss" } }), 3)
            test.eq(count(h, { where = { field = "core.color", op = "eq", value = { ref = { "term", "colors:moss" } } } }), 3)
            test.eq(count(h, { where = { field = "core.color", op = "in", value = { "moss", "slate" } } }), 6)
            test.eq(count(h, { where = { field = "core.color", op = "eq", value = "teal" } }), 0)
            test.eq(count(h, { where = { field = "core.materials", op = "in", value = { "rubber", "leather" } } }), 6)
            test.eq(count(h, { where = { field = "core.materials", op = "has", value = "leather" } }), 0)
            refused(h, "query", { where = { field = "core.materials", op = "lt", value = "rubber" } }, "set range")
        end)

        test.it("matches empty values through neq, nin, is_null and not", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local sku = "RDG-moss-40"
            steps.one(h, { product = { sku = sku }, expect_version = steps.version(h, sku), unset = { { attr = "logistics.net_weight" } } })
            local weight = "logistics.net_weight"
            local total = count(h, {})
            local has = count(h, { where = { field = weight, op = "is_null", value = false } })
            test.eq(has, total - 1)
            test.eq(count(h, { where = { field = weight, op = "is_null", value = true } }), 1)
            test.eq(count(h, { where = { field = weight, op = "neq", value = "0.741" } }), total - 2)
            test.eq(count(h, { where = { field = weight, op = "nin", value = { "0.741" } } }), total - 2)
            test.eq(count(h, { where = { ["not"] = { field = weight, op = "eq", value = "0.741" } } }), total - 2)
            test.eq(count(h, { where = { ["not"] = { field = weight, op = "gt", value = "0" } } }), 1)
            test.eq(count(h, { where = { ["not"] = { field = weight, op = "is_null", value = true } } }), has)
        end)

        test.it("reads terms by code in every operator and nests with other filters", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local color = "core.color"
            test.eq(count(h, { where = { field = color, op = "neq", value = "moss" } }), 3)
            test.eq(count(h, { where = { field = color, op = "nin", value = { "moss", "slate" } } }), 0)
            test.eq(count(h, { where = { ["not"] = { field = color, op = "in", value = { "moss" } } } }), 3)
            test.eq(count(h, { where = { ["or"] = {
                { ["and"] = { { field = color, op = "eq", value = "moss" }, { field = "core.size", op = "eq", value = 40 } } },
                { ["and"] = { { field = color, op = "eq", value = "slate" }, { field = "core.size", op = "eq", value = 42 } } },
            } } }), 2)
            test.eq(count(h, { where = { field = "core.materials", op = "has", value = "rubber" }, family = "footwear" }),
                count(h, { family = "footwear", where = { field = "core.materials", op = "in", value = { "rubber" } } }))
            refused(h, "query", { where = { field = "core.materials", op = "eq", value = "rubber" } }, "eq on a set")
            refused(h, "query", { where = { field = color, op = "contains", value = "mo" } }, "contains on a term")
            refused(h, "query", { where = { field = color, op = "lt", value = "moss" } }, "range on a term")
            refused(h, "query", { filters = { { attr = color, op = "eq", value = "moss" } } }, "the flat list")
        end)

        test.it("counts the query's matches only when asked", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local moss: Map = { field = "core.color", op = "eq", value = "moss" }
            local first = assert(query(h, { where = moss, limit = 1, count = true }))
            test.eq(#first.items, 1)
            test.eq(first.total, 3)
            test.is_false(first.estimated)
            local second = assert(query(h, { where = moss, limit = 1, count = true, after = first.after }))
            test.eq(second.total, 3)
            test.eq((assert(query(h, { count = true }))).total, 6)
            local plain = assert(query(h, { where = moss }))
            test.is_nil(plain.total)
            test.is_nil(plain.estimated)
            refused(h, "query", { count = 10 }, "count takes a flag")
        end)

        test.it("takes operands in a tree and keeps history conditions off the catalog query", function()
            local h = fixture.catalog()
            fixture.boot(h)
            test.eq(count(h, { where = { field = "core.gtin", op = "neq", value = { ["$actor"] = "id" } } }), 6)
            refused(h, "query", { where = { field = "core.gtin", op = "eq", value = { ["$actor"] = "groups" } } }, "unknown actor operand")
            refused(h, "query", { where = { field = "core.size", op = "lt", value = { ["$now"] = "P0D" } } }, "time on a number")
            refused(h, "query", { where = { history = { field = "core.size", by = { ["$actor"] = "id" } } } }, "history condition")
            refused(h, "query", { where = { rel = "core.color", q = "some" } }, "relation condition")
        end)

        test.it("refuses a tree over its limits at the request", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local deep: Map = { field = "core.size", op = "eq", value = 40 }
            for _ = 1, 6 do deep = { ["not"] = deep } end
            local _, err = h.call("query", { where = deep })
            test.not_nil(err)
            test.eq((err :: error):kind(), errors.INVALID)
        end)

        test.it("combines family, status and hierarchy with filters", function()
            local h = fixture.catalog()
            fixture.boot(h)
            steps.one(h, { product = { sku = "RDG-moss-40" }, expect_version = steps.version(h, "RDG-moss-40"), status = "draft" })
            test.eq(count(h, { family = "footwear" }), 6)
            test.eq(count(h, { family = "nope" }), 0)
            test.eq(count(h, { status = "draft" }), 1)
            local out, malformed = h.call("query", { status = "nope" })
            test.is_nil(out)
            test.eq((malformed :: error):kind(), errors.INVALID)
            test.eq((malformed :: error):details().code, "invalid_request")
            test.eq(count(h, { family = "footwear", status = "active", parent = { sku = "RDG-moss" } }), 2)
            test.eq(count(h, { parent = { sku = "RDG-moss-40" } }), 0)
            refused(h, "query", { parent = { sku = "NOPE" } }, "unknown parent")
        end)

        test.it("leaves models and trashed products out of the item table", function()
            local h = fixture.catalog()
            fixture.boot(h)
            test.eq(count(h, {}), 6)
            steps.one(h, { product = { sku = "RDG-slate-40" }, expect_version = steps.version(h, "RDG-slate-40"), delete = true })
            test.eq(count(h, {}), 5)
            test.eq(count(h, { where = { field = "core.color", op = "eq", value = "slate" } }), 2)
        end)
    end)

    test.describe("sorting and paging", function()
        test.it("pages a number sort with nulls last in both directions", function()
            local h = fixture.catalog()
            fixture.boot(h)
            for _, sku in ipairs({ "RDG-moss-41", "RDG-slate-42" }) do
                steps.one(h, { product = { sku = sku }, expect_version = steps.version(h, sku), unset = { { attr = "logistics.net_weight" } } })
            end
            local up = drain(h, { sort = { field = "logistics.net_weight" } }, 2)
            test.eq(#up, 6)
            test.is_true(distinct(up))
            test.eq(up[1], "RDG-moss-40")
            test.is_true(up[5] == "RDG-moss-41" or up[5] == "RDG-slate-42")
            local down = drain(h, { sort = { field = "logistics.net_weight", dir = "desc" } }, 2)
            test.eq(#down, 6)
            test.is_true(distinct(down))
            test.eq(down[1], "RDG-moss-42")
            test.is_true(down[6] == "RDG-moss-41" or down[6] == "RDG-slate-42")
        end)

        test.it("breaks sort ties by product id so pages never overlap", function()
            local h = fixture.catalog()
            fixture.boot(h)
            for _, limit in ipairs({ 1, 2, 4 }) do
                local all = drain(h, { sort = { field = "core.size" } }, limit)
                test.eq(#all, 6)
                test.is_true(distinct(all))
            end
            local plain = drain(h, {}, 4)
            test.eq(#plain, 6)
            test.is_true(distinct(plain))
        end)

        test.it("keeps equality-filtered pages in the requested sort order", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local where = { field = "core.color", op = "eq", value = "moss" }
            local asc = drain(h, { where = where, sort = { field = "core.color" } }, 1)
            local desc = drain(h, { where = where, sort = { field = "core.color", dir = "desc" } }, 1)
            test.eq(#asc, 3)
            test.is_true(distinct(asc))
            test.eq(table.concat(desc, ","), table.concat(asc, ","))
            local size = drain(h, { where = where, sort = { field = "core.size", dir = "desc" } }, 1)
            test.eq(table.concat(size, ","), "RDG-moss-42,RDG-moss-41,RDG-moss-40")
        end)

        test.it("refuses malformed cursors and filter contexts at the boundary", function()
            local h = fixture.catalog()
            fixture.boot(h)
            for _, request in ipairs({
                { after = {} },
                { after = { id = 5 } },
                { sort = { field = "core.size" }, after = { id = "x", v = { 1 } } },
                { where = { field = "core.name", op = "eq", value = "x", ctx = "en" } },
                { where = { field = "core.size", op = "eq", value = 1, ctx = { locale = 1 } } },
            } :: { Map }) do
                local _, err = h.call("query", request)
                test.not_nil(err, json.encode(request))
                test.eq((err :: error):kind(), errors.INVALID, json.encode(request))
            end
            local _, links = h.call("list_links", { kind = "product", target = "x", after = { product_id = 1 } })
            test.not_nil(links)
            test.eq((links :: error):kind(), errors.INVALID)
        end)

        test.it("refuses sorts on sets, unindexed and text attributes and bad limits", function()
            local h = fixture.catalog()
            fixture.boot(h)
            refused(h, "query", { sort = { field = "core.materials" } }, "set sort")
            refused(h, "query", { sort = { field = "core.care" } }, "unindexed sort")
            refused(h, "query", { sort = { field = "core.name", ctx = { locale = "en" } } }, "text sort")
            refused(h, "query", { limit = 0 }, "limit 0")
            refused(h, "query", { limit = 201 }, "limit 201")
            test.eq(count(h, { limit = 200 }), 6)
        end)
    end)

    test.describe("columns", function()
        test.it("answers resolved values of the requested attributes in a context", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local out = h.call("query", { text = "RDG-moss-40", columns = { "core.name", "core.color", "core.size", "logistics.net_weight", "core.materials", "marketing.tagline" }, context = { locale = "de", channel = "web" } }) :: types.QueryResult
            test.eq(#out.items, 1)
            local values = assert(out.items[1].values)
            test.eq(values["core.name"], "Ridgeline Wanderstiefel")
            test.eq((values["core.color"] :: { ref: { string } }).ref[2], "colors:moss")
            test.eq(values["core.size"], 40)
            test.eq(#(values["core.materials"] :: { unknown }), 2)
            test.eq((values["logistics.net_weight"] :: { m: integer, e: integer }).m, 74)
            test.is_nil(values["marketing.tagline"])
            local bare = h.call("query", { text = "RDG-moss-40" }) :: types.QueryResult
            test.is_nil(bare.items[1].values)
            local _, err = h.call("query", { columns = { "core.nope" } })
            test.eq((err :: error):kind(), errors.INVALID)
        end)
    end)

    test.describe("text search", function()
        test.it("uses Unicode case folding for literal SKU prefixes", function()
            local h = fixture.catalog({ bare = true })
            for _, sku in ipairs({ "CAFÉ-01", "Straße-01", "%_one", "XYone" }) do
                test.eq(steps.one(h, { product = { sku = sku }, create = { family = "generic" } }).outcome, "created")
            end
            test.eq(count(h, { text = "CAFÉ-" }), 1)
            test.eq(count(h, { text = "café-" }), 1)
            test.eq(count(h, { text = "cafe-" }), 0)
            test.eq(count(h, { text = "STRASSE-" }), 1)
            test.eq(count(h, { text = "%_" }), 1)
        end)

        test.it("finds long Unicode tokens and requires every search token", function()
            local h = fixture.catalog()
            fixture.boot(h)
            test.eq(count(h, { text = "boot" }), 6)
            test.eq(count(h, { text = string.rep("x", 2100) .. " boot" }), 0)
            local token = string.rep("é", 1100)
            local outcome = steps.one(h, { product = { sku = "RDG" }, expect_version = 1,
                set = { { attr = "core.name", ctx = { locale = "en" }, value = token .. " boot" } } })
            test.eq(outcome.outcome, "updated")
            test.eq(count(h, { text = token }), 6)
            test.eq(count(h, { text = string.rep("É", 1100) .. " boot" }), 6)
            local counted = assert(query(h, { text = token .. " boot", count = true, limit = 1 }))
            test.eq(counted.total, 6)
            test.is_false(counted.estimated)
            test.eq(count(h, { text = token .. "x boot" }), 0)
            test.eq(count(h, { text = string.rep("e", 1100) .. " boot" }), 0)
        end)

        test.it("folds and searches large Unicode documents across all three lineage levels", function()
            local h = fixture.catalog({ bare = true })
            assert(h.call("apply_schema", { declaration = {
                aspects = { { namespace = "search", attributes = {
                    { code = "root", type = "kickside.pim.types:text", index = "text" },
                    { code = "middle", type = "kickside.pim.types:text", index = "text" },
                    { code = "leaf", type = "kickside.pim.types:text", index = "text" },
                    { code = "color", type = "kickside.pim.types:integer" },
                    { code = "size", type = "kickside.pim.types:integer" },
                } } },
                families = { { code = "searchable", aspects = { "search" }, variation = {
                    { axes = { "search.color" }, own = { "search.middle" } },
                    { axes = { "search.size" }, own = { "search.leaf" } },
                } } },
            } }))
            local function token(n: integer, prefix: string): string
                return prefix .. string.format("%04d", n)
            end
            local lower, upper = string.rep("é", 492), string.rep("É", 492)
            local function document(first: integer): string
                local words = {}
                for n = 1, 220 do words[n] = token(first + n - 1, lower) end
                return table.concat(words, " ")
            end
            test.eq(steps.one(h, { product = { sku = "ROOT" }, create = { family = "searchable" },
                set = { { attr = "search.root", value = document(1) } } }).outcome, "created")
            test.eq(steps.one(h, { product = { sku = "MID" }, create = { parent = { sku = "ROOT" } },
                set = { { attr = "search.color", value = 1 }, { attr = "search.middle", value = document(221) } } }).outcome, "created")
            local out, err = steps.apply(h, { { product = { sku = "LEAF" }, create = { parent = { sku = "MID" } },
                set = { { attr = "search.size", value = 1 }, { attr = "search.leaf", value = document(441) } } } })
            assert(out and not err, tostring(err))
            test.eq(out.outcomes[1].outcome, "created")
            local terms = token(660, upper) .. " " .. token(221, lower) .. " " .. token(1, lower)
            local found = assert(query(h, { text = terms, count = true }))
            test.eq(found.total, 1)
            test.eq(found.items[1].sku, "LEAF")
            test.eq(count(h, { text = terms .. " " .. token(661, lower) }), 0)
        end)

        test.it("matches all tokens in any order with punctuation and Unicode case", function()
            local h = fixture.catalog()
            fixture.boot(h)
            steps.one(h, { product = { sku = "RDG" }, expect_version = "any",
                set = { { attr = "core.name", ctx = { locale = "en" }, value = "red leather boot CAFÉ ΜΠΟΤΑ БОТИНОК hello@example.org %_" } } })
            for _, text in ipairs({ "red boot", "boot red", "red,boot", '"red boot"', 'red "boot',
                "café", "CAFÉ", "μποτα", "ботинок", "hello example org" }) do
                test.eq(count(h, { text = text }), 6, text)
            end
            test.eq(count(h, { text = "cafe" }), 0)
            test.eq(count(h, { text = "!!!" }), 0)
            test.eq(count(h, { text = "%_" }), 0)
        end)

        test.it("ignores empty text, tolerates quotes and finds indexed words", function()
            local h = fixture.catalog()
            fixture.boot(h)
            test.eq(count(h, { text = "" }), 6)
            test.eq(count(h, { text = "Wanderstiefel" }), 6)
            test.eq(count(h, { text = "say \"hello\" it's" }), 0)
            test.eq(count(h, { text = "nothingmatches" }), 0)
            test.eq(count(h, { text = "RDG-moss" }), 3)
            test.eq(count(h, { text = "rdg-slate-4" }), 3)
            test.eq(count(h, { text = "RDG-moss-41" }), 1)
        end)
    end)

    test.describe("product views", function()
        test.it("reports resolution states with their owners", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local root_id = assert(steps.get(h, "RDG")).product.product_id
            local model = assert(steps.get(h, "RDG", { locale = "de-AT" }))
            test.eq(model.values["core.name"].state, "fallback")
            test.eq(model.values["core.name"].ctx, "locale=de")
            local item = assert(steps.get(h, "RDG-moss-40", { locale = "en" }))
            test.eq(item.values["core.name"].state, "inherited")
            test.eq(item.values["core.name"].owner, root_id)
            test.eq(item.values["core.care"].state, "default")
            test.eq(item.values["marketing.tagline"].state, "absent")
            test.eq(#item.publications, 0)
            test.is_nil(assert(steps.get(h, "RDG")).readiness)
        end)

        test.it("refuses gets without a product and gets across catalogs", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local other = fixture.catalog()
            fixture.boot(other)
            local foreign = assert(steps.get(other, "RDG")).product.product_id
            refused(h, "get", { product = {} }, "empty ref")
            refused(h, "get", { product = { id = foreign } }, "foreign id")
        end)

        test.it("explains not applicable, cleared and default values and refuses bad requests", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local size = h.call("explain", { product = { sku = "RDG" }, attr = "core.size" }) :: types.ExplainResult
            test.eq(size.resolution.state, "not_applicable")
            steps.one(h, { product = { sku = "RDG" }, expect_version = steps.version(h, "RDG"), clear = { { attr = "core.care" } } })
            local cleared = h.call("explain", { product = { sku = "RDG-moss-40" }, attr = "core.care" }) :: types.ExplainResult
            test.eq(cleared.resolution.state, "cleared")
            refused(h, "explain", { product = { sku = "RDG" }, attr = "core.nope" }, "unknown attr")
            refused(h, "explain", { product = { sku = "NOPE" }, attr = "core.care" }, "unknown product")
            refused(h, "explain", { product = {}, attr = "core.care" }, "empty ref")
        end)

        test.it("lists links per set member and drops them when the holder leaves", function()
            local h = fixture.catalog()
            local made = h.call("apply", { items = {
                { product = { sku = "A" }, create = { family = "generic" } },
                { product = { sku = "B" }, create = { family = "generic" } },
                { product = { sku = "HOLDER" }, create = { family = "generic" } } } })
            local a, b, holder = made.outcomes[1].product_id, made.outcomes[2].product_id, made.outcomes[3].product_id
            steps.one(h, { product = { id = holder }, expect_version = 1, set = { { attr = "core.related", value = {
                { ref = { "product", a } }, { ref = { "product", b } } } } } })
            local to_a = h.call("list_links", { kind = "product", target = a }) :: types.LinksResult
            test.eq(#to_a.items, 1)
            test.eq(to_a.items[1].path, "0")
            local to_b = h.call("list_links", { kind = "product", target = b }) :: types.LinksResult
            test.eq(to_b.items[1].path, "1")
            refused(h, "list_links", { kind = "product", target = a, limit = 0 }, "limit 0")
            refused(h, "list_links", { kind = "product", target = a, limit = 201 }, "limit 201")
            steps.one(h, { product = { id = holder }, expect_version = 2, delete = true })
            test.eq(#(h.call("list_links", { kind = "product", target = a }) :: types.LinksResult).items, 0)
        end)
    end)
end

return { run = test.run_cases(define) }
