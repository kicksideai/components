-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Harness schema provider: a plugin whose admin declares fields in the
-- plugin's own table (as a settings web component would) and answers PIM's
-- resolve call from them, under the caller's identity.
local sql = require("sql")
local security = require("security")

local M = {}

type Request = { catalog_id: string, plugin: string, config: { [string]: unknown }, current: { version: string? }? }
type Row = { code: string, type: string, idx: string }

M.TABLE = "pim_test_plugin_fields"
M.DDL = "CREATE TABLE IF NOT EXISTS " .. M.TABLE .. " (owner_id TEXT NOT NULL, code TEXT NOT NULL, type TEXT NOT NULL, idx TEXT NOT NULL)"

local function rows(owner_id: string): ({ Row }?, error?)
    local db, err = sql.get("app:db")
    if err or not db then return nil, err end
    local _, cerr = db:execute(M.DDL, {})
    if cerr then db:release(); return nil, cerr end
    local out, qerr = db:query("SELECT code, type, idx FROM " .. M.TABLE .. " WHERE owner_id = $1 ORDER BY code", { owner_id })
    db:release()
    if qerr then return nil, qerr end
    return out :: { Row }, nil
end

-- resolve answers one aspect named by the plugin's effective config with the
-- catalog's declared fields; the version counts them.
function M.resolve(request: Request): (unknown, error?)
    if not security.actor() then return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = "resolve needs an actor" }) end
    local fields, err = rows(request.catalog_id)
    if err or not fields then return nil, err end
    local attributes: { { [string]: unknown } } = {}
    for _, r in ipairs(fields) do attributes[#attributes + 1] = { code = r.code, type = r.type, index = r.idx } end
    return { fragment = { aspects = { { namespace = request.config.namespace, attributes = attributes } } }, version = tostring(#fields) }, nil
end

function M.offline(_request: Request): (unknown, error?)
    return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = true, details = { code = "field_store_unavailable" }, message = "field store is offline" })
end

return M
