-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local funcs = require("funcs")
local security = require("security")
local fs = require("fs")
local uuid = require("uuid")
local sql = require("sql")
local base64 = require("base64")
local time = require("time")
local json = require("json")
local lookup = require("lookup")
local settings = require("settings")
local records = require("records")
local upload_types = require("upload_types")
local fixtures = require("fixtures")

local LIBRARY = "kickside.mail.library:"
local function setup_actor(groups)
    local id = uuid.v4()
    local db = assert(sql.get("app:db"))
    assert(db:execute([[INSERT INTO app_users (user_id,email,full_name,password_hash,status)
        VALUES ($1,$2,$1,'test-only','active')]], {id, id .. "@example.org"}))
    for _, group in ipairs(groups) do
        assert(db:execute("INSERT INTO app_user_groups (user_id,group_id) VALUES ($1,$2)", {id, group}))
    end
    assert(db:release())
    local actor = assert(security.new_actor(id, {security_groups = groups}))
    local scope = assert(security.named_scope("wippy.security:process"))
    local exec = assert(funcs.new():with_actor(actor):with_scope(scope))
    return id, exec
end

local function define(kind, name, html)
    return {kind = kind, name = name, title = name, description = "", html = html, text = "Plain text",
        schema = {type = "object", properties = {}}, samples = {}}
end

