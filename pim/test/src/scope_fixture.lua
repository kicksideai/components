-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local json = require("json")
local fixture = require("fixture")
local scoped = require("scoped")
type Map = { [string]: unknown }
local function data(reply: scoped.Reply, what: string): Map
    test.eq(reply.status, 200, what .. " " .. json.encode(reply.body))
    test.is_true(reply.body.success == true, what)
    return reply.body.data :: Map
end

local function denied(err: unknown, what: string)
    test.not_nil(err, what)
    test.eq((err :: error):kind(), errors.PERMISSION_DENIED, what .. ": " .. tostring(err))
end

local function grant(h: fixture.Handle, to: scoped.Session, mask: integer)
    local _, err = h.call("grant", { subject_id = to.id, mask = mask })
    assert(not err, tostring(err))
end

local function settle(h: fixture.Handle)
    local _, err = h.call("settle", {})
    test.is_nil(err, tostring(err))
end

-- owned boots a catalog as a new member and returns it with the session.
local function owned(): (fixture.Handle, scoped.Session)
    local owner = scoped.member()
    local h = scoped.catalog(owner)
    fixture.boot(h)
    settle(h)
    return h, owner
end


return { data = data, denied = denied, grant = grant, settle = settle, owned = owned }
