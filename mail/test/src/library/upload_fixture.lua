-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry = require("registry")
local funcs = require("funcs")
local http = require("http_client")
local json = require("json")
local system = require("system")
local uuid = require("uuid")
local security = require("security")
local uploads = require("uploads")
local database = require("database")
local api_fixtures = require("api_fixtures")
local delivery_wait = require("delivery_wait")

local function purge()
    local actor = assert(security.actor())
    return uploads.purge_owner(actor:id())
end

local function store(actor, mime, bytes)
    local groups = actor:meta().security_groups
    local tokens = assert(security.token_store("kickside.users.security:tokens"))
    local token = assert(tokens:create(actor, api_fixtures.role_scope(groups), {expiration = "1m"}))
    tokens:close()
    local gateway = assert(system.supervisor.state("app:gateway"))
    local address = assert(gateway.details:match("^service listening on (127%.0%.0%.1:[1-9]%d*)$"))
    local endpoint = "http://" .. address .. "/api/uploads"
    local boundary = uuid.v4()
    local response, err = http.request("POST", endpoint, {
        headers = {Authorization = "Bearer " .. token, ["Content-Type"] = "multipart/form-data; boundary=" .. boundary},
        body = "--" .. boundary .. "\r\nContent-Disposition: form-data; name=\"file\"; filename=\"mark\"\r\n"
            .. "Content-Type: " .. mime .. "\r\n\r\n" .. bytes .. "\r\n--" .. boundary .. "--\r\n",
    })
    if err then return nil, err end
    assert(response.status_code == 200, response.body)
    local result = assert(json.decode(response.body))
    assert(result.success, response.body)
    local upload = delivery_wait.observe("uploads", "25s")(function()
        local status = assert(http.request("GET", endpoint .. "/" .. result.uuid, {
            headers = {Authorization = "Bearer " .. token},
        }))
        assert(status.status_code == 200, status.body)
        return assert(json.decode(status.body)).upload
    end, function(item) return item and (item.status == "completed" or item.status == "error") end)
    assert(upload and upload.status == "completed", upload and upload.error or "Uploads did not finish processing")
    return result.uuid, nil
end

local function get(id)
    local rows = assert(database.with_db(function(db)
        return db:query("SELECT uuid,storage_path,actor_id,storage_state,size FROM kickside_uploads WHERE uuid=$1", {id})
    end))
    return rows[1]
end

local function cleanup(actor)
    local executor = assert(funcs.new():with_actor(actor))
    local result = assert(executor:call("app.mail_library:purge_fixture_uploads"))
    assert(result.success, tostring(result.error))
end

local function use_empty_info()
    local id = "kickside.uploads:content_provider"
    local original = assert(registry.get(id))
    local fixture = assert(registry.get(id))
    fixture.data.contracts[1].methods.get_info = "app.mail_library:empty_upload_info"
    local changes = assert(registry.snapshot()):changes()
    assert(changes:update(fixture))
    assert(changes:apply())
    return function()
        local restore = assert(registry.snapshot()):changes()
        assert(restore:update(original))
        assert(restore:apply())
    end
end

local function empty_info()
    return {success = true, size = 0, content_type = "text/plain", filename = "mark"}
end

return {store = store, cleanup = cleanup, get = get, purge = purge,
    use_empty_info = use_empty_info, empty_info = empty_info}
