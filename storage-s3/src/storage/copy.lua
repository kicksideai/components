-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local hash = require("hash")
local uuid = require("uuid")
local M = {}

local function unavailable(message: string): any
    return errors.new({ message = message, kind = errors.UNAVAILABLE, retryable = false })
end

local function invalid(message: string): any
    return errors.new({ message = message, kind = errors.INVALID, retryable = false })
end

-- Hash through the native streaming API so verification uses bounded memory.
local function fingerprint(file: any, size: number): (string?, any?)
    local digest, create_err = hash.new("sha256")
    if create_err then return nil, create_err end
    local total = 0
    while true do
        local chunk, read_err = file:read(1024 * 1024)
        if read_err and not errors.is(read_err, errors.NOT_FOUND) then return nil, read_err end
        if chunk and #chunk > 0 then
            total = total + #chunk
            if total > size then return nil, invalid("File size changed during verification") end
            local _, update_err = digest:update(chunk)
            if update_err then return nil, update_err end
        end
        if read_err or not chunk or #chunk == 0 then break end
    end
    if total ~= size then return nil, invalid("File size changed during verification") end
    return digest:sum()
end

function M.copy(source: any, cloud: any, key: string, mime_type: string?, staging: any): (boolean?, any?)
    local stat, stat_err = source:stat()
    if stat_err then source:close(); return nil, stat_err end
    if not stat then source:close(); return nil, unavailable("Could not inspect source") end
    local digest, digest_err = fingerprint(source, stat.size)
    if digest_err then source:close(); return nil, digest_err end
    local _, seek_err = source:seek("set", 0)
    if seek_err then source:close(); return nil, seek_err end
    local _, upload_err = cloud:upload_object(key, source, { content_type = mime_type or "application/octet-stream" })
    local _, close_err = source:close()
    if upload_err or close_err then return nil, upload_err or close_err end
    local head, head_err = cloud:head_object(key)
    if head_err then return nil, head_err end
    if not head then return nil, unavailable("Stored object was not created") end
    if head.size ~= stat.size then return nil, invalid("Stored object size does not match source") end
    if type(head.etag) ~= "string" or head.etag == "" then return nil, invalid("Stored object has no ETag") end

    -- Multipart ETags are not checksums. Read back that exact object version
    -- before returning a relocation that lets Uploads reclaim the local bytes.
    local temp_path = ".upload-verify-" .. uuid.v4()
    local verify, open_err = staging:open(temp_path, "wx")
    if open_err then return nil, open_err end
    local _, download_err = cloud:download_object(key, verify, { if_match = head.etag })
    local _, writer_close_err = verify:close()
    local remote_digest, verify_err, reader_close_err
    if not download_err and not writer_close_err then
        verify, verify_err = staging:open(temp_path, "r")
        if not verify_err then
            remote_digest, verify_err = fingerprint(verify, stat.size)
            local _, close_err = verify:close()
            reader_close_err = close_err
        end
    end
    local _, remove_err = staging:remove(temp_path)
    if download_err or writer_close_err or verify_err or reader_close_err or remove_err then
        return nil, download_err or writer_close_err or verify_err or reader_close_err or remove_err
    end
    if remote_digest ~= digest then return nil, invalid("Stored object integrity verification failed") end
    return true, nil
end

return M
