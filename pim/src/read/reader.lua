-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local failure=require("failure")
-- Reads (spec 7): one product with its resolved view, and item queries over the
-- generated item table. Every answer reports as_of, the folded catalog seq.
local consts = require("consts")
local base64 = require("base64")
local json = require("json")
local store = require("store")
local read_model = require("read_model")
local proposal_rows = require("proposal_rows")
local access = require("access")
local defaults = require("defaults")
local select = require("select")
local scopes = require("scopes")
local seams = require("seams")
local links = require("links")
local schema = require("schema")
local resolve = require("resolve")
local layout = require("layout")
local history = require("history")
local plugins = require("plugins")
local plugin_projections = require("plugin_projections")
local types = require("types")
local registry = require("registry")
local component = require("component")

local M = {}

local invalid = access.invalid
local with_snapshot = access.with_snapshot

local function pending_indexes(catalog: types.Catalog): { [string]: boolean }
    local pending: { [string]: boolean } = {}
    for _, c in ipairs(catalog.pending_columns) do pending[c] = true end
    return pending
end

-- readiness reads an item's readiness from its generated row, as the fold
-- computed it: one entry per requirement set the row holds a flag for, with
-- the open findings of that set.
local function readiness(tx: types.Executor, catalog: types.Catalog, item: types.Product): ({ [string]: { types.Finding } }?, error?)
    local row, err = layout.read_row(tx, layout.active(catalog), item.product_id)
    if err then return nil, err end
    if not row then return nil, failure.corrupt("item " .. item.product_id .. " has no generated row") end
    local decoded, oerr = store.decode_row(row, { findings = "json" })
    if oerr or not decoded then return nil, oerr end
    local open = decoded.findings :: { [string]: { types.Finding } }
    local out: { [string]: { types.Finding } } = {}
    local pending = pending_indexes(catalog)
    for _, c in ipairs(catalog.compiled.layout.flags) do
        if not pending[c.column] and row[c.column] ~= nil then out[c.ctx] = open[c.ctx] or {} end
    end
    return out, nil
end

function M.live_product(tx: types.Executor, catalog_id: string, ref: types.ProductRef): (types.Product?, error?)
    local p: types.Product?
    local err: error?
    if type(ref.id) == "string" then p, err = store.product(tx, catalog_id, ref.id)
    elseif type(ref.sku) == "string" then p, err = store.product_by_sku(tx, catalog_id, ref.sku)
    else return nil, invalid("product id or sku required") end
    if err then return nil, err end
    if not p or p.state ~= "live" then
        return nil, errors.new({ kind = errors.NOT_FOUND, message = "product not found", details = { code = "product_not_found" } })
    end
    return p, nil
end

-- get(catalog_id, { product = {id|sku}, context? }) -> product, values resolved for context
function M.get(catalog_id: string, request: types.GetRequest): (types.GetResult?, error?)
    local caller, access_err = access.reader(catalog_id)
    if access_err or not caller then return nil, access_err end
    local ref: types.ProductRef = request and request.product or {}
    return with_snapshot(caller, function(tx: types.Executor, catalog: types.Catalog, _dialect: string): (types.GetResult?, error?)
        local p, err = M.live_product(tx, catalog_id, ref)
        if err or not p then return nil, err end
        local compiled = catalog.compiled
        local cerr = schema.check_context(compiled.dimensions, request.context)
        if cerr then return nil, cerr end
        local lineage, lerr = store.lineage(tx, catalog_id, p)
        if lerr or not lineage then return nil, lerr end
        local view: { [string]: types.ResolvedValue } = {}
        for code, attr in pairs(compiled.attributes) do
            local r = resolve.resolve(compiled, p, lineage, attr, request.context)
            if r.state ~= "not_applicable" then
                view[code] = { state = r.state, value = r.value, source = r.source, ctx = r.ctx,
                    owner = r.owner and r.owner.product_id or nil }
            end
        end
        local pubs, perr = store.publications(tx, catalog_id, p.product_id)
        if perr or not pubs then return nil, perr end
        local publications: { types.PublicationState } = {}
        for i, pub in ipairs(pubs) do publications[i] = { channel = pub.channel, release_id = pub.release_id, state = pub.state } end
        local ready: { [string]: { types.Finding } }? = nil
        if p.is_item == 1 then
            local rerr: error?
            ready, rerr = readiness(tx, catalog, p)
            if rerr then return nil, rerr end
        end
        return { product = { product_id = p.product_id, sku = p.sku, family = p.family, parent_id = p.parent_id,
            root_id = p.root_id, level = p.level, is_item = p.is_item == 1, version = p.version, status = p.status },
            values = view, readiness = ready,
            release_id = p.release_id, publications = publications }, nil
    end, request and request.min_seq)
