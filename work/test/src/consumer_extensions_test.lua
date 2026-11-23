-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local scoped = require("scoped")
local gateway = require("gateway")
local http_client = require("http_client")
local uuid = require("uuid")

local function data(reply)
    assert(reply.status == 200, "HTTP " .. reply.status .. ": " .. tostring(reply.body.error))
    test.is_true(reply.body.success)
    return reply.body.data
end

local function extensions(session, board)
    return data(session.http("POST", session.route(board.id, "get_schema"), { include_extensions = true })).extensions
end

local function by_id(list)
    local map = {}
    for _, placement in ipairs(list) do
        map[placement.id] = placement
    end
    return map
end

local function define()
    test.describe("Work consumer placements", function()
        test.it("admits visible declarations by board ACL and active manifest, and hides historical placements", function()
            local owner = scoped.admin()
            local writer, reader, stranger = scoped.member(), scoped.member(), scoped.member()
            local declaration = fixture.declaration(fixture.fresh_prefix())
            declaration.fields[#declaration.fields + 1] = { code = "private_flag", form = "text", index = "key",
                access = { read = { { user = owner.id } } } }
            declaration.plugins = { { use = "app:work_plugin" }, { use = "app:consumer_private_manifest" } }
            local board = scoped.board(owner, declaration)
            assert(board.call("grant", { subject_id = reader.id, mask = 1 }))
            assert(board.call("grant", { subject_id = writer.id, mask = 3 }))
            local route = reader.route(board.id, "get_schema")
            test.eq(stranger.http("POST", route, { include_extensions = true }).status, 403)
            local anonymous = assert(http_client.request("POST", gateway.url("/api/work/boards" .. route),
                { headers = { ["Content-Type"] = "application/json" }, body = '{"include_extensions":true}' }))
            test.is_true(anonymous.status_code == 401 or anonymous.status_code == 403)
            test.is_nil(data(reader.http("POST", route, {})).extensions)
            local list = extensions(reader, board)
            local visible = by_id(list)
            test.eq(#list, 5)
            local expected = { id = "app:consumer_card", slot = "card_badge", title = "Badge",
                tag = "fixture-badge", access = "read", order = -5, plugin = "app:work_plugin", target = "item:task" }
            for key, value in pairs(expected) do test.eq(list[1][key], value) end
            for key in pairs(list[1]) do test.not_nil(expected[key]) end
            test.eq(visible["app:consumer_drawer"].slot, "drawer_panel")
            test.eq(visible["app:consumer_drawer"].target, "item")
            test.eq(visible["app:consumer_board"].slot, "board_panel")
            test.eq(visible["app:consumer_board"].target, "board:sprints")
            test.eq(visible["app:consumer_filter"].slot, "filter")
            test.is_nil(visible["app:consumer_filter"].tag)
            test.not_nil(visible["app:consumer_scope"], "reader can query the admitted scope")
            local repeated = extensions(reader, board)
            test.eq(#repeated, #list)
            for i, placement in ipairs(repeated) do test.eq(placement.id, list[i].id) end
            local editable = by_id(extensions(writer, board))
            test.not_nil(editable["app:consumer_writer"])
            test.is_nil(editable["app:consumer_admin"])
            local managed = by_id(extensions(owner, board))
            test.not_nil(managed["app:consumer_admin"])
            test.not_nil(managed["app:consumer_unauthorized_manifest"], "owner can discover a manifest hidden from the reader")
            test.is_nil(visible["app:consumer_unauthorized_manifest"])
            test.is_nil(visible["app:consumer_duplicate"])
            test.not_nil(managed["app:consumer_private_field"], "owner can query the restricted field")
            test.is_nil(managed["app:consumer_writer"].data)
            local past = data(reader.http("POST", route, { generation = 1, include_extensions = true }))
            test.is_nil(past.extensions)
            local deactivated = assert(board.call("apply_schema", { declaration = { plugins = {} } }))
            test.is_true(deactivated.generation > 1, "deactivation advances the schema generation")
            local empty = reader.http("POST", route, { include_extensions = true })
            test.eq(#data(empty).extensions, 0)
            test.not_nil(data(empty).compiled)
            test.is_true(empty.raw:find('"extensions":%[%]') ~= nil, "the wire result holds an empty array")
        end)

        test.it("bounds placements after admission and resolves tied orders by registry ID", function()
            local owner = scoped.admin()
            local declaration = fixture.declaration(fixture.fresh_prefix())
            declaration.plugins = { { use = "app:work_plugin" }, { use = "app:model_plugin" } }
            local board = scoped.board(owner, declaration)
            local list = extensions(owner, board)
            local ids = {}
            for _, placement in ipairs(list) do
                if placement.slot == "card_badge" then ids[#ids + 1] = placement.id end
            end
            test.eq(#ids, 16)
            test.eq(ids[1], "app:consumer_card")
            for i = 2, 16 do test.eq(ids[i], string.format("app:consumer_%02d", i - 1)) end
            local visible = by_id(list)
            test.eq(visible["app:consumer_operand"].target, "operand:app:model_operand")
            test.is_nil(visible["app:consumer_unknown_operand"])
        end)

        test.it("reports the exact board create grant with the existing pack catalog", function()
            local owner, member = scoped.admin(), scoped.member()
            local path = "/api/work/packs"
            test.is_true(data(owner.http("GET", path)).can_create_board)
            test.is_false(data(member.http("GET", path)).can_create_board)
            local input = { title = "Consumer packed create", pack = "app:tracker_pack", starter = false, idempotency_key = uuid.v4() }
            local created = data(owner.http("POST", "/api/work/boards", input))
            test.eq(data(owner.http("POST", "/api/work/boards", input)).board_id, created.board_id)
            test.eq(member.http("POST", "/api/work/boards", input).status, 403)
            local _, err = member.call("create", input)
            test.eq(assert(err):details().code, "board_creation_denied")
        end)
    end)
end

return { run = test.run_cases(define) }
