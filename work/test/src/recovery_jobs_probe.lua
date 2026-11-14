-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Stop only after native Jobs has committed its first four-batch rearm.
local jobs = require("jobs")
local store = require("store")
local json = require("json")
local time = require("time")
local config = require("config")
local M = {}
function M.lease_valid(id, lease)
    local db=assert(store.open())
    local row=assert(db:query("SELECT * FROM work_upgrade_fixture"))[1]
    if not config.hold and row.resume_after==nil then
        local progress=assert(db:query("SELECT key FROM kickside_work_job WHERE board_id=$1 AND job_type='recovery'",{row.board_id}))[1]
        assert(db:execute("UPDATE work_upgrade_fixture SET resume_after=$1",{json.decode(progress.key).after}))
    end
    db:release()
    if config.hold and row.rearmed_after then
        while true do time.sleep("100ms") end
    end
    return jobs.lease_valid(id,lease)
end
function M.complete(id,lease,result)
    local out,err=jobs.complete(id,lease,result)
    if err then return nil,err end
    if config.hold then
        local db=assert(store.open())
        local row=assert(db:query("SELECT key FROM kickside_work_job WHERE job_id=$1",{id}))[1]
        assert(db:execute("UPDATE work_upgrade_fixture SET rearmed_after=$1",{json.decode(row.key).after}))
        db:release()
    end
    return out,nil
end
return M
