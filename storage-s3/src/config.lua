local registry = require("registry")
local uploads = require("uploads_resources")
local M = {}
local function config(): any return assert(registry.get("kickside.storage_s3:config")).meta end
function M.get_db_id(): string
    local id = config().db_id
    if id ~= uploads.get_db_id() then error("S3 extension and Uploads must use the same content database") end
    return id
end
function M.get_storage_id(): string return config().staging_id end
function M.get_s3_id(): string return config().s3_id end
function M.storage_entry(id: string): (any?, any?) return uploads.storage_entry(id) end
return M
