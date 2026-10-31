-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local cloudstorage = require("cloudstorage")
local uploads_resources = require("uploads_resources")
local artifacts = require("artifacts")
local policy = require("policy")
local copier = require("copier")
local M = {}

local function unavailable(message: string): any
    return errors.new({ message = message, kind = errors.UNAVAILABLE, retryable = false })
end

local function invalid(message: string): any
    return errors.new({ message = message, kind = errors.INVALID, retryable = false })
end

local function packed(path: any): boolean
    return type(path) == "string" and path:sub(1, 5) == "s3://"
end

local function settings_policy(): (any?, any?)
    local definition, definition_err = contract.get("kickside.settings:settings")
    if definition_err then return nil, definition_err end
    if not definition then return nil, unavailable("Settings unavailable") end
    local settings, open_err = definition:open()
    if open_err then return nil, open_err end
    if not settings then return nil, unavailable("Settings unavailable") end
    local result, get_err = settings:get({ namespace = "kickside.storage_s3", key = "policy" })
    if get_err then return nil, get_err end
    if not result or result.success ~= true then return nil, result and result.error or unavailable("Storage policy unavailable") end
    return result.value, nil
end

local function object_key(prefix: string, upload_id: string, name: string): string
    return prefix .. "/" .. upload_id .. "/" .. name
end

local function copy(storage_id: string, source_path: string, cloud: any, resource_id: string,
    key: string, mime_type: string?): (string?, any?)
    local storage, storage_err = uploads_resources.get_storage(storage_id)
    if storage_err then return nil, storage_err end
    if not storage then return nil, unavailable("Source storage unavailable") end
    local source, open_err = storage:open(source_path, "r")
    if open_err then return nil, open_err end
    local staging, staging_err = uploads_resources.get_storage()
    if staging_err or not staging then source:close(); return nil, staging_err or unavailable("Staging storage unavailable") end
    local _, copy_err = copier.copy(source, cloud, key, mime_type, staging)
    if copy_err then return nil, copy_err end
    return "s3://" .. resource_id .. "/" .. key, nil
end

function M.process(args: any): (any?, any?)
    local configured, policy_err = settings_policy()
    if policy_err then return nil, policy_err end
    if type(configured) ~= "table" or configured.mode == "local" then return { success = true }, nil end
    local checked = policy.validate_syntax({ value = configured })
    if configured.mode ~= "s3" or not checked.valid then
        return nil, invalid("S3 storage policy is invalid")
    end
    local cloud, cloud_err = cloudstorage.get(configured.resource_id)
    if cloud_err then return nil, cloud_err end
    local relocation: any = { blobs = {} }
    relocation.storage_path = args.storage_path
    if not packed(args.storage_path) then
        local path, copy_err = copy(args.storage_id, args.storage_path, cloud, configured.resource_id,
            object_key(configured.prefix, args.upload_id, "original"), args.mime_type)
        if copy_err then cloud:release(); return nil, copy_err end
        relocation.storage_path = path
    end
    local rows, list_err = artifacts.list_artifacts(args.upload_id)
    if list_err then cloud:release(); return nil, list_err end
    local copied = {}
    for _, artifact in ipairs(rows or {}) do
        if artifact.blob_id and artifact.storage_id and artifact.storage_path and not copied[artifact.blob_id]
            and not packed(artifact.storage_path) then
            local path, copy_err = copy(artifact.storage_id, artifact.storage_path, cloud, configured.resource_id,
                object_key(configured.prefix, args.upload_id, "blobs/" .. tostring(artifact.blob_id)), artifact.mime_type)
            if copy_err then cloud:release(); return nil, copy_err end
            copied[artifact.blob_id] = true
            relocation.blobs[#relocation.blobs + 1] = { blob_id = artifact.blob_id, storage_path = path }
        end
    end
    cloud:release()
    return { success = true, relocation = relocation }, nil
end

return M
