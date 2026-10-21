-- One-time ownership transfer for installations that used the prematurely
-- embedded Uploads release. Normal runtime code only uses this module's tables.
local M = {}
local OLD_NS = "kickside.uploads.storage.runtime:"
local NEW_NS = "kickside.storage_s3.runtime:"

function M.run(db: any, engine: string): (any?, any?)
    local query = engine == "sqlite" and [[SELECT COUNT(*) AS count FROM sqlite_master
        WHERE type='table' AND name IN ('kickside_upload_storage_locations','kickside_upload_storage_destinations')]]
        or [[SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema=current_schema()
        AND table_name IN ('kickside_upload_storage_locations','kickside_upload_storage_destinations')]]
    local rows, err = db:query(query, {})
    if err then return nil, err end
    local count = tonumber(rows[1].count)
    if count == 0 then return {imported=0}, nil end
    if count ~= 2 then
        return nil, errors.new({message="Legacy placement schema is incomplete",kind=errors.CONFLICT,retryable=false})
    end
    local _, destinations_err = db:execute([[INSERT INTO kickside_storage_s3_destinations
        (resource_id,config_id,bucket,endpoint)
        SELECT replace(resource_id,$1,$2),config_id,bucket,endpoint
        FROM kickside_upload_storage_destinations WHERE resource_id LIKE $3
        ON CONFLICT (resource_id) DO NOTHING]], {OLD_NS,NEW_NS,OLD_NS.."%"})
    if destinations_err then return nil, destinations_err end
    local copied, copy_err = db:execute([[INSERT INTO kickside_storage_s3_locations
        (storage_id,storage_path,resource_id,object_key,state,size,verification_digest,etag,updated_at)
        SELECT storage_id,storage_path,replace(resource_id,$1,$2),object_key,state,size,verification_digest,etag,updated_at
        FROM kickside_upload_storage_locations WHERE resource_id LIKE $3
        ON CONFLICT (storage_id,storage_path) DO NOTHING]], {OLD_NS,NEW_NS,OLD_NS.."%"})
    if copy_err then return nil, copy_err end
    return {imported=tonumber(copied.rows_affected) or 0}, nil
end

return M
