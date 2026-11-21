-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local fixture = require("fixture")
local json = require("json")
local registry = require("registry")
local scoped = require("scoped")
local steps = require("steps")
local test = require("test")
local time = require("time")
local types = require("types")

type Map = { [string]: unknown }
local ROOT, MOSS, SLATE = "RIDGE", "RIDGE-MOSS", "RIDGE-SLATE"
local SKU = "RIDGE-MOSS-40"
local US, DE = { market = "us", language = "en" }, { market = "de", language = "de" }
local US_KEY, DE_KEY = "market=us;language=en", "market=de;language=de"
local EN_COPY = "A waterproof boot for rocky trails."
local DE_COPY = "Ein wasserdichter Stiefel für felsige Wege."
local EVENT = "kickside.pim.events:"
local PLUGIN, FOLD = "app:state_plugin", "app:state_fold"

local function call_as(call: fixture.Call, method: string, request: Map): Map
    local out, err = call(method, request)
    assert(out, method .. ": " .. tostring(err) .. " " .. json.encode(err and err:details() or {}))
    return out :: Map
end

local function seed(): (fixture.Handle, fixture.Call, fixture.Call, string, string)
    local h = fixture.catalog({ bare = true })
    local supplier, supplier_id = fixture.user(h)
    local agent, agent_id = fixture.user(h)
    call_as(h.call, "grant", { subject_id = supplier_id, mask = 3 })
    call_as(h.call, "grant", { subject_id = agent_id, mask = 1 })

    local declaration = steps.copy(assert(registry.get("app:outdoor_catalog")).data) :: Map
    declaration.sources = { { id = "supplier", ordering = "sequence", writes = { "merchandise", "logistics" },
        principals = { supplier_id } } }
    local request = { declaration = declaration, expected_generation = 1 }
    local plan = call_as(h.call, "plan_schema", request)
    test.is_true(#plan.changes > 0)
    local installed = call_as(h.call, "apply_schema", request)
    test.eq(installed.generation, 2)
    local terms = call_as(h.call, "apply", { items = {
        { term = { vocabulary = "categories", code = "footwear" }, labels = { en = "Footwear", de = "Schuhe" } },
        { term = { vocabulary = "categories", code = "boots" }, parent = "footwear",
            labels = { en = "Hiking boots", de = "Wanderstiefel" } },
        { term = { vocabulary = "colours", code = "moss" }, labels = { en = "Moss", de = "Moos" } },
        { term = { vocabulary = "colours", code = "slate" }, labels = { en = "Slate", de = "Schiefer" } },
    } })
    test.is_true(terms.applied)
    return h, supplier, agent, supplier_id, agent_id
end

local function sink(supplier: fixture.Call, key: string, record: Map): Map
    return call_as(supplier, "sink", { sink_op = "upsert", origin = "automation:outdoor-supplier",
        idempotency_key = key, config = { source = "supplier" }, input = record })
end

local function deliver(supplier: fixture.Call, record: Map): string
    local outcome = sink(supplier, record.sku .. ":" .. tostring(record.seq), record)
    test.is_true(outcome.success, json.encode(outcome))
    test.eq(outcome.result, "created")
    return outcome.dest_ref.product_id :: string
end

local function import_catalog(supplier: fixture.Call): { [string]: string }
    local ids: { [string]: string } = {}
    ids[ROOT] = deliver(supplier, { sku = ROOT, family = "hiking_boots", seq = 1,
        set = { { attr = "merchandise.category", value = "boots" } } })
    for branch, colour in pairs({ [MOSS] = "moss", [SLATE] = "slate" }) do
        ids[branch] = deliver(supplier, { sku = branch, parent_sku = ROOT, seq = 1,
            set = { { attr = "merchandise.colour", value = colour } } })
        for _, size in ipairs({ 40, 41 }) do
            local sku = branch .. "-" .. tostring(size)
            ids[sku] = deliver(supplier, { sku = sku, parent_sku = branch, seq = 1,
                status = sku == SKU and "draft" or "active",
                set = { { attr = "merchandise.size", value = size }, { attr = "merchandise.barcode", value = sku .. "-GTIN" } } })
        end
    end
    ids.POLE = deliver(supplier, { sku = "POLE", family = "trekking_poles", seq = 1,
        set = { { attr = "merchandise.barcode", value = "POLE-GTIN" } } })
    return ids
end

local function read(h: fixture.Handle, sku: string, context: types.Ctx?): types.GetResult
    return assert(steps.get(h, sku, context))
end

local function edit(h: fixture.Handle, sku: string, fields: Map): types.Outcome
    fields.product = { sku = sku }
    fields.expect_version = read(h, sku).product.version
    return call_as(h.call, "apply", { items = { fields } }).outcomes[1] :: types.Outcome
end

local function names(h: fixture.Handle)
    test.eq(edit(h, ROOT, { set = {
        { attr = "copy.name", ctx = { language = "en" }, value = "Ridgeline hiking boot" },
        { attr = "copy.name", ctx = { language = "de" }, value = "Ridgeline Wanderstiefel" },
        { attr = "copy.description", ctx = US, value = EN_COPY },
    } }).outcome, "updated")
end

local function release(h: fixture.Handle, sku: string, channel: string?): types.Outcome
    return call_as(h.call, "release", { items = { { product = { sku = sku },
        expect_version = read(h, sku).product.version, channels = channel and { channel } or nil } } }).outcomes[1] :: types.Outcome
end

local function record(h: fixture.Handle, id: string?): types.ReleaseRecord
    return call_as(h.call, "get_release", { release_id = assert(id) }).release :: types.ReleaseRecord
end

local function published(h: fixture.Handle, channel: string, cursor: unknown?): Map
    return call_as(h.call, "pull", { config = { channel = channel }, cursor = cursor, limit = 1 })
end

local function changed(h: fixture.Handle, cursor: types.ChangesCursor?, limit: integer): types.ChangesResult
    local page = call_as(h.call, "list_changes", { cursor = cursor, limit = limit, families = { "hiking_boots" } }) :: types.ChangesResult
    test.is_nil(page.gap)
    return page
end

local function plugin_feed(h: fixture.Handle, token: string?): types.PluginFeed
    local result = call_as(h.call, "plugin_feed", { plugin = PLUGIN, kind = FOLD, token = token }) :: types.PluginFeed
    test.is_nil(result.gap)
    test.is_true(result.done)
    return result
end

local function activate_plugin(h: fixture.Handle)
    call_as(h.call, "apply_schema", { declaration = { plugins = { { use = PLUGIN } } },
        plugin_configs = { [PLUGIN] = { marker = "outdoor" } } })
    for _ = 1, 300 do
        local context = call_as(h.call, "plugin_context", { plugin = PLUGIN })
        if context.lifecycle.state == "ready" then return end
        assert(context.lifecycle.state ~= "failed", json.encode(context.lifecycle))
        time.sleep("10ms")
    end
    error("outdoor catalog state plugin did not become ready")
end

local function assert_port_samples(h: fixture.Handle, events: { types.RawEvent })
    local observer = scoped.member()
    call_as(h.call, "grant", { subject_id = observer.id, mask = 9 })

    local bodies: { [string]: { unknown } } = {}
    for _, fact in ipairs(events) do
        local kind = fact.type:match("^kickside%.pim%.events:(.+)$")
        if kind then
            local event = assert(registry.get(fact.type))
            local ok, err = json.validate(event.data.schema, fact.body)
            test.is_true(ok, fact.type .. ": " .. tostring(err))
            bodies[kind] = bodies[kind] or {}
            table.insert(bodies[kind], fact.body)
        end
    end
    for kind, expected in pairs(bodies) do
        local name = "kickside.pim.ports:" .. kind:gsub("%.", "_")
        test.eq(assert(registry.get(name)).data.event, EVENT .. kind)
        local reply = observer.api("POST", "/automations/source-samples", {
            source = name, config = { thread_id = h.id }, limit = 100,
        })
        test.eq(reply.status, 200, name .. ": " .. json.encode(reply.body))
        test.eq(#reply.body.samples, #expected, name)
        for i, sample in ipairs(reply.body.samples) do
            local ok, err = json.validate(reply.body.output_schema, sample)
            test.is_true(ok, name .. ": " .. tostring(err))
            test.eq(json.encode(sample), json.encode(expected[i]), name .. " sample " .. tostring(i))
        end
    end
end

local function facts(h: fixture.Handle, kind: string): { types.RawEvent }
    local selected: { types.RawEvent } = {}
    for _, event in ipairs(fixture.events(h)) do
        if event.type == EVENT .. kind then selected[#selected + 1] = event end
    end
    return selected
end

local function suggest(agent: fixture.Call, text: string): string
    local proposed = call_as(agent, "propose", {
        origin = { type = "agent", id = "translation-agent" }, provenance = { language = "de" },
        items = { { product = { sku = ROOT }, set = { { attr = "copy.description", ctx = DE, value = text } } } },
    })
    test.eq(proposed.status, "pending")
    return proposed.proposal_id :: string
end

local function decide(call: fixture.Call, id: string, decision: string): Map
    return call_as(call, "decide", { proposal_id = id, decision = decision })
end

local function define()
    test.describe("outdoor catalog model", function()
        test.it("upserts supplier SKUs, resolves the colour and size tree, and replays delivery receipts", function()
            local h, supplier, _, supplier_id = seed()
            local ids = import_catalog(supplier)
            names(h)
            local items = steps.query(h, { root = { sku = ROOT }, family = "hiking_boots" }).items
            test.eq(#items, 4)
            for _, item in ipairs(items) do
                local sku = item.sku
                local branch, size = sku:match("^(.*)%-(%d+)$")
                local variant = read(h, sku, DE)
                test.eq(variant.product.product_id, ids[sku])
                test.eq(variant.product.parent_id, ids[branch])
                test.eq(variant.product.root_id, ids[ROOT])
                test.eq(variant.values["merchandise.size"].value, tonumber(size))
                test.eq(variant.values["merchandise.colour"].owner, ids[branch])
                test.eq(variant.values["merchandise.colour"].value.ref[2], branch == MOSS and "colours:moss" or "colours:slate")
                test.eq(variant.values["copy.name"].owner, ids[ROOT])
                test.eq(variant.values["copy.name"].value, "Ridgeline Wanderstiefel")
            end
            test.eq(read(h, "POLE").product.family, "trekking_poles")
            local duplicate = sink(supplier, "duplicate-axis", { sku = "DUPLICATE", parent_sku = MOSS, seq = 1,
                set = { { attr = "merchandise.size", value = 40 } } })
            test.is_false(duplicate.success)
            test.eq(duplicate.error.code, "conflict")
            test.eq(duplicate.error.details.findings[1].holder, ids[SKU])
            local forbidden = edit(h, SKU, { set = { { attr = "copy.name", ctx = { language = "en" }, value = "Leaf override" } } })
            test.eq(forbidden.outcome, "invalid")
            test.eq(forbidden.findings[1].attribute, "copy.name")

            local delivery = { sku = SKU, seq = 2, set = { { attr = "merchandise.barcode", value = "04001234567893" } } }
            local update = sink(supplier, "corrected-barcode", delivery)
            test.is_true(update.success, json.encode(update))
            test.eq(update.result, "updated")
            test.eq(update.dest_ref.product_id, ids[SKU])
            local before = #fixture.events(h)
            test.eq(json.encode(sink(supplier, "corrected-barcode", delivery)), json.encode(update))
            local stale = sink(supplier, SKU .. ":1", { sku = SKU, parent_sku = MOSS, seq = 1, status = "draft",
                set = { { attr = "merchandise.size", value = 40 }, { attr = "merchandise.barcode", value = SKU .. "-GTIN" } } })
            test.eq(stale.result, "created")
            test.eq(stale.dest_ref.product_id, ids[SKU])
            local edited = read(h, SKU)
            test.eq(edited.product.version, 2)
            test.eq(edited.values["merchandise.barcode"].value, "04001234567893")
            test.eq(#fixture.events(h), before)
            local events = facts(h, "product.created")
            test.eq(#events, 8)
            for _, event in ipairs(events) do
                test.eq(event.body.actor, supplier_id)
                test.eq(event.body.source, "supplier")
                test.eq(event.body.generation, 2)
                test.eq(event.body.origin.type, "automation")
            end
            local updates = facts(h, "product.changed")
            test.eq(#updates, 2)
            test.eq(updates[2].body.actor, supplier_id)
            test.eq(updates[2].body.source_seq, 2)
            test.eq(updates[2].body.patch[1].v, "04001234567893")
        end)

        test.it("gates release by locale, channel and checked status, and reviews proposals at their schema generation", function()
            local h, supplier, agent, _, agent_id = seed()
            local ids = import_catalog(supplier)
            names(h)
            local blocked = edit(h, SKU, { status = "active" })
            test.eq(blocked.outcome, "invalid")
            test.eq(blocked.findings[1].code, "case_pack_required")
            test.eq(read(h, SKU).product.status, "draft")
            test.eq(read(h, SKU).product.version, 1)
            test.eq(release(h, SKU).findings[1].code, "inactive")
            local promoted = edit(h, SKU, { status = "active", set = { { attr = "logistics.case_pack", value = 6 } } })
            test.eq(promoted.outcome, "updated")
            local result = read(h, SKU, DE)
            test.eq(result.product.status, "active")
            test.eq(#result.readiness.online_us, 0)
            test.eq(#result.readiness.wholesale_de, 0)
            test.eq(#result.readiness.online_de, 1)
            local only_blocker = result.readiness.online_de[1]
            test.eq(only_blocker.code, "not_authored")
            test.eq(only_blocker.attribute, "copy.description")
            test.eq(only_blocker.context, "language=de;market=de")
            local incomplete = release(h, SKU, "online")
            test.eq(incomplete.outcome, "not_ready")
            test.eq(#incomplete.findings, 1)
            test.eq(incomplete.findings[1].channel, "online")
            test.eq(incomplete.findings[1].set, "online_de")
            test.eq(#published(h, "online").items, 0)
            local wholesale = release(h, SKU)
            test.eq(wholesale.outcome, "released")
            test.eq(table.concat(wholesale.channels, ","), "wholesale")
            local delivery = published(h, "wholesale")
            test.eq(delivery.items[1].payload.release_id, wholesale.release_id)
            test.eq(#published(h, "wholesale", delivery.next_cursor).items, 0)

            local rejected = suggest(agent, "Nicht geprüfte Aussage.")
            local _, denied = agent("decide", { proposal_id = rejected, decision = "accept" })
            test.eq(assert(denied):kind(), errors.PERMISSION_DENIED)
            test.eq(decide(h.call, rejected, "reject").status, "rejected")
            test.is_nil(read(h, SKU, DE).values["copy.description"].value)

            local stale = suggest(agent, "Entwurf der ersten Fassung.")
            local inbox = call_as(h.call, "pull_proposals", { limit = 1 })
            test.eq(inbox.items[1].item_key, stale)
            local awaiting = call_as(h.call, "list_proposals", { status = "pending" }).proposals[1]
            test.eq(awaiting.proposal_id, stale)
            test.eq(awaiting.generation, 2)
            test.eq(awaiting.base[ids[ROOT]], read(h, ROOT).product.version)
            test.eq(awaiting.created_by, agent_id)
            local schema = call_as(h.call, "apply_schema", { expected_generation = 2, declaration = { policy = { trash_days = 31 } } })
            local before = #fixture.events(h)
            local _, conflict = h.call("decide", { proposal_id = stale, decision = "accept" })
            test.eq(assert(conflict):kind(), errors.CONFLICT)
            test.eq(conflict:details().code, "schema_generation_conflict")
            test.eq(conflict:details().expected_generation, 2)
            test.eq(conflict:details().generation, schema.generation)
            test.eq(#fixture.events(h), before)
            test.is_nil(read(h, SKU, DE).values["copy.description"].value)
            test.eq(decide(h.call, stale, "reject").status, "rejected")

            local proposal = suggest(agent, DE_COPY)
            local resumed = call_as(h.call, "pull_proposals", { cursor = inbox.next_cursor, limit = 1 })
            test.eq(#resumed.items, 1)
            test.eq(resumed.items[1].item_key, proposal)
            local approved = decide(h.call, proposal, "accept")
            test.eq(approved.status, "accepted")
            test.eq(#read(h, SKU, DE).readiness.online_de, 0)
            test.eq(read(h, SKU, DE).values["copy.description"].value, DE_COPY)
            test.eq(steps.count(h, { family = "hiking_boots", ready = { set = "online_de", value = true } }), 4)
            local online = release(h, SKU, "online")
            test.eq(online.outcome, "released")
            test.eq(published(h, "online").items[1].payload.release_id, online.release_id)
            test.eq(#published(h, "wholesale", delivery.next_cursor).items, 0)

            local submitted, review = facts(h, "proposal.submitted"), facts(h, "proposal.decided")
            test.eq(#submitted, 3)
            test.eq(#review, 3)
            for i, id in ipairs({ rejected, stale, proposal }) do
                test.eq(submitted[i].body.proposal_id, id)
                test.eq(submitted[i].body.actor, agent_id)
                test.eq(submitted[i].body.origin.id, "translation-agent")
                test.eq(submitted[i].body.generation, i == 3 and 3 or 2)
                test.eq(review[i].body.proposal_id, id)
                test.eq(review[i].body.actor, h.actor:id())
                test.eq(review[i].body.status, i == 3 and "accepted" or "rejected")
            end
            local changes = facts(h, "product.changed")
            test.eq(#changes, 3)
            test.eq(changes[2].body.previous_status, "draft")
            test.eq(changes[2].body.status, "active")
            test.eq(changes[3].body.approval_item_id, proposal)
            test.eq(changes[3].body.generation, schema.generation)
            test.eq(changes[3].seq, approved.result.seq)
            test.eq(review[3].seq, changes[3].seq + 1)
            local releases = facts(h, "product.released")
            test.eq(#releases, 2)
            test.eq(releases[1].body.release_id, wholesale.release_id)
            test.eq(releases[2].body.release_id, online.release_id)
            assert_port_samples(h, fixture.events(h))
        end)

        test.it("resumes change and plugin feeds over one inherited update to every variant", function()
            local h, supplier = seed()
            local ids = import_catalog(supplier)
            names(h)
            activate_plugin(h)
            local initial = changed(h, nil, 50)
            test.eq(#initial.items, 7)
            local bootstrap = plugin_feed(h)
            test.is_true(bootstrap.bootstrap)
            test.eq(#bootstrap.changes, 8)

            local update = edit(h, ROOT, { set = { { attr = "copy.description", ctx = DE, value = DE_COPY } } })
            test.eq(update.outcome, "updated")
            local page = initial
            local by_sku: { [string]: types.ChangeItem } = {}
            for i = 1, 7 do
                page = changed(h, page.next, 1)
                test.eq(#page.items, 1)
                test.eq(page.has_more, i < 7)
                local item = page.items[1]
                test.eq(item.updated_seq, page.next.seq)
                test.eq(item.product_id, page.next.product_id)
                test.eq(item.product_id, ids[item.sku])
                test.eq(item.op, "upsert")
                test.eq(item.values["copy.description"][DE_KEY], DE_COPY)
                test.is_nil(by_sku[item.sku], "continuation duplicated " .. item.sku)
                by_sku[item.sku] = item
                if item.level == 2 then test.eq(item.version, 1, "inherited change keeps the leaf version") end
            end
            test.eq(#changed(h, page.next, 1).items, 0)
            for _, sku in ipairs({ ROOT, MOSS, SLATE, SKU, "RIDGE-MOSS-41", "RIDGE-SLATE-40", "RIDGE-SLATE-41" }) do
                test.not_nil(by_sku[sku])
                test.eq(by_sku[sku].updated_seq, by_sku[ROOT].updated_seq)
            end

            local resumed = plugin_feed(h, bootstrap.token)
            test.is_false(resumed.bootstrap)
            test.eq(resumed.config.marker, "outdoor")
            test.eq(resumed.attachment_id, bootstrap.attachment_id)
            test.eq(#resumed.changes, 7)
            for _, item in ipairs(resumed.changes) do
                test.eq(json.encode(item), json.encode(assert(by_sku[item.sku])))
                by_sku[item.sku] = nil
            end
            test.is_nil(next(by_sku))
            test.eq(#plugin_feed(h, resumed.token).changes, 0)
        end)

        test.it("records the snapshot and channel of each release even when the content is identical", function()
            local h, supplier = seed()
            local ids = import_catalog(supplier)
            names(h)
            test.eq(edit(h, ROOT, { set = { { attr = "copy.description", ctx = DE, value = DE_COPY } } }).outcome, "updated")
            test.eq(edit(h, SKU, { status = "active", set = { { attr = "logistics.case_pack", value = 6 } } }).outcome, "updated")

            local online = release(h, SKU, "online")
            test.eq(online.outcome, "released")
            local old = record(h, online.release_id)
            test.eq(table.concat(old.channels, ","), "online")

            local schema = call_as(h.call, "apply_schema", { expected_generation = old.generation,
                declaration = { policy = { trash_days = 31 } } })
            local wholesale = release(h, SKU, "wholesale")
            test.eq(wholesale.outcome, "released")
            test.eq(wholesale.hash, online.hash)
            local latest = record(h, wholesale.release_id)
            test.eq(table.concat(latest.channels, ","), "wholesale")
            test.eq(latest.generation, schema.generation)
            test.is_true(latest.release_id ~= old.release_id)
            test.eq(json.encode(latest.snapshot), json.encode(old.snapshot))

            local snapshot = latest.snapshot
            test.eq(snapshot.product_id, ids[SKU])
            test.eq(snapshot.parent_id, ids[MOSS])
            test.eq(snapshot.root_id, ids[ROOT])
            test.eq(snapshot.version, read(h, SKU).product.version)
            test.eq(snapshot.status, "active")
            test.eq(snapshot.values["merchandise.size"][""], 40)
            test.eq(snapshot.values["merchandise.colour"][""].ref[2], "colours:moss")
            test.eq(snapshot.values["copy.description"][US_KEY], EN_COPY)
            test.eq(snapshot.values["copy.description"][DE_KEY], DE_COPY)
            test.eq(snapshot.terms["colours:moss"].de, "Moos")
            test.eq(snapshot.terms["categories:boots"].en, "Hiking boots")
            test.eq(published(h, "online").items[1].payload.release_id, old.release_id)
            test.eq(published(h, "wholesale").items[1].payload.release_id, latest.release_id)
            test.eq(release(h, SKU, "wholesale").release_id, latest.release_id)
            test.eq(release(h, SKU, "online").release_id, old.release_id)
            test.eq(#facts(h, "product.released"), 2)

            -- An ancestor edit changes the resolved snapshot without changing the leaf's version.
            test.eq(edit(h, ROOT, { set = { { attr = "copy.description", ctx = DE, value = "Überarbeiteter Produkttext." } } }).outcome, "updated")
            test.eq(read(h, SKU).product.version, snapshot.version)
            local next_wholesale = release(h, SKU, "wholesale")
            test.eq(next_wholesale.outcome, "released")
            test.is_true(next_wholesale.hash ~= latest.hash)
            test.eq(record(h, next_wholesale.release_id).snapshot.values["copy.description"][DE_KEY], "Überarbeiteter Produkttext.")
            test.eq(json.encode(record(h, latest.release_id)), json.encode(latest))
            test.eq(json.encode(record(h, old.release_id)), json.encode(old))
            local releases = facts(h, "product.released")
            test.eq(#releases, 3)
            for i, expected in ipairs({ old, latest, record(h, next_wholesale.release_id) }) do
                local fact = releases[i]
                test.eq(fact.seq, expected.seq)
                test.eq(fact.body.release_id, expected.release_id)
                test.eq(fact.body.generation, expected.generation)
                test.eq(json.encode(fact.body.channels), json.encode(expected.channels))
                test.eq(json.encode(fact.body.snapshot), json.encode(expected.snapshot))
            end
        end)
    end)
end

return { run = test.run_cases(define) }
