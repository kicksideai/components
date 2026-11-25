-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local contract = require("contract")
local security = require("security")
local http = require("http_client")
local sql = require("sql")
local time = require("time")
local uuid = require("uuid")
local library_fixtures = require("library_fixtures")
local api_fixtures = require("api_fixtures")
local autoinit = require("autoinit")

local function register(support)
    local test = support.test
    local session = support.session
    local request = support.request
    local data = support.data
    local review = support.review
    local create = support.create
    local update = support.update
    local revision_write = support.revision_write
    local fixture = support.fixture
    local own = support.own
    local failed = support.failed
    local state = support.state

    test.it("names the candidate sources when a draft message include fails", function()
        local editor = session("editor")
        local part = own(fixture("part", "candidate-part", "Static"))
        create(editor, part)
        local base = own(fixture("base", "candidate-base",
            '{{ include "/part/candidate-part" }}{{ block body() }}{{ end }}'))
        create(editor, base)
        local message = own(fixture("message", "candidate-message", "{{ block body() }}Content{{ end }}"))
        message.base, message.subject = base.name, "Candidate diagnostic"
        create(editor, message)
        part.html = "{{ missing_value }}"
        local _, body = request(editor, "POST", "/library/preview", {message = message.name, resource = part})
        test.eq(message.name, body.details.resource.name)
        test.eq("template_render_failed", body.code)
        test.not_nil(body.details.engine_message:find("missing_value", 1, true))
        local candidates = body.details.candidate_resources
        test.eq(3, #candidates)
        test.eq(message.name, candidates[1].name)
        test.eq(base.name, candidates[2].name)
        test.eq(part.name, candidates[3].name)
    end)

    local function directive(word, kind, name)
        return '{{ ' .. word .. ' "/' .. kind .. '/' .. name .. '" }}'
    end

    local function cycle_failure(details, label, diagnostic)
        test.eq("html", details.face, label)
        test.not_nil(details.engine_message:find(diagnostic or "template dependency cycle", 1, true), details.engine_message)
    end

    local function http_cycle(editor, method, path, payload, diagnostic)
        local status, body, raw = request(editor, method, path, payload)
        test.eq(400, status, method .. " " .. path .. ": " .. raw)
        test.eq(errors.INVALID, body.kind, raw)
        test.eq("template_render_failed", body.code, raw)
        cycle_failure(body.details, path, diagnostic)
    end

    local function review_cycle(editor, draft, diagnostic)
        local result = data(editor, "POST", "/library/preview", draft)
        test.is_nil(result.preview_id)
        local issue = assert(result.errors[1])
        test.eq("template_render_failed", issue.code)
        cycle_failure(issue, "review", diagnostic)
    end

    local function tool_cycle(editor, tool, payload, diagnostic)
        local result, err = editor:call("kickside.mail.traits:" .. tool, payload)
        assert(not err, tostring(err))
        test.eq(false, result.success, tool)
        test.eq("template_render_failed", result.code, tool)
        cycle_failure(tool == "library_preview" and result.errors[1] or result, tool, diagnostic)
        test.is_nil(result.preview_id, tool)
    end

    local function seed_source(item, html)
        local db = assert(sql.get("app:db"))
        assert(db:execute("UPDATE mail_library SET html=$1 WHERE kind=$2 AND name=$3",
            {html, item.kind, item.name}))
        assert(db:release())
    end

    local function seed_history(editor, item, invalid_html)
        local actor = assert(security.new_actor(editor.id, {user_id = editor.id, security_groups = {"app:mail_editors"}}))
        local scope = api_fixtures.role_scope({"app.mail_library:projection_fixture"})
        local definition = assert(contract.get("kickside.core:threads"))
        local threads = assert(definition:with_actor(actor):with_scope(scope):open())
        local thread = autoinit.component_id(autoinit.SYSTEM_SCOPE_KEY, "kickside.mail.library")
        local function snapshot(version, html)
            return {type = "kickside.mail.events:resource.updated", subject = item.kind .. "/" .. item.name,
                body = {key = {kind = item.kind, name = item.name}, revision = version, author = editor.id,
                    change = "edited", state = "created", preview_id = uuid.v4(), base = item.base,
                    content = {title = item.title, description = item.description, html = html, text = item.text,
                        subject = item.subject, schema = item.schema, samples = item.samples}}}
        end
        local receipt, err = threads:append_events({thread_id = thread, events = {
            snapshot(item.revision + 1, invalid_html), snapshot(item.revision + 2, item.html),
        }})
        assert(receipt, tostring(err))
        local projection, catch_err = threads:catch_up_projection({thread_id = thread,
            kind = "kickside.mail:library_tables", target_seq = receipt.max_seq,
            deadline = time.now():add(5 * time.SECOND):format(time.RFC3339)})
        assert(projection and projection.done, tostring(catch_err or (projection or {}).reason))
        local published = assert(library_fixtures.boot())
        assert(published.status == "success", published.message)
        library_fixtures.await_current_live()
        return receipt.max_seq - 1, item.revision + 2
    end

    local graphs = {
        {kind = "base", word = "extends"},
        {kind = "base", word = "extends", peer = "base"},
        {kind = "base", word = "import"},
        {kind = "base", word = "import", peer = "base"},
        {kind = "part", word = "extends"},
        {kind = "part", word = "extends", peer = "part"},
        {kind = "part", word = "import"},
        {kind = "part", word = "import", peer = "part"},
        {kind = "message", word = "import"},
        {kind = "message", word = "import", peer = "part"},
        {kind = "message", word = "extends", diagnostic = "Unexpected extends clause"},
        {kind = "message", word = "extends", peer = "base"},
        {kind = "part", word = "include", diagnostic = "maximum 'include' depth"},
        {kind = "part", word = "include", peer = "part", diagnostic = "maximum 'include' depth"},
    }
    for _, graph in ipairs(graphs) do
        local shape = graph.peer and ("mutual with " .. graph.peer) or "self"
        test.it("reports " .. graph.kind .. " " .. graph.word .. " cycles (" .. shape .. ") without publishing", function()
            local editor = session("editor")
            local agent = assert(funcs.new():with_actor(editor.actor):with_scope(editor.scope))
            local target = own(fixture(graph.kind, "cycle-target", "Cycle content"))
            if graph.kind == "base" then
                target.html, target.text = "Before {{ block body() }}{{ end }}", "Before {{ block body() }}{{ end }}"
            elseif graph.kind == "message" then
                target.html, target.text = "{{ block body() }}Cycle content{{ end }}", "{{ block body() }}Cycle content{{ end }}"
                target.subject, target.base = "Cycle", "standard"
            end

            local peer
            if graph.peer then
                local source = graph.peer == "base" and "Peer {{ block body() }}{{ end }}" or "Peer"
                peer = own(fixture(graph.peer, "cycle-peer", source))
                create(editor, peer)
            end
            if graph.kind == "message" and graph.word == "extends" and peer then target.base = peer.name end
            local good_html = target.html
            local destination = peer or target
            local bad_html = directive(graph.word, destination.kind, destination.name) .. good_html
            if graph.kind == "message" and graph.word == "extends" and peer then
                -- The message's declared base supplies its extends directive.
                bad_html = good_html
            end
            local route = "/library/" .. target.kind .. "/" .. target.name
            local function arm_peer(active)
                if peer then
                    local source = active and directive(graph.word, target.kind, target.name) .. peer.html or peer.html
                    seed_source(peer, source)
                end
            end
            local function alive()
                local preview = data(editor, "POST", "/library/preview", {message = "notice"})
                test.not_nil(preview.html)
            end

            -- A pre-existing source may name a resource that has yet to be created.
            arm_peer(true)
            target.html = bad_html
            local create_draft = {message = target.kind == "message" and target.name or "notice", create = target}
            review_cycle(editor, create_draft, graph.diagnostic)
            tool_cycle(agent, "library_preview", create_draft, graph.diagnostic)
            test.eq(404, (request(editor, "GET", route)))
            alive()
            arm_peer(false)

            target.html = good_html
            local first = create(editor, target)
            local message = target.name
            if target.kind ~= "message" then
                local body = "Cycle content"
                if target.kind == "part" then body = directive("include", target.kind, target.name) end
                local dependent = own(fixture("message", "cycle-dependent", "{{ block body() }}" .. body .. "{{ end }}"))
                dependent.base, dependent.subject = target.kind == "base" and target.name or "standard", "Cycle"
                create(editor, dependent)
                message = dependent.name
            end
            local second = update(editor, {
                kind = target.kind, name = target.name, html = good_html, text = target.text,
                title = "Healthy current revision", description = target.description,
                subject = target.subject, base = target.base, schema = target.schema, samples = target.samples,
                expected_revision = first.revision,
            })
            local historical_seq, current_revision = seed_history(editor, second, bad_html)
            target.expected_revision = current_revision
            target.title = second.title
            arm_peer(true)
            target.html = bad_html
            http_cycle(editor, "POST", "/library/preview", {message = message, resource = target}, graph.diagnostic)
            local preview = {message = message, resources = {target}}
            tool_cycle(agent, "library_preview", preview, graph.diagnostic)
            alive()
            review_cycle(editor, preview, graph.diagnostic)
            alive()

            local restore = {kind = target.kind, name = target.name,
                seq = historical_seq, expected_revision = current_revision}
            local restore_draft = {message = message, restore = restore}
            review_cycle(editor, restore_draft, graph.diagnostic)
            tool_cycle(agent, "library_preview", restore_draft, graph.diagnostic)
            arm_peer(false)
            local stored = data(editor, "GET", route)
            test.eq(current_revision, stored.revision)
            test.eq(good_html, stored.html)
            test.eq(4, #data(editor, "GET", route .. "/history").items)
            local healthy = data(editor, "POST", "/library/preview", {message = message})
            test.not_nil(healthy.html:find("Cycle content", 1, true))
        end)
    end

    test.it("serves library edits and candidate previews through the router", function()
        local editor = session("editor")
        local base = own(fixture("base", "http-frame", "[{{ block body() }}{{ end }}]"))
        local saved_base = create(editor, base)
        local msg = own(fixture("message", "http-message", "{{ block body() }}Body{{ end }}"))
        msg.base, msg.subject = base.name, "Hello"
        local saved = create(editor, msg)
        local copy = create(editor, own({kind = "message", name = "http-copy",
            from = {kind = "message", name = msg.name}, title = "Copy of the fixture"}))
        test.eq(msg.subject, copy.subject)
        test.eq(msg.base, copy.base)
        local list = data(editor, "GET", "/library?kind=message&state=created&q=fixture")
        test.eq(1, #list.items)
        test.eq(copy.name, list.items[1].name)
        local name = "/library/message/" .. msg.name
        test.eq(saved.revision, data(editor, "GET", name).revision)
        local use = data(editor, "GET", "/library/base/" .. base.name)
        test.eq(2, #use.used_by.messages)
        test.eq(copy.name, use.used_by.messages[1])
        test.eq(msg.name, use.used_by.messages[2])
        local status, blocked = request(editor, "DELETE", "/library/base/" .. base.name,
            {expected_revision = saved_base.revision})
        test.eq(409, status)
        test.eq("mail_resource_in_use", blocked.code)

        local draft = fixture("message", msg.name, "{{ block body() }}Draft body{{ end }}")
        draft.base, draft.subject = base.name, "Draft subject"
        local preview = data(editor, "POST", "/library/preview", {message = msg.name, resources = {draft}})
        test.eq("Draft subject", preview.subject)
        test.eq("[Draft body]", preview.html)
        test.eq("[Draft body]", preview.text)
        draft.html = "{{ block body() }}{{ unknown_value }}{{ end }}"
        local bad_status, bad = request(editor, "POST", "/library/preview", {message = msg.name, resources = {draft}})
        test.eq(400, bad_status)
        test.eq(msg.name, bad.details.resource.name)
        test.eq("html", bad.details.face)
        draft.html = draft.text
        draft.expected_revision = saved.revision
        base.expected_revision = saved_base.revision
        local batch = {resources = {draft, base}, note = "Save both"}
        batch.preview_id = review(editor, msg.name, {resources = batch.resources})
        local result = data(editor, "POST", "/library/save", batch)
        library_fixtures.await_live(result.seq)
        test.eq(2, #result.items)
        copy.expected_revision = copy.revision
        copy.title = "New copy name"
        local single = update(editor, copy)
        local moved = revision_write(editor, "base", result.items[1], {base = "plain"})
        local revisions = data(editor, "GET", name .. "/history")
        test.eq(3, #revisions.items)
        test.eq("Save both", revisions.items[2].note)
        local restored = revision_write(editor, "restore", moved, {seq = saved.seq})
        test.eq(base.name, restored.base)
        local shipped = own(data(editor, "GET", "/library/base/plain"))
        local original_revision = shipped.revision
        shipped.html, shipped.text = base.html, base.text
        shipped.expected_revision = original_revision
        local customized = update(editor, shipped)
        local reset = revision_write(editor, "reset", customized, {})
        test.eq("original", reset.state)
        test.is_true(reset.revision > original_revision)

        data(editor, "DELETE", name, {expected_revision = restored.revision})
        data(editor, "DELETE", "/library/message/" .. copy.name, {expected_revision = single.revision})
        data(editor, "DELETE", "/library/base/" .. base.name, {expected_revision = result.items[2].revision})
    end)
end

return {register = register}
