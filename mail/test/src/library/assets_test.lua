-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
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
local records = require("records")
local upload_types = require("upload_types")
local fixtures = require("fixtures")
local asset_file_repo = require("asset_file_repo")
local attachments = require("attachments")
local content = require("content")
local prune = require("prune")
local interleave = require("asset_interleave")

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

local run = test.run_cases(function()
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
            local draft
            if input.kind ~= "asset" then
                local message = input.kind == "message" and input.name or "notice"
                if method == "create" then
                    draft = {message = message, create = input}
                elseif method == "update" then
                    draft = {message = message, resources = {input}}
                end
            end
            if draft then
                local preview = assert(fixtures.call(editor, "preview", draft))
                input.preview_id = assert(preview.preview_id, preview.errors[1] and preview.errors[1].message)
            end
            local result, err = fixtures.call(editor, method, input)
            if type(result) == "table" and input.kind ~= "asset" and method ~= "get" then fixtures.await_live(result.seq) end
            return assert(result, err and tostring(err) .. " " .. assert(json.encode(err:details() or {})))
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
                local entry = assert(fixtures.mailer(executor, "get_message", id))
                if entry.status ~= "queued" then return entry end
                time.sleep("25ms")
            until time.now():unix_nano() >= deadline
            error("The fixture mail remains queued")
        end

        local function sweep(now)
            local owner = assert(funcs.new():with_context({mail_test_now = now}))
            local result = assert(owner:call("kickside.mail.jobs:owner", {}))
            assert(result.success, tostring(result.error))
            return result
        end

        local function prune_through(seq)
            local thread = content.library_component_id()
            local db = assert(sql.get("app:db"))
            local before = assert(db:query("SELECT max_pruned_seq FROM kickside_thread WHERE id=$1", {thread}))
            local result, err = prune.prune_thread(db, thread, {
                cutoff = "2099-01-01T00:00:00Z", max_total = seq - before[1].max_pruned_seq,
            })
            assert(db:release())
            assert(result, tostring(err))
            test.eq(seq, result.max_pruned_seq)
        end

        local function restore_race(name, reap_first)
            local image = {kind = "asset", name = name, upload_id = upload("image/gif", gif())}
            owned[1] = image
            local first = call("create", image)
            local source = assert(lookup.get(first.asset.upload_id))
            image.upload_id, image.expected_revision = upload("image/gif", gif() .. "next"), first.revision
            local latest = call("update", image)
            local restore_gate = reap_first and "before_reserve" or "before_append"
            local restore = assert(editor:with_context({mail_test_asset_gate = restore_gate}))
            local saved = assert(fixtures.async(restore, "restore", {
                kind = "asset", name = name, seq = first.seq, expected_revision = latest.revision,
            }))
            interleave.await(restore_gate)
            if reap_first then interleave.arm_reap(source.uuid) end
            prune_through(first.seq)

            local function head()
                local db = assert(sql.get("app:db"))
                local rows = assert(db:query("SELECT event_count FROM kickside_thread WHERE id=$1",
                    {content.library_component_id()}))
                assert(db:release())
                return rows[1].event_count
            end
            local now = time.now():unix_nano() // 1000000
            if reap_first then
                local before = head()
                local owner = assert(funcs.new():with_context({mail_test_now = now}))
                local reaping = assert(owner:async("kickside.mail.jobs:owner", {}))
                interleave.await("after_claim")
                test.is_true(storage:exists(source.storage_path))
                interleave.release(restore_gate)
                fixtures.await(function() return saved:is_complete() end, "The refused restore did not finish")
                local value, err = saved:result()
                interleave.release("after_claim")
                fixtures.await(function() return reaping:is_complete() end, "The reap did not finish")
                local collected = assert(reaping:result()):data()
                assert(collected.success, tostring(collected.error))
                test.is_nil(value)
                test.eq(before, head())
                test.eq(errors.NOT_FOUND, assert(err):kind())
                test.eq("mail_asset_source_gone", err:details().code)
                test.eq(latest.seq, call("get", image).seq)
                fixtures.await(function()
                    local db = assert(sql.get("app:db"))
                    local rows = assert(db:query("SELECT upload_id FROM mail_asset_file WHERE upload_id=$1", {source.uuid}))
                    assert(db:release())
                    return #rows == 0
                end, "Uploads did not acknowledge the reap")
                test.is_false(storage:exists(source.storage_path))
            else
                sweep(now)
                local kept = storage:exists(source.storage_path)
                interleave.release(restore_gate)
                fixtures.await(function() return saved:is_complete() end, "The accepted restore did not finish")
                local payload, err = saved:result()
                local value = assert(payload, tostring(err)):data()
                test.is_true(kept)
                test.eq(first.asset.upload_id, value.asset.upload_id)
                test.eq(gif(), call("asset_content", {kind = "asset", name = name}).bytes)
            end
        end

        test.it("keeps a restore reservation when Core prunes before the append", function()
            restore_race("restore-before-reap", false)
        end)

        test.it("refuses a restore without appending after reaping claims its upload", function()
            restore_race("reap-before-restore", true)
        end)

        local function reserve_restore(name, strand)
            local image = {kind = "asset", name = name, upload_id = upload("image/gif", gif())}
            owned[1] = image
            local first = call("create", image)
            local source = assert(lookup.get(first.asset.upload_id))
            image.upload_id, image.expected_revision = upload("image/gif", gif() .. "next"), first.revision
            local latest = call("update", image)
            local now = time.now():unix_nano() // 1000000
            local writer = assert(editor:with_context({mail_test_now = now, mail_test_strand_restore = strand}))
            local restored, err = fixtures.call(writer, "restore", {
                kind = "asset", name = name, seq = first.seq, expected_revision = latest.revision,
                command_id = uuid.v4(),
            })
            return source, first.seq, now, restored, err
        end

        local function hold(id)
            local db = assert(sql.get("app:db"))
            local rows = assert(db:query("SELECT hold_id,restore_check_at FROM mail_asset_file WHERE upload_id=$1", {id}))
            assert(db:release())
            local row = rows[1]
            return row and row.hold_id, row and row.restore_check_at
        end

        test.it("releases a stranded restore reservation after its grace period and reaps the upload", function()
            local source, original_seq, now, restored, err = reserve_restore("stranded-restore", true)
            test.is_nil(restored)
            test.eq(errors.UNAVAILABLE, assert(err):kind())
            local reserved = assert(hold(source.uuid))
            prune_through(original_seq)
            sweep(now + 15 * 60 * 1000 - 1)
            test.eq(reserved, hold(source.uuid))
            test.is_true(storage:exists(source.storage_path))
            sweep(now + 15 * 60 * 1000 + 1)
            test.is_nil(hold(source.uuid))
            test.is_false(storage:exists(source.storage_path))
        end)

        test.it("keeps an expired restore reservation whose event exists", function()
            local source, _, now, restored, err = reserve_restore("appended-restore", false)
            assert(restored, tostring(err))
            local reserved, deadline = hold(source.uuid)
            test.not_nil(reserved)
            test.eq(now + 15 * 60 * 1000, deadline)
            sweep(now + 15 * 60 * 1000 + 1)
            local kept, next_check = hold(source.uuid)
            test.eq(reserved, kept)
            test.is_nil(next_check)
            test.eq(gif(), call("asset_content", {kind = "asset", name = restored.name}).bytes)
        end)

        test.it("keeps an old upload through History and pending delivery, then reaps it", function()
            local image = {kind = "asset", name = "retained-image", upload_id = upload("image/gif", gif())}
            owned[1] = image
            local first = call("create", image)
            local version = assert(lookup.get(first.asset.upload_id))
            image.upload_id, image.expected_revision = upload("image/gif", gif() .. "next"), first.revision
            local latest = call("update", image)
            local now = time.now():add(24 * time.HOUR):unix_nano() // 1000000
            sweep(now)
            test.is_true(storage:exists(version.storage_path))
            test.not_nil(first.seq)
            test.not_nil(latest.seq)
            local db = assert(sql.get("app:db"))
            local pending = uuid.v4()
            assert(db:execute([[INSERT INTO mail_message
                (id,created_at,status,sender,recipients,subject,from_address,attachments,next_attempt_at,next_check_at,actor_context)
                VALUES ($1,$2,'queued','fixture','{}','Pending','mail@example.org','[]',$3,$3,'{}')]],
                {pending, now, now + 86400000}))
            assert(db:execute([[INSERT INTO mail_message_asset (message_id,name,content_id,upload_id)
                VALUES ($1,$2,$2,$3)]], {pending, image.name, version.uuid}))
            assert(db:release())
            prune_through(first.seq)
            sweep(now)
            local protected = storage:exists(version.storage_path)
            db = assert(sql.get("app:db"))
            assert(db:execute("DELETE FROM mail_message WHERE id=$1", {pending}))
            assert(db:release())
            sweep(now)
            test.is_true(protected)
            test.is_false(storage:exists(version.storage_path))
            test.eq(latest.asset.upload_id, call("get", image).asset.upload_id)
        end)

        test.it("reaps an adopted reservation after a failed append and its grace", function()
            local image = {kind = "asset", name = "failed-append-image", upload_id = upload("image/gif", gif())}
            owned[1] = image
            local actor = assert(security.new_actor(uploader, {security_groups = {"app:mail_editors", "app:mail_senders"}}))
            local scope = assert(security.named_scope("wippy.security:process"))
            local fault = assert(funcs.new():with_actor(actor):with_scope(scope):with_context({mail_test_append_failure = true}))
            local value, err = fixtures.call(fault, "create", image)
            test.is_nil(value)
            test.eq("mail_test_append_failure", assert(err):details().code)
            local db = assert(sql.get("app:db"))
            local rows = assert(db:query("SELECT upload_id,due_at FROM mail_asset_file WHERE due_at IS NOT NULL"))
            assert(db:release())
            local reservation
            for _, row in ipairs(rows) do
                local file = lookup.get(row.upload_id)
                if file then reservation = {path = file.storage_path, due_at = row.due_at}; break end
            end
            assert(reservation, "The adopted file has a ledger reservation")
            sweep(reservation.due_at - 1)
            test.is_true(storage:exists(reservation.path))
            sweep(reservation.due_at)
            test.is_false(storage:exists(reservation.path))
        end)

        test.it("publishes the replaced image revision in the library event log", function()
            local image = {kind = "asset", name = "history-image-probe", upload_id = upload("image/gif", gif())}
            owned[1] = image
            local thread = content.library_component_id()
            local function query(statement, args)
                local db = assert(sql.get("app:db"))
                local rows, err = db:query(statement, args)
                assert(db:release())
                return assert(rows, tostring(err))
            end
            local before = query("SELECT event_count FROM kickside_thread WHERE id=$1", {thread})[1].event_count
            local first = call("create", image)
            image.expected_revision = first.revision
            image.upload_id = upload("image/gif", gif() .. "replacement")
            local latest = call("update", image)
            local older = call("asset_content", {name = image.name, revision = first.revision})
            test.eq(gif(), older.bytes)
            test.neq(first.asset.upload_id, latest.asset.upload_id)
            local indexed = query([[SELECT h.seq FROM mail_library_history h
                JOIN kickside_event e ON e.thread_id=$1 AND e.seq=h.seq
                WHERE h.kind='asset' AND h.name=$2]], {thread, image.name})
            local after = query("SELECT event_count FROM kickside_thread WHERE id=$1", {thread})[1].event_count
            test.eq(2, #indexed, ("asset create and replace advanced the thread from %d to %d"):format(before, after))
        end)

        test.it("adopts, replaces, restores and resets an image in the same library", function()
            local original = call("get", {kind = "asset", name = "logo"})
            test.eq("original", original.state)
            local source = upload("image/gif", gif())
            owned[1] = {kind = "asset", name = "logo"}
            local replaced = call("update", {kind = "asset", name = "logo", upload_id = source,
                expected_revision = original.revision})
            test.eq("customized", replaced.state)
            test.eq(original.origin, replaced.origin)
            test.is_nil(replaced.asset.width)
            test.neq(source, replaced.asset.upload_id)
            local person = settings.session("editor")
            local preview_client = assert(funcs.new():with_actor(person.actor):with_scope(person.scope))
            local scoped, scoped_err = fixtures.call(preview_client, "preview", {message = "notice"})
            assert(scoped, tostring(scoped_err))
            local uri = "data:image/gif;base64," .. assert(base64.encode(gif()))
            test.eq(uri, scoped.inline_assets["mail-library-logo"])
            local restored_package = call("reset", {kind = "asset", name = "logo", expected_revision = replaced.revision})
            test.eq("original", restored_package.state)
            local history = call("read_history", {kind = "asset", name = "logo"}).items
            local reset_detail = call("read_revision", {kind = "asset", name = "logo", seq = history[1].seq})
            test.eq("original", reset_detail.content.asset.source)
            test.is_nil(reset_detail.content.asset.upload_id)
            local restored = call("restore", {kind = "asset", name = "logo", expected_revision = restored_package.revision,
                seq = replaced.seq})
            test.eq(replaced.asset.upload_id, restored.asset.upload_id)
            local reset = call("restore", {kind = "asset", name = "logo", expected_revision = restored.revision,
                seq = restored_package.seq})
            test.eq("original", reset.state)
            local preview = call("preview", {message = "notice"})
            test.not_nil(preview.inline_assets["mail-library-logo"]:match("^data:image/png;base64,"))
        end)

        test.it("reads the current immutable asset version through the library byte reader", function()
            local packaged = call("asset_content", {name = "logo"})
            test.eq("image/png", packaged.content_type)
            local image = {kind = "asset", name = "asset-content-fixture", upload_id = upload("image/gif", gif())}
            owned[1] = image
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
            local actor = assert(security.new_actor(uploader, {user_id = uploader, security_groups = {"app:mail_editors"}}))
            local threads = assert(assert(contract.get("kickside.core:threads")):with_actor(actor):open())
            local projection = {thread_id = content.library_component_id(), kind = "kickside.mail:library_tables"}
            assert(threads:pause_projection(projection))
            local replaced, replace_err = fixtures.call(editor, "update", image)
            local before = fixtures.call(editor, "asset_content", {name = image.name})
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

        test.it("serves adopted images to a library editor without Uploads access", function()
            local image = {kind = "asset", name = "restricted-editor-image", upload_id = upload("image/gif", gif())}
            owned[1] = image
            call("create", image)
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
            owned[1] = image
            local adopted = call("create", image)
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
            owned[1] = image
            local added = call("create", image)
            local image_tag = '<img src="{{ assets["sample-mark"] }}" alt="Sample">'
            local part = define("part", "assets-fixture-part", image_tag)
            owned[2] = part
            local saved_part = call("create", part)
            local base = define("base", "assets-fixture-base", image_tag ..
                '{{ include "/part/assets-fixture-part" }}{{ block body() }}{{ end }}')
            owned[3] = base
            local saved_base = call("create", base)
            local msg = define("message", "assets-fixture-message", "{{ block body() }}" .. image_tag .. "{{ end }}")
            msg.base, msg.subject = base.name, "Fixture"
            owned[4] = msg
            local saved = call("create", msg)
            local preview = call("preview", {message = msg.name})
            local _, occurrences = preview.html:gsub("cid:mail%-library%-sample%-mark", "")
            test.eq(3, occurrences)
            test.eq("mail-library-sample-mark", next(preview.inline_assets))
            test.is_nil(next(preview.inline_assets, "mail-library-sample-mark"))
            configured = true
            settings.settings("kickside.mail.harness:capture", "mail@example.org")
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
            owned[5] = plain
            call("create", plain)
            local plain_send = assert(fixtures.mailer(sender, "send", {template = plain.name,
                vars = {}, to = {"reader@example.org"}}))
            local unreferenced = terminal(sender, plain_send.message_id)
            test.eq("sent", unreferenced.status, assert(json.encode(unreferenced.last_error)))
            local no_assets = assert(json.decode(unreferenced.provider_message_id))
            test.eq(0, #no_assets.attachments)
            local _, err = fixtures.call(editor, "delete", {kind = "asset", name = image.name, expected_revision = added.revision})
            test.eq("mail_resource_in_use", assert(err):details().code, assert(json.encode(err:details())))
            test.eq(msg.name, err:details().messages[1])
            call("delete", {kind = "message", name = msg.name, expected_revision = saved.revision})
            local blocked = select(2, fixtures.call(editor, "delete", {kind = "asset", name = image.name, expected_revision = added.revision}))
            test.eq("mail_resource_in_use", assert(blocked):details().code)
            call("delete", {kind = "base", name = base.name, expected_revision = saved_base.revision})
            call("delete", {kind = "part", name = part.name, expected_revision = saved_part.revision})
            assert(fixtures.call(editor, "delete", {kind = "asset", name = image.name, expected_revision = added.revision}))
        end)

        test.it("protects conditional asset references until the source drops them", function()
            local image = {kind = "asset", name = "conditional-mark", upload_id = upload("image/gif", gif())}
            owned[1] = image
            local added = call("create", image)
            local msg = define("message", "conditional-asset",
                '{{ block body() }}<!-- <img src="cid:mail-library-conditional-mark"> -->' ..
                '<p>cid:mail-library-conditional-mark</p>' ..
                '{{ if isset(show) }}<img SRC={{ assets["conditional-mark"] }} alt="Sample">{{ end }}{{ end }}')
            msg.base, msg.subject = "plain", "Conditional asset"
            msg.text = "{{ block body() }}Plain text{{ end }}"
            msg.schema.properties.show = {type = "boolean"}
            owned[2] = msg
            local saved = call("create", msg)
            local sample = call("preview", {message = msg.name})
            test.is_nil(sample.inline_assets and sample.inline_assets["mail-library-conditional-mark"])
            local live = call("preview", {message = msg.name, vars = {show = true}})
            test.not_nil(live.inline_assets["mail-library-conditional-mark"])
            local result, err = fixtures.call(editor, "delete", {kind = "asset", name = image.name, expected_revision = added.revision})
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
            test.is_true(storage:exists(version.storage_path))
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
            test.is_false(storage:exists(version.storage_path))
        end)

        test.it("reads only caller inline uploads referenced by either preview", function()
            local id = upload("image/gif", gif())
            local refs = {{upload_id = id, disposition = "inline", content_id = "chart"},
                {upload_id = uuid.v4(), disposition = "inline", content_id = "unreferenced"}}
            local vars = {subject = "Fixture title", inline_content_id = "chart"}
            local rendered = assert(fixtures.mailer(editor, "preview", {template = "notice", vars = vars, attachments = refs}))
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

        test.it("counts adopted inline bytes against the driver at admission", function()
            configured = true
            settings.settings("kickside.mail.harness:second", "mail@example.org")
            local original = call("get", {kind = "asset", name = "logo"})
            owned[1] = original
            local request = {template = "notice", vars = {subject = "Asset size", message = "Ready"}, to = {"reader@example.org"}}
            local active = assert(fixtures.mailer(editor, "send", request))
            test.eq("queued", active.status)
            request.vars.message = string.rep("a", 9000)
            local preview = call("preview", {message = request.template, vars = request.vars})
            test.not_nil(preview.inline_assets["mail-library-logo"])
            local oversize, budget = fixtures.mailer(editor, "send", request)
            test.is_nil(oversize)
            local details = assert(budget):details()
            test.eq("message_too_large", details.code)
            test.eq("max_message_bytes", details.limit)
            test.eq(100000, details.maximum)
            request.vars.message = "Ready"
            local _, err = fixtures.call(editor, "update", {kind = "asset", name = "logo",
                upload_id = upload("image/gif", gif() .. string.rep("\0", 80000)), expected_revision = original.revision})
            assert(not err, tostring(err))
            local rejected, size_err = fixtures.mailer(editor, "send", request)
            test.is_nil(rejected)
            test.eq("message_too_large", assert(size_err):details().code)
        end)

        test.it("rejects an empty completed upload at send admission", function()
            configured = true
            settings.settings("kickside.mail.harness:capture", "mail@example.org")
            local empty = upload("text/plain", "x")
            local db = assert(sql.get("app:db"))
            assert(db:execute("UPDATE kickside_uploads SET size=0 WHERE uuid=$1", {empty}))
            assert(db:release())
            assert(storage:writefile(empty, ""))
            local result, failure = fixtures.mailer(editor, "send", {
                to = {"reader@example.org"}, subject = "An attachment", text = "Please read",
                attachments = {{upload_id = empty}},
            })
            test.is_nil(result)
            test.eq(errors.INVALID, assert(failure):kind())
            test.eq("attachment_empty", failure:details().code)
        end)

        test.it("checks all adopted metadata before reading any adopted attachment bytes", function()
            local original = call("get", {kind = "asset", name = "logo"})
            owned[1] = original
            local small = call("update", {kind = "asset", name = "logo", upload_id = upload("image/gif", gif()),
                expected_revision = original.revision})
            local large = call("create", {kind = "asset", name = "large", upload_id = upload("image/gif", gif() .. string.rep("\0", 80000))})
            owned[2] = large
            local adopted = assert(lookup.get(small.asset.upload_id))
            assert(storage:remove(adopted.storage_path))
            local files, failure = attachments.complete({
                library_assets = {
                    {name = "logo", content_id = "logo", upload_id = small.asset.upload_id},
                    {name = "large", content_id = "large", upload_id = large.asset.upload_id},
                },
                message_bytes = 4000, max_message_bytes = 100000,
            }, {})
            assert(storage:writefile(adopted.storage_path, gif()))
            test.is_nil(files)
            test.eq("message_too_large", assert(failure):details().code)
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
            settings.settings("kickside.mail.harness:admitted", "mail@example.org")
            local _, sender = setup_actor({"app:mail_senders"})
            local denied = assert(fixtures.mailer(sender, "send", {template = message.name,
                vars = {}, to = {"reader@example.org"}}))
            local failure = terminal(sender, denied.message_id)
            test.eq("failed", failure.status)
            test.eq("message_rejected", failure.last_error.code)
            assert(fixtures.call(editor, "delete", {kind = "message", name = message.name, expected_revision = template.revision}))
            assert(fixtures.call(editor, "delete", {kind = "asset", name = image.name, expected_revision = saved.revision}))
            prune_through(saved.seq)
            local retained = assert(funcs.call("kickside.mail.jobs:owner", {}))
            test.is_true(retained.success, tostring(retained.error))
            test.is_true(storage:exists(record.storage_path), "The failed delivery keeps the adopted bytes")
            local db = assert(sql.get("app:db"))
            assert(db:execute("UPDATE mail_message SET finished_at=1 WHERE id=$1", {denied.message_id}))
            assert(db:release())
            local expiry = assert(funcs.call("kickside.mail.jobs:owner", {}))
            test.is_true(expiry.success, tostring(expiry.error))
            local check = assert(sql.get("app:db"))
            local links = assert(check:query("SELECT 1 FROM mail_message_asset WHERE message_id=$1", {denied.message_id}))
            assert(check:release())
            test.eq(0, #links)
            local outcome = assert(funcs.call("kickside.mail.jobs:owner", {}))
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
                local value, err = fixtures.call(editor, "create",
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
            local value, err = fixtures.call(reader, "create", {kind = "asset", name = "foreign-image", upload_id = id})
            test.is_nil(value)
            test.eq("asset_adoption_denied", assert(err):details().code)
        end)
    end)
end)

local expiry = test.run_cases(function()
    test.describe("Mail asset expiry", function()
        test.it("reports blocked assets while expiring messages and progressing beyond a failed batch", function()
            local db = assert(sql.get("app:db"))
            local day = 86400000
            local now = time.now():unix_nano() // 1000000 + day
            local expired, collectable = uuid.v4(), uuid.v4()
            local prefix = "invalid-" .. uuid.v4()
            local batch = 200
            local tx = assert(db:begin())
            for i = 1, batch do
                assert(tx:execute([[INSERT INTO mail_asset_file
                    (upload_id,due_at) VALUES ($1,$2)]],
                    {prefix .. "-" .. i, now - 2}))
            end
            assert(tx:execute([[INSERT INTO mail_asset_file
                (upload_id,due_at) VALUES ($1,$2)]], {collectable, now - 1}))
            assert(tx:execute([[INSERT INTO mail_message
                (id,created_at,finished_at,status,sender,recipients,subject,from_address,attachments)
                VALUES ($1,$2,$2,'failed','fixture','{}','Expiry','mail@example.org','[]')]], {expired, now - 30 * day}))
            assert(tx:commit())

            local function sweep(at)
                local exec = assert(funcs.new():with_context({mail_test_now = at}))
                return assert(exec:call("kickside.mail.jobs:owner", {}))
            end
            local first = sweep(now)
            local second = sweep(now)
            local messages = assert(db:query("SELECT id FROM mail_message WHERE id=$1", {expired}))
            local assets = assert(db:query("SELECT upload_id, due_at FROM mail_asset_file WHERE upload_id LIKE $1 OR upload_id=$2",
                {prefix .. "%", collectable}))
            local at_deadline = second.deadline_ms and sweep(second.deadline_ms)
            assert(db:execute("DELETE FROM mail_message WHERE id=$1", {expired}))
            assert(db:execute("DELETE FROM mail_asset_file WHERE upload_id LIKE $1 OR upload_id=$2", {prefix .. "%", collectable}))
            assert(db:release())

            test.eq(0, #messages, "Asset failures cannot prevent delivery log expiry")
            test.eq(batch, #assets, "The collectable row beyond the failed page is removed")
            test.is_true(first.needs_continue)
            test.eq(batch, #first.blocked)
            test.eq("invalid_asset_request", first.blocked[1].error:details().code)
            test.is_false(second.needs_continue)
            test.eq(0, #second.blocked)
            test.is_true(second.deadline_ms > now)
            test.eq(second.deadline_ms, assets[1].due_at)
            test.eq(batch, #at_deadline.blocked)
        end)

        test.it("keeps an expired adoption lease closed after deferring collection", function()
            local db = assert(sql.get("app:db"))
            local version = uuid.v4()
            local now = time.now():unix_nano() // 1000000
            local lease = now - 1
            local due = now + 60000
            assert(db:execute([[INSERT INTO mail_asset_file
                (upload_id,due_at) VALUES ($1,$2)]], {version, due}))
            local tx = assert(db:begin())
            local _, failure = asset_file_repo.hold_adoption(tx, version, lease, now, 1, "test")
            assert(tx:rollback())
            assert(db:execute("DELETE FROM mail_asset_file WHERE upload_id=$1", {version}))
            assert(db:release())
            test.eq("mail_asset_version_unavailable", assert(failure):details().code)
        end)

        test.it("keeps an asset reference when a message enters the expiry batch after unlink starts", function()
            local db = assert(sql.get("app:db"))
            local postgres = assert(db:type()) == "postgres"
            local day = 86400000
            local now = time.now():unix_nano() // 1000000
            local cutoff = now - 29 * day
            local first, late, version = uuid.v4(), uuid.v4(), uuid.v4()
            local seed = assert(db:begin())
            assert(seed:execute([[INSERT INTO mail_asset_file
                (upload_id) VALUES ($1)]], {version}))
            assert(seed:execute([[INSERT INTO mail_library_upload_ref (upload_id,asset,live,last_seq)
                VALUES ($1,'fixture',FALSE,0)]], {version}))
            for i, id in ipairs({first, late}) do
                assert(seed:execute([[INSERT INTO mail_message
                    (id,created_at,finished_at,status,sender,recipients,subject,from_address,attachments)
                    VALUES ($1,$2,$2,'failed','fixture','{}','Expiry','mail@example.org','[]')]], {id, cutoff + i - 2}))
                assert(seed:execute([[INSERT INTO mail_message_asset
                    (message_id,name,content_id,upload_id) VALUES ($1,'fixture','fixture',$2)]], {id, version}))
            end
            assert(seed:execute("UPDATE mail_message SET finished_at=$1 WHERE id=$2", {cutoff + 1, late}))
            assert(seed:commit())
            local exec = assert(funcs.new():with_context({mail_test_now = now + day}))
            local report
            if postgres then
                local lock = assert(db:begin())
                local blocker = assert(lock:query("SELECT pg_backend_pid() AS pid"))[1].pid
                assert(lock:query("SELECT message_id FROM mail_message_asset WHERE message_id=$1 FOR UPDATE", {first}))
                local sweep = assert(exec:async("kickside.mail.jobs:owner", {}))
                local deadline = time.now():add(25 * time.SECOND):unix_nano()
                local waiting = {}
                repeat
                    waiting = assert(db:query([[SELECT pid FROM pg_stat_activity
                        WHERE $1 = ANY(pg_blocking_pids(pid)) AND query LIKE 'DELETE FROM mail_message_asset%']], {blocker}))
                until #waiting > 0 or time.now():unix_nano() >= deadline
                if #waiting > 0 then
                    assert(db:execute("UPDATE mail_message SET finished_at=$1 WHERE id=$2", {cutoff, late}))
                end
                assert(lock:commit())
                sweep:response():receive()
                report = assert(assert(sweep:result()):data())
                test.eq(1, #waiting, "The expiry unlink waits on the first message")
            else
                report = assert(exec:call("kickside.mail.jobs:owner", {}))
                assert(db:execute("UPDATE mail_message SET finished_at=$1 WHERE id=$2", {cutoff, late}))
            end
            local refs = assert(db:query("SELECT message_id FROM mail_message_asset WHERE upload_id=$1", {version}))
            local held = assert(db:query("SELECT state FROM mail_asset_file WHERE upload_id=$1", {version}))
            assert(db:release())
            test.is_true(report.success, tostring(report.error))
            test.eq(1, #refs, "The next expiry pass must still be able to release the late message reference")
            test.eq(late, refs[1].message_id)
            test.eq("held", held[1].state)
            if postgres then test.is_true(report.needs_continue) end
            local next_report = assert(exec:call("kickside.mail.jobs:owner", {}))
            test.is_true(next_report.success, tostring(next_report.error))
            fixtures.await(function()
                local check = assert(sql.get("app:db"))
                local released = assert(check:query("SELECT state FROM mail_asset_file WHERE upload_id=$1", {version}))
                assert(check:release())
                return #released == 0
            end, "The owner did not reap the upload after its last delivery expired")
        end)
    end)
end)

local function service_content(upload_id)
    assert(security.actor():id() == "system:kickside.mail.retention")
    local provider, info, err = content.upload_info(upload_id)
    if err then return nil, err end
    local file, read_err = content.upload_bytes(provider, info.size, 1024)
    if read_err then return nil, read_err end
    return {component_id = info.source_ref.component_id, bytes = file.content}
end

return {run = run, expiry = expiry, service_content = service_content}
