-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local database = require("database")
local funcs = require("funcs")
local client = require("client")
local contract = require("contract")
local store = require("store")

local function remove(keys)
    if #keys == 0 then return end
    assert(database.with_tx(function(tx)
        for _, key in ipairs(keys) do
            local err = store.remove(tx, key, true)
            if err then return nil, err end
        end
        return true, nil
    end))
    local result = assert(funcs.call("kickside.mail.jobs:reconcile"))
    assert(result.status == "success", result.message)
end

local INVOKE = "app.mail_library:invoke"

local function invoke(input)
    local library, err = client.library()
    if err then return nil, err end
    return library[input.method](library, input.args)
end

local function call(executor, method, args)
    return (executor or funcs.new()):call(INVOKE, {method = method, args = args})
end

local function async(executor, method, args)
    return executor:async(INVOKE, {method = method, args = args})
end

local function invoke_mailer(input)
    local mailer, err = client.mailer()
    if err then return nil, err end
    return mailer[input.method](mailer, input.args)
end

local function mailer(executor, method, args)
    return (executor or funcs.new()):call("app.mail_library:invoke_mailer", {method = method, args = args})
end

local function render(executor, input)
    return mailer(executor, "preview", input)
end

local function foreign_list(input)
    local definition, lookup_err = contract.get("kickside.mail:library")
    if lookup_err then return nil, lookup_err end
    local library, open_err = definition:open()
    if open_err then return nil, open_err end
    return library:list(input)
end

return {remove = remove, invoke = invoke, call = call, async = async, foreign_list = foreign_list,
    render = render, mailer = mailer, invoke_mailer = invoke_mailer}
