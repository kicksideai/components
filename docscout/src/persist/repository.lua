-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Extractor-owned rows: runs, evaluation cases, evaluations and their per-case
-- results. Writes for a live extractor take the component fence in the same
-- transaction, so nothing is written once its deletion has begun.
local sql = require("sql")
local registry = require("registry")
local json = require("json")
local uuid = require("uuid")
local time = require("time")
local component = require("component")

local M = {}

local function now(): string return time.now():utc():format(time.RFC3339) end

local function failed(message: string, cause: any): error
    if type(cause) == "userdata" then return errors.wrap(cause, message) end
    return errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = message .. ": " .. tostring(cause) })
end

local function db_id(): (string?, error?)
    local entry, err = registry.get("kickside.docscout:db_config")
    if err then return nil, failed("docscout database configuration is unavailable", err) end
    return (entry :: any).meta.db_id, nil
end

-- Runs fn(db) on a pooled connection and releases it.
local function with_db(fn: (any) -> (any?, error?)): (any?, error?)
    local id, id_err = db_id()
    if id_err then return nil, id_err end
    local db, err = sql.get(id :: string)
    if err or not db then return nil, failed("docscout database is unavailable", err) end
    local result, fn_err = fn(db)
    db:release()
    return result, fn_err
end

-- Runs fn(tx) in a transaction fenced on the extractor; commits when fn succeeds.
local function fenced(component_id: string, fn: (any) -> (any?, error?)): (any?, error?)
    local id, id_err = db_id()
    if id_err then return nil, id_err end
    return with_db(function(db: any): (any?, error?)
        local tx, begin_err = db:begin()
        if begin_err then return nil, failed("transaction could not begin", begin_err) end
        local fence_err = component.fence(tx, component_id, id :: string)
        if fence_err then tx:rollback(); return nil, fence_err end
        local result, fn_err = fn(tx)
        if fn_err then tx:rollback(); return nil, fn_err end
        local _, commit_err = tx:commit()
        if commit_err then return nil, failed("transaction could not commit", commit_err) end
        return result, nil
    end)
end

local function decoded(text: any, what: string): (any?, error?)
    if text == nil then return nil, nil end
    local value, err = json.decode(text)
    if err then return nil, failed(what .. " is unreadable", err) end
    return value, nil
end

local function encoded(value: any, what: string): (string?, error?)
    local text, err = json.encode(value)
    if err then return nil, failed(what .. " could not be encoded", err) end
    return text, nil
end

-- Runs and evaluation cases shown with an extractor.
function M.snapshot(component_id: string, user_id: string): (any?, error?)
    return with_db(function(db: any): (any?, error?)
        local runs, run_err = db:query([[SELECT id, caller, status, upload_id, duration_ms, tokens, created_at, expires_at
            FROM kickside_docscout_runs WHERE component_id=$1 AND user_id=$2 ORDER BY created_at DESC LIMIT 100]], { component_id, user_id })
        if run_err then return nil, failed("runs could not be read", run_err) end
        local cases, case_err = db:query([[SELECT id, upload_id, upload_name, expected_values
            FROM kickside_docscout_cases WHERE component_id=$1 ORDER BY created_at, id]], { component_id })
        if case_err then return nil, failed("evaluation cases could not be read", case_err) end
        for _, case in ipairs(cases) do
            local expected, err = decoded(case.expected_values, "expected values")
            if err then return nil, err end
            case.expected, case.expected_values = expected, nil
        end
        return { runs = runs, cases = cases }, nil
    end)
end

