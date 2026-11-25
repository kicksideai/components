-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local resource = require("resource")

local PREFIX = "kickside.mail.events:"

local M = {
    CREATED = PREFIX .. "resource.created",
    UPDATED = PREFIX .. "resource.updated",
    BASE_SET = PREFIX .. "resource.base_set",
    RESET = PREFIX .. "resource.reset",
    RESTORED = PREFIX .. "resource.restored",
    ARCHIVED = PREFIX .. "resource.archived",
    DELETED = PREFIX .. "resource.deleted",
    ASSET_ADDED = PREFIX .. "asset.added",
    ASSET_RESTORED = PREFIX .. "asset.restored",
    ASSET_REMOVED = PREFIX .. "asset.removed",
}

local snapshots = {
    [M.CREATED] = true, [M.UPDATED] = true, [M.BASE_SET] = true, [M.RESET] = true, [M.RESTORED] = true,
}

function M.content(body: types.LibraryEventBody): (types.ResourceContent?, error?)
    if body.asset or (body.key.kind == "asset" and body.state == "original") then
        local asset = body.asset
        local content = body.content
        return {kind = "asset", name = body.key.name, title = (body.title or content.title) :: string,
            description = (body.description or content.description) :: string, html = "", text = "",
            schema = {type = "object", properties = {}}, samples = {},
            asset = asset and {source = "upload", upload_id = asset.upload_id, filename = asset.filename,
                content_type = asset.content_type, size = asset.size} or {source = "original"}}, nil
    end
    local content = body.content
    if not content then
        return nil, resource.error(errors.INVALID, "mail_event_snapshot_missing", "A resource event requires a full snapshot", body.key)
    end
    local item: types.ResourceContent = {
        kind = body.key.kind, name = body.key.name, base = body.base, subject = content.subject,
        title = content.title, description = content.description, html = content.html, text = content.text,
        schema = content.schema, samples = content.samples,
    }
    local invalid = resource.check_content(item)
    if invalid then return nil, invalid end
    return item, nil
end

function M.snapshot(item: types.ResourceContent): types.EventContent
    return {title = item.title, description = item.description, html = item.html, text = item.text,
        subject = item.subject, schema = item.schema, samples = item.samples}
end

function M.build(event_type: string, body: types.LibraryEventBody): (types.LibraryEvent?, error?)
    local invalid = resource.check_input_key(body.key)
    if invalid then return nil, invalid end
    if snapshots[event_type] then
        local _, err = M.content(body)
        if err then return nil, err end
    end
    return {type = event_type, body = body, subject = resource.subject(body.key)}, nil
end

function M.external_name(operation: string, command_id: string, index: integer): string
    return operation .. ":" .. command_id .. ":" .. index
end

return M
