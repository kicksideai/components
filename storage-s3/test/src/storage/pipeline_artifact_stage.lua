local artifacts = require("artifacts")

local M = {}

function M.process(args: any): any
    local artifact, artifact_err = artifacts.create_artifact({
        upload_id = args.upload_id,
        kind = "text",
        role = "primary",
        mime_type = "text/plain",
        content = "derived content for " .. args.upload_id,
        storage_id = args.storage_id,
        metadata = {},
    })
    if artifact_err then error(artifact_err) end
    return { success = true, metadata = { derived_artifact_id = artifact.artifact_id } }
end

return M