-- Removes everything the extractor owns; called by component teardown.
function M.delete(component_id: string): (any?, error?)
    return with_db(function(db: any): (any?, error?)
        local tx, begin_err = db:begin()
        if begin_err then return nil, failed("transaction could not begin", begin_err) end
        for _, statement in ipairs({
            "DELETE FROM kickside_docscout_eval_results WHERE eval_id IN (SELECT id FROM kickside_docscout_evals WHERE component_id=$1)",
            "DELETE FROM kickside_docscout_evals WHERE component_id=$1",
            "DELETE FROM kickside_docscout_runs WHERE component_id=$1",
            "DELETE FROM kickside_docscout_cases WHERE component_id=$1",
        }) do
            local _, err = tx:execute(statement, { component_id })
            if err then tx:rollback(); return nil, failed("extractor data could not be removed", err) end
        end
        local _, commit_err = tx:commit()
        if commit_err then return nil, failed("extractor data removal could not commit", commit_err) end
        return { success = true }, nil
    end)
end

function M.add_case(component_id: string, dto: any): (any?, error?)
    local expected, encode_err = encoded(dto.expected, "expected values")
    if encode_err then return nil, encode_err end
    return fenced(component_id, function(tx: any): (any?, error?)
        local id = uuid.v7()
        local _, err = tx:execute([[INSERT INTO kickside_docscout_cases (id, component_id, upload_id, upload_name, expected_values, created_at)
            VALUES ($1,$2,$3,$4,$5,$6)]], { id, component_id, dto.upload_id, dto.upload_name, expected, now() })
        if err then return nil, failed("evaluation case could not be stored", err) end
        return { success = true, id = id }, nil
    end)
end

function M.get_case(component_id: string, case_id: string): (any?, error?)
    return with_db(function(db: any): (any?, error?)
        local rows, err = db:query("SELECT id, upload_id, upload_name, expected_values FROM kickside_docscout_cases WHERE component_id=$1 AND id=$2",
            { component_id, case_id })
        if err then return nil, failed("evaluation case could not be read", err) end
        local row = rows[1]
        if not row then return nil, errors.new({ kind = errors.NOT_FOUND, message = "The evaluation case was removed" }) end
        local expected, decode_err = decoded(row.expected_values, "expected values")
        if decode_err then return nil, decode_err end
        row.expected, row.expected_values = expected, nil
        return row, nil
    end)
end

function M.delete_case(component_id: string, case_id: string): (any?, error?)
    return with_db(function(db: any): (any?, error?)
        local _, err = db:execute("DELETE FROM kickside_docscout_cases WHERE component_id=$1 AND id=$2", { component_id, case_id })
        if err then return nil, failed("evaluation case could not be removed", err) end
        return { success = true }, nil
    end)
end

function M.add_run(component_id: string, row: any): (string?, error?)
    local result, result_err = encoded(row.result, "run result")
    if result_err then return nil, result_err end
    local trace, trace_err = encoded(row.trace, "run trace")
    if trace_err then return nil, trace_err end
    return fenced(component_id, function(tx: any): (any?, error?)
        local id = uuid.v7()
        local _, err = tx:execute([[INSERT INTO kickside_docscout_runs
            (id, component_id, user_id, upload_id, caller, status, config_revision, result, trace, duration_ms, tokens, created_at, expires_at)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)]],
            { id, component_id, row.user_id, row.upload_id, row.caller, row.status, row.config_revision, result, trace,
              row.duration_ms, row.tokens, now(), row.expires_at })
        if err then return nil, failed("run could not be stored", err) end
        return id, nil
    end)
end

function M.expire_runs(limit: integer): (integer?, error?)
    return with_db(function(db: any): (any?, error?)
        local rows, err = db:query("SELECT id FROM kickside_docscout_runs WHERE expires_at <= $1 ORDER BY expires_at LIMIT $2", { now(), limit })
        if err then return nil, failed("expired runs could not be listed", err) end
        for _, row in ipairs(rows) do
            local _, delete_err = db:execute("DELETE FROM kickside_docscout_runs WHERE id=$1", { row.id })
            if delete_err then return nil, failed("expired run could not be removed", delete_err) end
        end
        return #rows, nil
    end)
end

-- Evaluations ---------------------------------------------------------------

local function conflict(): error
    return errors.new({ kind = errors.CONFLICT, message = "An evaluation of this extractor is already running" })
end

local ACTIVE = "SELECT id FROM kickside_docscout_evals WHERE component_id=$1 AND status IN ('queued','running')"

