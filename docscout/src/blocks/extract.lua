-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The Extract document fields Block: runs the configured extractor on the
-- input upload under the Workflow's identity.
local client = require("client")
local shapes = require("shapes")
local error_envelope = require("error_envelope")

local function invalid(message: string): error return errors.new({ kind = errors.INVALID, message = message }) end

local function run(request: any): (any?, error?)
    local cfg, input = request and request.config or {}, request and request.input or {}
    if type(cfg.extractor_id) ~= "string" or cfg.extractor_id == "" then return nil, invalid("Choose an extractor") end
    if type(input.upload_id) ~= "string" or input.upload_id == "" then return nil, invalid("The input needs an upload_id") end
    local result, err = client.run({ extractor_id = cfg.extractor_id, upload_id = input.upload_id, caller = "workflow" })
    if err then return nil, err end
    local output = { values = result.values, fields = result.fields, verified = shapes.verified(result), run_id = result.run_id, pages = result.pages,
        config_revision = result.config_revision, status = result.status, duration_ms = result.duration_ms, tokens = result.tokens, trace = result.trace }
    if result.status == "failed" then
        local cause = result.error
        for _, field in ipairs(result.fields) do if field.failed and not cause then cause = field.error end end
        local failure = cause and errors.new(cause) or errors.new({ kind = errors.NOT_FOUND, retryable = false,
            message = "No document fields were extracted", details = { code = "docscout_no_values" } })
        return nil, error_envelope.wrap(failure, "Document extraction failed", { result = output })
    end
    return output, nil
end

return { run = run }
