-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local canonical = require("canonical_json")
local crypto = require("crypto")
local env = require("env")
local secret_cipher = require("secret_cipher")
local resources = require("resources")
local types = require("types")

local M = {}
local LIFETIME = 10 * 60

local function signature(candidates: {types.ResourceContent}, actor: string, operation: string,
    expires_at: integer): (string?, error?)
    local encoded, encode_err = canonical.encode({resources = candidates, actor = actor, operation = operation,
        expires_at = expires_at})
    if encode_err then return nil, encode_err end
    local variable, variable_err = env.get("kickside.settings.env:encryption_key")
    if variable_err then return nil, errors.wrap(variable_err, "Resolve the mail preview signing key") end
    if type(variable) ~= "string" or variable == "" then
        return nil, resources.error(errors.UNAVAILABLE, "mail_preview_key_unavailable", "Mail preview signing key is unavailable")
    end
    local key, key_err = secret_cipher.load_key(variable)
    if key_err then return nil, errors.wrap(key_err, "Load the mail preview signing key") end
    local signing_key, derive_err = crypto.hmac.sha256(key :: string, "kickside.mail.library.preview/v1")
    if derive_err then return nil, derive_err end
    return crypto.hmac.sha256(signing_key :: string, encoded :: string)
end

function M.issue(candidates: {types.ResourceContent}, actor: string, operation: string, now: integer): (string?, error?)
    local expires_at = now + LIFETIME
    local mac, err = signature(candidates, actor, operation, expires_at)
    if err then return nil, err end
    return tostring(expires_at) .. "." .. mac, nil
end

local function mismatch(): error
    return resources.error(errors.INVALID, "mail_preview_mismatch",
        "Preview the exact proposed sources, schema and samples again, then use the new preview_id")
end

function M.verify(id: string, candidates: {types.ResourceContent}, actor: string, operation: string, now: integer): error?
    if #id > 77 then return mismatch() end
    local expiry, mac = id:match("^(%d+)%.([a-f0-9]+)$")
    local expires_at = expiry and #expiry <= 12 and math.tointeger(tonumber(expiry)) or nil
    if not expires_at or not mac or #mac ~= 64 then return mismatch() end
    local expected, err = signature(candidates, actor, operation, expires_at)
    if err then return err end
    if not crypto.constant_time_compare(expected :: string, mac) then return mismatch() end
    if expires_at <= now then
        return resources.error(errors.INVALID, "mail_preview_expired", "Preview the changes again to obtain a new preview_id")
    end
    return nil
end

return M
