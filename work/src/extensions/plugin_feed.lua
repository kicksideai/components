-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Installed projection workers use this library to read their own attachment.
local access = require("access")
local feeds = require("feeds")
local budget = require("budget")
local domain = require("domain")
local manifests = require("manifests")
local plugin_rows = require("plugin_rows")
local store = require("store")
local cursor_reader = require("cursor_reader")
local json = require("json")
local types = require("types")
local local_types = require("local_types")
local limits = require("limits")
local schema = require("schema")
local M = {}

function M.decode(token: string): (local_types.FeedToken?, error?)
    local decoded, err = json.decode(token)
    if err then return nil, access.invalid("invalid plugin feed token") end
    local valid, verr = json.validate(schema.token, decoded)
    if verr or not valid then return nil, access.invalid("invalid plugin feed token") end
    return decoded :: local_types.FeedToken, nil
end

local function binding_mismatch(): error
    return errors.new({ kind = errors.PERMISSION_DENIED, message = "state projection does not own this attachment",
        details = { code = "plugin_projection_binding" } })
end

function M.page(request: types.PluginFeedRequest): (types.PluginFeed?, error?)
    local settings, settings_err = limits.read()
    if settings_err or not settings then return nil, settings_err end
    local allowance, allowance_err = budget.start()
    if allowance_err or not allowance then return nil, allowance_err end
    return access.projection_snapshot(request.board_id, allowance,
        function(tx: types.Executor, board: domain.Board, dialect: string): (types.PluginFeed?, error?)
            local row, rerr = plugin_rows.active(tx, request.board_id, request.plugin)
            if rerr then return nil, rerr end
            if not row then
                return nil, errors.new({ kind = errors.NOT_FOUND, message = "plugin is inactive", details = { code = "plugin_inactive" } })
            end
            if row.attachment_id ~= request.attachment_id then return nil, binding_mismatch() end

            local manifest, merr = manifests.load(request.plugin)
            if merr or not manifest then return nil, merr end
            local worker_ref: string? = nil
            for _, projection in ipairs(manifest.projections) do
                if projection.kind == request.kind and projection.input == "state" then worker_ref = projection.worker_ref; break end
            end
            if not worker_ref then
                return nil, errors.new({ kind = errors.INVALID, message = "plugin declares no such state projection",
                    details = { code = "plugin_projection_invalid" } })
            end
            local raw, perr = cursor_reader.find_projection_cursor(tx, request.board_id, {
                kind = request.kind, projection_key = "kickside.work.plugin:" .. request.plugin,
            })
            if perr then return nil, perr end
            local pair = raw :: local_types.Pair?
            if not pair or pair.projection.id ~= request.projection_id then return nil, binding_mismatch() end
            local body = pair.projection.body
            if type(body) == "string" then
                local decoded, berr = json.decode(body)
                if berr then return nil, berr end
                body = decoded
            end
            local registration = body :: local_types.Body
            local config = registration.worker_config
            if not config or config.board_id ~= request.board_id or config.plugin ~= request.plugin
                or config.attachment_id ~= row.attachment_id or config.input ~= "state"
                or not registration.meta or registration.meta.worker_ref ~= worker_ref then
                return nil, binding_mismatch()
            end

            local token: local_types.FeedToken = { projection_id = pair.projection.id, start_seq = config.start_seq, bootstrapping = true }
            if request.token then
                local parsed, err = M.decode(request.token)
                if err or not parsed then return nil, err end
                if parsed.projection_id ~= token.projection_id or parsed.start_seq ~= token.start_seq then
                    return nil, access.invalid("plugin feed token belongs to another registration")
                end
                token = parsed
            end
            local heads, herr = tx:query("SELECT event_count FROM kickside_thread WHERE id=$1", { request.board_id })
            if herr then return nil, herr end
            if not heads or not heads[1] then
                return nil, errors.new({ kind = errors.NOT_FOUND, message = "board thread is absent", details = { code = "board_not_found" } })
            end
            local head, head_err = store.need_int(heads[1], "event_count")
            if head_err or not head then return nil, head_err end
            local page, ferr = feeds.projection_page(tx, board, dialect, token.cursor, settings.plugin_discovery_batch, allowance)
            if ferr or not page then return nil, ferr end
            local reset = page.gap ~= nil
            if reset then
                token.bootstrapping = true
                page, ferr = feeds.projection_page(tx, board, dialect, nil, settings.plugin_discovery_batch, allowance)
                if ferr or not page then return nil, ferr end
            end
            local bootstrap = token.bootstrapping
            token.cursor = page.next
            if not page.has_more and board.applied_seq >= token.start_seq then token.bootstrapping = false end
            local encoded, eerr = json.encode(token)
            if eerr or not encoded then return nil, eerr end
            return { attachment_id = row.attachment_id, config = config.config, bootstrap = bootstrap, reset = reset,
                generation = board.generation, changes = page.items, token = encoded,
                done = not page.has_more and board.applied_seq >= head }, nil
        end)
end
return M
