-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- kickside.work:board service methods: the one surface tools, Blocks, HTTP endpoints
-- and other modules call. Each method runs under the caller's identity, validates its
-- request and calls the command or read that owns it.
local schema_commands = require("schema_commands")
local apply_ops = require("apply_ops")
local query = require("query")
local reader = require("reader")
local feeds = require("feeds")
local create = require("create")
local locate = require("locate")
local requests = require("requests")
local commands = require("commands")
local reads = require("reads")
local related = require("related")
local configure = require("configure")
local update = require("update")
local plugin_access = require("plugin_access")
local plugin_feed = require("plugin_feed")

local cross_board = require("cross_board")
local M = {}

function M.create(input: unknown): (commands.CreateResult?, error?)
    local err = requests.parse("create", input)
    if err then return nil, err end
    return create.create(input :: commands.CreateRequest)
end

function M.update(input: unknown): (commands.UpdateResult?, error?)
    local err = requests.parse("update", input)
    if err then return nil, err end
    return update.update(input :: commands.UpdateRequest)
end

function M.list(input: unknown): (commands.ListResult?, error?)
    local err = requests.parse("list", input)
    if err then return nil, err end
    local request = input :: commands.ListRequest
    local limit, after = request.limit or 50, request.after or 0
    local boards, berr = locate.readable(limit + 1, after)
    if berr or not boards then return nil, berr end
    local more = #boards > limit
    if more then table.remove(boards) end
    local cerr = locate.counts(boards)
    if cerr then return nil, cerr end
    return { boards = boards, next = more and (after + limit) or nil }, nil
end

function M.get(input: unknown): (reads.GetResult?, error?)
    local err = requests.parse("get", input)
    if err then return nil, err end
    local request = input :: reads.GetRequest
    if request.item.key ~= nil and request.item.key ~= "" then return reader.get_by_key(request) end
    local id, lerr = locate.resolve(request.board_id)
    if lerr or not id then return nil, lerr end
    request.board_id = id
    return reader.get(request)
end

function M.get_schema(input: unknown): (reads.SchemaView?, error?)
    local err = requests.parse("get_schema", input)
    if err then return nil, err end
    local request = input :: reads.SchemaGetRequest
    local id, lerr = locate.resolve(request.board_id)
    if lerr or not id then return nil, lerr end
    request.board_id = id
    return reader.get_schema(request)
end

function M.plugin_context(input: unknown): (unknown, error?)
    local err = requests.parse("plugin_context", input)
    if err then return nil, err end
    return plugin_access.context(input :: reads.PluginContextRequest)
end

function M.plugin_feed(input: unknown): (reads.PluginFeed?, error?)
    local err = requests.parse("plugin_feed", input)
    if err then return nil, err end
    local request = input :: reads.PluginFeedRequest
    local context, cerr = plugin_access.context(request)
    if cerr or not context then return nil, cerr end
    return plugin_feed.page(request, context)
end

function M.schema_options(input: unknown): (unknown, error?)
    local err = requests.parse("schema_options", input)
    if err then return nil, err end
    return plugin_access.options(input :: reads.SchemaGetRequest)
end

function M.plan_schema(input: unknown): (commands.SchemaPlanResult?, error?)
    local err = requests.parse("plan_schema", input)
    if err then return nil, err end
    local request = input :: commands.SchemaRequest
    local id, lerr = locate.resolve(request.board_id)
    if lerr or not id then return nil, lerr end
    request.board_id = id
    return schema_commands.plan_schema(request)
end

function M.apply_schema(input: unknown): (commands.SchemaResult?, error?)
    local err = requests.parse("apply_schema", input)
    if err then return nil, err end
    local request = input :: commands.SchemaRequest
    local id, lerr = locate.resolve(request.board_id)
    if lerr or not id then return nil, lerr end
    request.board_id = id
    return schema_commands.apply_schema(request)
end

function M.resume_migration(input: unknown): (commands.ResumeMigrationResult?, error?)
    local err = requests.parse("resume_migration", input)
    if err then return nil, err end
    local request = input :: commands.ResumeMigrationRequest
    local id, lerr = locate.resolve(request.board_id)
    if lerr or not id then return nil, lerr end
    request.board_id = id
    return schema_commands.resume_migration(request)
end

function M.apply(input: unknown): (commands.ApplyResult?, error?)
    local err = requests.parse("apply", input)
    if err then return nil, err end
    local request = input :: commands.ApplyRequest
    local id, lerr = locate.resolve(request.board_id)
    if lerr or not id then return nil, lerr end
    request.board_id = id
    return apply_ops.apply(request)
end

