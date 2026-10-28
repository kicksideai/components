-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Runs an extractor on an upload from the Test tab. A failed run answers with
-- the canonical error envelope; its details carry the run id and step trace so
-- the page can show where it stopped.
local http = require("http")
local engine = require("engine")
local http_errors = require("http_errors")

local function run()
    local res = http.response()
    res:set_content_type(http.CONTENT.JSON)
    local dto, err = http.request():body_json()
    if err or type(dto) ~= "table" then
        local invalid = errors.new({ kind = errors.INVALID, message = "Request must be a JSON object" })
        res:set_status(http_errors.for_error(invalid))
        return res:write_json(http_errors.response(invalid))
    end
    local result, run_err = engine.run({ id = http.request():param("id"), upload_id = dto.upload_id, caller = "ui" })
    if run_err then
        res:set_status(http_errors.for_error(run_err))
        return res:write_json(http_errors.response(run_err))
    end
    res:set_status(200)
    res:write_json(result)
end

return { run = run }
