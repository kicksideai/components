-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The fold driver: events are parsed against their declared body schemas,
-- events at or below the applied position are skipped, the rest apply in order,
-- and the batch stops after the event that reaches the row budget.
local test = require("test")
local driver = require("driver")
local types = require("types")

local TYPE = "app:probe.changed"

local function events(n: integer): { types.RawEvent }
    local out: { types.RawEvent } = {}
    for i = 1, n do out[i] = { seq = i, type = TYPE, body = { id = "e" .. i, rows = 2, tags = {} } } end
    return out
end

local function define()
    test.describe("fold driver", function()
        test.it("preserves initiating trace fields through the fold",function()
            local seen: unknown
            local raw={seq=1,type=TYPE,body={id="trace"},trace_id="trace-1",run_id="run-1",correlation_key="corr-1",caused_by_event_id="cause-1"}
            local _,err=driver.run({raw},{applied=0,budget=10,accepts={[TYPE]=true},rows=function() return 0 end,apply=function(step: driver.Step): error? seen=(step :: {[string]:unknown}).trace_context; return nil end})
            test.is_nil(err)
            test.not_nil(seen)
            test.eq((seen :: {[string]:unknown}).trace_id,"trace-1")
            test.eq((seen :: {[string]:unknown}).caused_by_event_id,"cause-1")
        end)
        test.it("applies events after the applied position in order", function()
            local seen: { string } = {}
            local rows = 0
            local stop, err = driver.run(events(5), { applied = 2, budget = 100, accepts = { [TYPE] = true },
                rows = function(): integer return rows end,
                apply = function(e: driver.Step): error?
                    seen[#seen + 1] = tostring(e.seq) .. ":" .. tostring((e.body :: { [string]: unknown }).id)
                    rows = rows + 1
                    return nil
                end })
            test.is_nil(err)
            test.is_nil(stop)
            test.eq(table.concat(seen, ","), "3:e3,4:e4,5:e5")
        end)

        test.it("stops after the event that reaches the row budget", function()
            local rows = 0
            local last = 0
            local stop, err = driver.run(events(10), { applied = 0, budget = 5, accepts = { [TYPE] = true },
                rows = function(): integer return rows end,
                apply = function(e: driver.Step): error?
                    rows = rows + 2
                    last = e.seq
                    return nil
                end })
            test.is_nil(err)
            test.eq(stop, 3)
            test.eq(last, 3)
        end)

        test.it("skips event types it does not fold and refuses bodies that break their schema", function()
            local applied = 0
            local mixed: { types.RawEvent } = { { seq = 1, type = "app:unknown.kind", body = {} }, { seq = 2, type = TYPE, body = '{"id":"x"}' } }
            local _, err = driver.run(mixed, { applied = 0, budget = 10, accepts = { [TYPE] = true },
                rows = function(): integer return 0 end,
                apply = function(_e: driver.Step): error? applied = applied + 1; return nil end })
            test.is_nil(err)
            test.eq(applied, 1)
            for _, body in ipairs({ { rows = 1 }, { id = "x", extra = true }, { id = "x", tags = "a" }, "{broken" } :: { unknown }) do
                local _, berr, failed = driver.run({ { seq = 1, type = TYPE, body = body } }, { applied = 0, budget = 10, accepts = { [TYPE] = true },
                    rows = function(): integer return 0 end, apply = function(_e: driver.Step): error? return nil end })
                test.not_nil(berr)
                test.eq(failed, 1)
                test.is_true(tostring(berr):find("event 1", 1, true) ~= nil, tostring(berr))
            end
        end)

        test.it("reads text sequence numbers and refuses an event without one", function()
            local seqs: { integer } = {}
            local _, err = driver.run({ { seq = "4", type = TYPE, body = { id = "x" } } }, { applied = 0, budget = 10, accepts = { [TYPE] = true },
                rows = function(): integer return 0 end, apply = function(e: driver.Step): error? seqs[#seqs + 1] = e.seq; return nil end })
            test.is_nil(err)
            test.eq(seqs[1], 4)
            local _, missing = driver.run({ { seq = "x", type = TYPE, body = { id = "x" } } }, { applied = 0, budget = 10, accepts = { [TYPE] = true },
                rows = function(): integer return 0 end, apply = function(_e: driver.Step): error? return nil end })
            test.eq((missing :: error):kind(), errors.INTERNAL)
        end)

        test.it("refuses a folded type the registry does not declare", function()
            local _, err = driver.run({ { seq = 1, type = "app:ghost.event", body = {} } }, { applied = 0, budget = 10, accepts = { ["app:ghost.event"] = true },
                rows = function(): integer return 0 end, apply = function(_e: driver.Step): error? return nil end })
            test.eq((err :: error):kind(), errors.NOT_FOUND)
        end)

        test.it("parses events at or below the applied position without applying them", function()
            local calls = 0
            local _, ok = driver.run(events(3), { applied = 3, budget = 10, accepts = { [TYPE] = true },
                rows = function(): integer return 0 end, apply = function(_e: driver.Step): error? calls = calls + 1; return nil end })
            test.is_nil(ok)
            test.eq(calls, 0)
            local _, bad = driver.run({ { seq = 1, type = TYPE, body = { extra = 1 } } }, { applied = 3, budget = 10, accepts = { [TYPE] = true },
                rows = function(): integer return 0 end, apply = function(_e: driver.Step): error? return nil end })
            test.not_nil(bad)
        end)

        test.it("stops at the first event when the budget is already spent", function()
            local stop = driver.run(events(4), { applied = 0, budget = 0, accepts = { [TYPE] = true },
                rows = function(): integer return 0 end, apply = function(_e: driver.Step): error? return nil end })
            test.eq(stop, 1)
        end)

        test.it("folds nothing from an empty batch", function()
            local stop, err = driver.run({}, { applied = 0, budget = 1, accepts = {}, rows = function(): integer return 0 end,
                apply = function(_e: driver.Step): error? return nil end })
            test.is_nil(stop)
            test.is_nil(err)
        end)

        test.it("stops at the first failing event and names it", function()
            local applied: { integer } = {}
            local _, err, failed = driver.run(events(4), { applied = 0, budget = 10, accepts = { [TYPE] = true },
                rows = function(): integer return 0 end,
                apply = function(e: driver.Step): error?
                    if e.seq == 3 then return errors.new({ kind = errors.INTERNAL, message = "boom" }) end
                    applied[#applied + 1] = e.seq
                    return nil
                end })
            test.not_nil(err)
            test.eq((err :: error):kind(), errors.INTERNAL)
            test.eq(failed, 3)
            test.eq(#applied, 2)
        end)
    end)
end

return { run = test.run_cases(define) }
