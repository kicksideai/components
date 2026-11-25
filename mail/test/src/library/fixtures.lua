-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local database = require("database")
local funcs = require("funcs")
local client = require("client")
local contract = require("contract")
local registry = require("registry")
local time = require("time")
local json = require("json")
local api_fixtures = require("api_fixtures")
local autoinit = require("autoinit")
local jet = require("jet")

local function library_component_id()
    return autoinit.component_id(autoinit.SYSTEM_SCOPE_KEY, "kickside.mail.library")
end

local function mail_hook(kind)
    local id
    for _, entry in ipairs(assert(registry.find({[".kind"] = "function.lua", ["meta.type"] = kind}))) do
        if entry.id:match("^kickside%.mail[.:]") then
            assert(not id, "Multiple Mail hooks for " .. kind)
            id = entry.id
        end
    end
    return assert(id, "Missing Mail hook for " .. kind)
end

local function retention_id()
    return mail_hook("kickside.retention.owner")
end

local function boot(executor)
    return (executor or funcs.new()):call(mail_hook("bootloader"))
end

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
    await_live(rows[1] and rows[1].template_seq or 0)
end

local function sync_job(seq, after_id)
    local jobs = assert(database.with_db(function(ex)
        return ex:query([[SELECT id,job_type,payload,attempts,execution_seq,last_error,status FROM kickside_job
            WHERE owner_kind=$1 AND owner_id=$2 ORDER BY created_at,id]], {"mail-library", library_component_id()})
    end))
    for _, job in ipairs(jobs) do
        local payload = assert(json.decode(job.payload))
        if payload.seq == seq and job.id ~= after_id then return job end
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
            local jobs, err = ex:query([[SELECT id FROM kickside_job WHERE owner_kind=$1 AND owner_id=$2
                AND status IN ('pending','running') LIMIT 1]], {"mail-library", library_component_id()})
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
            assert(tx:execute("DELETE FROM mail_library_history WHERE kind=$1 AND name=$2", {key.kind, key.name}))
            if key.kind == "asset" then
                local args = {key.name}
                assert(tx:execute("DELETE FROM mail_library_asset WHERE name=$1", args))
                assert(tx:execute("UPDATE mail_library_upload_ref SET live=FALSE WHERE asset=$1", args))
            else
                local args = {key.kind, key.name}
                assert(tx:execute("DELETE FROM mail_library_reference WHERE from_kind=$1 AND from_name=$2", args))
                assert(tx:execute("DELETE FROM mail_library WHERE kind=$1 AND name=$2", args))
            end
        end
        return true, nil
    end))
    local overlay = assert(registry.overlay(jet.owner))
    for _, entry in ipairs(assert(overlay:entries())) do
        if entry.id == "kickside.mail.projection:marker" then
            local changes = overlay:changes()
            assert(changes:delete(entry.id))
            assert(changes:apply())
            break
        end
    end
    local result = assert(boot())
    assert(result.status == "success", result.message)
    await_current_live()
end

local INVOKE = "app.mail_library:invoke"
local editor_session

local function editor()
    editor_session = editor_session or api_fixtures.session("editor")
    return assert(funcs.new():with_actor(editor_session.actor):with_scope(editor_session.scope))
end

local function invoke(input)
    local library, err = client.library()
    if err then return nil, err end
    return library[input.method](library, input.args)
end

local function call(executor, method, args)
    return (executor or editor()):call(INVOKE, {method = method, args = args})
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
    if not executor and method == "preview" then executor = editor() end
    return (executor or funcs.new()):call("app.mail_library:invoke_mailer", {method = method, args = args})
end

local function render(executor, input)
    await_current_live()
    return mailer(executor, "preview", input)
end

local function foreign_list(input)
    local definition, lookup_err = contract.get("kickside.mail:library")
    if lookup_err then return nil, lookup_err end
    local library, open_err = definition:open()
    if open_err then return nil, open_err end
    return library:list(input)
end

return {sync_job = sync_job, await_current_live = await_current_live, await_sync_idle = await_sync_idle, await_live = await_live, await_sync_failure = await_sync_failure, await = await, remove = remove, invoke = invoke, call = call, async = async, editor = editor, foreign_list = foreign_list,
    render = render, mailer = mailer, invoke_mailer = invoke_mailer,
    library_component_id = library_component_id, retention_id = retention_id, boot = boot}
