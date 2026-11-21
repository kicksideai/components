-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Plans release and withdraw commands (spec 9). Release evaluates each item at
-- the command head from product rows, and releases a
-- self-contained snapshot to every channel the item is ready for.
local hash = require("hash")
local uuid = require("uuid")
local consts = require("consts")
local store = require("store")
local evaluate = require("evaluate")
local checks = require("checks")
local snapshot = require("snapshot")
local links = require("links")
local values = require("values")
local types = require("types")

local execution_identity = require("execution_identity")

local M = {}

type Planned = { outcomes: { types.Outcome }, events: { types.Event } }
M.Planned = Planned

local EV = consts.EVENTS

local function load(db: types.Executor, catalog_id: string, ref: types.ProductRef?): (types.Product?, error?)
    if type(ref) ~= "table" then return nil, nil end
    local p: types.Product?
    local err: error?
    if type(ref.id) == "string" then p, err = store.product(db, catalog_id, ref.id)
    elseif type(ref.sku) == "string" then p, err = store.product_by_sku(db, catalog_id, ref.sku) end
    if err then return nil, err end
    if p and p.state ~= "live" then return nil, nil end
    return p, nil
end

local function terms(db: types.Executor, catalog_id: string, refs: { [string]: boolean }): ({ [string]: { [string]: string } }?, error?)
    local out: { [string]: { [string]: string } } = {}
    for ref in pairs(refs) do
        local vocabulary, code = ref:match("^([^:]+):(.+)$")
        if vocabulary and code then
            local t, err = store.term(db, catalog_id, vocabulary, code)
            if err then return nil, err end
            if t then out[ref] = t.labels end
        end
    end
    return out, nil
end

