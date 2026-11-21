-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry_values = require("registry_values")
-- Saved views carry query and presentation data and evaluate under the viewer.
local component = require("component")
local child_registration = require("child_registration")
local security = require("security")
local component_envelope = require("component_envelope")
local component_types = require("component_types")
local requests = require("requests")
local query = require("query")
local cross_board = require("cross_board")
local access = require("access")
local predicates = require("predicates")
local shape = require("shape")
local registry = require("registry")
local types = require("types")
local domain = require("domain")
local reads = require("reads")
local values = require("values")
local schema = require("schema")
local M = {}
local KIND = "kickside.work.binding:view"
local function invalid(message: string, code: string?): error
    return errors.new({ kind = errors.INVALID, message = message, details = { code = code or "invalid_view" } })
end
local function view_denied(): error
    return errors.new({ kind = errors.PERMISSION_DENIED, message = "view access denied", details = { code = "access_denied" } })
end

local function selection_error(view: types.View): error?
    if not view.boards then return nil end
    local _, err = cross_board.selection(view.boards)
    if err and err:kind() == errors.PERMISSION_DENIED then return view_denied() end
    return err
end

local function validate_fields(view: types.View, model: domain.Model, requires: types.ViewRequirements?): error?
    local resolve = predicates.targets(model.compiled)
    for _, field in ipairs(view.columns or {}) do
        if not model.fields[field] then
            local _, err = resolve(field)
            if err then return err end
        end
    end
    if requires and requires.group_by and view.group_by then
        local field = model.fields[view.group_by]
        local kind = field and field.type or view.group_by
        for _, value in ipairs(requires.group_by.kinds or {}) do if value == kind then return nil end end
        return invalid("view type refuses this group_by kind")
    end
    return nil
end

local function view_type(id: string): (domain.JsonObject?, error?)
    local matches, err = registry.find({ [".kind"] = "registry.entry", ["meta.type"] = "kickside.work.ui.view", ["meta.id"] = id })
    if err or not matches or #matches ~= 1 then return nil, err end
    return registry_values.canonical(matches[1].meta or {}) :: domain.JsonObject, nil
end

function M.validate(board_id: string, view: types.View, proposed: domain.Compiled?): error?
    local meta, merr = view_type(view.type)
    if merr then return merr end
    if not meta then return invalid("view type is unavailable") end
    local requires = meta.requires :: types.ViewRequirements?
    if requires and requires.group_by and not view.group_by then return invalid("view type requires group_by") end
    local config_schema = meta.config_schema
    if type(config_schema) ~= "table" then return invalid("view type declares config_schema") end
    local cerr = shape.check(shape.tolerant(config_schema :: domain.JsonObject), view.config or {}, "view config")
    if cerr then return cerr end
    local request: reads.QueryRequest = { group_by = view.group_by, sub_group_by = view.sub_group_by, board_id = board_id,
        where = view.where, order = view.order, scopes = view.scopes, boards = view.boards }
    if view.boards then
        return cross_board.validate(request, view.columns or {})
    end
    if proposed then
        local model = schema.model(proposed)
        return query.validate_definition(request, proposed, model) or validate_fields(view, model, requires)
    end
    local _, err = query.explain(request)
    if err then return err end
    local _, verr = access.with_snapshot(board_id, nil, function(_tx: reads.Executor, board: domain.Board, _dialect: string): (reads.ReadStamp?, error?)
        local field_err = validate_fields(view, board.model, requires)
        if field_err then return nil, field_err end
        return {}, nil
    end)
    return verr
end

local function load(view_id: string, mask: integer): (types.ViewContext?, error?)
    local rows, err = component.query({ component_ids = { view_id }, impl_ids = { KIND }, limit = 1 })
    if err then return nil, err :: error end
    if not rows or #rows ~= 1 then return nil, view_denied() end
    local context, cerr = component.get_context(view_id, mask)
    if cerr or not context then return nil, cerr :: error? end
    return context :: types.ViewContext, nil
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

local function title_command(view_id: string, title: string): ({ type: string, payload: { fields: { [string]: string } } }?, error?)
    local context, err = managed(view_id)
    if err or not context then return nil, err end
    return { type = "SET_META", payload = { fields = { title = title } } }, nil
end

