-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local session = require("session")
local fixture = require("fixture")
local json = require("json")
local uuid = require("uuid")
local registry = require("registry")
local fs = require("fs")
local http_client = require("http_client")
local function board(owner: session.Session): string
    local response = owner.post("/work/boards", { title = "Administration", declaration = fixture.declaration(), idempotency_key = uuid.v4() })
    test.eq(response.status, 200, json.encode(response.body))
    return response.body.data.board_id :: string
end
local function path(id: string, method: string): string return "/work-admin/boards/" .. id .. "/" .. method end
local function cases()
    test.describe("administration module boundaries", function()
        test.it("announces and serves administration, board settings and shared defaults composition", function()
            local member, outsider = session.member(), session.outsider()
            local bundle = assert(fs.get("kickside.work.admin:ui_fs"))
            for _, name in ipairs({ "admin", "board_settings", "defaults" }) do
                local id = "kickside.work.admin:" .. name
                local entry = assert(registry.get(id))
                test.eq(entry.meta.type, "view.component")
                test.is_true(entry.meta.announced); test.is_true(entry.meta.auto_register)
                test.is_true(member.allows("access", id)); test.is_false(outsider.allows("access", id))
                local exists, exists_err = bundle:exists(entry.meta.entry_point :: string)
                test.is_nil(exists_err)
                test.is_true(exists)
                local response, err = http_client.request("GET", "http://127.0.0.1:19241/kickside-work-admin/" .. entry.meta.entry_point)
                test.is_nil(err, tostring(err)); test.eq(response.status_code, 200)
                test.is_true(#response.body > 100)
            end
            for _, name in ipairs({ "index.js", "board.js", "list.js", "table.js", "backlog.js" }) do
                test.is_false(bundle:exists(name), "consumer bundle must not ship: " .. name)
            end
            test.is_false(member.allows("access", "kickside.work.admin.api:unlisted.endpoint"))
            test.is_false(member.allows("funcs.call", "kickside.work.admin.api:unlisted"))
        end)
        test.it("requires a session and board read access before configuration discovery", function()
            local owner, stranger, outsider = session.admin(), session.member(), session.outsider()
            local id = board(owner)
            test.eq(session.get(path(id, "options")).status, 401)
            test.eq(stranger.get(path(id, "options")).status, 403)
            test.eq(outsider.get(path(id, "options")).status, 403)
            local response = owner.get(path(id, "options"))
            test.eq(response.status, 200, json.encode(response.body))
            test.is_true(response.body.data.access.admin)
            test.not_nil(response.body.data.schema_options.plugins)
            test.not_nil(response.body.data.installed_types)
            test.is_nil(response.body.data.panels); test.is_nil(response.body.data.cards)
        end)
        test.it("keeps independent board access and hides configuration options from readers and writers", function()
            local owner = session.admin()
            local id = board(owner)
            for _, mask in ipairs({ 1, 3, 9 }) do
                local user = session.member()
                assert(owner.call("grant", { subject_id = user.id, mask = mask }, id))
                local response = user.get(path(id, "options"))
                test.eq(response.status, 200, json.encode(response.body))
                test.eq(response.body.data.access.read, true)
                test.eq(response.body.data.access.write, mask == 3)
                test.eq(response.body.data.access.admin, mask == 9)
                if mask ~= 9 then
                    test.eq(#response.body.data.schema_options.plugins, 0)
                    test.eq(#response.body.data.installed_types, 0)
                end
            end
        end)
        test.it("discovers access and initializes a legacy board without a schema", function()
            local owner = session.admin()
            local title = "Interrupted initialization " .. uuid.v4()
            local response = owner.post("/work/boards", { title = title, idempotency_key = uuid.v4(), declaration = { key_prefix = "invalid" } })
            test.eq(response.status, 400)
            local id
            for _, row in ipairs(assert(owner.call("list", {})).boards) do if row.title == title then id = row.board_id end end
            test.not_nil(id)
            local options = owner.get(path(id, "options"))
            test.eq(options.status, 200, json.encode(options.body))
            test.is_true(options.body.data.access.admin)
            test.not_nil(options.body.data.installed_types)
            local request = { declaration = { key_prefix = "LEGACY" }, expected_generation = 0 }
            local plan = owner.post("/work/boards/" .. id .. "/plan_schema", request)
            test.eq(plan.status, 200, json.encode(plan.body))
            request.key = uuid.v4()
            local applied = owner.post("/work/boards/" .. id .. "/apply_schema", request)
            test.eq(applied.status, 200, json.encode(applied.body))
            test.eq(applied.body.data.generation, 1)
        end)
        test.it("resolves display names only for a board administrator", function()
            local owner, reader, stranger, outsider = session.admin(), session.member(), session.member(), session.outsider()
            local id = board(owner)
            local request = { refs = { { type = "user", id = owner.id } } }
            assert(owner.call("grant", { subject_id = reader.id, mask = 3 }, id))
            for _, denied in ipairs({ reader, stranger, outsider }) do test.eq(denied.post(path(id, "principal_labels"), request).status, 403) end
            local response = owner.post(path(id, "principal_labels"), request)
            test.eq(response.status, 200, json.encode(response.body))
            test.eq(response.body.data.principals[1].label, "Work test user")
            assert(owner.call("grant", { subject_id = reader.id, mask = 9 }, id))
            test.eq(reader.post(path(id, "principal_labels"), request).status, 200)
        end)
        test.it("validates principal references and their bounded batch size", function()
            local owner = session.admin()
            local id = board(owner)
            for _, request in ipairs({ {}, { refs = { false } }, { refs = { { type = "service", id = "unknown" } } }, { refs = { { type = "user", id = "" } } } }) do
                test.eq(owner.post(path(id, "principal_labels"), request).status, 400)
            end
            local refs = {}
            for _ = 1, 201 do refs[#refs + 1] = { type = "user", id = owner.id } end
            test.eq(owner.post(path(id, "principal_labels"), { refs = refs }).status, 400)
            test.eq(owner.post(path(id, "principal_labels"), { refs = {} }).status, 200)
        end)
    end)
end
return { run = test.run_cases(cases) }
