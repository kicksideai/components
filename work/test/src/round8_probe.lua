-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local limits=require("limits")
local M={ACCESS={WRITE=1}}
local registered,removed,limit=0,0,0
local inactive=false
function M.read() return limits.read() end
function M.reset(value: boolean) registered,removed,limit=0,0,0;inactive=value end
function M.counts() return {registered=registered,removed=removed,limit=limit} end
function M.validate_access(_id: string,_mask: integer) return true,nil end
function M.open() return {list_projections=function(_self: unknown,input: {limit: integer})
    limit=input.limit
    local projections={}
    if inactive then for i=1,input.limit do projections[#projections+1]={id=tostring(i),kind="old",projection_key="kickside.work.plugin:fixture"} end end
    return {projections=projections,projections_has_more=inactive,projections_cursor="next"},nil
end,remove_projection=function(_self: unknown,_input: unknown) removed=removed+1;return true,nil end,
get_projection_cursor=function(_self: unknown,_input: unknown) return nil,nil end,
register_projection=function(_self: unknown,_input: unknown) registered=registered+1;return true,nil end,
release=function(_self: unknown) return true,nil end},nil end
function M.list(_db: unknown,_board: string,_pending: boolean,_limit: integer)
    return {{plugin="fixture",active=not inactive,config={},revision=1,progress={},attachment_id="fixture"}},nil
end
function M.load(_id: string)
    local projections={}
    for i=1,25 do projections[i]={kind="fixture" .. i,input="state",worker_ref="fixture",revision="1"} end
    return {projections=projections},nil
end
function M.effective(_plugin: unknown,_config: unknown) return {},nil end
function M.ensure(_board: string,_row: unknown) return nil end
function M.remove(_board: string,_row: unknown) return nil end
function M.finish(_board: string,_row: unknown,_state: unknown) return nil end
return M
