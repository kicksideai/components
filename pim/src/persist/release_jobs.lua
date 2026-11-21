-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Model release intent and frozen page commands survive worker interruptions.
local store = require("store")
local types = require("types")
local values = require("values")
local sql = require("sql")
local jobs = require("jobs")
local lifecycle_enqueue = require("lifecycle_enqueue")
local consts = require("consts")
local clock=require("clock")
local M = {}
type Reference = { request_id: string, job_id: string? }
M.Reference = Reference
type Task = { request_id: string, model_id: string, root: integer, identity: types.JsonObject, channels: { string }?,
    trace_context: types.TraceContext?, job_id: string, after_product: string, batch: types.ReleaseRequest?, done: integer }
M.Task = Task

local function identity(catalog_id: string, model_id: string, version: integer): { namespace: string, scope: string, key: string }
    return { namespace = "pim", scope = "release_model:" .. catalog_id, key = model_id .. ":" .. version }
end

-- The Jobs unique index covers exactly pending and running rows. The immutable
-- payload carries the request ID even when PIM's task rows have been retained away.
function M.active(db: types.Executor, catalog_id: string, model_id: string, version: integer): (Reference?, error?)
    local key, kerr = lifecycle_enqueue.identity_parts({ job_identity = identity(catalog_id, model_id, version) }, "")
    if kerr or not key then return nil, kerr end
    local rows, err = db:query([[SELECT id, CAST(payload AS text) AS payload FROM kickside_job
        WHERE job_identity = $1 AND status IN ('pending','running')]], { key })
    if err or not rows or not rows[1] then return nil, err end
    local job, derr = store.decode_row(rows[1], { id = "text", payload = "json" })
    if derr or not job then return nil, derr end
    return { request_id = (job.payload :: types.JsonObject).request_id :: string, job_id = job.id :: string }, nil
end

-- Complete release outcomes using primary-key seeks, once per new job in the batch.
function M.attach_ids(db: types.Executor, catalog_id: string, outcomes: { types.Outcome }): error?
    local ids: { [string]: string } = {}
    for _, outcome in ipairs(outcomes) do
        local request_id = outcome.request_id
        if request_id and not outcome.job_id then
            if not ids[request_id] then
                local rows, err = db:query("SELECT job_id FROM kickside_pim_release_job WHERE catalog_id = $1 AND request_id = $2",
                    { catalog_id, request_id })
                if err then return err end
                if not rows or not rows[1] then
                    return errors.new({ kind = errors.NOT_FOUND, message = "model release request is missing", details = { code = "model_release_absent" } })
                end
                ids[request_id] = rows[1].job_id :: string
            end
            outcome.job_id = ids[request_id]
        end
    end
    return nil
end

function M.get(tx: types.Executor, catalog_id: string, request_id: string): (Task?, error?)
    local rows, err = tx:query("SELECT * FROM kickside_pim_release_job WHERE catalog_id = $1 AND request_id = $2", { catalog_id, request_id })
    if err then return nil, err end
    if not rows or not rows[1] then return nil, errors.new({ kind = errors.NOT_FOUND, message = "model release request is missing", details = { code = "model_release_absent" } }) end
    local r, derr = store.decode_row(rows[1], { request_id = "text", model_id = "text", root = "int", identity = "json", channels = "json?",
        job_id = "text", after_product = "text", batch = "json?", done = "int",trace_context="json?" })
    if derr or not r then return nil, derr end
    return { trace_context=r.trace_context :: types.TraceContext?,request_id = r.request_id :: string, model_id = r.model_id :: string, root = r.root :: integer,
        identity = r.identity :: types.JsonObject, channels = r.channels :: { string }?, job_id = r.job_id :: string,
        after_product = r.after_product :: string, batch = r.batch :: types.ReleaseRequest?, done = r.done :: integer }, nil
end

function M.record(tx: sql.Transaction, dialect: string, catalog_id: string, body: types.ModelReleaseBody,trace: types.TraceContext?): (string?, error?)
    local key = identity(catalog_id, body.product_id, body.version)
    local job, err = jobs.enqueue_tx(tx, dialect, { namespace = key.namespace, scope = key.scope, key = key.key,
        owner_locator = { kind = "component", id = catalog_id }, job_type = consts.RELEASE_OWNER, max_attempts = 5,trace_context=trace,
        immutable_payload = { catalog_id = catalog_id, request_id = body.request_id } })
    if err then return nil, err end
    local id = job and job.id
    if type(id) ~= "string" then return nil, errors.new({ kind = errors.INTERNAL, message = "release enqueue returns no job id", details = { code = "internal" } }) end
    local _, ierr = tx:execute([[INSERT INTO kickside_pim_release_job (catalog_id, request_id, model_id, root, identity, channels,
        job_id, after_product, done,trace_context,created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, '', 0,$8,$9)]],
        { catalog_id, body.request_id, body.product_id, body.root and 1 or 0, values.canonical(body.identity), body.channels and values.canonical(body.channels) or sql.NULL, id,trace and values.canonical(trace) or sql.NULL,clock.now() })
    if ierr then return nil, ierr end
    return id, nil
end

-- prepare freezes the exact command before execution; a redelivery reuses it.
function M.prepare(catalog_id: string, request_id: string): (Task?, error?)
    return store.transaction("model release page", function(tx: types.Executor, _dialect: string): (Task?, error?)
        local task, err = M.get(tx, catalog_id, request_id)
        if err or not task then return nil, err end
        if task.done == 1 or task.batch then return task, nil end
        local column = task.root == 1 and "root_id" or "parent_id"
        local rows, qerr = tx:query("SELECT product_id, version FROM kickside_pim_product WHERE catalog_id = $1 AND " .. column
            .. " = $2 AND product_id > $3 AND is_item = 1 AND state = 'live' AND status = 'active' ORDER BY product_id LIMIT $4",
            { catalog_id, task.model_id, task.after_product, consts.LIMITS.release_items })
        if qerr then return nil, qerr end
        local items: { types.ReleaseItem } = {}
        local last = task.after_product
        for _, row in ipairs(rows or {}) do
            local r, derr = store.decode_row(row, { product_id = "text", version = "int" })
            if derr or not r then return nil, derr end
            last = r.product_id :: string
            items[#items + 1] = { product = { id = last }, expect_version = r.version :: integer, channels = task.channels }
        end
        if #items == 0 then
            local _, uerr = tx:execute("UPDATE kickside_pim_release_job SET done = 1,completed_at=$1 WHERE catalog_id = $2 AND request_id = $3", { clock.now(),catalog_id,request_id })
            if uerr then return nil, uerr end
            task.done = 1
            return task, nil
        end
        task.batch = { trace_context=task.trace_context,items = items, idempotency = { namespace = "release_model", key = request_id .. ":" .. last } }
        local _, uerr = tx:execute("UPDATE kickside_pim_release_job SET batch = $1 WHERE catalog_id = $2 AND request_id = $3",
            { values.canonical(task.batch), catalog_id, request_id })
        if uerr then return nil, uerr end
        return task, nil
    end)
end

function M.advance(db: types.Executor, catalog_id: string, request_id: string, after: string): error?
    local _, err = db:execute([[UPDATE kickside_pim_release_job SET after_product = $1, batch = NULL
        WHERE catalog_id = $2 AND request_id = $3]], { after, catalog_id, request_id })
    return err
end
return M
