-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The pipeline delivers one head conflict, then builds at the winning head.
local store = require("store")
local values = require("values")
local pipeline = require("pipeline")
local writer = require("writer")
local types = require("types")
local M = {}
type Attempt = pipeline.Attempt
M.Attempt = Attempt
M.marker = pipeline.marker
local catalog_id = ""
local generation_changes = false
local revocation: { [string]: unknown }? = nil
local revocation_timing = ""
local guarded_request: types.ApplyRequest? = nil
function M.configure(id: string, changed: boolean)
    catalog_id, generation_changes, revocation = id, changed, nil
end
function M.revoke_source(id: string, declaration: { [string]: unknown }, timing: string)
    catalog_id, revocation, revocation_timing = id, declaration, timing
end
function M.interleave_guarded_receipt(id: string, request: types.ApplyRequest)
    catalog_id, guarded_request, revocation = id, request, nil
end

function M.run(command: pipeline.Command): (unknown, error?)
    local guarded = guarded_request
    if guarded then
        guarded_request = nil
        local read = assert(command.receipt)
        local first = true
        command.receipt = function(marker)
            local receipt, seq, err = read(marker)
            if first then
                first = false
                assert(not receipt and not seq and not err, "the duplicate must actually miss its first receipt read")
                local winner = assert(writer.apply(catalog_id, guarded))
                assert(winner.applied and winner.seq and not winner.replayed, "ordinary winner did not commit")
                local changed = assert(writer.apply_schema(catalog_id, { declaration = { vocabularies = { { code = "concurrent_schema" } } } }))
                assert(changed.generation == assert(guarded.expected_generation) + 1, "ordinary schema edit did not advance the generation")
            end
            return receipt, seq, err
        end
        return pipeline.run(command)
    end
    local declaration = revocation
    if declaration then
        local function revoke()
            assert(writer.apply_schema(catalog_id, { declaration = declaration }))
        end
        if revocation_timing == "before append" then
            local reserve = assert(command.reserve)
            local revoked = false
            command.reserve = function(marker, hashed, seq, at)
                local ok, err = reserve(marker, hashed, seq, at)
                if ok and not revoked then
                    revoke()
                    revoked = true
                end
                return ok, err
            end
        else
            if revocation_timing == "during conflict review" then
                local catalog = assert(store.with_db(function(db) return store.catalog(db, catalog_id) end))
                assert(command.build(catalog.applied_seq))
            end
            revoke()
        end
        return pipeline.run(command)
    end
    local db, err = store.open()
    if err or not db then return nil, err end
    local catalog, cerr = store.catalog(db, catalog_id)
    db:release()
    if cerr or not catalog then return nil, cerr end
    local first, ferr = command.build(catalog.applied_seq)
    if ferr or not first then return nil, ferr end
    if generation_changes then
        local compiled = catalog.compiled
        compiled.attributes["ids.code"].config.length = 3
        local next_db, nerr = store.open()
        if nerr or not next_db then return nil, nerr end
        local _, uerr = next_db:execute("UPDATE kickside_pim_catalog SET generation = generation + 1, compiled = $1 WHERE catalog_id = $2",
            { values.canonical(compiled), catalog_id })
        next_db:release()
        if uerr then return nil, uerr end
    end
    local second, serr = command.build(catalog.applied_seq + 1)
    if serr or not second then return nil, serr end
    return second.result, nil
end
return M
