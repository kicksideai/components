-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local json = require("json")
local registry = require("registry")
local jet = require("jet")
local library_fixtures = require("library_fixtures")

local function register(support)
    local test = support.test
    local session = support.session
    local request = support.request
    local data = support.data
    local create = support.create
    local update = support.update
    local fixture = support.fixture
    local own = support.own
    local configure = support.configure
    local state = support.state

    test.it("serves packaged image bytes only to editors and honors the validator", function()
        local path = "/library/asset/logo/content"
        local editor = session("editor")
        local sender = session("sender")
        local status, _, bytes, headers = request(editor, "GET", path)
        test.eq(200, status, bytes)
        test.eq("image/png", headers["Content-Type"])
        test.eq("\137PNG\r\n\26\n", bytes:sub(1, 8))
        local etag = headers.Etag
        test.not_nil(etag:match('^"0%-[a-f0-9]+"$'))
        local cached, _, body = request(editor, "GET", path, nil, {["If-None-Match"] = '"old", W/' .. etag})
        test.eq(304, cached)
        test.eq("", body or "")
        test.eq(403, (request(sender, "GET", path, nil, {["If-None-Match"] = etag})))
        test.eq(401, (request(nil, "GET", path)))
        test.eq(404, (request(editor, "GET", "/library/asset/missing-image/content")))
    end)

    test.it("previews and lists assets with an unrelated scratch entry and clears it on reconciliation", function()
        local editor = session("editor")
        local owner = jet.draft_owner
        local id = "kickside.mail.draft:html"
        local overlay = assert(registry.overlay(owner))
        local changes = overlay:changes()
        assert(changes:create({id = id, kind = "template.set", data = {engine = {escape = "html"}}}))
        assert(changes:apply())
        local notice = data(editor, "GET", "/library/message/notice")
        local preview = assert(library_fixtures.render(nil, {template = "notice", vars = notice.samples}))
        test.not_nil(preview.html)
        test.not_nil(registry.get(id))
        local summary, body, raw = request(editor, "GET", "/library?kind=asset")
        local boot = assert(library_fixtures.boot())
        test.eq("success", boot.status, boot.message)
        local entries = assert(assert(registry.overlay(owner)):entries())
        for _, entry in ipairs(entries) do test.neq(id, entry.id) end
        test.eq(200, summary, raw)
        test.eq("logo", body.data.items[1].name)
        test.eq(2, body.data.items[1].used_by.messages)
        local rendered = data(editor, "POST", "/library/preview", {message = "notice"})
        test.not_nil(rendered.html)
        local item = data(editor, "GET", "/library/asset/logo")
        test.eq("notice", item.used_by.messages[1])
    end)

    test.it("updates asset usage when a message changes base or is deleted", function()
        local editor = session("editor")
        local path = "/library/asset/logo"
        local function summary()
            return data(editor, "GET", "/library?kind=asset").items[1].used_by.messages
        end
        local function used_by()
            return data(editor, "GET", path).used_by.messages
        end
        test.eq(2, summary())
        local item = own(fixture("message", "asset-usage", "{{ block body() }}Usage{{ end }}"))
        item.base, item.subject = "standard", "Usage"
        local saved = create(editor, item)
        test.eq(3, summary())
        test.eq("asset-usage", used_by()[1])
        test.eq("notice", used_by()[2])
        item.base, item.expected_revision = "plain", saved.revision
        saved = update(editor, item)
        test.eq(2, summary())
        test.eq("notice", used_by()[1])
        item.base, item.expected_revision = "standard", saved.revision
        saved = update(editor, item)
        test.eq(3, summary())
        data(editor, "DELETE", "/library/message/" .. item.name, {expected_revision = saved.revision})
        test.eq(2, summary())
        test.eq("notice", used_by()[1])
    end)

    test.it("lists the packaged asset and previews its CID under the editor capability", function()
        local editor = session("editor")
        local sender = session("sender")
        local assets = data(editor, "GET", "/library?kind=asset")
        test.eq(1, #assets.items)
        test.eq("logo", assets.items[1].name)
        local logo = data(editor, "GET", "/library/asset/logo")
        test.eq("original", logo.state)
        test.eq("image/png", logo.asset.content_type)
        test.eq(32, logo.asset.width)
        test.eq("notice", logo.used_by.messages[1])
        local preview = data(editor, "POST", "/library/preview", {message = "notice"})
        test.not_nil(preview.html:find('src="cid:mail-library-logo"', 1, true))
        test.not_nil(preview.inline_assets["mail-library-logo"]:match("^data:image/png;base64,"))
        test.eq(403, (request(sender, "GET", "/library/asset/logo")))
        test.eq(403, (request(sender, "POST", "/library", {kind = "asset", name = "proof"})))
    end)

    test.it("refuses malformed draft shapes and library filters consistently", function()
        local editor = session("editor")
        for _, body in ipairs({
            {message = "notice", resource = 12},
            {message = "notice", resource = false},
            {message = "notice", resources = {12}},
            {message = {}, resources = {}},
        }) do
            local status, result = request(editor, "POST", "/library/preview", body)
            test.eq(400, status, json.encode(result))
            test.is_true(result.code == "invalid_mail_draft" or result.code == "invalid_mail_resources",
                json.encode(result))
        end
        for _, filter in ipairs({"kind=unknown", "q=%00"}) do
            local status, result = request(editor, "GET", "/library?" .. filter)
            test.eq(400, status)
            test.eq("invalid_mail_filter", result.code)
        end
        local status, result = request(editor, "PUT", "/library/part/header", {kind = "part", name = "footer"})
        test.eq(400, status)
        test.eq("invalid_request", result.code)
        status, result = request(editor, "POST", "/library/preview", "notice")
        test.eq(400, status)
        test.eq("invalid_request", result.code)
    end)

    test.it("checks resource byte limits and the revision note character limit", function()
        local editor = session("editor")
        for _, case in ipairs({
            {field = "name", value = string.rep("n", 129)},
            {field = "html", value = string.rep("h", 512 * 1024 + 1), code = "mail_resource_too_large"},
            {field = "schema", value = {type = "object", properties = {}, description = string.rep("s", 32768)}},
            {field = "note", value = string.rep("n", 501), code = "invalid_revision_note"},
        }) do
            local part = own(fixture("part", "rejected-library-size", "Fixture"))
            part[case.field] = case.value
            local status, err = request(editor, "POST", "/library", part)
            test.eq(400, status, case.field)
            test.eq(case.code or "invalid_mail_resource", err.code)
        end
        local exact = own(fixture("part", string.rep("p", 128), "Accepted content"))
        exact.note = string.rep("é", 500)
        local created = create(editor, exact)
        test.eq(128, #created.name)
        local history = data(editor, "GET", "/library/part/" .. created.name .. "/history")
        test.eq(exact.note, history.items[1].note)
        local status, err = request(editor, "POST", "/library/preview",
            {message = "notice", vars = {message = string.rep("p", 3 * 1024 * 1024)}})
        test.eq(400, status)
        test.eq("invalid_request", err.code)
    end)

    test.it("warns about Gmail clipping and enforces the same render budget in preview and save", function()
        local editor = session("editor_sender")
        local vars = {subject = "Render budget", message = string.rep("'", 22 * 1024)}
        local preview = data(editor, "POST", "/library/preview", {message = "notice", vars = vars})
        test.is_true(#preview.html > 102 * 1024)
        test.eq("gmail_html_clipping", preview.warnings[1].code)
        vars.message = string.rep("'", 54 * 1024)
        local status, refused = request(editor, "POST", "/library/preview", {message = "notice", vars = vars})
        test.eq(400, status)
        test.eq("html_too_large", refused.code)
        test.eq("html", refused.details.face)
        configure()
        local send_status, send_error = request(editor, "POST", "/library/send-test", {message = "notice", vars = vars})
        test.eq(400, send_status)
        for _, field in ipairs({"code", "face", "limit", "maximum"}) do
            test.eq(refused.details[field], send_error.details[field], field)
        end
        test.eq("max_html_bytes", send_error.details.limit)
        test.eq(262144, send_error.details.maximum)
        local resource = own({kind = "message", name = "render-budget-copy",
            from = {kind = "message", name = "notice"}, samples = vars})
        local review_result = data(editor, "POST", "/library/preview", {message = resource.name, create = resource})
        test.is_nil(review_result.preview_id)
        test.eq("html_too_large", review_result.errors[1].code)
        test.eq(404, (request(editor, "GET", "/library/message/" .. resource.name)))
        vars.message = string.rep("x", 64 * 1024)
        status, refused = request(editor, "POST", "/library/preview", {message = "notice", vars = vars})
        test.eq(400, status)
        test.eq("invalid_template_vars", refused.code)
    end)
end

return {register = register}
