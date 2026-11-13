-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The harness commits a restore between retention's scan and guarded append.
local sql = require("sql")
local funcs = require("funcs")
local append = require("append")
local domain = require("domain")
local clock = require("clock")
local M = {}
local function open(): sql.DB
    local db = assert(sql.get("app:db"))
    assert(db:execute("CREATE TABLE IF NOT EXISTS app_work_retention_restore (board_id TEXT NOT NULL, item_id TEXT NOT NULL, fired INTEGER NOT NULL, PRIMARY KEY (board_id,item_id))", {}))
    return db
end
function M.seed(board_id: string, item_id: string)
    local db = open()
    assert(db:execute("INSERT INTO app_work_retention_restore (board_id,item_id,fired) VALUES ($1,$2,0)", { board_id, item_id }))
    db:release()
end
function M.fired(board_id: string): boolean
    local db = open()
    local rows = assert(db:query("SELECT fired FROM app_work_retention_restore WHERE board_id=$1", { board_id }))
    db:release()
    return rows[1] ~= nil and tonumber(rows[1].fired) == 1
end
function M.writes(client: domain.ThreadClient, board_id: string, writes: { domain.Write }): (integer?, error?)
    for _, write in ipairs(writes) do
        for _, event in ipairs(write.events) do
            if event.type == "kickside.work.events:item.purged" then
                local db = open()
                local rows = assert(db:query("SELECT fired FROM app_work_retention_restore WHERE board_id=$1 AND item_id=$2", { board_id, event.body.item }))
                db:release()
                if rows[1] and tonumber(rows[1].fired) == 0 then
                    local _, err = funcs.call("app:trusted_append", { thread_id = board_id,
                        expect = { subject = event.subject, version = write.expect_version },
                        events = { { type = "kickside.work.events:item.restored", subject = event.subject,
                            body = { item = event.body.item, actor = "harness-restore", at = clock.now(), source = "api" } } } })
                    if err then return nil, err end
                    db = open()
                    assert(db:execute("UPDATE app_work_retention_restore SET fired=1 WHERE board_id=$1 AND item_id=$2", { board_id, event.body.item }))
                    db:release()
                end
            end
        end
    end
    return append.writes(client, board_id, writes)
end
return M
