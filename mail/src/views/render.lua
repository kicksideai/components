-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local templates = require("templates")
local html = require("html")
local globals = require("globals")
local message = require("message")
local catalog = require("catalog")
local jet = require("jet")
local resources = require("resources")
local asset_refs = require("asset_refs")

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

function M.face_error(item: types.ResourceKey, face: string, err: error, engine: boolean?): error
    local engine_details = err:details()
    local details: types.Record = {}
    for key, value in pairs(engine_details or {}) do details[key] = value end
    details.code = details.code or "template_render_failed"
    details.resource = {kind = item.kind, name = item.name}
    details.face = face
    details.engine_kind = err:kind()
    local text = err:message()
    if engine then
        details.engine_message = text
        text = "Mail could not render this template."
    end
    return errors.new({kind = err:kind(), retryable = err:retryable() == true, message = text, details = details})
end

local function empty_body(part: string): error
    return errors.new({kind = errors.INVALID, message = "Mail template has no " .. part .. " content",
        retryable = false, details = {code = "body_required"}})
end

local function open_set(id: string, face: string): (types.TemplateSet?, error?)
    local set, err = templates.get(id)
    if not err then return set :: types.TemplateSet, nil end
    local details: types.Record = {}
    for key, value in pairs(err:details() or {}) do details[key] = value end
    details.code = details.code or "template_set_unavailable"
    details.face = face
    details.template_set = id
    return nil, errors.new({kind = err:kind(), retryable = err:retryable() == true, message = err:message(), details = details})
end

function M.with_sets<T>(html_id: string, text_id: string,
    run: (types.TemplateSet, types.TemplateSet) -> (T?, error?)): (T?, error?)
    local html_set, html_err = open_set(html_id, "html")
    if html_err then return nil, html_err end
    local text_set, text_err = open_set(text_id, "text")
    if text_err then
        html_set:release()
        return nil, text_err
    end
    local result, err = run(html_set :: types.TemplateSet, text_set :: types.TemplateSet)
    text_set:release()
    html_set:release()
    return result, err
end

local CLIPPING_BYTES = 102 * 1024

function M.warnings(body: string?): {types.PreviewWarning}?
    if not body or #body <= CLIPPING_BYTES then return nil end
    return {{code = "gmail_html_clipping", message = "Gmail may clip this email.", bytes = #body, threshold_bytes = CLIPPING_BYTES}}
end

function M.render_face(item: types.ResourceKey, face: string, set: types.TemplateSet, name: string,
    context: types.JsonObject): (string?, error?)
    local value, err = set:render(name, context)
    if err then return nil, M.face_error(item, face, err, true) end
    local limit = (face == "text" and message.body_error(value, nil))
        or (face == "html" and message.body_error(nil, value))
    if limit then return nil, M.face_error(item, face, limit) end
    return value, nil
end

function M.faces(item: types.ResourceContent, vars: unknown, values: types.RenderGlobals, html_set: types.TemplateSet,
    text_set: types.TemplateSet, attachments: {types.AttachmentRef}?): (types.Rendered?, error?)
    local validation_err = catalog.validate_vars(item.schema, vars)
    if validation_err then return nil, validation_err end
    local variables = vars :: types.JsonObject
    local context = globals.data(values, variables, type(variables.subject) == "string" and variables.subject or "")
    context._mail_html, context._mail_text = nil, nil
    context.assets = nil
    local name = jet.name(item)
    local subject, subject_err = M.render_face(item, "subject", text_set, jet.name(item, "subject"), context)
    if subject_err then return nil, subject_err end
    local invalid = message.subject_error(subject)
    if invalid then return nil, M.face_error(item, "subject", invalid) end

    local message_data = context.message :: types.JsonObject
    if type(variables.preheader) ~= "string" then message_data.preheader = subject end
    message_data.subject = subject

    local text, text_err = M.render_face(item, "text", text_set, name, context)
    if text_err then return nil, text_err end
    if not text:find("%S") then return nil, M.face_error(item, "text", empty_body("text")) end
    if not utf8.len(text) then
        return nil, M.face_error(item, "text", errors.new({kind = errors.INVALID, message = "Mail template text must be UTF-8",
            retryable = false, details = {code = "invalid_body"}}))
    end
    local assets = values.assets or {}
    local asset_context = asset_refs.context(assets, attachments)
    context.assets = asset_context
    local body, body_err = M.render_face(item, "html", html_set, name, context)
    if body_err then return nil, body_err end
    if not body:find("%S") then return nil, M.face_error(item, "html", empty_body("html")) end
    local wrapped = (text:gsub("[^\r\n]+", wrap_line))
    local text_limit = message.body_error(wrapped, nil)
    if text_limit then return nil, M.face_error(item, "text", text_limit) end
    return {subject = subject :: string, html = body, text = wrapped,
        library_assets = asset_refs.select(body, assets, asset_context)}, nil
end

function M.render(template_name: unknown, data: unknown, attachments: {types.AttachmentRef}?): (types.Rendered?, error?)
    local size_err = catalog.check_vars(data)
    if size_err then return nil, size_err end
    local item, declaration_err = catalog.resolve(template_name)
    if declaration_err then return nil, declaration_err end
    local values, err = globals.read()
    if err then return nil, err end
    local assets, asset_err = resources.list({kind = "asset"})
    if asset_err then return nil, asset_err end
    values.assets = assets
    return M.with_sets(jet.html, jet.text, function(html_set: types.TemplateSet, text_set: types.TemplateSet): (types.Rendered?, error?)
        return M.faces(item :: types.Resource, data, values :: types.RenderGlobals, html_set, text_set, attachments)
    end)
end

function M.body(subject: string, text: string?, markup: string?, attachments: {types.AttachmentRef}?): (types.Rendered?, error?)
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
    local values, globals_err = globals.read()
    if globals_err then return nil, globals_err end
    local context = globals.data(values :: types.RenderGlobals, data, subject)
    local assets, asset_err = resources.list({kind = "asset"})
    if asset_err then return nil, asset_err end
    local asset_context = asset_refs.context(assets :: {types.Resource}, attachments)
    context.assets = asset_context
    local set, err = open_set(jet.html, "html")
    if err then return nil, err end
    local body, render_err = M.render_face({kind = "base", name = "standard"}, "html", set, "base/standard", context)
    set:release()
    if render_err then return nil, render_err end
    if not body:find("%S") then return nil, empty_body("html") end
    return {subject = subject, html = body, text = text, library_assets = asset_refs.select(body, assets :: {types.Resource}, asset_context)}, nil
end

return M
