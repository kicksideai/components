-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Extractor-owned rows: runs, evaluation cases, evaluations and their per-case
-- results. Writes for a live extractor take the component fence in the same
-- transaction and require an active component.
local sql = require("sql")
local persisted_json = require("persisted_json")
local canonical_json = require("canonical_json")
local uuid = require("uuid")
local database = require("database")
local store = require("store")
local notify = require("notify")
local committed_error = require("committed_error")
local time = require("time")

local M = {}

local now, failed = database.now, database.failed

local with_db = database.with_db
local function fenced(component_id: string, fn: (any, any) -> (any?, error?)): (any?, error?)
    local value, err = database.transaction(component_id, fn)
    if err then return nil, err end
    local _, notify_err = notify.shared(component_id)
    if notify_err then return nil, committed_error.new(notify_err) end
    return value, nil
end

local decoded = persisted_json.decode_table
local encoded = canonical_json.encode

-- Runs and evaluation cases shown with an extractor.
function M.snapshot(component_id: string, user_id: string): (any?, error?)
    return with_db(function(db: any): (any?, error?)
        local runs, run_err = db:query([[SELECT id, caller, status, upload_id, duration_ms, tokens, created_at, expires_at, config_revision, result
            FROM kickside_docscout_runs WHERE component_id=$1 AND user_id=$2 ORDER BY created_at DESC LIMIT 100]], { component_id, user_id })
        if run_err then return nil, failed("runs could not be read", run_err) end
        for _, run in ipairs(runs) do
            local result, err = decoded(run.result, "run result")
            if err then return nil, err end
            run.result = result
        end
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
    return database.transaction(nil, function(tx: any, db: any): (any?, error?)
        local documents_err = store.remove_component_tx(tx, db, component_id)
        if documents_err then return nil, documents_err end
        for _, statement in ipairs({
            "DELETE FROM kickside_docscout_eval_results WHERE eval_id IN (SELECT id FROM kickside_docscout_evals WHERE component_id=$1)",
            "DELETE FROM kickside_docscout_evals WHERE component_id=$1",
            "DELETE FROM kickside_docscout_runs WHERE component_id=$1",
            "DELETE FROM kickside_docscout_cases WHERE component_id=$1",
        }) do
            local _, err = tx:execute(statement, { component_id })
            if err then return nil, failed("extractor data could not be removed", err) end
        end
        return { success = true }, nil
    end)
end

function M.add_case(component_id: string, dto: any): (any?, error?)
    local expected, encode_err = encoded(dto.expected)
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
    return fenced(component_id, function(db: any): (any?, error?)
        local _, err = db:execute("DELETE FROM kickside_docscout_cases WHERE component_id=$1 AND id=$2", { component_id, case_id })
        if err then return nil, failed("evaluation case could not be removed", err) end
        return { success = true }, nil
    end)
end

function M.add_run(component_id: string, row: any): (string?, error?)
    local result, result_err = encoded(row.result)
    if result_err then return nil, result_err end
    local trace, trace_err = encoded(row.trace)
    if trace_err then return nil, trace_err end
    local run_id, err = database.transaction(component_id, function(tx: any): (any?, error?)
        local id = uuid.v7()
        local _, err = tx:execute([[INSERT INTO kickside_docscout_runs
            (id, component_id, user_id, upload_id, caller, status, config_revision, result, trace, duration_ms, tokens, created_at, expires_at)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)]],
            { id, component_id, row.user_id, row.upload_id, row.caller, row.status, row.config_revision, result, trace,
              row.duration_ms, row.tokens, now(), row.expires_at })
        if err then return nil, failed("run could not be stored", err) end
        return id, nil
    end)
    if err then return nil, err end
    local _, retention_err = notify.retention()
    if retention_err then return nil, committed_error.new(retention_err) end
    local _, notify_err = notify.run(component_id, row.user_id, run_id :: string)
    if notify_err then return nil, committed_error.new(notify_err) end
    return run_id, nil
end

function M.expire_runs(limit: integer): (integer?, error?)
    return with_db(function(db: any): (any?, error?)
        local result, err = db:execute([[DELETE FROM kickside_docscout_runs WHERE id IN
            (SELECT id FROM kickside_docscout_runs WHERE expires_at <= $1 ORDER BY expires_at, id LIMIT $2)]], { now(), limit })
        if err then return nil, err end
        return result.rows_affected, nil
    end)
