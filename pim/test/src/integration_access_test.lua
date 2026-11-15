-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local access_cases = require("access_cases")
local fixture = require("fixture")
local steps = require("steps")
local http_client = require("http_client")
local json = require("json")
local scoped = require("scoped")

local READ = 1

local catalog_fixture = require("catalog_fixture")
local kind = catalog_fixture.kind

local function define()
    test.describe("caller access on read surfaces", function()
        for _, level in ipairs({
            { name = "reader", mask = 1, write = false, admin = false },
            { name = "writer", mask = 3, write = true, admin = false },
            { name = "admin", mask = 11, write = true, admin = true },
            { name = "admin without write", mask = 9, write = false, admin = true },
            { name = "no grant", mask = 0, write = false, admin = false },
        }) do
            test.it("reports independent ambient grants for " .. level.name .. " over HTTP and contract", function()
                local owner = scoped.member()
                local h = scoped.catalog(owner)
                local caller = scoped.member()
                if level.mask ~= 0 then
                    local _, err = h.call("grant", { subject_id = caller.id, mask = level.mask })
                    test.is_nil(err, tostring(err))
                end
                local reply = caller.http("GET", "")
                test.eq(reply.status, 200, json.encode(reply.body))
                local contract_list, list_err = caller.call("list", {})
                test.is_nil(list_err, tostring(list_err))
                for _, listed in ipairs({ reply.body.data, contract_list }) do
                    local found = nil
                    for _, row in ipairs(listed.catalogs) do
                        if row.catalog_id == h.id then found = row end
                    end
                    if level.mask == 0 then test.is_nil(found)
                    else
                        test.not_nil(found)
                        test.not_nil(found.access)
                        test.eq(found.access.read, true)
                        test.eq(found.access.write, level.write)
                        test.eq(found.access.admin, level.admin)
                    end
                end
                local schema_reply = caller.invoke(h.id, "get_schema", {})
                local view, schema_err = caller.call("get_schema", {}, h.id)
                if level.mask == 0 then
                    test.eq(schema_reply.status, 403)
                    test.is_nil(schema_reply.body.data)
                    test.is_nil(view)
                    test.eq(schema_err:kind(), errors.PERMISSION_DENIED)
                else
                    test.eq(schema_reply.status, 200, json.encode(schema_reply.body))
                    test.is_nil(schema_err, tostring(schema_err))
                    for _, surface in ipairs({ schema_reply.body.data, view }) do
                        test.not_nil(surface.access)
                        test.eq(surface.access.read, true)
                        test.eq(surface.access.write, level.write)
                        test.eq(surface.access.admin, level.admin)
                    end
                end
            end)
        end
    end)

    test.describe("callers without identity", function()
        for _, op in ipairs({ "get", "query", "apply", "apply_schema", "propose", "list_changes" }) do
            test.it("refuses " .. op .. " without an actor", function()
                local h = fixture.catalog()
                local before = fixture.events(h)
                local method, path, body = scoped.route(h.id, op, access_cases.REQUESTS[op])
                local response, err = http_client.request(method, scoped.base_url() .. path, {
                    body = body and json.encode(body) or "", headers = { ["Content-Type"] = "application/json" },
                })
                test.is_nil(err, tostring(err))
                test.eq(response.status_code, 401, op .. ": " .. tostring(response.body))
                local after = fixture.events(h)
                test.eq(#after, #before, op)
                test.eq(after[#after].seq, before[#before].seq, op)
            end)
        end
    end)

    test.describe("publications source", function()
        test.it("denies pull to an outsider", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local out, err = fixture.user(h)("pull", { config = { channel = "web" } })
            test.is_nil(err, tostring(err))
            test.is_false(out.success)
            test.eq(out.error.details.kind, errors.PERMISSION_DENIED)
            test.eq(out.error.code, "permission_denied")
            test.is_false(out.error.retriable)
        end)

        test.it("serves pull to a reader", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local call, id = fixture.user(h)
            h.call("grant", { subject_id = id, mask = READ })
            local out, err = call("pull", { config = { channel = "web" } })
            test.is_nil(err)
            test.eq(out.success, true)
        end)

        test.it("refuses an oversized page", function()
            local h = fixture.catalog()
            local out = h.call("pull", { config = { channel = "web" }, limit = 501 })
            test.eq(out.success, false)
            test.eq(out.error.code, "invalid_config")
        end)

        test.it("advances its cursor past a withdrawal", function()
            local h = fixture.catalog()
            fixture.boot(h)
            h.call("release", { items = { { product = { sku = "RDG-moss-40" }, expect_version = steps.version(h, "RDG-moss-40"), channels = { "web" } } } })
            local first = h.call("pull", { config = { channel = "web" } })
            h.call("withdraw", { items = { { product = { sku = "RDG-moss-40" } } } })
            local second = h.call("pull", { config = { channel = "web" }, cursor = first.next_cursor })
            test.eq(#second.items, 1)
            test.eq(second.items[1].op, "delete")
            test.eq(#h.call("pull", { config = { channel = "web" }, cursor = second.next_cursor }).items, 0)
        end)
    end)

    test.describe("command bounds", function()
        test.it("bounds the sku length", function()
            local h = fixture.catalog()
            test.eq(steps.one(h, { product = { sku = string.rep("s", 129) }, create = {} }).outcome, "invalid")
            test.eq(steps.one(h, { product = { sku = string.rep("s", 128) }, create = {} }).outcome, "created")
        end)

        test.it("bounds the document size", function()
            local h = fixture.catalog()
            test.eq(steps.one(h, { product = { sku = "BIG" }, create = {}, set = { { attr = "core.care", value = string.rep("x", 300000) } } }).outcome, "invalid")
        end)

        test.it("applies nothing of an atomic command with one bad item", function()
            local h = fixture.catalog()
            local out = h.call("apply", { items = { { product = { sku = "OK1" }, create = {} }, { product = { sku = "" }, create = {} } } })
            test.is_false(out.applied)
            local _, err = steps.get(h, "OK1")
            test.eq(kind(err), errors.NOT_FOUND)
        end)

        test.it("keeps the good items of an independent command", function()
            local h = fixture.catalog()
            local out = h.call("apply", { mode = "independent", items = { { product = { sku = "OK1" }, create = {} }, { product = { sku = "" }, create = {} } } })
            test.is_true(out.applied)
            test.eq(assert(steps.get(h, "OK1")).product.version, 1)
        end)

        test.it("needs a version for an edit unless any is named", function()
            local h = fixture.catalog()
            fixture.boot(h)
            test.eq(steps.one(h, { product = { sku = "RDG" }, set = { { attr = "core.care", value = "a" } } }).outcome, "invalid")
            test.eq(steps.one(h, { product = { sku = "RDG" }, expect_version = "latest", set = { { attr = "core.care", value = "a" } } }).outcome, "invalid")
            test.eq(assert(steps.get(h, "RDG")).product.version, 1)
            test.eq(steps.one(h, { product = { sku = "RDG" }, expect_version = "any", set = { { attr = "core.care", value = "a" } } }).outcome, "updated")
        end)
    end)


end

return { run = test.run_cases(define) }
