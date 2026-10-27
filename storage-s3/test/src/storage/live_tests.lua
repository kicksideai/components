local test = require("test")
local cloudstorage = require("cloudstorage")
local contract = require("contract")
local env = require("env")
local fs = require("fs")
local funcs = require("funcs")
local security = require("security")
local uuid = require("uuid")
local records = require("records")
local artifacts = require("artifacts")
local pipeline = require("pipeline")
local execution_identity = require("execution_identity")
local sql = require("sql")

local STORAGE = "app:uploads"
local RESOURCE = "app.storage_s3:s3"

local function settings(): any
    local definition = assert(contract.get("kickside.settings:settings"))
    return assert(definition:open())
end

local function configure(prefix: string): ()
    local result, save_err = settings():set({ namespace = "kickside.storage_s3", key = "policy", value = {
        mode = "s3", resource_id = RESOURCE, prefix = prefix,
    } })
    test.is_nil(save_err, tostring(save_err))
    test.is_true(result.success, tostring(result.error))
end

local function pipeline_metadata(owner: string): any
    local db = assert(sql.get("app:db"))
    assert(db:execute([[INSERT INTO app_users (user_id,email,full_name,password_hash,status)
        VALUES ($1,$2,$3,$4,'active') ON CONFLICT (user_id) DO NOTHING]], {
        owner, owner .. "@test.invalid", owner, "test",
    }))
    for _, group in ipairs({ "app:uploads_test", "wippy.security:process" }) do
        assert(db:execute([[INSERT INTO app_user_groups (user_id,group_id) VALUES ($1,$2)
            ON CONFLICT (user_id,group_id) DO NOTHING]], { owner, group }))
    end
    db:release()
    local identity = assert(execution_identity.to_row({
        version = execution_identity.VERSION,
        principal = { kind = execution_identity.KIND.USER, id = owner },
        authorized_by = { kind = execution_identity.KIND.USER, id = owner },
        captured_at = execution_identity.utc_now(),
    }))
    return {
        filename = "pipeline.txt",
        [execution_identity.CONTEXT_KEY] = { actor_id = identity.actor_id, actor_context = identity.actor_context },
    }
end

