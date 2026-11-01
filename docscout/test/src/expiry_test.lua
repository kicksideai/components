-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local data = require("data")
local store = require("store")
local repository = require("repository")
local runner = require("runner")
local time = require("time")
local sql = require("sql")
local process = require("process")
local channel = require("channel")
local funcs = require("funcs")
local uuid = require("uuid")

local function document(owner: string, component_id: string, expiry: string): string
    return assert(store.save({ component_id = component_id, owner_id = owner, upload_id = uuid.v4(),
        checksum = "fixture", processing_key = "fixture", outline = {}, page_count = 0, tokens = 0,
        expires_at = expiry }, {}))
end

local function run(owner: string, component_id: string, expiry: string): string
    return assert(repository.add_run(component_id, { user_id = owner, upload_id = uuid.v4(), caller = "ui",
        status = "completed", config_revision = 0, result = {}, trace = {}, duration_ms = 0, tokens = 0,
        expires_at = expiry }))
end

local function count(table_name: string, id: string): integer
    local db = assert(sql.get("app:db"))
    local rows, err = db:query("SELECT COUNT(*) AS n FROM " .. table_name .. " WHERE id=$1", { id })
    db:release()
    assert(rows, tostring(err))
    return math.tointeger(tonumber(rows[1].n)) :: integer
end

return { run = test.run_cases(function()
    test.describe("Docscout expiry scheduling", function()
        test.it("contributes its future document expiry to the real Core recovery deadline", function()
            local owner = uuid.v4()
            local component_id = data.extractor(owner)
            local expiry = time.now():utc():add(5 * time.SECOND):format(time.RFC3339)
            document(owner, component_id, expiry)
            local db = assert(sql.get("app:db"))
            local result, err = runner.recover(db, tostring(process.pid()))
            db:release()
            test.is_nil(err, tostring(err)); test.not_nil(result)
            for _, failure in ipairs(result.owner_failures) do
                test.is_true(failure.owner ~= "kickside.docscout.retention:owner", tostring(failure.error))
            end
            local expected = math.floor(assert(time.parse(time.RFC3339, expiry)):unix_nano() / 1000000)
            test.is_true(result.deadline_ms ~= nil and result.deadline_ms <= expected,
                "Core does not schedule Docscout expiry")
            assert(repository.delete(component_id))
        end)
        test.it("reports the global earliest run even for another component's change hint", function()
            local owner = uuid.v4()
            local first, second = data.extractor(owner), data.extractor(owner)
            document(owner, first, time.now():utc():add(60 * time.SECOND):format(time.RFC3339))
            local expiry = time.now():utc():add(5 * time.SECOND):format(time.RFC3339)
            run(owner, second, expiry)
            local result = assert(funcs.call("kickside.docscout.retention:owner", {
                change = { kind = "changed", owner_locator = { kind = "component", id = first } } }))
            test.is_true(result.success, tostring(result.error))
            local expected = math.floor(assert(time.parse(time.RFC3339, expiry)):unix_nano() / 1000000)
            test.is_true(result.deadline_ms ~= nil and result.deadline_ms <= expected,
                "scoped hint must not hide another component's earlier expiry")
            assert(repository.delete(first)); assert(repository.delete(second))
        end)
        for _, kind in ipairs({ "document", "run" }) do
            test.it("physically removes a committed " .. kind .. " after one producer wake", function()
                local owner = uuid.v4()
                local component_id = data.extractor(owner)
                local events = process.events()
                local pid = assert(process.spawn_monitored("kickside.core.retention.service:sweeper_process", "app:processes"))
                local ok, failure = pcall(function()
                    local ready = time.now():unix_nano() + 5 * time.SECOND
                    while time.now():unix_nano() < ready do
                        local registered = process.registry.lookup("kickside.core.retention.service:sweeper_process", process.registry.CONSISTENT)
                        if registered and tostring(registered) == tostring(pid) then break end
                        time.sleep("20ms")
                    end
                    -- The singleton registers before its boot read. Let that read
                    -- finish before committing the new eligibility deadline.
                    time.sleep("200ms")
                    local expiry = time.now():utc():add(3 * time.SECOND):format(time.RFC3339)
                    local id = kind == "document" and document(owner, component_id, expiry) or run(owner, component_id, expiry)
                    local table_name = kind == "document" and "kickside_docscout_documents" or "kickside_docscout_runs"
                    test.eq(count(table_name, id), 1, "new row must remain present before expiry")
                    local limit = time.now():unix_nano() + 6 * time.SECOND
                    while count(table_name, id) > 0 and time.now():unix_nano() < limit do time.sleep("20ms") end
                    test.eq(count(table_name, id), 0, "idle sweeper never removes committed " .. kind)
                end)
                process.cancel(pid)
                local timeout = time.after("5s")
                while true do
                    local selected = channel.select({ events:case_receive(), timeout:case_receive() })
                    if selected.channel ~= events then error("owned retention sweeper did not stop") end
                    if selected.value.kind == process.event.EXIT and tostring(selected.value.from) == tostring(pid) then
                        if ok then test.is_nil(selected.value.result.error) end
                        break
                    end
                end
                assert(repository.delete(component_id))
                if not ok then error(failure) end
            end)
        end
    end)
end) }
