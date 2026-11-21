-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local scoped = require("scoped")
local scope_fixture = require("scope_fixture")

local TRACKER = "app:catalog_tracker_ui"
local ALTERNATE = "app:catalog_alternate_ui"
local PACK = "app:catalog_tracker_pack"

local function create(session: scoped.Session, title: string, app: string?, pack: string?): string
    return assert(session.call("create", { idempotency_key = title, title = title, ui_app = app, pack = pack })).catalog_id
end

local function define()
    test.describe("catalog UI binding", function()
        test.it("filters the caller's readable catalogs by UI before pagination", function()
            local owner, hidden_owner, reader = scoped.member(), scoped.member(), scoped.member()
            local first = create(owner, "Tracker catalog", TRACKER)
            local packed = create(owner, "Packed catalog", nil, PACK)
            local other = create(owner, "Alternate catalog", ALTERNATE, PACK)
            local unbound = create(owner, "Unbound catalog", nil)
            create(hidden_owner, "Hidden catalog", TRACKER)
            for _, id in ipairs({ first, packed, other, unbound }) do
                local _, err = owner.call("grant", { subject_id = reader.id, mask = 1 }, id)
                assert(not err, tostring(err))
            end

            local page = assert(reader.call("list", { ui_app = TRACKER, limit = 1 }))
            test.eq(#page.catalogs, 1)
            test.eq(page.catalogs[1].ui_app, TRACKER)
            test.not_nil(page.after)
            local last = assert(reader.call("list", { ui_app = TRACKER, limit = 1, after = page.after }))
            test.eq(#last.catalogs, 1)
            test.eq(last.catalogs[1].ui_app, TRACKER)
            test.is_nil(last.after)
            local ids = { [page.catalogs[1].catalog_id] = true, [last.catalogs[1].catalog_id] = true }
            test.is_true(ids[first])
            test.is_true(ids[packed])

            local response = scope_fixture.data(reader.http("GET", "?ui_app=app%3Acatalog_alternate_ui", nil), "filtered directory")
            test.eq(#response.catalogs, 1)
            test.eq(response.catalogs[1].catalog_id, other)
            test.eq(response.catalogs[1].ui_app, ALTERNATE)
            local summary = scope_fixture.data(reader.http("GET", "/" .. unbound .. "/summary", nil), "unbound summary")
            test.is_nil(summary.ui_app)
            test.eq(#assert(reader.call("list", { ui_app = TRACKER, admin_only = true })).catalogs, 0)
            test.eq(#assert(reader.call("list", { ui_app = TRACKER, text = "Packed" })).catalogs, 1)
        end)

        test.it("validates a binding before creation and during admin changes", function()
            local owner, writer, admin = scoped.member(), scoped.member(), scoped.member()
            for _, id in ipairs({ "app:missing_catalog_ui", PACK, "app:catalog_invalid_ui", "invalid" }) do
                local _, err = owner.call("create", { idempotency_key = "validated", ui_app = id })
                test.not_nil(err)
                test.eq(err:kind(), errors.INVALID)
                test.eq(err:details().code, "invalid_ui_app")
            end
            local _, missing_pack = owner.call("create", { idempotency_key = "validated", pack = "app:missing_catalog_pack" })
            test.not_nil(missing_pack)
            test.eq(missing_pack:details().code, "invalid_pack")
            local catalog = create(owner, "validated", TRACKER)
            local _, replay_err = owner.call("create", { idempotency_key = "validated", title = "validated", ui_app = ALTERNATE })
            test.not_nil(replay_err)
            test.eq(replay_err:details().code, "idempotency_conflict")
            local _, grant_err = owner.call("grant", { subject_id = writer.id, mask = 3 }, catalog)
            assert(not grant_err, tostring(grant_err))
            local _, denied = writer.call("update", { ui_app = ALTERNATE }, catalog)
            scope_fixture.denied(denied, "catalog WRITE cannot change the binding")
            local raw = assert(writer.call("set_component_meta", { pim_ui_app = ALTERNATE }, catalog))
            test.is_false(raw.success, "general component metadata writes cannot bypass PIM admission")
            local outsider = scoped.outsider()
            local _, outsider_err = owner.call("grant", { subject_id = outsider.id, mask = 3 }, catalog)
            assert(not outsider_err, tostring(outsider_err))
            local outsider_write, err = outsider.call("set_component_meta", { pim_ui_app = ALTERNATE }, catalog)
            test.is_true(err ~= nil or outsider_write.success == false, "the metadata key stays protected outside PIM's member scope")
            local _, invalid = owner.call("update", { ui_app = PACK }, catalog)
            test.not_nil(invalid)
            test.eq(invalid:details().code, "invalid_ui_app")
            test.eq(assert(owner.call("get_catalog", {}, catalog)).ui_app, TRACKER)

            local updated = scope_fixture.data(owner.http("POST", "/" .. catalog .. "/settings", { ui_app = ALTERNATE }), "update")
            test.eq(updated.ui_app, ALTERNATE)
            assert(owner.call("apply_schema", { declaration = { vocabularies = { { code = "sizes" } } } }, catalog))
            test.eq(assert(owner.call("get_catalog", {}, catalog)).ui_app, ALTERNATE)
            test.eq(#assert(writer.call("list", { ui_app = ALTERNATE })).catalogs, 1)
            local _, admin_err = owner.call("grant", { subject_id = admin.id, mask = 8 }, catalog)
            assert(not admin_err, tostring(admin_err))
            local cleared = assert(admin.call("update", { ui_app = "" }, catalog))
            test.is_nil(cleared.ui_app)
            test.is_nil(assert(owner.call("get_catalog", {}, catalog)).ui_app)
            test.eq(#assert(writer.call("list", { ui_app = ALTERNATE })).catalogs, 0)
            test.eq(assert(writer.call("list", {})).catalogs[1].catalog_id, catalog)
            local replayed = assert(owner.call("create", { idempotency_key = "validated", title = "validated", ui_app = TRACKER }))
            test.is_true(replayed.replayed)
            test.is_nil(assert(owner.call("get_catalog", {}, catalog)).ui_app)
        end)
    end)
end

return { run = test.run_cases(define) }
