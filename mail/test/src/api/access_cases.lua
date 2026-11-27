-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local contract = require("contract")
local http = require("http_client")
local registry = require("registry")
local library_fixtures = require("library_fixtures")

local function register(support)
    local test = support.test
    local session = support.session
    local request = support.request
    local data = support.data
    local create = support.create
    local update = support.update
    local await_delivery = support.await_delivery
    local fixture = support.fixture
    local own = support.own
    local configure = support.configure
    local state = support.state
    local ZERO = support.ZERO

    test.it("requires authenticated capability on each exact endpoint", function()
        local sender = session("sender")
        local editor = session("editor")
        local admin = session("delivery")
        local endpoints = assert(registry.find({[".kind"] = "http.endpoint"}))
        local count = 0
        local library_count = 0
        for _, endpoint in ipairs(endpoints) do
            if endpoint.id:match("^kickside%.mail%.api:") then
                count = count + 1
                local path = endpoint.data.path:sub(#"/mail" + 1):gsub("{kind}", "message"):gsub("{name}", "notice"):gsub("{id}", ZERO)
                test.eq(401, (request(nil, endpoint.data.method, path, {})), endpoint.id)
                if path:match("^/library") or path:match("^/delivery") or path:match("^/activity") then
                    local denied, _, raw = request(sender, endpoint.data.method, path, {})
                    assert(denied == 403, endpoint.id .. " returned " .. denied .. ": " .. raw)
                end
                if path:match("^/library") then
                    library_count = library_count + 1
                    test.eq("allow", editor.scope:evaluate(editor.actor, "access", endpoint.id), endpoint.id)
                end
            end
        end
        test.eq(19, count)
        test.eq(13, library_count)
        local predicate = "kickside.mail.api:library_list.endpoint"
        test.eq("allow", editor.scope:evaluate(editor.actor, "access", predicate))
        test.neq("allow", sender.scope:evaluate(sender.actor, "access", predicate))
        test.eq(403, request(editor, "GET", "/delivery"))
        test.eq(403, request(admin, "GET", "/library"))

    end)

    test.it("opens the library contract from a foreign caller with the editor capability", function()
        local editor = session("editor")
        local executor = assert(funcs.new():with_actor(editor.actor):with_scope(editor.scope))
        local page = assert(executor:call("app.mail_library:foreign_list", {kind = "base", limit = 1}))
        test.eq(1, #page.items)
        test.not_nil(page.next_cursor)
        test.is_nil(page.items[1].html)

        local sender = session("sender")
        local restricted = assert(funcs.new():with_actor(sender.actor):with_scope(sender.scope))
        local denied, err = restricted:call("app.mail_library:foreign_list", {kind = "base"})
        test.is_nil(denied)
        test.eq(errors.PERMISSION_DENIED, assert(err):kind())
    end)

    test.it("checks library contract methods against the caller's component and send grants", function()
        local editor = session("editor")
        local editor_sender = session("editor_sender")
        local capability = session("library_capability_only")
        local function executor(who)
            return assert(funcs.new():with_actor(who.actor):with_scope(who.scope))
        end
        local draft = own(fixture("message", "caller-base-switch", "{{ block body() }}Caller{{ end }}"))
        draft.base, draft.subject = "standard", "Caller permissions"
        local saved = create(editor, draft)
        local revision = {kind = draft.kind, name = draft.name, seq = saved.seq}
        local allowed, denied = executor(editor), executor(capability)
        for method, input in pairs({read_history = revision, read_revision = revision, asset_content = {name = "logo"}}) do
            local visible, read_err = library_fixtures.call(allowed, method, input)
            assert(visible, method .. ": " .. tostring(read_err))
            local value, err = library_fixtures.call(denied, method, input)
            test.is_nil(value, method)
            test.eq("mail_library_read_denied", assert(err):details().code, method)
        end
        local write = {kind = draft.kind, name = draft.name, expected_revision = saved.revision}
        for _, method in ipairs({"reset", "delete"}) do
            local value, err = library_fixtures.call(denied, method, write)
            test.is_nil(value, method)
            test.eq("mail_library_write_denied", assert(err):details().code, method)
        end
        local base = {name = draft.name, base = "plain", expected_revision = saved.revision}
        local preview = assert(library_fixtures.call(allowed, "preview", {message = draft.name, set_base = base}))
        base.preview_id = assert(preview.preview_id)
        local forbidden, base_err = library_fixtures.call(denied, "set_base", base)
        test.is_nil(forbidden)
        test.eq("mail_library_write_denied", assert(base_err):details().code)
        local updated = assert(library_fixtures.call(allowed, "set_base", base))
        test.eq("plain", updated.base)
        library_fixtures.await_live(updated.seq)

        configure()
        local message = {message = draft.name}
        local value, err = library_fixtures.call(allowed, "send_test", message)
        test.is_nil(value)
        test.eq("mail_send_denied", assert(err):details().code)
        local queued = assert(library_fixtures.call(executor(editor_sender), "send_test", message))
        local sent = await_delivery(session("delivery"), queued.message_id)
        test.eq(editor_sender.email, sent.to[1])
    end)

    test.it("checks delivery administration methods under driver-only and sender identities", function()
        local sender, driver = session("sender"), session("driver_only")
        local both = session("delivery_sender")
        local function invoke(who, method, input)
            local executor = assert(funcs.new():with_actor(who.actor):with_scope(who.scope))
            return library_fixtures.mailer(executor, method, input)
        end
        configure()
        local status = assert(invoke(driver, "delivery_status"))
        test.is_true(status.ready)
        local denied, err = invoke(sender, "delivery_status")
        test.is_nil(denied)
        test.eq("mail_delivery_denied", assert(err):details().code)

        for _, entry in ipairs({{sender, "mail_delivery_denied"}, {driver, "mail_send_denied"}}) do
            local value, reason = invoke(entry[1], "send_delivery_test", {})
            test.is_nil(value)
            test.eq(entry[2], assert(reason):details().code)
        end
        local queued = assert(invoke(both, "send_delivery_test", {}))
        local sent = await_delivery(driver, queued.message_id)
        test.eq(both.email, sent.to[1])
    end)

    test.it("authorizes exactly the endpoints in each Mail capability bundle", function()
        local roles = {
            {who = session("module_only"), allowed = {capabilities = true}},
            {who = session("outside"), allowed = {}},
            {who = session(), allowed = {capabilities = true}},
            {who = session("sender"), allowed = {capabilities = true}},
            {who = session("log_reader"), allowed = {capabilities = true}},
            {who = session("editor"), allowed = {capabilities = true, library = true}},
            {who = session("delivery"), allowed = {capabilities = true, activity = true, delivery = true}},
        }
        local endpoints = assert(registry.find({[".kind"] = "http.endpoint"}))
        for _, endpoint in ipairs(endpoints) do
            if endpoint.id:match("^kickside%.mail%.api:") then
                local path = endpoint.data.path:sub(#"/mail" + 1):gsub("{kind}", "message")
                    :gsub("{name}", "notice"):gsub("{id}", ZERO)
                local section = path:match("^/([^/]+)")
                for _, role in ipairs(roles) do
                    if not role.allowed[section] or section == "capabilities" then
                        local status = request(role.who, endpoint.data.method, path, {})
                        test.eq(role.allowed[section] and 200 or 403, status, endpoint.id)
                    end
                end
            end
        end
    end)

    test.it("paginates the library without a view parameter", function()
        local editor = session("editor")
        local page = data(editor, "GET", "/library?kind=base&limit=1")
        test.eq(1, #page.items)
        test.not_nil(page.next_cursor)
        test.is_nil(page.items[1].html)
        local next_page = data(editor, "GET", "/library?kind=base&limit=1&cursor=" .. page.next_cursor)
        test.eq(1, #next_page.items)
        test.neq(page.items[1].name, next_page.items[1].name)
    end)

    test.it("looks up library summaries by a comma-separated list of exact names", function()
        local page = data(session("editor"), "GET", "/library?kind=part&names=signature,image")
        test.eq(2, page.total)
        test.eq("image", page.items[1].name)
        test.eq("signature", page.items[2].name)
    end)

    test.it("shares preview, save and restore between design tools and HTTP", function()
        local editor = session("editor")
        local tools = assert(funcs.new():with_actor(editor.actor):with_scope(editor.scope))
        local path = "/library/message/contract-parity"
        local item = own(fixture("message", "contract-parity", "{{ block body() }}Before{{ end }}"))
        item.base, item.subject = "plain", "Contract parity"
        local created = create(editor, item)
        item.expected_revision = created.revision
        item.preview_id = nil
        item.html = "{{ block body() }}After{{ end }}"
        local input = {message = item.name, resources = {item}}
        local http_preview = data(editor, "POST", "/library/preview", input)
        local tool_preview = assert(tools:call("kickside.mail.traits:library_preview", input))
        test.eq(http_preview.html, tool_preview.html)
        test.not_nil(http_preview.preview_id)
        local saved = assert(tools:call("kickside.mail.traits:library_save", {
            resources = {item}, preview_id = http_preview.preview_id,
        })).items[1]
        test.is_true(saved.revision > created.revision)
        local current = data(editor, "GET", path)
        test.eq(saved.revision, current.revision)
        test.eq(item.html, current.html)

        local source = {kind = item.kind, name = item.name,
            expected_revision = saved.revision, seq = created.seq}
        local restored_preview = assert(tools:call("kickside.mail.traits:library_preview", {message = item.name, restore = source}))
        source.preview_id = assert(restored_preview.preview_id)
        local restored = data(editor, "POST", path .. "/restore", source)
        test.eq(created.html, restored.html)
        local tool_read = assert(tools:call("kickside.mail.traits:library_read", {kind = item.kind, name = item.name}))
        test.eq(restored.revision, tool_read.revision)

        local history = data(editor, "GET", path .. "/history?limit=1")
        test.eq(restored.seq, history.items[1].seq)
        test.not_nil(history.next_cursor)
        local prior = data(editor, "GET", path .. "/history?limit=1&cursor=" .. history.next_cursor)
        test.eq(saved.seq, prior.items[1].seq)
        local detail = data(editor, "GET", path .. "/history?seq=" .. created.seq)
        test.eq(created.html, detail.content.html)
    end)

    test.it("grants Mail managers their own endpoints without shell tab discovery", function()
        for role, endpoint in pairs({editor = "library_list", delivery = "delivery_status"}) do
            local manager = session(role)
            test.eq("allow", manager.scope:evaluate(manager.actor, "access", "kickside.mail.api:" .. endpoint .. ".endpoint"), role)
            test.neq("allow", manager.scope:evaluate(manager.actor, "access", "kickside.ui.api:list_settings_tabs.endpoint"), role)
        end
    end)

    test.it("returns editable shipped templates without license comments", function()
        local editor = session("editor")
        local originals = data(editor, "GET", "/library?state=original")
        local faces = 0
        for _, item in ipairs(originals.items) do
            if item.kind ~= "asset" then
                local resource = data(editor, "GET", "/library/" .. item.kind .. "/" .. item.name)
                test.is_nil(resource.html:find("SPDX-License-Identifier", 1, true), item.name)
                test.is_nil(resource.text:find("SPDX-License-Identifier", 1, true), item.name)
                test.is_nil(resource.description:find("site.title", 1, true), item.name)
                test.is_nil(resource.description:find("text face", 1, true), item.name)
                faces = faces + 1
            end
        end
        test.is_true(faces > 0)
    end)

    test.it("reads shipped source before and during customization", function()
        local editor = session("editor")
        local route = "/library/message/notice"
        local shipped = data(editor, "GET", route)
        own(shipped)
        local edit = {kind = shipped.kind, name = shipped.name, title = shipped.title, description = shipped.description,
            html = shipped.html, text = shipped.text, subject = "Customized subject", base = shipped.base,
            schema = shipped.schema, samples = shipped.samples, expected_revision = shipped.revision}
        update(editor, edit)
        local current = data(editor, "GET", route)
        test.eq("customized", current.state)
        test.eq("Customized subject", current.subject)
        for _, field in ipairs({"html", "text", "subject", "base"}) do
            test.eq(shipped[field], current.original[field], field)
        end
        test.eq(shipped.schema.properties.subject.type, current.original.schema.properties.subject.type)
        test.eq(shipped.samples.subject, current.original.samples.subject)
        test.eq(403, (request(session("sender"), "GET", route)))
        local part = own(fixture("part", "original-source-local", "Local part"))
        create(editor, part)
        test.is_nil(data(editor, "GET", "/library/part/" .. part.name).original)
    end)

    test.it("labels packaged resources with their declared source", function()
        local editor = session("editor")
        local list = data(editor, "GET", "/library?kind=message&state=original")
        local notice, reminder
        for _, item in ipairs(list.items) do
            if item.name == "notice" then notice = item end
            if item.name == "reminder" then reminder = item end
        end
        test.eq("kickside.mail.views:notice_template", notice.origin)
        test.eq("Mail", notice.origin_label)
        test.eq("Workspace notifications", reminder.origin_label)
        test.eq(notice.origin_label, data(editor, "GET", "/library/message/notice").origin_label)
    end)
end

return {register = register}
