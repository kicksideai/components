-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local crypto = require("crypto")
local funcs = require("funcs")
local sql = require("sql")
local time = require("time")
local repo = require("repo")
local signals = require("signals")

local function count(thread_id)
    local db, err = sql.get("app:db")
    test.is_nil(err)
    local rows, query_err = db:query(
        "SELECT COUNT(*) AS total FROM kickside_research_block_signal WHERE thread_id = $1", { thread_id })
    db:release()
    test.is_nil(query_err)
    return tonumber(rows[1].total)
end

local function remove(thread_id)
    local result, err = funcs.new():with_context({ component_id = thread_id })
        :call("kickside.research:delete_run", {})
    test.is_nil(err, tostring(err))
    test.is_true(result.success)
    return result.deleted
end

local function cases()
    test.describe("Research teardown", function()
        test.it("deletes every owned correlation and preserves another thread", function()
            local id, other = crypto.random.uuid(), crypto.random.uuid()
            test.is_nil(repo.apply(id, { type = "kickside.research.events:request", body = {
                research_id = id, actor_id = "owner", prompt = "Research" } }))
            for index = 1, 1203 do
                local key = id .. ":" .. index
                local status = ({ "waiting", "resumed", "failed" })[(index % 3) + 1]
                test.is_nil(signals.insert({ research_id = key, thread_id = id, status = status }))
            end
            for _, status in ipairs({ "waiting", "resumed", "failed" }) do
                test.is_nil(signals.insert({ research_id = other .. status, thread_id = other, status = status }))
            end
            test.eq(count(id), 1203)
            test.eq(remove(id), 1)
            test.eq(count(id), 0)
            local run, read_err = repo.get_by_thread(id)
            test.is_nil(read_err)
            test.is_nil(run)
            test.eq(count(other), 3)
            test.eq(remove(id), 0)
            test.eq(remove(other), 0)
            test.eq(count(other), 0)
        end)

        test.it("rejects an empty owner without deleting correlations", function()
            local id = crypto.random.uuid()
            test.is_nil(signals.insert({ research_id = id, thread_id = id }))
            local _, err = repo.delete_by_thread(" ")
            test.not_nil(err)
            test.eq(count(id), 1)
            test.eq(remove(id), 0)
            test.eq(count(id), 0)
        end)

        test.it("drains a large owner within one teardown call", function()
            local id = crypto.random.uuid()
            local db, err = sql.get("app:db")
            test.is_nil(err)
            local _, seed_err = db:execute([[
                WITH RECURSIVE numbers(n) AS (
                    SELECT 1 UNION ALL SELECT n + 1 FROM numbers WHERE n < 100000
                )
                INSERT INTO kickside_research_block_signal (research_id, thread_id)
                SELECT $1 || ':' || CAST(n AS TEXT), $1 FROM numbers
            ]], { id })
            db:release()
            test.is_nil(seed_err)
            test.eq(count(id), 100000)
            local started = time.now()
            test.eq(remove(id), 0)
            local elapsed = (time.now():sub(started) :: any):seconds()
            test.eq(count(id), 0)
            print(string.format("research teardown: 100000 rows in %.6fs (%.0f rows/s)", elapsed, 100000 / elapsed))
        end)
    end)
end

return { run = test.run_cases(cases) }
