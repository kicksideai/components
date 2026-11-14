-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The host owns durable feed positions and bootstrap state.
local access = require("access")
local feeds = require("feeds")
local manifests = require("manifests")
local threads = require("threads")
local json = require("json")
local types = require("types")
local local_types = require("local_types")
local M = {}
local TOKEN_SCHEMA = { type = "object", required = { "projection_id", "start_seq", "bootstrapping" }, additionalProperties = false,
    properties = { projection_id = { type = "string" }, start_seq = { type = "integer" }, bootstrapping = { type = "boolean" },
        cursor = { type = "object", required = { "seq", "item_id" }, additionalProperties = false,
            properties = { seq = { type = "integer", minimum = 0 }, item_id = { type = "string" }, access = { type = "string" } } } } }

function M.decode(token: string): (local_types.FeedToken?, error?)
    local decoded, err = json.decode(token)
    if err then return nil, access.invalid("invalid plugin feed token") end
    local valid, verr = json.validate(TOKEN_SCHEMA, decoded)
    if verr or not valid then return nil, access.invalid("invalid plugin feed token") end
    return decoded :: local_types.FeedToken, nil
end

function M.page(request: types.PluginFeedRequest, context: types.PluginContext): (types.PluginFeed?, error?)
    local plugin, perr = manifests.load(request.plugin)
    if perr or not plugin then return nil, perr end
    local declared = false
    for _, p in ipairs(plugin.projections) do
        if p.kind == request.kind and p.input == "state" then declared = true end
    end
    if not declared then return nil, errors.new({ kind = errors.INVALID, message = "plugin declares no such state projection", details = { code = "plugin_projection_invalid" } }) end
    local client, terr = threads.open()
    if terr or not client then return nil, terr end
    local raw, rerr = client:get_projection_cursor({ thread_id = request.board_id, kind = request.kind, projection_key = "kickside.work.plugin:" .. request.plugin })
    if rerr then return nil, rerr end
    local pair = raw :: local_types.Pair
    local body = pair.projection.body
    if type(body) == "string" then
        local decoded, berr = json.decode(body)
        if berr then return nil, berr end
        body = decoded
    end
    local config = (body :: local_types.Body).worker_config :: local_types.Config
    local token: local_types.FeedToken = { projection_id = pair.projection.id, start_seq = config.start_seq, bootstrapping = true }
    if request.token then
        local parsed, err = M.decode(request.token)
        if err or not parsed then return nil, err end
        if parsed.projection_id ~= token.projection_id or parsed.start_seq ~= token.start_seq then
            return nil, access.invalid("plugin feed token belongs to another registration")
        end
        token = parsed
    end
    local head, herr = client:find({ thread_id = request.board_id })
    if herr then return nil, herr end
    if not head then return nil, errors.new({ kind = errors.NOT_FOUND, message = "board thread is absent", details = { code = "board_not_found" } }) end
    local page, ferr = feeds.list_changes({ board_id = request.board_id, cursor = token.cursor, limit = 200 })
    if ferr or not page then return nil, ferr end
    if page.gap then
        token.cursor, token.bootstrapping = nil, true
        page, ferr = feeds.list_changes({ board_id = request.board_id, limit = 200 })
        if ferr or not page then return nil, ferr end
    end
    local bootstrap = token.bootstrapping
    token.cursor = page.next
    if not page.has_more and (page.as_of :: integer) >= token.start_seq then token.bootstrapping = false end
    local encoded, eerr = json.encode(token)
    if eerr or not encoded then return nil, eerr end
    return { attachment_id = context.attachment_id :: string, config = context.config :: types.JsonObject, bootstrap = bootstrap,
        changes = page.items, token = encoded, done = not page.has_more and (page.as_of :: integer) >= (head :: { event_count: integer }).event_count }, nil
end
return M