end

-- Both MIN queries use the existing expiry indexes. Always report the global
-- deadline, including when Core invokes the owner with a scoped change hint.
function M.next_deadline_ms(): (integer?, error?)
    return with_db(function(db: any): (any?, error?)
        local rows, err = db:query([[SELECT MIN(expires_at) AS expires_at FROM (
            SELECT MIN(expires_at) AS expires_at FROM kickside_docscout_documents
            UNION ALL
            SELECT MIN(expires_at) AS expires_at FROM kickside_docscout_runs
        ) AS deadlines]])
        if err then return nil, failed("retention deadline could not be read", err) end
        local expiry = rows[1] and rows[1].expires_at
        if expiry == nil then return nil, nil end
        local instant, parse_err = time.parse(time.RFC3339, expiry)
        if parse_err then return nil, failed("retention deadline is invalid", parse_err) end
        return math.floor(instant:unix_nano() / 1000000) :: integer, nil
    end)
end

-- Evaluations ---------------------------------------------------------------

local function conflict(): error
    return errors.new({ kind = errors.CONFLICT, message = "An evaluation of this extractor is already running" })
end

local ACTIVE = "SELECT id FROM kickside_docscout_evals WHERE component_id=$1 AND status IN ('queued','running')"

-- Records a queued evaluation with one pending result per case. A unique index
-- admits one active evaluation per extractor.
function M.add_eval(component_id: string, row: any, cases: { any }, admit: (any, string, string) -> error?): (string?, error?)
    return fenced(component_id, function(tx: any, db: any): (any?, error?)
        local running, running_err = tx:query(ACTIVE, { component_id })
        if running_err then return nil, failed("evaluations could not be read", running_err) end
        if #running > 0 then return nil, conflict() end
        local id = uuid.v7()
        local _, err = tx:execute([[INSERT INTO kickside_docscout_evals
            (id, component_id, config_revision, fields, config_snapshot, status, actor_id, actor_context, case_count, created_at)
            VALUES ($1,$2,$3,$4,$5,'queued',$6,$7,$8,$9)]], { id, component_id, row.config_revision, row.fields, row.config_snapshot, row.actor_id, row.actor_context, #cases, now() })
        if err then return nil, failed("evaluation could not be stored", err) end
        for _, case in ipairs(cases) do
            local expected, expected_err = encoded(case.expected)
            if expected_err then return nil, expected_err end
            local _, result_err = tx:execute([[INSERT INTO kickside_docscout_eval_results (eval_id, case_id, upload_name, upload_id, expected_values, status)
                VALUES ($1,$2,$3,$4,$5,'queued')]], { id, case.id, case.upload_name, case.upload_id, expected })
            if result_err then return nil, failed("evaluation case could not be queued", result_err) end
        end
        local dbtype, type_err = db:type()
        if type_err then return nil, type_err end
        local admit_err = admit(tx, dbtype, id)
        if admit_err then return nil, admit_err end
        return id, nil
    end)
end

-- The active evaluation of an extractor with its queued cases, or nil.
function M.active_eval(component_id: string): (any?, error?)
    return with_db(function(db: any): (any?, error?)
        local rows, err = db:query(ACTIVE, { component_id })
        if err then return nil, failed("evaluations could not be read", err) end
        if not rows[1] then return nil, nil end
        return { id = rows[1].id }, nil
    end)
end

local function decode_eval(row: any): (any?, error?)
    local metrics, err = decoded(row.metrics, "evaluation metrics", true)
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
        local rows, err = db:query("SELECT " .. EVAL_COLUMNS .. ", actor_id, actor_context, config_snapshot FROM kickside_docscout_evals WHERE id=$1", { eval_id })
        if err then return nil, failed("evaluation could not be read", err) end
        local row = rows[1]
        if not row then return nil, errors.new({ kind = errors.NOT_FOUND, message = "no evaluation " .. eval_id }) end
        local identity = { actor_id = row.actor_id, actor_context = row.actor_context }
        local item, decode_err = decode_eval(row)
        if decode_err then return nil, decode_err end
        if with_identity then
            item.identity = identity
            local snapshot, snapshot_err = decoded(row.config_snapshot, "admitted configuration")
            if snapshot_err then return nil, snapshot_err end
            item.config_snapshot = snapshot
        else
            item.config_snapshot = nil
        end
        local results, results_err = db:query([[SELECT case_id, upload_name, upload_id, expected_values, status, run_id, scores, tokens, duration_ms, error, finished_at
            FROM kickside_docscout_eval_results WHERE eval_id=$1 ORDER BY upload_name, case_id]], { eval_id })
        if results_err then return nil, failed("evaluation results could not be read", results_err) end
        for _, r in ipairs(results) do
            local scores, scores_err = decoded(r.scores, "case scores", true)
            if scores_err then return nil, scores_err end
            r.scores = scores or {}
            local expected, expected_err = decoded(r.expected_values, "admitted expected values")
            if expected_err then return nil, expected_err end
            r.expected, r.expected_values = expected, nil
            local failure, error_err = decoded(r.error, "case error", true)
            if error_err then return nil, error_err end
            r.error = failure
        end
        item.results = results
        return item, nil
    end)
end

function M.mark_eval(component_id: string, eval_id: string, status: string, error_message: string?): (any?, error?)
    return fenced(component_id, function(db: any): (any?, error?)
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
        summarize: ({ any }, { any }) -> any): (any?, error?)
    local scores, scores_err = encoded(outcome.scores or {})
    if scores_err then return nil, scores_err end
    local failure, failure_err = encoded(outcome.error)
    if failure_err then return nil, failure_err end
    return fenced(component_id, function(tx: any): (any?, error?)
        local held, hold_err = tx:execute("UPDATE kickside_docscout_evals SET status='running' WHERE id=$1 AND component_id=$2 AND status IN ('queued','running')", { eval_id, component_id })
        if hold_err then return nil, failed("evaluation could not be locked", hold_err) end
        if held.rows_affected == 0 then return nil, nil end
        local _, err = tx:execute([[UPDATE kickside_docscout_eval_results
            SET status=$1, run_id=$2, scores=$3, tokens=$4, duration_ms=$5, error=$6, finished_at=$7
            WHERE eval_id=$8 AND case_id=$9 AND status='queued']],
            { outcome.status, outcome.run_id or sql.as.null(), scores, outcome.tokens or 0, outcome.duration_ms or 0,
              outcome.error and failure or sql.as.null(), now(), eval_id, case_id })
        if err then return nil, failed("case result could not be stored", err) end
        local rows, rows_err = tx:query("SELECT status, scores, tokens, duration_ms FROM kickside_docscout_eval_results WHERE eval_id=$1", { eval_id })
        if rows_err then return nil, failed("evaluation results could not be read", rows_err) end
        for _, r in ipairs(rows) do if r.status == "queued" then return nil, nil end end
        local finished = {}
        for _, r in ipairs(rows) do
            local decoded_scores, decode_err = decoded(r.scores, "case scores")
            if decode_err then return nil, decode_err end
            finished[#finished + 1] = { status = r.status, scores = decoded_scores,
                tokens = tonumber(r.tokens) or 0, duration_ms = tonumber(r.duration_ms) or 0 }
        end
        local admitted, admitted_err = tx:query("SELECT fields FROM kickside_docscout_evals WHERE id=$1", { eval_id })
        if admitted_err then return nil, failed("evaluated fields could not be read", admitted_err) end
        local fields, fields_err = decoded(admitted[1].fields, "evaluated fields")
        if fields_err then return nil, fields_err end
        local totals = summarize(finished, fields :: { any })
        local metrics, metrics_err = encoded(totals.metrics)
        if metrics_err then return nil, metrics_err end
        local _, done_err = tx:execute([[UPDATE kickside_docscout_evals SET status=$1, metrics=$2, tokens=$3, duration_ms=$4, error=$5, finished_at=$6
            WHERE id=$7]], { totals.status, metrics, totals.tokens, totals.duration_ms, totals.error or sql.as.null(), now(), eval_id })
        if done_err then return nil, failed("evaluation totals could not be stored", done_err) end
        return totals, nil
    end)
end

return M
