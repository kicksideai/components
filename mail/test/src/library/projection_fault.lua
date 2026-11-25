-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ctx = require("ctx")
local templates = require("templates")
local live = require("live")
local database = require("database")
local types = require("types")

local function publish(rows: {types.Resource}, originals: types.OriginalMap): (boolean?, error?)
    if ctx.get("mail_test_projection_error") then
        return nil, errors.new({kind = errors.INTERNAL, message = "Injected publication failure",
            details = {code = "fixture_publication_error"}})
    end
    return live.publish(rows, originals)
end

local function with_tx<T>(work: types.TransactionWork<T>): (T?, error?)
    return database.with_tx(function(tx: types.Transaction, dialect: string): (T?, error?)
        local value, err = work(tx, dialect)
        if err then return nil, err end
        local name = ctx.get("mail_test_commit_error")
        if name and type(value) == "table" then
            local set = assert(templates.get("kickside.mail.views:templates"))
            local markup = assert(set:render("part/" .. name, {}))
            assert(set:release())
            assert(markup == "New HTML")
            assert(tx:execute("INSERT INTO mail_test_commit_child (id) VALUES (1)"))
        end
        return value, nil
    end)
end

return {publish = publish, with_tx = with_tx}
