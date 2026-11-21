-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types=require("types")
local store=require("store")
local json=require("json")
local M={}
local mode=""
local current: types.Catalog
local removed=0
local ensured=0
local rebuilt=0
local writes=0
function M.reset(value: string)
    mode=value; removed=0; ensured=0; rebuilt=0; writes=0
    current={plugin_after="",plugin_state={a={active=value~="missing",generation=2,seq=12,attachment_id="new",config={},lifecycle={state=(value=="revision" or value=="unchanged") and "ready" or "pending"}}}} :: types.Catalog
end
function M.writes(): integer return writes end
function M.list_system(_input:unknown): ({unknown},error?)
    return {{meta={owner="catalog"},private_context={pim_creation="token",config={}}}},nil
end
function M.proves(_catalog:string,_id:string,_request:unknown,_token:unknown): (boolean,error?) return true,nil end
function M.set_meta(_id:string,_meta:unknown): (boolean,error?) writes=writes+1;return true,nil end
function M.update(_id:string,_ops:unknown): (boolean,error?) writes=writes+1;return true,nil end
function M.state(): types.PluginIntent return current.plugin_state.a end
function M.counts(): (integer,integer,integer) return removed,ensured,rebuilt end
M.ACCESS={WRITE=2}
function M.validate_access(_id: string,_mask: integer): (boolean,error?) return true,nil end
function M.catalog(_tx: unknown,_id: string,_dialect: string?): (types.Catalog?,error?) return current,nil end
function M.transaction<T>(_what: string,fn: (types.Executor,string)->(T?,error?)): (T?,error?)
    return fn({execute=function() writes=writes+1;return true,nil end} :: types.Executor,"sqlite")
end
function M.load(_id: string): (types.Plugin?,error?)
    if mode=="missing" then return nil,errors.new({kind=errors.INVALID,retryable=false,message="missing",details={code="unknown_plugin"}}) end
    return {id="a",interface_version=1,attachment="kind",projections={{kind="fold",input="state",revision=2,worker_ref="func://app:worker",events={}}}} :: types.Plugin,nil
end
function M.merged(_plugin: types.Plugin, _defaults: types.JsonObject, config: types.JsonObject): (types.JsonObject?, error?)
    return config, nil
end
local function client(): unknown
    return {
        release=function()
            if mode=="release_failure" then return nil,errors.new({kind=errors.UNAVAILABLE,retryable=true,message="release failed",details={code="lifecycle_release_failed"}}) end
            return true,nil
        end,
        list_projections=function() return {projections={},projections_has_more=false},nil end,
        prune_boundary=function() return {max_pruned_seq=0},nil end,
        get_projection_cursor=function()
            if mode=="unchanged" then return {projection={body={worker_config={revision=2,start_seq=12,config={},attachment_id="new"}}}},nil end
            if mode=="new_sequence" then return {projection={body={worker_config={revision=2,start_seq=11,config={},attachment_id="new"}}}},nil end
            if mode=="state_revision" then return {projection={id="registration",body=json.encode({worker_config={revision=1,start_seq=12,config={},attachment_id="new",input="state"}})},cursor={last_seq=99,status="active"}},nil end
            if mode=="new_activation" or mode=="revision" then return {projection={body={worker_config={revision=mode=="revision" and 1 or 2,start_seq=12,config={},attachment_id="old"}}}},nil end
            return nil,errors.new({kind=errors.NOT_FOUND,message="absent"})
        end,
        register_projection=function(_self: unknown,r: {reset: boolean?}) ensured=ensured+1; assert(r.reset or mode~="new_activation","new activation must reset"); return {},nil end,
    }
end
function M.open(): (unknown,error?) return client(),nil end
function M.release(db: unknown,err: error?): error? return store.release(db,err) end
function M.ensure(_catalog: string,_plugin: string,_generation: integer,_kind: string,_title: string?,_config: unknown): (string?,boolean?,error?)
    if mode=="transient" then return nil,nil,errors.new({kind=errors.UNAVAILABLE,retryable=true,message="offline",details={code="attachment_offline"}}) end
    if mode=="deterministic" then return nil,nil,errors.new({kind=errors.INVALID,retryable=false,message="invalid",details={code="attachment_bad"}}) end
    return "new",false,nil
end
function M.remove(_id: string): error? removed=removed+1; return nil end
function M.rebuild_plugin(_catalog: string,_plugin: string): (boolean,error?) rebuilt=rebuilt+1; return true,nil end
function M.confirm(_id) return nil end
return M
