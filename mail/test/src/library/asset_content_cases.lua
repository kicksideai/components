-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local security = require("security")
local fs = require("fs")
local uuid = require("uuid")
local sql = require("sql")
local base64 = require("base64")
local contract = require("contract")
local time = require("time")
local json = require("json")
local lookup = require("lookup")
local settings = require("settings")
local upload_types = require("upload_types")
local fixtures = require("fixtures")
local attachments = require("attachments")
local content = require("content")

local function register(support)
    local test = support.test
    local state = support.state
    local call = support.call
    local upload = support.upload
    local gif = support.gif
    local terminal = support.terminal
    local prune_through = support.prune_through
    local define = support.define
    local setup_actor = support.setup_actor

    test.it("reads the current immutable asset version through the library byte reader", function()
        local packaged = call("asset_content", {name = "logo"})
        test.eq("image/png", packaged.content_type)
        local image = {kind = "asset", name = "asset-content-fixture", upload_id = upload("image/gif", gif())}
        state.owned[1] = image
        local member = settings.session("library_capability_only")
        local restricted = assert(funcs.new():with_actor(member.actor):with_scope(member.scope))
        local refused, denied = fixtures.call(restricted, "add_asset", image)
        test.is_nil(refused)
        test.eq("mail_library_write_denied", assert(denied):details().code)
        local added = call("add_asset", image)
        local initial = call("asset_content", {name = image.name})
        test.eq(added.revision, initial.revision)
        test.eq("image/gif", initial.content_type)
        test.eq(gif(), initial.bytes)
        local next_bytes = gif() .. "fixture"
        image.upload_id = upload("image/gif", next_bytes)
        image.expected_revision = added.revision
        local actor = assert(security.new_actor(state.uploader, {user_id = state.uploader, security_groups = {"app:mail_editors"}}))
        local threads = assert(assert(contract.get("kickside.core:threads")):with_actor(actor):open())
        local projection = {thread_id = content.library_component_id(), kind = "kickside.mail:library_tables"}
        assert(threads:pause_projection(projection))
        local replaced, replace_err = fixtures.call(state.editor, "add_asset", image)
        local before = fixtures.call(state.editor, "asset_content", {name = image.name})
        assert(threads:resume_projection(projection))
        assert(replaced, tostring(replace_err))
        test.is_true(replaced.committed)
        test.is_false(replaced.projected)
        test.eq(initial.revision, before.revision)
        test.eq(initial.bytes, before.bytes)
        local folded = assert(threads:catch_up_projection({
            thread_id = projection.thread_id, kind = projection.kind, target_seq = replaced.seq,
            deadline = time.now():add(5 * time.SECOND):format(time.RFC3339),
        }))
        test.is_true(folded.done)
        local projected = call("get", image)
        test.eq(replaced.seq, projected.seq)
        test.eq(0, #projected.used_by.messages)
        local current = call("asset_content", {name = image.name})
        test.eq(projected.revision, current.revision)
        test.neq(initial.revision, current.revision)
        test.eq(next_bytes, current.bytes)
        local previous = call("asset_content", {name = image.name, revision = initial.revision})
        test.eq(initial.revision, previous.revision)
        test.eq(initial.bytes, previous.bytes)
    end)

    test.it("creates and replaces uploads only through add_asset", function()
        local image = {kind = "asset", name = "single-asset-writer", upload_id = upload("image/gif", gif())}
        state.owned[1] = image
        local created, create_err = fixtures.call(state.editor, "create", image)
        test.is_nil(created)
        test.eq("invalid_mail_asset", assert(create_err):details().code)
        local first = call("add_asset", image)
        image.expected_revision = first.revision
        image.upload_id = upload("image/gif", gif() .. "updated")
        local updated, update_err = fixtures.call(state.editor, "update", image)
        test.is_nil(updated)
        test.eq("invalid_mail_asset", assert(update_err):details().code)
        local second = call("add_asset", image)
        test.eq(first.revision + 1, second.revision)
    end)

    test.it("delivers personal uploads for the scoped sender without harness method grants", function()
        state.configured = true
        settings.settings("app.mail_harness:capture", "mail@example.org")
        local member = settings.session("upload_sender", true)
        local setup = assert(funcs.new():with_actor(member.actor):with_scope(assert(security.named_scope("wippy.security:process"))))
        local registration = assert(setup:call("kickside.component.binding:register_component_func", {
            component_id = upload_types.component_id_for_owner(member.id), impl_id = upload_types.IMPL,
        }))
        assert(registration.success, registration.error)
        local original_uploader = state.uploader
        state.uploader = member.id
        local ref = upload("image/gif", gif())
        state.uploader = original_uploader
        test.neq("allow", member.scope:evaluate(member.actor, "contract.call", "get_info"))
        test.neq("allow", member.scope:evaluate(member.actor, "contract.call", "get_content"))
        local sender = assert(funcs.new():with_actor(member.actor):with_scope(member.scope))
        local request = {to = {"reader@example.org"}, subject = "Personal upload",
            text = "Attachment fixture", attachments = {{upload_id = ref}}}
        local sent, err = fixtures.mailer(sender, "send", request)
        assert(sent, tostring(err))
        local other = settings.session("sender", true)
        local stranger = assert(funcs.new():with_actor(other.actor):with_scope(other.scope))
        local result, denied = fixtures.mailer(stranger, "send", request)
        test.is_nil(result)
        test.eq(errors.PERMISSION_DENIED, assert(denied):kind())
        terminal(sender, sent.message_id)
        local admin = settings.session("delivery_sender", true)
        local executor = assert(funcs.new():with_actor(admin.actor):with_scope(admin.scope))
        local completed = assert(fixtures.mailer(executor, "get_message", sent.message_id))
        test.eq("sent", completed.status, completed.last_error and completed.last_error.code)
        local request_body = assert(json.decode(completed.provider_message_id))
        test.eq(assert(base64.encode(gif())), request_body.attachments[1].base64)
    end)

    test.it("serves adopted images to a library editor without Uploads access", function()
        local image = {kind = "asset", name = "restricted-editor-image", upload_id = upload("image/gif", gif())}
        state.owned[1] = image
        call("add_asset", image)
        local person = settings.session("editor")
        test.neq("allow", person.scope:evaluate(person.actor, "contract.open", "kickside.uploads:content_provider"))
        test.neq("allow", person.scope:evaluate(person.actor, "fs.get", "app:uploads"))
        local reader = assert(funcs.new():with_actor(person.actor):with_scope(person.scope))
        local result, read_err = fixtures.call(reader, "asset_content", {name = image.name})
        assert(result, tostring(read_err))
        test.eq("image/gif", result.content_type)
        test.eq(gif(), result.bytes)
    end)

    test.it("reads adopted bytes as Mail with the public Uploads capability", function()
        local image = {kind = "asset", name = "service-reader-image", upload_id = upload("image/gif", gif())}
        state.owned[1] = image
        local adopted = call("add_asset", image)
        local person = settings.session("editor")
        local reader = assert(funcs.new():with_actor(person.actor):with_scope(person.scope))
        local result, read_err = reader:call("app.mail_library:service_content", adopted.asset.upload_id)
        assert(result, tostring(read_err))
        test.eq(content.library_component_id(), result.component_id)
        test.eq(gif(), result.bytes)
    end)

    test.it("finds references in base, part and message output once and guards deletion", function()
        local source = upload("image/gif", gif())
        local image = {kind = "asset", name = "sample-mark", upload_id = source}
        state.owned[1] = image
        local added = call("add_asset", image)
        local image_tag = '<img src="{{ assets["sample-mark"] }}" alt="Sample">'
        local part = define("part", "assets-fixture-part", image_tag)
        state.owned[2] = part
        local saved_part = call("create", part)
        local base = define("base", "assets-fixture-base", image_tag ..
            '{{ include "/part/assets-fixture-part" }}{{ block body() }}{{ end }}')
        state.owned[3] = base
        local saved_base = call("create", base)
        local msg = define("message", "assets-fixture-message", "{{ block body() }}" .. image_tag .. "{{ end }}")
        msg.base, msg.subject = base.name, "Fixture"
        state.owned[4] = msg
        local saved = call("create", msg)
        local preview = call("preview", {message = msg.name})
        local _, occurrences = preview.html:gsub("cid:mail%-library%-sample%-mark", "")
        test.eq(3, occurrences)
        test.eq("mail-library-sample-mark", next(preview.inline_assets))
        test.is_nil(next(preview.inline_assets, "mail-library-sample-mark"))
        state.configured = true
        settings.settings("app.mail_harness:capture", "mail@example.org")
        local _, sender = setup_actor({"app:mail_senders"})
        local sent = assert(fixtures.mailer(sender, "send", {template = msg.name,
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
        state.owned[5] = plain
        call("create", plain)
        local plain_send = assert(fixtures.mailer(sender, "send", {template = plain.name,
            vars = {}, to = {"reader@example.org"}}))
        local unreferenced = terminal(sender, plain_send.message_id)
        test.eq("sent", unreferenced.status, assert(json.encode(unreferenced.last_error)))
        local no_assets = assert(json.decode(unreferenced.provider_message_id))
        test.eq(0, #no_assets.attachments)
        local _, err = fixtures.call(state.editor, "delete", {kind = "asset", name = image.name, expected_revision = added.revision})
        test.eq("mail_resource_in_use", assert(err):details().code, assert(json.encode(err:details())))
        test.eq(msg.name, err:details().messages[1])
        call("delete", {kind = "message", name = msg.name, expected_revision = saved.revision})
        local blocked = select(2, fixtures.call(state.editor, "delete", {kind = "asset", name = image.name, expected_revision = added.revision}))
        test.eq("mail_resource_in_use", assert(blocked):details().code)
        call("delete", {kind = "base", name = base.name, expected_revision = saved_base.revision})
        call("delete", {kind = "part", name = part.name, expected_revision = saved_part.revision})
        assert(fixtures.call(state.editor, "delete", {kind = "asset", name = image.name, expected_revision = added.revision}))
    end)

    test.it("protects conditional asset references until the source drops them", function()
        local image = {kind = "asset", name = "conditional-mark", upload_id = upload("image/gif", gif())}
        state.owned[1] = image
        local added = call("add_asset", image)
        local msg = define("message", "conditional-asset",
            '{{ block body() }}<!-- <img src="cid:mail-library-conditional-mark"> -->' ..
            '<p>cid:mail-library-conditional-mark</p>' ..
            '{{ if isset(show) }}<img SRC={{ assets["conditional-mark"] }} alt="Sample">{{ end }}{{ end }}')
        msg.base, msg.subject = "plain", "Conditional asset"
        msg.text = "{{ block body() }}Plain text{{ end }}"
        msg.schema.properties.show = {type = "boolean"}
        state.owned[2] = msg
        local saved = call("create", msg)
        local sample = call("preview", {message = msg.name})
        test.is_nil(sample.inline_assets and sample.inline_assets["mail-library-conditional-mark"])
        local live = call("preview", {message = msg.name, vars = {show = true}})
        test.not_nil(live.inline_assets["mail-library-conditional-mark"])
        local result, err = fixtures.call(state.editor, "delete", {kind = "asset", name = image.name, expected_revision = added.revision})
        test.is_nil(result)
        test.eq(errors.CONFLICT, assert(err):kind())
        test.eq("mail_resource_in_use", assert(err):details().code, assert(json.encode(err:details())))
        test.eq(msg.name, err:details().resources[1].name)
        local used_by = call("get", image).used_by.messages
        msg.html = "{{ block body() }}Plain HTML{{ end }}"
        msg.expected_revision = saved.revision
        saved = call("update", msg)
        test.eq(0, #call("get", image).used_by.messages)
        local version = assert(lookup.get(added.asset.upload_id))
        prune_through(saved.seq)
        local retained = assert(funcs.call("kickside.mail.jobs:owner", {}))
        test.is_true(retained.success, tostring(retained.error))
        test.is_true(state.storage:exists(version.storage_path))
        call("delete", {kind = "asset", name = image.name, expected_revision = added.revision})
        test.eq(msg.name, used_by[1])
        local db = assert(sql.get("app:db"))
        local blocked = "invalid-" .. uuid.v4()
        local sweep_at = time.now():add(24 * time.HOUR):unix_nano() // 1000000
        assert(db:execute([[INSERT INTO mail_asset_file (upload_id,due_at)
            VALUES ($1,$2)]], {blocked, sweep_at}))
        local owner = assert(funcs.new():with_context({mail_test_now = sweep_at}))
        local result = assert(owner:call("kickside.mail.jobs:owner", {}))
        assert(db:execute("DELETE FROM mail_asset_file WHERE upload_id=$1", {blocked}))
        assert(db:release())
        test.is_true(result.success, tostring(result.error))
        test.eq(1, #result.blocked)
        test.is_false(state.storage:exists(version.storage_path))
    end)

    test.it("reads only caller inline uploads referenced by either preview", function()
        local id = upload("image/gif", gif())
        local refs = {{upload_id = id, disposition = "inline", content_id = "chart"},
            {upload_id = uuid.v4(), disposition = "inline", content_id = "unreferenced"}}
        local vars = {subject = "Fixture title", inline_content_id = "chart"}
        local rendered = assert(fixtures.mailer(state.editor, "preview", {template = "notice", vars = vars, attachments = refs}))
        local draft = call("preview", {message = "notice", vars = vars, attachments = refs})
        local uri = "data:image/gif;base64," .. assert(base64.encode(gif()))
        test.eq(uri, rendered.inline_assets.chart)
        test.eq(uri, draft.inline_assets.chart)
        test.eq(rendered.inline_assets["mail-library-logo"], draft.inline_assets["mail-library-logo"])
        test.is_nil(draft.inline_assets.unreferenced)
        test.is_nil(rendered.inline_assets.unreferenced)
        local colliding = "mail-library-logo"
        vars.inline_content_id = colliding
        refs[1].content_id = colliding
        local distinct = call("preview", {message = "notice", vars = vars, attachments = refs})
        test.eq(uri, distinct.inline_assets[colliding])
        test.eq(rendered.inline_assets[colliding], distinct.inline_assets[colliding .. "."])
        test.not_nil(distinct.html:find('src="cid:mail-library-logo."', 1, true))
        local _, stranger = setup_actor({"app:mail_editors"})
        local hidden, err = fixtures.mailer(stranger, "preview",
            {template = "notice", vars = vars, attachments = {refs[1]}})
        test.is_nil(hidden)
        test.eq(errors.PERMISSION_DENIED, assert(err):kind())
    end)
end

return {register = register}
