-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local session = require("session")
local fixture = require("fixture")
local json = require("json")
local uuid = require("uuid")

local function board(owner: session.Session): (string, string)
    local declaration = fixture.declaration()
    local response = owner.post("/work/boards", {
        title = "Configured board", declaration = declaration, idempotency_key = (uuid.v4()),
    })
    test.eq(response.status, 200, json.encode(response.body))
    return response.body.data.board_id :: string, declaration.key_prefix :: string
end

local function cases()
    test.describe("Work board administration boundaries", function()
        test.it("rejects an object in place of the principal reference array", function()
            local owner = session.admin()
            local id = board(owner)
            local response = owner.post("/work-admin/boards/" .. id .. "/principal_labels", {
                refs = { owner = { type = "user", id = owner.id } },
            })
            test.eq(response.status, 400, json.encode(response.body))
            test.eq(response.body.details.code, "invalid_principal_refs")
        end)

        test.it("requires only board ADMIN for the schema options contract", function()
            local owner, administrator = session.admin(), session.admin()
            local id = board(owner)
            assert(owner.call("grant", { subject_id = administrator.id, mask = 8 }, id))
            local plan, plan_err = administrator.call("plan_schema", { declaration = {} }, id)
            test.is_nil(plan_err, tostring(plan_err))
            test.not_nil(plan)
            local options, err = administrator.call("schema_options", {}, id)
            test.is_nil(err, tostring(err))
            test.not_nil(options)
            local response = administrator.get("/work-admin/boards/" .. id .. "/options")
            test.eq(response.status, 200, json.encode(response.body))
            test.is_true(response.body.data.access.admin)
            test.is_false(response.body.data.access.read)
            local _, read_err = administrator.call("get_schema", {}, id)
            test.not_nil(read_err)
            test.eq(read_err:kind(), errors.PERMISSION_DENIED)
            local reader = session.member()
            assert(owner.call("grant", { subject_id = reader.id, mask = 1 }, id))
            local _, denied = reader.call("schema_options", {}, id)
            test.not_nil(denied)
            test.eq(denied:kind(), errors.PERMISSION_DENIED)
        end)

        test.it("does not list a board after creation refuses a duplicate prefix", function()
            local owner = session.admin()
            local _, prefix = board(owner)
            local title = "Rejected board " .. uuid.v4()
            local key = uuid.v4()
            local response = owner.post("/work/boards", {
                title = title, declaration = { key_prefix = prefix }, idempotency_key = key,
            })
            test.eq(response.status, 400, json.encode(response.body))
            test.eq(response.body.details.code, "key_prefix_taken", json.encode(response.body))
            local listed = owner.get("/work/boards")
            test.eq(listed.status, 200, json.encode(listed.body))
            for _, entry in ipairs(listed.body.data.boards) do
                test.is_true(entry.title ~= title, json.encode(entry))
            end
            local corrected = owner.post("/work/boards", {
                title = title, declaration = fixture.declaration(), idempotency_key = key,
            })
            test.eq(corrected.status, 200, json.encode(corrected.body))
        end)

        test.it("leaves the create key available after an invalid first declaration", function()
            local owner = session.admin()
            local key = uuid.v4()
            local response = owner.post("/work/boards", {
                title = "Invalid board", declaration = { key_prefix = "?" }, idempotency_key = key,
            })
            test.eq(response.status, 400, json.encode(response.body))
            local corrected = owner.post("/work/boards", {
                title = "Corrected board", declaration = fixture.declaration(), idempotency_key = key,
            })
            test.eq(corrected.status, 200, json.encode(corrected.body))
        end)

        test.it("refuses options for a saved view ID even when its owner has access", function()
            local owner = session.admin()
            local id = board(owner)
            local created = owner.post("/work/boards/" .. id .. "/views", {
                title = "Personal view", view = { type = "list" }, personal = true,
            })
            test.eq(created.status, 200, json.encode(created.body))
            local foreign = owner.get("/work-admin/boards/" .. created.body.data.view_id .. "/options")
            test.eq(foreign.status, 404, json.encode(foreign.body))
            test.eq(foreign.body.details.code, "board_not_found")
        end)

        test.it("plans a change for the visibility removal submitted by Work Admin", function()
            local owner = session.admin()
            local id = board(owner)
            local path = "/work/boards/" .. id
            local applied = owner.post(path .. "/apply_schema", {
                declaration = { visibility = { field = "title", levels = {
                    { id = "restricted", holders = { { user = owner.id } } },
                } } }, expected_generation = 1, key = (uuid.v4()),
            })
            test.eq(applied.status, 200, json.encode(applied.body))
            local loaded = owner.post(path .. "/get_schema", {})
            test.eq(loaded.status, 200, json.encode(loaded.body))
            local draft = loaded.body.data.declaration
            test.not_nil(draft.visibility)
            draft.visibility = nil
            local omitted = owner.post(path .. "/plan_schema", {
                declaration = draft, expected_generation = loaded.body.data.generation,
            })
            test.eq(omitted.status, 200, json.encode(omitted.body))
            test.eq(omitted.body.data.class, "unchanged")
            draft.remove = { visibility = true }
            local plan = owner.post(path .. "/plan_schema", {
                declaration = draft, expected_generation = loaded.body.data.generation,
            })
            test.eq(plan.status, 200, json.encode(plan.body))
            test.eq(plan.body.data.class, "semantic")
            test.eq(plan.body.data.changes[1].what, "visibility")
            local cleared = owner.post(path .. "/apply_schema", {
                declaration = draft, expected_generation = loaded.body.data.generation, key = (uuid.v4()),
            })
            test.eq(cleared.status, 200, json.encode(cleared.body))
            local reloaded = owner.post(path .. "/get_schema", {})
            test.eq(reloaded.status, 200, json.encode(reloaded.body))
            test.is_nil(reloaded.body.data.declaration.visibility)
            test.is_nil(reloaded.body.data.compiled.visibility)
        end)

        test.it("plans the installed integer field selected for a new field in Work Admin", function()
            local owner = session.admin()
            local id = board(owner)
            local path = "/work/boards/" .. id
            local activated = owner.post(path .. "/apply_schema", {
                declaration = { plugins = { { use = "app:settings_plugin" } } },
                expected_generation = 1, key = (uuid.v4()),
            })
            test.eq(activated.status, 200, json.encode(activated.body))
            local options = owner.get("/work-admin/boards/" .. id .. "/options")
            test.eq(options.status, 200, json.encode(options.body))
            local installed = false
            for _, field in ipairs(options.body.data.installed_types) do
                if field.id == "app:settings_integer_field" then installed = true end
            end
            test.is_true(installed)
            local field: { [string]: unknown } = { code = "quantity", type = "app:settings_integer_field", cardinality = "one" }
            local selected = owner.post(path .. "/plan_schema", { declaration = { fields = { field } }, expected_generation = 2 })
            test.eq(selected.status, 200, json.encode(selected.body))
            local applied = owner.post(path .. "/apply_schema", {
                declaration = { fields = { field } }, expected_generation = 2, key = (uuid.v4()),
            })
            test.eq(applied.status, 200, json.encode(applied.body))
            local loaded = owner.post(path .. "/get_schema", {})
            test.eq(loaded.status, 200, json.encode(loaded.body))
            test.eq(loaded.body.data.compiled.fields[2].form, "int")
        end)

        test.it("advertises the configuration for installed reference and measurement fields", function()
            local owner = session.admin()
            local id = board(owner)
            local path = "/work/boards/" .. id
            local activated = owner.post(path .. "/apply_schema", {
                declaration = { plugins = { { use = "app:settings_plugin" } } },
                expected_generation = 1, key = (uuid.v4()),
            })
            test.eq(activated.status, 200, json.encode(activated.body))
            local options = owner.get("/work-admin/boards/" .. id .. "/options")
            test.eq(options.status, 200, json.encode(options.body))
            local types = {}
            for _, field in ipairs(options.body.data.installed_types) do types[field.id] = field end
            local ref, measure = types["app:settings_reference_field"], types["app:settings_quantity_field"]
            test.eq(ref.form, "ref")
            test.eq(ref.config_schema.properties.target.type, "string")
            test.eq(measure.form, "quantity")
            test.eq(measure.config_schema.properties.units.type, "object")
            local selected = owner.post(path .. "/plan_schema", { expected_generation = 2, declaration = { fields = {
                { code = "external_ref", type = ref.id, config = { target = "app:record" } },
                { code = "mass", type = measure.id, config = { canonical = "kg", units = { kg = "1" } } },
            } } })
            test.eq(selected.status, 200, json.encode(selected.body))
        end)
    end)
end

return { run = test.run_cases(cases) }