end

-- anchor reads the live product a hierarchy filter names.
local function anchor(tx: types.Executor, catalog_id: string, ref: types.ProductRef): (types.Product?, error?)
    local p: types.Product?
    local aerr: error?
    if ref.id then p, aerr = store.product(tx, catalog_id, ref.id :: string)
    elseif ref.sku then p, aerr = store.product_by_sku(tx, catalog_id, ref.sku :: string) end
    if aerr then return nil, aerr end
    if not p or p.state ~= "live" then return nil, errors.new({ kind = errors.NOT_FOUND, message = "hierarchy anchor not found", details = { code = "product_not_found" } }) end
    return p, nil
end

local function building(what: string): error
    return errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = what .. " is being rebuilt; retry once rebuilding ends", details = { code = "index_rebuilding" } })
end

-- field_resolver maps a filter or sort field to the generated column that holds
-- it; a column being rebuilt is unavailable until the rebuild ends.
local function field_resolver(compiled: types.Compiled, pending: { [string]: boolean }): types.Resolver
    return function(code: string, ctx: types.Ctx?): (types.Target?, error?)
        local attr = compiled.attributes[code]
        if not attr then return nil, invalid("unknown attribute " .. tostring(code)) end
        local key, kerr = schema.ctx_key(compiled.dimensions, attr.scope, ctx)
        if kerr then return nil, kerr end
        local shape: types.ValueShape = { form = attr.form, cardinality = "one", config = attr.config }
        local coerce: ((unknown) -> unknown)? = nil
        if attr.config.target == "term" then
            local vocabulary = attr.vocabulary
            coerce = function(raw: unknown): unknown
                if type(raw) == "string" then return { ref = { "term", tostring(vocabulary) .. ":" .. raw } } end
                return raw
            end
        end
        for _, c in ipairs(compiled.layout.columns) do
            if c.attribute_id == attr.id and c.ctx == key then
                if pending[c.column] then return nil, building("the index of " .. code) end
                return { column = c.column, kind = c.kind, set = false, shape = shape, coerce = coerce }, nil
            end
        end
        for _, c in ipairs(compiled.layout.sets) do
            if c.attribute_id == attr.id and c.ctx == key then
                if pending[c.column] then return nil, building("the index of " .. code) end
                return { column = c.column, kind = c.kind, set = true, shape = shape, coerce = coerce }, nil
            end
        end
        return nil, invalid(code .. " is not indexed in that context")
    end
end

local function query_token(cursor: types.Cursor): string
    local key = cursor.v
    local wire: types.QueryPosition = { id = cursor.id }
    if type(key) == "number" then
        wire.decimal = tostring(key)
    else
        wire.key = key
    end
    return base64.encode(assert(json.encode(wire)))
end

local function query_position(token: types.QueryToken): types.Cursor?
    local raw = base64.decode(token)
    local decoded = raw and json.decode(raw)
    if type(decoded) ~= "table" then return nil end
    local wire = decoded :: { [string]: unknown }
    if type(wire.id) ~= "string" or wire.id == "" then return nil end
    for key in pairs(wire) do
        if key ~= "id" and key ~= "key" and key ~= "decimal" then return nil end
    end
    if wire.decimal ~= nil then
        if wire.key ~= nil or type(wire.decimal) ~= "string" or not wire.decimal:match("^%-?%d+$") then return nil end
        local number = tonumber(wire.decimal)
        if not number or math.type(number) ~= "integer" then return nil end
        return { id = wire.id, v = number :: integer }
    end
    if wire.key ~= nil and type(wire.key) ~= "string" then return nil end
    return { id = wire.id, v = wire.key :: string? }
end

