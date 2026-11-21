-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Real scopes: members and outsiders hold exactly what an installation composes,
-- through the HTTP endpoints and through the catalog contract.
local test = require("test")
local json = require("json")
local http_client = require("http_client")
local fixture = require("fixture")
local scoped = require("scoped")
local access_cases = require("access_cases")
local store = require("store")
local steps = require("steps")
local types = require("types")

type Map = { [string]: unknown }

local READ = access_cases.READ
local ADMIN = access_cases.READ + access_cases.WRITE + access_cases.ADMIN

local scope_fixture = require("scope_fixture")
local data, denied, grant, settle, owned = scope_fixture.data, scope_fixture.denied, scope_fixture.grant, scope_fixture.settle, scope_fixture.owned

local shared: fixture.Handle? = nil
local function catalog(): fixture.Handle
    if shared then return shared :: fixture.Handle end
    shared = (owned())
    return shared :: fixture.Handle
end

local function count(h: fixture.Handle): integer
    local out, err = h.call("query", {})
    assert(not err, tostring(err))
    return #((out :: Map).items :: { Map })
end

local function define()
    test.describe("members through the endpoints", function()
        test.it("keeps a stored term set when HTTP sends a non-array replacement", function()
            local owner = scoped.member()
            local h = scoped.catalog(owner)
            fixture.boot(h)
            local reply = owner.invoke(h.id, "apply", { mode = "independent", items = {
                { product = { sku = "RDG-moss" }, expect_version = 1, set = {
                    { attr = "core.materials", value = { code = "nylon" } },
                } },
                { product = { sku = "RDG-slate-40" }, expect_version = 1, status = "draft" },
            } })
            test.eq(reply.status, 200, json.encode(reply.body))
            local out = reply.body.data :: types.ApplyResult
            test.eq(out.outcomes[2].outcome, "updated")
            local got = assert(steps.get(h, "RDG-moss")).values["core.materials"].value :: { types.Ref }
            test.eq(#got, 2, "malformed term set outcome was " .. out.outcomes[1].outcome)
            test.eq(out.outcomes[1].outcome, "invalid")
        end)

        test.it("create a catalog, write through the projection and read back", function()
            local owner = scoped.member()
            local created = data(owner.http("POST", "", { idempotency_key = owner.id, title = "HTTP catalog", declaration = fixture.DECLARATION }), "create")
            local path = "/" .. (created.catalog_id :: string)
            data(owner.http("POST", path .. "/apply", { items = { { term = { vocabulary = "categories", code = "footwear" }, labels = { en = "Footwear" } } } }), "term")
            local applied = data(owner.http("POST", path .. "/apply", { items = { { product = { sku = "P" }, create = { family = "footwear" },
                set = { { attr = "core.name", ctx = { locale = "en" }, value = "Boot" } } } } }), "apply")
            test.is_true(applied.applied == true)
            local _, serr = owner.call("settle", {}, created.catalog_id :: string)
            test.is_nil(serr, tostring(serr))
            test.is_true(#(data(owner.invoke(created.catalog_id :: string, "list_history", {}), "list_history").entries :: { Map }) > 0)
            local got = data(owner.invoke(created.catalog_id :: string, "get", { product = { sku = "P" } }), "get")
            test.eq((got.product :: Map).sku, "P")
        end)

        for _, method in ipairs(access_cases.methods()) do
            for _, level in ipairs(access_cases.LEVELS) do
                local admitted = level.rank >= access_cases.NEEDS[method]
                test.it(method .. " under " .. level.name .. (admitted and " answers past the ACL" or " answers 403"), function()
                    local h = catalog()
                    local caller = scoped.member()
                    if level.mask > 0 then grant(h, caller, level.mask) end
                    local reply = caller.invoke(h.id, method, access_cases.REQUESTS[method])
                    if admitted then
                        local codes = { get_release = "release_not_found", get_model_release = "model_release_absent",
                            decide = "proposal_not_found", apply_schema = "schema_generation_conflict" }
                        local code = codes[method]
                        if code then
                            test.eq(reply.status, method == "apply_schema" and 409 or 404, method .. " " .. json.encode(reply.body))
                            test.eq((reply.body.details :: Map).code, code, method)
                            test.eq(reply.body.kind, method == "apply_schema" and errors.CONFLICT or errors.NOT_FOUND, method)
                        else
                            access_cases.admitted(method, data(reply, method), nil)
                        end
                    else
                        test.eq(reply.status, 403, method .. " " .. json.encode(reply.body))
                    end
                end)
            end
        end

        test.it("lists only the catalogs the member reads", function()
            local h = catalog()
            local caller = scoped.member()
            local function listed(): boolean
                for _, c in ipairs(data(caller.http("GET", "", nil), "list").catalogs :: { Map }) do
                    if c.catalog_id == h.id then return true end
                end
                return false
            end
            test.is_false(listed())
            grant(h, caller, READ)
            test.is_true(listed())
        end)

        test.it("takes the catalog from the path over the body", function()
            local h, other = catalog(), scoped.catalog(scoped.member())
            local caller = scoped.member()
            grant(other, caller, READ)
            test.eq(caller.http("POST", "/" .. h.id .. "/query", { catalog_id = other.id }).status, 403)
            test.eq(caller.http("POST", "/" .. other.id .. "/query", { catalog_id = h.id }).status, 200)
        end)
    end)

    test.describe("status codes", function()
        local function path(h: fixture.Handle, method: string): string return "/" .. h.id .. "/" .. method end

        test.it("answers 401 without a valid credential", function()
            local h = catalog()
            local res, err = http_client.request("POST", scoped.base_url() .. path(h, "query"),
                { body = "{}", headers = { ["Content-Type"] = "application/json", Authorization = "Bearer not-a-token" } })
            test.is_nil(err)
            test.eq(res.status_code, 401)
        end)

        test.it("answers 400 to malformed bodies and requests", function()
            local h = catalog()
            local reader = (select(2, owned()))
            grant(h, reader, READ)
            local q = path(h, "query")
            test.eq(reader.raw("POST", q, "{not json").status, 400)
            test.eq(reader.raw("POST", q, "7").status, 400)
            test.eq(reader.raw("POST", q, "\"text\"").status, 400)
            test.eq(reader.raw("POST", q, "[1]").status, 400)
            test.eq(reader.http("POST", q, { limit = "ten" }).status, 400)
            test.eq(reader.http("POST", q, { sort = { field = "core.size", dir = "sideways" } }).status, 400)
            test.eq(reader.http("POST", q, { where = { ["and"] = {} } }).status, 400)
            test.eq(reader.http("POST", q, { where = { field = "core.size", op = "like", value = 1 } }).status, 400)
            test.eq(reader.http("POST", q, { where = { ["not"] = { field = "core.size", op = "eq", value = 40 } } }).status, 200)
            test.eq(reader.invoke(h.id, "get", {}).status, 400)
        end)

        test.it("serializes local HTTP validation failures with native kind and code", function()
            local h, owner = owned()
            local replies = {
                owner.raw("POST", "/" .. h.id .. "/query", "{bad"),
                owner.raw("GET", "/" .. h.id .. "/terms?vocabulary=colors&retired=maybe", ""),
                owner.raw("GET", "/" .. h.id .. "/publications?channel=web&after=broken", ""),
                owner.raw("GET", "/" .. h.id .. "/publications?channel=web&limit=bad", ""),
            }
            for _, reply in ipairs(replies) do
                test.eq(reply.status, 400, json.encode(reply.body))
                test.eq(reply.body.kind, errors.INVALID, json.encode(reply.body))
                test.not_nil((reply.body.details :: Map).code)
            end
        end)

        test.it("accepts an empty body as an empty request", function()
            local h = catalog()
            local reader = scoped.member()
            grant(h, reader, READ)
            test.eq(reader.raw("POST", path(h, "query"), "").status, 200)
        end)

        test.it("answers 404 to unknown methods and products", function()
            local h = catalog()
            local reader = scoped.member()
            grant(h, reader, READ)
            test.eq(reader.http("POST", path(h, "drop_everything"), {}).status, 404)
            test.eq(reader.invoke(h.id, "get", { product = { sku = "NOPE" } }).status, 404)
            test.eq(reader.invoke(h.id, "get_release", { release_id = access_cases.MISSING }).status, 404)
        end)

        test.it("answers 409 to a stale schema generation", function()
            local h = catalog()
            local admin = scoped.member()
            grant(h, admin, ADMIN)
            test.eq(admin.invoke(h.id, "apply_schema", { declaration = {}, expected_generation = 9999 }).status, 409)
        end)

        test.it("answers 400 when an adopted scope's table is missing", function()
            local h = catalog()
            local admin = scoped.member()
            grant(h, admin, ADMIN)
            data(admin.invoke(h.id, "apply_schema", { declaration = { scopes = { "app:ghost_scope" } } }), "adopt")
            local reply = admin.http("POST", path(h, "query"), { scopes = { { id = "app:ghost_scope", where = { available = { gt = 0 } } } } })
            test.eq(reply.status, 400, json.encode(reply.body))
        end)

        test.it("hides every catalog from a caller without access alike", function()
            local h = catalog()
            local stranger = scoped.member()
            local real = stranger.http("POST", path(h, "query"), {})
            local missing = stranger.http("POST", "/" .. access_cases.MISSING .. "/query", {})
            test.eq(real.status, 403)
            test.eq(missing.status, real.status)
            test.eq(tostring(missing.body.error), tostring(real.body.error))
            test.eq(real.body.kind, errors.PERMISSION_DENIED)
            test.eq(missing.body.kind, errors.PERMISSION_DENIED)
            test.not_nil(real.body.details)
            test.not_nil((real.body.details :: Map).code)
            test.eq((missing.body.details :: Map).code, (real.body.details :: Map).code)
        end)
    end)

    test.describe("discovery", function()
        test.it("shows PIM's declarations to members and hides them from outsiders", function()
            local member, outsider = scoped.member(), scoped.outsider()
            for _, id in ipairs({ "kickside.pim.binding:catalog", "kickside.pim.types:text", "kickside.pim.ports:product_created", "kickside.pim:catalog" }) do
                test.eq(member.scope:evaluate(member.actor, "registry.get", id), "allow", id)
                test.is_false(outsider.scope:evaluate(outsider.actor, "registry.get", id) == "allow", id)
            end
        end)
    end)

    test.describe("outsiders", function()
        test.it("get 403 from every endpoint", function()
            local h = catalog()
            local outsider = scoped.outsider()
            grant(h, outsider, ADMIN)
            test.eq(outsider.http("GET", "", nil).status, 403)
            test.eq(outsider.http("POST", "", { idempotency_key = "x", title = "x" }).status, 403)
            for _, method in ipairs(access_cases.methods()) do
                test.eq(outsider.invoke(h.id, method, access_cases.REQUESTS[method]).status, 403, method)
            end
        end)

        test.it("are refused at the contract even with catalog access", function()
            local h = catalog()
            local outsider = scoped.outsider()
            grant(h, outsider, ADMIN)
            local _, create = outsider.call("create", { idempotency_key = "x", title = "x" })
            denied(create, "outsider create")
            for _, method in ipairs(access_cases.methods()) do
                local _, err = outsider.call(method, access_cases.REQUESTS[method], h.id)
                denied(err, "outsider " .. method)
            end
        end)
    end)

    test.describe("workers under their declared identities", function()
        test.it("fold and publish a member's catalog", function()
            local h = select(1, owned())
            test.is_true(count(h) > 0)
            local listed, err = h.call("list", {})
            test.is_nil(err, tostring(err))
            local found: Map? = nil
            for _, c in ipairs((listed :: Map).catalogs :: { Map }) do
                if c.catalog_id == h.id then found = c end
            end
            test.not_nil(found)
        end)

        test.it("rebuild a member's catalog", function()
            local h = select(1, owned())
            local before = count(h)
            local changed, change_err = h.call("apply_schema", { declaration = { aspects = { { namespace = "core", attributes = {
                { code = "care", type = "kickside.pim.types:text", default = "Member rebuild value", index = "key" } } } } } })
            test.is_nil(change_err)
            test.eq(changed.class, "semantic")
            local _, err = h.call("rebuild", {})
            test.is_nil(err, tostring(err))
            steps.rebuilt(h)
            test.eq(count(h), before)
            test.eq(assert(steps.get(h, "RDG-moss-40")).values["core.care"].value, "Member rebuild value")
            test.eq(#assert(h.call("query", { where = { field = "core.care", op = "eq", value = "Member rebuild value" } })).items, 6)
        end)

        test.it("run the retention owner on its own authority", function()
            local h = select(1, owned())
            local id = assert(steps.get(h, "RDG-moss-40")).product.product_id
            test.is_true(steps.one(h, { product = { id = id }, expect_version = "any", delete = true }).trashed)
            local db = assert(store.open())
            assert(db:execute("UPDATE kickside_pim_product SET state_at = $1 WHERE catalog_id = $2 AND product_id = $3", { "2000-01-01T00:00:00Z", h.id, id }))
            db:release()
            local out, err = fixture.retain()
            test.is_nil(err, tostring(err))
            test.is_true((out :: Map).success == true, tostring(out.error))
            settle(h)
            local read = assert(store.open())
            local product = assert(store.product(read, h.id, id))
            read:release()
            test.eq(product.state, "purged")
            local events = fixture.events(h)
            local found = false
            for _, event in ipairs(events) do
                if event.type == "kickside.pim.events:product.purged" and event.body.product_id == id then
                    test.eq(event.body.actor, "system:kickside.pim.retention")
                    found = true
                end
            end
            test.is_true(found)
        end)

        local function with_check(check: string): Map
            local family = json.decode(json.encode(fixture.DECLARATION.families[1])) :: Map
            family.checks = { { check = check, reads = { "logistics.net_weight" }, config = { max = 0.741 } } }
            return { declaration = { families = { family } } }
        end

        test.it("run a plugin check under the owner's identity", function()
            local h = select(1, owned())
            local _, err = h.call("apply_schema", with_check("app:weight_check"))
            test.is_nil(err, tostring(err))
            steps.rebuilt(h)
            test.eq(#((assert(h.call("query", { ready = { set = "web", value = true } })) :: Map).items :: { Map }), 4)
            local view = assert(h.call("get", { product = { sku = "RDG-moss-42" } })) :: Map
            test.eq((view.readiness :: Map).web[1].code, "too_heavy")
        end)

        test.it("run a rebuild's plugin checks under the owner's identity", function()
            local h, owner = owned()
            local _, err = h.call("apply_schema", with_check("app:actor_check"))
            test.is_nil(err, tostring(err))
            steps.rebuilt(h)
            local view = assert(h.call("get", { product = { sku = "RDG-moss-42" } })) :: Map
            test.eq((view.readiness :: Map).web[1].code, owner.id)
        end)

        test.it("refuses a check whose module grants its users nothing", function()
            local h = select(1, owned())
            local _, err = h.call("apply_schema", with_check("app:raising_check"))
            test.not_nil(err)
        end)

        test.it("serve an adopted scope to a member and a reader", function()
            local h, owner = owned()
            local _, aerr = h.call("apply_schema", { declaration = { scopes = { "app:stock_scope" } } })
            test.is_nil(aerr, tostring(aerr))
            local db = assert(store.open())
            local _, cerr = db:execute([[CREATE TABLE IF NOT EXISTS pim_test_stock (catalog_id TEXT NOT NULL, product_id TEXT NOT NULL, location_id TEXT NOT NULL,
                available INTEGER NOT NULL)]], {})
            db:release()
            assert(not cerr, tostring(cerr))
            local request = { scopes = { { id = "app:stock_scope", where = { available = { gt = 0 } } } } }
            local reader = scoped.member()
            grant(h, reader, READ)
            test.eq(owner.http("POST", "/" .. h.id .. "/query", request).status, 200)
            test.eq(reader.http("POST", "/" .. h.id .. "/query", request).status, 200)
        end)

        test.it("serve a member's portable export", function()
            local h = select(1, owned())
            local path = "scoped-" .. h.id
            local _, eerr = h.call("portable", { method = "export", args = { storage_id = "app:exports", path = path } })
            test.is_nil(eerr, tostring(eerr))
        end)

        test.it("imports a member's schema and items with producer authority", function()
            local src = select(1, owned())
            local path = "scoped-import-" .. src.id
            local exported, eerr = src.call("portable", { method = "export", args = { storage_id = "app:exports", path = path } })
            test.is_nil(eerr, tostring(eerr))
            test.is_true(exported.success, json.encode(exported))
            local dst = scoped.catalog(scoped.member())
            local imported, ierr = dst.call("portable", { method = "import_into", args = { storage_id = "app:exports", path = path } })
            test.is_nil(ierr, tostring(ierr))
            test.is_true(imported.success, json.encode(imported))
            test.eq(count(dst), count(src))
        end)

        test.it("serve the sink and the source to a member", function()
            local h = select(1, owned())
            local sunk, serr = h.call("sink", { sink_op = "upsert", origin = "automation:scoped", idempotency_key = "member-write",
                input = { sku = "SCOPED-SINK" }, config = { source = "erp" } })
            test.is_nil(serr, tostring(serr))
            test.is_true(sunk.success, json.encode(sunk))
            test.eq(sunk.result, "created")
            test.eq(assert(steps.get(h, "SCOPED-SINK")).product.product_id, sunk.dest_ref.product_id)
            local released, rerr = h.call("release", { items = { { product = { sku = "RDG-moss-40" }, expect_version = 1, channels = { "web" } } } })
            test.is_nil(rerr, tostring(rerr))
            test.eq(released.outcomes[1].outcome, "released")
            local pulled, perr = h.call("pull", { config = { channel = "web" }, limit = 1 })
            test.is_nil(perr, tostring(perr))
            test.is_true(pulled.success, json.encode(pulled))
            test.eq(#pulled.items, 1)
            test.eq(pulled.items[1].item_key, released.outcomes[1].product_id)
            test.eq(pulled.items[1].op, "upsert")
            test.eq(pulled.items[1].payload.release_id, released.outcomes[1].release_id)
            test.eq(pulled.items[1].dedup_key, "web:" .. released.outcomes[1].product_id .. ":" .. released.seq)
            test.eq(pulled.items[1].source_version, string.format("%020d", released.seq))
        end)
    end)
end

return { run = test.run_cases(define) }
