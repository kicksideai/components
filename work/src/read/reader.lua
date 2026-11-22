-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local pack_catalog = require("pack_catalog")
local budget = require("budget")
local stage_runs = require("stage_runs")
local locate = require("locate")
local interval_views = require("interval_views")
local history = require("history")
local transitions = require("transitions")
local json = require("json")
local time = require("time")
local access = require("access")
local consts = require("consts")
local fields = require("fields")
local store = require("store")
local read_rows = require("read_rows")
local domain = require("domain")
local types = require("types")

local conditions = require("conditions")
local defaults = require("defaults")
local policy = require("policy")
local plugin_rows = require("plugin_rows")
local manifests = require("manifests")
local plugin_schema = require("plugin_schema")
local plugins = require("plugins")
local peers = require("peers")

local rules = require("rules")
local access_rows = require("access_rows")
local M = {}

local views = require("item_view")
local render, find = views.render, views.find

local function get_schema(request: types.SchemaGetRequest, context: types.ReadContext): (types.SchemaView?, error?)
    local unsupported = access.non_item(request)
    if unsupported then return nil, unsupported end
    local settings, serr = defaults.read()
    if serr or not settings then return nil, serr end
    local result, err = access.with_snapshot(request.board_id, nil, function(tx: types.Executor, board: domain.Board, _dialect: string): (types.SchemaView?, error?)
        local generation = request.generation or board.generation
        local row, err = store.generation(tx, board.board_id, generation)
        if err then return nil, err end
        if not row then return nil, errors.new({ details = { code = "generation_not_found" }, kind = errors.NOT_FOUND, message = "board has no generation " .. generation }) end
        local compiled: domain.JsonObject = json.decode(json.encode(row.compiled)) :: domain.JsonObject
        if request.generation == nil then
            local effective, eerr = policy.effective(settings :: domain.JsonObject, row.declaration.policy)
            if eerr then return nil, eerr end
            compiled.policy = effective
        end
        local desired, derr = plugin_rows.list(tx, board.board_id)
        if derr then return nil, derr end
        local selected, perr = plugins.list(board.board_id, desired or {}, row.compiled.plugins or {}, request.generation ~= nil)
        if perr then return nil, perr end
        local parked, perr = store.parked_migration(tx, board.board_id)
        if perr then return nil, perr end
        return { pack = row.pack, plugins = selected, declaration = row.declaration, compiled = compiled, digest = row.digest, key_prefix = row.compiled.key_prefix,
            migration_error = parked and parked.error or nil }, nil
    end, context)
    if err or not result then return nil, err end
    local result = result :: types.SchemaView
    if request.generation == nil then plugins.projections(request.board_id, result.plugins or {}) end
    if request.check_plugins then
        for _, plugin in ipairs((result.plugins or {}) :: { domain.PluginView }) do
            if plugin.active and plugin.config and not plugin.problem then
                local manifest, merr = manifests.load(plugin.plugin)
                local current = nil
                for _, entry in ipairs(result.declaration.plugins or {}) do if entry.use == plugin.plugin then current = entry.schema end end
                local resolved: domain.PluginSchema?
                local rerr = merr
                if manifest then resolved, rerr = manifests.resolve_schema(manifest, { board_id = request.board_id, config = plugin.config, current = current }) end
                if resolved and not rerr then rerr = plugin_schema.check(resolved.fragment) end
                if rerr then
                    local failure = plugins.failure(rerr)
                    failure.source = "schema_provider"
                    plugin.lifecycle = { state = "failed", error = failure }
                else plugin.outdated = (resolved and resolved.digest or nil) ~= plugin.digest or (resolved and resolved.version or nil) ~= plugin.version end
            end
        end
    end
    if result.pack then
        local outdated, perr = pack_catalog.outdated(result.pack.id :: string, result.pack.version :: string, result.pack.digest :: string)
        if perr then return nil, perr end
        result.outdated = outdated
    end
    return { pack = result.pack, outdated = result.outdated, plugins = result.plugins, declaration = result.declaration, compiled = result.compiled, digest = result.digest,
        key_prefix = result.key_prefix, migration_error = result.migration_error, as_of = result.as_of,
        generation = request.generation or result.generation } :: types.SchemaView, nil
end

local function has(include: { string }?, name: string): boolean
    for _, n in ipairs(include or {}) do
        if n == name then return true end
    end
    return false
end

