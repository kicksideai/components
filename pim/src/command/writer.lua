-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The single PIM write path (spec 6). Commands validate against the projection at
-- thread head S and append with expect = { head = S }; a concurrent append makes
-- them retry against the new head. Success waits until the projection covers the
-- append, so callers read their own writes.
local security = require("security")
local component = require("component")

local funcs = require("funcs")
local uuid = require("uuid")
local policy = require("policy")
local consts = require("consts")
local proposal_rows = require("proposal_rows")
local store = require("store")
local threads = require("threads")
local pipeline = require("pipeline")
local jobs = require("jobs")
local items = require("items")
local releases = require("releases")
local schema_plan = require("schema_plan")
local proposals = require("proposals")
local values = require("values")
local defaults = require("defaults")
local plugins = require("plugins")
local types = require("types")
local failure = require("failure")

local clock = require("clock")
local release_jobs = require("release_jobs")

local receipts = require("receipts")
local M = {}

type Build = (types.Executor, types.Catalog, integer, types.Policy) -> (types.Plan?, error?)

local EV = consts.EVENTS
local invalid = failure.invalid

local function require_access(catalog_id: string, access: integer): error?
    if not security.actor() then return errors.new({ details = { code = "authentication_required" }, kind = errors.PERMISSION_DENIED, message = "an authenticated actor is required" }) end
    if catalog_id == "" then return invalid("catalog_id required") end
    local _, err = component.validate_access(catalog_id, access)
    if err then return failure.coded(errors.wrap(err, "catalog access denied"), "catalog_access_denied") end
    return nil
end

-- actor_id names the caller; require_access has already admitted it.
local function actor_id(): string
    return (security.actor() :: security.Actor):id()
end

-- run executes one command through the command pipeline under the
-- head guard, giving the planner the catalog, thread head and deployment policy.
local function run(catalog_id: string, idempotency: types.Idempotency?, fingerprint: unknown, trace_context: types.TraceContext?,
    build: Build, deadline: clock.Deadline?, source: string?): (types.CommandResult?, error?)
    local base, oerr = defaults.read()
    if oerr or not base then return nil, oerr end
    local current, rerr = store.with_db(function(db: types.Executor): (types.Catalog?, error?)
        return store.catalog(db, catalog_id)
    end)
    if rerr then return nil, rerr end
    if not current then return nil, failure.catalog_not_initialized() end
    local operating = policy.effective(base, current.compiled.policy)
    local c, cerr = threads.open()
    if not c then return nil, cerr end
    local actor = actor_id()
    local out, err = pipeline.run({
        client = c, actor = actor, deadline_ms = operating.command_deadline_ms, deadline = deadline, fingerprint = fingerprint,
            trace_context = trace_context, idempotency = idempotency,
        -- A sourced replay checks permission through the sampled catalog head.
        receipt_requires_head = source ~= nil,
        receipt = function(marker: string): (types.Receipt?, integer?, error?)
            if source then
                local catalog, err = store.with_db(function(db: types.Executor) return store.catalog(db, catalog_id) end)
                if err then return nil, nil, err end
                if not catalog then return nil, nil, failure.catalog_not_initialized() end
                local _, access_err = items.authorize_source(catalog, source, actor)
                if access_err then return nil, nil, access_err end
            end
            return receipts.get(catalog_id, marker)
        end,
        reserve = function(marker: string, hashed: string, position: pipeline.ReceiptPosition, at: string)
            return receipts.reserve(catalog_id, marker, hashed, position, at)
        end,
        noop = function(marker: string, hashed: string, result: types.JsonObject, position: pipeline.ReceiptPosition, at: string)
            return receipts.noop(catalog_id, marker, hashed, result, position, at)
        end,
        thread = { id = catalog_id, kind = consts.PROJECTION_KIND, source = consts.EXTERNAL_SOURCE },
        build = function(last_seq: integer): (pipeline.Attempt?, error?)
            local function attempt(db: types.Executor, catalog: types.Catalog?): (pipeline.Attempt?, error?)
                if not catalog then return nil, failure.catalog_not_initialized() end
                local head=math.max(catalog.applied_seq,last_seq)
                local plan,berr=build(db,catalog,head,base)
                if berr or not plan then return nil,berr end
                return { result = plan.result :: types.JsonObject, events = plan.events, expect = { head = head },
                    as_of = head, catalog_seq = catalog.applied_seq, receipt_after_fold = plan.receipt_after_fold }, nil
            end
            return store.with_db(function(db): (pipeline.Attempt?, error?)
                local catalog, rerr = store.catalog(db, catalog_id)
                if rerr then return nil, rerr end
                return attempt(db, catalog)
            end)
        end,
    })
    if err or not out then return nil, err end
    return out :: types.CommandResult, nil
