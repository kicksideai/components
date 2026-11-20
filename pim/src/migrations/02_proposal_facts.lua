-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local migration_api = require("migration")
local pipeline = require("pipeline")
local proposal_rows = require("proposal_rows")
local proposals = require("proposals")
local store = require("store")
local uuid = require("uuid")
local values = require("values")

local POSTGRES_INPUT = [[UPDATE kickside_projection AS p
    SET body = jsonb_set(p.body, '{events,input}', (p.body #> '{events,input}') ||
        jsonb_build_array(jsonb_build_object('type', CAST($1 AS text), 'via', 'thread')))
    WHERE p.kind = 'kickside.pim:catalog_model'
        AND EXISTS (SELECT 1 FROM kickside_components AS c
            WHERE c.component_id = p.thread_id AND c.impl_id = 'kickside.pim.binding:catalog')
        AND jsonb_typeof(p.body #> '{events,input}') = 'array'
        AND p.body #> '{events,input,0}' IS NOT NULL
        AND NOT (p.body #> '{events,input}') @> jsonb_build_array(jsonb_build_object('type', CAST($1 AS text), 'via', 'thread'))]]

local SQLITE_INPUT = [[UPDATE kickside_projection AS p
    SET body = json_insert(p.body, '$.events.input[#]', json_object('type', $1, 'via', 'thread'))
    WHERE p.kind = 'kickside.pim:catalog_model'
        AND EXISTS (SELECT 1 FROM kickside_components AS c
            WHERE c.component_id = p.thread_id AND c.impl_id = 'kickside.pim.binding:catalog')
        AND json_type(p.body, '$.events.input') = 'array'
        AND json_array_length(p.body, '$.events.input') > 0
        AND NOT EXISTS (SELECT 1 FROM json_each(p.body, '$.events.input') AS i
            WHERE json_extract(p.body, i.fullkey || '.type') = $1
                AND json_extract(p.body, i.fullkey || '.via') = 'thread')]]

local function execute(db, statement, params)
    local _, err = db:execute(statement, params)
    if err then error(err) end
end

local function query(db, statement, params)
    local rows, err = db:query(statement, params)
    if err then error(err) end
    return rows or {}
end

local function decode(row, fields)
    local decoded, err = store.decode_row(row, fields)
    if err then error(err) end
    return assert(decoded)
end

local function accepted_result(result, seq, count, applied_seq, noop)
    assert(type(result) == "table" and result.applied == true and type(result.outcomes) == "table",
        "completed proposal receipt lacks a successful apply result")
    local last = not noop and (seq + count - 1) or nil
    return values.canonical(pipeline.stamp(result, last, math.max(applied_seq, last or seq), true))
end

local function recover(db, claim, proposal)
    local marker = pipeline.marker({ namespace = "proposal", key = proposal.proposal_id })
    local hashed = pipeline.request_hash(pipeline.apply_fingerprint(proposals.accept_request(proposal)))
    local receipt = query(db, [[SELECT result, first_seq, event_count, noop FROM kickside_pim_receipt
        WHERE catalog_id = $1 AND marker = $2 AND request_hash = $3 AND (event_count > 0 OR noop = 1)]],
        { claim.catalog_id, marker, hashed })[1]
    if receipt then
        local r = decode(receipt, { result = "json", first_seq = "int", event_count = "int", noop = "int" })
        return accepted_result(r.result, r.first_seq, r.event_count, claim.applied_seq, r.noop == 1)
    end
    -- The first inline event carries the receipt even if the prior runtime
    -- stopped after append. The ordinary projection fold will record it.
    local events = query(db, [[SELECT CAST(body AS text) AS body, seq FROM kickside_event WHERE thread_id = $1
        AND external_source = 'pim' AND external_id = $2 AND content_mode = 'inline' ORDER BY seq]],
        { claim.catalog_id, marker })
    for _, event in ipairs(events) do
        local e = decode(event, { body = "json", seq = "int" })
        local r = e.body.receipt
        if type(r) == "table" and r.marker == marker and r.request_hash == hashed then
            local count = math.tointeger(r.event_count)
            assert(count and count > 0 and r.noop == false, "durable proposal receipt lacks an event count")
            return accepted_result(r.result, e.seq, count, claim.applied_seq, false)
        end
    end
    return nil
end

local function reconcile(db, uuid_parameter)
    local claims = query(db, [[SELECT p.*, c.applied_seq FROM kickside_pim_proposal AS p
        JOIN kickside_pim_catalog AS c ON c.catalog_id = p.catalog_id WHERE p.status = 'accepting']])
    local catalogs = {}
    for _, row in ipairs(claims) do
        local claim = decode(row, { catalog_id = "text", applied_seq = "int" })
        local proposal, err = proposal_rows.decode(claim)
        if err then error(err) end
        local result = recover(db, claim, assert(proposal))
        if result then
            execute(db, [[UPDATE kickside_pim_proposal SET status = 'accepted', result = $1
                WHERE catalog_id = $2 AND proposal_id = $3 AND status = 'accepting']], { result, claim.catalog_id, proposal.proposal_id })
        else
            execute(db, [[UPDATE kickside_pim_proposal SET status = 'pending', result = NULL, decided_by = NULL, decided_at = NULL
                WHERE catalog_id = $1 AND proposal_id = $2 AND status = 'accepting']], { claim.catalog_id, proposal.proposal_id })
        end
        catalogs[claim.catalog_id] = true
    end
    for id in pairs(catalogs) do
        -- Same pending-only count as kickside.pim.persist:publish_meta.
        execute(db, [[INSERT INTO kickside_component_meta(meta_id, component_id, key, value)
            SELECT ]] .. uuid_parameter .. [[, component_id, 'pending_proposal_count', CAST((
                SELECT COUNT(*) FROM kickside_pim_proposal WHERE catalog_id = $3 AND status = 'pending') AS text)
            FROM kickside_components WHERE component_id = $2
            ON CONFLICT(component_id, key) DO UPDATE SET value = excluded.value]], { uuid.v7(), id, id })
    end
end

local function upgrade(db, input, uuid_parameter)
    -- Core treats absent and empty input lists as unfiltered.
    execute(db, input, { "kickside.pim.events:proposal.submitted" })
    execute(db, input, { "kickside.pim.events:proposal.decided" })
    reconcile(db, uuid_parameter)
end

return migration_api.define(function()
    migration("02 proposal facts", function()
        database("postgres", function()
            up(function(db) upgrade(db, POSTGRES_INPUT, "CAST($1 AS uuid)") end)
            -- Retain proposal decisions and the expanded filter on rollback.
            down(function() end)
        end)
        database("sqlite", function()
            up(function(db) upgrade(db, SQLITE_INPUT, "$1") end)
            down(function() end)
        end)
    end)
end)
