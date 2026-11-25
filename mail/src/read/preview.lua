-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local base64 = require("base64")
local content = require("content")
local message = require("message")
local render = require("render")
local vars_schema = require("vars")
local globals = require("globals")
local jet = require("jet")
local library = require("library")
local settings = require("settings")

local function render_values(): (types.RenderGlobals?, error?)
    local appearance, err = settings.appearance()
    if err then return nil, err end
    local assets, asset_err = library.resources({kind = "asset"})
    if asset_err then return nil, asset_err end
    local values = globals.data(appearance :: types.Appearance)
    values.assets = assets
    return values, nil
end

local function template(name: unknown, vars: unknown, refs: {types.AttachmentRef}?): (types.Rendered?, error?)
    local invalid = vars_schema.check_vars(vars)
    if invalid then return nil, invalid end
    local item, lookup_err = library.live_message(name)
    if lookup_err then return nil, lookup_err end
    local values, err = render_values()
    if err then return nil, err end
    return render.with_sets(jet.html, jet.text, function(html: types.TemplateSet, text: types.TemplateSet): (types.Rendered?, error?)
        return render.faces(item :: types.Resource, vars, values :: types.RenderGlobals, html, text, refs)
    end)
end

local function body(subject: string, text: string?, html: string?, refs: {types.AttachmentRef}?): (types.Rendered?, error?)
    local fenced = library.require_live()
    if fenced then return nil, fenced end
    local values, err = render_values()
    if err then return nil, err end
    return render.body(subject, text, html, values :: types.RenderGlobals, refs)
end

local function inline_assets(rendered: types.Rendered, refs: {types.AttachmentRef}?): (types.InlineAssets?, error?)
    local files, err = content.attachments({refs = refs, library_assets = rendered.library_assets, message_bytes = 0}, true, rendered.html or "")
    if err then return nil, err end
    if #files == 0 then return nil, nil end
    local inline: types.InlineAssets = {}
    for _, file in ipairs(files) do
        local encoded, encode_err = base64.encode(file.content)
        if encode_err then return nil, encode_err end
        inline[file.content_id :: string] = "data:" .. file.content_type .. ";base64," .. encoded
    end
    return inline, nil
end

local function preview(request: types.PreviewRequest): (types.PreviewResult?, error?)
    local denied = library.require_read()
    if denied then return nil, denied end
    if type(request) ~= "table" then return nil, errors.new({kind = errors.INVALID, retryable = false,
        message = "A template and variables are required", details = {code = "invalid_template"}}) end
    if request.attachments ~= nil then
        local invalid = message.attachments_error(request.attachments)
        if invalid then return nil, invalid end
    end
    local rendered, render_err = template(request.template, request.vars, request.attachments)
    if render_err then return nil, render_err end
    local result = rendered :: types.Rendered
    local inline, inline_err = inline_assets(result, request.attachments)
    if inline_err then return nil, inline_err end
    return {subject = result.subject, html = result.html :: string, text = result.text :: string, inline_assets = inline,
        warnings = render.warnings(result.html)}, nil
end

return {preview = preview, template = template, body = body, inline_assets = inline_assets}
