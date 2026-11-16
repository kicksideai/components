-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Bound bytes and JSON structure before asking the decoder to allocate a model.
local fs=require("fs")
local json=require("json")
local types=require("types")
local error_envelope=require("error_envelope")
local M={}
M.BYTES=4194304
M.LINE_BYTES=1048576
M.LINES=1000
local function invalid(message:string,code:string?): error
    return errors.new({kind=errors.INVALID,retryable=false,message=message,details={code=code or "import_chunk_limit"}})
end
function M.structure(text:string): (error?,integer?)
    local depth,entries=0,0
    local quoted,escaped=false,false
    for i=1,#text do
        local c=text:sub(i,i)
        if quoted then
            if escaped then escaped=false elseif c=='\\' then escaped=true elseif c=='"' then quoted=false end
        elseif c=='"' then quoted=true;entries=entries+1
        elseif c=='{' or c=='[' then depth=depth+1;entries=entries+1
        elseif c=='}' or c==']' then depth=depth-1
        elseif c==',' or c==':' then entries=entries+1 end
        if depth>24 or entries>65536 then return invalid("portable JSON exceeds structural limits"),nil end
    end
    return nil,entries
end
function M.text(storage:fs.FS,path:string): (string?,error?)
    local file,oerr=storage:open(path,"r")
    if oerr or not file then return nil,oerr end
    local parts:{string}={}
    local size=0
    local err:error?=nil
    while true do
        local chunk,rerr=file:read(math.min(16384,M.BYTES+1-size))
        if rerr and not errors.is(rerr,errors.NOT_FOUND) then err=rerr;break end
        if not chunk or chunk=="" then break end
        size=size+#chunk
        if size>M.BYTES then err=invalid("portable file exceeds 4 MiB");break end
        parts[#parts+1]=chunk
    end
    err=error_envelope.cleanup(function() return file:close() end,err,"close portable input")
    if err then return nil,err end
    return table.concat(parts),nil
end
function M.object(storage:fs.FS,path:string): (types.JsonObject?,error?)
    local text,err=M.text(storage,path)
    if err or not text then return nil,err end
    local budget=M.structure(text)
    if budget then return nil,budget end
    local decoded,derr=json.decode(text)
    if derr then return nil,derr end
    if type(decoded)~="table" or not text:match('^%s*{') then return nil,invalid("portable JSON must be an object","invalid_request") end
    return decoded :: types.JsonObject,nil
end
function M.products(storage:fs.FS,path:string): ({types.ExportedProduct}?,error?)
    local text,err=M.text(storage,path)
    if err or not text then return nil,err end
    -- Inspect all line and structural budgets before decoding the first row.
    local lines:{string}={}
    local framed=text:sub(-1)=="\n" and text or text.."\n"
    for line in framed:gmatch("([^\n]*)\n") do
        if #lines>=M.LINES then return nil,invalid("portable product chunk exceeds 1000 lines") end
        if #line>M.LINE_BYTES then return nil,invalid("portable product line exceeds 1 MiB") end
        lines[#lines+1]=line
    end
    local budget=M.structure(text)
    if budget then return nil,budget end
    local rows:{types.ExportedProduct}={}
    for _,line in ipairs(lines) do
        if line:match('%S') then
            local decoded,derr=json.decode(line)
            if derr then return nil,derr end
            if type(decoded)~="table" or not line:match('^%s*{') then return nil,invalid("portable product must be an object","invalid_request") end
            rows[#rows+1]=decoded :: types.ExportedProduct
        end
    end
    return rows,nil
end
return M
