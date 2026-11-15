-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local time = require("time")
local clock = require("clock")
local consts = require("consts")
local store=require("store")
local retention_rows=require("retention_rows")
local types=require("types")
local function define()
    test.describe("command deadlines", function()
        test.it("stores millisecond retention checkpoints without narrowing them",function()
            local db=assert(store.open())
            local before=assert(retention_rows.position(db))
            local deadline=clock.millis()+86400000
            local err=retention_rows.advance(db,{catalog_id="",inclusive=0,product_after="",deadline_ms=deadline})
            local saved=not err and assert(retention_rows.position(db)) or nil
            local changed=-1
            local quiet_err:error?=nil
            if saved then
                local measured={execute=function(_self:unknown,statement:string,params:types.SqlParams)
                    local result,qerr=db:execute(statement,params)
                    if result then changed=tonumber(result.rows_affected) :: integer end
                    return result,qerr
                end} :: types.Executor
                quiet_err=retention_rows.advance(measured,saved)
            end
            local restore_err=retention_rows.advance(db,before)
            assert(db:release())
            test.is_nil(err,tostring(err))
            test.is_nil(restore_err,tostring(restore_err))
            test.eq(saved.deadline_ms,deadline)
            test.is_nil(quiet_err,tostring(quiet_err))
            test.eq(changed,0,"unchanged checkpoints do not rewrite their row")
        end)
        test.it("advertises only the command deadline this module enforces", function()
            test.eq(consts.LIMITS.command_deadline_ms, 5000)
            test.is_nil(consts.LIMITS.read_deadline_ms)
        end)
        test.it("passes the same instant to Core that the command compares locally", function()
            local deadline = clock.deadline(5000)
            local instant, err = time.parse(time.RFC3339, deadline.at)
            test.is_nil(err, tostring(err))
            test.eq(instant:unix_nano(), deadline.ns)
        end)
    end)
end
return { run = test.run_cases(define) }
