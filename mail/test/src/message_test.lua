-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local message = require("message")
local render = require("render")
local templates = require("templates")
local failure = require("failure")

local function valid()
    return { to = {"to@example.org"}, subject = "Status", text = "Ready" }
end

local function ref(overrides)
    local result = { upload_id = "upload", disposition = "attachment" }
    for key, value in pairs(overrides or {}) do result[key] = value end
    return result
end

local function refuses(change, code)
    local input = valid()
    change(input)
    local value, err = message.validate(input)
    test.is_nil(value)
    test.eq(errors.INVALID, err:kind())
    test.eq(code, err:details().code)
end

local function part(face, name, inputs)
    local set = assert(templates.get("kickside.mail.views:" .. face))
    local rendered, err = set:render("test/standalone-part", {part_path = "/part/" .. name, inputs = inputs})
    set:release()
    assert(not err, tostring(err))
    return rendered
end

return { run = test.run_cases(function()
    test.describe("Mail message", function()
        test.it("projects every driver failure to neutral Activity copy", function()
            local cases = {
                {"provider_rejected", "Ask a mail administrator to check why the message was refused.",
                    {"credentials_invalid", "authorization_refused", "sender_or_recipient_not_allowed",
                        "request_rejected", "idempotency_conflict", "provider_rejected"}},
                {"message_rejected", "Ask a mail administrator to check why the message was refused.", {"message_rejected"}},
                {"provider_unavailable", "Ask a mail administrator to check when mail delivery is available again.",
                    {"send_in_progress", "provider_unavailable"}},
                {"provider_request_failed", "Ask a mail administrator to check when mail delivery is available again.",
                    {"provider_request_failed"}},
                {"provider_transport_failed", "Ask a mail administrator to check when mail delivery is available again.",
                    {"provider_transport_failed"}},
                {"rate_limited", "Ask a mail administrator to check when sending can resume after the rate limit.",
                    {"quota_exhausted", "rate_limited"}},
                {"provider_response_invalid", "Ask a mail administrator to check why the message could not be delivered.",
                    {"provider_response_invalid"}},
                {"message_encoding_failed", "Ask a mail administrator to check why the message could not be delivered.",
                    {"message_encoding_failed"}},
                {"attachment_encoding_failed", "Check the message attachments before sending it again.", {"attachment_encoding_failed"}},
                {"invalid_content_id", "Check the message attachments before sending it again.", {"invalid_content_id"}},
                {"invalid_attachment", "Check the message attachments before sending it again.", {"invalid_attachment"}},
            }
            for _, case in ipairs(cases) do
                for _, code in ipairs(case[3]) do
                    local visible = failure.public(errors.INTERNAL, code)
                    test.eq(case[1], visible.code, code)
                    test.eq(case[2], visible.message, code)
                end
            end
        end)
        test.it("rejects caller-supplied From and invalid recipient and reply-to addresses", function()
            refuses(function(input) input.from = "sender@example.org" end, "from_not_allowed")
            refuses(function(input) input.to = {"a@example"} end, "invalid_address")
            refuses(function(input) input.cc = {[2] = "a@example.org"} end, "invalid_address")
            refuses(function(input) input.bcc = {"a@-example.org"} end, "invalid_address")
            refuses(function(input) input.reply_to = "a@example.org\r\nBcc: b@example.org" end, "invalid_address")
        end)
        test.it("requires To even when Cc is present", function()
            refuses(function(input) input.to = {} end, "recipient_required")
            refuses(function(input) input.cc, input.to = input.to, nil end, "recipient_required")
        end)
        test.it("requires a subject and rejects header line breaks", function()
            refuses(function(input) input.subject = nil end, "subject_required")
            refuses(function(input) input.subject = "Status\nBcc: another@example.org" end, "invalid_subject")
        end)
        test.it("validates UTF-8 subjects by character and rejects Unicode header controls", function()
            for _, separator in ipairs({"\u{0085}", "\u{009f}", "\u{2028}", "\u{2029}", string.char(255)}) do
                refuses(function(input) input.subject = "Status" .. separator .. "Next" end, "invalid_subject")
            end
            local input = valid()
            input.subject = string.rep("é", 255)
            local accepted, err = message.validate(input)
            test.not_nil(accepted, tostring(err))
            refuses(function(value) value.subject = input.subject .. "é" end, "subject_too_long")
        end)
        test.it("requires text, HTML, or a template", function()
            refuses(function(input) input.text = " " end, "body_required")
        end)
        test.it("caps the attachment count and total byte size", function()
            refuses(function(input)
                input.attachments = {}
                for i = 1, message.MAX_ATTACHMENTS + 1 do input.attachments[i] = ref() end
            end, "too_many_attachments")
            local total, err = message.add_attachment_size(message.MAX_ATTACHMENT_BYTES, 1)
            test.is_nil(total)
            test.eq("attachments_too_large", err:details().code)
        end)
        test.it("requires a valid content ID for inline attachments", function()
            refuses(function(input) input.attachments = {ref({disposition = "inline"})} end, "invalid_content_id")
            refuses(function(input)
                input.attachments = {ref({disposition = "inline", content_id = "bad\ncontent"})}
            end, "invalid_content_id")
        end)
        test.it("refuses zero-byte uploads and content IDs on regular attachments", function()
            refuses(function(input) input.attachments = {ref({content_id = "logo"})} end, "invalid_content_id")
            refuses(function(input) input.attachments = {{upload_id = "upload", content_id = "logo"}} end, "invalid_content_id")
            local total, err = message.add_attachment_size(0, 0)
            test.is_nil(total)
            test.eq(errors.INVALID, err:kind())
            test.eq("attachment_empty", err:details().code)
        end)
        test.it("rejects attachment bytes in public input", function()
            refuses(function(input) input.attachments = {ref({content = "bytes"})} end, "invalid_attachment")
            refuses(function(input) input.attachments = {ref({bytes = "data"})} end, "invalid_attachment")
        end)
    end)

    test.describe("Mail templates", function()
        test.it("identifies the face and registry ID when a template set cannot be opened", function()
            local missing = "app.templates:missing_set"
            for _, item in ipairs({
                {face = "html", html = missing, text = "kickside.mail.views:text_templates"},
                {face = "text", html = "kickside.mail.views:templates", text = missing},
            }) do
                local result, err = render.with_sets(item.html, item.text, function()
                    error("An unavailable template set must not be rendered")
                end)
                test.is_nil(result)
                test.not_nil(err)
                local details = assert(err:details(), tostring(err))
                test.eq("template_set_unavailable", details.code)
                test.eq(item.face, details.face)
                test.eq(missing, details.template_set)
                test.not_nil(err:message():find("resource not found", 1, true))
            end
        end)
        test.it("requires template.set engine.escape none for mail text", function()
            local set, open_err = templates.get("kickside.mail.views:text_templates")
            assert(set, "Mail requires a text template set and runtime support for template.set engine.escape: " .. tostring(open_err))
            local literal = [[A & <B> "C" 'D']]
            local subject, render_err = set:render("message/notice.subject", {subject = literal})
            set:release()
            assert(not render_err, tostring(render_err))
            assert(subject == literal, "Mail requires a runtime that honors template.set engine.escape: none")
        end)
        test.it("renders the notice header and text verbatim while escaping HTML", function()
            local literal = [[A & <B> "C" 'D' &lt;]]
            local escaped = "A &amp; &lt;B&gt; &#34;C&#34; &#39;D&#39; &amp;lt;"
            local result = assert(render.render("notice", {
                subject = literal, heading = "Status", message = literal, inline_content_id = "content",
                image_alt = "Status graphic",
            }))
            test.eq(literal, result.subject)
            test.eq("Status\n\n" .. literal .. "\n\nStatus graphic\n\nKickSide\n", result.text)
            test.not_nil(result.html:find("<!doctype html>", 1, true))
            test.not_nil(result.html:find("<title>" .. escaped .. "</title>", 1, true))
            test.not_nil(result.html:find(escaped .. "</p>", 1, true))
            test.not_nil(result.html:find('src="cid:content"', 1, true))
            test.not_nil(result.html:find('alt="Status graphic"', 1, true))
        end)
        test.it("renders the notice with a left-aligned card, preview line and accessible details", function()
            local rendered = assert(render.render("notice", {
                subject = "Status", preheader = "A & B", heading = "Report ready",
                message = "Read the update.", action_label = "Read the report", action_url = "https://example.org/report",
                details = {{key = "Status", value = "Ready"}}, inline_content_id = "content", image_alt = [[A "chart"]],
            }))
            local html = rendered.html
            local preheader = assert(html:find("A &amp; B", 1, true))
            local header = assert(html:find(">KickSide</strong>", 1, true))
            local card = assert(html:find("border-radius:12px", 1, true))
            local heading = assert(html:find("Report ready</h1>", 1, true))
            local footer = assert(html:find(">KickSide</", header + 1, true))
            test.is_true(preheader < header and header < card and card < heading and heading < footer)
            local _, filler = html:sub(preheader, header):gsub("&zwnj;&nbsp;", "")
            test.is_true(filler >= 120)
            test.not_nil(html:find('<html lang="en">', 1, true))
            test.not_nil(html:find('name="color-scheme" content="light only"', 1, true))
            test.not_nil(html:find('name="supported-color-schemes" content="light only"', 1, true))
            test.not_nil(html:match('<!%-%-%[if mso%]>.*width="600"'))
            test.not_nil(html:find("max-width:600px", 1, true))
            test.not_nil(html:find('role="presentation"', 1, true))
            test.not_nil(html:find('scope="row"', 1, true))
            test.not_nil(html:find("Read the report</a>", 1, true))
            test.not_nil(html:find('alt="A &#34;chart&#34;"', 1, true))
            test.is_nil(html:find("<style", 1, true))
            test.is_nil(html:find("<script", 1, true))
            test.is_true(#html < 102 * 1024)
            for _, literal in ipairs({"A & B", "Report ready", "Read the update.", "Read the report",
                "https://example.org/report", [[A "chart"]], "Status: Ready", "KickSide"}) do
                test.not_nil(rendered.text:find(literal, 1, true))
            end
        end)
        test.it("wraps prose and preserves the full action link in the text layout", function()
            local url = "https://example.org/reports/" .. string.rep("a", 75) .. "?a=1&b=2"
            local result = assert(render.render("notice", {
                subject = "Status", message = string.rep("word ", 30) .. "done",
                action_label = "Read the report", action_url = url,
                details = {{key = "State", value = "Ready"}},
            }))
            test.not_nil(result.text:find("\n" .. url .. "\n", 1, true))
            test.not_nil(result.text:find("State: Ready", 1, true))
            for line in result.text:gmatch("[^\n]+") do
                test.is_true(line == url or #line <= 72)
            end
            test.not_nil(result.html:find("?a=1&amp;b=2", 1, true))
        end)
        test.it("uses the default label in both standalone button faces", function()
            local button = {action_url = "https://example.org/report"}
            test.not_nil(part("templates", "button", button):find(">Open</a>", 1, true))
            test.eq("Open\n" .. button.action_url, part("text_templates", "button", button))
        end)
        test.it("renders standalone image and signature parts in both faces", function()
            local image = {src = "cid:chart", alt = "A & B", width = 320, height = 160, url = "https://example.org/report"}
            local html = part("templates", "image", image)
            test.not_nil(html:find('src="cid:chart" alt="A &amp; B" width="320" height="160"', 1, true))
            test.not_nil(html:find('href="https://example.org/report"', 1, true))
            test.eq("A & B\n" .. image.url, part("text_templates", "image", image))
            image.height, image.url = nil, nil
            html = part("templates", "image", image)
            test.is_nil(html:find(' height="', 1, true))
            test.is_nil(html:find(' href="', 1, true))
            test.eq("A & B", part("text_templates", "image", image))
            local signature = {name = "A & B", role = "Operations"}
            html = part("templates", "signature", signature)
            test.not_nil(html:find("<strong>A &amp; B</strong>", 1, true))
            test.not_nil(html:find("Operations</span>", 1, true))
            test.eq("A & B\nOperations", part("text_templates", "signature", signature))
            signature.role = nil
            test.eq("A & B", part("text_templates", "signature", signature))
        end)
        test.it("accepts standalone preheader input without message globals", function()
            local inputs = {preheader = "Review A & B"}
            local html = part("templates", "preheader", inputs)
            test.not_nil(html:find("Review A &amp; B", 1, true))
            test.eq(inputs.preheader, part("text_templates", "preheader", inputs))
        end)
        test.it("omits actions with non-web URLs in both bodies", function()
            local result = assert(render.render("notice", {
                subject = "Status", message = "Ready", action_label = "Open",
                action_url = "javascript:alert(1)",
            }))
            test.is_nil(result.html:find("javascript:", 1, true))
            test.is_nil(result.text:find("javascript:", 1, true))
        end)
        test.it("renders an external template that extends the shared layout", function()
            local result = assert(render.render("reminder", {task = "A & B"}))
            test.eq("Reminder: A & B", result.subject)
            test.eq("Please finish A & B.\n\nKickSide\n", result.text)
            test.not_nil(result.html:find("<p>Please finish A &amp; B.</p>", 1, true))
        end)
        test.it("escapes caller text and wraps it in the same layout", function()
            local result = assert(render.body("Status", "<b>Hi & bye</b>", nil))
            test.eq("Status", result.subject)
            test.eq("<b>Hi & bye</b>", result.text)
            test.not_nil(result.html:find("<!doctype html>", 1, true))
            test.not_nil(result.html:find("<title>Status</title>", 1, true))
            test.not_nil(result.html:find("&lt;b&gt;Hi &amp; bye&lt;/b&gt;</pre>", 1, true))
        end)
        test.it("sanitizes caller HTML while retaining CID images", function()
            local result = assert(render.body("Status", nil,
                '<p>Hello</p><script>bad()</script><img src="cid:logo" onerror="bad()">'))
            test.is_nil(result.text)
            test.not_nil(result.html:find("<p>Hello</p>", 1, true))
            test.not_nil(result.html:find('src="cid:logo"', 1, true))
            test.is_nil(result.html:find("bad()", 1, true))
        end)
        test.it("returns a native error for a missing template and can render again", function()
            local result, err = render.render("missing", {})
            test.is_nil(result)
            test.eq("template_not_found", err:details().code)
            test.not_nil(assert(render.render("notice", { subject = "Status", message = "Ready" })))
        end)
        test.it("validates the rendered subject as a mail header", function()
            local result, err = render.render("notice", {subject = "Status\nBcc: to@example.org", message = "Ready"})
            test.is_nil(result)
            test.eq("invalid_subject", err:details().code)
        end)
    end)
end) }