end

function M.reserve_asset(catalog_id: string, version_id: string, lease: string): (types.CommandResult?, error?)
    return run(catalog_id, nil, {asset_id = version_id}, nil, function(db: types.Executor): (types.Plan?, error?)
        local deleting, err = db:query("SELECT 1 FROM kickside_pim_cleanup WHERE catalog_id=$1", {catalog_id})
        if err then return nil, err end
        if deleting and #deleting > 0 then return nil, failure.catalog_not_initialized() end
        local event: types.Event = {type = EV.ASSET_RESERVED, subject = "assets", body = {asset_id = version_id, lease_until = lease}}
        return {result = {}, events = {event}}, nil
    end)
end

-- Creation prepares generation one before reserving or registering its component.
function M.prepare_initial_schema(catalog_id: string, request: types.SchemaRequest): (types.Plan?, error?)
    return store.with_db(function(db: types.Executor): (types.Plan?, error?)
        return schema_plan.apply(db, nil, catalog_id, request)
    end)
end

-- Only the registration winner can append the prepared first schema.
function M.commit_initial_schema(client: threads.Client, catalog_id: string, plan: types.Plan): error?
    local access_err = require_access(catalog_id, component.ACCESS.ADMIN)
    if access_err then return access_err end
    local operating, err = defaults.read()
    if err or not operating then return err end
    local _, commit_err = pipeline.run({
        client = client, actor = actor_id(), deadline_ms = operating.command_deadline_ms,
        thread = { id = catalog_id, kind = consts.PROJECTION_KIND, source = consts.EXTERNAL_SOURCE },
        build = function(head: integer): (pipeline.Attempt?, error?)
            if head ~= 0 then return nil, failure.catalog_not_initialized() end
            return { result = plan.result :: types.JsonObject, events = plan.events, expect = { head = 0 }, as_of = 0, catalog_seq = 0 }, nil
        end,
    })
    return commit_err
end

-- plan_schema(catalog_id, { declaration, expected_generation? }) classifies a
-- declaration; apply_schema applies it. Needs ADMIN.
function M.plan_schema(catalog_id: string, request: types.SchemaRequest): (types.SchemaPlanResult?, error?)
    local access_err = require_access(catalog_id, component.ACCESS.ADMIN)
    if access_err then return nil, access_err end
    return store.with_db(function(db: types.Executor): (types.SchemaPlanResult?, error?)
        local catalog, err = store.catalog(db, catalog_id)
        if err then return nil, err end
        if not catalog then return nil, failure.catalog_not_initialized() end
        return schema_plan.preview(db, catalog, catalog_id, request)
    end)
end

-- apply_schema(catalog_id, { declaration, expected_generation?, idempotency? })
-- The declaration is merged into the active one: named entries replace theirs,
-- omitted entries stay, and declaration.remove destroys.
function M.apply_schema(catalog_id: string, request: types.SchemaRequest): (types.SchemaResult?, error?)
    local access_err = require_access(catalog_id, component.ACCESS.ADMIN)
    if access_err then return nil, access_err end
    local out, err = run(catalog_id, request.idempotency, { op = "apply_schema", declaration = request.declaration, expected_generation = request.expected_generation, plugin_configs = request.plugin_configs }, request.trace_context,
        function(db: types.Executor, catalog: types.Catalog): (types.Plan?, error?)
            return schema_plan.apply(db, catalog, catalog_id, request)
        end)
    if err or not out then return nil, err end
    return out :: types.SchemaResult, nil
end

-- configure_plugin records validated attachment configuration at the command head.
function M.configure_plugin(catalog_id: string, request: types.PluginConfigRequest): (types.CommandResult?, error?)
    local access_err = require_access(catalog_id, component.ACCESS.ADMIN)
    if access_err then return nil, access_err end
    return run(catalog_id, nil, request, nil, function(_db: types.Executor, catalog: types.Catalog, _head: integer): (types.Plan?, error?)
        if not catalog.compiled.plugins[request.plugin] then
            return nil, errors.new({ kind = errors.NOT_FOUND, retryable = false, message = "plugin is inactive", details = { code = "plugin_inactive", plugin = request.plugin } })
        end
        local plugin, lerr = plugins.load(request.plugin)
        if lerr or not plugin then return nil, lerr end
        local config, err = plugins.effective(plugin, request.config)
        if err or not config then return nil, err end
        local intent=catalog.plugin_state[request.plugin]
        if not request.reset and intent and values.equal(intent.config,config) then return {result={class="unchanged"},events={}},nil end
        return { result = {}, events = { { type = EV.PLUGIN_CONFIGURED, subject = "plugin:" .. request.plugin,
            body = { plugin = request.plugin, config = config } } } }, nil
    end)
