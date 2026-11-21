-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The adapter sends guarded subject batches in one Core thread transaction.
local domain = require("domain")
local M = {}

function M.writes(c: domain.ThreadClient, board_id: string, writes: { domain.Write }): (integer?, error?)
    local list: { { [string]: unknown } } = {}
    local heads: { [string]: integer } = {}
    for _, write in ipairs(writes) do
        if write.expect_head ~= nil then heads[write.thread_id or board_id] = write.expect_head end
    end
    local fenced: { [string]: { [string]: unknown } } = {}
    local advances: { [string]: { [string]: integer } } = {}
    local schema_checked: { [string]: boolean } = {}
    for _, write in ipairs(writes) do
        local thread = write.thread_id or board_id
        if heads[thread] ~= nil then
            -- The head fence covers every subject read from this projection position.
            local entry = fenced[thread]
            if not entry then
                entry = { thread_id = thread, events = {} :: { domain.Event }, expect = { head = heads[thread] } }
                fenced[thread] = entry
                list[#list + 1] = entry
            end
            local events = entry.events :: { domain.Event }
            for _, event in ipairs(write.events) do events[#events + 1] = event end
        else
            local batches: { { events: { domain.Event }, subject: string?, version: integer? } } = {}
            if write.guards then
                for _, event in ipairs(write.events) do
                    local batch = batches[#batches]
                    if not batch or batch.subject ~= event.subject then
                        batch = { events = {}, subject = event.subject, version = write.guards[event.subject] }
                        batches[#batches + 1] = batch
                    end
                    batch.events[#batch.events + 1] = event
                end
            else batches = { { events = write.events, subject = write.expect_subject, version = write.expect_version } } end
            advances[thread] = advances[thread] or {}
            local versions = advances[thread]
            for _, batch in ipairs(batches) do
                local expect: { [string]: unknown } = {}
                if batch.subject and batch.version ~= nil then
                    expect.subject, expect.version = batch.subject, batch.version + (versions[batch.subject] or 0)
                    if write.expect_schema_version ~= nil and not schema_checked[thread] and batch.subject == write.expect_subject then
                        -- Named transitions share the snapshot and are newly planned events.
                        -- Keyed attempts stamp fresh delivery identities after checking receipts.
                        expect.also = { subject = "schema", version = write.expect_schema_version }
                        schema_checked[thread] = true
                    end
                end
                for _, event in ipairs(batch.events) do versions[event.subject] = (versions[event.subject] or 0) + 1 end
                list[#list + 1] = { thread_id = thread, events = batch.events, expect = next(expect) and expect or nil }
            end
            if write.expect_schema_version ~= nil and not schema_checked[thread] then
                return nil, errors.new({ kind = errors.INTERNAL, message = "named transition has no item append guard" })
            end
        end
    end
    local out, err = c:append_events({ writes = list })
    if err then return nil, err end
    local appended = (out :: { writes: { { thread_id: string, max_seq: integer } } }).writes
    local top = 0
    for _, write in ipairs(appended) do
        if write.thread_id == board_id and write.max_seq > top then top = write.max_seq end
    end
    return top, nil
end

return M
