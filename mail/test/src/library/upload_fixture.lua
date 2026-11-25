-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local funcs = require("funcs")
local security = require("security")
local uploads = require("uploads")
local upload_types = require("upload_types")
local database = require("database")

local function run(input)
    local actor = assert(security.actor())
    if input.cleanup then return uploads.purge_owner(actor:id()) end
    local owner = upload_types.component_id_for_owner(actor:id())
    local definition = assert(contract.get("kickside.component:component_service"))
    local components = assert(definition:open())
    local found = assert(components:query({component_ids = {owner}}))
    assert(found.success, tostring(found.error))
    if #found.components == 0 then
        local registered = assert(components:register({component_id = owner, impl_id = upload_types.IMPL}))
        assert(registered.success, tostring(registered.error))
    end
    local upload, err = uploads.store_file(actor:id(), input.bytes, "mark", #input.bytes, input.mime, "app:uploads")
    if err then return nil, err end
    return upload.uuid, nil
end

local function seed(actor, input)
    return assert(funcs.new():with_actor(actor)):call("app.mail_library:seed_upload", input)
end

local function store(actor, mime, bytes)
    return seed(actor, {mime = mime, bytes = bytes})
end

local function get(id)
    local rows = assert(database.with_db(function(db)
        return db:query("SELECT uuid,storage_path,actor_id,storage_state,size FROM kickside_uploads WHERE uuid=$1", {id})
    end))
    return rows[1]
end

local function cleanup(actor)
    local result = assert(seed(actor, {cleanup = true}))
    assert(result.success, tostring(result.error))
end

return {store = store, cleanup = cleanup, get = get, run = run}
