-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local time = require("time")
local jobs = require("jobs")
local json = require("json")
local M = {}

function M.await_job(id: string, status: string): any
    for _ = 1, 1000 do
        local job, err = jobs.get_job(id)
        assert(err == nil, tostring(err))
        assert(job, "deletion request has no job")
        if job.status == status then return job end
        time.sleep("10ms")
    end
    error("deletion job does not reach " .. status)
end

function M.await(id: string)
    for _ = 1, 1000 do
        local db = assert(sql.get("app:db"))
        local rows, err = db:query([[SELECT j.id FROM kickside_job j
            LEFT JOIN kickside_components c ON CAST(c.component_id AS TEXT)=j.owner_id
            WHERE j.owner_kind='component' AND j.owner_id=$1
              AND j.job_type='kickside.component:delete_worker' AND j.status='done'
              AND c.component_id IS NULL]], {id})
        assert(db:release())
        assert(rows, tostring(err))
        if #rows > 0 then return end
        time.sleep("10ms")
    end
    local db = assert(sql.get("app:db"))
    local rows = assert(db:query("SELECT id,status,last_error FROM kickside_job WHERE owner_kind='component' AND owner_id=$1", {id}))
    assert(db:release())
    error("component deletion does not finish: " .. assert(json.encode(rows)))
end

return M
