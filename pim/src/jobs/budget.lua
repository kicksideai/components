-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Job batches reserve their command budget inside the enclosing deadline.
local time = require("time")
local clock = require("clock")
local M = {}
function M.deadline(raw: string?): (clock.Deadline?, error?)
    if not raw then return nil, errors.new({ kind = errors.INVALID, message = "job deadline is required", details = { code = "job_deadline_required" } }) end
    local instant, err = time.parse(time.RFC3339, raw, time.utc)
    if err then return nil, errors.new({ kind = errors.INVALID, message = "job deadline must be RFC3339", cause = err, details = { code = "job_deadline_invalid" } }) end
    return { at = raw, ns = instant:unix_nano() }, nil
end
function M.enough(deadline: clock.Deadline, milliseconds: integer): boolean
    return time.now():unix_nano() + milliseconds * time.MILLISECOND < deadline.ns
end
type Lease = { token: string, execution_seq: integer }
function M.lease(job: { lease_token: string, execution_seq: integer }): Lease
    return { token = job.lease_token, execution_seq = job.execution_seq }
end
return M
