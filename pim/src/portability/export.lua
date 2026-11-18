-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- kickside.contract:portable export: writes the catalog's effective schema,
-- its terms (parents first) and its live products (parents first, values by
-- attribute code with their sources) under <path>/data. Releases, deliveries
-- and proposals stay behind: they describe destinations and reviews of this
-- catalog, apart from its content.
local fs = require("fs")
local ctx = require("ctx")
local component = require("component")
local json = require("json")
local consts = require("consts")
local store = require("store")
local read_model = require("read_model")
local narrow = require("narrow")
local resolve = require("resolve")
local pio = require("portable_io")
local input=require("input")
local term_line=require("term_line")
local types = require("types")
local references = require("references")
local portable_result = require("portable_result")
local failure = require("failure")

local error_envelope=require("error_envelope")
local M = {}


local CHUNK = 10

local fail = portable_result.failure

local function values_of(compiled: types.Compiled, document: types.Document): ({ types.ExportedValue }, { types.ExportedValue })
    local by_id = compiled.by_id or {}
    local plain: { types.ExportedValue } = {}
    local refs: { types.ExportedValue } = {}
    for key, coords in pairs(document) do
        local attr = by_id[math.tointeger(tonumber(key)) or 0]
        if attr then
            for ctx_key, cell in pairs(coords) do
                local entry: types.ExportedValue = { attr = attr.code, ctx = resolve.parse_ctx(ctx_key), source = cell.s }
                if cell.c then entry.cleared = true else entry.value = cell.p end
                local product_ref = false
                if cell.p ~= nil then
                    for _, occurrence in ipairs(references.collect(attr, cell.p)) do
                        if occurrence.value.ref[1] == "product" then product_ref = true end
                    end
                end
                if product_ref then refs[#refs + 1] = entry else plain[#plain + 1] = entry end
            end
        end
    end
    return plain, refs
end

function M.handler(args: types.PortableArgs): types.PortableResult
    local catalog_id = ctx.get("component_id")
    if type(catalog_id) ~= "string" or catalog_id == "" then return fail(failure.invalid("no component_id in context")) end
    local _, access_err = component.validate_access(catalog_id, component.ACCESS.ADMIN)
    if access_err then return fail(errors.wrap(access_err, "catalog access denied")) end
    local path = args.path
    local storage, ferr = fs.get(args.storage_id)
    if ferr or not storage then return fail(errors.wrap(ferr, "storage")) end
    local result, _, snapshot_err = store.snapshot(catalog_id, function(db: types.Executor, catalog: types.Catalog, _dialect: string): (types.PortableResult?, error?)
    local declaration, derr = store.declaration(db, catalog_id, catalog.generation)
    if derr then return nil, errors.wrap(derr, "declaration") end
    if not declaration then return nil, failure.corrupt("catalog generation is missing") end
    local files: { string } = { "data/schema.json", "data/terms.jsonl", "data/plugin-configs.json" }
    local ok, perr = pio.ensure_parent(storage, path .. "/data/schema.json")
    if perr or not ok then return nil, perr end
    local encoded, eerr = json.encode(declaration)
    if eerr then return nil, errors.wrap(eerr, "encode schema") end
    local wok, werr = storage:writefile(path .. "/data/schema.json", encoded)
    if werr then return nil, errors.wrap(werr, "write schema") end
    local configs: types.JsonObject = {}
    for id, state in pairs(catalog.plugin_state) do if state.active then configs[id] = state.config end end
    local config_text, jerr = json.encode(configs)
    if jerr then return nil, jerr end
    local _, cerr = storage:writefile(path .. "/data/plugin-configs.json", config_text)
    if cerr then return nil, cerr end


    local term_file,tferr=storage:open(path .. "/data/terms.jsonl","w")
    if tferr or not term_file then return nil,tferr end
    local term_count=0
    local function write_terms(): error?
        local vocabularies:{string}={}
        for code in pairs(catalog.compiled.vocabularies) do vocabularies[#vocabularies+1]=code end
        table.sort(vocabularies)
        for _,vocabulary in ipairs(vocabularies) do
            local stack:{{parent:string?,after:string}}={{after=""}}
            while #stack>0 do
                local frame=stack[#stack]
                local row,rerr=read_model.term_sibling(db,catalog_id,vocabulary,frame.parent,frame.after)
                if rerr then return rerr end
                if not row then table.remove(stack) else
                    local decoded,derr2=store.decode_row(row,{vocabulary="text",code="text",labels="json",retired="int"})
                    if derr2 or not decoded then return derr2 end
                    local term:types.ExportedTerm={vocabulary=vocabulary,code=decoded.code :: string,parent=narrow.text(row.parent),labels=decoded.labels :: {[string]:string},retired=decoded.retired==1}
                    local line,lerr=term_line.encode(term)
                    if lerr or not line then return lerr end
                    local _,werr2=term_file:write(line)
                    if werr2 then return werr2 end
                    term_count=term_count+1
                    frame.after=term.code
                    if #stack>consts.LIMITS.term_depth then return failure.corrupt("term hierarchy exceeds maximum depth") end
                    stack[#stack+1]={parent=term.code,after=""}
                end
            end
        end
        return nil
    end
    local term_err=write_terms()
    term_err=error_envelope.cleanup(function() return term_file:close() end,term_err,"close exported terms")
    if term_err then return nil,term_err end

    local count, chunk_no = 0, 0
    local lines:{string}={}
    local chunk_bytes=0
    local chunk_entries=0
    local function flush_products(): error?
        if #lines==0 then return nil end
        chunk_no=chunk_no+1
        local rel=string.format("data/products-%06d.jsonl",chunk_no)
        local _,err=storage:writefile(path .. "/" .. rel,table.concat(lines))
        if err then return err end
        files[#files+1]=rel
        lines={};chunk_bytes=0;chunk_entries=0
        return nil
    end
    local after_level, after_id = -1, ""
    while true do
        local page, qerr = read_model.export_page(db, catalog_id, after_level, after_id, CHUNK)
        if qerr then return nil, qerr end
        if not page or #page == 0 then break end
        for _, raw in ipairs(page) do
            local r: types.Row = raw
            local decoded, derr2 = store.decode_row(r, { product_id = "text", sku = "text", family = "text", level = "int", status = "text", document = "json" })
            if derr2 or not decoded then return nil, derr2 end
            r = decoded
            local plain, refs = values_of(catalog.compiled, r.document :: types.Document)
            local product: types.ExportedProduct = { product_id = (r.product_id :: string), sku = (r.sku :: string),
                family = (r.family :: string), level = (r.level :: integer), parent_sku = narrow.text(r.parent_sku),
                status = (r.status :: string), values = plain, refs = refs }
            local line,lerr=json.encode(product)
            if lerr or not line then return nil,lerr end
            if #line>input.LINE_BYTES then return nil,failure.invalid("export product exceeds portable line budget") end
            local structural,entries=input.structure(line)
            if structural then return nil,structural end
            if chunk_bytes+#line+1>input.BYTES or #lines==input.LINES or chunk_entries+(entries :: integer)>65536 then
                local ferr2=flush_products()
                if ferr2 then return nil,ferr2 end
            end
            lines[#lines+1]=line.."\n";chunk_bytes=chunk_bytes+#line+1;chunk_entries=chunk_entries+(entries :: integer)
            count=count+1
            after_level, after_id = product.level, product.product_id
        end
    end
    local final_err=flush_products()
    if final_err then return nil,final_err end
    return { success = true, manifest = { impl_id = consts.CATALOG_IMPL, slots = {}, files = files,
        counts = { terms = term_count, products = count, product_files = chunk_no } } }, nil
    end)
    if snapshot_err then return fail(snapshot_err) end
    return result :: types.PortableResult
end

return M