end

function M.rebuild_plugin(catalog_id: string, plugin: string): (types.CommandResult?, error?)
    local aerr = require_access(catalog_id, component.ACCESS.WRITE)
    if aerr then return nil, aerr end
    return run(catalog_id, nil, { plugin = plugin }, nil, function(_db: types.Executor, catalog: types.Catalog, _head: integer): (types.Plan?, error?)
        if not catalog.compiled.plugins[plugin] then return nil, errors.new({ kind = errors.NOT_FOUND, message = "plugin is inactive", details = { code = "plugin_inactive" } }) end
        return { result = {}, events = { { type = EV.PLUGIN_REBUILD, subject = "plugin:" .. plugin, body = { plugin = plugin } } } }, nil
    end)
end

-- execute runs an apply request through the write path; import requests come
-- only from catalog import.
local function execute(catalog_id: string, request: types.ApplyRequest, deadline: clock.Deadline?): (types.ApplyResult?, error?)
    local mode = request.mode or "atomic"
    if mode ~= "atomic" and mode ~= "independent" then return nil, invalid("mode must be atomic or independent") end
    local prepared: items.Prepared = { refined = {}, links = {} }
    local out, err = run(catalog_id, request.idempotency,
        pipeline.apply_fingerprint(request), request.trace_context,
        function(db: types.Executor, catalog: types.Catalog, _head: integer, settings: types.Policy): (types.Plan?, error?)
            local conflict = schema_plan.require_generation(request.expected_generation, catalog.generation)
            if conflict then return nil, conflict end
            local planned, perr = items.plan(db, catalog, request, actor_id(), settings, prepared)
            if perr or not planned then return nil, perr end
            local result = { outcomes = planned.outcomes, applied = planned.ok or mode == "independent" }
            if mode == "atomic" and not planned.ok then return { result = result, events = {} }, nil end
            return { result = result, events = planned.events }, nil
        end, deadline, request.source)
    if err then return nil, err end
    return out :: types.ApplyResult, nil
end

-- apply(catalog_id, { items, mode?, source?, expected_generation?, idempotency? })
function M.apply(catalog_id: string, request: types.ApplyRequest, deadline: clock.Deadline?): (types.ApplyResult?, error?)
    local access_err = require_access(catalog_id, component.ACCESS.WRITE)
    if access_err then return nil, access_err end
    if #request.items == 0 then return nil, invalid("items required") end
    if #request.items > consts.LIMITS.items then return nil, invalid("too many items") end
    if request.import then return nil, invalid("import mode is reserved for catalog import") end
    return execute(catalog_id, request, deadline)
end

-- import_items(catalog_id, request) replays exported products during catalog import:
-- the write path with each value's original source kept. Needs ADMIN.
function M.import_items(catalog_id: string, request: types.ApplyRequest): (types.ApplyResult?, error?)
    local access_err = require_access(catalog_id, component.ACCESS.ADMIN)
    if access_err then return nil, access_err end
    if #request.items == 0 then return nil, invalid("items required") end
    if #request.items > consts.LIMITS.items then return nil, invalid("too many items") end
    request.import = true
    return execute(catalog_id, request)
end

