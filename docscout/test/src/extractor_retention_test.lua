-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local data = require("data")
local registry = require("registry")
local json = require("json")
local sql = require("sql")
local time = require("time")
local uuid = require("uuid")
local funcs = require("funcs")
local repository = require("repository")
local store = require("store")

local function configuration(window: string?): any
    local schema = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json))
    local config = schema.default
    local field = schema.properties.fields.items.default
    field.name, field.type = "total", "number"
    config.fields, config.retention = { field }, window
    config.retrieval.embedding_model, config.retrieval.context, config.retrieval.search_mode = "class:docscout-success", "none", "keyword"
    config.stages.map.enabled, config.stages.scout.enabled, config.stages.deep.enabled = false, false, false
    config.stages.verify.check_support = false
    config.stages.extract.model = "class:docscout-success"
    return config
end

local function rows(component_id: string): {any}
    local db = assert(sql.get("app:db"))
    local result, err = db:query([[SELECT 'document' AS kind, created_at, expires_at FROM kickside_docscout_documents WHERE component_id=$1
        UNION ALL SELECT 'run' AS kind, created_at, expires_at FROM kickside_docscout_runs WHERE component_id=$1]], { component_id })
    db:release()
    return assert(result, tostring(err))
end

local function instant(value: string): integer
    return assert(time.parse(time.RFC3339, value)):unix_nano()
end

local function sweep(): any
    local result = assert(funcs.call("kickside.docscout.retention:owner", {}))
    test.is_true(result.success, tostring(result.error))
    return result
end

local function recovery_deadline(): number
    local db = assert(sql.get("app:db"))
    local pending, err = db:query([[SELECT r.next_check_at FROM kickside_docscout_eval_results r
        JOIN kickside_docscout_evals e ON e.id=r.eval_id WHERE r.status='queued' AND e.status IN ('queued','running')]])
    db:release()
    assert(pending, tostring(err))
    local earliest = math.huge
    for _, row in ipairs(pending) do earliest = math.min(earliest, instant(row.next_check_at)) end
    return earliest
end

-- Other suites retain their own fixtures in the same database. Their future
-- expiries also participate in the owner's global deadline.
local function other_expiry(ids: {string}): number
    local own = {}
    for _, id in ipairs(ids) do own[id] = true end
    local db = assert(sql.get("app:db"))
    local rows, err = db:query([[SELECT component_id, expires_at FROM kickside_docscout_documents
        UNION ALL SELECT component_id, expires_at FROM kickside_docscout_runs]])
    db:release()
    assert(rows, tostring(err))
    local earliest, now = math.huge, time.now():unix_nano()
    for _, row in ipairs(rows) do
        local expiry = instant(row.expires_at)
        if not own[row.component_id] and expiry > now then earliest = math.min(earliest, expiry) end
    end
    return earliest
end

