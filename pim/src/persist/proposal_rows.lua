-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Proposal rows: stored commands and their decisions.
local uuid = require("uuid")
local failure = require("failure")
local store = require("store")
local narrow = require("narrow")
local values = require("values")
local clock = require("clock")
local sql = require("sql")
local types = require("types")

local M = {}


function M.insert(db: types.Executor, catalog_id: string, request: types.ProposeRequest, base: types.ProposalBase, actor: string): (string?, error?)
    local id = uuid.v7() :: string
    local _, err = db:execute([[INSERT INTO kickside_pim_proposal (catalog_id, proposal_id, source, origin, items, base, status,
        result, created_by, created_at, decided_by, decided_at) VALUES ($1, $2, $3, $4, $5, $6, 'pending', NULL, $7, $8, NULL, NULL)]],
        { catalog_id, id, request.source or sql.NULL, values.canonical({ type = request.origin and request.origin.type, id = request.origin and request.origin.id, provenance = request.provenance }), values.canonical(request.items),
            values.canonical(base), actor, clock.now() })
    if err then return nil, errors.wrap(err, "proposal write failed") end
    return id, nil
end

local function row(r: types.Row): (types.Proposal?, error?)
    local decoded, err = store.decode_row(r, { proposal_id = "text", status = "text", created_by = "text", created_at = "text",
        origin = "json", items = "json", base = "json", result = "json?" })
    if err or not decoded then return nil, err end
    r = decoded
    local origin: types.JsonObject = r.origin :: types.JsonObject
    local items: { types.ApplyItem } = r.items :: { types.ApplyItem }
    local base = r.base :: types.Row
    local generation, gerr = store.need_int(base, "generation")
    if gerr or not generation then return nil, gerr end
    if type(base.versions) ~= "table" then return nil, failure.corrupt("proposal base lacks versions", "base") end
    local result: types.ApplyResult? = r.result :: types.ApplyResult?
    return { proposal_id = r.proposal_id :: string, source = narrow.text(r.source), origin = origin, items = items,
        base = base.versions :: { [string]: integer }, generation = generation,
        status = r.status :: string, result = result, created_by = r.created_by :: string, created_at = r.created_at :: string,
        decided_by = narrow.text(r.decided_by), decided_at = narrow.text(r.decided_at) } , nil
end

function M.get(db: types.Executor, catalog_id: string, proposal_id: string): (types.Proposal?, error?)
    local rows, err = db:query("SELECT * FROM kickside_pim_proposal WHERE catalog_id = $1 AND proposal_id = $2", { catalog_id, proposal_id })
    if err then return nil, errors.wrap(err, "proposal read failed") end
    if not rows or not rows[1] then return nil, nil end
    return row(rows[1])
end

function M.list(db: types.Executor, catalog_id: string, status: string?, limit: integer, after: types.ProposalCursor?): ({ types.Proposal }?, error?)
    local where = "catalog_id = $1"
    local params: types.SqlParams = { catalog_id }
    if status then
        params[#params + 1] = status
        where = where .. " AND status = $" .. #params
    end
    if after then
        local n = #params
        params[n + 1], params[n + 2] = after.created_at, after.proposal_id
        where = where .. " AND (created_at > $" .. (n + 1) .. " OR (created_at = $" .. (n + 1) .. " AND proposal_id > $" .. (n + 2) .. "))"
    end
    params[#params + 1] = limit
    local rows, err = db:query("SELECT * FROM kickside_pim_proposal WHERE " .. where .. " ORDER BY created_at, proposal_id LIMIT $" .. #params, params)
    if err then return nil, errors.wrap(err, "proposal list failed") end
    local out: { types.Proposal } = {}
    for _, r in ipairs(rows or {}) do
        local p, derr = row(r)
        if derr or not p then return nil, derr end
        out[#out + 1] = p
    end
    return out, nil
end

-- transition moves a proposal from one of the listed states to status; it
-- returns false when the proposal was in another state (decided concurrently).
function M.transition(db: types.Executor, catalog_id: string, proposal_id: string, from: { string }, status: string,
    result: types.ApplyResult?, actor: string, at: string?, claimed_at: string?): (boolean?, error?)
    local marks: { string } = {}
    local params: types.SqlParams = { status, result and values.canonical(result) or sql.NULL, actor, at or clock.now(), catalog_id, proposal_id }
    for _, s in ipairs(from) do
        params[#params + 1] = s
        marks[#marks + 1] = "$" .. #params
    end
    local owned = ""
    if claimed_at then
        params[#params + 1] = claimed_at
        owned = " AND decided_by = $3 AND decided_at = $" .. #params
    end
    local out, err = db:execute([[UPDATE kickside_pim_proposal SET status = $1, result = $2, decided_by = $3, decided_at = $4
        WHERE catalog_id = $5 AND proposal_id = $6 AND status IN (]] .. table.concat(marks, ", ") .. ")" .. owned, params)
    if err then return nil, errors.wrap(err, "proposal decision write failed") end
    return (math.tointeger(tonumber(out and out.rows_affected)) or 0) == 1, nil
end

-- Only undo the matching claim while the command has no completed receipt.
-- The caller holds the same catalog lock as the receipt fold.
function M.release_claim(db: types.Executor, catalog_id: string, proposal_id: string, actor: string, claimed_at: string,
    marker: string, prior: types.Proposal?): (boolean?, error?)
    local out, err = db:execute([[UPDATE kickside_pim_proposal SET status = $1, result = $2, decided_by = $3, decided_at = $4
        WHERE catalog_id = $5 AND proposal_id = $6 AND status = 'accepting' AND decided_by = $7 AND decided_at = $8
        AND NOT EXISTS (SELECT 1 FROM kickside_pim_receipt WHERE catalog_id = $5 AND marker = $9 AND (event_count > 0 OR noop = 1))]],
        { prior and prior.status or "pending", prior and prior.result and values.canonical(prior.result) or sql.NULL,
            prior and prior.decided_by or sql.NULL, prior and prior.decided_at or sql.NULL, catalog_id, proposal_id, actor, claimed_at, marker })
    if err then return nil, errors.wrap(err, "proposal claim release failed") end
    return (math.tointeger(tonumber(out and out.rows_affected)) or 0) == 1, nil
end

return M
