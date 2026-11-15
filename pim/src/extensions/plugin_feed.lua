-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The host owns durable feed positions and bootstrap state.
local access = require("access")
local feeds = require("feeds")
local store = require("store")
local plugins = require("plugins")
local threads = require("threads")
local json = require("json")
local types = require("types")
local values=require("values")
local failure=require("failure")
local M = {}
type Token = { projection_id: string, start_seq: integer, cursor: types.ChangesCursor?, bootstrapping: boolean }
type Body = { worker_config: { start_seq: integer }, token: string? }
type Pair = { projection: { id: string, body: string } }
local TOKEN_SCHEMA = { type = "object", required = { "projection_id", "start_seq", "bootstrapping" }, additionalProperties = false,
    properties = { projection_id = { type = "string" }, start_seq = { type = "integer" }, bootstrapping = { type = "boolean" },
        cursor = { type = "object", required = { "seq", "product_id" }, additionalProperties = false,
            properties = { seq = { type = "integer", minimum = 0 }, product_id = { type = "string" } } } } }

function M.decode(token: string): (Token?, error?)
    local decoded, err = json.decode(token)
    if err then return nil, access.invalid("invalid plugin feed token") end
    local valid, verr = json.validate(TOKEN_SCHEMA, decoded)
    if verr or not valid then return nil, access.invalid("invalid plugin feed token") end
    return decoded :: Token, nil
end

function M.page(catalog_id: string, request: types.PluginFeedRequest): (types.PluginFeed?, error?)
    local caller, aerr = access.reader(catalog_id)
    if aerr or not caller then return nil, aerr end
    local client,terr=threads.open()
    if terr or not client then return nil,terr end
    local head,herr=client:find({thread_id=catalog_id})
    if herr then return nil,herr end
    if not head then return nil,errors.new({kind=errors.NOT_FOUND,message="catalog thread is absent",details={code="catalog_not_found"}}) end
    local plugin, perr = plugins.load(request.plugin)
    local declared: types.PluginProjection?=nil
    if plugin then
        for _,p in ipairs(plugin.projections or {}) do if p.kind==request.kind and p.input=="state" then declared=p end end
    end
    local pair: Pair?=nil
    local registration_error: error?=nil
    local body: Body?=nil
    if declared then
        local raw,rerr=client:get_projection_cursor({thread_id=catalog_id,kind=request.kind,projection_key="kickside.pim.plugin:"..request.plugin})
        registration_error=rerr
        pair=raw :: Pair?
        if pair then
            local decoded: unknown=pair.projection.body
            if type(decoded)=="string" then
                local out,jerr=json.decode(decoded)
                if jerr then registration_error=failure.corrupt("stored plugin projection body is malformed","body") else decoded=out end
            end
            body=decoded :: Body?
        end
    end
    local result,_,serr=store.snapshot(catalog_id,function(tx: types.Executor,catalog: types.Catalog,_dialect: string): (types.PluginFeed?,error?)
    local intent = catalog.plugin_state[request.plugin]
    if not intent or not intent.active then
        return nil, errors.new({ kind = errors.NOT_FOUND, message = "plugin is inactive", details = { code = "plugin_inactive" } })
    end
    if perr or not plugin then return nil,perr end
    if not declared then return nil,errors.new({kind=errors.INVALID,retryable=false,message="plugin declares no such state projection",details={code="plugin_projection_invalid"}}) end
    if registration_error then return nil,registration_error end
    if not pair then return nil,failure.corrupt("projection registration is missing","projection") end
    local config, merr = plugins.merged(plugin,{},intent.config)
    if merr then return nil, merr end
    if type(body)~="table" or type(body.worker_config)~="table" then return nil,failure.corrupt("stored plugin projection config is malformed","worker_config") end
    local registration=body.worker_config :: types.JsonObject
    local token:Token={projection_id=pair.projection.id,start_seq=body.worker_config.start_seq,bootstrapping=true}
    if request.token then
        local parsed,err=M.decode(request.token)
        if err or not parsed then return nil,err end
        if parsed.projection_id~=token.projection_id or parsed.start_seq~=token.start_seq then return nil,access.invalid("plugin feed token belongs to another registration") end
        token=parsed
    end
    if registration.start_seq~=intent.seq or not values.equal(registration.config,intent.config) or registration.attachment_id~=intent.attachment_id or registration.revision~=declared.revision then
        return nil,errors.new({kind=errors.UNAVAILABLE,retryable=true,message="plugin registration differs from captured intent",details={code="plugin_registration_pending"}})
    end
    local page, ferr = feeds.changes_snapshot(tx,catalog,{cursor=token.cursor},200)
    if ferr or not page then return nil, ferr end
    if page.gap then
        token.cursor, token.bootstrapping = nil, true
        page, ferr = feeds.changes_snapshot(tx,catalog,{},200)
        if ferr or not page then return nil, ferr end
    end
    page.as_of=catalog.applied_seq
    page.rebuilding=catalog.rebuild_after~=nil
    local bootstrap = token.bootstrapping
    local caught_up = not page.has_more and not page.rebuilding
    token.cursor = page.next
    if caught_up and (page.as_of :: integer) >= token.start_seq then token.bootstrapping = false end
    local encoded, eerr = json.encode(token)
    if eerr or not encoded then return nil, eerr end
    return { attachment_id = intent.attachment_id :: string, config = config :: types.JsonObject, bootstrap = bootstrap,
        changes = page.items, token = encoded, done = caught_up and (page.as_of :: integer) >= head.event_count }, nil
    end)
    return result,serr
end
return M