return { run = test.run_cases(function()
    test.describe("Extractor retention", function()
        test.it("expires documents and runs by their extractor and reports the earliest remaining deadline", function()
            local owner = uuid.v4()
            local caller = data.caller(owner)
            local upload = data.upload(owner, "application/pdf", "fixture", "# Invoice\nThe total amount is 1250.")
            local ids, saved = {}, {}
            for i, window in ipairs({ "3s", "8s", "default" }) do
                local created, err = caller:call("app:probe", { op = "create", input = {
                    title = "Retention reader", config = configuration(window ~= "default" and window or nil) } })
                test.is_nil(err, tostring(err)); test.not_nil(created)
                ids[i] = created.component_id
                local result, run_err = caller:call("kickside.docscout:invoke", { extractor_id = ids[i], upload_id = upload, caller = "agent" })
                test.is_nil(run_err, tostring(run_err)); test.eq(result.status, "completed")
                local snapshot = assert(caller:call("app:probe", { op = "get", id = ids[i] }))
                test.eq(snapshot.retention, window == "default" and "2h" or window)
                saved[i] = rows(ids[i])
                test.eq(#saved[i], 2)
                for _, row in ipairs(saved[i]) do
                    local seconds = (instant(row.expires_at) - instant(row.created_at)) / time.SECOND
                    local expected = window == "default" and 7200 or (i == 1 and 3 or 8)
                    test.is_true(math.abs(seconds - expected) <= 1, row.kind .. " uses another extractor's window")
                end
            end
            local earliest = math.huge
            for _, group in ipairs(saved) do for _, row in ipairs(group) do earliest = math.min(earliest, instant(row.expires_at)) end end
            test.eq(sweep().deadline_ms, math.floor(math.min(earliest, other_expiry(ids), recovery_deadline()) / 1000000))
            for i = 1, 2 do
                local last = 0
                for _, row in ipairs(saved[i]) do last = math.max(last, instant(row.expires_at)) end
                while time.now():unix_nano() <= last do time.sleep("20ms") end
                local result = sweep()
                test.is_true(result.needs_continue, "deletion progress does not re-arm retention")
                test.eq(#rows(ids[i]), 0)
                for j = i + 1, 3 do test.eq(#rows(ids[j]), 2, "later window expires early") end
                local next_expiry = math.huge
                for j = i + 1, 3 do for _, row in ipairs(saved[j]) do next_expiry = math.min(next_expiry, instant(row.expires_at)) end end
                test.eq(result.deadline_ms, math.floor(math.min(next_expiry, other_expiry(ids), recovery_deadline()) / 1000000))
            end
            local before = assert(json.encode(saved[3]))
            local snapshot = assert(caller:call("app:probe", { op = "get", id = ids[3] }))
            snapshot.config.retention = "24h"
            assert(caller:call("app:probe", { op = "update", id = ids[3], input = {
                title = "Retention reader", config = snapshot.config, expected_revision = snapshot.expected_revision } }))
            test.eq(assert(json.encode(rows(ids[3]))), before, "configuration changes rewrite existing global-window rows")
            for _, id in ipairs(ids) do assert(repository.delete(id)) end
        end)
        test.it("drains expired rows in bounded pages and continues until deletion stops", function()
            local owner = uuid.v4()
            local id = data.extractor(owner)
            local expiry = time.now():utc():add(-time.SECOND):format(time.RFC3339)
            for _ = 1, 201 do
                assert(store.save({ component_id = id, owner_id = owner, upload_id = uuid.v4(),
                    checksum = "fixture", processing_key = "fixture", outline = {}, page_count = 0, tokens = 0,
                    expires_at = expiry }, {}))
                assert(repository.add_run(id, { user_id = owner, upload_id = uuid.v4(), caller = "ui", status = "completed",
                    config_revision = 0, result = {}, trace = {}, duration_ms = 0, tokens = 0, expires_at = expiry }))
            end
            local future = time.now():utc():add(time.HOUR):format(time.RFC3339)
            assert(store.save({ component_id = id, owner_id = owner, upload_id = uuid.v4(),
                checksum = "fixture", processing_key = "fixture", outline = {}, page_count = 0, tokens = 0,
                expires_at = future }, {}))
            local first = sweep()
            test.eq(first.deleted, 400); test.is_true(first.needs_continue); test.eq(#rows(id), 3)
            test.eq(first.deadline_ms, math.floor(math.min(instant(future), other_expiry({id}), recovery_deadline()) / 1000000),
                "an expired backlog hides the first future expiry")
            local second = sweep()
            test.eq(second.deleted, 2); test.is_true(second.needs_continue); test.eq(#rows(id), 1)
            test.is_false(sweep().needs_continue)
            assert(repository.delete(id))
        end)
        test.it("rejects invalid or nonpositive extractor windows", function()
            local caller = data.caller(uuid.v4())
            for _, window in ipairs({ "", "later", "0s", "-1h" }) do
                local value, err = caller:call("app:probe", { op = "create", input = {
                    title = "Invalid retention", config = configuration(window) } })
                test.is_nil(value); test.not_nil(err); test.is_true(errors.is(err, errors.INVALID))
            end
        end)
    end)
end) }