local function run_plan(catalog_id: string, request: types.ReleaseRequest, op: string,
    plan: (types.Executor, types.Catalog, types.ReleaseRequest) -> (releases.Planned?, error?), deadline: clock.Deadline?): (types.ApplyResult?, error?)
    local access_err = require_access(catalog_id, component.ACCESS.WRITE)
    if access_err then return nil, access_err end
    if #request.items == 0 then return nil, invalid("items required") end
    if #request.items > consts.LIMITS.release_items then return nil, invalid("too many items") end
    local out, err = run(catalog_id, request.idempotency, { op = op, items = request.items }, request.trace_context,
        function(db: types.Executor, catalog: types.Catalog, _head: integer): (types.Plan?, error?)
            local planned, perr = plan(db, catalog, request)
            if perr or not planned then return nil, perr end
            return { result = { outcomes = planned.outcomes, applied = #planned.events > 0 }, events = planned.events,
                receipt_after_fold = planned.receipt_after_fold }, nil
        end, deadline)
    if err then return nil, err end
    return out :: types.ApplyResult, nil
end

-- The projection has folded the proposal by the time the command returns.
-- Refresh the inbox count before acknowledging the proposal command.
local function publish_proposal_count(catalog_id: string): error?
    local _, err = funcs.call("kickside.pim.persist:publish_meta", { thread_id = catalog_id, proposal_only = true })
    return err
end

-- propose validates at the command head and records the proposal for review.
function M.propose(catalog_id: string, request: types.ProposeRequest): (types.ProposeResult?, error?)
    local access_err = require_access(catalog_id, component.ACCESS.READ)
    if access_err then return nil, access_err end
    if #request.items == 0 then return nil, invalid("items required") end
    if #request.items > consts.LIMITS.items then return nil, invalid("too many items") end
    local fingerprint = { op = "propose", items = request.items, source = request.source,
        expected_generation = request.expected_generation, origin = request.origin, provenance = request.provenance }
    local bytes = #values.canonical(request)
    local prepared: items.Prepared = { refined = {}, links = {} }
    local out, err = run(catalog_id, request.idempotency, fingerprint, request.trace_context,
        function(db: types.Executor, catalog: types.Catalog, _head: integer, settings: types.Policy): (types.Plan?, error?)
            local _, source_err = items.authorize_source(catalog, request.source, actor_id())
            if source_err then return nil, source_err end
            local conflict = schema_plan.require_generation(request.expected_generation, catalog.generation)
            if conflict then return nil, conflict end
            local effective = policy.effective(settings, catalog.compiled.policy)
            if bytes > effective.proposal_bytes then return nil, invalid("proposal exceeds configured byte budget", { code = "proposal_budget_exceeded" }) end
            local count, qerr = proposal_rows.count(db, catalog_id, effective.proposal_count)
            if qerr or not count then return nil, qerr end
            if count >= effective.proposal_count then return nil, invalid("catalog proposal quota reached", { code = "proposal_limit" }) end
            local captured, berr = proposals.capture(db, catalog, request)
            if berr or not captured then return nil, berr end
            local planned, perr = items.plan(db, catalog, proposals.plan_request(captured, request.source), actor_id(), settings, prepared, true)
            if perr or not planned then return nil, perr end
            if not planned.ok then return nil, invalid("proposal items are invalid at the catalog head", { outcomes = planned.outcomes :: { types.JsonObject } }) end
            local id = uuid.v7() :: string
            local body: types.ProposalSubmittedBody = { proposal_id = id, generation = catalog.generation, base = captured.base,
                items = captured.items, source = request.source, origin = request.origin, provenance = request.provenance }
            return { result = { proposal_id = id, status = "pending" },
                events = { { type = EV.PROPOSAL_SUBMITTED, subject = "proposals", body = body } } }, nil
        end, nil, request.source)
    if err or not out then return nil, err end
    local merr = publish_proposal_count(catalog_id)
    if merr then return nil, merr end
    local recorded = out :: types.ProposeResult
    return { proposal_id = recorded.proposal_id, status = recorded.status }, nil
end

-- settled maps an accepted proposal's apply result to its final status:
-- accepted when applied, conflict when only stale versions stopped it (the
-- proposal can be decided again), failed when an item is refused outright.
local function settled(applied: types.ApplyResult): types.DecisionStatus
    if applied.applied then return "accepted" end
    for _, o in ipairs(applied.outcomes) do
        local kind = o.outcome
        if kind ~= "conflict" and kind ~= "created" and kind ~= "updated" and kind ~= "unchanged" then return "failed" end
    end
    return "conflict"
end

local function get_proposal(db: types.Executor, catalog_id: string, id: string): (types.Proposal?, error?)
    local proposal, err = proposal_rows.get(db, catalog_id, id)
    if err then return nil, err end
    if not proposal then return nil, errors.new({ kind = errors.NOT_FOUND, message = "proposal not found", details = { code = "proposal_not_found" } }) end
    return proposal, nil
end

local function decision(proposal: types.Proposal): types.DecideResult
    return { proposal_id = proposal.proposal_id, status = proposal.status :: types.DecisionStatus, result = proposal.result }
end

local function decided(status: string): error
    return errors.new({ kind = errors.CONFLICT, message = "proposal is " .. status, details = { code = "proposal_decided", status = status } })
end

-- decide rebuilds at the new head after contention. Accepted product edits and
-- their decision are one append, so rejection and acceptance cannot both win.
function M.decide(catalog_id: string, request: types.DecideRequest): (types.DecideResult?, error?)
    local access_err = require_access(catalog_id, component.ACCESS.WRITE)
    if access_err then return nil, access_err end
    local action = request.decision
    if action ~= "accept" and action ~= "reject" then return nil, invalid("decision is accept or reject") end
    local id = request.proposal_id
    local prepared: items.Prepared = { refined = {}, links = {} }
    local out, err = run(catalog_id, nil, nil, request.trace_context,
        function(db: types.Executor, catalog: types.Catalog, head: integer, settings: types.Policy): (types.Plan?, error?)
            local proposal, perr = get_proposal(db, catalog_id, id)
            if perr or not proposal then return nil, perr end
            if proposal.status ~= "pending" and proposal.status ~= "conflict" then
                if action == "reject" and proposal.status ~= "rejected" then return nil, decided(proposal.status) end
                return { result = decision(proposal), events = {} }, nil
            end
            local result: types.DecideResult = { proposal_id = id, status = "rejected" }
            local events: { types.Event } = {}
            if action == "accept" then
                local conflict = schema_plan.require_generation(proposal.generation, catalog.generation)
                if conflict then return nil, conflict end
                local planned, aerr = items.plan(db, catalog, proposals.accept_request(proposal), actor_id(), settings, prepared, true)
                if aerr or not planned then return nil, aerr end
                if planned.ok then events = planned.events end
                local applied: types.ApplyResult = { outcomes = planned.outcomes, applied = planned.ok,
                    seq = #events > 0 and head + #events or nil, as_of = head + #events + 1 }
                result.status, result.result = settled(applied), applied
                if result.status == "conflict" and proposal.status == "conflict" and proposal.result
                    and values.equal(proposal.result.outcomes, applied.outcomes) then
                    return { result = decision(proposal), events = {} }, nil
                end
            end
            local body: types.ProposalDecidedBody = { proposal_id = id, decision = action, status = result.status, result = result.result }
            events[#events + 1] = { type = EV.PROPOSAL_DECIDED, subject = "proposals", body = body }
            return { result = result, events = events }, nil
        end)
    if err or not out then return nil, err end
    local merr = publish_proposal_count(catalog_id)
    if merr then return nil, merr end
    local recorded = out :: types.DecideResult
    return { proposal_id = id, status = recorded.status, result = recorded.result }, nil
end

-- rebuild(catalog_id) wakes the catalog's rebuild slot, parked after a failed
-- run, so it resumes from its cursor. Needs ADMIN.
function M.rebuild(catalog_id: string): (types.RebuildResult?, error?)
    local access_err = require_access(catalog_id, component.ACCESS.ADMIN)
    if access_err then return nil, access_err end
    local catalog,err=store.with_db(function(db): (types.Catalog?,error?) return store.catalog(db,catalog_id) end)
    if err then return nil,err end
    if not catalog then return nil, failure.catalog_not_initialized() end
    if catalog.rebuild_after == nil or not catalog.rebuild_job then return { rebuilding = false }, nil end
    local _, werr = jobs.wake_job(catalog.rebuild_job :: string, { control = true, ensure_due = true })
    if werr then return nil, errors.wrap(werr, "rebuild wake failed") end
    return { rebuilding = true }, nil
end

-- release(catalog_id, { items = [{ product, expect_version, channels? }], idempotency? })
function M.release(catalog_id: string, request: types.ReleaseRequest, deadline: clock.Deadline?): (types.ApplyResult?, error?)
    local out, err = run_plan(catalog_id, request, "release", releases.release, deadline)
    if err or not out then return nil, err end
    for _, outcome in ipairs(out.outcomes) do
        if outcome.request_id and not outcome.job_id then
            return store.with_db(function(db): (types.ApplyResult?, error?)
                local jerr = release_jobs.attach_ids(db, catalog_id, out.outcomes)
                if jerr then return nil, jerr end
                return out, nil
            end)
        end
    end
    return out, nil
end

-- withdraw(catalog_id, { items = [{ product, channels? }], idempotency? })
function M.withdraw(catalog_id: string, request: types.ReleaseRequest): (types.ApplyResult?, error?)
    return run_plan(catalog_id, request, "withdraw", releases.withdraw)
end

return M
