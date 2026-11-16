-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Planning and folding stay in an uncommitted transaction, so no worker can
-- observe the merge until the test explicitly issues the command.
local security = require("security")
local store = require("store")
local items = require("items")
local defaults = require("defaults")
local materializer = require("materializer")
local merge_rows = require("merge_rows")
local types = require("types")
local M = {}
function M.plan(catalog_id: string, source: string?): (unknown, error?)
    local db, err = store.open()
    if err or not db then return nil, err end
    local tx, terr = db:begin()
    if terr or not tx then db:release(); return nil, terr end
    local catalog, cerr = store.catalog(tx, catalog_id)
    local settings, serr = defaults.read()
    if cerr or serr or not catalog or not settings then tx:rollback(); db:release(); return nil, cerr or serr end
    local actor = assert(security.actor())
    local plan, perr = items.plan(tx, catalog, { source = source, items = { { term_merge = { vocabulary = "categories", from = "hiking", into = "footwear" } } } },
        actor:id(), settings)
    if perr or not plan then tx:rollback(); db:release(); return nil, perr end
    local events: { types.RawEvent } = {}
    for i, event in ipairs(plan.events) do
        event.body.actor, event.body.at = actor:id(), "2026-01-01T00:00:00Z"
        events[i] = { seq = catalog.applied_seq + i, type = event.type, body = event.body }
    end
    local folded, ferr = materializer.fold(tx, db:type(), catalog_id, events, catalog.applied_seq + #events, 20000)
    local pending, merr = merge_rows.get(tx, catalog_id, "categories", "hiking")
    local jobs, jerr = tx:query("SELECT status, max_attempts FROM kickside_job WHERE id = $1", { folded.jobs[1] })
    tx:rollback()
    db:release()
    if ferr or merr or jerr then return nil, ferr or merr or jerr end
    return { outcomes = plan.outcomes, pending = pending, jobs = jobs, folded = folded }, nil
end
return M
