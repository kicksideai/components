-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local access = require("access")
local clock = require("clock")
local consts = require("consts")
local evaluate = require("evaluate")
local limits = require("limits")
local projection_reader = require("projection_reader")
local read_model = require("read_model")
local reader = require("reader")
local store = require("store")
local time = require("time")
local types = require("types")
local waiters = require("waiters")

local M = {}

type Context = {
    catalog_id: string,
    request: types.WaitProductRequest,
    deadline: clock.Deadline,
    cursor: types.ChangesCursor,
    floor: integer,
    observed: integer,
    product_id: string?,
}
type ProjectionCursor = { id: string, status: string }
type Notice = { status: string, last_seq: integer? }
type Observation = types.ReadStamp & { product: types.WaitProductMatch? }

local function complete(tx: types.Executor, catalog: types.Catalog, product: types.Product, channel: string?, locale: string?): (boolean?, error?)
    local compiled = catalog.compiled
    local target = channel and compiled.channels[channel]
    if channel and not target then return nil, access.invalid("unknown channel " .. channel) end
    if locale then
        local known = false
        for _, dimension in ipairs(compiled.dimensions) do
            if dimension.name == "locale" then known = (dimension.member_set or {})[locale] == true end
        end
        if not known then return nil, access.invalid("unknown locale " .. locale) end
    end
    if product.is_item ~= 1 then return false, nil end
    local lineage, err = store.lineage(tx, catalog.catalog_id, product)
    if err or not lineage then return nil, err end
    if target then
        local findings = evaluate.channel(compiled, product, lineage, target, {})
        return findings ~= nil and #findings == 0, nil
    end
    return evaluate.locale_complete(compiled, product, lineage, locale :: string), nil
end

local function matches(tx: types.Executor, catalog: types.Catalog, product: types.Product, predicate: types.WaitPredicate): (boolean?, error?)
    if predicate.status then return product.status == predicate.status, nil end
    if predicate.complete then return complete(tx, catalog, product, predicate.complete.channel, predicate.complete.locale) end
    local pub = predicate.publication :: { channel: string, state: string }
    local state, err = read_model.publication_state(tx, catalog.catalog_id, product.product_id, pub.channel)
    if err then return nil, err end
    return state == pub.state, nil
end

local function observe(ctx: Context, caller: types.Reader): (types.WaitProductMatch?, error?)
    local observed, err = access.with_snapshot(caller, function(tx: types.Executor, catalog: types.Catalog, _: string): (Observation?, error?)
        if catalog.applied_seq <= ctx.observed or catalog.applied_seq < ctx.floor or clock.passed(ctx.deadline) then return {}, nil end
        local product, perr = reader.live_product(tx, ctx.catalog_id, ctx.product_id and { id = ctx.product_id } or ctx.request.product)
        if perr or not product then return nil, perr end
        ctx.product_id = product.product_id
        local matched, merr = matches(tx, catalog, product, ctx.request.predicate)
        if merr then return nil, merr end
        if not matched then return {}, nil end
        return { product = { product_id = product.product_id, sku = product.sku, status = product.status, version = product.version } }, nil
    end)
    if err or not observed then return nil, err end
    ctx.observed = observed.as_of :: integer
    if ctx.observed > ctx.cursor.seq then
        ctx.cursor = { seq = ctx.observed, product_id = ctx.product_id or "", expiry_floor = ctx.cursor.expiry_floor }
    end
    return observed.product, nil
end

local function projection_unavailable(): error
    return errors.new({ kind = errors.UNAVAILABLE, message = "PIM catalog projection is unavailable",
        details = { code = "pim_wait_projection_unavailable" }, retryable = true })
end

local function projection_id(catalog_id: string): (string?, error?)
    return store.with_db(function(db): (string?, error?)
        local pair, err = projection_reader.find_projection_cursor(db, catalog_id, { kind = consts.PROJECTION_KIND })
        if err then return nil, err end
        local cursor = pair and (pair :: { cursor: ProjectionCursor }).cursor
        if not cursor or cursor.status ~= "active" then return nil, projection_unavailable() end
        return cursor.id, nil
    end)
end

local function await_advance(waiter: table, observed: integer): (boolean?, error?)
    while true do
        local raw, timed_out, err = waiters.wait_until_reached(waiter)
        if err or timed_out then return nil, err end
        local notice = raw :: Notice
        if notice.status ~= "active" then return nil, projection_unavailable() end
        if notice.last_seq and notice.last_seq > observed then return true, nil end
    end
end

local function follow(ctx: Context): (types.WaitProductMatch?, error?)
    -- READ has already admitted the caller. Only resolve the backend address;
    -- the catalog's raw thread is separately gated.
    local id, err = projection_id(ctx.catalog_id)
    if err or not id then return nil, err end
    while not clock.passed(ctx.deadline) do
        local caller, access_err = access.reader(ctx.catalog_id)
        if access_err or not caller then return nil, access_err end
        local before = ctx.observed
        local ms = math.ceil((ctx.deadline.ns - time.now():unix_nano()) / time.MILLISECOND)
        if ms <= 0 then break end
        -- Register before reading so the snapshot or a notice covers every commit.
        local waiter, listen_err = waiters.begin_wait(id, before + 1, ms)
        if listen_err or not waiter then
            if clock.passed(ctx.deadline) then return nil, nil end
            return nil, listen_err
        end
        local product, read_err = observe(ctx, caller)
        local advanced, wait_err = true, nil
        if not product and not read_err and ctx.observed == before then
            advanced, wait_err = await_advance(waiter, before)
        end
        waiters.close_wait(waiter)
        if product or read_err then return product, read_err end
        if not advanced or wait_err then return nil, wait_err end
    end
    return nil, nil
end

function M.product(catalog_id: string, request: types.WaitProductRequest): (types.WaitProductResult?, error?)
    local deadline = clock.deadline(request.timeout_ms or limits.wait_default_ms)
    local caller, err = access.reader(catalog_id)
    if err or not caller then return nil, err end
    local cursor = request.cursor or { seq = 0, product_id = "" }
    local ctx: Context = { catalog_id = catalog_id, request = request, deadline = deadline, cursor = cursor,
        floor = math.max(cursor.seq, request.min_seq or 0), observed = -1 }
    local product, read_err = observe(ctx, caller)
    if not product and not read_err and not clock.passed(deadline) then product, read_err = follow(ctx) end
    if read_err then return nil, read_err end
    if product and not clock.passed(deadline) then return { status = "matched", cursor = ctx.cursor, product = product }, nil end
    return { status = "timed_out", cursor = ctx.cursor }, nil
end

return M
