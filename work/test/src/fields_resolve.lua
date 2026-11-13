-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Harness schema provider: a plugin that keeps its field declarations in its own table
-- and answers Work's resolve call from them, under the caller's identity.
local sql = require("sql")
local security = require("security")

local M = {}

type Request = { board_id: string, plugin: string, config: { [string]: unknown }, current: { version: string? }? }
type Row = { code: string, form: string }

M.TABLE = "app_plugin_fields"

local function rows(board_id: string): ({ Row }?, error?)
    local db, err = sql.get("app:db")
    if err or not db then return nil, err end
    local _, cerr = db:execute("CREATE TABLE IF NOT EXISTS " .. M.TABLE .. " (board_id TEXT NOT NULL, code TEXT NOT NULL, form TEXT NOT NULL)", {})
    if cerr then db:release(); return nil, cerr end
    local out, qerr = db:query("SELECT code, form FROM " .. M.TABLE .. " WHERE board_id = $1 ORDER BY code", { board_id })
    db:release()
    if qerr then return nil, qerr end
    return out :: { Row }, nil
end

-- resolve answers one aspect named after the config prefix with the board's
-- rows as attributes; the version counts the rows and reports who asked.
function M.resolve(request: Request): (unknown, error?)
    local actor = security.actor()
    if not actor then return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = "resolve needs an actor" }) end
    local fields, err = rows(request.board_id)
    if err or not fields then return nil, err end
    local attributes: { { [string]: unknown } } = {}
    for _, r in ipairs(fields) do attributes[#attributes + 1] = { code = r.code, type = r.form } end
    local prefix = request.config.prefix
    if type(prefix) ~= "string" then prefix = "fields" end
    local previous = request.current and request.current.version or "none"
    return {
        fragment = { aspects = { { namespace = prefix, attributes = attributes } } },
        version = tostring(#fields) .. ":" .. actor:id() .. ":" .. request.plugin .. ":" .. previous,
    }, nil
end

function M.fail(_request: Request): (unknown, error?)
    return nil, errors.new({ kind = errors.UNAVAILABLE, message = "field store is offline" })
end

function M.malformed(_request: Request): (unknown, error?)
    return { version = "1" }, nil
end

return M
