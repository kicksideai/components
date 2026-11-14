-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The harness plugin stores declarations and resolve observations under the caller.
local sql = require("sql")
local json = require("json")
local security = require("security")
local M = {}

function M.seed(owner: string, fragment: unknown, mode: string?)
    local db = assert(sql.get("app:db"))
    assert(db:execute([[CREATE TABLE IF NOT EXISTS app_work_plugin_schema (owner_id TEXT PRIMARY KEY, fragment TEXT NOT NULL, mode TEXT NOT NULL, calls INTEGER NOT NULL, actor TEXT, previous TEXT)]], {}))
    assert(db:execute([[INSERT INTO app_work_plugin_schema (owner_id, fragment, mode, calls) VALUES ($1,$2,$3,0)
        ON CONFLICT (owner_id) DO UPDATE SET fragment = excluded.fragment, mode = excluded.mode]], { owner, json.encode(fragment), mode or "ok" }))
    db:release()
end

function M.observe(owner: string): { [string]: unknown }
    local db = assert(sql.get("app:db"))
    local rows = assert(db:query("SELECT * FROM app_work_plugin_schema WHERE owner_id = $1", { owner }))
    db:release()
    return rows[1]
end

function M.resolve(request: { [string]: unknown }): (unknown, error?)
    local actor = security.actor()
    if not actor then return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = "provider requires caller" }) end
    local db = assert(sql.get("app:db"))
    local rows = assert(db:query("SELECT * FROM app_work_plugin_schema WHERE owner_id = $1", { request.board_id }))
    local row = rows[1]
    if not row then db:release(); return nil, errors.new({ kind = errors.NOT_FOUND, message = "plugin declarations missing" }) end
    assert(db:execute("UPDATE app_work_plugin_schema SET calls = calls + 1, actor = $1, previous = $2 WHERE owner_id = $3", { actor:id(), json.encode(request.current or {}), request.board_id }))
    db:release()
    if row.mode == "offline" then return nil, errors.new({ kind = errors.UNAVAILABLE, message = "plugin offline" }) end
    if row.mode == "malformed" then return { version = "broken" }, nil end
    local config = request.config :: { [string]: unknown }
    local fragment = json.decode(row.fragment)
    if config.extra == true then
        fragment.fields[#fragment.fields + 1] = { code = "configured", form = "int", index = "number" }
        fragment.item_types[1].fields[#fragment.item_types[1].fields + 1] = "configured"
    end
    return { fragment = fragment, version = tostring(#(fragment.fields or {})) }, nil
end
return M
