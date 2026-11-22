-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local store = require("store")
local pipeline = require("pipeline")
local writer = require("writer")
local types = require("types")
local M = {}
type Attempt = pipeline.Attempt
M.Attempt = Attempt
M.marker = pipeline.marker
M.apply_fingerprint = pipeline.apply_fingerprint
local catalog_id = ""
local generation_changes = false
local revocation: { [string]: unknown }? = nil
local revocation_timing = ""
local guarded_request: types.ApplyRequest? = nil
local interruption: string? = nil
function M.configure(id: string, changed: boolean)
    catalog_id, generation_changes, revocation = id, changed, nil
end
function M.revoke_source(id: string, declaration: { [string]: unknown }, timing: string)
    catalog_id, revocation, revocation_timing = id, declaration, timing
end
function M.interleave_guarded_receipt(id: string, request: types.ApplyRequest)
    catalog_id, guarded_request, revocation = id, request, nil
end

function M.interrupt_command(phase: string)
    interruption = phase
end

function M.run(command: pipeline.Command): (unknown, error?)
    local phase = interruption
    if phase then
        interruption = nil
        local client = command.client
        local appended = false
        local interrupted = errors.new({ kind = errors.UNAVAILABLE, message = "interrupted proposal command" })
        command.client = {
            append_events = function(_, request)
                if phase == "append" then return nil, interrupted end
                local out, err = client:append_events(request)
                appended = out ~= nil and err == nil
                return out, err
            end,
            catch_up_projection = function(_, request)
                if appended then return nil, interrupted end
                return client:catch_up_projection(request)
            end,
        }
        return pipeline.run(command)
    end
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
            local build = command.build
            local revoked = false
            command.build = function(seq)
                local attempt, err = build(seq)
                if attempt and not revoked then
                    revoke()
                    revoked = true
                end
                return attempt, err
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
    local client = command.client
    local first = true
    command.client = {
        append_events = function(_, request)
            if not first then return client:append_events(request) end
            first = false
            if generation_changes then
                local changed = assert(writer.apply_schema(catalog_id, { declaration = { aspects = {
                    { namespace = "ids", attributes = {
                        { code = "code", type = "app:code_type", index = "key", config = { length = 3 } },
                    } },
                } } }))
                assert(changed.generation > 2)
            end
            return nil, errors.new({ kind = errors.CONFLICT, message = "injected head mismatch", details = { reason = "head_mismatch" } })
        end,
        catch_up_projection = function(_, request)
            return client:catch_up_projection(request)
        end,
    }
    return pipeline.run(command)
end
return M
