-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local fs = require("fs")
local funcs = require("funcs")
local registry = require("registry")
local security = require("security")
local sql = require("sql")
local time = require("time")
local test = require("test")
local fixtures = require("fixtures")
local content = require("content")
local lookup = require("lookup")
local api_fixtures = require("api_fixtures")
local component = require("component")
local jobs = require("jobs")

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
        local lifecycle, lifecycle_scope, deleting
        test.before_all(function()
            lifecycle = assert(security.new_actor("system:lifecycle", {system = true, groups = {"system", "lifecycle"}}))
            lifecycle_scope = assert(security.named_scope("wippy.security:process"))
        end)

        test.after_all(function()
            if not deleting then return end
            local component_id = content.library_component_id()
            local thread_definition = assert(contract.get("kickside.core:threads"))
            local threads = assert(thread_definition:with_actor(lifecycle):with_scope(lifecycle_scope):open())
            local binding = assert(registry.get(KIND))
            local declared = binding.meta.provision
            local restored, restore_err = threads:create({id = component_id, impl_id = KIND,
                thread_class = binding.meta.thread.class, title = binding.meta.title, icon = binding.meta.icon})
            assert(restored, "Restore Mail library thread: " .. tostring(restore_err))
            test.eq(component_id, restored.thread_id)
            local component_definition = assert(contract.get("kickside.component:component_service"))
            local owner = assert(component_definition:with_actor(lifecycle):with_scope(lifecycle_scope):open())
            for _, grant in ipairs(declared.grants) do
                local granted = assert(owner:grant_subtree({root_component_id = component_id,
                    subject = {subject_id = grant.subject_id, subject_type = grant.subject_type},
                    access_mask = grant.access_mask}))
                assert(granted.success, tostring(granted.error))
            end
            local boot = assert(funcs.call("kickside.mail.jobs:reconcile"))
            assert(boot.status == "success", tostring(boot.message))
            fixtures.await_current_live()
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
            local who = api_fixtures.session("upload_editor")
            local storage = assert(fs.get("app:uploads"))
            local gif = "GIF89a\1\0\1\0\128\0\0\0\0\0\255\255\255!\249\4\1\0\0\0\0,\0\0\0\0\1\0\1\0\0\2\2D\1\0;"
            local editor = assert(funcs.new():with_actor(who.actor):with_scope(who.scope))
            local source = assert(editor:call("app.mail_library:upload_fixture", {mime = "image/gif", bytes = gif}))
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
            local original_due = assert(rows("SELECT due_at FROM mail_asset_file WHERE upload_id=$1", {upload.uuid})[1]).due_at
            local expected_due = math.min(original_due or now, now)
            for _ = 1, 2 do
                test.is_true(assert(teardown:delete({})).success)
                for _, name in ipairs({"mail_library", "mail_library_asset", "mail_library_history", "mail_library_reference",
                    "mail_library_preview", "mail_library_live", "mail_library_upload_ref"}) do
                    test.eq(0, #rows("SELECT 1 FROM " .. name .. " LIMIT 1"), name)
                end
                test.eq(0, #assert(assert(registry.overlay("kickside.mail.render:live")):entries()))
                local ledger = rows("SELECT due_at FROM mail_asset_file WHERE upload_id=$1", {upload.uuid})
                test.eq(expected_due, assert(ledger[1]).due_at)
            end
            test.is_true(storage:exists(upload.storage_path))
            local definition = assert(contract.get("kickside.component:component_service"))
            local owner = assert(definition:with_actor(lifecycle):with_scope(lifecycle_scope):open())
            local deletion = assert(owner:delete({component_id = component_id}))
            test.is_true(deletion.success, tostring(deletion.error))
            deleting = true
            test.is_true(deletion.cleanup_pending)
            local job_id = assert(deletion.job_id)
            fixtures.await(function()
                local job, err = jobs.get_job(job_id)
                assert(not err, tostring(err))
                if not job then return false end
                assert(job.status ~= "dead" and job.status ~= "cancelled", tostring(job.last_error))
                return job.status == "done"
            end, "Component deletion job did not complete")
            local threads = assert(assert(contract.get("kickside.core:threads")):open())
            fixtures.await(function()
                local step = assert(funcs.call("kickside.component:retention",
                    {change = {owner_locator = {kind = "component", id = component_id}}}))
                assert(step.success, tostring(step.error))
                if step.needs_continue then return false end
                local components = assert(component.list_system({component_ids = {component_id}}))
                if #components ~= 0 then return false end
                local boundary, err = threads:prune_boundary({thread_id = component_id})
                if err then assert(errors.is(err, errors.NOT_FOUND), tostring(err)) end
                return boundary == nil and err ~= nil
            end, "Component deletion did not purge the library and its thread")
            local retention = assert(funcs.new():with_context({mail_test_now = now}))
            local swept = assert(retention:call("kickside.mail.jobs:owner", {}))
            test.is_true(swept.success, tostring(swept.error))
            test.is_false(storage:exists(upload.storage_path))
            test.eq(0, #rows("SELECT 1 FROM mail_asset_file WHERE upload_id=$1", {upload.uuid}))
            test.eq(0, #rows("SELECT 1 FROM mail_library_live"))
            local cleanup = assert(editor:call("app.mail_library:upload_fixture", {cleanup = true}))
            assert(cleanup.success, tostring(cleanup.error))
        end)
    end)
end)}
