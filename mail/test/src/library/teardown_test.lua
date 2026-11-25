-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local fs = require("fs")
local funcs = require("funcs")
local registry = require("registry")
local security = require("security")
local sql = require("sql")
local time = require("time")
local uuid = require("uuid")
local test = require("test")
local fixtures = require("fixtures")
local content = require("content")
local records = require("records")
local lookup = require("lookup")
local upload_types = require("upload_types")
local api_fixtures = require("api_fixtures")
local component = require("component")
local provision = require("provision")

local KIND = "kickside.mail.binding:library"

local function open(contract_id, component_id, now)
    local definition = assert(contract.get(contract_id))
    return assert(definition:open(KIND, {component_id = component_id, mail_test_now = now}))
end

local function rows(statement, args)
    local db = assert(sql.get("app:db"))
    local result, err = db:query(statement, args or {})
    assert(db:release())
    return assert(result, tostring(err))
end

return {run = test.run_cases(function()
    test.describe("Mail library teardown", function()
        test.after_all(function()
            local actor = assert(security.new_actor("system:lifecycle", {system = true, groups = {"system", "lifecycle"}}))
            local scope = assert(security.named_scope("wippy.security:process"))
            assert(provision.ensure_system(actor, scope))
            assert(assert(funcs.call("kickside.mail.jobs:reconcile")).status == "success")
        end)

        test.it("describes the library through its component status binding", function()
            local declaration = assert(registry.get(KIND))
            test.eq("kickside.mail.binding:status", declaration.data.contracts[1].methods.get_status)
            local status = assert(open("kickside.contract:component", content.library_component_id()):get_status({}))
            test.is_true(status.description:find("Mail library", 1, true) ~= nil)
        end)

        test.it("clears library state twice and leaves uploaded bytes for retention", function()
            local component_id = content.library_component_id()
            local now = time.now():add(time.HOUR):unix_nano() // 1000000
            local teardown = open("kickside.contract:deletable", component_id, now)
            local who = api_fixtures.session("editor")
            local owner = upload_types.component_id_for_owner(who.id)
            local editor = assert(funcs.new():with_actor(who.actor):with_scope(assert(security.named_scope("wippy.security:process"))))
            local registered = assert(editor:call("kickside.component.binding:register_component_func",
                {component_id = owner, impl_id = upload_types.IMPL}))
            assert(registered.success, tostring(registered.error))
            local storage = assert(fs.get("app:uploads"))
            local source = uuid.v4()
            local gif = "GIF89a\1\0\1\0\128\0\0\0\0\0\255\255\255!\249\4\1\0\0\0\0,\0\0\0\0\1\0\1\0\0\2\2D\1\0;"
            assert(storage:writefile(source, gif))
            assert(records.create(source, who.id, #gif, "image/gif", "app:uploads", source,
                "kickside.uploads:types.generic", {filename = "mark"}, "completed"))
            local image = assert(fixtures.call(editor, "add_asset", {kind = "asset", name = "teardown-image", upload_id = source}))
            local upload = assert(lookup.get(image.asset.upload_id))
            local message = {kind = "message", name = "teardown-message", title = "Teardown", description = "",
                subject = "Teardown", base = "plain", html = "{{ block body() }}Mail{{ end }}",
                text = "{{ block body() }}Mail{{ end }}", schema = {type = "object", properties = {}}, samples = {}}
            local preview = assert(fixtures.call(editor, "preview", {message = message.name, create = message}))
            message.preview_id = assert(preview.preview_id)
            local saved = assert(fixtures.call(editor, "create", message))
            fixtures.await_live(saved.seq)
            fixtures.await_sync_idle()
            for _ = 1, 2 do
                test.is_true(assert(teardown:delete({})).success)
                for _, name in ipairs({"mail_library", "mail_library_asset", "mail_library_history", "mail_library_reference",
                    "mail_library_preview", "mail_library_live", "mail_library_upload_ref"}) do
                    test.eq(0, #rows("SELECT 1 FROM " .. name .. " LIMIT 1"), name)
                end
                test.eq(0, #assert(assert(registry.overlay("kickside.mail.render:live")):entries()))
                local ledger = rows("SELECT due_at FROM mail_asset_file WHERE upload_id=$1", {upload.uuid})
                test.is_true(ledger[1] and ledger[1].due_at <= now)
            end
            test.is_true(storage:exists(upload.storage_path))
            local deleted, delete_err = component.system_delete(component_id)
            assert(deleted or (delete_err:details() or {}).cleanup_pending, tostring(delete_err))
            fixtures.await(function()
                return #rows("SELECT id FROM kickside_thread WHERE id=$1", {component_id}) == 0
            end, "Component deletion did not purge the library thread")
            local retention = assert(funcs.new():with_context({mail_test_now = now}))
            local swept = assert(retention:call("kickside.mail.jobs:owner", {}))
            test.is_true(swept.success, tostring(swept.error))
            test.is_false(storage:exists(upload.storage_path))
            test.eq(0, #rows("SELECT 1 FROM mail_asset_file WHERE upload_id=$1", {upload.uuid}))
            test.eq(0, #rows("SELECT 1 FROM mail_library_live"))
        end)
    end)
end)}
