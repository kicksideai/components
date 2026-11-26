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
local canonical = require("canonical_json")

local M = {}

function M.add(input: types.AssetWrite): (types.Resource?, error?)
    if type(input) ~= "table" then return nil, resources.error(errors.INVALID, "invalid_mail_asset", "Provide a mail asset upload") end
    local key = {kind = "asset", name = input.name}
    local expected = input.expected_revision
    local operation = expected == nil and "create" or "update"
    local edit: types.LibraryEdit = {key = key, expected = expected, note = input.note,
        content = (input :: unknown) :: types.ResourceContent}
    local invalid = edit_rules.validate({edit}, operation)
    if invalid then return nil, invalid end
    if type(input.upload_id) ~= "string" or not uuid.validate(input.upload_id)
        or (input.title ~= nil and (type(input.title) ~= "string" or not input.title:find("%S")))
        or (input.description ~= nil and type(input.description) ~= "string") then
        return nil, resources.error(errors.INVALID, "invalid_mail_asset", "Provide an upload ID and optional title and description", key)
    end
    local denied = library.require_write()
    if denied then return nil, denied end
    local identity = "add_asset"
    local signature: string?
    if input.command_id then
        local command_id, id_err = edit_rules.command_id(input.command_id)
        if id_err then return nil, id_err end
        local hash_err
        signature, hash_err = canonical.hash({key = key, upload_id = input.upload_id, title = input.title,
            description = input.description, expected_revision = input.expected_revision, note = input.note})
        if hash_err then return nil, hash_err end
        local replay, replay_err = writer.replay_asset(key, identity, command_id :: string, signature :: string)
        if replay or replay_err then return replay, replay_err end
    end
    local current, read_err = library.lookup(key)
    if read_err and read_err:kind() ~= errors.NOT_FOUND then return nil, read_err end
    if operation == "create" then
        if current then return nil, edit_rules.conflict(key, current.revision) end
    elseif not current then
        return nil, edit_rules.missing(key)
    elseif expected ~= current.revision then
        return nil, edit_rules.conflict(key, current.revision)
    end
    local _, info, info_err = content.upload_info(input.upload_id)
    if info_err then return nil, info_err end
    info = info :: types.ContentInfo
    local bad_image = asset_refs.image_error(info.content_type, info.size)
    if bad_image then return nil, bad_image end
    local version = uuid.v7()
    local now = time.now():utc()
    local lease = now:add(15 * time.MINUTE)
    local asset: types.Asset = {source = "upload", upload_id = version, filename = info.filename,
        content_type = info.content_type, size = info.size :: integer}
    local deadline = lease:unix_nano() // 1000000
    local _, reserve_err = database.with_tx(function(tx: database.Transaction): (boolean?, error?)
        return asset_file_repo.reserve(tx, version, now:unix_nano() // 1000000, deadline)
    end)
    if reserve_err then return nil, reserve_err end
    notify.retention()
    local adopted, adopt_err = uploads.adopt(content.library_component_id(), input.upload_id, version, lease:format(time.RFC3339))
    if adopt_err then return nil, adopt_err end
    if (adopted :: {upload_id: string}).upload_id ~= version then
        return nil, resources.error(errors.INTERNAL, "invalid_mail_asset", "Uploads returns an unexpected asset version", key)
    end
    edit.content = resources.asset_content(input.name, input.title or (current and current.title) or input.name,
        input.description or (current and current.description) or "", asset)
    edit.asset_deadline = deadline
    return writer.one(edit, operation, {command_id = input.command_id, identity_op = identity, command_hash = signature})
end


return M
