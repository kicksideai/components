-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Publishes a catalog's public meta (counts, generation, rebuild state) on its
-- component after projection commits and when a rebuild finishes, so lists and
-- UIs render from component meta. The fold itself only writes PIM tables.
local component = require("component")
local funcs = require("funcs")
local store = require("store")
local narrow = require("narrow")
local jobs = require("jobs")
local types = require("types")

local M = {}

type Input = { thread_id: string?,projection_only: boolean?,proposal_only: boolean? }
type Published = { published: boolean }

function M.publish(input: Input): (Published?, error?)
    local catalog_id = input.thread_id
    if type(catalog_id) ~= "string" or catalog_id == "" then return { published = false }, nil end
    local db, err = store.open()
    if not db then return nil, err end
    local catalog, cerr = store.catalog(db, catalog_id)
    if cerr then return nil, store.release(db, cerr) end
    if not catalog then
        local rerr = store.release(db, nil)
        if rerr then return nil, rerr end
        return { published = false }, nil
    end
    local pending: integer?=nil
    local perr: error?=nil
    if not input.projection_only then
        pending,perr=store.count(db,"SELECT COUNT(*) AS n FROM kickside_pim_proposal WHERE catalog_id=$1 AND status='pending'",{catalog_id},"catalog count")
    end
    perr=store.release(db,perr)
    if perr then return nil,perr end
    local _, aerr = component.validate_access(catalog_id, component.ACCESS.READ)
    if aerr then return nil, aerr end
    -- A parked rebuild keeps its failure on the Jobs row; meta shows it until a run succeeds.
    local rebuild_error: string? = nil
    if catalog.rebuild_after ~= nil and catalog.rebuild_job then
        local job, jerr = jobs.get_job(catalog.rebuild_job :: string)
        if jerr then return nil, errors.wrap(jerr, "rebuild job read failed") end
        rebuild_error = job and narrow.text(job.last_error) or nil
    end
    local fields: {[string]:unknown}={ product_count = catalog.product_count, item_count = catalog.item_count,
        trashed_count = catalog.trashed_count, pending_proposal_count = pending, generation = catalog.generation,
        last_event_seq = catalog.applied_seq, status = catalog.rebuild_after ~= nil and "rebuilding" or "ready",
        rebuild_error = rebuild_error }
    if input.proposal_only then fields={pending_proposal_count=pending} end
    local ok,serr=component.set_meta(catalog_id,fields,{trusted_runtime=true})
    if not ok then return nil, serr or errors.new({ details = { code = "internal" }, kind = errors.INTERNAL, message = "catalog meta write returned no result" }) end
    return { published = true }, nil
end

-- after_commit is the projection's post-commit hook; it publishes under the
-- trusted meta policy of publish_meta.
function M.after_commit(input: Input): (Published?, error?)
    local out, err = funcs.call("kickside.pim.persist:publish_meta", {thread_id=input.thread_id,projection_only=true})
    if err then return nil, err end
    if type(out) ~= "table" or type((out :: { [string]: unknown }).published) ~= "boolean" then
        return nil, errors.new({ details = { code = "internal" }, kind = errors.INTERNAL, message = "publish_meta returned no result" })
    end
    return { published = (out :: { [string]: unknown }).published :: boolean }, nil
end

return M
