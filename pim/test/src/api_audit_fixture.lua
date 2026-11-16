-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M={CONTENT={JSON="application/json"},STATUS={OK=200,UNAUTHORIZED=401}}
type Response={set_status:(Response,number)->(),set_content_type:(Response,string)->(),write_json:(Response,unknown)->()}
type Request={body:(Request)->(string?,error?),param:(Request,string)->string?,query:(Request,string)->string?}
M.Response=Response
M.Request=Request
local body=""
local body_error: error?=nil
local state: {[string]:unknown}={}
function M.reset(text: string,err: error?) body=text; body_error=err; state={calls=0} end
function M.result(): {[string]:unknown} return state end
function M.request(options: {max_body: integer}?): Request
    state.max_body=options and options.max_body
    return {body=function(): (string?,error?)
        if body_error then return nil,body_error end
        if options and #body>options.max_body then return nil,errors.new({kind=errors.INVALID,retryable=false,message="body too large",details={code="request_budget_exceeded"}}) end
        return body,nil
    end,param=function() return "absent" end,query=function() return nil end} :: Request
end
function M.response(): Response
    return {set_status=function(_self: unknown,value: number) state.status=value end,set_content_type=function() end,write_json=function(_self: unknown,value: unknown) state.payload=value end} :: Response
end
function M.open(): (unknown,error?)
    state.calls=(state.calls :: integer)+1
    return nil,errors.new({kind=errors.UNAVAILABLE,message="contract touched",details={code="contract_touched"}})
end
return M