return { run = test.run_cases(function()
    test.describe("storage-s3 relocation stage", function()
        local original_path, blob_path, original_key, blob_key

        test.after_each(function()
            local storage = assert(fs.get(STORAGE))
            if original_path then storage:remove(original_path) end
            if blob_path then storage:remove(blob_path) end
            if original_key or blob_key then
                local cloud = assert(cloudstorage.get(RESOURCE))
                local keys = {}
                if original_key then keys[#keys + 1] = original_key end
                if blob_key then keys[#keys + 1] = blob_key end
                cloud:delete_objects(keys)
                cloud:release()
            end
            original_path, blob_path, original_key, blob_key = nil, nil, nil, nil
            settings():unset({ namespace = "kickside.storage_s3", key = "policy" })
        end)

        test.it("copies the original and each blob, verifies their sizes, and returns relocation without deleting bytes", function()
            local id = uuid.v4()
            local prefix = assert(env.get("app.storage_s3:prefix"))
            configure(prefix)
            local storage = assert(fs.get(STORAGE))
            original_path = "storage-s3-original-" .. id
            local original = "original bytes " .. id
            assert(storage:writefile(original_path, original))
            assert(records.create(id, "storage-s3-owner", #original, "text/plain", STORAGE, original_path,
                "text", {}, "completed"))
            local artifact = assert(artifacts.create_artifact({ upload_id = id, kind = "text", role = "primary",
                mime_type = "text/plain", content = "derived bytes " .. id, storage_id = STORAGE, metadata = {} }))
            blob_path = assert(artifacts.get_blob(artifact.blob_id)).storage_path

            local result, stage_err = funcs.call("kickside.storage_s3.storage:stage", {
                upload_id = id, storage_id = STORAGE, storage_path = original_path, mime_type = "text/plain",
            })
            test.is_nil(stage_err, tostring(stage_err))
            test.is_true(result.success)
            test.eq(result.relocation.storage_path, "s3://" .. RESOURCE .. "/" .. prefix .. "/" .. id .. "/original")
            test.eq(#result.relocation.blobs, 1)
            test.eq(result.relocation.blobs[1].blob_id, artifact.blob_id)

            original_key = prefix .. "/" .. id .. "/original"
            blob_key = prefix .. "/" .. id .. "/blobs/" .. artifact.blob_id
            local cloud = assert(cloudstorage.get(RESOURCE))
            test.eq(assert(cloud:head_object(original_key)).size, #original)
            test.eq(assert(cloud:head_object(blob_key)).size, #("derived bytes " .. id))
            cloud:release()
            test.is_true(storage:exists(original_path))
            test.is_true(storage:exists(blob_path))
        end)

        test.it("does not copy an upload already stored at an S3 packed path", function()
            local result, stage_err = funcs.call("kickside.storage_s3.storage:stage", {
                upload_id = uuid.v4(), storage_id = STORAGE, storage_path = "s3://" .. RESOURCE .. "/existing",
                mime_type = "text/plain",
            })
            test.is_nil(stage_err, tostring(stage_err))
            test.is_true(result.success)
            test.is_nil(result.relocation)
        end)

        test.it("relocates with an exact cloud grant without registry discovery", function()
            local id = uuid.v4()
            local prefix = assert(env.get("app.storage_s3:prefix"))
            configure(prefix)
            local storage = assert(fs.get(STORAGE))
            original_path = "storage-s3-scoped-" .. id
            local original = "scoped stage bytes " .. id
            assert(storage:writefile(original_path, original))
            local scope = assert(security.new_scope({
                assert(security.policy("app.storage_s3:stage_runtime_without_discovery")),
                assert(security.policy("kickside.storage_s3.security:runtime")),
            }))
            local actor = assert(security.new_actor("storage-s3-member", {}))
            local result, stage_err = funcs.new():with_actor(actor):with_scope(scope):call("kickside.storage_s3.storage:stage", {
                upload_id = id, storage_id = STORAGE, storage_path = original_path, mime_type = "text/plain",
            })
            test.is_nil(stage_err, tostring(stage_err))
            test.is_true(result.success)
            original_key = prefix .. "/" .. id .. "/original"
            test.eq(result.relocation.storage_path, "s3://" .. RESOURCE .. "/" .. original_key)
        end)

        test.it("relocates original and derived output through the Uploads pipeline", function()
            local id = uuid.v4()
            local prefix = assert(env.get("app.storage_s3:prefix"))
            local owner = "storage-s3-pipeline-" .. id
            configure(prefix)
            local storage = assert(fs.get(STORAGE))
            original_path = "storage-s3-pipeline-" .. id .. ".txt"
            local original = "pipeline original bytes " .. id
            assert(storage:writefile(original_path, original))
            local upload = assert(records.create(id, owner, #original, "application/x-storage-s3-pipeline-test",
                STORAGE, original_path, "app.storage_s3:types.pipeline_artifact", pipeline_metadata(owner), "completed"))

            local success, pipeline_err, processed = pipeline.process_upload(upload)
            test.is_nil(pipeline_err, tostring(pipeline_err))
            test.is_true(success)
            original_key = prefix .. "/" .. id .. "/original"
            test.eq(processed.storage_path, "s3://" .. RESOURCE .. "/" .. original_key)
            test.is_false(storage:exists(original_path))

            local derived = assert(artifacts.get_artifact(id, processed.metadata.derived_artifact_id))
            local blob = assert(artifacts.get_blob(derived.blob_id))
            blob_key = prefix .. "/" .. id .. "/blobs/" .. blob.blob_id
            test.eq(blob.storage_path, "s3://" .. RESOURCE .. "/" .. blob_key)
            local cloud = assert(cloudstorage.get(RESOURCE))
            test.eq(assert(cloud:head_object(original_key)).size, #original)
            test.eq(assert(cloud:head_object(blob_key)).size, #("derived content for " .. id))
            cloud:release()
            local actor = assert(security.new_actor(owner, { security_groups = { "app:uploads_test" } }))
            local scope = assert(security.named_scope("wippy.security:process"))
            local provided, provide_err = funcs.new():with_actor(actor):with_scope(scope)
                :with_context({ upload_id = id }):call("kickside.uploads.binding:get_content_func", {})
            test.is_nil(provide_err, tostring(provide_err))
            test.is_true(provided.success, tostring(provided.error))
            test.eq(provided.content, "derived content for " .. id)
            test.eq(provided.size, #("derived content for " .. id))
            assert(records.delete(id))
            original_path, blob_path, original_key, blob_key = nil, nil, nil, nil
        end)
    end)
end) }
