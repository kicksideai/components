-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local json = require("json")
local registry = require("registry")
local fixture = require("fixture")
local scoped = require("scoped")
local access_cases = require("access_cases")
local scope_fixture = require("scope_fixture")
type Map = { [string]: unknown }
local ADMIN = 11
local grant, settle, owned = scope_fixture.grant, scope_fixture.settle, scope_fixture.owned
local function catalog(): fixture.Handle return (owned()) end
local function count(h: fixture.Handle): integer return #assert(h.call("query", {})).items end
local function head(h: fixture.Handle): integer
    local page = assert(h.call("events", {}))
    return page.events[#page.events].seq
end
local function rejected(reply: scoped.Reply)
    test.eq(reply.status, 403, json.encode(reply.body))
    test.eq(reply.body.kind, errors.PERMISSION_DENIED, json.encode(reply.body))
    test.is_nil(reply.body.retryable, json.encode(reply.body))
end

local function define()
    test.describe("the catalog thread", function()
        local AT = "2026-01-01T00:00:00Z"
        -- Only the catalog's commands append its events; each forgery is well formed.
        local function forgeries(h: fixture.Handle): { Map }
            local id = (assert(h.call("get", { product = { sku = "RDG" } })) :: Map).product.product_id
            local events = {
                { type = "kickside.pim.events:product.deleted", role = "user", body = { product_id = id, actor = "forged", at = AT } },
                { type = "kickside.pim.events:product.purged", role = "user", body = { product_id = id, actor = "forged", at = AT } },
                { type = "kickside.pim.events:product.created", role = "user", body = { product_id = "forged-id", sku = "FORGED", family = "footwear",
                    level = 0, is_item = false, patch = json.decode("[]"), actor = "forged", at = AT } },
            }
            for _, event in ipairs(events) do
                local schema = assert(registry.get(event.type)).data.schema
                local valid, err = json.validate(schema, event.body)
                test.is_true(valid, tostring(err))
            end
            return events
        end

        local function intact(h: fixture.Handle, before: integer, what: string)
            settle(h)
            test.eq(count(h), before, what)
            local got, gerr = h.call("get", { product = { sku = "RDG" } })
            test.is_nil(gerr, what .. ": " .. tostring(gerr))
            test.eq((got :: Map).product.sku, "RDG", what)
            local _, ferr = h.call("get", { product = { sku = "FORGED" } })
            test.not_nil(ferr, what)
        end

        local ROLES: { { name: string, mask: integer } } = {
            { name = "a stranger", mask = 0 }, { name = "a reader", mask = access_cases.READ },
            { name = "a writer", mask = access_cases.READ + access_cases.WRITE }, { name = "an administrator", mask = ADMIN },
        }
        for _, role in ipairs(ROLES) do
            test.it("refuses events posted by " .. role.name, function()
                local h = select(1, owned())
                local before, before_head = count(h), head(h)
                local caller = scoped.member()
                if role.mask > 0 then grant(h, caller, role.mask) end
                for _, event in ipairs(forgeries(h)) do
                    local reply = caller.api("POST", "/threads/" .. h.id .. "/events", event)
                    rejected(reply)
                    local batch = caller.api("POST", "/threads/" .. h.id .. "/events/batch", { events = { event } })
                    rejected(batch)
                end
                intact(h, before, role.name)
                test.eq(head(h), before_head)
            end)
        end

        test.it("refuses events posted by the owner", function()
            local h, owner = owned()
            local before, before_head = count(h), head(h)
            for _, event in ipairs(forgeries(h)) do
                local reply = owner.api("POST", "/threads/" .. h.id .. "/events", event)
                rejected(reply)
            end
            intact(h, before, "owner")
            test.eq(head(h), before_head)
        end)

        test.it("refuses messages posted to the catalog thread", function()
            local h, owner = owned()
            local before, before_head = count(h), head(h)
            local reply = owner.api("POST", "/threads/" .. h.id .. "/messages", { text = "hello" })
            rejected(reply)
            intact(h, before, "message")
            test.eq(head(h), before_head)
        end)

        for _, role in ipairs(ROLES) do
            if role.mask ~= ADMIN then
                test.it("enforces thread mutation permissions for " .. role.name, function()
                    local h = select(1, owned())
                    local before, before_head = count(h), head(h)
                    local caller = scoped.member()
                    if role.mask > 0 then grant(h, caller, role.mask) end
                    local delete = caller.api("DELETE", "/threads/" .. h.id, nil)
                    test.eq(delete.status, 403, json.encode(delete.body))
                    test.eq(delete.body.kind, errors.PERMISSION_DENIED)
                    local patch = caller.api("PATCH", "/threads/" .. h.id, { attrs = { title = "taken" } })
                    if role.mask == access_cases.READ + access_cases.WRITE then
                        test.eq(patch.status, 200, json.encode(patch.body))
                        test.is_true(patch.body.success)
                        test.eq(json.decode(patch.body.thread.attrs).title, "taken")
                    else
                        test.eq(patch.status, 403, json.encode(patch.body))
                        test.eq(patch.body.kind, errors.PERMISSION_DENIED)
                    end
                    if role.mask < access_cases.READ + access_cases.WRITE then
                        local retention = caller.api("PUT", "/threads/" .. h.id .. "/retention", {})
                        test.eq(retention.status, 403, json.encode(retention.body))
                        test.eq(retention.body.kind, errors.PERMISSION_DENIED)
                    end
                    intact(h, before, role.name)
                    test.eq(head(h), before_head)
                end)
            end
        end

        test.it("allows authorized thread changes and sharing through the same routes", function()
            local h, owner = owned()
            local reader = scoped.member()
            local shared = owner.api("POST", "/component-access/share/" .. h.id,
                { subject_id = reader.id, subject_type = "user", access_mask = access_cases.READ })
            test.eq(shared.status, 200, json.encode(shared.body))
            test.is_true(shared.body.success)
            test.eq(reader.api("GET", "/threads/" .. h.id, nil).status, 200)
            test.eq(reader.api("GET", "/threads/" .. h.id .. "/events", nil).status, 200)
            local patch = owner.api("PATCH", "/threads/" .. h.id, { attrs = { title = "Updated catalog" } })
            test.eq(patch.status, 200, json.encode(patch.body))
            test.is_true(patch.body.success)
            local writer = scoped.member()
            grant(h, writer, access_cases.READ + access_cases.WRITE)
            local retention = writer.api("PUT", "/threads/" .. h.id .. "/retention", {})
            test.eq(retention.status, 200, json.encode(retention.body))
            test.is_true(retention.body.success)
            local delete = owner.api("DELETE", "/threads/" .. h.id, nil)
            test.eq(delete.status, 202, json.encode(delete.body))
            test.is_true(delete.body.in_progress)
            test.eq(delete.body.status, "in_progress")
            test.is_true(delete.body.success)
        end)

        test.it("keeps a stranger from reading the thread and from sharing the catalog", function()
            local h = catalog()
            local stranger = scoped.member()
            test.eq(stranger.api("GET", "/threads/" .. h.id, nil).status, 404)
            test.eq(stranger.api("GET", "/threads/" .. h.id .. "/events", nil).status, 403)
            local share = stranger.api("POST", "/component-access/share/" .. h.id, { subject_id = stranger.id, subject_type = "user", access_mask = ADMIN })
            test.eq(share.status, 403, json.encode(share.body))
            test.eq(share.body.kind, errors.PERMISSION_DENIED)
            test.eq(stranger.http("POST", "/" .. h.id .. "/query", {}).status, 403)
        end)

        test.it("keeps a reader from raising its own access", function()
            local h = catalog()
            local reader = scoped.member()
            grant(h, reader, access_cases.READ)
            local share = reader.api("POST", "/component-access/share/" .. h.id, { subject_id = reader.id, subject_type = "user", access_mask = ADMIN })
            test.eq(share.status, 403, json.encode(share.body))
            test.eq(share.body.kind, errors.PERMISSION_DENIED)
            test.eq(reader.invoke(h.id, "apply_schema", { declaration = {}, expected_generation = 9999 }).status, 403)
        end)
    end)

end
return { run = test.run_cases(define) }