local function get(request: types.GetRequest, board_id: string, ref: types.ItemRef, context: types.ReadContext): (types.GetResult?, error?)
    local unsupported = access.non_item(request)
    if unsupported then return nil, unsupported end
    local writable = false
    if has(request.include, "transitions") then
        local werr: error?
        writable, werr = conditions.writable(board_id)
        if werr then return nil, werr end
    end
    local grants, gerr = access.effective(board_id)
    if gerr or not grants then return nil, gerr end
    local metadata, merr = locate.metadata(board_id, 1)
    if merr or not metadata then return nil, merr end
    local catalog: { [string]: domain.Field } = {}
    local result, err = access.with_snapshot(board_id, request.min_seq, function(tx: types.Executor, board: domain.Board, _dialect: string): (types.GetResult?, error?)
        catalog = peers.catalog(board)
        local item, err = find(tx, board, ref)
        if err then return nil, err end
        if not item then return nil, errors.new({ kind = errors.NOT_FOUND, message = "item not found", details = { code = "item_not_found" } }) end
        local view, verr = render(tx, board, item, true)
        if verr or not view then return nil, verr end
        local out: types.GetResult = { item = view, access = grants, title = metadata.title, description = metadata.description, icon = metadata.icon }
        local item_type = board.model.item_types[item.type]
        if grants.write and item.life == "live" and item_type and #item_type.fields > 0 then
            local edits: { [string]: domain.FieldEdit } = {}
            for _, code in ipairs(item_type.fields) do
                local field = board.model.fields[code]
                if field then edits[code] = rules.field_edit(board, field, item.document) end
            end
            out.field_edit = edits
        end
        if has(request.include, "links") then
            local rows, lerr = read_rows.links(tx, board.board_id, item.item_id, nil, "both", nil, 200)
            if lerr then return nil, lerr end
            local links: { types.LinkView } = {}
            for _, row in ipairs(rows or {}) do
                local outward = row.board_id == board.board_id and row.from_id == item.item_id
                local at, decode_err = store.need(row, "at")
                if decode_err or at == nil then return nil, decode_err end

                local peer_id, decode_err = store.need(row, outward and "to_id" or "from_id")
                if decode_err or peer_id == nil then return nil, decode_err end

                local peer_board, decode_err = store.need(row, outward and "to_board_id" or "board_id")
                if decode_err or peer_board == nil then return nil, decode_err end

                local relation_type, decode_err = store.need(row, "type")
                if decode_err or relation_type == nil then return nil, decode_err end

                links[#links + 1] = { type = relation_type, direction = outward and "outward" or "inward",
                    board = peer_board, item = peer_id, at = at }
            end
            out.links = links
        end
        if has(request.include, "transitions") then
            local listed, lerr = transitions.list(tx, board, { item }, _dialect, writable)
            if lerr or not listed then return nil, lerr end
            out.transitions = listed[item.item_id]
        end
        if has(request.include, "children") then
            local rows, cerr = store.children(tx, board.board_id, item.item_id, consts.LIMITS.children)
            if cerr or not rows then return nil, cerr end
            local children: { types.ItemView } = {}
            for _, row in ipairs(rows) do
                local allowed, aerr = access_rows.permits(tx, board, row.item_id)
                if aerr then return nil, aerr end
                if allowed then
                    local child, verr = render(tx, board, row)
                    if verr or not child then return nil, verr end
                    children[#children + 1] = child
                end
            end
            out.children = children
        end
        if has(request.include, "stage_runs") then
            local page, rerr = stage_runs.page(tx, board, item, consts.LIMITS.page, nil, true)
            if rerr or not page then return nil, rerr end
            out.stage_runs = page.stage_runs
        end
        if has(request.include, "comments") then
            local rows, cerr = store.comments(tx, board.board_id, item.item_id, consts.LIMITS.comments)
            if cerr or not rows then return nil, cerr end
            local comments: { types.CommentView } = {}
            for _, row in ipairs(rows) do
                comments[#comments + 1] = { id = row.comment_id, body = row.body, mentions = row.mentions, author = row.author, version = row.version,
                    created_at = row.created_at, edited_at = row.edited_at }
            end
            out.comments = comments
        end
        return out, nil
    end, context)
    if err or not result then return nil, err end
    local redact = peers.redactor(catalog)
    local rerr = peers.items({ result.item }, redact)
    if not rerr then rerr = peers.items(result.children or {}, redact) end
    if rerr then return nil, rerr end
    for _, link in ipairs(result.links or {}) do
        if link.board and link.item then
            local visible, perr = peers.visible(link.board :: string, link.item :: string)
            if perr then return nil, perr end
            if not visible then link.board = nil; link.item = nil; link.unavailable = true end
        end
    end
    return result, nil
end

local function not_found(): error
    return errors.new({ kind = errors.NOT_FOUND, message = "item not found", details = { code = "item_not_found" } })
end

-- A supplied board is the origin of the key. Only an omitted board allows global lookup.
local function get_by_key(request: types.GetRequest, context: types.ReadContext): (types.GetResult?, error?)
    local origin = request.board_id
    if origin then
        local err = access.admit(origin)
        if err then return nil, err end
    end
    local unsupported = access.non_item(request)
    if unsupported then return nil, unsupported end
    local key = request.item.key
    if key == nil or key == "" then return nil, access.invalid("item needs an id or a key") end
    local db, err = store.open()
    if not db then return nil, err end
    local item, ierr = store.item_by_key(db, key, origin)
    db:release()
    if ierr then return nil, ierr end
    if not item then return nil, not_found() end
    local out, gerr = get(request, item.board_id, { id = item.item_id }, context)
    if gerr then
        if gerr:kind() == errors.PERMISSION_DENIED then return nil, not_found() end
        return nil, gerr
    end
    return out, nil
end

local function get_time_in_state(request: types.TimeInStateRequest, context: types.ReadContext): (types.TimeInStateResult?, error?)
    local unsupported = access.non_item(request)
    if unsupported then return nil, unsupported end
    local catalog: { [string]: domain.Field } = {}
    local result, read_err = access.with_snapshot(request.board_id, request.min_seq, function(tx: types.Executor, board: domain.Board, _dialect: string): (types.TimeInStateResult?, error?)
        catalog = peers.catalog(board)
        local item, err = find(tx, board, request.item)
        if err then return nil, err end
        if not item then return nil, errors.new({ kind = errors.NOT_FOUND, message = "item not found", details = { code = "item_not_found" } }) end
        local name = request.field or "state"
        local interval = name
        if name ~= "state" and name ~= "category" then
            local field = board.model.fields[name]
            if not field or not field.intervals then return nil, access.invalid("field " .. name .. " does not record intervals") end
            if not rules.field(board, field, "read", item.document) then return nil, rules.denied(name) end
            interval = tostring(field.id)
        end
        local held, ierr = store.intervals(tx, board.board_id, item.item_id, interval, consts.LIMITS.page + 1, request.after)
        if ierr or not held then return nil, ierr end
        local after: integer? = nil
        if #held > consts.LIMITS.page then
            table.remove(held)
            after = held[#held].start_seq
        end
        local periods, verr = interval_views.render(board, held, item.document)
        if verr or not periods then return nil, verr end
        local raw, terr = store.interval_totals(tx, board.board_id, item.item_id, interval, time.now():utc():format("2006-01-02T15:04:05.000000000Z"), _dialect)
        if terr or not raw then return nil, terr end
        local totals: { [string]: integer } = table.create(0, 1)
        for key, duration in pairs(raw) do
            local rendered = key
            if name ~= "state" and name ~= "category" then
                local value, decode_err = store.stored(key, nil :: domain.Value?)
                if decode_err then return nil, decode_err end

                local surface, serr = fields.surface(board.model.fields[name] :: domain.Field, value :: domain.Value)
                if serr then return nil, serr end
                rendered = type(surface) == "string" and surface or json.encode(surface)
            end
            totals[rendered] = (totals[rendered] or 0) + duration
        end
        return { field = name, periods = periods, totals = totals, after = after }, nil
    end, context)
    if read_err or not result then return nil, read_err end
    local redact = peers.redactor(catalog)
    local ierr = interval_views.redact(result.periods, redact)
    if ierr then return nil, ierr end
    local totals, terr = interval_views.totals(result.field, result.totals, catalog, redact)
    if terr or not totals then return nil, terr end
    result.totals = totals
    return result :: types.TimeInStateResult, nil
end

M.find = find

function M.get_schema(request: types.SchemaGetRequest): (types.SchemaView?, error?)
    return budget.run(request, function(context: types.ReadContext): (types.SchemaView?, error?) return get_schema(request, context) end)
end
function M.get(request: types.GetRequest, board_id: string): (types.GetResult?, error?)
    return budget.run(request, function(context: types.ReadContext): (types.GetResult?, error?) return get(request, board_id, request.item, context) end)
end
function M.get_by_key(request: types.GetRequest): (types.GetResult?, error?)
    return budget.run(request, function(context: types.ReadContext): (types.GetResult?, error?) return get_by_key(request, context) end)
end
M.list_history = history.list_history

function M.get_time_in_state(request: types.TimeInStateRequest): (types.TimeInStateResult?, error?)
    return budget.run(request, function(context: types.ReadContext): (types.TimeInStateResult?, error?) return get_time_in_state(request, context) end)
end

M.list_stage_runs = stage_runs.list
return M
