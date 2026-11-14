-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry_values = require("registry_values")
-- Saved views carry query and presentation data and evaluate under the viewer.
local component = require("component")
local security = require("security")
local component_envelope = require("component_envelope")
local component_types = require("component_types")
local requests = require("requests")
local query = require("query")
local access = require("access")
local predicates = require("predicates")
local shape = require("shape")
local registry = require("registry")
local types = require("types")
local domain = require("domain")
local reads = require("reads")
local values = require("values")
local M = {}
local KIND = "kickside.work.binding:view"
local function invalid(message: string, code: string?): error
    return errors.new({ kind = errors.INVALID, message = message, details = { code = code or "invalid_view" } })
end
local function validate(board_id: string, view: types.View): error?
    local matches, merr = registry.find({ [".kind"] = "registry.entry", ["meta.type"] = "kickside.work.ui.view", ["meta.id"] = view.type })
    if merr then return merr end
    if not matches or #matches ~= 1 then return invalid("view type is unavailable") end
    local meta = registry_values.canonical(matches[1].meta or {})
    local config_schema = meta.config_schema
    if type(config_schema) ~= "table" then return invalid("view type declares config_schema") end
    local cerr = shape.check(shape.tolerant(config_schema :: domain.JsonObject), view.config or {}, "view config")
    if cerr then return cerr end
    local _, err = query.explain({ group_by = view.group_by, sub_group_by = view.sub_group_by, board_id = board_id,
        where = view.where, order = view.order, scopes = view.scopes })
    if err then return err end
    local _, verr = access.with_snapshot(board_id, nil, function(_tx: reads.Executor, board: domain.Board, _dialect: string): (reads.ReadStamp?, error?)
        local resolve = predicates.targets(board.compiled)
        for _, field in ipairs(view.columns or {}) do
            if not board.model.fields[field] then
                local _, err = resolve(field)
                if err then return nil, err end
            end
        end
        local requires = meta.requires :: { group_by: { kinds: { string } } }?
        if requires and requires.group_by then
            if not view.group_by then return nil, invalid("view type requires group_by") end
            local field = board.model.fields[view.group_by]
            local kind = field and field.type or view.group_by
            local allowed = false
            for _, value in ipairs(requires.group_by.kinds or {}) do if value == kind then allowed = true end end
            if not allowed then return nil, invalid("view type refuses this group_by kind") end
        end
        return {}, nil
    end)
    return verr
end

local function load(view_id: string, mask: integer): (types.ViewContext?, error?)
    local rows, err = component.query({ component_ids = { view_id }, impl_ids = { KIND }, limit = 1 })
    if err then return nil, err :: error end
    if not rows or #rows ~= 1 then return nil, errors.new({ details = { code = "access_denied" },  kind = errors.PERMISSION_DENIED, message = "view access denied" }) end
    local context, cerr = component.get_context(view_id, mask)
    if cerr or not context then return nil, cerr :: error? end
    return context :: types.ViewContext, nil
end

local function title_error(title: string): error?
    if not title:find("%S") then return invalid("view title is nonblank text", "invalid_view_title") end
    return nil
end

local function denied(): error
    return errors.new({ kind = errors.PERMISSION_DENIED, message = "view owner or board ADMIN required", details = { code = "access_denied" } })
end

-- The owning service checks authority before exposing or mutating private view state.
local function managed(view_id: string): (types.ViewContext?, error?)
    local rows, err = component.list_system({ component_ids = { view_id }, impl_ids = { KIND },
        include = { meta = true, private_context = true }, limit = 1 })
    if err then return nil, err :: error end
    if not rows or #rows ~= 1 then return nil, denied() end
    local row = rows[1]
    local context = row.private_context :: types.ViewContext
    if not context or type(context.board_id) ~= "string" then
        return nil, errors.new({ kind = errors.INTERNAL, message = "view board reference is missing", details = { code = "row_corrupt" } })
    end
    local actor = security.actor()
    if actor and row.meta and row.meta.owner == actor:id() then return context, nil end
    local _, aerr = component.validate_access(context.board_id, component.ACCESS.ADMIN)
    if aerr then
        if aerr:kind() == errors.PERMISSION_DENIED then return nil, denied() end
        return nil, aerr :: error
    end
    return context, nil