-- link_targets asks each link kind's owner to describe the ids a snapshot
-- carries, keyed kind:id; an id the owner no longer knows stays unlabelled.
-- Nothing is embedded when the snapshot carries no link.
local function link_targets(catalog_id: string, linked: { [string]: { [string]: boolean } }): ({ [string]: types.LinkTarget }?, error?)
    local kinds: { string } = {}
    for kind in pairs(linked) do kinds[#kinds + 1] = kind end
    if #kinds == 0 then return nil, nil end
    table.sort(kinds)
    local out: { [string]: types.LinkTarget } = {}
    for _, kind in ipairs(kinds) do
        local ids: { string } = {}
        for id in pairs(linked[kind]) do ids[#ids + 1] = id end
        table.sort(ids)
        local described, err = links.describe(kind, catalog_id, ids)
        if err or not described then return nil, err end
        for id, target in pairs(described) do out[kind .. ":" .. id] = target end
    end
    return out, nil
end

-- unknown_channel names the first requested channel the schema lacks.
local function channel_problem(compiled: types.Compiled, channels: { unknown }?): types.Finding?
    for _, code in ipairs(channels or {}) do
        if type(code) ~= "string" then
            return { code = "invalid_channel", message = "channel codes must be strings" }
        end
        if not (compiled.channels or {})[code] then
            return { code = "unknown_channel", message = "unknown channel " .. code }
        end
    end
    return nil
end

function M.release(db: types.Executor, catalog: types.Catalog, request: types.ReleaseRequest): (Planned?, error?)
    local compiled = catalog.compiled
    local outcomes: { types.Outcome } = {}
    local events: { types.Event } = {}
    local published: { [string]: { [string]: { release_id: string, hash: string } } } = {}
    for index, item in ipairs(request.items) do
        local outcome: types.Outcome
        local expected = type(item.expect_version) == "number" and math.tointeger(item.expect_version) or nil
        local p, err = load(db, catalog.catalog_id, item.product)
        if err then return nil, err end
        local problem = channel_problem(compiled, item.channels)
        if problem then
            outcome = { outcome = "invalid", product_id = p and p.product_id or nil, findings = { problem } }
        elseif not p then
            outcome = { outcome = "invalid", findings = { { message = "product not found" } } }
        elseif p.status ~= "active" then
            outcome = { outcome = "invalid", product_id = p.product_id, findings = { { message = "only active products are released",
                code = "inactive" } } }
        elseif expected == nil then
            outcome = { outcome = "conflict", product_id = p.product_id, version = p.version,
                findings = { { code = "invalid_version", message = "expect_version must be an integer" } } }
        elseif expected ~= p.version then
            outcome = { outcome = "conflict", product_id = p.product_id, version = p.version,
                findings = { { code = "version_conflict", message = "product changed" } } }
        elseif p.is_item ~= 1 then
            local identity, ierr = execution_identity.capture()
            if ierr or not identity then return nil, ierr :: error? end
            local request_id = uuid.v7() :: string
            events[#events + 1] = { type = EV.MODEL_RELEASE_REQUESTED, subject = "model-release:" .. p.product_id,
                body = { request_id = request_id, product_id = p.product_id, root = p.level == 0, identity = identity :: types.JsonObject, channels = item.channels } }
            outcome = { outcome = "queued", product_id = p.product_id, version = p.version, request_id = request_id }
        else
            local lineage, lerr = store.lineage(db, catalog.catalog_id, p)
            if lerr or not lineage then return nil, lerr end
            local view_wide = evaluate.checks(compiled, p, lineage, checks.run, "release")
            local ready: { string } = {}
            local blocked: { types.Finding } = {}
            local names: { string } = {}
            for id in pairs(compiled.channels or {}) do names[#names + 1] = id end
            table.sort(names)
            for _, id in ipairs(names) do
                local wanted = item.channels == nil
                for _, c in ipairs(item.channels or {}) do if c == id then wanted = true end end
                if wanted then
                    local findings = evaluate.channel(compiled, p, lineage, compiled.channels[id] :: types.Channel, view_wide)
                    if findings and #findings == 0 then ready[#ready + 1] = id
                    elseif findings then
                        for _, f in ipairs(findings) do
                            f.channel = id
                            blocked[#blocked + 1] = f
                        end
                    end
                end
            end
            if #ready == 0 then
                outcome = { outcome = "not_ready", product_id = p.product_id, version = p.version, findings = blocked }
            else
                local snap, refs, linked = snapshot.build(compiled, p, lineage)
                local labels, terr = terms(db, catalog.catalog_id, refs)
                if terr or not labels then return nil, terr end
                snap.terms = labels
                local described, lerr = link_targets(catalog.catalog_id, linked)
                if lerr then return nil, lerr end
                snap.links = described
                local text = values.canonical(snap)
                if #text > consts.LIMITS.snapshot_bytes then
                    outcome = { outcome = "invalid", product_id = p.product_id, findings = { { message = "release snapshot exceeds 512 KB" } } }
                else
                    local digest = tostring(hash.sha256(text))
                    local current = published[p.product_id]
                    if not current then
                        local publications, perr = db:query([[SELECT p.channel, p.release_id, r.hash
                            FROM kickside_pim_publication p JOIN kickside_pim_release r
                            ON r.catalog_id = p.catalog_id AND r.release_id = p.release_id
                            WHERE p.catalog_id = $1 AND p.product_id = $2 AND p.state = 'published']],
                            { catalog.catalog_id, p.product_id })
                        if perr then return nil, perr end
                        current = {}
                        for _, pub in ipairs(publications or {}) do
                            current[pub.channel :: string] = { release_id = pub.release_id :: string, hash = pub.hash :: string }
                        end
                        published[p.product_id] = current
                    end
                    local existing: string? = nil
                    for _, channel in ipairs(ready) do
                        local pub = current[channel]
                        if not pub or pub.hash ~= digest then
                            existing = nil
                            break
                        end
                        existing = existing or pub.release_id
                    end
                    local release_id = existing or uuid.v7() :: string
                    if not existing then
                        events[#events + 1] = { type = EV.PRODUCT_RELEASED, subject = "r:" .. p.product_id,
                            body = { product_id = p.product_id, release_id = release_id, version = p.version,
                                generation = catalog.generation, snapshot = snap, hash = digest, channels = ready } }
                        for _, channel in ipairs(ready) do
                            current[channel] = { release_id = release_id, hash = digest }
                        end
                    end
                    outcome = { outcome = existing and "unchanged" or "released", product_id = p.product_id, version = p.version,
                        findings = #blocked > 0 and blocked or nil }
                    outcome.release_id = release_id
                    outcome.hash = digest
                    outcome.channels = ready
                end
            end
        end
        outcome.index = index
        outcomes[index] = outcome
    end
    return { outcomes = outcomes, events = events }, nil
end

function M.withdraw(db: types.Executor, catalog: types.Catalog, request: types.ReleaseRequest): (Planned?, error?)
    local outcomes: { types.Outcome } = {}
    local events: { types.Event } = {}
    local publications: { [string]: { store.Publication } } = {}
    for index, item in ipairs(request.items) do
        local outcome: types.Outcome
        local p, err = load(db, catalog.catalog_id, item.product)
        if err then return nil, err end
        local problem = channel_problem(catalog.compiled, item.channels)
        if problem then
            outcome = { outcome = "invalid", product_id = p and p.product_id or nil, findings = { problem } }
        elseif not p then
            outcome = { outcome = "invalid", findings = { { message = "product not found" } } }
        else
            local rows = publications[p.product_id]
            if not rows then
                local loaded, derr = store.publications(db, catalog.catalog_id, p.product_id)
                if derr or not loaded then return nil, derr end
                rows = loaded
                publications[p.product_id] = rows
            end
            local channels: { string } = {}
            for _, d in ipairs(rows) do
                local wanted = item.channels == nil
                for _, c in ipairs(item.channels or {}) do if c == d.channel then wanted = true end end
                if wanted and d.state == "published" then
                    channels[#channels + 1] = d.channel
                    d.state = "withdrawn"
                end
            end
            if #channels == 0 then
                outcome = { outcome = "unchanged", product_id = p.product_id }
            else
                events[#events + 1] = { type = EV.PRODUCT_WITHDRAWN, subject = "r:" .. p.product_id,
                    body = { product_id = p.product_id, channels = channels } }
                outcome = { outcome = "withdrawn", product_id = p.product_id }
                outcome.channels = channels
            end
        end
        outcome.index = index
        outcomes[index] = outcome
    end
    return { outcomes = outcomes, events = events }, nil
end

return M
