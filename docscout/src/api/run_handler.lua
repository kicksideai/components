-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Runs an extractor on an upload from the Test tab. A failed run still returns
-- its id and step trace so the page can show where it stopped.
local http = require("http")
local engine = require("engine")
local http_errors = require("http_errors")

local function write(status: integer, value: any)
    local res = http.response()
    res:set_content_type(http.CONTENT.JSON)
    res:set_status(status)
    res:write_json(value)
end

local function run()
    local dto, err = http.request():body_json()
    if err or type(dto) ~= "table" then
        return write(400, { success = false, error = "Request must be a JSON object" })
    end
    local result, run_err = engine.run({ id = http.request():param("id"), upload_id = dto.upload_id, caller = "ui" })
    if run_err then
        local details = (run_err :: any):details() or {}
        return write(http_errors.for_error(run_err), { success = false, error = tostring(run_err), run_id = details.run_id, trace = details.trace })
    end
    write(200, result)
end

return { run = run }
