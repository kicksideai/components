-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local security = require("security")
local funcs = require("funcs")
local uuid = require("uuid")
local lookup = require("lookup")
local settings = require("settings")
local upload_types = require("upload_types")
local fixtures = require("fixtures")

local function register(support)
    local test = support.test
    local state = support.state
    local call = support.call
    local upload = support.upload
    local gif = support.gif
    local terminal = support.terminal
    local sweep = support.sweep
    local prune_through = support.prune_through
    local define = support.define
    local setup_actor = support.setup_actor

    test.it("counts adopted inline bytes against the driver at admission", function()
        state.configured = true
        settings.settings("app.mail_harness:second", "mail@example.org")
        local original = call("get", {kind = "asset", name = "logo"})
        state.owned[1] = original
        local request = {template = "notice", vars = {subject = "Asset size", message = "Ready"}, to = {"reader@example.org"}}
        local active = assert(fixtures.mailer(state.editor, "send", request))
        test.eq("queued", active.status)
        request.vars.message = string.rep("a", 9000)
        local preview = call("preview", {message = request.template, vars = request.vars})
        test.not_nil(preview.inline_assets["mail-library-logo"])
        local oversize, budget = fixtures.mailer(state.editor, "send", request)
        test.is_nil(oversize)
        local details = assert(budget):details()
        test.eq("message_too_large", details.code)
        test.eq("max_message_bytes", details.limit)
        test.eq(100000, details.maximum)
        request.vars.message = "Ready"
        local _, err = fixtures.call(state.editor, "add_asset", {kind = "asset", name = "logo",
            upload_id = upload("image/gif", gif() .. string.rep("\0", 80000)), expected_revision = original.revision})
        assert(not err, tostring(err))
        local rejected, size_err = fixtures.mailer(state.editor, "send", request)
        test.is_nil(rejected)
        test.eq("message_too_large", assert(size_err):details().code)
    end)

    test.it("rejects an empty completed upload at send admission", function()
        state.configured = true
        settings.settings("app.mail_harness:capture", "mail@example.org")
        local empty = upload("text/plain", "x")
        state.restore_upload_info = lookup.use_empty_info()
        local result, failure = fixtures.mailer(state.editor, "send", {
            to = {"reader@example.org"}, subject = "An attachment", text = "Please read",
            attachments = {{upload_id = empty}},
        })
        test.is_nil(result)
        test.eq(errors.INVALID, assert(failure):kind())
        test.eq("attachment_empty", failure:details().code)
    end)

    test.it("checks all adopted metadata before reading any adopted attachment bytes", function()
        local original = call("get", {kind = "asset", name = "logo"})
        state.owned[1] = original
        local small = call("add_asset", {kind = "asset", name = "logo", upload_id = upload("image/gif", gif()),
            expected_revision = original.revision})
        local large = call("add_asset", {kind = "asset", name = "large", upload_id = upload("image/gif", gif() .. string.rep("\0", 80000))})
        state.owned[2] = large
        local message = define("message", "adopted-metadata-before-bytes",
            '{{ block body() }}<img src="{{ assets.logo }}"><img src="{{ assets.large }}">{{ end }}')
        message.subject, message.base = "Attachment budget", "plain"
        message.text = "{{ block body() }}Attachment budget{{ end }}"
        state.owned[3] = message
        call("create", message)
        state.configured = true
        settings.settings("app.mail_harness:second", "mail@example.org")
        local adopted = assert(lookup.get(small.asset.upload_id))
        assert(state.storage:remove(adopted.storage_path))
        local files, failure = fixtures.mailer(state.editor, "send", {
            template = message.name, vars = {}, to = {"reader@example.org"},
        })
        assert(state.storage:writefile(adopted.storage_path, gif()))
        test.is_nil(files)
        test.eq("message_too_large", assert(failure):details().code)
    end)

    test.it("reaps an adopted file after its last retained reference is removed", function()
        local source = upload("image/gif", gif())
        local image = {kind = "asset", name = "collectable", upload_id = source}
        state.owned[1] = image
        local added = assert(state.editor:call("kickside.mail.traits:asset_add", {name = image.name, upload_id = source}))
        test.eq(image.name, added.name)
        test.eq("created", added.state)
        test.eq(0, #added.messages)
        local saved = call("get", image)
        local version = saved.asset.upload_id
        local record = assert(lookup.get(version))
        test.is_true(state.storage:exists(record.storage_path))
        local ordinary, delete_err = state.editor:call("kickside.uploads:delete_owned", {upload_id = version})
        test.is_nil(ordinary)
        test.not_nil(delete_err)
        local message = define("message", "collection-message",
            '{{ block body() }}<img src="{{ assets.collectable }}" alt="Fixture">{{ end }}')
        message.subject = "Resend fixture"
        state.owned[2] = message
        local template = call("create", message)
        state.configured = true
        settings.settings("app.mail_harness:admitted", "mail@example.org")
        local _, sender = setup_actor("sender")
        local denied = assert(fixtures.mailer(sender, "send", {template = message.name,
            vars = {}, to = {"reader@example.org"}}))
        local failure = terminal(sender, denied.message_id)
        test.eq("failed", failure.status)
        test.eq("message_rejected", failure.last_error.code)
        assert(fixtures.call(state.editor, "delete", {kind = "message", name = message.name, expected_revision = template.revision}))
        assert(fixtures.call(state.editor, "delete", {kind = "asset", name = image.name, expected_revision = saved.revision}))
        prune_through(saved.seq)
        local retained = assert(funcs.call(fixtures.retention_id(), {}))
        test.is_true(retained.success, tostring(retained.error))
        test.is_true(state.storage:exists(record.storage_path), "The failed delivery keeps the adopted bytes")
        local expires = assert(failure.finished_at) + 30 * 24 * 60 * 60 * 1000 + 1
        sweep(expires)
        local expired, expired_err = fixtures.mailer(sender, "get_message", denied.message_id)
        test.is_nil(expired)
        test.eq("message_not_found", assert(expired_err):details().code)
        sweep(expires)
        test.is_false(state.storage:exists(record.storage_path))
        test.is_nil(lookup.get(version))
    end)

    test.it("refuses oversized files, unsupported media, and another person's upload", function()
        local rejected = {
            {mime = "image/svg+xml", bytes = "<svg/>", code = "mail_asset_media_type"},
            {mime = "image/webp", bytes = "RIFF", code = "mail_asset_media_type"},
            {mime = "text/plain", bytes = "sample", code = "mail_asset_media_type"},
            {mime = "image/png", bytes = string.rep("x", 1024 * 1024 + 1), code = "mail_asset_size"},
        }
        for _, case in ipairs(rejected) do
            local value, err = fixtures.call(state.editor, "add_asset",
                {kind = "asset", name = "invalid-image", upload_id = upload(case.mime, case.bytes)})
            test.is_nil(value)
            test.eq(case.code, assert(err):details().code)
        end
        local id = upload("image/gif", gif())
        local reader_id, reader = setup_actor("editor")
        local owner = assert(security.new_actor(state.uploader))
        local definition = assert(contract.get("kickside.component:component_service"))
        local component = assert(assert(definition:with_actor(owner)):open())
        local result = assert(component:grant_subtree({
            root_component_id = upload_types.component_id_for_owner(state.uploader),
            subject = {subject_id = reader_id, subject_type = "user"}, access_mask = 1,
        }))
        assert(result.success, result.error)
        local value, err = fixtures.call(reader, "add_asset", {kind = "asset", name = "foreign-image", upload_id = id})
        test.is_nil(value)
        test.eq("asset_adoption_denied", assert(err):details().code)
    end)
end

return {register = register}