-- query(catalog_id, { where?, text?, family?, status?, sort?, limit?, after?, count? })
-- where is a filter tree (kickside.pim.persist:tree).
function M.query(catalog_id: string, request: types.QueryRequest?): (types.QueryResult?, error?)
    local caller, access_err = access.reader(catalog_id)
    if access_err or not caller then return nil, access_err end
    local q: types.QueryRequest = request or {}
    local limit = q.limit or consts.LIMITS.page_default
    if limit < 1 or limit > consts.LIMITS.page then return nil, invalid("limit must be 1.." .. consts.LIMITS.page) end
    local after: types.Cursor? = nil
    if q.after then
        after = query_position(q.after)
        if not after then return nil, invalid("after must be a PIMQuery continuation") end
    end
    local admitted, scope_err = scopes.admit(caller, q.scopes)
    if scope_err or not admitted then return nil, scope_err end
    return with_snapshot(caller, function(tx: types.Executor, catalog: types.Catalog, dialect: string): (types.QueryResult?, error?)
        local compiled = catalog.compiled
        local channel = q.published and q.published.channel
        if channel and not compiled.channels[channel] then
            return nil, invalid("unknown channel " .. channel, { code = "unknown_channel", channel = channel })
        end
        local pending = pending_indexes(catalog)
        local item_filter: read_model.ItemFilter = { family = q.family, status = q.status }
        if q.root then
            local root, rerr = anchor(tx, catalog_id, q.root :: types.ProductRef)
            if rerr or not root then return nil, rerr end
            if root.level ~= 0 then return nil, errors.new({ kind = errors.INVALID,
                message = "root filter names " .. root.sku .. ", which is not a root product",
                details = { code = "not_a_root_product" } }) end
            item_filter.root_id = root.product_id
        end
        if q.parent then
            local parent, perr = anchor(tx, catalog_id, q.parent :: types.ProductRef)
            if perr or not parent then return nil, perr end
            item_filter.parent_id = parent.product_id
        end
        local conditions = read_model.item_conditions(catalog_id, item_filter)
        if q.published then
            conditions[#conditions + 1] = read_model.published_condition(catalog_id, channel)
        end
        if q.ready then
            local column: string? = nil
            for _, c in ipairs(compiled.layout.flags) do
                if c.ctx == q.ready.set then column = c.column end
            end
            if not column then return nil, invalid("unknown requirement set " .. tostring(q.ready.set)) end
            if pending[column :: string] then return nil, building("readiness of " .. tostring(q.ready.set)) end
            conditions[#conditions + 1] = read_model.ready_condition(column :: string, q.ready.value == true)
        end
        local resolve_field = field_resolver(compiled, pending)
        for _, a in ipairs(admitted) do
            if not (compiled.scopes or {})[a.scope.id] then return nil, errors.new({ kind = errors.INVALID,
                message = "scope " .. a.scope.id .. " is not adopted by this catalog",
                details = { code = "scope_not_adopted" } }) end
        end
        if type(q.text) == "string" and q.text ~= "" then
            for _, c in ipairs(compiled.layout.search) do
                if pending[c.column] then return nil, building("text search") end
            end
        end
        local columns: { types.Attribute }? = nil
        if q.columns ~= nil then
            if #q.columns > consts.LIMITS.columns then return nil, invalid("at most " .. consts.LIMITS.columns .. " columns") end
            columns = {}
            for _, code in ipairs(q.columns) do
                local attr = compiled.attributes[code]
                if not attr then return nil, invalid("unknown column " .. tostring(code)) end
                columns[#columns + 1] = attr
            end
            local cerr = schema.check_context(compiled.dimensions, q.context)
            if cerr then return nil, cerr end
        end
        local page: types.ItemQuery = { where = q.where, text = q.text, sort = q.sort, after = after,
            count = q.count and consts.LIMITS.count or nil, scan = consts.LIMITS.scan }
        local plan, berr = select.items(caller, layout.of(catalog.item_table, compiled.layout), dialect, page, resolve_field, admitted,
            conditions, { "version", "status", "family" })
        if berr or not plan then return nil, berr end
        local rows, total, estimated, stopped, ierr = read_model.items(tx, dialect, plan, limit)
        if ierr or not rows then return nil, ierr end
        local out: { types.QueryItem } = {}
        for i = 1, math.min(#rows, limit) do
            local r: types.Row = rows[i]
            local decoded, derr = store.decode_row(r, { product_id = "text", sku = "text", version = "int", status = "text", family = "text" })
            if derr or not decoded then return nil, derr end
            r = decoded
            out[i] = { product_id = (r.product_id :: string), sku = (r.sku :: string), version = (r.version :: integer),
                status = (r.status :: string), family = (r.family :: string) }
        end
        if columns then
            local cache: { [string]: types.Product } = {}
            for _, item in ipairs(out) do
                local p, perr = store.load(tx, catalog_id, cache, item.product_id :: string)
                if perr then return nil, perr end
                if p then
                    local lineage, lerr = store.lineage(tx, catalog_id, p, cache)
                    if lerr or not lineage then return nil, lerr end
                    local values: { [string]: types.Value } = {}
                    for _, attr in ipairs(columns) do
                        local res = resolve.resolve(compiled, p, lineage, attr, q.context)
                        if res.value ~= nil then values[attr.code] = res.value end
                    end
                    item.values = values
                end
            end
        end
        local position = stopped or (#rows > limit and select.cursor_of(rows[limit], plan.sort_column) or nil)
        return { items = out, after = position and query_token(position) or nil,
            total = total, estimated = estimated, incomplete = stopped ~= nil or nil }, nil
    end, q.min_seq)
end

-- get_schema(catalog_id) returns the active declaration and the compiled model's
-- public parts: attributes, families, channels, dimensions and layout.
local function add_plugin_references(catalog_id: string, views: { types.PluginOption }, compiled: types.Compiled): error?
    local refs: { [string]: types.PluginReferences } = {}
    for _, plugin in ipairs(views) do
        if plugin.active and (not plugin.installed or plugin.problem and plugin.problem.code == "plugin_interface_version_unsupported") then
            local reference: types.PluginReferences = { fields = {}, scopes = {}, checks = {}, plugins = {}, shell_bindings = {} }
            refs[plugin.plugin], plugin.references = reference, reference
        end
    end
    if next(refs) == nil then return nil end
    local owners = compiled.seam_owners or {}
    for code, attr in pairs(compiled.attributes) do
        local affected: { [string]: boolean } = {}
        local function mark(owner: string?)
            if owner and refs[owner] then affected[owner] = true end
        end
        local function targets(config: types.AttributeConfig)
            if config.target then mark(owners[config.target]) end
            for _, member in pairs(config.members or {}) do targets(member) end
        end
        mark(compiled.aspects[attr.aspect].plugin)
        mark(owners[attr.type])
        targets(attr.config)
        for owner in pairs(affected) do refs[owner].fields[#refs[owner].fields + 1] = code end
    end
    for scope in pairs(compiled.scopes) do
        local ref = refs[owners[scope]]
        if ref then ref.scopes[#ref.scopes + 1] = scope end
    end
    for family, definition in pairs(compiled.families) do
        for _, check in ipairs(definition.checks) do
            local ref = refs[owners[check.fn]]
            if ref then ref.checks[#ref.checks + 1] = family .. " · " .. check.fn end
        end
    end
    for _, plugin in ipairs(views) do
        for _, required in ipairs(plugin.requires) do
            if plugin.active and refs[required] then refs[required].plugins[#refs[required].plugins + 1] = plugin.plugin end
        end
    end
    local catalog, err = component.query({ component_ids = { catalog_id }, access_mask = component.ACCESS.READ, include = { meta = true }, limit = 1 })
    if err then return err end
    local row = catalog and catalog[1]
    local binding = row and row.meta and row.meta.pim_ui_app
    if type(binding) == "string" then
        local owner = owners[binding]
        if owner then
            if refs[owner] then refs[owner].shell_bindings[1] = binding end
        else
            local apps, app_err = registry.find({ [".id"] = binding, [".kind"] = "registry.entry", ["meta.type"] = "kickside.pim.ui.app" })
            if app_err then return app_err end
            if not apps or not apps[1] then
                for _, ref in pairs(refs) do ref.shell_bindings[1] = binding end
            end
        end
    end
    for _, ref in pairs(refs) do
        table.sort(ref.fields)
        table.sort(ref.scopes)
        table.sort(ref.checks)
        table.sort(ref.plugins)
    end
    return nil
end

local function plugin_views(catalog_id: string, states: { [string]: types.PluginIntent }, compiled: types.Compiled): ({ types.PluginOption }?, error?)
    local views, err = plugins.list(states, compiled.plugins, function(plugin: types.Plugin, intent: types.PluginIntent?)
        return plugin_projections.states(catalog_id, plugin, intent)
    end)
    if err or not views then return nil, err end
    local by_attachment: { [string]: types.PluginOption } = {}
    local attachment_ids: { string } = {}
    for _, view in ipairs(views) do
        local id = view.attachment_id
        if view.active and not view.installed and id then
            by_attachment[id] = view
            attachment_ids[#attachment_ids + 1] = id
        end
    end
    -- The readable catalog's own attachment retains the package title after
    -- uninstall. Only fetch metadata for the exact attachments missing titles.
    for start = 1, #attachment_ids, 100 do
        local ids: { string } = {}
        for i = start, math.min(start + 99, #attachment_ids) do ids[#ids + 1] = attachment_ids[i] end
        local rows, title_err = component.list_system({ component_ids = ids, include = { meta = true }, limit = #ids })
        if title_err then return nil, title_err end
        for _, row in ipairs(rows or {}) do
            local title = row.meta and row.meta.title
            if type(title) == "string" and title ~= "" then by_attachment[row.component_id].title = title end
        end
    end
    local refs_err = add_plugin_references(catalog_id, views, compiled)
    if refs_err then return nil, refs_err end
    return views, nil
end
function M.plugin_context(catalog_id: string, plugin: string): (types.PluginContext?, error?)
    local _, access_err = access.reader(catalog_id)
    if access_err then return nil, access_err end
    local state, _, err = store.snapshot(catalog_id, function(_tx: types.Executor, catalog: types.Catalog, _dialect: string): (types.PluginIntent?, error?)
        if not catalog.compiled.plugins[plugin] then
            return nil, errors.new({ kind = errors.NOT_FOUND, retryable = false, message = "plugin is inactive",
                details = { code = "plugin_inactive", plugin = plugin } })
        end
        local intent = catalog.plugin_state[plugin]
        if not intent then return nil, failure.corrupt("active plugin has no lifecycle intent", "plugin_state") end
        return intent, nil
    end)
    if err or not state then return nil, err end
    local declaration, derr = plugins.load(plugin)
    if derr or not declaration then return nil, derr end
    local _, cerr = plugins.merged(declaration, {}, state.config)
    if cerr then return nil, cerr end
    local projections, perr = plugin_projections.states(catalog_id, declaration, state)
    if perr then return nil, perr end
    local binding, berr = registry.get("kickside.pim.binding:catalog")
    if berr then return nil, berr end
    local retention = (binding :: { meta: { retention: { event_days: integer } } }).meta.retention
    return { attachment_id = state.attachment_id, config = state.config, lifecycle = state.lifecycle,
        projections = projections or {}, retention = { event_days = retention.event_days } }, nil
end
function M.get_schema(catalog_id: string, request: types.GetSchemaRequest?): (types.SchemaView?, error?)
    local caller, access_err = access.reader(catalog_id)
    if access_err or not caller then return nil, access_err end
    local wanted = request and request.generation
    local captured: {[string]:types.PluginIntent}={}
    local compiled: types.Compiled? = nil
    local view: types.SchemaView?, verr: error? = with_snapshot(caller, function(tx: types.Executor, catalog: types.Catalog,
        _dialect: string): (types.SchemaView?, error?)
        local g, err = store.generation(tx, catalog_id, wanted or catalog.generation)
        if err then return nil, err end
        if not g then return nil, errors.new({ kind = errors.NOT_FOUND, message = "schema generation not found", details = { code = "schema_generation_not_found" } }) end
        local declaration = g.declaration
        local c = g.compiled
        local attributes: { [string]: types.AttributeView } = {}
        for code, a in pairs(c.attributes) do
            attributes[code] = { id = a.id, type = a.type, form = a.form, scope = a.scope, cardinality = a.cardinality, index = a.index,
                index_contexts = a.index_contexts, unique = a.unique, vocabulary = a.vocabulary, default = a.default,
                plugin = c.aspects[a.aspect].plugin, config = a.config, width = schema.width_of(a) }
        end
        captured=catalog.plugin_state
        compiled=c
        return { access = { read = caller.allows("read"), write = caller.allows("write"), admin = caller.allows("admin") },
            schema_generation = wanted or catalog.generation, declaration = declaration, attributes = attributes,
            families = c.families, channels = c.channels or {},
            dimensions = c.dimensions, vocabularies = c.vocabularies, sources = c.sources, scopes = c.scopes or {}, plugins = {} }, nil
    end)
    if verr or not view or not compiled then return nil,verr end
    local views,perr=plugin_views(catalog_id,captured,compiled)
    if perr or not views then return nil,perr end
    view.plugins=views
    return view, nil
end

-- policy_defaults requires independent catalog READ and ADMIN before Settings.
function M.policy_defaults(catalog_id: string): (types.Policy?, error?)
    local caller, err = access.reader(catalog_id)
    if err or not caller then return nil, err end
    if not caller.allows("admin") then
        return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = "catalog administration is required",
            details = { code = "catalog_access_denied" } })
    end
    local exists, cerr = store.with_db(function(db: types.Executor): (boolean?, error?)
        local rows, rerr = db:query("SELECT 1 FROM kickside_pim_catalog WHERE catalog_id = $1", { catalog_id })
        if rerr then return nil, rerr end
        return rows and rows[1] ~= nil, nil
    end)
    if cerr then return nil, cerr end
    if not exists then return nil, failure.catalog_not_initialized() end
    return defaults.deployment()
end
-- schema_options answers what a catalog's schema may name from the registry:
-- attribute types, product scopes, plugins and bound link kinds. It needs READ
-- on the catalog; each listing shows only entries the caller may read.
function M.schema_options(catalog_id: string, _request: types.SchemaOptionsRequest?): (types.SchemaOptions?, error?)
    local _, access_err = access.reader(catalog_id)
    if access_err then return nil, access_err end
    local types_list, terr = seams.find_types()
    if terr or not types_list then return nil, terr end
    local scope_list, serr = scopes.find()
    if serr or not scope_list then return nil, serr end
    local db, derr = store.open()
    if derr or not db then return nil, derr end
    local catalog, cerr = store.catalog(db, catalog_id)
    cerr = store.release(db, cerr)
    if cerr then return nil, cerr end
    if not catalog then return nil, failure.catalog_not_initialized() end
    local plugin_list, perr = plugin_views(catalog_id, catalog.plugin_state, catalog.compiled)
    if perr or not plugin_list then return nil, perr end
    local kinds, kerr = links.kinds()
    if kerr or not kinds then return nil, kerr end
    local link_kinds: { types.LinkKindOption } = {}
    for _, t in pairs(kinds) do link_kinds[#link_kinds + 1] = { kind = t.kind, binding = t.binding, title = t.title } end
    table.sort(link_kinds, function(a: types.LinkKindOption, b: types.LinkKindOption): boolean return a.kind < b.kind end)
    return { types = types_list, scopes = scope_list, plugins = plugin_list, link_kinds = link_kinds }, nil
end

-- list_terms(catalog_id, { vocabulary, parent?, retired?, limit?, after? }) pages a
-- vocabulary's terms by code; next is the cursor of the following page.
function M.list_terms(catalog_id: string, request: types.ListTermsRequest): (types.ListTermsResult?, error?)
    local caller, access_err = access.reader(catalog_id)
    if access_err or not caller then return nil, access_err end
    local limit = request.limit or consts.LIMITS.page
    if limit < 1 or limit > consts.LIMITS.page then return nil, invalid("limit must be 1.." .. consts.LIMITS.page) end
    return with_snapshot(caller, function(tx: types.Executor, catalog: types.Catalog, _dialect: string): (types.ListTermsResult?, error?)
        if not catalog.compiled.vocabularies[request.vocabulary] then return nil, invalid("unknown vocabulary " .. tostring(request.vocabulary)) end
        local rows, err = store.terms(tx, catalog_id, request.vocabulary, { parent = request.parent, retired = request.retired, after = request.after }, limit + 1)
        if err or not rows then return nil, err end
        local terms: { types.TermView } = {}
        for i = 1, math.min(#rows, limit) do
            local t = rows[i]
            terms[i] = { code = t.code, labels = t.labels, parent = t.parent, retired = t.retired == 1 }
        end
        local next_cursor: string? = nil
        if #rows > limit then next_cursor = terms[limit].code end
        return { terms = terms, next = next_cursor }, nil
    end)
end

-- history(catalog_id, { product?, before?, limit?, min_seq? }) pages the change
-- history newest first (spec 5.6). `before` is the `next` cursor of the previous
-- page; history outlives event retention because it reads the change rows.
function M.history(catalog_id: string, request: types.HistoryRequest?): (types.HistoryResult?, error?)
    local caller, access_err = access.reader(catalog_id)
    if access_err or not caller then return nil, access_err end
    local q: types.HistoryRequest = request or {}
    local limit = q.limit or consts.LIMITS.page_default
    if limit < 1 or limit > consts.LIMITS.page then return nil, invalid("limit must be 1.." .. consts.LIMITS.page) end
    if q.before ~= nil then
        local seq, n = history.cursor(tostring(q.before))
        if not seq or not n then return nil, invalid("before must be a history cursor") end
    end
    return with_snapshot(caller, function(tx: types.Executor, catalog: types.Catalog, _dialect: string): (types.HistoryResult?, error?)
        local subject: string? = nil
        local product_id: string? = nil
        local skus: { [string]: string | false } = {}
        local function product_not_found(): error
            return errors.new({ kind = errors.NOT_FOUND, message = "product not found", details = { code = "product_not_found" } })
        end
        if q.product then
            local ref: types.ProductRef = q.product :: types.ProductRef
            if type(ref.id) == "string" then
                product_id = ref.id
            elseif type(ref.sku) == "string" then
                local p, perr = store.product_by_sku(tx, catalog_id, ref.sku)
                if perr then return nil, perr end
                if not p then return nil, product_not_found() end
                product_id = p.product_id
                skus[product_id] = p.sku
            else
                return nil, product_not_found()
            end
            subject = "p:" .. product_id
        end
        local rows, next_cursor, err = history.page(tx, catalog_id, { subject = subject, before = q.before, limit = limit })
        if err or not rows then return nil, err end
        if product_id and subject and #rows == 0 and skus[product_id] == nil then
            local p, perr = store.product(tx, catalog_id, product_id)
            if perr then return nil, perr end
            if not p then
                local retained, herr = history.has_subject(tx, catalog_id, subject)
                if herr then return nil, herr end
                if not retained then return nil, product_not_found() end
            end
        end
        local by_id = catalog.compiled.by_id or {}
        local entries: { types.HistoryEntry } = {}
        for _, r in ipairs(rows) do
            local attr = r.attribute_id and by_id[r.attribute_id :: integer] or nil
            local sku: string? = nil
            if r.subject:sub(1, 2) == "p:" then
                local product_id = r.subject:sub(3)
                if skus[product_id] == nil then
                    local p, perr = store.product(tx, catalog_id, product_id :: string)
                    if perr then return nil, perr end
                    skus[product_id] = p and p.sku or false
                end
                local cached = skus[product_id]
                if type(cached) == "string" then sku = cached end
            end
            entries[#entries + 1] = { seq = r.seq, n = r.n, subject = r.subject, sku = sku, kind = r.kind, attribute_id = r.attribute_id,
                attribute = attr and attr.code or nil, ctx = r.ctx, before = r.before, after = r.after, actor = r.actor,
                source = r.source, origin = r.origin, at = r.at }
        end
        return { entries = entries, next = next_cursor }, nil
    end, q.min_seq)
end

-- proposals(catalog_id, { status?, limit? }) lists proposals for review.
function M.proposals(catalog_id: string, request: types.ProposalsRequest?): (types.ProposalsResult?, error?)
    local caller, access_err = access.reader(catalog_id)
    if access_err or not caller then return nil, access_err end
    local q: types.ProposalsRequest = request or {}
    local limit = q.limit or consts.LIMITS.page_default
    if limit < 1 or limit > consts.LIMITS.page then return nil, invalid("limit must be 1.." .. consts.LIMITS.page) end
    local db, err = store.open()
    if not db then return nil, err end
    local list, lerr = proposal_rows.list(db, catalog_id, q.status, limit + 1, q.after)
    lerr = store.release(db, lerr)
    if lerr then return nil, lerr end
    local rows = list or {}
    local more = #rows > limit
    if more then table.remove(rows) end
    local last = rows[#rows]
    return { proposals = rows, next = last and { created_at = last.created_at, proposal_id = last.proposal_id } or q.after, has_more = more }, nil
end

-- links(catalog_id, { kind, target, after?, limit? }) lists the live products
-- whose values reference target, for every ref kind.
function M.links(catalog_id: string, request: types.LinksRequest): (types.LinksResult?, error?)
    local caller, access_err = access.reader(catalog_id)
    if access_err or not caller then return nil, access_err end
    local limit = request.limit or consts.LIMITS.page_default
    if limit < 1 or limit > consts.LIMITS.page then return nil, invalid("limit must be 1.." .. consts.LIMITS.page) end
    local after = request.after
    if after ~= nil and (type(after.product_id) ~= "string" or math.type(after.attribute_id) ~= "integer"
        or type(after.ctx) ~= "string" or type(after.path) ~= "string") then
        return nil, invalid("after must be a links cursor")
    end
    return with_snapshot(caller, function(tx: types.Executor, catalog: types.Catalog, dialect: string): (types.LinksResult?, error?)
        local rows, err = read_model.links(tx, dialect, catalog_id, request.kind, request.target, request.after, limit + 1)
        if err then return nil, err end
        local by_id = catalog.compiled.by_id or {}
        local items: { types.LinkRow } = {}
        for i = 1, math.min(#(rows or {}), limit) do
            local r: types.Row = rows[i]
            local decoded, derr = store.decode_row(r, { product_id = "text", sku = "text", attribute_id = "int", ctx = "text", path = "text" })
            if derr or not decoded then return nil, derr end
            r = decoded
            local attribute_id = (r.attribute_id :: integer)
            local attr = by_id[attribute_id]
            items[i] = { product_id = (r.product_id :: string), sku = (r.sku :: string), attribute_id = attribute_id,
                attribute = attr and attr.code or nil, ctx = (r.ctx :: string), path = (r.path :: string) }
        end
        local next_cursor: types.LinksCursor? = nil
        if #(rows or {}) > limit then
            local last = items[#items]
            next_cursor = { product_id = last.product_id, attribute_id = last.attribute_id, ctx = last.ctx, path = last.path }
        end
        return { items = items, next = next_cursor }, nil
    end)
end

-- explain(catalog_id, { product, attr, context? }) shows how a value resolved:
-- the candidate contexts in order, the resolution, and the readiness findings.
function M.explain(catalog_id: string, request: types.ExplainRequest): (types.ExplainResult?, error?)
    local caller, access_err = access.reader(catalog_id)
    if access_err or not caller then return nil, access_err end
    return with_snapshot(caller, function(tx: types.Executor, catalog: types.Catalog, _dialect: string): (types.ExplainResult?, error?)
        local compiled = catalog.compiled
        local attr = compiled.attributes[request.attr]
        if not attr then return nil, invalid("unknown attribute " .. request.attr) end
        local cerr = schema.check_context(compiled.dimensions, request.context)
        if cerr then return nil, cerr end
        local ref = request.product
        local p: types.Product?
        local err: error?
        if ref.id then p, err = store.product(tx, catalog_id, ref.id :: string)
        elseif ref.sku then p, err = store.product_by_sku(tx, catalog_id, ref.sku :: string)
        else return nil, invalid("product id or sku required") end
        if err then return nil, err end
        if not p or p.state ~= "live" then return nil, errors.new({ kind = errors.NOT_FOUND, message = "product not found", details = { code = "product_not_found" } }) end
        local lineage, lerr = store.lineage(tx, catalog_id, p)
        if lerr or not lineage then return nil, lerr end
        local r = resolve.resolve(compiled, p, lineage, attr, request.context)
        local findings: { [string]: { types.Finding } }? = nil
        if p.is_item == 1 then
            local ferr: error?
            findings, ferr = readiness(tx, catalog, p)
            if ferr then return nil, ferr end
        end
        return { attribute = attr.code, candidates = resolve.candidates(compiled, attr, request.context),
            resolution = { state = r.state, value = r.value, source = r.source, ctx = r.ctx, owner = r.owner and r.owner.product_id or nil },
            findings = findings }, nil
    end)
end

return M
