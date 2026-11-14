-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local resources = require("resources")
local catalog = require("catalog")
local merge = require("merge")
local declaration = require("declaration")
local schema_commands = require("schema_commands")
local guard = require("guard")
local store = require("store")
local types = require("types")
local domain = require("domain")
local commands = require("commands")
local M = {}
function M.declaration(data: types.Data): domain.Declaration
    local out = declaration.copy(data.schema)
    if data.processes then out.processes = declaration.copy(data.processes) end
    out.policy = out.policy or {}
    out.scopes = out.scopes or {}
    out.plugins = out.plugins or {}
    local listed: { [string]: boolean } = {}
    for _, plugin in ipairs(out.plugins) do listed[plugin.use] = true end
    for _, id in ipairs(data.requires) do if not listed[id] then out.plugins[#out.plugins + 1] = { use = id } end end
    return out :: domain.Declaration
end
function M.plan(request: types.Request): (types.Plan?, error?)
    local aerr = guard.require_access(request.board_id, guard.admin_access())
    if aerr then return nil, aerr end
    local pack, perr = catalog.load(request.pack, request.version)
    if perr or not pack then return nil, perr end
    for _, plugin in ipairs(pack.plugins) do
        if plugin.problem then return nil, errors.new({ kind = errors.INVALID, message = plugin.problem.message,
            details = { code = plugin.problem.code, plugin = plugin.plugin } }) end
    end
    local db, derr = store.open()
    if not db then return nil, derr end
    local snapshot, serr = schema_commands.current_schema(db, request.board_id, request.expected_generation)
    if serr or not snapshot then db:release(); return nil, serr end
    local board, local_decl = snapshot.board, snapshot.declaration
    local generation = board and board.generation or 0
    local admission_err = schema_commands.check_pack_install(db, request.board_id, board)
    if admission_err then db:release(); return nil, admission_err end
    db:release()
    local incoming = M.declaration(pack.data)
    local base = board and board.pack_base and M.declaration(board.pack_base :: types.Data) or nil
    local merged, conflicts = merge.schema(base, local_decl, incoming, request.resolutions)
    merged.key_prefix = board and board.key_prefix or (request.declaration and request.declaration.key_prefix) or incoming.key_prefix
        or ("W" .. request.board_id:gsub("-", ""):sub(1, 9):upper())
    local proposals = merge.maps(local_decl, merged)
    for _, process in ipairs(merged.processes or {}) do process.map = request.maps and request.maps[process.id] or nil end
    local managed, resource_conflicts, resource_refused, resource_err = resources.plan(request.board_id,
        board and board.pack_base and (board.pack_base :: types.Data) or nil, pack.data, request.resolutions)
    if resource_err or not managed then return nil, resource_err end
    for _, conflict in ipairs(resource_conflicts or {}) do conflicts[#conflicts + 1] = conflict end
    local prepared: commands.SchemaPlan? = nil
    local plan: { generation: integer, class: string, changes: { domain.SchemaChange }, refused: { domain.SchemaChange }, migration: string? }
    if local_decl and local_decl.visibility and not merged.visibility then
        local change: domain.SchemaChange = { code = "visibility", what = "visibility.remove", class = "refused" }
        plan = { generation = generation + 1, class = "refused", changes = { change }, refused = { change },
            migration = "create the board with the new visibility declaration and move its items" }
    else
        local classified, err = schema_commands.prepare_schema({ board_id = request.board_id, expected_generation = request.expected_generation,
            declaration = merged, plugin_configs = request.plugin_configs, pack = { id = pack.id, version = pack.version, digest = pack.digest } }, snapshot)
        if err or not classified then return nil, err end
        prepared = classified
        plan = schema_commands.describe(classified)
    end
    for _, change in ipairs(resource_refused or {}) do
        plan.refused[#plan.refused + 1] = change
        plan.changes[#plan.changes + 1] = change
    end
    if #(resource_refused or {}) > 0 then
        plan.class = "refused"
        plan.migration = "install a new named component and delete the old component through its owning contract before upgrading"
    end
    return { pack = pack.id, version = pack.version, digest = pack.digest, generation = plan.generation, class = plan.class,
        changes = plan.changes, refused = plan.refused, migration = plan.migration, declaration = merged, prepared = prepared, plugin_configs = request.plugin_configs,
        conflicts = conflicts, maps = proposals, views = managed.views, automations = managed.automations,
        traits = managed.traits, plugins = pack.requires, base = pack.data, initial = not board or not board.pack } :: types.Plan, nil
end
return M
