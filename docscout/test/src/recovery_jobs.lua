-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The real admission and pool, with only this fixture's job deadline shortened.
local jobs = require("jobs")

return {
    enqueue_tx = function(tx: any, dialect: string, input: any): (any?, error?)
        input.immutable_payload.max_execution_ms = 200
        return jobs.enqueue_tx(tx, dialect, input)
    end,
    nudge_workers = jobs.nudge_workers,
}
