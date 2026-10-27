-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {}

local function unavailable(message: string): any
    return errors.new({ message = message, kind = errors.UNAVAILABLE, retryable = false })
end

local function invalid(message: string): any
    return errors.new({ message = message, kind = errors.INVALID, retryable = false })
end

function M.copy(source: any, cloud: any, key: string, mime_type: string?): (boolean?, any?)
    local stat, stat_err = source:stat()
    if stat_err then source:close(); return nil, stat_err end
    if not stat then source:close(); return nil, unavailable("Could not inspect source") end
    local _, upload_err = cloud:upload_object(key, source, { content_type = mime_type or "application/octet-stream" })
    local _, close_err = source:close()
    if upload_err or close_err then return nil, upload_err or close_err end
    local head, head_err = cloud:head_object(key)
    if head_err then return nil, head_err end
    if not head then return nil, unavailable("Stored object was not created") end
    if head.size ~= stat.size then return nil, invalid("Stored object size does not match source") end
    return true, nil
end

return M
