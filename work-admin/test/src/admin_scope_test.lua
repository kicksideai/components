-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local session = require("session")
local fixture = require("fixture")
local json = require("json")
local uuid = require("uuid")
local registry = require("registry")

local function cases()
    test.describe("host Work Admin scope composition", function()
        test.it("binds helper endpoints, function calls and discovery to the host-selected group", function()
            local owner, member = session.admin(), session.member()
            local expected = assert(registry.get("app:admin_scope_expectation")).data.members_have_access
            local created = owner.post("/work/boards", {
                title = "Host-scoped board", declaration = fixture.declaration(), idempotency_key = uuid.v4(),
            })
            test.eq(created.status, 200, json.encode(created.body))
            local id = created.body.data.board_id
            assert(owner.call("grant", { subject_id = member.id, mask = 9 }, id))
            local base = "/work-admin/boards/" .. id
            local missing = uuid.v4()
            local request = { refs = {
                { type = "user", id = owner.id },
                { type = "group", id = "kickside.security.groups:members" },
                { type = "user", id = missing },
            } }
            for _, helper in ipairs({ "options", "principals" }) do
                local fn = "kickside.work.admin.api:" .. helper
                for _, grant in ipairs({
                    { "access", fn .. ".endpoint" }, { "funcs.call", fn },
                    { "registry.get", fn }, { "registry.find", "kickside.work.admin:board_settings" },
                }) do
                    test.is_true(owner.allows(grant[1], grant[2]), grant[2])
                    test.eq(member.allows(grant[1], grant[2]), expected, grant[2])
                end
            end
            test.eq(owner.get(base .. "/options").status, 200)
            local labels = owner.post(base .. "/principal_labels", request)
            test.eq(labels.status, 200, json.encode(labels.body))
            local principals = labels.body.data.principals
            test.eq(#principals, 3)
            test.eq(principals[1].id, owner.id)
            test.eq(principals[1].label, "Work test user")
            test.eq(principals[2].type, "group")
            test.eq(principals[2].label, "Member")
            test.eq(principals[3].id, missing)
            test.eq(principals[3].label, missing)
            test.eq(member.get(base .. "/options").status, expected and 200 or 403)
            test.eq(member.post(base .. "/principal_labels", request).status, expected and 200 or 403)
        end)
    end)
end
return { run = test.run_cases(cases) }
