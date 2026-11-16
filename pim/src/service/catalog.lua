-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- kickside.pim:catalog service methods: the one surface tools, Blocks, HTTP
-- endpoints and other modules call. Each method runs under the caller's
-- identity, parses its request against the method's input schema, and maps onto
-- the writer, reader or catalog lifecycle service.
local writer = require("writer")
local reader = require("reader")
local feeds = require("feeds")
local release_reads = require("release_reads")
local create = require("create")
local locate = require("locate")
local requests = require("requests")
local plugin_feed = require("plugin_feed")
local types = require("types")

local M = {}

local function addressed(input: unknown): string?
    if type(input) ~= "table" then return nil end
    local id = (input :: { [string]: unknown }).catalog_id
    return type(id) == "string" and id or nil
end

-- with_catalog parses the request against method's input schema, then
-- resolves the addressed catalog (explicit, or the caller's only one) before
-- the method runs.
local function with_catalog<R>(method: string, fn: (string, unknown) -> (R?, error?)): (unknown) -> (R?, error?)
    return function(input: unknown): (R?, error?)
        local perr = requests.parse(method, input)
        if perr then return nil, perr end
        local id, lerr = locate.resolve(addressed(input))
        if lerr or not id then return nil, lerr end
        local out, err = fn(id, input)
        if err or out == nil then return nil, err end
        return requests.output(method, out)
    end
end

function M.create(input: unknown): (types.CreateResult?, error?)
    local perr = requests.parse("create", input)
    if perr then return nil, perr end
    local request = input :: types.CreateRequest
    return create.create(request)
end

function M.list(input: unknown): (types.ListResult?, error?)
    local perr = requests.parse("list", input)
    if perr then return nil, perr end
    local request = (input or {}) :: {limit:integer?,after:integer?}
    local limit=request.limit or 50
    local offset=request.after or 0
    local catalogs, err = locate.readable(limit+1,offset)
    if err or not catalogs then return nil, err end
    local more=#catalogs>limit
    if more then table.remove(catalogs) end
    return { catalogs = catalogs,after=more and offset+#catalogs or nil }, nil
end

function M.get_catalog(input:unknown): (types.CatalogSummary?,error?)
    local perr=requests.parse("get_catalog",input)
    if perr then return nil,perr end
    local request: {catalog_id:string} = input :: {catalog_id:string}
    return locate.summary(request.catalog_id)
end

M.get_schema = with_catalog("get_schema", function(id: string, input: unknown): (types.SchemaView?, error?)
    return reader.get_schema(id, input :: types.GetSchemaRequest)
end)

M.plan_schema = with_catalog("plan_schema", function(id: string, input: unknown): (types.SchemaPlanResult?, error?)
    local request = input :: types.SchemaRequest
    return writer.plan_schema(id, request)
end)

M.apply_schema = with_catalog("apply_schema", function(id: string, input: unknown): (types.SchemaResult?, error?)
    local request = input :: types.SchemaRequest
    return writer.apply_schema(id, request)
end)

M.configure_plugin = with_catalog("configure_plugin", function(id: string, input: unknown): (types.CommandResult?, error?)
    return writer.configure_plugin(id, input :: { plugin: string, config: types.JsonObject })
end)

M.plugin_context = with_catalog("plugin_context", function(id: string, input: unknown): (types.PluginContext?, error?)
    return reader.plugin_context(id, (input :: { plugin: string }).plugin :: string)
end)

M.plugin_feed = with_catalog("plugin_feed", function(id: string, input: unknown): (types.PluginFeed?, error?)
    return plugin_feed.page(id, input :: types.PluginFeedRequest)
end)

M.get = with_catalog("get", function(id: string, input: unknown): (types.GetResult?, error?)
    local request = input :: types.GetRequest
    return reader.get(id, request)
end)

M.query = with_catalog("query", function(id: string, input: unknown): (types.QueryResult?, error?)
    local request = input :: types.QueryRequest
    return reader.query(id, request)
end)

M.list_terms = with_catalog("list_terms", function(id: string, input: unknown): (types.ListTermsResult?, error?)
    return reader.list_terms(id, input :: types.ListTermsRequest)
end)

M.schema_options = with_catalog("schema_options", function(id: string, input: unknown): (types.SchemaOptions?, error?)
    return reader.schema_options(id, input :: types.SchemaOptionsRequest)
end)

M.list_history = with_catalog("list_history", function(id: string, input: unknown): (types.HistoryResult?, error?)
    local request = input :: types.HistoryRequest
    return reader.history(id, request)
end)

M.apply = with_catalog("apply", function(id: string, input: unknown): (types.ApplyResult?, error?)
    local request = input :: types.ApplyRequest
    return writer.apply(id, request)
end)

M.propose = with_catalog("propose", function(id: string, input: unknown): (types.ProposeResult?, error?)
    local request = input :: types.ProposeRequest
    return writer.propose(id, request)
end)

M.decide = with_catalog("decide", function(id: string, input: unknown): (types.DecideResult?, error?)
    local request = input :: types.DecideRequest
    return writer.decide(id, request)
end)

M.list_proposals = with_catalog("list_proposals", function(id: string, input: unknown): (types.ProposalsResult?, error?)
    local request = input :: types.ProposalsRequest
    return reader.proposals(id, request)
end)

M.release = with_catalog("release", function(id: string, input: unknown): (types.ApplyResult?, error?)
    local request = input :: types.ReleaseRequest
    return writer.release(id, request)
end)

M.withdraw = with_catalog("withdraw", function(id: string, input: unknown): (types.ApplyResult?, error?)
    local request = input :: types.ReleaseRequest
    return writer.withdraw(id, request)
end)

M.rebuild = with_catalog("rebuild", function(id: string, _input: unknown): (types.RebuildResult?, error?)
    return writer.rebuild(id)
end)

M.list_links = with_catalog("list_links", function(id: string, input: unknown): (types.LinksResult?, error?)
    return reader.links(id, input :: types.LinksRequest)
end)

M.explain = with_catalog("explain", function(id: string, input: unknown): (types.ExplainResult?, error?)
    return reader.explain(id, input :: types.ExplainRequest)
end)

M.list_changes = with_catalog("list_changes", function(id: string, input: unknown): (types.ChangesResult?, error?)
    return feeds.changes(id, input :: types.ChangesRequest)
end)

M.list_publications = with_catalog("list_publications", function(id: string, input: unknown): (types.PublicationsResult?, error?)
    return feeds.publications(id, input :: types.PublicationsRequest)
end)

M.get_release = with_catalog("get_release", function(id: string, input: unknown): (types.GetReleaseResult?, error?)
    return release_reads.get_release(id, input :: types.GetReleaseRequest)
end)

M.list_releases = with_catalog("list_releases", function(id: string, input: unknown): (types.ReleasesResult?, error?)
    return release_reads.releases(id, input :: types.ReleasesRequest)
end)

return M
