-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Age range indexes include the full deterministic cleanup order.
local expiry = require("operation_expiry")
local INDEXES = {
    {"receipt_expiry", "receipt", "at", "at, command_key"},
    {"key_alias_expiry", "key_alias", "at", "at, key"},
    {"change_at", "change", "at", "at, seq, n"},
    {"interval_expiry", "interval", "ended_at", "ended_at, item_id, field_id, start_seq", " WHERE ended_at IS NOT NULL"},
    {"generation_expiry", "generation", "applied_at", "applied_at, generation"},
    {"item_generation", "item", "process_generation", "life, process_generation", nil, " WHERE life<>'purged'"},
    {"job_active", "job", "status", "status", nil, " WHERE status NOT IN ('done','failed')"},
}
local function execute(db, statement)
    local _, err = db:execute(statement,{})
    if err then error(errors.wrap(err,"Work age seek upgrade failed")) end
end
local function replace(db, name, table_name, keys, predicate)
    execute(db,"DROP INDEX kickside_work_" .. name)
    execute(db,"CREATE INDEX kickside_work_" .. name .. " ON kickside_work_" .. table_name .. " (board_id, " .. keys .. ")" .. (predicate or ""))
end
return require("migration").define(function()
    migration("06 age seeks",function()
        for _,dialect in ipairs({"sqlite","postgres"}) do
            database(dialect,function()
                up(function(db)
                    for _,index in ipairs(INDEXES) do replace(db,index[1],index[2],index[4],index[5]) end
                    replace(db,"operation_expiry","operation",expiry.at(dialect) .. ", operation_id"," WHERE " .. expiry.TERMINAL)
                end)
                down(function(db)
                    for _,index in ipairs(INDEXES) do replace(db,index[1],index[2],index[3],index[6] or index[5]) end
                    replace(db,"operation_expiry","operation",expiry.at(dialect)," WHERE " .. expiry.TERMINAL)
                end)
            end)
        end
    end)
end)
