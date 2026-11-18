-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Change history and the audit policy: value rows follow the effective policy
-- decided at the command, lifecycle rows are always kept, and the settings hook
-- refuses values outside the policy bounds.
local test = require("test")
local steps = require("steps")
local fixture = require("fixture")
local funcs = require("funcs")
local registry = require("registry")
local types = require("types")

local function kinds(page: types.HistoryResult): { [string]: integer }
    local out: { [string]: integer } = {}
    for _, e in ipairs(page.entries) do out[e.kind] = (out[e.kind] or 0) + 1 end
    return out
end

local function rename(h: fixture.Handle, sku: string, value: string, source: string?)
    local v = h.call("get", { product = { sku = sku } }).product.version
    local out, err = h.call("apply", { source = source, items = { { product = { sku = sku }, expect_version = v,
        set = { { attr = "core.gtin", value = value } } } } })
    assert(not err, tostring(err))
    assert(out.outcomes[1].outcome == "updated", out.outcomes[1].outcome)
end

local function all_kinds(h: fixture.Handle, product: { [string]: unknown }?): { [string]: integer }
    local out: { [string]: integer } = {}
    local before: string? = nil
    repeat
        local page = h.call("list_history", { product = product, before = before, limit = 200 }) :: types.HistoryResult
        for _, e in ipairs(page.entries) do out[e.kind] = (out[e.kind] or 0) + 1 end
        before = page.next
    until before == nil
    return out
end

-- obj reads a JSON object out of a history row field.
local function obj(v: unknown): { [string]: unknown }
    assert(type(v) == "table", "expected a JSON object")
    return v :: { [string]: unknown }
end

local version = steps.version

