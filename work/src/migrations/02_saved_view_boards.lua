-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local component = require("component")
local migration_api = require("migration")

local VIEW = "kickside.work.binding:view"
local PAGE_SIZE = 100

local function backfill_page(_db: unknown, after: string?): string?
    local rows, read_err = component.list_system({
        impl_ids = { VIEW },
        after_component_id = after,
        order_by = { field = "component_id", direction = "ASC" },
        include = { meta = true, private_context = true },
        limit = PAGE_SIZE,
    })
    if read_err then error(read_err) end
    assert(rows, "saved view migration received no Component page")
    for _, row in ipairs(rows) do
        -- Personal views have no board parent. The private context is authoritative.
        local board_id = row.private_context and row.private_context.board_id
        if type(board_id) == "string" and board_id ~= "" and (not row.meta or row.meta.board_id ~= board_id) then
            local updated, write_err = component.set_meta(row.component_id, { board_id = board_id }, { trusted_runtime = true })
            if not updated and not errors.is(write_err, errors.NOT_FOUND) then
                error(write_err or "saved view migration received no Component update result")
            end
        end
    end
    if #rows == PAGE_SIZE then return rows[#rows].component_id end
    return nil
end

return migration_api.define(function()
    migration("02 saved view boards", function()
        for _, dialect in ipairs({ "sqlite", "postgres" }) do
            database(dialect, function()
                -- Component owns its write transaction. The runner checkpoints each committed page.
                up(backfill_page, "external_batch")
                -- Older Work versions can read views with the extra metadata.
                down(function() end)
            end)
        end
    end)
end)
