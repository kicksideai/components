-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local consts = require("consts")
local json = require("json")
local types = require("types")
local sql = require("sql")
local fixture = require("fixture")
local requests = require("requests")
local steps = require("steps")
local store = require("store")
local registry = require("registry")
local time = require("time")
local summary_component = require("summary_component")
local summary_locate = require("summary_locate")

type Map = { [string]: unknown }

local METHODS = { "create", "list", "update", "get_schema", "plan_schema", "apply_schema", "get", "query", "list_history", "apply", "propose",
    "decide", "list_proposals", "release", "withdraw", "rebuild",
    "list_links", "explain", "list_changes", "list_publications", "get_release", "get_model_release", "wait_for_product",
    "list_releases", "list_terms", "schema_options" }

local function define()
    test.describe("request parsing", function()
        test.it("answers every method in the shape its contract declares", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local sku = "RDG-moss-40"
            local version = steps.version(h, sku)
            local function shaped(method: string, request: Map): Map
                local out, err = h.call(method, request)
                test.is_nil(err, method .. ": " .. tostring(err))
                test.is_nil(requests.check_output(method, out), method)
                return out :: Map
            end
            shaped("list", {})
            shaped("update", { ui_app = "" })
            shaped("get_schema", {})
            shaped("plan_schema", { declaration = { vocabularies = { { code = "probe" } } } })
            shaped("apply_schema", { declaration = { vocabularies = { { code = "probe" } } } })
            shaped("get", { product = { sku = sku } })
            shaped("query", { limit = 1, count = true })
            shaped("explain", { product = { sku = sku }, attr = "core.care" })
            local proposed = shaped("propose", { items = { { product = { sku = sku }, set = { { attr = "core.gtin", value = "proposed-shape" } } } } })
            shaped("list_proposals", {})
            shaped("decide", { proposal_id = proposed.proposal_id, decision = "reject" })
            shaped("apply", { items = { { product = { sku = sku }, expect_version = version, set = { { attr = "core.gtin", value = "shape" } } } } })
            shaped("list_history", {})
            shaped("list_terms", { vocabulary = "colors", limit = 2 })
            local options = shaped("schema_options", {})
            local type_ids: { [string]: Map } = {}
            for _, t in ipairs(options.types :: { Map }) do type_ids[t.id :: string] = t end
            test.eq(assert(type_ids["kickside.pim.types:text"]).form, "text")
            test.eq(#(assert(type_ids["kickside.pim.types:quantity"]).indexes :: { string }), 3)
            test.is_true(type(assert(type_ids["app:formless_type"]).problem) == "string", "a refused type declaration is listed with its problem")
            local scope_ids: { [string]: boolean } = {}
            for _, s in ipairs(options.scopes :: { Map }) do scope_ids[s.id :: string] = true end
            test.is_true(scope_ids["app:stock_scope"] == true, "harness scope listed")
            local plugin_ids: { [string]: Map } = {}
            for _, p in ipairs(options.plugins :: { Map }) do plugin_ids[p.plugin :: string] = p end
            test.eq(assert(plugin_ids["app:zones_plugin"]).installed, true)
            test.eq(plugin_ids["app:zones_plugin"].active, false)
            test.not_nil(plugin_ids["app:zones_plugin"].config_schema)
            test.is_true(#(options.link_kinds :: { Map }) >= 1, "a bound link kind is listed")
            shaped("list_changes", {})
            shaped("list_links", { kind = "product", target = "none" })
            shaped("list_publications", { channel = "web" })
            shaped("rebuild", {})
            local released = shaped("release", { items = { { product = { sku = sku }, expect_version = steps.version(h, sku) } } })
            local outcome = (released.outcomes :: { Map })[1]
            test.not_nil(outcome.release_id, tostring(outcome.outcome))
            shaped("get_release", { release_id = outcome.release_id })
            local matched = shaped("wait_for_product", { product = { sku = sku }, predicate = { status = "active" } })
            test.eq(matched.status, "matched")
            local timed = shaped("wait_for_product", { product = { sku = sku }, predicate = { status = "archived" },
                cursor = matched.cursor, timeout_ms = 100 })
            test.eq(timed.status, "timed_out")
            test.is_nil(timed.product)
            shaped("list_releases", { product = { sku = sku } })
            shaped("withdraw", { items = { { product = { sku = sku } } } })
            local queued = shaped("release", { items = { { product = { sku = "RDG" }, expect_version = steps.version(h, "RDG") } } })
            local intent = (queued.outcomes :: { Map })[1]
            test.eq(intent.outcome, "queued")
            test.eq(shaped("get_model_release", { request_id = intent.request_id }).job_id, intent.job_id)
        end)

        test.it("carries the caller's trace context onto the events it appends", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local trace = { trace_id = "trace-1", run_id = "run-1", correlation_key = "corr-1" }
            local out, err = h.call("apply", { trace_context = trace, items = { { product = { sku = "RDG" }, expect_version = steps.version(h, "RDG"), status = "draft" } } })
            test.is_nil(err)
            local db = assert(store.open())
            local rows = assert(db:query("SELECT trace_id, run_id, correlation_key FROM kickside_event WHERE thread_id = $1 AND seq = $2", { h.id, out.seq }))
            db:release()
            test.eq(rows[1].trace_id, "trace-1")
            test.eq(rows[1].run_id, "run-1")
            test.eq(rows[1].correlation_key, "corr-1")
            local _, refused = h.call("apply", { trace_context = { trace_id = "t", other = "x" }, items = {} })
            test.not_nil(refused)
            test.eq((refused :: error):kind(), errors.INVALID)
        end)

        test.it("refuses requests that do not match the method's input schema before running them", function()
            local h = fixture.catalog()
            fixture.boot(h)
            for _, case in ipairs({
                { "get", { product = "RDG" } },
                { "get", { product = { sku = "RDG" }, context = "en" } },
                { "apply", { items = "RDG" } },
                { "apply", { items = { { product = { sku = "RDG" }, expect_version = "any", set = { { value = 1 } } } } }, "item" },
                { "list_history", { limit = "ten" } },
                { "get_schema", { generation = "first" } },
                { "release", { items = { { product = { sku = 5 } } } } },
                { "decide", { proposal_id = 5, decision = "accept" } },
                { "query", { limit = 1.5 } },
                { "get_model_release", { request_id = "" } },
                { "wait_for_product", { product = { sku = "RDG" }, predicate = { status = "active", complete = { locale = "en" } } } },
                { "wait_for_product", { product = { sku = "RDG" }, predicate = { complete = { locale = "en", channel = "web" } } } },
                { "wait_for_product", { product = { sku = "RDG" }, predicate = { status = "active" }, timeout_ms = 60001 } },
            } :: { { unknown } }) do
                local op = case[1] :: string
                local out, err = h.call(op, case[2])
                if case[3] == "item" then
                    test.is_nil(err, tostring(err))
                    test.eq(out.outcomes[1].outcome, "invalid")
                    test.eq(assert(h.call("get", { product = { sku = "RDG" } })).product.version, 1)
                else
                    test.not_nil(err, op)
                    test.eq((err :: error):kind(), errors.INVALID, op .. ": " .. tostring(err))
                end
            end
            for _, method in ipairs(METHODS) do
                local _, err = h.call(method, { unexpected = 1 })
                test.not_nil(err, method)
                test.eq((err :: error):kind(), errors.INVALID, method .. ": " .. tostring(err))
            end
            local version = 1
            for _, case in ipairs({
                { "apply", { items = { { product = { sku = "RDG" }, expect_verison = version, status = "draft" } } } },
                { "apply", { items = { { product = { sku = "RDG", ski = "x" }, expect_version = version, status = "draft" } } } },
                { "apply", { items = { { product = { sku = "RDG" }, expect_version = version, set = { { attr = "core.care", value = "x", locale = "en" } } } } } },
                { "apply", { items = { { product = { sku = "RDG" }, expect_version = version, status = "draft" } }, idempotency = { namespace = "a", key = "b", ttl = 1 } } },
                { "propose", { items = { { product = { sku = "RDG" }, expect_verison = version, status = "draft" } } } },
                { "release", { items = { { product = { sku = "RDG" }, expect_verison = version } } } },
                { "withdraw", { items = { { product = { sku = "RDG" }, channel = "x" } } } },
                { "get", { product = { sku = "RDG", extra = true } } },
                { "query", { filters = { { attr = "core.size", op = "eq", value = 40 } } } },
                { "query", { ready = { set = "x", value = true, extra = 1 } } },
                { "query", { parent = { skew = "RDG" } } },
                { "query", { root = { skew = "RDG" } } },
                { "query", { published = { channel = "x", state = "y" } } },
                { "query", { scopes = { { id = "x", where = {}, extra = 1 } } } },
                { "list_changes", { cursor = { seq = 1, product_id = "x", extra = 1 } } },
            } :: { { unknown } }) do
                local op = case[1] :: string
                local out, err = h.call(op, case[2])
                if case[3] == "item" then
                    test.is_nil(err, tostring(err))
                    test.eq(out.outcomes[1].outcome, "invalid")
                    test.eq(assert(h.call("get", { product = { sku = "RDG" } })).product.version, 1)
                else
                    test.not_nil(err, op)
                    test.eq((err :: error):kind(), errors.INVALID, op .. ": " .. tostring(err))
                end
            end
            local _, empty_tree = h.call("query", { where = {} })
            test.not_nil(empty_tree)
            test.eq((empty_tree :: error):kind(), errors.INVALID)
            local page, err = h.call("query", { scopes = {} })
            test.is_nil(err)
            test.eq(#page.items, 6)
        end)
    end)

    test.describe("catalog contract", function()
        test.it("keeps a stored product reference set when apply sends a non-array replacement", function()
            local h = fixture.catalog()
            local target = assert(steps.one(h, { product = { sku = "TARGET" }, create = {} }).product_id)
            local ref = { ref = { "product", target } }
            test.eq(steps.one(h, { product = { sku = "HOLDER" }, create = {},
                set = { { attr = "core.related", value = { ref } } } }).outcome, "created")
            local outcome = steps.set(h, "HOLDER", "core.related", { related = ref })
            local got = assert(steps.get(h, "HOLDER")).values["core.related"].value :: { types.Ref }
            test.eq(#got, 1, "malformed reference set outcome was " .. outcome.outcome)
            test.eq(outcome.outcome, "invalid")
            test.eq(steps.set(h, "HOLDER", "core.related", {}).outcome, "updated")
            test.eq(#(assert(steps.get(h, "HOLDER")).values["core.related"].value :: { types.Ref }), 0)
        end)

        test.it("includes persisted source attribution in the document byte budget", function()
            local h = fixture.catalog()
            local schema = assert(h.call("get_schema", {})) :: types.SchemaView
            local attribute = tostring(schema.attributes["core.care"].id)
            local length_without_source = #json.encode({ [attribute] = { [""] = { p = "" } } })
            local payload = string.rep("x", consts.LIMITS.document_bytes - length_without_source)
            local persisted_bytes = #json.encode({ [attribute] = { [""] = { p = payload, s = "erp" } } })
            test.is_true(persisted_bytes > consts.LIMITS.document_bytes)
            local out = assert(h.call("apply", { source = "erp", items = {
                { product = { sku = "DOCUMENT-LIMIT" }, create = {}, set = { { attr = "core.care", value = payload } } },
            } })) :: types.ApplyResult
            test.eq(out.outcomes[1].outcome, "invalid", "the attributed document needs " .. persisted_bytes .. " bytes")
            test.is_nil((steps.get(h, "DOCUMENT-LIMIT")))

            local exact = payload:sub(1, #payload - (persisted_bytes - consts.LIMITS.document_bytes))
            local accepted = assert(h.call("apply", { source = "erp", items = {
                { product = { sku = "DOCUMENT-LIMIT" }, create = {}, set = { { attr = "core.care", value = exact } } },
            } })) :: types.ApplyResult
            test.eq(accepted.outcomes[1].outcome, "created")
            local committed = assert(steps.get(h, "DOCUMENT-LIMIT"))
            test.eq(committed.values["core.care"].source, "erp")
            test.eq(#(committed.values["core.care"].value :: string), #exact)
        end)

        test.it("reads committed summary state before public metadata is published", function()
            local h = fixture.catalog({ bare = true })
            summary_component.metadata({ title = "New catalog" })
            local summary = assert(summary_locate.summary(h.id))
            test.eq(summary.generation, 1, "summary before first metadata publication")
            test.eq(summary.product_count, 0)
            test.eq(summary.item_count, 0)
            test.eq(summary.status, "ready")
            test.eq(summary.title, "New catalog")
            test.is_true(summary.access.read)
            test.is_true(summary.access.write)
            test.is_true(summary.access.admin)
            local discovered = assert(summary_locate.readable(1, 0, h.id))
            test.eq(#discovered, 1, "discovery before first metadata publication")
            test.eq(discovered[1].generation, 1)

            assert(h.call("apply_schema", { expected_generation = 1,
                declaration = { aspects = { { namespace = "core" } } } }))
            assert(h.call("apply", { items = { { product = { sku = "first" }, create = { family = "generic" } } } }))
            summary_component.metadata({ title = "Renamed catalog", generation = 1,
                product_count = 0, item_count = 0, status = "rebuilding" })
            local current = assert(summary_locate.summary(h.id))
            test.eq(current.generation, 2, "summary before updated metadata publication")
            test.eq(current.product_count, 1)
            test.eq(current.item_count, 1)
            test.eq(current.status, "ready")
            test.eq(current.title, "Renamed catalog")
        end)

        test.it("binds every method to a registered service function", function()
            local binding = assert(registry.get("kickside.pim.binding:catalog_service"))
            local methods = binding.data.contracts[1].methods
            for _, name in ipairs(METHODS) do
                test.eq(methods[name], "kickside.pim.service:" .. name)
                local fn = assert(registry.get(methods[name]))
                test.eq(fn.kind, "function.lua")
            end
        end)

        test.it("reads a catalog created without a declaration at its empty schema head", function()
            local h = fixture.catalog({ bare = true })
            local view, err = h.call("get_schema", {})
            test.is_nil(err, tostring(err))
            test.eq(view.schema_generation, 1)
            test.eq(view.generation, 1)
            test.is_nil(next(view.attributes))
            test.eq(#(view.declaration.aspects or {}), 0)
            test.is_true(view.access.read)
            test.is_true(view.access.write)
            test.is_true(view.access.admin)
            test.is_nil(requests.check_output("get_schema", view))
            local page, qerr = h.call("query", { count = true })
            test.is_nil(qerr, tostring(qerr))
            test.eq(#page.items, 0)
            test.eq(page.total, 0)
            test.eq(page.generation, 1)
            local summary, serr = h.call("get_catalog", {})
            test.is_nil(serr, tostring(serr))
            test.eq(summary.generation, 1)
            test.eq(summary.product_count, 0)
        end)

        test.it("validates commands against the empty schema before user definitions", function()
            local h = fixture.catalog({ bare = true })
            local invalid, err = h.call("apply", { items = { { product = { sku = "BAD" }, create = { family = "undeclared" } } } })
            test.is_nil(err, tostring(err))
            test.eq(invalid.outcomes[1].outcome, "invalid")
            test.eq(invalid.outcomes[1].findings[1].message, "unknown family undeclared")
            for _, op in ipairs({ "release", "withdraw" }) do
                local result, rerr = h.call(op, { items = { { product = { sku = "MISSING" }, expect_version = op == "release" and 1 or nil } } })
                test.is_nil(rerr, tostring(rerr))
                test.eq(result.outcomes[1].outcome, "invalid")
            end
            local _, perr = h.call("propose", { items = { { product = { sku = "MISSING" }, set = { { attr = "core.name", value = "x" } } } } })
            test.not_nil(perr)
            test.eq(perr:kind(), errors.INVALID)
            test.eq(perr:details().code, "invalid_request")
            local made, merr = h.call("apply", { items = { { product = { sku = "EMPTY" }, create = {} } } })
            test.is_nil(merr, tostring(merr))
            test.eq(made.outcomes[1].outcome, "created")
            local got = assert(h.call("get", { product = { sku = "EMPTY" } }))
            test.eq(got.product.family, "generic")
            test.is_nil(next(got.values))
        end)

        test.it("applies user definitions after empty creation and replays creation without resetting the head", function()
            local h = fixture.catalog({ bare = true })
            local applied, err = h.call("apply_schema", { declaration = fixture.DECLARATION, expected_generation = 1 })
            test.is_nil(err, tostring(err))
            test.eq(applied.generation, 2)
            local again, aerr = h.call("create", { idempotency_key = "fixture", title = "Fixture catalog" })
            test.is_nil(aerr, tostring(aerr))
            test.eq(again.generation, 1)
            test.is_true(again.replayed)
            local view = assert(h.call("get_schema", {}))
            test.eq(view.schema_generation, 2)
            test.not_nil(view.attributes["core.name"])
            local initial = assert(h.call("get_schema", { generation = 1 }))
            test.is_nil(next(initial.attributes))
        end)

        test.it("creates idempotently per caller and resolves the caller's only catalog", function()
            local h = fixture.catalog({ bare = true })
            local again, err = h.call("create", { idempotency_key = "fixture", title = "Fixture catalog" })
            test.is_nil(err)
            test.is_true(again.replayed)
            test.eq(again.catalog_id, h.id)
            local _, cerr = h.call("create", { idempotency_key = "fixture", title = "Another title" })
            test.not_nil(cerr)
            local _, schema_conflict = h.call("create", { idempotency_key = "fixture", title = "Fixture catalog",
                declaration = { aspects = { { namespace = "other" } } } })
            test.eq(schema_conflict:details().code, "idempotency_conflict")
            test.eq(#h.call("list", {}).catalogs, 1)
            local implicit, ierr = h.executor:call("app:pim_call", { op = "get_schema", request = {} })
            test.is_nil(ierr, tostring(ierr))
            test.eq(implicit.schema_generation, 1)
            local second = h.call("create", { idempotency_key = "two", title = "Second" })
            test.is_false(second.replayed)
            test.eq(#h.call("list", {}).catalogs, 2)
            local _, ambiguous = h.executor:call("app:pim_call", { op = "get_schema", request = {} })
            test.eq((ambiguous :: error):details().code, "catalog_ambiguous", tostring(ambiguous))
        end)

        test.it("rejects an initial schema without registering its catalog", function()
            local h = fixture.catalog({ bare = true })
            local _, err = h.call("create", { idempotency_key = "invalid-one", title = "Initial schema",
                declaration = { families = { { code = "Invalid code" } } } })
            test.eq(err:kind(), errors.INVALID)
            test.eq(err:details().code, "invalid_schema")
            local ids = assert(h.call("catalog_registrations", {})) :: { string }
            test.eq(#ids, 1)
            test.eq(ids[1], h.id)
            local listed = assert(h.call("list", { limit = 1 }))
            local implicit, lookup_err = h.executor:call("app:pim_call", { op = "get_schema", request = {} })
            test.eq(#listed.catalogs, 1, "implicit lookup " .. tostring(lookup_err))
            test.eq(listed.catalogs[1].catalog_id, h.id)
            test.is_nil(listed.after)
            test.is_nil(lookup_err)
            test.eq(implicit.schema_generation, 1)

            local retried = assert(h.call("create", { idempotency_key = "invalid-one", title = "Initial schema" }))
            test.is_false(retried.replayed)
            test.eq(retried.generation, 1)
            local first = assert(h.call("list", { limit = 1 }))
            local second = assert(h.call("list", { limit = 1, after = assert(first.after) }))
            test.eq(#first.catalogs, 1)
            test.eq(#second.catalogs, 1)
            test.is_nil(second.after)
            test.is_true(first.catalogs[1].catalog_id ~= second.catalogs[1].catalog_id)
            local _, ambiguous = h.executor:call("app:pim_call", { op = "get_schema", request = {} })
            test.eq(ambiguous:details().code, "catalog_ambiguous")
        end)

        test.it("resolves the only catalog in one directory query after rejected creations", function()
            local h = fixture.catalog({ bare = true })
            for i = 1, 128 do
                local _, err = h.call("create", { idempotency_key = "rejected-" .. tostring(i),
                    declaration = { families = { { code = "Invalid code" } } } })
                test.eq(err:kind(), errors.INVALID)
                test.eq(err:details().code, "invalid_schema")
            end
            summary_component.directory(assert(h.call("catalog_registrations", {})) :: { string })
            test.eq(assert(summary_locate.resolve()), h.id)
            test.eq(summary_component.query_count(), 1)
        end)

        test.it("plans a schema change without applying it", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local plan, err = h.call("plan_schema", { declaration = { aspects = { { namespace = "logistics", attributes = {
                { code = "net_weight", type = "kickside.pim.types:number", index = "number", config = { scale = 2 } } } } } } })
            test.is_nil(err)
            test.eq(plan.class, "refused")
            test.eq(plan.refused[1].what, "config.scale")
            test.not_nil(plan.migration)
            local schema = h.call("get_schema", {})
            test.eq(schema.generation, 1)
            test.eq(schema.attributes["logistics.net_weight"].config.scale, 3)
            test.eq(schema.attributes["core.gtin"].unique, true)
        end)

        test.it("pages history for one product", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local root = h.call("get", { product = { sku = "RDG" } })
            h.call("apply", { items = { { product = { sku = "RDG" }, expect_version = root.product.version,
                set = { { attr = "core.name", ctx = { locale = "en" }, value = "Renamed" } } } } })
            local page, err = h.call("list_history", { product = { sku = "RDG" }, limit = 3 })
            test.is_nil(err)
            test.eq(#page.entries, 3)
            test.eq(page.entries[1].kind, "set")
            test.eq(page.entries[1].attribute, "core.name")
            test.eq(page.entries[1].ctx, "locale=en")
            test.eq(page.entries[1].before, "Ridgeline hiking boot")
            test.eq(page.entries[1].after, "Renamed")
            test.eq(page.entries[1].actor, h.actor:id())
            test.not_nil(page.entries[1].at)
            test.not_nil(page.next)
            local rest = h.call("list_history", { product = { sku = "RDG" }, before = page.next, limit = 50 })
            local last = rest.entries[#rest.entries]
            test.eq(last.kind, "created")
            test.eq(last.after.sku, "RDG")
            test.is_nil(rest.next)
        end)

        test.it("refuses a read until the projection reaches min_seq", function()
            local h = fixture.catalog()
            local _, err = h.call("query", { min_seq = 1000000 })
            test.not_nil(err)
            test.is_true(err:retryable())
            local ok = h.call("query", { min_seq = 1 })
            test.not_nil(ok)
        end)

        test.it("publishes catalog counts, generation and rebuild state as public meta", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local function meta(): unknown
                return h.call("list", {}).catalogs[1]
            end
            local m
            for _ = 1, 100 do
                m = meta()
                if m.product_count == 9 then break end
                time.after("50ms"):receive()
            end
            test.eq(m.product_count, 9)
            test.eq(m.item_count, 6)
            test.eq(m.generation, 1)
            h.call("apply_schema", { declaration = { aspects = { { namespace = "core", attributes = {
                { code = "care", type = "kickside.pim.types:text", default = "Hand wash.", index = "key" } } } } } })
            for _ = 1, 200 do
                m = meta()
                if m.generation == 2 and m.status == "ready" then break end
                time.after("50ms"):receive()
            end
            test.eq(m.generation, 2)
            test.eq(m.status, "ready")
        end)

        test.it("notifies every catalog reader of each committed change on the catalog topic", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local root = h.call("get", { product = { sku = "RDG" } })
            local out = h.call("apply", { items = { { product = { sku = "RDG" }, expect_version = root.product.version,
                set = { { attr = "core.name", ctx = { locale = "en" }, value = "Live" } } } } })
            local seq = out.seq
            local found = false
            for _ = 1, 100 do
                local db = assert(sql.get("app:db"))
                local rows = db:query([[SELECT event, last_event_seq FROM pim_realtime_notices WHERE user_id = $1 AND topic = $2]],
                    { h.actor:id(), "component." .. h.id })
                db:release()
                for _, r in ipairs(rows or {}) do
                    if r.event == "component.meta.changed" and math.tointeger(tonumber(r.last_event_seq)) == seq then found = true end
                end
                if found then break end
                time.after("50ms"):receive()
            end
            test.is_true(found)
        end)

        test.it("keeps one decision per proposal", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local p = h.call("propose", { items = { { product = { sku = "RDG" }, set = { { attr = "core.name", ctx = { locale = "en" }, value = "A" } } } } })
            test.eq(h.call("decide", { proposal_id = p.proposal_id, decision = "accept" }).status, "accepted")
            local _, rerr = h.call("decide", { proposal_id = p.proposal_id, decision = "reject" })
            test.not_nil(rerr)
            test.eq(rerr:details().code, "proposal_decided")
            local q = h.call("propose", { items = { { product = { sku = "RDG" }, set = { { attr = "core.name", ctx = { locale = "en" }, value = "B" } } } } })
            test.eq(h.call("decide", { proposal_id = q.proposal_id, decision = "reject" }).status, "rejected")
            local late = h.call("decide", { proposal_id = q.proposal_id, decision = "accept" })
            test.eq(late.status, "rejected")
            test.eq(h.call("get", { product = { sku = "RDG" }, context = { locale = "en" } }).values["core.name"].value, "A")
        end)
    end)
end

return { run = test.run_cases(define) }
