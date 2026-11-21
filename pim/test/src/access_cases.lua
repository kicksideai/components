-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Contract access probes use valid requests, successful reads and explicit
-- domain refusals for missing or stale resources. Each caller holds one
-- declared access level.
local test = require("test")

local M = {}

type Map = { [string]: unknown }
type Level = { name: string, mask: integer, rank: integer }

local READ: integer, WRITE: integer, ADMIN: integer = 1, 2, 8
M.READ, M.WRITE, M.ADMIN = READ, WRITE, ADMIN

local MISSING = "00000000-0000-0000-0000-000000000000"
M.MISSING = MISSING

local REQUESTS: { [string]: Map } = {
    get_schema = {}, query = { limit = 1 }, get = { product = { sku = "RDG" } }, list_history = { limit = 1 },
    list_links = { kind = "product", target = MISSING }, explain = { product = { sku = "RDG" }, attr = "core.care" },
    list_changes = { limit = 1 }, list_publications = { channel = "web", limit = 1 }, list_proposals = { limit = 1 },
    get_release = { release_id = MISSING }, list_releases = { product = { sku = "RDG" }, limit = 1 }, list_terms = { vocabulary = "colors", limit = 1 },
    schema_options = {},
    propose = { items = { { product = { sku = "RDG" }, set = { { attr = "core.care", value = "p" } } } } },
    apply = { items = { { product = { sku = "RDG" }, expect_version = 9999, status = "draft" } } },
    release = { items = { { product = { sku = "RDG-moss-40" }, expect_version = 9999 } } },
    withdraw = { items = { { product = { sku = "RDG" } } } },
    decide = { proposal_id = MISSING, decision = "reject" },
    plan_schema = { declaration = { vocabularies = { { code = "probe" } } } },
    apply_schema = { declaration = {}, expected_generation = 9999 },
    rebuild = {}, update = { ui_app = "" },
}
M.REQUESTS = REQUESTS

local NEEDS: { [string]: integer } = {
    get_schema = READ, query = READ, get = READ, list_history = READ, list_links = READ, explain = READ, list_changes = READ,
    list_publications = READ, list_proposals = READ, get_release = READ, list_releases = READ, list_terms = READ, schema_options = READ, propose = READ,
    apply = WRITE, release = WRITE, withdraw = WRITE, decide = WRITE,
    plan_schema = ADMIN, apply_schema = ADMIN, rebuild = ADMIN, update = ADMIN,
}
M.NEEDS = NEEDS

local LEVELS: { Level } = {
    { name = "no grant", mask = 0, rank = 0 },
    { name = "READ", mask = READ, rank = READ },
    { name = "WRITE", mask = READ + WRITE, rank = WRITE },
    { name = "ADMIN", mask = READ + WRITE + ADMIN, rank = ADMIN },
}
M.LEVELS = LEVELS

-- ROUTES states each method's verb and path under a catalog. A GET carries its
-- request as query parameters.
local ROUTES: { [string]: { string } } = {
    get_schema = { "GET", "/schema" }, apply_schema = { "POST", "/schema" }, plan_schema = { "POST", "/schema/plan" },
    get = { "GET", "/product" }, query = { "POST", "/query" }, list_history = { "GET", "/history" }, apply = { "POST", "/apply" },
    propose = { "POST", "/proposals" }, list_proposals = { "GET", "/proposals" }, decide = { "POST", "/proposals/{proposal_id}/decision" },
    release = { "POST", "/releases" }, list_releases = { "GET", "/releases" }, get_release = { "GET", "/releases/{release_id}" }, list_terms = { "GET", "/terms" },
    schema_options = { "GET", "/schema/options" }, update = { "POST", "/settings" },
    withdraw = { "POST", "/withdrawals" }, rebuild = { "POST", "/rebuild" }, list_links = { "GET", "/links" },
    explain = { "GET", "/explain" }, list_changes = { "GET", "/changes" }, list_publications = { "GET", "/publications" },
}
M.ROUTES = ROUTES

-- methods lists the contract methods in a stable order.
function M.methods(): { string }
    local out: { string } = {}
    for m in pairs(REQUESTS) do out[#out + 1] = m end
    table.sort(out)
    return out
end

-- admitted checks successful behavior or the exact domain refusal for probes.
function M.admitted(method: string, out: unknown, err: error?)
    local codes = { get_release = "release_not_found", decide = "proposal_not_found", apply_schema = "schema_generation_conflict" }
    local code = codes[method]
    if code then
        test.is_nil(out, method)
        test.not_nil(err, method)
        test.eq(err:kind(), method == "apply_schema" and errors.CONFLICT or errors.NOT_FOUND, method)
        test.eq(err:details().code, code, method)
        return
    end
    test.is_nil(err, method .. ": " .. tostring(err))
    test.not_nil(out, method)
    local result = out :: Map
    local fields = { get_schema = "attributes", query = "items", get = "product", list_history = "entries", list_links = "items",
        explain = "resolution", list_changes = "items", list_publications = "items", list_proposals = "proposals",
        list_releases = "releases", list_terms = "terms", schema_options = "types", propose = "proposal_id", plan_schema = "class" }
    if fields[method] then test.not_nil(result[fields[method]], method) end
    if method == "get" then test.eq(result.product.sku, "RDG") end
    if method == "get_schema" then
        test.not_nil(result.attributes["core.name"])
        test.eq(result.families.footwear.item_level, 2)
    end
    if method == "query" or method == "list_changes" then
        test.eq(#result.items, 1, method)
        test.not_nil(result.items[1].product_id, method)
    end
    if method == "list_history" then test.eq(#result.entries, 1); test.is_true(result.entries[1].seq > 0) end
    if method == "list_links" or method == "list_publications" then test.eq(#result.items, 0, method) end
    if method == "list_releases" then test.eq(#result.releases, 0) end
    if method == "list_terms" then test.eq(#result.terms, 1); test.eq(result.terms[1].code, "clay") end
    if method == "explain" then test.eq(result.resolution.value, "Clean with a damp cloth.") end
    if method == "schema_options" then test.is_true(#result.types > 0) end
    if method == "propose" then test.eq(result.status, "pending") end
    if method == "plan_schema" then test.eq(result.class, "additive") end
    if method == "rebuild" then test.is_false(result.rebuilding) end
    if method == "apply" or method == "release" then test.eq(result.outcomes[1].outcome, "conflict", method) end
    if method == "withdraw" then test.eq(result.outcomes[1].outcome, "unchanged", method) end
end

return M
