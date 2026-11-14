-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Every board is its own component: its schema, plugins and settings are data on that
-- board, and app settings only supply defaults. Two boards share one install here.
local test = require("test")
local scoped = require("scoped")
local steps = require("steps")
local fixture = require("fixture")
local provider = require("provider")

type Map = { [string]: unknown }

local function declaration(extra: { Map }, relations: { Map }): Map
    local d = fixture.declaration(fixture.fresh_prefix())
    local fields = d.fields :: { Map }
    local item_types = d.item_types :: { Map }
    for _, f in ipairs(extra) do
        fields[#fields + 1] = f
        for _, t in ipairs(item_types) do
            local carried = t.fields :: { string }
            carried[#carried + 1] = f.code :: string
        end
    end
    d.relation_types = relations
    return d
end

local function codes(schema: Map): { [string]: boolean }
    local out: { [string]: boolean } = {}
    for _, f in ipairs(((schema.compiled :: Map).fields) :: { Map }) do out[f.code :: string] = true end
    return out
end

local function pair(): (fixture.Handle, fixture.Handle, scoped.Session)
    local admin = scoped.admin()
    local a = scoped.board(admin, declaration({ { code = "rating", type = "option", index = "key", options = { { id = "high" }, { id = "low" } } },
        { code = "severity", form = "int", index = "number", track = true } }, { { id = "blocks", outward = "blocks", inward = "blocked_by" } }))
    local b = scoped.board(admin, declaration({ { code = "rating", form = "int", index = "number", track = true } }, {}))
    return a, b, admin
end

local function define()
    test.describe("board isolation", function()
        test.it("reports the resolved board alongside an item returned by key", function()
            local a, other = fixture.board(), fixture.board()
            assert(other.call("grant", { subject_id = a.actor:id(), mask = 1 }))
            local id = steps.create(other, "task", {})
            local item = assert(other.call("get", { item = { id = id } })).item
            test.eq(assert(a.call("get", { item = { key = item.key } })).item.board_id, other.id)
        end)
        test.it("keeps schemas apart and writes each item against its own board", function()
            local a, b = pair()
            local sa, sb = assert(a.call("get_schema", {})) :: Map, assert(b.call("get_schema", {})) :: Map
            test.is_true(codes(sa).severity)
            test.is_nil(codes(sb).severity)
            test.eq(#((sa.declaration :: Map).relation_types :: { Map }), 1)
            test.eq(#((sb.declaration :: Map).relation_types :: { Map }), 0)
            local on_a = steps.create(a, "task", { rating = "high", severity = 2 })
            local on_b = steps.create(b, "task", { rating = 5 })
            for _, refused in ipairs({ { a, { rating = 5 } }, { b, { rating = "high" } }, { b, { severity = 2 } } }) do
                local h = refused[1] :: fixture.Handle
                test.eq(steps.one(h, { op = "create", type = "task", values = refused[2] }).status, "invalid")
            end
            assert(b.call("apply_schema", { declaration = { fields = { { code = "note", form = "text" } } } }))
            test.is_nil(codes(assert(a.call("get_schema", {})) :: Map).note)
            test.eq(#(assert(a.call("query", { where = { field = "rating", op = "eq", value = "high" } })) :: Map).items :: { Map }, 1)
            test.eq(((assert(a.call("query", {})) :: Map).items :: { Map })[1].id, on_a)
            test.eq(((assert(b.call("query", { where = { field = "rating", op = "gte", value = 5 } })) :: Map).items :: { Map })[1].id, on_b)
            local _, wrong_form = b.call("query", { where = { field = "rating", op = "eq", value = "high" } })
            test.not_nil(wrong_form)
            local _, unknown = b.call("query", { where = { field = "severity", op = "eq", value = 2 } })
            test.eq((unknown :: error):details().code, "unknown_field")
            local crossed, cross_err = steps.get(b, on_a)
            test.is_nil(crossed)
            test.not_nil(cross_err)
        end)

        test.it("keeps plugin activation and configuration on the board that names them", function()
            local a, b = pair()
            local entry = { use = "app:work_plugin" }
            assert(a.call("apply_schema", { declaration = { plugins = { entry }, fields = { { code = "external", type = "app:work_type", index = "number" } } },
                plugin_configs = { ["app:work_plugin"] = { threshold = 3 } } }))
            local _, unlisted = b.call("apply_schema", { declaration = { fields = { { code = "external", type = "app:work_type", index = "number" } } } })
            test.eq((unlisted :: error):details().code, "plugin_seam_unowned")
            for _, plugin in ipairs((assert(b.call("get_schema", {})) :: Map).plugins :: { Map }) do test.eq(plugin.active, false) end
            assert(b.call("apply_schema", { declaration = { plugins = { entry } }, plugin_configs = { ["app:work_plugin"] = { threshold = 8 } } }))
            local pa = ((assert(a.call("get_schema", {})) :: Map).plugins :: { Map })[1]
            local pb = ((assert(b.call("get_schema", {})) :: Map).plugins :: { Map })[1]
            test.is_true(pa.attachment_id ~= pb.attachment_id)
            test.eq((pa.config :: Map).threshold, 3)
            test.eq((pb.config :: Map).threshold, 8)
            assert(a.call("configure_plugin", { plugin = "app:work_plugin", config = { threshold = 5 } }))
            pa = ((assert(a.call("get_schema", {})) :: Map).plugins :: { Map })[1]
            pb = ((assert(b.call("get_schema", {})) :: Map).plugins :: { Map })[1]
            test.eq((pa.config :: Map).threshold, 5)
            test.eq((pb.config :: Map).threshold, 8)
        end)

        test.it("takes plugin config from the board over the app settings of the plugin", function()
            local a, b, admin = pair()
            local fragment = { fields = { { code = "supplied", form = "int", index = "number" } }, item_types = { { id = "task", fields = { "supplied" } } } }
            provider.seed(a.id, fragment)
            provider.seed(b.id, fragment)
            local set = assert(admin.call("set_setting", { namespace = "app.board_settings", key = "extra", value = true })) :: Map
            test.is_nil(set.error)
            assert(a.call("apply_schema", { declaration = { plugins = { { use = "app:settings_provider" } } } }))
            assert(b.call("apply_schema", { declaration = { plugins = { { use = "app:settings_provider" } } },
                plugin_configs = { ["app:settings_provider"] = { extra = false } } }))
            test.is_true(codes(assert(a.call("get_schema", {})) :: Map).configured)
            test.is_nil(codes(assert(b.call("get_schema", {})) :: Map).configured)
            assert(admin.call("unset_setting", { namespace = "app.board_settings", key = "extra" }))
        end)

        test.it("holds a board setting over the app default and leaves the other board on it", function()
            local a, b, admin = pair()
            local function policy(h: fixture.Handle): Map
                return ((assert(h.call("get_schema", {})) :: Map).compiled :: Map).policy :: Map
            end
            local initial = assert(admin.call("set_setting", { namespace = "kickside.work", key = "trash_days", value = 30 }))
            test.is_true(initial.success == true, tostring(initial.error))
            assert(a.call("apply_schema", { declaration = { policy = { trash_days = 7, audit = "off" } } }))
            test.eq(policy(a).trash_days, 7)
            test.eq(assert(a.call("get_schema", { generation = 2 })).compiled.policy.trash_days, 7)
            test.eq(assert(a.call("get_schema", { generation = 2 })).compiled.policy.tombstone_days,
                policy(a).tombstone_days)
            test.eq(policy(b).trash_days, 30)
            assert(b.call("apply_schema", { declaration = { fields = { { code = "rating", form = "int", index = "number", track = true, title = "Rating" } } } }))
            test.eq(assert(b.call("get_schema", { generation = 2 })).compiled.policy.trash_days, 30)
            local changed = assert(admin.call("set_setting", { namespace = "kickside.work", key = "trash_days", value = 40 }))
            test.is_true(changed.success == true, tostring(changed.error))
            test.eq(policy(a).trash_days, 7)
            test.eq(policy(b).trash_days, 40)
            test.eq(policy(a).audit, "off")
            test.eq(policy(b).audit, "fields")
            local on_a = steps.create(a, "task", { severity = 1 })
            local on_b = steps.create(b, "task", { rating = 1 })
            test.eq(steps.one(a, { op = "set", item = on_a, values = { severity = 2 } }).status, "applied")
            test.eq(assert(steps.get(a, on_a)).item.values.severity, 2)
            test.eq(steps.one(b, { op = "set", item = on_b, values = { rating = 2 } }).status, "applied")
            test.eq(assert(steps.get(b, on_b)).item.values.rating, 2)
            local function tracked(h: fixture.Handle, item: string): integer
                local found = 0
                for _, entry in ipairs((assert(h.call("list_history", { item = { id = item } })) :: Map).entries :: { Map }) do
                    if entry.kind == "set" then found = found + 1 end
                end
                return found
            end
            test.eq(tracked(a, on_a), 0)
            test.is_true(tracked(b, on_b) > 0)
            assert(admin.call("unset_setting", { namespace = "kickside.work", key = "trash_days" }))
        end)
    end)
end

return { run = test.run_cases(define) }
