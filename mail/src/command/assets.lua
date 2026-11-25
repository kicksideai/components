-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local time = require("time")
local uuid = require("uuid")
local resources = require("resource")
local edit_rules = require("edit")
local library = require("library")
local writer = require("writer")
local content = require("content")
local asset_refs = require("asset_refs")
local asset_file_repo = require("asset_file_repo")
local database = require("database")
local uploads = require("uploads")
local notify = require("notify")

local M = {}

local function dimension(value: unknown): boolean
    return value == nil or (type(value) == "number" and math.tointeger(value) ~= nil and value > 0)
end

function M.adopt(input: types.AssetWrite, operation: string): (types.Resource?, error?)
    local denied = library.require_write()
    if denied then return nil, denied end
    local key = {kind = "asset", name = input.name}
    local bad = operation == "create" and resources.check_input_key(key) or resources.check_key(key)
    if bad then return nil, bad end
    local note_err = resources.check_note(input.note)
    if note_err then return nil, note_err end
    if operation == "update" and (type(input.expected_revision) ~= "number"
        or math.tointeger(input.expected_revision) == nil or input.expected_revision < 0) then
        return nil, resources.error(errors.INVALID, "invalid_mail_revision", "Provide an expected revision", key)
    end
    local content_err = resources.check_content((input :: unknown) :: types.ResourceContent)
    if content_err then return nil, content_err end
    if type(input.upload_id) ~= "string" or not uuid.validate(input.upload_id)
        or not dimension(input.width) or not dimension(input.height)
        or (input.title ~= nil and (type(input.title) ~= "string" or not input.title:find("%S")))
        or (input.description ~= nil and type(input.description) ~= "string") then
        return nil, resources.error(errors.INVALID, "invalid_mail_asset", "Provide an upload ID and optional image dimensions", key)
    end
    local current, read_err = library.lookup(key)
    if read_err and read_err:kind() ~= errors.NOT_FOUND then return nil, read_err end
    if operation == "create" then
        if current then return nil, edit_rules.conflict(key, current.revision) end
    elseif not current then
        return nil, edit_rules.missing(key)
    elseif input.expected_revision ~= current.revision then
        return nil, edit_rules.conflict(key, current.revision)
    end
    local _, info, info_err = content.upload_info(input.upload_id)
    if info_err then return nil, info_err end
    info = info :: types.ContentInfo
    local bad_image = asset_refs.image_error(info.content_type, info.size)
    if bad_image then return nil, bad_image end
    local version = uuid.v7()
    local lease = time.now():utc():add(15 * time.MINUTE)
    local asset: types.Asset = {source = "upload", upload_id = version, filename = info.filename,
        content_type = info.content_type, size = info.size :: integer, width = input.width, height = input.height}
    local deadline = lease:unix_nano() // 1000000
    local _, reserve_err = database.with_tx(function(tx: types.Transaction): (boolean?, error?)
        return asset_file_repo.reserve(tx, asset, deadline)
    end)
    if reserve_err then return nil, reserve_err end
    notify.retention()
    local adopted, adopt_err = uploads.adopt(content.library_component_id(), input.upload_id, version, lease:format(time.RFC3339))
    if adopt_err then return nil, adopt_err end
    if (adopted :: {upload_id: string}).upload_id ~= version then
        return nil, resources.error(errors.INTERNAL, "invalid_mail_asset", "Uploads returns an unexpected asset version", key)
    end
    local candidate: types.ResourceContent = {kind = key.kind, name = input.name, title = input.title or (current and current.title) or input.name,
        description = input.description or (current and current.description) or "", html = "", text = "",
        schema = {type = "object", properties = {}}, samples = {}, asset = asset}
    return writer.one({key = key, content = candidate, expected = input.expected_revision, note = input.note,
        asset_deadline = deadline}, operation)
end

function M.add(input: types.AssetWrite): (types.Resource?, error?)
    local denied = library.require_write()
    if denied then return nil, denied end
    if type(input) ~= "table" then return nil, resources.error(errors.INVALID, "invalid_mail_asset", "Provide a mail asset upload") end
    local current, read_err = library.lookup({kind = "asset", name = input.name})
    if read_err and read_err:kind() ~= errors.NOT_FOUND then return nil, read_err end
    if current and input.expected_revision == nil then input.expected_revision = current.revision end
    if not current and input.expected_revision ~= nil then return nil, edit_rules.missing({kind = "asset", name = input.name}) end
    return M.adopt(input, current and "update" or "create")
end

return M
