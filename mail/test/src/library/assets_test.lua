-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local delivery_wait = require("delivery_wait")
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
local asset_lifetime_cases = require("asset_lifetime_cases")
local asset_content_cases = require("asset_content_cases")
local asset_delivery_cases = require("asset_delivery_cases")

local function setup_actor(role)
    local member = settings.session(role)
    local exec = assert(funcs.new():with_actor(member.actor):with_scope(member.scope))
    return member.id, exec, member.actor
end

local function define(kind, name, html)
    return {kind = kind, name = name, title = name, description = "", html = html, text = "Plain text",
        schema = {type = "object", properties = {}}, samples = {}}
end

local run = test.run_cases(function()
    test.describe("Mail library images", function()
        local state = {}
        test.before_each(function()
            state.owned, state.sources, state.configured = {}, {}, false
            state.storage = assert(fs.get("app:uploads"))
            local actor
            state.uploader, state.editor, actor = setup_actor("upload_editor_sender")
            local owner = upload_types.component_id_for_owner(state.uploader)
            local setup = assert(funcs.new():with_actor(actor):with_scope(assert(security.named_scope("wippy.security:process"))))
            local registered = assert(setup:call("kickside.component.binding:register_component_func",
                {component_id = owner, impl_id = upload_types.IMPL}))
            assert(registered.success, registered.error)
        end)
        test.after_each(function()
            fixtures.remove(state.owned)
            if state.configured then settings.settings("", "") end
            local db = assert(sql.get("app:db"))
            for _, id in ipairs(state.sources) do
                assert(db:execute("DELETE FROM kickside_uploads WHERE uuid=$1", {id}))
                assert(state.storage:remove(id))
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
                local preview = assert(fixtures.call(state.editor, "preview", draft))
                input.preview_id = assert(preview.preview_id, preview.errors[1] and preview.errors[1].message)
            end
            local result, err = fixtures.call(state.editor, method, input)
            if type(result) == "table" and input.kind ~= "asset" and method ~= "get" then fixtures.await_live(result.seq) end
            return assert(result, err and tostring(err) .. " " .. assert(json.encode(err:details() or {})))
        end
        local function upload(mime, bytes)
            local id = uuid.v4()
            assert(state.storage:writefile(id, bytes))
            assert(records.create(id, state.uploader, #bytes, mime, "app:uploads", id,
                "kickside.uploads:types.generic", {filename = "mark"}, "completed"))
            state.sources[#state.sources + 1] = id
            return id
        end
        local function gif()
            return "GIF89a\1\0\1\0\128\0\0\0\0\0\255\255\255!\249\4\1\0\0\0\0,\0\0\0\0\1\0\1\0\0\2\2D\1\0;"
        end

        local function terminal(executor, id)
            return delivery_wait.terminal(function()
                return fixtures.mailer(executor, "get_message", id)
            end, "25s")
        end

        local function sweep(now, no_boundary)
            local owner = assert(funcs.new():with_context({mail_test_now = now, mail_test_no_prune_boundary = no_boundary}))
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

        local cases = {
            test = test,
            state = state,
            call = call,
            upload = upload,
            gif = gif,
            sweep = sweep,
            prune_through = prune_through,
            terminal = terminal,
            define = define,
            setup_actor = setup_actor,
        }
        asset_lifetime_cases.register(cases)
        asset_content_cases.register(cases)
        asset_delivery_cases.register(cases)

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

return {run = run, expiry = expiry}
