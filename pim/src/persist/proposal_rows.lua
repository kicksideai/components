-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Proposal rows: stored commands and their decisions.
local store = require("store")
local narrow = require("narrow")
local values = require("values")
local sql = require("sql")
local types = require("types")

local M = {}


-- count stops at the quota. The catalog prefix of the primary key bounds this read.
function M.count(db: types.Executor, catalog_id: string, limit: integer): (integer?, error?)
    return store.count(db, [[SELECT COUNT(*) AS n FROM
        (SELECT 1 FROM kickside_pim_proposal WHERE catalog_id = $1 LIMIT $2) proposals]],
        { catalog_id, limit }, "proposal quota")
end

function M.submit(db: types.Executor, catalog_id: string, body: types.ProposalSubmittedBody): error?
    local origin: types.JsonObject = { type = body.origin and body.origin.type, id = body.origin and body.origin.id,
        provenance = body.provenance }
    local _, err = db:execute([[INSERT INTO kickside_pim_proposal (catalog_id, proposal_id, source, origin, items, base, generation,
        status, created_by, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', $8, $9)]],
        { catalog_id, body.proposal_id, body.source or sql.NULL, values.canonical(origin), values.canonical(body.items),
            values.canonical(body.base), body.generation, body.actor :: string, body.at :: string })
    if err then return errors.wrap(err, "proposal write failed") end
    return nil
end

local function decode(r: types.Row): (types.Proposal?, error?)
    local decoded, err = store.decode_row(r, { proposal_id = "text", status = "text", created_by = "text", created_at = "text",
        origin = "json", items = "json", base = "json", generation = "int", result = "json?" })
    if err or not decoded then return nil, err end
    r = decoded
    local origin: types.JsonObject = r.origin :: types.JsonObject
    local items: { types.ApplyItem } = r.items :: { types.ApplyItem }
    local result: types.ApplyResult? = r.result :: types.ApplyResult?
    return { proposal_id = r.proposal_id :: string, source = narrow.text(r.source), origin = origin, items = items,
        base = r.base :: { [string]: integer }, generation = r.generation :: integer,
        status = r.status :: string, result = result, created_by = r.created_by :: string, created_at = r.created_at :: string,
        decided_by = narrow.text(r.decided_by), decided_at = narrow.text(r.decided_at) } , nil
end

function M.get(db: types.Executor, catalog_id: string, proposal_id: string): (types.Proposal?, error?)
    local rows, err = db:query("SELECT * FROM kickside_pim_proposal WHERE catalog_id = $1 AND proposal_id = $2", { catalog_id, proposal_id })
    if err then return nil, errors.wrap(err, "proposal read failed") end
    if not rows or not rows[1] then return nil, nil end
    return decode(rows[1])
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
        local p, derr = decode(r)
        if derr or not p then return nil, derr end
        out[#out + 1] = p
    end
    return out, nil
end

-- A proposal can expire between command planning and folding its decision.
-- The fact is still retained by the thread. Only its inbox row has expired.
function M.decide(db: types.Executor, catalog_id: string, body: types.ProposalDecidedBody): error?
    local _, err = db:execute([[UPDATE kickside_pim_proposal SET status = $1, result = $2, decided_by = $3, decided_at = $4
        WHERE catalog_id = $5 AND proposal_id = $6]],
        { body.status, body.result and values.canonical(body.result) or sql.NULL,
            body.actor :: string, body.at :: string, catalog_id, body.proposal_id })
    if err then return errors.wrap(err, "proposal decision write failed") end
    return nil
end

return M
