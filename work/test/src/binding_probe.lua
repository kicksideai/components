-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Installer contract seam for Work-owned ordering/retry tests. The integration
-- cases without a row delegate to the real selected installer; no production
-- identity is weakened by this seam.
local sql = require("sql")
local json = require("json")
local automations = require("automations")
local append = require("append")
local M = {}
local function db()
    local db = assert(sql.get("app:db"))
    assert(db:execute("CREATE TABLE IF NOT EXISTS work_binding_fault (board_id TEXT PRIMARY KEY, fault TEXT NOT NULL, installs INTEGER NOT NULL DEFAULT 0, appends INTEGER NOT NULL DEFAULT 0, installation TEXT)"))
    return db
end
function M.set(board_id, fault)
    local db = db()
    assert(db:execute("INSERT INTO work_binding_fault (board_id,fault) VALUES ($1,$2) ON CONFLICT (board_id) DO UPDATE SET fault=excluded.fault", {board_id,fault}))
    db:release()
    return true
end
function M.read(board_id)
    local db = db()
    local rows = assert(db:query("SELECT * FROM work_binding_fault WHERE board_id=$1", {board_id}))
    db:release()
    return rows[1]
end
local function interrupted()
    return errors.new({kind=errors.UNAVAILABLE,retryable=true,message="binding test interrupted",details={code="binding_interrupted"}})
end
function M.install_type_selected(kind,input,args)
    local row = M.read(args.parent_id)
    if not row then return automations.install_type_selected(kind,input,args) end
    local db = db()
    local installation = assert(json.encode({kind=kind,input=input,args=args}))
    if row.installation then
        -- A schema retry must reuse the identical selected-install request.
        assert(require("values").equal(assert(json.decode(row.installation)), assert(json.decode(installation))))
    end
    assert(db:execute("UPDATE work_binding_fault SET installs=installs+1, installation=$1, fault=$2 WHERE board_id=$3", {installation, (row.fault == "install" or row.fault == "ack") and "" or row.fault, args.parent_id}))
    db:release()
    if row.fault == "install" or row.fault == "ack" then return nil,interrupted() end
    if row.fault == "no_result" then return nil,nil end
    return { id=args.component_id },nil
end
function M.writes(client,board_id,writes)
    local row = M.read(board_id)
    if row then
        local db = db()
        assert(db:execute("UPDATE work_binding_fault SET appends=appends+1, fault='' WHERE board_id=$1", {board_id}))
        db:release()
        if row.fault == "append" then
            return nil,errors.new({kind=errors.CONFLICT,message="binding schema head moved",details={reason="head_mismatch"}})
        end
    end
    return append.writes(client,board_id,writes)
end
return M
