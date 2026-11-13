-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local scoped = require("scoped")
local registry = require("registry")
local json = require("json")

local function define()
    test.describe("board", function()
        test.it("discovers every readable board through bounded continuation pages", function()
            local h = fixture.board({ bare = true })
            local admin = { call = h.call }
            local expected, seen = {}, {}
            for i = 1, 51 do
                local id = assert(admin.call("create", { idempotency_key = "page-" .. i, title = "Page " .. i })).board_id
                expected[id] = true
            end
            local after
            repeat
                local page = assert(admin.call("list", { limit = 17, after = after }))
                test.is_true(#page.boards <= 17)
                for _, board in ipairs(page.boards) do
                    test.is_nil(seen[board.board_id])
                    seen[board.board_id] = true
                end
                after = page.next
            until after == nil
            for id in pairs(expected) do test.is_true(seen[id], id) end
        end)
        test.it("refuses invalid initial effective plugin configuration before creating a board", function()
            local h = fixture.board({ bare = true })
            local before = assert(h.call("list", {}))
            local declaration = fixture.declaration(fixture.fresh_prefix())
            declaration.plugins = { { use = "app:work_plugin" } }
            local _, err = h.call("create", { idempotency_key = "invalid-initial-config", declaration = declaration,
                plugin_configs = { ["app:work_plugin"] = { threshold = "invalid" } } })
            test.not_nil(err); test.eq(err:kind(), errors.INVALID); test.eq(err:details().code, "plugin_config_invalid")
            test.eq(#assert(h.call("list", {})).boards, #before.boards)
        end)
        test.it("creates a board with its first schema generation", function()
            local h = fixture.board()
            local schema, err = h.call("get_schema", {})
            test.is_nil(err)
            test.eq(schema.generation, 1)
            test.eq(schema.key_prefix, h.prefix)
        end)
        test.it("updates board component metadata and records one closed board event", function()
            local admin = scoped.admin()
            local h = scoped.board(admin)
            local item = steps.create(h, "task", { title = "Item title" })
            local before = #steps.events(h)
            local changed, err = h.call("update", { title = "Planning", description = "Team work", icon = "tabler:briefcase" })
            test.is_nil(err)
            test.eq(changed.status, "updated")
            local events = steps.events(h)
            test.eq(#events, before + 1)
            test.eq(events[#events].type, "kickside.work.events:board.updated")
            test.eq(events[#events].body.title, "Planning", "event title")
            test.eq(events[#events].body.description, "Team work")
            test.eq(events[#events].body.icon, "tabler:briefcase")
            local definition = assert(registry.get("kickside.work.events:board.updated"))
            test.eq(definition.data.schema.additionalProperties, false)
            test.eq(definition.meta.output_kind, "kickside.work.binding:board")
            local port = assert(registry.get("kickside.work.ports:board_updated"))
            test.eq(port.data.binding, "kickside.work.binding:board")
            test.eq(port.data.event, "kickside.work.events:board.updated")
            steps.one(h, { op = "set", item = item, values = { title = "Changed item" } })
            local meta = assert(h.call("get_meta", {})).meta
            test.eq(meta.title, "Planning", "component meta " .. json.encode(meta))
            test.eq(meta.description, "Team work")
            test.eq(meta.icon, "tabler:briefcase")
            local boards = assert(h.call("list", {})).boards
            local found = false
            for _, board in ipairs(boards) do
                if board.board_id == h.id then
                    found = true
                    test.eq(board.title, "Planning")
                    test.eq(board.description, "Team work")
                    test.eq(board.icon, "tabler:briefcase")
                end
            end
            test.is_true(found)
            local got = assert(h.call("get", { item = { id = item } }))
            test.eq(got.title, "Planning")
            test.eq(got.description, "Team work")
            test.eq(got.icon, "tabler:briefcase")
            local count = #steps.events(h)
            test.eq(assert(h.call("update", { title = "Planning", description = "Team work", icon = "tabler:briefcase" })).status, "unchanged")
            test.eq(assert(h.call("update", {})).status, "unchanged")
            test.eq(#steps.events(h), count)
            assert(h.call("update", { description = "", icon = "" }))
            test.eq(assert(h.call("get_meta", {})).meta.description, "")
            test.eq(assert(h.call("get_meta", {})).meta.title, "Planning")
        end)

        test.it("requires board ADMIN independently of WRITE and refuses mutable prefixes", function()
            local admin, writer, board_admin = scoped.admin(), scoped.admin(), scoped.admin()
            local h = scoped.board(admin)
            assert(h.call("grant", { subject_id = writer.id, mask = 3 }))
            assert(h.call("grant", { subject_id = board_admin.id, mask = 8 }))
            local _, err = writer.call("update", { title = "Denied" }, h.id)
            test.not_nil(err)
            test.eq(err:kind(), errors.PERMISSION_DENIED)
            test.eq(assert(board_admin.call("update", { title = "Allowed" }, h.id)).status, "updated")
            local _, prefix_err = h.call("update", { key_prefix = "OTHER" })
            test.not_nil(prefix_err)
            test.eq(prefix_err:kind(), errors.INVALID)
            test.eq(prefix_err:details().code, "prefix_immutable")
            for _, value in ipairs({ 17, {}, false }) do
                local out, refused = h.call("update", { key_prefix = value })
                test.is_nil(out)
                test.not_nil(refused)
                test.eq(refused:kind(), errors.INVALID)
                test.eq(refused:details().code, "prefix_immutable")
            end
            local _, blank_err = h.call("update", { title = "  " })
            test.not_nil(blank_err)
            test.eq(blank_err:kind(), errors.INVALID)
            test.eq(blank_err:details().code, "board_title_blank")
            test.eq(writer.http("POST", "/" .. h.id .. "/update", { title = "Denied" }).status, 403)
            local response = admin.http("POST", "/" .. h.id .. "/update", { description = "HTTP edit" })
            test.eq(response.status, 200)
            test.eq(response.body.data.status, "updated")
        end)

        test.it("edits metadata before a first schema and retains it when the schema arrives", function()
            local h = fixture.board({ bare = true })
            test.eq(assert(h.call("update", { title = "New board", description = "Before schema" })).status, "updated")
            assert(h.call("apply_schema", { declaration = fixture.declaration(h.prefix) }))
            local meta = assert(h.call("get_meta", {})).meta
            test.eq(meta.title, "New board", "bare component meta " .. json.encode(meta))
            test.eq(meta.description, "Before schema")
        end)
    end)
end

return { run = test.run_cases(define) }
