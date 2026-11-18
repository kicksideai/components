-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local defaults=require("defaults")
-- Rebuild job: after a schema change that alters resolved values or the item
-- layout, rewrites every item row and drops values of removed attributes. It walks
-- live and trashed products in key order from catalog.rebuild_after in batches,
-- each under the catalog row lock, so projection folds and batches take
-- turns on a row, and stamps each rewritten product with the schema event's
-- seq so feeds report it. A run that fails with a retryable error is retried by
-- Jobs; any other failure parks the slot until the next schema change or the
-- ADMIN rebuild method wakes it.
local jobs = require("jobs")
local budget = require("budget")
local failure = require("failure")
local component = require("component")
local execution_identity = require("execution_identity")
local consts = require("consts")
local funcs = require("funcs")
local clock = require("clock")
local store = require("store")
local rebuild_rows = require("rebuild_rows")
local document = require("document")
local item_index = require("item_index")
local types = require("types")

local M = {}

type Job = { id: string, lease_token: string, execution_seq: integer, deadline: string? }
type Input = { job: Job?, payload: { catalog_id: string? }? }


type BatchInput = { catalog_id: string, deadline: string? }
type BatchResult = { done: boolean }
type Progress = { done: boolean, published: boolean? }
type RunResult = { self_completed: boolean?, rebuilt: boolean?, completion: unknown }


-- rewrite rebuilds the next products in one transaction; it answers true when the
-- rebuild is complete.
local function rewrite(catalog_id: string): (Progress?, error?)
    local operating,oerr=defaults.catalog(catalog_id)
    if oerr or not operating then return nil,oerr end
    local BATCH=operating.rebuild_rows
    return store.transaction("rebuild batch", function(tx: types.Executor, dialect: string): (Progress?, error?)
        local current, cerr = store.catalog(tx, catalog_id, dialect)
        if cerr then return nil, cerr end
        if not current then return { done = true }, nil end
        local ready, rerr = rebuild_rows.prepare(tx, dialect, current, BATCH)
        if rerr then return nil, rerr end
        if not ready then return { done = false }, nil end
        if current.rebuild_after == nil then return { done = true }, nil end
        local rebuild_seq = current.rebuild_seq
        if not rebuild_seq then return nil, failure.corrupt("rebuild has no schema seq") end
        local rows, qerr = rebuild_rows.page(tx, catalog_id, current.rebuild_after :: string, BATCH)
        if qerr or not rows then return nil, qerr end
        local ids: { [string]: boolean } = {}
        local cache: { [string]: types.Product } = {}
        local products: { types.Product } = {}
        for _, r in ipairs(rows) do
            if r.state ~= "purged" then
                local p, perr = store.from_row(r)
                if perr or not p then return nil, perr end
                document.compact(current.compiled, p.document :: types.Document)
                if (p.updated_seq or 0) < rebuild_seq then p.updated_seq = rebuild_seq end
                products[#products + 1] = p
                cache[p.product_id] = p
                ids[p.product_id] = true
            end
        end
        local err = store.write_products(tx, catalog_id, products, false)
        if not err then err = item_index.recompute(tx, dialect, current, ids, cache) end
        if err then return nil, err end
        if #rows == BATCH then
            local aerr = rebuild_rows.advance(tx, catalog_id, rows[#rows].product_id :: string)
            if aerr then return nil, aerr end
            return { done = false }, nil
        end
        local done, ferr = rebuild_rows.finish(tx, current)
        if ferr then return nil, ferr end
        return { done = done, published = true }, nil
    end)
end

-- catalog_identity reads the execution identity the catalog's component holds.
local function catalog_identity(catalog_id: string): (unknown, error?)
    local context, cerr = component.get_private_context(catalog_id)
    if cerr then return nil, cerr end
    local identity = context and (context :: types.JsonObject)[execution_identity.CONTEXT_KEY]
    if identity == nil then return nil, errors.new({ kind = errors.INVALID, retryable = false, message = "catalog holds no execution identity", details = { code = "catalog_identity_absent" } }) end
    local _, verr = execution_identity.validate(identity)
    if verr then return nil, verr :: error end
    return identity, nil
end



-- batch runs one rebuild batch. The job calls it as the catalog's execution
-- identity, so plugin checks run under the owner's authority, as in the fold.
function M.batch(input: BatchInput): (BatchResult?, error?)
    local _, access_err = component.validate_access(input.catalog_id, component.ACCESS.ADMIN)
    if access_err then return nil, failure.coded(errors.wrap(access_err, "rebuild catalog access"), "component_access_denied") end
    local operating,oerr=defaults.catalog(input.catalog_id)
    if oerr or not operating then return nil,oerr end
    local deadline, derr = budget.deadline(input.deadline)
    if derr or not deadline then return nil, derr end
    if not budget.enough(deadline, operating.command_deadline_ms) then return { done = false }, nil end
    local progress, berr = rewrite(input.catalog_id)
    if berr or not progress then return nil, berr end
    if progress.done or progress.published then
        local _, merr = funcs.call("kickside.pim.persist:publish_meta", { thread_id = input.catalog_id,projection_only=true })
        if merr then return nil, merr end
    end
    return { done = progress.done }, nil
end

-- work runs the rebuild batches of one invocation.
local function work(job: Job, catalog_id: string, deadline: clock.Deadline, operating:types.Policy): (RunResult?, error?)
    local identity, ierr = catalog_identity(catalog_id)
    if ierr then return nil, ierr end
    for _ = 1, operating.job_batches do
        if not budget.enough(deadline, operating.command_deadline_ms) then break end
        local valid, lerr = jobs.lease_valid(job.id, budget.lease(job))
        if lerr then return nil, lerr end
        if not valid then return { self_completed = true }, nil end
        local out, berr = execution_identity.run_as(identity, consts.REBUILD_BATCH, { catalog_id = catalog_id, deadline = job.deadline },
            { deferred_owner = consts.REBUILD_OWNER, execution_root = catalog_id })
        if berr then return nil, berr :: error end
        if (out :: BatchResult).done then
            return { rebuilt = true }, nil
        end
    end
    local completion, cerr = jobs.complete(job.id, budget.lease(job), { rearm = clock.now() })
    if cerr then return nil, cerr end
    return { self_completed = true, completion = completion }, nil
end

type Parked = { park: boolean, record: { status: string, error: string } }

-- run answers a malformed invocation with a native error; a deterministic
-- failure of the work parks with its record, so the slot waits for the next
-- schema change or the ADMIN rebuild wake (Jobs classifies failures by kind, so
-- the worker answers park itself); a retryable failure returns to Jobs.
function M.run(input: Input): (RunResult | Parked | nil, error?)
    local job = input.job
    local catalog_id = input.payload and input.payload.catalog_id
    if not job or type(catalog_id) ~= "string" then
        return nil, errors.new({ kind = errors.INVALID, retryable = false, message = "rebuild job is malformed", details = { code = "rebuild_job_invalid" } })
    end
    local operating,oerr=defaults.catalog(catalog_id)
    if oerr or not operating then return nil,oerr end
    local deadline, deadline_err = budget.deadline(job.deadline)
    if deadline_err or not deadline then return nil, deadline_err end
    local out, err = work(job, catalog_id, deadline,operating)
    if err then
        if err:retryable() == false then
            return { park = true, record = { status = "failed", error = tostring(err) } }, nil
        end
        return nil, err
    end
    return out, nil
end

return M
