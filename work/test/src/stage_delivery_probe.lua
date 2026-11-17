-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local json = require("json")
local contract = require("contract")
local M = {}
local function db()
    local db=assert(sql.get("app:db"))
    assert(db:execute("CREATE TABLE IF NOT EXISTS work_delivery_probe (board_id TEXT PRIMARY KEY, mode TEXT NOT NULL, calls INTEGER NOT NULL DEFAULT 0, request TEXT)"))
    return db
end
function M.set(board,mode)
    local d=db()
    assert(d:execute("INSERT INTO work_delivery_probe (board_id,mode) VALUES ($1,$2) ON CONFLICT (board_id) DO UPDATE SET mode=excluded.mode",{board,mode}))
    d:release()
    return true
end
function M.read(board)
    local d=db();local rows=assert(d:query("SELECT * FROM work_delivery_probe WHERE board_id=$1",{board}));d:release()
    return rows[1]
end
function M.write(request)
    local board=request.input.board_id
    local row=M.read(board)
    if not row or row.mode=="real" then
        local target=assert(assert(contract.get("kickside.data:writable")):open("kickside.workflows:run"))
        return target:write(request)
    end
    local d=db()
    assert(d:execute("UPDATE work_delivery_probe SET calls=calls+1,request=$1 WHERE board_id=$2",{assert(json.encode(request)),board}))
    d:release()
    if row.mode=="capacity" then return {success=false,error={code="rate_limited",scope="capacity",retriable=true,retry_after_ms=2000,message="capacity"}} end
    if row.mode=="uncertain" then return {success=false,error={code="provider_unavailable",scope="flow",retriable=true,message="admission acknowledgement lost"}} end
    if row.mode=="no_verdict" then return {success=false} end
    if row.mode=="no_ack" then return nil,nil end
    if row.mode=="reject" then return {success=false,error={code="not_found",scope="flow",retriable=false,message="Flow unavailable"}} end
    return {success=true,result="created",dest_ref={run_id="00000000-0000-4000-8000-000000000001"}}
end
-- Inject at the existing append boundary, never in production command logic.
function M.before_append(board,writes)
    local row=M.read(board)
    if not row or (row.mode~="crash_before_report" and row.mode~="cas_report") then return nil end
    local reported=false
    for _,w in ipairs(writes) do
        for _,e in ipairs(w.events) do if e.type=="kickside.work.events:stage.reported" then reported=e.body end end
    end
    if not reported then return nil end
    M.set(board,"success")
    if row.mode=="crash_before_report" then
        return errors.new({kind=errors.UNAVAILABLE,retryable=true,message="crash before report append",details={code="completion_interrupted"}})
    end
    local client=assert(assert(contract.get("kickside.work:board")):open())
    assert(client:report({board_id=board,item=reported.item,visit=reported.visit,attempt=reported.attempt,outcome="passed",outputs={answer=42}}))
    return nil
end
function M.find(flow,launcher,key) return require("admission").find(flow,launcher,key) end
return M
