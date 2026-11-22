-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local defaults=require("defaults")
-- Imports run as the captured requesting administrator under a leased one-shot job.
local jobs=require("jobs")
local work=require("work")
local store=require("store")
local budget=require("budget")
local clock=require("clock")
local component=require("component")
local execution_identity=require("execution_identity")
local job_types = require("job_types")
local M={}
function M.batch(input:{catalog_id:string}): (job_types.BatchResult?, error?)
    local _,err=component.validate_access(input.catalog_id,component.ACCESS.ADMIN)
    if err then return nil,err :: error end
    local done,berr=work.batch(input.catalog_id)
    if berr or done==nil then return nil,berr end
    return {done=done},nil
end
type Input = job_types.Input<{ catalog_id: string, request_id: string }>

function M.run(input: Input): (job_types.SelfCompleted | job_types.BatchResult | nil, error?)
    local job,payload=input.job,input.payload
    if not job or not payload then return nil,errors.new({kind=errors.INVALID,retryable=false,message="import job is malformed",details={code="import_job_invalid"}}) end
    local operating,oerr=defaults.catalog(payload.catalog_id)
    if oerr or not operating then return nil,oerr end
    local deadline,derr=budget.deadline(job.deadline)
    if derr or not deadline then return nil,derr end
    local db,oerr=store.open()
    if not db then return nil,oerr end
    local task,terr=work.get(db,payload.catalog_id)
    terr=store.release(db,terr)
    if terr then return nil,terr end
    if not task or task.request_id~=payload.request_id or task.done==1 then return {done=true},nil end
    for _=1,operating.job_batches do
        if not budget.enough(deadline,operating.command_deadline_ms) then break end
        local valid,lerr=jobs.lease_valid(job.id,budget.lease(job))
        if lerr then return nil,lerr end
        if not valid then return {self_completed=true},nil end
        local result,err=execution_identity.run_as(task.identity,"kickside.pim.jobs:import_batch",payload,{deferred_owner="kickside.pim.jobs:import",execution_root=payload.catalog_id})
        if err then return nil,err :: error end
        if (result :: job_types.BatchResult).done then return {done=true},nil end
    end
    local completed,cerr=jobs.complete(job.id,budget.lease(job),{rearm=clock.now()})
    if cerr then return nil,cerr end
    return {self_completed=true,completion=completed :: job_types.Completion?},nil
end
return M
