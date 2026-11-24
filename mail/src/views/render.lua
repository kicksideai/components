-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local templates = require("templates")
local html = require("html")
local globals = require("globals")
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

local function render_html(set: types.TemplateSet, name: string, data: types.JsonObject, subject: string, text: string?): (types.Rendered?, error?)
    local body, body_err = render_part(set, name, data, "HTML")
    if body_err then return nil, body_err end
    if not body:find("%S") then return nil, empty_body("HTML") end
    return {subject = subject, html = body, text = text}, nil
end

local function render_template(html_set: types.TemplateSet, text_set: types.TemplateSet, parts: types.TemplateParts, data: types.JsonObject): (types.Rendered?, error?)
    local subject, subject_err = render_part(text_set, parts.subject, data, "subject")
    if subject_err then return nil, subject_err end
    local invalid = message.subject_error(subject)
    if invalid then return nil, invalid end

    local message_data = data.message :: types.JsonObject
    if type((data.vars :: types.JsonObject).preheader) ~= "string" then message_data.preheader = subject end
    message_data.subject = subject
    local text, text_err = render_part(text_set, parts.text, data, "text")
    if text_err then return nil, text_err end
    if not text:find("%S") then return nil, empty_body("text") end
    if not utf8.len(text) then
        return nil, errors.new({kind = errors.INVALID, message = "Mail template text must be UTF-8",
            retryable = false, details = {code = "invalid_body"}})
    end
    return render_html(html_set, parts.html, data, subject :: string, (text:gsub("[^\r\n]+", wrap_line)))
end

local function open_templates(id: string): (types.TemplateSet?, error?)
    local set, err = templates.get(id)
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
    local context, context_err = globals.data(variables, type(variables.subject) == "string" and variables.subject or "")
    if context_err then return nil, context_err end
    local html_set, err = open_templates("kickside.mail.views:templates")
    if err then return nil, err end
    local text_set, text_err = open_templates("kickside.mail.views:text_templates")
    if text_err then
        html_set:release()
        return nil, text_err
    end
    local result, render_err = render_template(html_set, text_set, template.parts, context)
    text_set:release()
    html_set:release()
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
    local context, context_err = globals.data(data, subject)
    if context_err then return nil, context_err end
    local set, err = open_templates("kickside.mail.views:templates")
    if err then return nil, err end
    local result, render_err = render_html(set, "base/standard", context, subject, text)
    set:release()
    return result, render_err
end

return M
