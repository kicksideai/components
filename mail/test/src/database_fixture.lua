-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")

local function with_db(work)
    local db = assert(sql.get("app:db"))
    local value, err = work(db, assert(db:type()))
    assert(db:release())
    return value, err
end

local function with_tx(work)
    return with_db(function(db, dialect)
        local tx = assert(db:begin())
        local value, err = work(tx, dialect)
        if err then
            assert(tx:rollback())
            return nil, err
        end
        assert(tx:commit())
        return value
    end)
end

return {with_db = with_db, with_tx = with_tx}
