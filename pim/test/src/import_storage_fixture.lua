-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local fs=require("fs")
local M={}
local bytes,opens,whole=0,0,0
local seeks:{integer}={}
function M.reset() bytes=0;opens=0;whole=0;seeks={} end
function M.stats(): unknown return {bytes=bytes,opens=opens,whole=whole,seeks=seeks} end
function M.get(id:string): (unknown,error?)
    if id=="refused" then return {exists=function() return false,errors.new({kind=errors.PERMISSION_DENIED,message="read refused",details={code="storage_denied"}}) end},nil end
    local storage,err=fs.get(id)
    if err or not storage then return nil,err end
    return {
        exists=function(_self:unknown,path:string) return storage:exists(path) end,
        readfile=function(_self:unknown,path:string)
            whole=whole+1
            if path:find("terms.jsonl",1,true) then return nil,errors.new({kind=errors.INVALID,message="whole term file read",details={code="whole_term_read"}}) end
            return storage:readfile(path)
        end,
        open=function(_self:unknown,path:string,mode:string)
            opens=opens+1
            local file,ferr=storage:open(path,mode)
            if ferr or not file then return nil,ferr end
            return {
                seek=function(_f:unknown,whence:string,offset:integer) seeks[#seeks+1]=offset;return file:seek(whence,offset) end,
                read=function(_f:unknown,size:integer)
                    assert(type(size)=="number" and size<=65536,"bounded reads")
                    local chunk,rerr=file:read(size)
                    if chunk then bytes=bytes+#chunk end
                    return chunk,rerr
                end,
                close=function(_f:unknown) return file:close() end,
            },nil
        end,
    },nil
end
return M