end

function M.rename(input: unknown): (types.ViewResult?, error?)
    local perr = requests.parse("rename", input, "kickside.work:view")
    if perr then return nil, perr end
    local request = input :: types.RenameViewRequest
    local terr = title_error(request.title)
    if terr then return nil, terr end
    local context, err = managed(request.view_id)
    if err or not context then return nil, err end
    local updated, uerr = component.set_meta(request.view_id, { title = request.title }, { trusted_runtime = true })
    if uerr or not updated then return nil, uerr :: error? end
    return { view_id = request.view_id }, nil
end

function M.delete(input: unknown): (types.DeleteViewResult?, error?)
    local perr = requests.parse("delete", input, "kickside.work:view")
    if perr then return nil, perr end
    local request = input :: { view_id: string }
    local context, err = managed(request.view_id)
    if err or not context then return nil, err end
    local deleted, derr = component.system_delete(request.view_id)
    if derr then
        if derr:kind() == errors.CONFLICT and (derr:details() or {}).cleanup_pending == true then
            return { view_id = request.view_id, deleted = false, in_progress = true }, nil
        end
        return nil, derr :: error
    end
    return { view_id = request.view_id, deleted = deleted, in_progress = false }, nil
end

local function create(request: types.CreateViewRequest, component_id: string?): (types.ViewResult?, error?)
    local _, aerr = component.validate_access(request.board_id, request.personal and component.ACCESS.READ or component.ACCESS.WRITE)
    if aerr then return nil, aerr :: error end
    local verr = validate(request.board_id, request.view)
    if verr then return nil, verr end
    local service, serr = component.get_service()
    if serr or not service then return nil, serr :: error? end
    local out, err = service:register({ component_id = component_id, impl_id = KIND, parent_id = not request.personal and request.board_id or nil,
        private_context = { board_id = request.board_id, view = request.view }, meta = { title = request.title or "View" } })
    if err then return nil, err :: error end
    local eerr = component_envelope.error_of(out :: component_types.ServiceEnvelope, "register")
    if eerr then return nil, eerr end
    if not request.personal then
        local owned, owner_err = component.set_meta(out.component_id :: string, { owner = request.board_id })
        if not owned then return nil, owner_err :: error? end
    end
    return { view_id = out.component_id :: string }, nil
end

function M.create(input: unknown): (types.ViewResult?, error?)
    local perr = requests.parse("create", input, "kickside.work:view")
    if perr then return nil, perr end
    return create(input :: types.CreateViewRequest, nil)
end

-- install keeps one shared component identity for a pack's named view.
function M.install(component_id: string, request: types.CreateViewRequest, revision: integer?): (types.ViewResult?, error?)
    local rows, err = component.query({ component_ids = { component_id }, impl_ids = { KIND }, include = { meta = true }, limit = 1 })
    if err then return nil, err :: error end
    if not rows or #rows == 0 then return create(request, component_id) end
    local context, cerr = component.get_context(component_id, component.ACCESS.READ)
    if cerr then return nil, cerr :: error end
    if not context or (context :: types.ViewContext).board_id ~= request.board_id then return nil, invalid("pack view identity belongs to its board", "idempotency_conflict") end
    if values.equal((context :: types.ViewContext).view, request.view) and rows[1].meta and rows[1].meta.title == request.title then
        return { view_id = component_id }, nil
    end
    return M.save({ view_id = component_id, view = request.view, title = request.title }, revision)
end

