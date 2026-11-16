local policy = require("policy")
-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The single PIM write path (spec 6). Commands validate against the projection at
-- thread head S and append with expect = { head = S }; a concurrent append makes
-- them retry against the new head. Success waits until the projection covers the
-- append, so callers read their own writes.
local security = require("security")
local component = require("component")

local funcs = require("funcs")
local consts = require("consts")
local seams = require("seams")
local proposal_rows = require("proposal_rows")
local store = require("store")
local threads = require("threads")
local pipeline = require("pipeline")
local jobs = require("jobs")
local items = require("items")
local releases = require("releases")
local proposals = require("proposals")
local schema = require("schema")
local declaration = require("declaration")
local changes_of = require("changes")
local values = require("values")
local defaults = require("defaults")
local scopes = require("scopes")
local plugins = require("plugins")
local links = require("links")
local types = require("types")
local failure = require("failure")

local clock = require("clock")
local release_jobs = require("release_jobs")

local receipts = require("receipts")
local M = {}

type Build = (types.Executor, types.Catalog?, integer) -> (types.Plan?, error?)

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
-- head guard: build(db, catalog, S) -> { events, result } | error, at thread head S.
local function run(catalog_id: string, idempotency: types.Idempotency?, fingerprint: unknown, trace_context: types.TraceContext?,
    build: Build, deadline: clock.Deadline?): (types.CommandResult?, error?)
    local operating,oerr=defaults.catalog(catalog_id)
    if oerr or not operating then return nil,oerr end
    local c, cerr = threads.open()
    if not c then return nil, cerr end
    local out, err = pipeline.run({
        client = c, actor = actor_id(), deadline_ms = operating.command_deadline_ms, deadline = deadline, fingerprint = fingerprint,
            trace_context = trace_context, idempotency = idempotency,
        receipt = function(marker: string) return receipts.get(catalog_id, marker) end,
        reserve = function(marker: string,hashed: string,seq: integer,at: string) return receipts.reserve(catalog_id,marker,hashed,seq,at) end,
        noop = function(marker: string,hashed: string,result: types.JsonObject,seq: integer,at: string) return receipts.noop(catalog_id,marker,hashed,result,seq,at) end,
        thread = { id = catalog_id, kind = consts.PROJECTION_KIND, source = consts.EXTERNAL_SOURCE },
        build = function(last_seq: integer): (pipeline.Attempt?, error?)
            return store.with_db(function(db): (pipeline.Attempt?,error?)
                local catalog,rerr=store.catalog(db,catalog_id)
                if rerr then return nil,rerr end
                local head=math.max(catalog and catalog.applied_seq or 0,last_seq)
                local plan,berr=build(db,catalog,head)
                if berr or not plan then return nil,berr end
                return {result=plan.result :: types.JsonObject,events=plan.events,expect={head=head},as_of=head},nil
            end)
        end,
    })
    if err or not out then return nil, err end
    return out :: types.CommandResult, nil
end

type SchemaPlan = { generation: integer, class: string, changes: { types.SchemaChange }, refused: { types.SchemaChange },
    effective: types.Declaration, compiled: types.Compiled, configs: { [string]: types.JsonObject }, unchanged: boolean }

