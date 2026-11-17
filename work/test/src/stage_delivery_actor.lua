-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local component = require("component")
local identifiers = require("identifiers")
local probe = require("probe")
local M = {}
function M.run(a)
    if a.op == "retire_stage" then
        local db=assert(require("sql").get("app:db"))
        assert(db:execute("DELETE FROM kickside_work_stage_run WHERE board_id=$1 AND item_id=$2",{a.board_id,a.item}))
        db:release()
        return true
    end
    if a.op == "probe" then return probe.set(a.board_id, a.mode) end
    if a.op == "observed" then return probe.read(a.board_id) end
    if a.op == "complete" then
        local target, err = component.open(a.board_id, component.ACCESS.WRITE, "kickside.workflows:run_completion")
        if err or not target then return nil, err end
        return target:complete(a.envelope)
    end
    if a.op == "launch" then
        return funcs.call("kickside.work.sink:stage_launch", a.request)
    end
    if a.op == "teardown" then
        local client=assert(assert(require("contract").get("kickside.work:board")):open())
        return client:delete({board_id=a.board_id})
    end
    return nil, errors.new({kind=errors.INVALID,message="unknown delivery fixture operation"})
end
function M.crash(_input) return nil,errors.new({kind=errors.INTERNAL,message="delivery fixture crashed before report"}) end
return M
