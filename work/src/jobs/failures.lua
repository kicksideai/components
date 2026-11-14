-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Job status records retain the failure the worker returns to Jobs.
local job_rows = require("job_rows")
local error_envelope = require("error_envelope")

local M = {}
function M.record(board_id: string, job_id: string, err: error): error
    local record_err = job_rows.record(board_id, job_id, "failed", tostring(err))
    if record_err then
        return error_envelope.wrap_secondary(record_err, err, "job failure record failed")
    end
    return err
end
return M