function M.rename(input: unknown): (types.ViewResult?, error?)
    local perr = requests.parse("rename", input, "kickside.work:view")
    if perr then return nil, perr end
    local request = input :: types.RenameViewRequest
    local change, err = title_command(request.view_id, request.title)
    if err or not change then return nil, err end
    local updated, uerr = component.set_meta(request.view_id, change.payload.fields, { trusted_runtime = true })
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
    local aerr = access.admit(request.board_id, request.personal and component.ACCESS.READ or component.ACCESS.WRITE)
    if aerr then return nil, aerr end
    local verr = M.validate(request.board_id, request.view)
    if verr then return nil, verr end
    local registration = { component_id = component_id, impl_id = KIND, parent_id = not request.personal and request.board_id or nil,
        private_context = { board_id = request.board_id, view = request.view },
        meta = { title = request.title or "View", board_id = request.board_id } }
    local out, err
    if request.personal then
        local service, serr = component.get_service()
        if serr or not service then return nil, serr :: error? end
        out, err = service:register(registration)
    else
        out = child_registration.register_owned_child(registration)
    end
    if err then return nil, err :: error end
    local eerr = component_envelope.error_of(out :: component_types.ServiceEnvelope, "register")
    if eerr then return nil, eerr end
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
    local title: component_types.Command? = nil
    if request.title ~= nil then
        local terr: error?
        title, terr = title_command(request.view_id, request.title)
        if terr then return nil, terr end
    end
    local context, err = load(request.view_id, component.ACCESS.WRITE :: integer)
    if err or not context then return nil, err end
    if request.view.boards then
        local aerr = access.admit(context.board_id)
        if aerr then return nil, aerr end
    end
    local verr = M.validate(context.board_id, request.view)
    if verr then return nil, verr end
    local commands: { component_types.Command } = { { type = "PATCH_CONTEXT", payload = { patch = { view = request.view } } } }
    if title then commands[#commands + 1] = title end
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
    local aerr = access.admit(context.board_id)
    if aerr then return nil, aerr end
    local meta, merr = view_type(view.type)
    if merr then return nil, merr end
    if not meta then
        local serr = selection_error(view)
        if serr then return nil, serr end
        return nil, errors.new({ kind = errors.UNAVAILABLE, message = "saved view type is unavailable",
            details = { code = "view_type_unavailable", view_type = view.type } })
    end
    if view.boards then
        if request.min_seq ~= nil then return nil, invalid("min_seq requires a single-board view") end
    end
    -- The top-level item cursor continues the flat page of a grouped view.
    local grouped = request.after == nil
    local result, qerr = cross_board.query({ group_by = grouped and view.group_by or nil, sub_group_by = grouped and view.sub_group_by or nil,
        board_id = context.board_id, where = view.where, order = view.order, scopes = view.scopes, boards = view.boards,
        limit = request.limit, after = request.after, cross_after = request.cross_after, group_after = request.group_after,
        group_limit = request.group_limit, measures = request.measures, min_seq = request.min_seq }, view.columns or {})
    if view.boards and qerr and qerr:kind() == errors.PERMISSION_DENIED then return nil, view_denied() end
    return result, qerr
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
    local selected_err = selection_error(context.view)
    if selected_err then return nil, selected_err end
    local rows, rerr = component.query({ component_ids = { request.view_id }, include = { meta = true }, limit = 1 })
    if rerr then return nil, rerr :: error end
    local row = rows and rows[1]
    if not row then return nil, view_denied() end
    local meta = row.meta or {}
    return { view_id = request.view_id, board_id = context.board_id, title = meta.title or "View", view = context.view }, nil
end

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
        meta = { board_id = request.board_id }, include = { meta = false },
        order_by = { field = "created_at", direction = "ASC" }, offset = offset, limit = limit + 1 })
    if err or not rows then return nil, err :: error? end
    local ids: { string } = {}
    for i = 1, math.min(#rows, limit) do ids[i] = rows[i].component_id end
    local views: { types.ViewListEntry } = {}
    if #ids == 0 then return { views = views }, nil end
    -- Component gates batch private-context reads separately. Hydrate only the admitted page.
    local page, perr = component.list_system({ component_ids = ids, impl_ids = { KIND },
        include = { meta = true, private_context = true }, limit = #ids })
    if perr or not page then return nil, perr :: error? end
    local by_id: { [string]: component_types.ComponentRow } = {}
    for _, row in ipairs(page) do by_id[row.component_id] = row end
    for _, id in ipairs(ids) do
        local row = by_id[id]
        if not row then return nil, access.changed() end
        local held = row.private_context :: types.ViewContext?
        if not held or held.board_id ~= request.board_id then
            return nil, errors.new({ kind = errors.INTERNAL, message = "view board reference does not match its index", details = { code = "row_corrupt" } })
        end
        local selected_err = selection_error(held.view)
        if selected_err then
            if selected_err:kind() ~= errors.PERMISSION_DENIED and selected_err:kind() ~= errors.INVALID then return nil, selected_err end
            views[#views + 1] = { view_id = id, board_id = held.board_id, status = "unavailable" }
        else
            local meta = row.meta or {}
            views[#views + 1] = { view_id = id, board_id = held.board_id, title = meta.title or "View", view = held.view }
        end
    end
    return { views = views, after = #rows > limit and tostring(offset + limit) or nil }, nil
end
return M