return {run = test.run_cases(function()
    test.describe("Mail library images", function()
        local owned, sources, storage, uploader, editor, configured
        test.before_each(function()
            owned, sources, configured = {}, {}, false
            storage = assert(fs.get("app:uploads"))
            uploader, editor = setup_actor({"app:mail_editors", "app:mail_senders"})
            local owner = upload_types.component_id_for_owner(uploader)
            local registered = assert(editor:call("kickside.component.binding:register_component_func",
                {component_id = owner, impl_id = upload_types.IMPL}))
            assert(registered.success, registered.error)
        end)
        test.after_each(function()
            fixtures.remove(owned)
            if configured then settings.settings("", "") end
            local db = assert(sql.get("app:db"))
            for _, id in ipairs(sources) do
                assert(db:execute("DELETE FROM kickside_uploads WHERE uuid=$1", {id}))
                assert(storage:remove(id))
            end
            assert(db:release())
        end)
        local function call(method, input)
            local result, err = editor:call(LIBRARY .. method, input)
            return assert(result, tostring(err))
        end
        local function upload(mime, bytes)
            local id = uuid.v4()
            assert(storage:writefile(id, bytes))
            assert(records.create(id, uploader, #bytes, mime, "app:uploads", id,
                "kickside.uploads:types.generic", {filename = "mark"}, "completed"))
            sources[#sources + 1] = id
            return id
        end
        local function gif()
            return "GIF89a\1\0\1\0\128\0\0\0\0\0\255\255\255!\249\4\1\0\0\0\0,\0\0\0\0\1\0\1\0\0\2\2D\1\0;"
        end

        local function terminal(executor, id)
            local deadline = time.now():add(25 * time.SECOND):unix_nano()
            repeat
                local entry = assert(executor:call("kickside.mail.outbox:get_message", id))
                if entry.status ~= "queued" then return entry end
                time.sleep("25ms")
            until time.now():unix_nano() >= deadline
            error("The fixture mail remains queued")
        end

        test.it("adopts, replaces, restores and resets an image in the same library", function()
            local original = call("get", {kind = "asset", name = "logo"})
            test.eq("original", original.state)
            local source = upload("image/gif", gif())
            owned[1] = {kind = "asset", name = "logo"}
            local replaced = call("update", {kind = "asset", name = "logo", upload_id = source,
                width = 1, height = 1, expected_revision = original.revision})
            test.eq("customized", replaced.state)
            test.eq(original.origin, replaced.origin)
            test.eq(1, replaced.asset.width)
            test.neq(source, replaced.asset.upload_id)
            local draft = call("render_draft", {message = "notice"})
            test.not_nil(draft.inline_assets["mail-library-logo"]:match("^data:image/gif;base64,"))
            local person = settings.session("editor")
            local preview_client = assert(funcs.new():with_actor(person.actor):with_scope(person.scope))
            local scoped, scoped_err = preview_client:call(LIBRARY .. "render_draft", {message = "notice"})
            assert(scoped, tostring(scoped_err))
            test.eq(draft.inline_assets["mail-library-logo"], scoped.inline_assets["mail-library-logo"])
            local restored_package = call("reset", {kind = "asset", name = "logo", expected_revision = replaced.revision})
            test.eq("original", restored_package.state)
            local history = call("history", {kind = "asset", name = "logo"})
            test.eq("original", history[1].content.asset.source)
            test.is_nil(history[1].content.asset.upload_id)
            local restored = call("restore", {kind = "asset", name = "logo", expected_revision = restored_package.revision,
                revision = replaced.revision})
            test.eq(replaced.asset.upload_id, restored.asset.upload_id)
            local reset = call("restore", {kind = "asset", name = "logo", expected_revision = restored.revision,
                revision = restored_package.revision})
            test.eq("original", reset.state)
            local preview = call("render_draft", {message = "notice"})
            test.not_nil(preview.inline_assets["mail-library-logo"]:match("^data:image/png;base64,"))
        end)

        test.it("finds references in base, part and message output once and guards deletion", function()
            local source = upload("image/gif", gif())
            local image = {kind = "asset", name = "sample-mark", upload_id = source}
            owned[1] = image
            local added = call("create", image)
            local image_tag = '<img src="{{ assets["sample-mark"] }}" alt="Sample">'
            local part = define("part", "assets-fixture-part", image_tag)
            owned[2] = part
            call("create", part)
            local base = define("base", "assets-fixture-base", image_tag ..
                '{{ include "/part/assets-fixture-part" }}{{ block body() }}{{ end }}')
            owned[3] = base
            call("create", base)
            local msg = define("message", "assets-fixture-message", "{{ block body() }}" .. image_tag .. "{{ end }}")
            msg.base, msg.subject = base.name, "Fixture"
            owned[4] = msg
            local saved = call("create", msg)
            local preview = call("render_draft", {message = msg.name})
            local _, occurrences = preview.html:gsub("cid:mail%-library%-sample%-mark", "")
            test.eq(3, occurrences)
            test.eq("mail-library-sample-mark", next(preview.inline_assets))
            test.is_nil(next(preview.inline_assets, "mail-library-sample-mark"))
            configured = true
            settings.settings("capture", "mail@example.org")
            local _, sender = setup_actor({"app:mail_senders"})
            local sent = assert(sender:call("kickside.mail.service:send", {template = msg.name,
                vars = {}, to = {"reader@example.org"}}))
            local delivered = terminal(sender, sent.message_id)
            test.eq("sent", delivered.status, assert(json.encode(delivered.last_error)))
            local captured = assert(json.decode(delivered.provider_message_id))
            test.eq(1, #captured.attachments)
            test.eq("mail-library-sample-mark", captured.attachments[1].content_id)
            test.eq(assert(base64.encode(gif())), captured.attachments[1].base64)

            local plain = define("message", "assets-fixture-plain", "{{ block body() }}Plain HTML{{ end }}")
            plain.base, plain.subject = "plain", "Unreferenced asset"
            plain.text = "{{ block body() }}Plain text{{ end }}"
            owned[5] = plain
            call("create", plain)
            local plain_send = assert(sender:call("kickside.mail.service:send", {template = plain.name,
                vars = {}, to = {"reader@example.org"}}))
            local unreferenced = terminal(sender, plain_send.message_id)
            test.eq("sent", unreferenced.status, assert(json.encode(unreferenced.last_error)))
            local no_assets = assert(json.decode(unreferenced.provider_message_id))
            test.eq(0, #no_assets.attachments)
            local _, err = editor:call(LIBRARY .. "delete", {kind = "asset", name = image.name, expected_revision = added.revision})
            test.eq("mail_resource_in_use", assert(err):details().code)
            test.eq(msg.name, err:details().messages[1])
            call("delete", {kind = "message", name = msg.name, expected_revision = saved.revision})
            assert(editor:call(LIBRARY .. "delete", {kind = "asset", name = image.name, expected_revision = added.revision}))
        end)

        test.it("reads only caller inline uploads referenced by either preview", function()
            local id = upload("image/gif", gif())
            local refs = {{upload_id = id, disposition = "inline", content_id = "chart"},
                {upload_id = uuid.v4(), disposition = "inline", content_id = "unreferenced"}}
            local vars = {subject = "Fixture title", inline_content_id = "chart"}
            local rendered = assert(editor:call("kickside.mail.service:preview", {template = "notice", vars = vars, attachments = refs}))
            local draft = call("render_draft", {message = "notice", vars = vars, attachments = refs})
            local uri = "data:image/gif;base64," .. assert(base64.encode(gif()))
            test.eq(uri, rendered.inline_assets.chart)
            test.eq(uri, draft.inline_assets.chart)
            test.eq(rendered.inline_assets["mail-library-logo"], draft.inline_assets["mail-library-logo"])
            test.is_nil(draft.inline_assets.unreferenced)
            test.is_nil(rendered.inline_assets.unreferenced)
            local colliding = "mail-library-logo"
            vars.inline_content_id = colliding
            refs[1].content_id = colliding
            local distinct = call("render_draft", {message = "notice", vars = vars, attachments = refs})
            test.eq(uri, distinct.inline_assets[colliding])
            test.eq(rendered.inline_assets[colliding], distinct.inline_assets[colliding .. "."])
            test.not_nil(distinct.html:find('src="cid:mail-library-logo."', 1, true))
            local _, stranger = setup_actor({"app:mail_editors"})
            local hidden, err = stranger:call("kickside.mail.service:preview",
                {template = "notice", vars = vars, attachments = {refs[1]}})
            test.is_nil(hidden)
            test.eq(errors.PERMISSION_DENIED, assert(err):kind())
        end)

        test.it("counts adopted inline bytes against the driver at admission", function()
            configured = true
            settings.settings("second", "mail@example.org")
            local original = call("get", {kind = "asset", name = "logo"})
            owned[1] = original
            local request = {template = "notice", vars = {subject = "Asset size", message = "Ready"}, to = {"reader@example.org"}}
            local active = assert(editor:call("kickside.mail.service:send", request))
            test.eq("queued", active.status)
            local _, err = editor:call(LIBRARY .. "update", {kind = "asset", name = "logo",
                upload_id = upload("image/gif", gif() .. string.rep("\0", 80000)), expected_revision = original.revision})
            assert(not err, tostring(err))
            local rejected, size_err = editor:call("kickside.mail.service:send", request)
            test.is_nil(rejected)
            test.eq("message_too_large", assert(size_err):details().code)
        end)

        test.it("reaps an adopted file after its last retained reference is removed", function()
            local source = upload("image/gif", gif())
            local image = {kind = "asset", name = "collectable", upload_id = source}
            owned[1] = image
            local added = assert(editor:call("kickside.mail.traits:asset_add", {name = image.name, upload_id = source}))
            test.eq(image.name, added.name)
            test.eq("created", added.state)
            test.eq(0, #added.messages)
            local saved = call("get", image)
            local version = saved.asset.upload_id
            local record = assert(lookup.get(version))
            test.is_true(storage:exists(record.storage_path))
            local ordinary, delete_err = editor:call("kickside.uploads:delete_owned", {upload_id = version})
            test.is_nil(ordinary)
            test.not_nil(delete_err)
            local message = define("message", "collection-message",
                '{{ block body() }}<img src="{{ assets.collectable }}" alt="Fixture">{{ end }}')
            message.subject = "Resend fixture"
            owned[2] = message
            local template = call("create", message)
            configured = true
            settings.settings("first", "mail@example.org")
            local _, sender = setup_actor({"app:mail_senders"})
            local denied = assert(sender:call("kickside.mail.service:send", {template = message.name,
                vars = {}, to = {"reader@example.org"}}))
            local failure = terminal(sender, denied.message_id)
            test.eq("failed", failure.status)
            test.eq("message_rejected", failure.last_error.code)
            assert(editor:call(LIBRARY .. "delete", {kind = "message", name = message.name, expected_revision = template.revision}))
            assert(editor:call(LIBRARY .. "delete", {kind = "asset", name = image.name, expected_revision = saved.revision}))
            local retained = assert(funcs.call("kickside.mail.outbox:owner", {}))
            test.is_true(retained.success, tostring(retained.error))
            test.is_true(storage:exists(record.storage_path), "The failed delivery keeps the adopted bytes")
            local db = assert(sql.get("app:db"))
            assert(db:execute("UPDATE mail_message SET finished_at=1 WHERE id=$1", {denied.message_id}))
            assert(db:release())
            local expiry = assert(funcs.call("kickside.mail.outbox:owner", {}))
            test.is_true(expiry.success, tostring(expiry.error))
            local check = assert(sql.get("app:db"))
            local links = assert(check:query("SELECT 1 FROM mail_message_asset WHERE message_id=$1", {denied.message_id}))
            assert(check:release())
            test.eq(0, #links)
            local outcome = assert(funcs.call("kickside.mail.outbox:owner", {}))
            test.is_true(outcome.success, tostring(outcome.error))
            test.is_false(storage:exists(record.storage_path))
            local missing, err = lookup.get(version)
            test.is_nil(missing)
            test.eq(errors.NOT_FOUND, assert(err):kind())
        end)

        test.it("refuses oversized files, unsupported media, and another person's upload", function()
            local rejected = {
                {mime = "image/svg+xml", bytes = "<svg/>", code = "mail_asset_media_type"},
                {mime = "image/webp", bytes = "RIFF", code = "mail_asset_media_type"},
                {mime = "text/plain", bytes = "sample", code = "mail_asset_media_type"},
                {mime = "image/png", bytes = string.rep("x", 1024 * 1024 + 1), code = "mail_asset_size"},
            }
            for _, case in ipairs(rejected) do
                local value, err = editor:call(LIBRARY .. "create",
                    {kind = "asset", name = "invalid-image", upload_id = upload(case.mime, case.bytes)})
                test.is_nil(value)
                test.eq(case.code, assert(err):details().code)
            end
            local id = upload("image/gif", gif())
            local reader_id, reader = setup_actor({"app:mail_editors"})
            local result = assert(editor:call("kickside.component.binding:grant_subtree_func",
                {root_component_id = upload_types.component_id_for_owner(uploader),
                    subject = {subject_id = reader_id, subject_type = "user"}, access_mask = 1}))
            assert(result.success, result.error)
            local value, err = reader:call(LIBRARY .. "create", {kind = "asset", name = "foreign-image", upload_id = id})
            test.is_nil(value)
            test.eq("asset_adoption_denied", assert(err):details().code)
        end)
    end)
end)}
