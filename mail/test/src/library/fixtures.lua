-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local database = require("database")
local funcs = require("funcs")
local client = require("client")
local contract = require("contract")
local repo = require("repo")
local files = require("files")
local registry = require("registry")
local time = require("time")
local json = require("json")

local function await(check, label)
    local deadline = time.now():add(8 * time.SECOND):unix_nano()
    repeat
        if check() then return end
        time.sleep("15ms")
    until time.now():unix_nano() >= deadline
    error(label, 2)
end

local function await_live(seq)
    if not seq then return end
    await(function()
        local entry = registry.get("kickside.mail.projection:marker")
        return entry and entry.data.seq >= seq
    end, "Live templates did not reach " .. seq)
end

local function await_current_live()
    local rows = assert(database.with_db(function(ex)
        return ex:query("SELECT template_seq FROM mail_library_live WHERE id=1")
    end))
    await_live(rows[1] and rows[1].template_seq)
end

local function sync_job(seq)
    local jobs = assert(database.with_db(function(ex)
        return ex:query("SELECT payload,attempts,last_error,status FROM kickside_job WHERE job_type=$1",
            {"kickside.mail.jobs:library_sync"})
    end))
    for _, job in ipairs(jobs) do
        local payload = assert(json.decode(job.payload))
        if payload.seq == seq then return job end
    end
    return nil
end

local function await_sync_failure(seq)
    await(function()
        local job = sync_job(seq)
        return job and job.last_error ~= nil
    end, "Library sync did not record the injected failure")
end

local function await_sync_idle()
    await(function()
        local ready, err = database.with_db(function(ex)
            local jobs, err = ex:query("SELECT id FROM kickside_job WHERE job_type=$1 AND status IN ('pending','running') LIMIT 1",
                {"kickside.mail.jobs:library_sync"})
            if err then return nil, err end
            return #jobs == 0, nil
        end)
        assert(not err, tostring(err))
        return ready
    end, "Library sync jobs did not settle")
end

local function remove(keys)
    if #keys == 0 then return end
    await_sync_idle()
    assert(database.with_tx(function(tx)
        for _, key in ipairs(keys) do
            if key.kind == "asset" then
                local released, err = repo.remove(tx, key, true)
                if err then return nil, err end
                local _, release_err = files.release(tx, released, time.now():unix_nano() // 1000000)
                if release_err then return nil, release_err end
            else
                local args = {key.kind, key.name}
                assert(tx:execute("DELETE FROM mail_library_reference WHERE from_kind=$1 AND from_name=$2", args))
                assert(tx:execute("DELETE FROM mail_library WHERE kind=$1 AND name=$2", args))
                assert(tx:execute("DELETE FROM mail_library_revision WHERE kind=$1 AND name=$2", args))
            end
        end
        return true, nil
    end))
    local overlay = assert(registry.overlay("kickside.mail.render:live"))
    local changes = overlay:changes()
    for _, entry in ipairs(assert(overlay:entries())) do
        if entry.id == "kickside.mail.projection:marker" then assert(changes:delete(entry.id)) end
    end
    assert(changes:apply())
    local boot = assert(funcs.call("kickside.mail.jobs:reconcile"))
    assert(boot.status == "success", boot.message)
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
    local value, err
    await(function()
        value, err = mailer(executor, "preview", input)
        return not err or (err:details() or {}).code ~= "mail_library_publishing"
    end, "Mail preview is still fenced")
    return value, err
end

local function foreign_list(input)
    local definition, lookup_err = contract.get("kickside.mail:library")
    if lookup_err then return nil, lookup_err end
    local library, open_err = definition:open()
    if open_err then return nil, open_err end
    return library:list(input)
end

return {sync_job = sync_job, await_current_live = await_current_live, await_sync_idle = await_sync_idle, await_live = await_live, await_sync_failure = await_sync_failure, await = await, remove = remove, invoke = invoke, call = call, async = async, foreign_list = foreign_list,
    render = render, mailer = mailer, invoke_mailer = invoke_mailer}
