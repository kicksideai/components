-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local registry = require("registry")
local json = require("json")
local uuid = require("uuid")
local time = require("time")
local component = require("component")
local M = {}
local function open()
    local entry,err = registry.get("kickside.docscout:db_config")
    if err then return nil,err end
    return sql.get(entry.meta.db_id)
end
function M.snapshot(component_id)
    local db,err = open()
    if err then return nil,err end
    local runs,run_err = db:query("SELECT id, caller, status, duration_ms, expires_at FROM kickside_docscout_runs WHERE component_id=$1 ORDER BY created_at DESC LIMIT 100",{component_id})
    if run_err then db:release();return nil,run_err end
    local cases,case_err = db:query("SELECT id, upload_id, upload_name, expected_values FROM kickside_docscout_cases WHERE component_id=$1 ORDER BY id",{component_id})
    db:release()
    if case_err then return nil,case_err end
    for _,case in ipairs(cases) do
        local expected,decode_err = json.decode(case.expected_values)
        if decode_err then return nil,decode_err end
        case.expected=expected;case.expected_values=nil
    end
    return {runs=runs,cases=cases},nil
end
function M.delete(component_id)
    local db,err = open()
    if err then return nil,err end
    local tx,tx_err = db:begin()
    if tx_err then db:release();return nil,tx_err end
    for _,name in ipairs({"documents","runs","cases"}) do
        local _,delete_err = tx:execute("DELETE FROM kickside_docscout_" .. name .. " WHERE component_id=$1",{component_id})
        if delete_err then tx:rollback();db:release();return nil,delete_err end
    end
    local _,commit_err = tx:commit()
    db:release()
    if commit_err then return nil,commit_err end
    return {success=true},nil
end
function M.add_case(component_id,dto)
    local db,err=open()
    if err then return nil,err end
    local tx,begin_err=db:begin()
    if begin_err then db:release();return nil,begin_err end
    local entry,entry_err=registry.get("kickside.docscout:db_config")
    if entry_err then tx:rollback();db:release();return nil,entry_err end
    local fence_err=component.fence(tx,component_id,entry.meta.db_id)
    if fence_err then tx:rollback();db:release();return nil,fence_err end
    local id=uuid.v7()
    local encoded,encode_err=json.encode(dto.expected)
    if encode_err then tx:rollback();db:release();return nil,encode_err end
    local _,write_err=tx:execute([[INSERT INTO kickside_docscout_cases(id,component_id,upload_id,upload_name,expected_values,created_at)
        VALUES($1,$2,$3,$4,$5,$6)]],{id,component_id,dto.upload_id,dto.upload_name,encoded,time.now():format(time.RFC3339)})
    if write_err then tx:rollback();db:release();return nil,write_err end
    local _,commit_err=tx:commit();db:release()
    if commit_err then return nil,commit_err end
    return {success=true,id=id},nil
end
function M.delete_case(component_id,case_id)
    local db,err=open()
    if err then return nil,err end
    local _,delete_err=db:execute("DELETE FROM kickside_docscout_cases WHERE component_id=$1 AND id=$2",{component_id,case_id})
    db:release()
    if delete_err then return nil,delete_err end
    return {success=true},nil
end
return M
