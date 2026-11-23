-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local message = require("message")
local render = require("render")

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

return { run = test.run_cases(function()
    test.describe("Mail message", function()
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
        test.it("rejects attachment bytes in public input", function()
            refuses(function(input) input.attachments = {ref({content = "bytes"})} end, "invalid_attachment")
            refuses(function(input) input.attachments = {ref({bytes = "data"})} end, "invalid_attachment")
        end)
    end)

    test.describe("Mail templates", function()
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
