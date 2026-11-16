-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Harness realtime binding: records every notify so tests can assert what each
-- user's clients would receive.
local sql = require("sql")

local M = {}

type Notice = { user_id: string?, topic: string?, data: { event: string?, meta: { last_event_seq: number? }? }? }
type Result = { success: boolean, error: string? }

function M.notify(args: Notice): Result
    local db, db_err = sql.get("app:db")
    if db_err or not db then return { success = false, error = tostring(db_err) } end
    local _, table_err = db:execute([[CREATE TABLE IF NOT EXISTS pim_realtime_notices (user_id TEXT NOT NULL, topic TEXT NOT NULL,
        event TEXT NOT NULL, last_event_seq INTEGER)]])
    if table_err then db:release(); return { success = false, error = tostring(table_err) } end
    local data = args.data or {}
    local meta = data.meta or {}
    local _, insert_err = db:execute("INSERT INTO pim_realtime_notices (user_id, topic, event, last_event_seq) VALUES ($1, $2, $3, $4)",
        { tostring(args.user_id), tostring(args.topic), tostring(data.event), meta.last_event_seq and math.tointeger(meta.last_event_seq) or sql.NULL })
    db:release()
    if insert_err then return { success = false, error = tostring(insert_err) } end
    return { success = true }
end

function M.broadcast(): Result
    return { success = false, error = "catalog changes never broadcast to every client" }
end

return M
