-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local canonical_json = require("canonical_json")
local types = require("types")
local error_envelope = require("error_envelope")

local function preview(operation: string, candidates: {types.ResourceContent}, expected: {[string]: integer},
    restore_seq: integer?): (string?, error?)
    local digest, err = canonical_json.hash({operation = operation, resources = candidates,
        expected = canonical_json.object(expected), restore_seq = restore_seq})
    if err then
        return nil, error_envelope.wrap(err, "Cannot digest the Mail preview", {code = "mail_preview_digest_failed"})
    end
    return digest, nil
end

return {preview = preview}
