-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local security = require("security")
local registry = require("registry")
local json = require("json")
local uuid = require("uuid")
local sql = require("sql")
local fs = require("fs")
local uploads = require("uploads")
local artifacts = require("artifacts")
local contract = require("contract")
local upload_types = require("upload_types")
local M = {}

function M.caller(owner: string): any
    return funcs.new():with_actor(security.new_actor(owner, {}))
        :with_scope(security.new_scope({ assert(security.policy("app:user")) }))
end

function M.extractor(owner: string): string
    local config = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)).default
    return assert(M.caller(owner):call("app:probe", { op = "create", input = { title = "Fixture reader", config = config } })).component_id
end

-- File-state fixtures may deliberately omit original bytes, but admission still
-- requires the owner's declared Uploads component. Let the thread owner create
-- and converge it instead of fabricating component or access rows.
function M.upload_record(owner: string, mime: string, filename: string, size: number): string
    local definition, definition_err = contract.get("kickside.core:threads")
    assert(definition, tostring(definition_err))
    local threads, open_err = definition:with_actor(security.new_actor(owner, {}))
        :with_scope(security.new_scope({ assert(security.policy("app:user")) })):open()
    assert(threads, tostring(open_err))
    local initialized, init_err = threads:upsert({
        thread_id = upload_types.component_id_for_owner(owner),
        impl_id = upload_types.IMPL,
        thread_class = upload_types.CLASS,
    })
    assert(initialized, tostring(init_err))
    local id = uuid.v4()
    assert(uploads.create(id, owner, size, mime, "app:uploads", id, "generic", { filename = filename }, "completed"))
    return id
end

function M.upload(owner: string, mime: string, body: string, markdown: string?): string
    local id = M.upload_record(owner, mime, "document", #body)
    local storage = assert(fs.get("app:uploads"))
    local _, write_err = storage:writefile(id, body)
    assert(write_err == nil, tostring(write_err))
    if markdown then
        assert(artifacts.create_artifact({ upload_id = id, kind = "markdown", role = "primary", mime_type = "text/markdown",
            content = markdown, storage_id = "app:uploads" }))
    end
    return id
end

function M.execute(statement: string, params: any?): any
    local db = assert(sql.get("app:db"))
    local result, err = db:execute(statement, params or {})
    local _, release_err = db:release()
    assert(err == nil, tostring(err)); assert(release_err == nil, tostring(release_err))
    return result
end

return M