local function process_command(method: string, input: unknown): (commands.ApplyResult?, error?)
    local err = requests.parse(method, input)
    if err then return nil, err end
    local request = input :: { [string]: unknown }
    local id, lerr = locate.resolve(request.board_id :: string?)
    if lerr or not id then return nil, lerr end
    local op: commands.Op = { op = method }
    for key, value in pairs(request) do
        if key == "item" or key == "visit" or key == "attempt" or key == "outcome" or key == "outputs" or key == "progress" or key == "decision" then
            (op :: { [string]: unknown })[key] = value
        end
    end
    return apply_ops.apply({ board_id = id, key = request.key, source = request.source, origin = request.origin,
        trace_context = request.trace_context, ops = { op }, mode = "atomic" } :: commands.ApplyRequest)
end

function M.approve(input: unknown): (commands.ApplyResult?, error?) return process_command("approve", input) end
function M.report(input: unknown): (commands.ApplyResult?, error?) return process_command("report", input) end

function M.list_changes(input: unknown): (reads.ChangesResult?, error?)
    local err = requests.parse("list_changes", input)
    if err then return nil, err end
    local request = input :: reads.ChangesRequest
    local id, lerr = locate.resolve(request.board_id)
    if lerr or not id then return nil, lerr end
    request.board_id = id
    return feeds.list_changes(request)
end

function M.list_history(input: unknown): (reads.HistoryResult?, error?)
    local err = requests.parse("list_history", input)
    if err then return nil, err end
    local request = input :: reads.HistoryRequest
    local id, lerr = locate.resolve(request.board_id)
    if lerr or not id then return nil, lerr end
    request.board_id = id
    return reader.list_history(request)
end

function M.get_time_in_state(input: unknown): (reads.TimeInStateResult?, error?)
    local err = requests.parse("get_time_in_state", input)
    if err then return nil, err end
    local request = input :: reads.TimeInStateRequest
    local id, lerr = locate.resolve(request.board_id)
    if lerr or not id then return nil, lerr end
    request.board_id = id
    return reader.get_time_in_state(request)
end

function M.query(input: unknown): (reads.QueryResult?, error?)
    local err = requests.parse("query", input)
    if err then return nil, err end
    local request = input :: reads.QueryRequest
    if request.boards ~= nil then return cross_board.query(request) end
    if request.cross_after ~= nil then return nil, errors.new({ details = { code = "invalid_request" },  kind = errors.INVALID, message = "cross_after requires boards" }) end
    local id, lerr = locate.resolve(request.board_id)
    if lerr or not id then return nil, lerr end
    request.board_id = id
    return query.query(request)
end

function M.count(input: unknown): (reads.CountResult?, error?)
    local err = requests.parse("count", input)
    if err then return nil, err end
    local request = input :: reads.QueryRequest
    local id, lerr = locate.resolve(request.board_id)
    if lerr or not id then return nil, lerr end
    request.board_id = id
    return query.count(request)
end

function M.list_links(input: unknown): (reads.LinksResult?, error?)
    local err = requests.parse("list_links", input)
    if err then return nil, err end
    local request = input :: reads.LinksRequest
    local id, lerr = locate.resolve(request.board_id)
    if lerr or not id then return nil, lerr end
    request.board_id = id
    return related.list_links(request)
end

function M.list_comments(input: unknown): (reads.CommentsResult?, error?)
    local err = requests.parse("list_comments", input)
    if err then return nil, err end
    local request = input :: reads.CommentsRequest
    local id, lerr = locate.resolve(request.board_id)
    if lerr or not id then return nil, lerr end
    request.board_id = id
    return related.list_comments(request)
end

function M.list_stage_runs(input: unknown): (reads.StageRunsResult?, error?)
    local err = requests.parse("list_stage_runs", input)
    if err then return nil, err end
    local request = input :: reads.StageRunsRequest
    local id, lerr = locate.resolve(request.board_id)
    if lerr or not id then return nil, lerr end
    request.board_id = id
    return reader.list_stage_runs(request)
end

function M.explain(input: unknown): (reads.ExplainResult?, error?)
    local err = requests.parse("explain", input)
    if err then return nil, err end
    local request = input :: reads.QueryRequest
    local id, lerr = locate.resolve(request.board_id)
    if lerr or not id then return nil, lerr end
    request.board_id = id
    return query.explain(request)
end

function M.configure_plugin(input: unknown): (commands.ConfigureResult?, error?)
    local err = requests.parse("configure_plugin", input)
    if err then return nil, err end
    local request = input :: commands.ConfigureRequest
    local id, lerr = locate.resolve(request.board_id)
    if lerr or not id then return nil, lerr end
    request.board_id = id
    return configure.configure_plugin(request)
end
return M