local function define()
    test.describe("history reads", function()
        test.it("records every kind of change in the catalog-wide history", function()
            local h = fixture.catalog()
            fixture.boot(h)
            h.call("apply", { items = { { term = { vocabulary = "colors", code = "moss" }, labels = { en = "Moss green" } } } })
            h.call("release", { items = { { product = { sku = "RDG-moss-40" }, expect_version = version(h, "RDG-moss-40") } } })
            h.call("withdraw", { items = { { product = { sku = "RDG-moss-40" } } } })
            h.call("apply", { items = { { product = { sku = "RDG-moss-40" }, expect_version = version(h, "RDG-moss-40"), status = "draft" } } })
            h.call("apply", { items = { { product = { sku = "RDG-slate-42" }, expect_version = "any", set = { { attr = "core.size", value = 46 } } } } })
            h.call("apply", { items = { { product = { sku = "RDG-slate-42" }, expect_version = "any", move = { parent = { sku = "RDG-moss" } } } } })
            local id = h.call("get", { product = { sku = "RDG-moss-41" } }).product.product_id
            h.call("apply", { items = { { product = { id = id }, expect_version = "any", delete = true } } })
            h.call("apply", { items = { { product = { id = id }, expect_version = "any", restore = true } } })
            local k = all_kinds(h, nil)
            for _, kind in ipairs({ "schema", "created", "set", "term", "released", "withdrawn", "status", "moved", "deleted", "restored" }) do
                test.is_true((k[kind] or 0) > 0, "history lacks " .. kind)
            end
            local page = h.call("list_history", { limit = 200 }) :: types.HistoryResult
            for _, e in ipairs(page.entries) do
                if e.subject:sub(1, 2) == "p:" then test.eq(type(e.sku), "string", "product entry " .. e.subject .. " names no sku")
                else test.is_nil(e.sku) end
            end
            local own = h.call("list_history", { product = { sku = "RDG-slate-42" }, limit = 50 }) :: types.HistoryResult
            test.eq(own.entries[1].sku, "RDG-slate-42")
        end)

        test.it("pages one atomic command's rows without gaps or repeats", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local items: { { [string]: unknown } } = {}
            for _, sku in ipairs({ "RDG-moss-40", "RDG-moss-41", "RDG-moss-42", "RDG-slate-40", "RDG-slate-41" }) do
                items[#items + 1] = { product = { sku = sku }, expect_version = "any", set = { { attr = "core.gtin", value = "N" .. sku } } }
            end
            h.call("apply", { items = items })
            local seen: { [string]: boolean } = {}
            local before: string? = nil
            local total = 0
            local last: { integer }? = nil
            repeat
                local page = h.call("list_history", { before = before, limit = 2 }) :: types.HistoryResult
                for _, e in ipairs(page.entries) do
                    local key = e.seq .. ":" .. e.n
                    test.is_nil(seen[key])
                    seen[key] = true
                    if last then test.is_true(e.seq < last[1] or (e.seq == last[1] and e.n < last[2])) end
                    last = { e.seq, e.n }
                    total = total + 1
                end
                if page.next then test.eq(page.next, last and (last[1] .. ":" .. last[2]) or nil) end
                before = page.next
            until before == nil
            local whole = h.call("list_history", { limit = 200 }) :: types.HistoryResult
            if whole.next == nil then test.eq(total, #whole.entries) end
        end)

        test.it("refuses malformed cursors and limits and unknown products", function()
            local h = fixture.catalog()
            fixture.boot(h)
            for _, before in ipairs({ "abc", "1:", "x:y", ":2", "1:2:3" }) do
                local _, err = h.call("list_history", { before = before })
                test.not_nil(err, before)
            end
            for _, limit in ipairs({ 0, 201 }) do
                local _, err = h.call("list_history", { limit = limit })
                test.not_nil(err)
            end
            local _, unknown = h.call("list_history", { product = { sku = "NOPE" } })
            test.not_nil(unknown)
            local _, empty = h.call("list_history", { product = {} })
            test.not_nil(empty)
            local _, ahead = h.call("list_history", { min_seq = 999999999 })
            test.not_nil(ahead)
        end)

        test.it("records clear and unset steps and orders a create's value rows", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local made = h.call("apply", { items = { { product = { sku = "SOLO" }, create = { family = "generic" }, status = "draft", set = {
                { attr = "core.gtin", value = "S1" }, { attr = "core.care", value = "Dry" } } } } })
            local id = made.outcomes[1].product_id
            h.call("apply", { items = { { product = { id = id }, expect_version = 1, clear = { { attr = "core.care" } } } } })
            h.call("apply", { items = { { product = { id = id }, expect_version = 2, unset = { { attr = "core.care" } } } } })
            local page = h.call("list_history", { product = { id = id }, limit = 50 }) :: types.HistoryResult
            test.eq(page.entries[1].kind, "unset")
            test.eq(page.entries[2].kind, "clear")
            test.eq(page.entries[2].before, "Dry")
            test.is_nil(page.entries[2].after)
            local entries: { types.HistoryEntry } = page.entries
            local created: types.HistoryEntry = entries[#entries]
            test.eq(created.kind, "created")
            test.eq(created.n, 1)
            test.eq(obj(created.after).status, "draft")
            test.eq(entries[#entries - 1].kind, "set")
            test.eq(entries[#entries - 1].n, 2)
            test.eq(entries[#entries - 2].n, 3)
            test.is_nil(all_kinds(h, { id = id }).status)
        end)

        test.it("keeps origin and source on product rows and channels on release rows", function()
            local h = fixture.catalog()
            fixture.boot(h)
            h.call("apply", { source = "pricing", origin = { type = "feed", id = "feed-7" }, items = { { product = { sku = "RDG" }, seq = 3,
                set = { { attr = "pricing.retail", value = "189.00" } } } } })
            local rows = (h.call("list_history", { product = { sku = "RDG" }, limit = 1 }) :: types.HistoryResult).entries
            test.eq(rows[1].source, "pricing")
            test.eq(obj(rows[1].origin).origin.id, "feed-7")
            h.call("release", { items = { { product = { sku = "RDG-moss-40" }, expect_version = version(h, "RDG-moss-40") } } })
            local released = (h.call("list_history", { product = { sku = "RDG-moss-40" }, limit = 1 }) :: types.HistoryResult).entries[1]
            test.eq(released.kind, "released")
            test.not_nil(obj(released.after).release_id)
            local published = obj(released.after).channels :: { string }
            test.is_true(#published > 0)
            h.call("withdraw", { items = { { product = { sku = "RDG-moss-40" }, channels = { published[1] } } } })
            local withdrawn = (h.call("list_history", { product = { sku = "RDG-moss-40" }, limit = 1 }) :: types.HistoryResult).entries[1]
            test.eq(withdrawn.kind, "withdrawn")
            local channels = obj(withdrawn.after).channels :: { string }
            test.eq(#channels, 1)
            test.eq(channels[1], published[1])
        end)

        test.it("keeps source and producer attribution on a trash event", function()
            local h = fixture.catalog()
            local id = assert(steps.one(h, { product = { sku = "AUDITED-DELETE" }, create = {} }).product_id)
            local result = assert(h.call("apply", { source = "erp", origin = { type = "feed", id = "cycle-count" }, items = {
                { product = { id = id }, delete = true, expect_version = 1 },
            } })) :: types.ApplyResult
            test.eq(result.outcomes[1].outcome, "updated")
            local history = assert(h.call("list_history", { product = { id = id }, limit = 1 })) :: types.HistoryResult
            local entry = history.entries[1]
            test.eq(entry.kind, "deleted")
            test.eq(entry.source, "erp")
            test.eq(obj(obj(entry.origin).origin).id, "cycle-count")
        end)

        test.it("keeps reported provenance when an apply has no origin", function()
            local h = fixture.catalog()
            local id = assert(steps.one(h, { product = { sku = "EVIDENCE" }, create = {} }).product_id)
            local out = assert(h.call("apply", { provenance = { evidence = "inventory count" }, items = {
                { product = { id = id }, expect_version = 1, status = "draft" },
            } })) :: types.ApplyResult
            test.eq(out.outcomes[1].outcome, "updated")
            local view = assert(h.call("list_history", { product = { id = id }, limit = 1 })) :: types.HistoryResult
            test.eq(view.entries[1].kind, "status")
            test.not_nil(view.entries[1].origin, "history lost independently supplied provenance")
            local origin = view.entries[1].origin :: types.JsonObject
            test.eq((origin.provenance :: types.JsonObject).evidence, "inventory count")
        end)

        test.it("keeps reported provenance when the editor provides no origin", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local editor, editor_id = fixture.user(h)
            assert(h.call("grant", { subject_id = editor_id, mask = 3 }))
            local applied = assert(editor("apply", { provenance = { detail = "Reviewed copy" }, items = {
                { product = { sku = "RDG" }, expect_version = version(h, "RDG"),
                    set = { { attr = "core.care", value = "Updated care instructions" } } },
            } })) :: types.ApplyResult
            test.eq(applied.outcomes[1].outcome, "updated")
            local page = assert(h.call("list_history", { product = { sku = "RDG" }, limit = 1 })) :: types.HistoryResult
            local row = page.entries[1]
            test.eq(row.actor, editor_id)
            test.eq(row.kind, "set")
            test.not_nil(row.origin, "reported provenance should be present in history")
            test.eq(obj(obj(row.origin).provenance).detail, "Reviewed copy")
        end)

        test.it("keeps the authenticated actor and named source on trash and restore rows", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local sku = "RDG-moss-40"
            local id = assert(steps.get(h, sku)).product.product_id
            local origin = { type = "feed", id = "erp-catalog" }
            local trashed = assert(h.call("apply", { source = "erp", origin = origin, items = {
                { product = { id = id }, expect_version = "any", delete = true },
            } })) :: types.ApplyResult
            test.is_true(trashed.outcomes[1].trashed == true)
            local restored = assert(h.call("apply", { source = "erp", origin = origin, items = {
                { product = { id = id }, expect_version = "any", restore = true },
            } })) :: types.ApplyResult
            test.is_true(restored.outcomes[1].restored == true)

            local page = assert(h.call("list_history", { product = { id = id }, limit = 2 })) :: types.HistoryResult
            test.eq(page.entries[1].kind, "restored")
            test.eq(page.entries[2].kind, "deleted")
            test.eq(page.entries[1].actor, h.actor:id())
            test.eq(page.entries[2].actor, h.actor:id())
            test.eq(table.concat({ page.entries[1].source or "missing", page.entries[2].source or "missing" }, ","),
                "erp,erp", "source on restore and trash rows")
            for _, row in ipairs(page.entries) do
                test.eq(obj(obj(row.origin).origin).id, origin.id)
            end
        end)

        test.it("hands out a cursor on a full last page and an empty page after it", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local id = h.call("get", { product = { sku = "RDG-moss-40" } }).product.product_id
            local full = all_kinds(h, { id = id })
            local count = 0
            for _, n in pairs(full) do count = count + n end
            local page = h.call("list_history", { product = { id = id }, limit = count }) :: types.HistoryResult
            test.eq(#page.entries, count)
            test.not_nil(page.next)
            local after = h.call("list_history", { product = { id = id }, limit = count, before = page.next }) :: types.HistoryResult
            test.eq(#after.entries, 0)
            test.is_nil(after.next)
        end)
    end)

    test.describe("audit policy", function()
        test.it("records value changes by default and lifecycle rows always", function()
            local h = fixture.catalog()
            fixture.boot(h)
            rename(h, "RDG-moss-40", "040000000040")
            local page = h.call("list_history", { product = { sku = "RDG-moss-40" }, limit = 50 }) :: types.HistoryResult
            local k = kinds(page)
            test.eq(k.created, 1)
            test.eq(page.entries[1].kind, "set")
            test.eq(page.entries[1].attribute, "core.gtin")
            test.eq(page.entries[1].before, "0400moss40")
            test.eq(page.entries[1].after, "040000000040")
        end)

        test.it("stops value rows from the next command when the catalog turns audit off", function()
            local h = fixture.catalog()
            fixture.boot(h)
            rename(h, "RDG-moss-40", "1")
            local out, err = h.call("apply_schema", { declaration = { policy = { audit = "off" } } })
            test.is_nil(err)
            test.eq(out.class, "cosmetic")
            rename(h, "RDG-moss-40", "2")
            local page = h.call("list_history", { product = { sku = "RDG-moss-40" }, limit = 50 })
            local afters: { unknown } = {}
            for _, e in ipairs(page.entries) do if e.kind == "set" and e.attribute == "core.gtin" then afters[#afters + 1] = e.after end end
            test.eq(#afters, 2)
            test.eq(afters[1], "1")
            test.eq(afters[2], "0400moss40")
            local catalog = h.call("list_history", { limit = 1 })
            test.eq(catalog.entries[1].kind, "schema")
            local schema_rows = h.call("list_history", { limit = 50 })
            local saw_schema = false
            for _, e in ipairs(schema_rows.entries) do if e.kind == "schema" and e.after.class == "cosmetic" then saw_schema = true end end
            test.is_true(saw_schema)
            local back, berr = h.call("apply_schema", { declaration = { policy = { audit = false } } })
            test.is_nil(berr)
            test.eq(back.class, "cosmetic")
            rename(h, "RDG-moss-40", "3")
            local again = h.call("list_history", { product = { sku = "RDG-moss-40" }, limit = 1 })
            test.eq(again.entries[1].after, "3")
        end)

        test.it("leaves out value rows written by a source excluded from audit", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local _, err = h.call("apply_schema", { declaration = { sources = {
                { id = "erp", ordering = "none", writes = { "core", "logistics" }, audit = false } } } })
            test.is_nil(err)
            local before = #h.call("list_history", { product = { sku = "RDG-moss-41" }, limit = 50 }).entries
            rename(h, "RDG-moss-41", "erp-1", "erp")
            test.eq(#h.call("list_history", { product = { sku = "RDG-moss-41" }, limit = 50 }).entries, before)
            rename(h, "RDG-moss-41", "user-1")
            local later = h.call("list_history", { product = { sku = "RDG-moss-41" }, limit = 1 })
            test.eq(later.entries[1].after, "user-1")
            test.eq(later.entries[1].before, "erp-1")
        end)

        test.it("records status changes with the status they replaced", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local v = h.call("get", { product = { sku = "RDG-moss-40" } }).product.version
            local out = h.call("apply", { items = { { product = { sku = "RDG-moss-40" }, expect_version = v, status = "draft" } } })
            test.eq(out.outcomes[1].outcome, "updated")
            local page = h.call("list_history", { product = { sku = "RDG-moss-40" }, limit = 1 }) :: types.HistoryResult
            test.eq(page.entries[1].kind, "status")
            test.eq(page.entries[1].before, "active")
            test.eq(page.entries[1].after, "draft")
        end)

        test.it("applies a policy change without a rebuild", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local out = h.call("apply_schema", { declaration = { policy = { audit = "off", trash_days = 30 } } })
            test.eq(out.class, "cosmetic")
            test.is_false(h.call("query", {}).rebuilding)
            local schema_view = h.call("get_schema", {})
            test.eq(schema_view.declaration.policy.trash_days, 30)
        end)

        test.it("refuses a policy value outside its bounds", function()
            local h = fixture.catalog()
            local _, err = h.call("apply_schema", { declaration = { policy = { audit = "sometimes" } } })
            test.not_nil(err)
            local _, derr = h.call("apply_schema", { declaration = { policy = { trash_days = 0 } } })
            test.not_nil(derr)
            local _, kerr = h.call("apply_schema", { declaration = { policy = { colour = 1 } } })
            test.not_nil(kerr)
        end)
    end)

    test.describe("settings hook", function()
        test.it("bounds deployment retention settings in both metadata and validation", function()
            for _, key in ipairs({ "audit_days", "trash_days", "tombstone_days" }) do
                local accepted = funcs.call("kickside.pim.settings:validate", { key=key, value=106751 })
                test.is_true(accepted.valid, key)
                local refused = funcs.call("kickside.pim.settings:validate", { key=key, value=106752 })
                test.is_false(refused.valid, key)
                local definition = assert(registry.get("kickside.pim.settings:" .. key))
                local data = definition.data :: { [string]: unknown }
                local schema = data.schema :: { [string]: unknown }
                test.eq(schema.maximum, 106751, key)
            end
        end)

        test.it("declares the audit choices as strings and accepts policy values, rejecting others", function()
            local definition = assert(registry.get("kickside.pim.settings:audit"))
            local data = definition.data :: { [string]: unknown }
            local choices = (data.schema :: { [string]: unknown }).enum :: { unknown }
            test.eq(choices[1], "fields")
            test.eq(choices[2], "off")
            local ok = funcs.call("kickside.pim.settings:validate", { key = "audit", value = "off" })
            test.is_true(ok.valid)
            local bad = funcs.call("kickside.pim.settings:validate", { key = "audit", value = "verbose" })
            test.is_false(bad.valid)
            local short = funcs.call("kickside.pim.settings:validate", { key = "trash_days", value = 0 })
            test.is_false(short.valid)
            local keep = funcs.call("kickside.pim.settings:validate", { key = "audit_days", value = 0 })
            test.is_true(keep.valid)
        end)
    end)
end

return { run = test.run_cases(define) }
