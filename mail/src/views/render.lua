-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local templates = require("templates")
local html = require("html")
local registry = require("registry")
local fs = require("fs")
local error_envelope = require("error_envelope")
local message = require("message")
local catalog = require("catalog")

local M = {}
local TEXT_WIDTH = 72

local function wrap_line(line: string): string
    if assert(utf8.len(line), "Invalid UTF-8 line") <= TEXT_WIDTH then return line end

    local lines = {}
    local current = ""
    local width = 0
    for space, word in line:gmatch("([ \t]*)([^ \t]+)") do
        local word_width = assert(utf8.len(word), "Invalid UTF-8 word")
        if width > 0 and width + #space + word_width > TEXT_WIDTH then
            lines[#lines + 1] = current
            current, width = word, word_width
        else
            current = current .. space .. word
            width = width + #space + word_width
        end
    end
    lines[#lines + 1] = current .. line:match("[ \t]*$")
    return table.concat(lines, "\n")
end

local function render_part(set: types.TemplateSet, name: string, data: types.JsonObject, part: string): (string?, error?)
    local output, err = set:render(name, data)
    if err then return nil, error_envelope.wrap(err, "Cannot render mail " .. part, {code = "template_render_failed"}) end
    return output, nil
end

local function empty_body(part: string): error
    return errors.new({kind = errors.INVALID, message = "Mail template has no " .. part .. " content",
        retryable = false, details = {code = "body_required"}})
end

function M.layout_image(): (types.Attachment?, error?)
    local layout, layout_err = registry.get("kickside.mail.views:layout")
    if layout_err then return nil, layout_err end
    local image = layout.meta.inline_image :: types.LayoutImage
    local files, open_err = fs.get(image.filesystem)
    if open_err then return nil, open_err end
    local bytes, read_err = files:readfile(image.filename)
    if read_err then return nil, read_err end
    return {
        filename = image.filename,
        content_type = image.content_type,
        content_id = image.content_id,
        disposition = "inline",
        content = bytes,
    }, nil
end

local function render_html(set: types.TemplateSet, name: string, data: types.JsonObject, subject: string, text: string?): (types.Rendered?, error?)
    local logo, logo_err = M.layout_image()
    if logo_err then return nil, logo_err end
    data._mail_title = subject
    data._mail_logo_id = logo.content_id
    local body, body_err = render_part(set, name, data, "HTML")
    if body_err then return nil, body_err end
    if not body:find("%S") then return nil, empty_body("HTML") end
    return {subject = subject, html = body, text = text, attachments = {logo}}, nil
end

local function render_template(set: types.TemplateSet, parts: types.TemplateParts, data: types.JsonObject): (types.Rendered?, error?)
    local subject, subject_err = render_part(set, parts.subject, data, "subject")
    if subject_err then return nil, subject_err end
    local invalid = message.subject_error(subject)
    if invalid then return nil, invalid end

    local text, text_err = render_part(set, parts.text, data, "text")
    if text_err then return nil, text_err end
    if not text:find("%S") then return nil, empty_body("text") end
    if not utf8.len(text) then
        return nil, errors.new({kind = errors.INVALID, message = "Mail template text must be UTF-8",
            retryable = false, details = {code = "invalid_body"}})
    end
    return render_html(set, parts.html, data, subject :: string, (text:gsub("[^\r\n]+", wrap_line)))
end

local function open_templates(): (types.TemplateSet?, error?)
    local set, err = templates.get("kickside.mail.views:templates")
    if err then return nil, error_envelope.wrap(err, "Cannot open mail templates", {code = "template_open_failed"}) end
    return set :: types.TemplateSet, nil
end

function M.render(template_name: unknown, data: unknown): (types.Rendered?, error?)
    local declared, declaration_err = catalog.resolve(template_name)
    if declaration_err then return nil, declaration_err end
    local template = declared :: types.Template
    local validation_err = catalog.validate_vars(template.variable_schema, data)
    if validation_err then return nil, validation_err end
    local variables = {}
    for key, value in pairs(data :: types.JsonObject) do
        if key ~= "_mail_html" and key ~= "_mail_text" then variables[key] = value end
    end
    local set, err = open_templates()
    if err then return nil, err end
    local result, render_err = render_template(set, template.parts, variables)
    set:release()
    return result, render_err
end

function M.body(subject: string, text: string?, markup: string?): (types.Rendered?, error?)
    if text and not text:find("%S") then text = nil end
    local data = {_mail_text = text}
    if markup and markup:find("%S") then
        local policy, err = html.sanitize.ugc_policy()
        if err then return nil, err end
        policy:allow_elements("img")
        policy:allow_attrs("src", "alt"):on_elements("img")
        policy:allow_url_schemes("cid")
        data._mail_html = policy:sanitize(markup)
        if data._mail_html == "" then
            return nil, errors.new({kind = errors.INVALID, message = "HTML has no allowed content",
                retryable = false, details = {code = "body_required"}})
        end
    end
    local set, err = open_templates()
    if err then return nil, err end
    local result, render_err = render_html(set, "layout", data, subject, text)
    set:release()
    return result, render_err
end

return M
