-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ctx = require("ctx")
local templates = require("templates")
local projection = require("projection")

local function publication_error(): error?
    if ctx.get("mail_test_projection_error") then
        return errors.new({kind = errors.INTERNAL, message = "Injected publication failure",
            details = {code = "fixture_publication_error"}})
    end
    return nil
end

local function reconcile()
    local failure = publication_error()
    if failure then return nil, failure end
    return projection.reconcile()
end

local function publish(tx)
    local failure = publication_error()
    if failure then return nil, failure end
    local published, err = projection.publish(tx)
    if err then return nil, err end
    local name = ctx.get("mail_test_commit_error")
    if name then
        local set = assert(templates.get("kickside.mail.views:templates"))
        local value = assert(set:render("part/" .. name, {}))
        assert(set:release())
        assert(value == "New HTML")
        assert(tx:execute("INSERT INTO mail_test_commit_child (id) VALUES (1)"))
    end
    return published, nil
end

return {check_shadow = projection.check_shadow, reconcile = reconcile, publish = publish}
