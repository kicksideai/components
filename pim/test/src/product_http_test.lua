-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local json = require("json")
local scoped = require("scoped")

type Map = { [string]: unknown }

local function data(reply: scoped.Reply): Map
    assert(reply.status == 200, "expected HTTP 200, got " .. reply.status .. ": " .. json.encode(reply.body))
    return assert(reply.body.data) :: Map
end

local function define()
    test.describe("product HTTP", function()
        test.it("rejects a stale draft after an attribute code is reused", function()
            local owner = scoped.member()
            local h = scoped.catalog(owner)
            local function change(attribute: Map): Map
                return data(owner.invoke(h.id, "apply_schema", {
                    declaration = { aspects = { { namespace = "core", attributes = { attribute } } } },
                }))
            end
            local function get(id: string): Map
                return data(owner.invoke(h.id, "get", { product = { id = id } }))
            end
            change({ code = "draft_note", type = "kickside.pim.types:text" })
            local created = data(owner.invoke(h.id, "apply", { items = { {
                product = { sku = "DRAFT" }, create = {}, set = { { attr = "core.draft_note", value = "original" } },
            } } }))
            test.eq(created.outcomes[1].outcome, "created")
            local id = created.outcomes[1].product_id :: string
            local draft = get(id)
            local old = data(owner.invoke(h.id, "get_schema", {}))
            local old_id = old.attributes["core.draft_note"].id
            test.eq(draft.generation, old.schema_generation)

            change({ id = old_id, code = "renamed_note", type = "kickside.pim.types:text" })
            local current = change({ code = "draft_note", type = "kickside.pim.types:text" })
            local schema = data(owner.invoke(h.id, "get_schema", {}))
            test.eq(schema.attributes["core.renamed_note"].id, old_id)
            test.is_false(schema.attributes["core.draft_note"].id == old_id)
            test.eq(get(id).product.version, draft.product.version)

            local request: Map = {
                expected_generation = draft.generation,
                items = { { product = { id = id }, expect_version = draft.product.version,
                    set = { { attr = "core.draft_note", value = "stale draft" } } } },
            }
            local reply = owner.invoke(h.id, "apply", request)
            test.eq(reply.status, 409, json.encode(reply.body))
            test.eq(reply.body.details.code, "schema_generation_conflict")
            test.eq(reply.body.details.expected_generation, draft.generation)
            test.eq(reply.body.details.generation, current.generation)
            local after = get(id)
            test.eq(after.product.version, draft.product.version)
            test.eq(after.values["core.draft_note"].state, "absent")
            test.eq(after.values["core.renamed_note"].value, "original")

            request.expected_generation = current.generation
            test.eq(data(owner.invoke(h.id, "apply", request)).outcomes[1].outcome, "updated")
            test.eq(get(id).values["core.draft_note"].value, "stale draft")
        end)

        test.it("gives immutable ID precedence on product reads", function()
            local owner = scoped.member()
            local h = scoped.catalog(owner)
            local created = data(owner.invoke(h.id, "apply", { items = {
                { product = { sku = "Z-SKU" }, create = {} },
                { product = { sku = "A-SKU" }, create = {} },
            } }))
            local id = created.outcomes[1].product_id
            local product = data(owner.http("GET", "/" .. h.id .. "/product?id=" .. id .. "&sku=A-SKU"))
            test.eq(product.product.product_id, id)
            local history = data(owner.http("GET", "/" .. h.id .. "/history?id=" .. id .. "&sku=A-SKU"))
            test.eq(history.entries[1].subject, "p:" .. id)
            for _, path in ipairs({ "/product", "/history" }) do
                local missing = owner.http("GET", "/" .. h.id .. path .. "?id=missing&sku=A-SKU")
                test.eq(missing.status, 404)
            end
        end)

        test.it("refuses an unknown channel in the publication filter", function()
            local owner = scoped.member()
            local h = scoped.catalog(owner)
            local reply = owner.invoke(h.id, "query", { published = { channel = "not-a-channel" } })
            test.eq(reply.status, 400, json.encode(reply.body))
            test.eq(reply.body.details.code, "unknown_channel")
        end)
    end)
end

return { run = test.run_cases(define) }
