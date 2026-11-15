-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local store=require("store")
local types=require("types")
type FoldResult={last_seq: integer,jobs:{string},rebuild_job:string?}
local M={}
M.FoldResult=FoldResult
local failing=false
function M.reset(value: boolean) failing=value end
local function cleanup_error(): error return errors.new({kind=errors.UNAVAILABLE,retryable=true,message="release failed",details={code="release_failed"}}) end
function M.open(): (unknown,error?)
    return {type=function() return "sqlite" end,begin=function() return {commit=function() return true,nil end,rollback=function() return nil,cleanup_error() end},nil end,release=function() return nil,cleanup_error() end},nil
end
function M.fold(): (unknown,error?)
    if failing then return nil,errors.new({kind=errors.INVALID,retryable=false,message="fold failed",details={code="fold_failed"}}) end
    return {last_seq=1,jobs={}},nil
end
function M.transaction<T>(what: string,fn: (types.Executor,string)->(T?,error?)): (T?,error?)
    local db=assert(M.open())
    local tx=assert(db:begin())
    local out,err=fn(tx,"sqlite")
    if err then err=require("error_envelope").cleanup(function() return tx:rollback() end,err,what.." rollback") else local _,cerr=tx:commit(); err=cerr end
    err=require("error_envelope").cleanup(function() return db:release() end,err,"release")
    if err then return nil,err end
    return out,nil
end
return M
