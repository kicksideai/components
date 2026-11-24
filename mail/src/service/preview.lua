-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local client = require("client")
local message = require("message")
local render = require("render")
local attachments = require("attachments")

local function preview(request: types.PreviewRequest): (types.PreviewResult?, error?)
    local denied = client.require_library()
    if denied then return nil, denied end
    if type(request) ~= "table" then return nil, errors.new({kind = errors.INVALID, retryable = false,
        message = "A template and variables are required", details = {code = "invalid_template"}}) end
    if request.attachments ~= nil then
        local invalid = message.attachments_error(request.attachments)
        if invalid then return nil, invalid end
    end
    local rendered, render_err = render.render(request.template, request.vars, request.attachments)
    if render_err then return nil, render_err end
    local result = rendered :: types.Rendered
    local inline, inline_err = attachments.preview(result, request.attachments)
    if inline_err then return nil, inline_err end
    return {subject = result.subject, html = result.html :: string, text = result.text :: string, inline_assets = inline,
        warnings = render.warnings(result.html)}, nil
end

return {preview = preview}
