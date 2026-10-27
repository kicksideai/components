local test = require("test")
local sql = require("sql")
local fs = require("fs")
local contract = require("contract")
local funcs = require("funcs")
local env = require("env")
local records = require("records")
local pipeline = require("pipeline")
local resources = require("resources")

local OWNER = "storage-s3-restart-owner"
local STORAGE = "app:uploads"
local BYTES = "Packed remote bytes remain readable after a new runtime starts."

local function settings(): any return assert(assert(contract.get("kickside.settings:settings")):open()) end

local function persisted(): {any}
    local db = assert(sql.get("app:db"))
    local rows = assert(db:query("SELECT * FROM kickside_uploads WHERE actor_id=$1", { OWNER }))
    db:release()
    return rows
end

return { run = test.run_cases(function()
    test.describe("storage-s3 restart", function()
        test.it("reads a relocated packed path after a separate runtime starts", function()
            local rows = persisted()
            if #rows == 0 then
                local prefix = assert(env.get("app.storage_s3:prefix"))
                local saved = settings():set({ namespace = "kickside.storage_s3", key = "policy", value = {
                    mode = "s3", resource_id = "app.storage_s3:s3", prefix = prefix,
                } })
                test.is_true(saved.success, tostring(saved.error))
                local upload_id = "storage-s3-restart"
                assert(assert(fs.get(STORAGE)):writefile(upload_id, BYTES))
                local upload = assert(records.create(upload_id, OWNER, #BYTES, "text/plain", STORAGE,
                    upload_id, "generic", {}, "completed"))
                local result = assert(funcs.call("kickside.storage_s3.storage:stage", {
                    upload_id = upload_id, storage_id = STORAGE, storage_path = upload_id, mime_type = "text/plain",
                }))
                local relocated, relocate_err = pipeline.apply_relocation(upload, result.relocation)
                test.is_nil(relocate_err, tostring(relocate_err))
                test.is_true(relocated.storage_path:sub(1, 5) == "s3://")
                test.is_false(assert(fs.get(STORAGE)):exists(upload_id))
                return
            end
            test.eq(#rows, 1)
            local upload = rows[1]
            local storage = assert(resources.get_storage(upload.storage_id))
            local bytes, read_err = storage:readfile(upload.storage_path)
            test.is_nil(read_err, tostring(read_err))
            test.eq(BYTES, bytes)
            test.not_nil(storage:remove(upload.storage_path))
            test.is_nil(select(2, records.delete(upload.uuid)))
        end)
    end)
end) }
