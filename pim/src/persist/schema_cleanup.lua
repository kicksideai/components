-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Schema fan-out resumes from the rows left by each committed bounded page.
local cleanup_rows = require("cleanup_rows")
local types = require("types")
local M = {}
type Result = { rows: integer, more: boolean }

function M.pending(tx: types.Executor, catalog_id: string, seq: integer): error?
    local _, err = tx:execute([[INSERT INTO kickside_pim_schema_work (catalog_id, seq) VALUES ($1, $2)
        ON CONFLICT (catalog_id) DO UPDATE SET seq = excluded.seq]], { catalog_id, seq })
    return err
end
function M.complete(tx: types.Executor, catalog_id: string): error?
    local _, err = tx:execute("DELETE FROM kickside_pim_schema_work WHERE catalog_id = $1", { catalog_id })
    return err
end

function M.run(tx: types.Executor, catalog: types.Catalog, event: types.SchemaEvent, budget: integer): (Result?, error?)
    local before, after = catalog.compiled, event.body.compiled
    local catalog_id = catalog.catalog_id
    local spent = 0
    local function remove(name: string, keys: string, where: string, params: types.SqlParams): (boolean?, error?)
        local n, more, err = cleanup_rows.page(tx, name, keys, where, params, budget - spent)
        if err or not n then return nil, err end
        spent = spent + n
        return more, nil
    end
    local kept: { [integer]: boolean } = {}
    for _, attr in pairs(after.attributes) do kept[attr.id] = true end
    local removed: { integer } = {}
    for _, attr in pairs(before.attributes) do if not kept[attr.id] then removed[#removed + 1] = attr.id end end
    table.sort(removed)
    for _, id in ipairs(removed) do
        for _, t in ipairs({ { "kickside_pim_ref", "product_id, attribute_id, ctx, path" },
            { "kickside_pim_unique_value", "attribute_id, value_key" }, { "kickside_pim_attribute_usage", "attribute_id" } }) do
            local more, err = remove(t[1], t[2], "catalog_id = $1 AND attribute_id = $2", { catalog_id, id })
            if err then return nil, err end
            if more then return { rows = spent, more = true }, nil end
        end
    end
    local channels: { string } = {}
    for id in pairs(before.channels or {}) do if not (after.channels or {})[id] then channels[#channels + 1] = id end end
    table.sort(channels)
    for _, channel in ipairs(channels) do
        local remaining = budget - spent
        local rows, err = tx:query([[SELECT product_id FROM kickside_pim_publication WHERE catalog_id = $1 AND channel = $2
            AND state = 'published' ORDER BY product_id LIMIT $3]], { catalog_id, channel, math.max(remaining, 1) })
        if err then return nil, err end
        if remaining == 0 and #(rows or {}) > 0 then return { rows = spent, more = true }, nil end
        for _, row in ipairs(rows or {}) do
            local _, uerr = tx:execute([[UPDATE kickside_pim_publication SET state = 'withdrawn', seq = $1, updated_at = $2
                WHERE catalog_id = $3 AND channel = $4 AND product_id = $5]],
                { event.seq, event.body.at, catalog_id, channel, row.product_id })
            if uerr then return nil, uerr end
            spent = spent + 1
        end
        if #(rows or {}) == remaining and remaining > 0 then return { rows = spent, more = true }, nil end
    end
    local vocabularies: { string } = {}
    for code in pairs(before.vocabularies) do if not after.vocabularies[code] then vocabularies[#vocabularies + 1] = code end end
    table.sort(vocabularies)
    for _, code in ipairs(vocabularies) do
        for _, t in ipairs({ { "kickside_pim_term", "vocabulary, code" }, { "kickside_pim_merge", "vocabulary, from_code" } }) do
            local more, err = remove(t[1], t[2], "catalog_id = $1 AND vocabulary = $2", { catalog_id, code })
            if err then return nil, err end
            if more then return { rows = spent, more = true }, nil end
        end
    end
    return { rows = spent, more = false }, nil
end
return M