function M.save(input: unknown, revision: integer?): (types.ViewResult?, error?)
    local perr = requests.parse("save", input, "kickside.work:view")
    if perr then return nil, perr end
    local request = input :: types.SaveViewRequest
    if request.title ~= nil then
        local terr = title_error(request.title)
        if terr then return nil, terr end
        local context, aerr = managed(request.view_id)
        if aerr or not context then return nil, aerr end
    end
    local context, err = load(request.view_id, component.ACCESS.WRITE :: integer)
    if err or not context then return nil, err end
    local verr = validate(context.board_id, request.view)
    if verr then return nil, verr end
    local commands: { component_types.Command } = { { type = "PATCH_CONTEXT", payload = { patch = { view = request.view } } } }
    if request.title ~= nil then commands[#commands + 1] = { type = "SET_META", payload = { fields = { title = request.title } } } end
    local updated, uerr = component.update(request.view_id, commands, { expected_revision = revision })
    if uerr or not updated then return nil, uerr :: error? end
    return { view_id = request.view_id }, nil
end

function M.run(input: unknown): (reads.QueryResult?, error?)
    local perr = requests.parse("run", input, "kickside.work:view")
    if perr then return nil, perr end
    local request = input :: types.RunViewRequest
    local context, err = load(request.view_id, component.ACCESS.READ :: integer)
    if err or not context then return nil, err end
    local view = context.view
    return query.query({ group_by = view.group_by, sub_group_by = view.sub_group_by, board_id = context.board_id, where = view.where, order = view.order, scopes = view.scopes,
        limit = request.limit, after = request.after, min_seq = request.min_seq })
end
-- get exposes presentation only after both component ACLs admit the caller.
function M.get(input: unknown): (types.SavedView?, error?)
    local perr = requests.parse("get", input, "kickside.work:view")
    if perr then return nil, perr end
    local request = input :: { view_id: string }
    local context, err = load(request.view_id, component.ACCESS.READ :: integer)
    if err or not context then return nil, err end
    local _, aerr = component.validate_access(context.board_id, component.ACCESS.READ)
    if aerr then return nil, aerr :: error end
    local rows, rerr = component.query({ component_ids = { request.view_id }, include = { meta = true }, limit = 1 })
    if rerr then return nil, rerr :: error end
    local row = rows and rows[1]
    if not row then return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = "view access denied", details = { code = "access_denied" } }) end
    local meta = row.meta or {}
    return { view_id = request.view_id, board_id = context.board_id, title = meta.title or "View", view = context.view }, nil
end

-- list walks only actor-readable views and filters their private board reference.
function M.list(input: unknown): (types.ViewList?, error?)
    local perr = requests.parse("list", input, "kickside.work:view")
    if perr then return nil, perr end
    local request = input :: types.ListViewsRequest
    local _, aerr = component.validate_access(request.board_id, component.ACCESS.READ)
    if aerr then return nil, aerr :: error end
    local offset = request.after == nil and 0 or math.tointeger(tonumber(request.after))
    if not offset or offset < 0 then return nil, invalid("after is a view-list cursor") end
    local limit = request.limit or 100
    local rows, err = component.query({ impl_ids = { KIND }, access_mask = component.ACCESS.READ :: integer,
        include = { meta = true }, order_by = { field = "created_at", direction = "ASC" }, offset = offset, limit = limit + 1 })
    if err then return nil, err :: error end
    local views: { types.SavedView } = {}
    for i = 1, math.min(#(rows or {}), limit) do
        local row = rows[i]
        local view_id = row.component_id
        if not view_id then return nil, invalid("view row has no component id") end
        local context, cerr = component.get_context(view_id, component.ACCESS.READ)
        if cerr then return nil, cerr :: error end
        if not context then return nil, invalid("view context is unavailable") end
        local held = context :: types.ViewContext
        if held.board_id == request.board_id then
            local meta = row.meta or {}
            views[#views + 1] = { view_id = view_id, board_id = held.board_id, title = meta.title or "View", view = held.view }
        end
    end
    return { views = views, after = #(rows or {}) > limit and tostring(offset + limit) or nil }, nil
end
return M
