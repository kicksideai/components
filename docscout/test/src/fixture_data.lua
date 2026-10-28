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
local M = {}

function M.caller(owner: string): any
    return funcs.new():with_actor(security.new_actor(owner, {}))
        :with_scope(security.new_scope({ assert(security.policy("app:user")) }))
end

function M.extractor(owner: string): string
    local config = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)).default
    return assert(M.caller(owner):call("app:probe", { op = "create", input = { title = "Fixture reader", config = config } })).component_id
end

function M.upload(owner: string, mime: string, body: string, markdown: string?): string
    local id = uuid.v4()
    local storage = assert(fs.get("app:uploads"))
    local _, write_err = storage:writefile(id, body)
    assert(write_err == nil, tostring(write_err))
    assert(uploads.create(id, owner, #body, mime, "app:uploads", id, "generic", { filename = "document" }, "completed"))
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