-- plan_schema merges, compiles and classifies a declaration against the catalog
-- state at the command head; plan_schema returns it, apply_schema appends it.
local function plan_schema(db: types.Executor, catalog: types.Catalog?, catalog_id: string, request: types.SchemaRequest): (SchemaPlan?, error?)
    local generation = catalog and catalog.generation or 0
    if request.expected_generation ~= nil and request.expected_generation ~= generation then
        return nil, errors.new({ kind = errors.CONFLICT, message = "schema generation changed", details = { code = "schema_generation_conflict", generation = generation } })
    end
    local prev = catalog and catalog.compiled or nil
    local prev_declaration: types.Declaration? = nil
    if catalog then
        local stored, derr = store.declaration(db, catalog_id, generation)
        if derr then return nil, derr end
        prev_declaration = stored
    end
    local shape_err = declaration.check_shape(request.declaration)
    if shape_err then return nil, shape_err end
    local incoming, rerr = declaration.resolve_plugins(request.declaration, prev_declaration,
        function(id: string, entry: types.PluginEntry, held: types.PluginEntry?): (types.PluginSchema?, error?)
            return plugins.resolve(catalog_id, id, entry, held, request.plugin_configs and request.plugin_configs[id] or (catalog and catalog.plugin_state[id] and catalog.plugin_state[id].config or nil))
        end)
    if rerr or not incoming then return nil, rerr end
    local effective, merr = declaration.merge(prev_declaration, incoming)
    if merr or not effective then return nil, merr end
    local aerr = plugins.admit(effective, prev_declaration)
    if aerr then return nil, aerr end
    local next_compiled, cerr = schema.compile(prev, effective, {
        type_of = seams.load_type, is_check = seams.is_check, plugin = plugins.check, link_kind = links.has_kind,
        scope = function(id: string): (boolean, error?)
            local scope, err = scopes.load(id)
            return scope ~= nil, err
        end,
    })
    if cerr or not next_compiled then return nil, cerr end
    local compiled: types.Compiled = next_compiled
    local configs: { [string]: types.JsonObject } = {}
    for id, own in pairs(request.plugin_configs or {}) do
        if not next_compiled.plugins[id] or (prev and prev.plugins[id]) then
            return nil, invalid("plugin_configs names an activating plugin", { code = "plugin_config_invalid", plugin = id })
        end
    end
    for id in pairs(next_compiled.plugins) do
        if not prev or not prev.plugins[id] then
            local plugin, lerr = plugins.load(id)
            if lerr or not plugin then return nil, lerr end
            local config, eerr = plugins.effective(plugin, request.plugin_configs and request.plugin_configs[id])
            if eerr or not config then return nil, eerr end
            configs[id] = config
        end
    end
    declaration.stamp(effective, compiled)
    if prev_declaration and values.equal(prev_declaration, effective) then
        return { generation = generation, class = "unchanged", changes = {}, refused = {}, effective = effective, compiled = compiled, configs = configs, unchanged = true }, nil
    end
    local usage, uerr = store.usage(db, catalog_id)
    if uerr or not usage then return nil, uerr end
    local family_products, ferr = store.family_products(db, catalog_id)
    if ferr or not family_products then return nil, ferr end
    local changes = changes_of.changes(prev, compiled, { usage = usage, family_products = family_products, populated = next(family_products) ~= nil })
    local refused: { types.SchemaChange } = {}
    for _, c in ipairs(changes) do if c.class == "refused" then refused[#refused + 1] = c end end
    return { generation = generation + 1, class = #refused > 0 and "refused" or changes_of.classify(prev, compiled, changes),
        changes = changes, refused = refused, effective = effective, compiled = compiled, configs = configs, unchanged = false }, nil
end

local MIGRATION = "add a new attribute, copy values to it with apply commands, remove the old attribute, then rename the new one by id"

-- plan_schema(catalog_id, { declaration, expected_generation? }) classifies a
-- declaration; apply_schema applies it. Needs ADMIN.
function M.plan_schema(catalog_id: string, request: types.SchemaRequest): (types.SchemaPlanResult?, error?)
    local access_err = require_access(catalog_id, component.ACCESS.ADMIN)
    if access_err then return nil, access_err end
    local plan,err=store.with_db(function(db): (SchemaPlan?,error?)
        local catalog,cerr=store.catalog(db,catalog_id)
        if cerr then return nil,cerr end
        return plan_schema(db,catalog,catalog_id,request)
    end)
    if err or not plan then return nil,err end
    return { generation = plan.generation, class = plan.class, changes = plan.changes, refused = plan.refused,
        migration = #plan.refused > 0 and MIGRATION or nil }, nil
end

-- apply_schema(catalog_id, { declaration, expected_generation?, idempotency? })
-- The declaration is merged into the active one: named entries replace theirs,
-- omitted entries stay, and declaration.remove destroys.
function M.apply_schema(catalog_id: string, request: types.SchemaRequest): (types.SchemaResult?, error?)
    local access_err = require_access(catalog_id, component.ACCESS.ADMIN)
    if access_err then return nil, access_err end
    local out, err = run(catalog_id, request.idempotency, { op = "apply_schema", declaration = request.declaration, expected_generation = request.expected_generation, plugin_configs = request.plugin_configs }, request.trace_context,
        function(db: types.Executor, catalog: types.Catalog?, _head: integer): (types.Plan?, error?)
            local plan, perr = plan_schema(db, catalog, catalog_id, request)
            if perr or not plan then return nil, perr end
            if plan.unchanged then
                return { result = { generation = plan.generation, class = "unchanged", changes = {} }, events = {} }, nil
            end
            if #plan.refused > 0 then
                return nil, invalid("schema change reinterprets stored values", { code = "migration_required",
                    changes = plan.refused :: { types.JsonObject }, migration = MIGRATION })
            end
            local body: types.SchemaBody = { generation = plan.generation, declaration = plan.effective, compiled = plan.compiled,
                class = plan.class, changes = plan.changes, plugin_configs = next(plan.configs) ~= nil and plan.configs or nil }
            local event: types.Event = { type = EV.SCHEMA_APPLIED, subject = "schema", body = body }
            local result: types.SchemaResult = { generation = plan.generation, class = plan.class, changes = plan.changes }
            return { result = result, events = { event } }, nil
        end)
    if err or not out then return nil, err end
    return out :: types.SchemaResult, nil
end

-- configure_plugin records validated attachment configuration at the command head.
function M.configure_plugin(catalog_id: string, request: { plugin: string, config: types.JsonObject }): (types.CommandResult?, error?)
    local access_err = require_access(catalog_id, component.ACCESS.ADMIN)
    if access_err then return nil, access_err end
    return run(catalog_id, nil, request, nil, function(_db: types.Executor, catalog: types.Catalog?, _head: integer): (types.Plan?, error?)
        if not catalog or not catalog.compiled.plugins[request.plugin] then
            return nil, errors.new({ kind = errors.NOT_FOUND, retryable = false, message = "plugin is inactive", details = { code = "plugin_inactive", plugin = request.plugin } })
        end
        local plugin, lerr = plugins.load(request.plugin)
        if lerr or not plugin then return nil, lerr end
        local config, err = plugins.effective(plugin, request.config)
        if err or not config then return nil, err end
        local intent=catalog.plugin_state[request.plugin]
        if intent and values.equal(intent.config,config) then return {result={class="unchanged"},events={}},nil end
        return { result = {}, events = { { type = EV.PLUGIN_CONFIGURED, subject = "plugin:" .. request.plugin,
            body = { plugin = request.plugin, config = config } } } }, nil
    end)
end

function M.rebuild_plugin(catalog_id: string, plugin: string): (types.CommandResult?, error?)
    local aerr = require_access(catalog_id, component.ACCESS.WRITE)
    if aerr then return nil, aerr end
    return run(catalog_id, nil, { plugin = plugin }, nil, function(_db: types.Executor, catalog: types.Catalog?, _head: integer): (types.Plan?, error?)
        if not catalog or not catalog.compiled.plugins[plugin] then return nil, errors.new({ kind = errors.NOT_FOUND, message = "plugin is inactive", details = { code = "plugin_inactive" } }) end
        return { result = {}, events = { { type = EV.PLUGIN_REBUILD, subject = "plugin:" .. plugin, body = { plugin = plugin } } } }, nil
    end)
end

-- execute runs an apply request through the write path; import requests come
-- only from catalog import.
local function execute(catalog_id: string, request: types.ApplyRequest, deadline: clock.Deadline?): (types.ApplyResult?, error?)
    local mode = request.mode or "atomic"
    if mode ~= "atomic" and mode ~= "independent" then return nil, invalid("mode must be atomic or independent") end
    local settings, serr = defaults.read()
    if serr or not settings then return nil, serr end
    local prepared: items.Prepared = { refined = {}, links = {} }
    local out, err = run(catalog_id, request.idempotency,
        { op = "apply", items = request.items, mode = mode, source = request.source or "" }, request.trace_context,
        function(db: types.Executor, catalog: types.Catalog?, _head: integer): (types.Plan?, error?)
            if not catalog then return nil, errors.new({ details = { code = "catalog_not_found" }, kind = errors.NOT_FOUND, message = "catalog has no schema" }) end
            local planned, perr = items.plan(db, catalog, request, actor_id(), settings, prepared)
            if perr or not planned then return nil, perr end
            local result = { outcomes = planned.outcomes, applied = planned.ok or mode == "independent" }
            if mode == "atomic" and not planned.ok then return { result = result, events = {} }, nil end
            return { result = result, events = planned.events }, nil
        end, deadline)
    if err then return nil, err end
    return out :: types.ApplyResult, nil
end

-- apply(catalog_id, { items, mode?, source?, idempotency? })
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
        function(db: types.Executor, catalog: types.Catalog?, _head: integer): (types.Plan?, error?)
            if not catalog then return nil, errors.new({ details = { code = "catalog_not_found" }, kind = errors.NOT_FOUND, message = "catalog has no schema" }) end
            local planned, perr = plan(db, catalog, request)
            if perr or not planned then return nil, perr end
            return { result = { outcomes = planned.outcomes, applied = #planned.events > 0 }, events = planned.events }, nil
        end, deadline)
    if err then return nil, err end
    return out :: types.ApplyResult, nil
end

-- publish_meta refreshes the catalog's public counts after a change to proposal
-- rows, which live outside the projection.
local function publish_meta(catalog_id: string): error?
    local _, err = funcs.call("kickside.pim.persist:publish_meta", { thread_id = catalog_id,proposal_only=true })
    return err
end

-- propose(catalog_id, { items, source?, origin? }) stores a proposal; needs READ.
function M.propose(catalog_id: string, request: types.ProposeRequest): (types.ProposeResult?, error?)
    local access_err = require_access(catalog_id, component.ACCESS.READ)
    if access_err then return nil, access_err end
    if #request.items == 0 then return nil, invalid("items required") end
    if #request.items > consts.LIMITS.items then return nil, invalid("too many items") end
    local settings,serr=defaults.read()
    if serr or not settings then return nil,serr end
    local base,err=store.with_db(function(db): ({[string]:integer}?,error?)
        local catalog,cerr=store.catalog(db,catalog_id)
        if cerr or not catalog then return nil,cerr or errors.new({kind=errors.NOT_FOUND,message="catalog has no schema",details={code="catalog_not_found"}}) end
        if request.source and not catalog.compiled.sources[request.source] then return nil,failure.unknown_source(request.source) end
        local effective=policy.effective(settings,catalog.compiled.policy)
        if #values.canonical(request)>effective.proposal_bytes then return nil,invalid("proposal exceeds configured byte budget",{code="proposal_budget_exceeded"}) end
        local base,berr=proposals.base(db,catalog,request)
        if berr or not base then return nil,berr end
        local planned,perr=items.plan(db,catalog,proposals.plan_request(request,base),actor_id(),settings)
        if perr or not planned then return nil,perr end
        if not planned.ok then return nil,invalid("proposal items are invalid at the catalog head",{outcomes=planned.outcomes :: {types.JsonObject}}) end
        return base,nil
    end)
    if err or not base then return nil,err end
    local id, ierr = store.transaction("proposal admission",function(tx: types.Executor,dialect: string): (string?,error?)
        local current,cerr=store.catalog(tx,catalog_id,dialect)
        if cerr then return nil,cerr end
        if not current then return nil,errors.new({kind=errors.NOT_FOUND,retryable=false,message="catalog was deleted",details={code="catalog_not_found"}}) end
        local count,qerr=store.count(tx,"SELECT COUNT(*) AS n FROM kickside_pim_proposal WHERE catalog_id=$1",{catalog_id},"proposal quota")
        if qerr then return nil,qerr end
        local effective=policy.effective(settings,current.compiled.policy)
        if #values.canonical(request)>effective.proposal_bytes then return nil,invalid("proposal exceeds configured byte budget",{code="proposal_budget_exceeded"}) end
        if (count :: integer)>=effective.proposal_count then return nil,invalid("catalog proposal quota reached",{code="proposal_limit"}) end
        return proposal_rows.insert(tx,catalog_id,request,base,actor_id())
    end)
    if ierr or not id then return nil, ierr end
    local merr = publish_meta(catalog_id)
    if merr then return nil, merr end
    return { proposal_id = id, status = "pending" }, nil
end

-- settled maps an accepted proposal's apply result to its final status:
-- accepted when applied, conflict when only stale versions stopped it (the
-- proposal can be decided again), failed when an item is refused outright.
local function settled(applied: types.ApplyResult): string
    if applied.applied then return "accepted" end
    for _, o in ipairs(applied.outcomes) do
        local kind = o.outcome
        if kind ~= "conflict" and kind ~= "created" and kind ~= "updated" and kind ~= "unchanged" then return "failed" end
    end
    return "conflict"
end

-- decide(catalog_id, { proposal_id, decision = accept | reject }) needs WRITE.
-- Accept first claims the proposal (accepting), applies it expecting its base
-- versions under the idempotency key proposal/<id>, then settles accepted,
-- conflict or failed; reject only decides a pending or conflicted proposal. A decision
-- that loses to another returns the stored one.
function M.decide(catalog_id: string, request: types.DecideRequest): (types.DecideResult?, error?)
    local access_err = require_access(catalog_id, component.ACCESS.WRITE)
    if access_err then return nil, access_err end
    if request.decision ~= "accept" and request.decision ~= "reject" then return nil, invalid("decision is accept or reject") end
    type PreparedDecision={proposal: types.Proposal,accept: boolean,changed: boolean}
    local prepared,err=store.with_db(function(db): (PreparedDecision?,error?)
        local proposal,perr=proposal_rows.get(db,catalog_id,request.proposal_id)
        if perr or not proposal then return nil,perr or errors.new({kind=errors.NOT_FOUND,message="proposal not found",details={code="proposal_not_found"}}) end
        local moved,merr=proposal_rows.transition(db,catalog_id,proposal.proposal_id,
            request.decision=="reject" and {"pending","conflict"} or {"pending","conflict","accepting"},
            request.decision=="reject" and "rejected" or "accepting",nil,actor_id())
        if merr then return nil,merr end
        if moved then
            proposal.status=request.decision=="reject" and "rejected" or "accepting"
            return {proposal=proposal,accept=request.decision=="accept",changed=true},nil
        end
        local stored,serr=proposal_rows.get(db,catalog_id,proposal.proposal_id)
        if serr or not stored then return nil,serr or errors.new({kind=errors.NOT_FOUND,message="proposal not found",details={code="proposal_not_found"}}) end
        if stored.status=="accepting" or (stored.status~="rejected" and request.decision=="reject") then
            return nil,errors.new({kind=errors.CONFLICT,message="proposal is "..stored.status,details={code="proposal_decided",status=stored.status}})
        end
        return {proposal=stored,accept=false,changed=false},nil
    end)
    if err or not prepared then return nil,err end
    local proposal=prepared.proposal
    if not prepared.accept then
        if prepared.changed then local merr=publish_meta(catalog_id);if merr then return nil,merr end end
        return {proposal_id=proposal.proposal_id,status=proposal.status,result=proposal.result},nil
    end
    local applied,aerr=M.apply(catalog_id,proposals.accept_request(proposal,request.trace_context))
    if aerr or not applied then return nil,aerr end
    local status=settled(applied)
    local _,serr=store.with_db(function(db): (boolean?,error?)
        return proposal_rows.transition(db,catalog_id,proposal.proposal_id,{"accepting"},status,applied,actor_id())
    end)
    if serr then return nil,serr end
    local merr=publish_meta(catalog_id)
    if merr then return nil,merr end
    return {proposal_id=proposal.proposal_id,status=status,result=applied},nil
end

-- rebuild(catalog_id) wakes the catalog's rebuild slot, parked after a failed
-- run, so it resumes from its cursor. Needs ADMIN.
function M.rebuild(catalog_id: string): (types.RebuildResult?, error?)
    local access_err = require_access(catalog_id, component.ACCESS.ADMIN)
    if access_err then return nil, access_err end
    local catalog,err=store.with_db(function(db): (types.Catalog?,error?) return store.catalog(db,catalog_id) end)
    if err then return nil,err end
    if not catalog or catalog.rebuild_after == nil or not catalog.rebuild_job then return { rebuilding = false }, nil end
    local _, werr = jobs.wake_job(catalog.rebuild_job :: string, { control = true, ensure_due = true })
    if werr then return nil, errors.wrap(werr, "rebuild wake failed") end
    return { rebuilding = true }, nil
end

-- release(catalog_id, { items = [{ product, expect_version, channels? }], idempotency? })
function M.release(catalog_id: string, request: types.ReleaseRequest, deadline: clock.Deadline?): (types.ApplyResult?, error?)
    local out, err = run_plan(catalog_id, request, "release", releases.release, deadline)
    if err or not out then return nil, err end
    for _, outcome in ipairs(out.outcomes) do
        if outcome.request_id then
            local task,terr=store.with_db(function(db): (release_jobs.Task?,error?) return release_jobs.get(db,catalog_id,outcome.request_id :: string) end)
            if terr then return nil,terr end
            outcome.job_id = (task :: release_jobs.Task).job_id
        end
    end
    return out, nil
end

-- withdraw(catalog_id, { items = [{ product, channels? }], idempotency? })
function M.withdraw(catalog_id: string, request: types.ReleaseRequest): (types.ApplyResult?, error?)
    return run_plan(catalog_id, request, "withdraw", releases.withdraw)
end

return M