-- Records a queued evaluation with one pending result per case. A unique index
-- admits one active evaluation per extractor, so concurrent starts cannot both win.
function M.add_eval(component_id: string, row: any, cases: { any }): (string?, error?)
    return fenced(component_id, function(tx: any): (any?, error?)
        local running, running_err = tx:query(ACTIVE, { component_id })
        if running_err then return nil, failed("evaluations could not be read", running_err) end
        if #running > 0 then return nil, conflict() end
        local id = uuid.v7()
        local _, err = tx:execute([[INSERT INTO kickside_docscout_evals
            (id, component_id, config_revision, fields, status, actor_id, actor_context, case_count, created_at)
            VALUES ($1,$2,$3,$4,'queued',$5,$6,$7,$8)]], { id, component_id, row.config_revision, row.fields, row.actor_id, row.actor_context, #cases, now() })
        if err then return nil, failed("evaluation could not be stored", err) end
        for _, case in ipairs(cases) do
            local _, result_err = tx:execute([[INSERT INTO kickside_docscout_eval_results (eval_id, case_id, upload_name, status)
                VALUES ($1,$2,$3,'queued')]], { id, case.id, case.upload_name })
            if result_err then return nil, failed("evaluation case could not be queued", result_err) end
        end
        return id, nil
    end)
end

-- The active evaluation of an extractor with its queued cases, or nil.
function M.active_eval(component_id: string): (any?, error?)
    return with_db(function(db: any): (any?, error?)
        local rows, err = db:query(ACTIVE, { component_id })
        if err then return nil, failed("evaluations could not be read", err) end
        if not rows[1] then return nil, nil end
        local queued, queued_err = db:query("SELECT case_id FROM kickside_docscout_eval_results WHERE eval_id=$1 AND status='queued'", { rows[1].id })
        if queued_err then return nil, failed("evaluation cases could not be read", queued_err) end
        local ids = {}
        for _, r in ipairs(queued) do ids[#ids + 1] = r.case_id end
        return { id = rows[1].id, queued = ids }, nil
    end)
end

local function decode_eval(row: any): (any?, error?)
    local metrics, err = decoded(row.metrics, "evaluation metrics")
    if err then return nil, err end
    local fields, fields_err = decoded(row.fields, "evaluated fields")
    if fields_err then return nil, fields_err end
    row.metrics, row.fields = metrics or {}, fields
    row.config_revision = math.tointeger(tonumber(row.config_revision)) or 0
    row.case_count = math.tointeger(tonumber(row.case_count)) or 0
    row.actor_id, row.actor_context = nil, nil
    return row, nil
end

local EVAL_COLUMNS = "id, component_id, config_revision, fields, status, case_count, metrics, tokens, duration_ms, error, created_at, finished_at"

-- Recent evaluations of an extractor, newest first.
function M.list_evals(component_id: string, limit: integer): (any?, error?)
    return with_db(function(db: any): (any?, error?)
        local rows, err = db:query("SELECT " .. EVAL_COLUMNS .. " FROM kickside_docscout_evals WHERE component_id=$1 ORDER BY created_at DESC, id DESC LIMIT $2",
            { component_id, limit })
        if err then return nil, failed("evaluations could not be read", err) end
        local out = {}
        for _, row in ipairs(rows) do
            local item, decode_err = decode_eval(row)
            if decode_err then return nil, decode_err end
            out[#out + 1] = item
        end
        return out, nil
    end)
end

-- One evaluation with its per-case results; identity columns only when asked for.
function M.get_eval(eval_id: string, with_identity: boolean?): (any?, error?)
    return with_db(function(db: any): (any?, error?)
        local rows, err = db:query("SELECT " .. EVAL_COLUMNS .. ", actor_id, actor_context FROM kickside_docscout_evals WHERE id=$1", { eval_id })
        if err then return nil, failed("evaluation could not be read", err) end
        local row = rows[1]
        if not row then return nil, errors.new({ kind = errors.NOT_FOUND, message = "no evaluation " .. eval_id }) end
        local identity = { actor_id = row.actor_id, actor_context = row.actor_context }
        local item, decode_err = decode_eval(row)
        if decode_err then return nil, decode_err end
        if with_identity then item.identity = identity end
        local results, results_err = db:query([[SELECT case_id, upload_name, status, run_id, scores, tokens, duration_ms, error, finished_at
            FROM kickside_docscout_eval_results WHERE eval_id=$1 ORDER BY upload_name, case_id]], { eval_id })
        if results_err then return nil, failed("evaluation results could not be read", results_err) end
        for _, r in ipairs(results) do
            local scores, scores_err = decoded(r.scores, "case scores")
            if scores_err then return nil, scores_err end
            r.scores = scores or {}
        end
        item.results = results
        return item, nil
    end)
end

function M.mark_eval(eval_id: string, status: string, error_message: string?): (any?, error?)
    return with_db(function(db: any): (any?, error?)
        local finished = (status == "completed" or status == "failed") and now() or sql.as.null()
        local _, err = db:execute("UPDATE kickside_docscout_evals SET status=$1, error=$2, finished_at=$3 WHERE id=$4 AND status IN ('queued','running')",
            { status, error_message or sql.as.null(), finished, eval_id })
        if err then return nil, failed("evaluation status could not be stored", err) end
        return true, nil
    end)
end

-- Stores one case's outcome once, while its evaluation is active. The
-- evaluation row is written first, so concurrent final cases queue on it and
-- exactly one of them sees every case settled and writes the totals.
function M.finish_case(component_id: string, eval_id: string, case_id: string, outcome: any,
        summarize: ({ any }) -> any): (any?, error?)
    local scores, scores_err = encoded(outcome.scores or {}, "case scores")
    if scores_err then return nil, scores_err end
    return fenced(component_id, function(tx: any): (any?, error?)
        local held, hold_err = tx:execute("UPDATE kickside_docscout_evals SET status='running' WHERE id=$1 AND status IN ('queued','running')", { eval_id })
        if hold_err then return nil, failed("evaluation could not be locked", hold_err) end
        if held.rows_affected == 0 then return nil, nil end
        local _, err = tx:execute([[UPDATE kickside_docscout_eval_results
            SET status=$1, run_id=$2, scores=$3, tokens=$4, duration_ms=$5, error=$6, finished_at=$7
            WHERE eval_id=$8 AND case_id=$9 AND status='queued']],
            { outcome.status, outcome.run_id or sql.as.null(), scores, outcome.tokens or 0, outcome.duration_ms or 0,
              outcome.error or sql.as.null(), now(), eval_id, case_id })
        if err then return nil, failed("case result could not be stored", err) end
        local rows, rows_err = tx:query("SELECT status, scores, tokens, duration_ms FROM kickside_docscout_eval_results WHERE eval_id=$1", { eval_id })
        if rows_err then return nil, failed("evaluation results could not be read", rows_err) end
        for _, r in ipairs(rows) do if r.status == "queued" then return nil, nil end end
        local finished = {}
        for _, r in ipairs(rows) do
            local decoded_scores, decode_err = decoded(r.scores, "case scores")
            if decode_err then return nil, decode_err end
            finished[#finished + 1] = { status = r.status, scores = decoded_scores or {},
                tokens = tonumber(r.tokens) or 0, duration_ms = tonumber(r.duration_ms) or 0 }
        end
        local totals = summarize(finished)
        local metrics, metrics_err = encoded(totals.metrics, "evaluation metrics")
        if metrics_err then return nil, metrics_err end
        local _, done_err = tx:execute([[UPDATE kickside_docscout_evals SET status=$1, metrics=$2, tokens=$3, duration_ms=$4, error=$5, finished_at=$6
            WHERE id=$7]], { totals.status, metrics, totals.tokens, totals.duration_ms, totals.error or sql.as.null(), now(), eval_id })
        if done_err then return nil, failed("evaluation totals could not be stored", done_err) end
        return totals, nil
    end)
end

return M
