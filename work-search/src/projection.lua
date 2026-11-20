-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local work = require("work")
local storage = require("storage")
local sql = require("sql")
local uuid = require("uuid")

type Map = { [string]: unknown }
type Config = { board_id: string, attachment_id: string, plugin: string, start_seq: integer }
type Input = { thread_id: string, projection: { kind: string, body: { worker_config: Config } },
    range: { from_seq: integer, to_seq: integer } }
type Result = { last_seq: integer, patch: { token: string? }? }
type Change = { item_id: string, key: string?, op: string, updated_seq: integer, values: Map? }
type Page = { changes: { Change }, reset: boolean, token: string, attachment_id: string, generation: integer, done: boolean }

local PLUGIN = "kickside.work_search:plugin"
local PROJECTION = "kickside.work_search:items"
local TEXT = "kickside.work_search:text"
local KEY = "kickside.work_search:key"

local function pending(code: string, message: string): error
    return errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = message, details = { code = code } })
end

local function configured(scopes: { string }): (string?, error?)
    local scope: string? = nil
    for _, id in ipairs(scopes) do
        if id == KEY or id == TEXT then
            if scope then
                return nil, errors.new({ kind = errors.INVALID, message = "adopt one Work Search scope",
                    details = { code = "search_scope_invalid" } })
            end
            scope = id
        end
    end
    return scope, nil
end

local function text(value: unknown): string
    return type(value) == "string" and value:gsub("%z", " ") or ""
end

local function index_page(tx: sql.Transaction, sqlite: boolean, target: storage.Generation, page: Page): error?
    for _, change in ipairs(page.changes) do
        local err: error?
        if change.op == "delete" then
            err = storage.remove(tx, sqlite, target.id, change.item_id)
        else
            local key = change.key :: string
            local content = key
            if target.scope == TEXT then
                local values = change.values or {}
                content = table.concat({ key, text(values.title), text(values.description) }, " ")
            end
            err = storage.put(tx, sqlite, target.id,
                { item_id = change.item_id, item_key = key, source_seq = change.updated_seq }, content)
        end
        if err then return err end
    end
    return nil
end

local function load(attachment_id: string): (storage.State?, error?)
    local db, err = storage.open()
    if err or not db then return nil, err end
    local state, read_err = storage.load(db, attachment_id)
    local _, release_err = db:release()
    if read_err or release_err then return nil, read_err or release_err end
    return state or {}, nil
end

local function run(input: Input): (Result?, error?)
    local config = input.projection.body.worker_config
    local id = input.thread_id
    if config.plugin ~= PLUGIN or config.board_id ~= id or input.projection.kind ~= PROJECTION then
        return nil, errors.new({ kind = errors.INVALID, message = "invalid search projection registration",
            details = { code = "search_projection_invalid" } })
    end
    local attachment = config.attachment_id
    local board, open_err = work.open()
    if open_err or not board then return nil, open_err end
    local raw, err = board:get_schema({ board_id = id })
    if err or not raw then return nil, err end
    local schema = raw :: { generation: integer, declaration: { scopes: { string }? } }
    local scope, scope_err = configured(schema.declaration.scopes or {})
    if scope_err then return nil, scope_err end
    local state, load_err = load(attachment)
    if load_err or not state then return nil, load_err end
    local current = state.building or state.active
    local same = current and current.schema == schema.generation and current.scope == scope
        and current.registration == config.start_seq
    local page: Page? = nil
    if scope and not state.retired and (not state.building or same) then
        local request = { board_id = id, plugin = PLUGIN, kind = PROJECTION, token = same and state.token or nil }
        local response, feed_err = board:plugin_feed(request)
        if feed_err or not response then return nil, feed_err end
        page = response :: Page
        if page.generation ~= schema.generation or page.attachment_id ~= attachment then
            return nil, pending("search_projection_changed", "search projection source changed during the page read")
        end
    end

    local more = { last_seq = input.range.from_seq - 1 }
    return storage.write(attachment, id, function(tx: sql.Transaction, sqlite: boolean, held: storage.State): (Result?, error?)
        if held.deleting or held.revision ~= state.revision then
            return nil, pending("search_projection_changed", "search projection changed before the page committed")
        end
        if held.retired then
            local drained, drain_err = storage.drain(tx, sqlite, held.retired)
            if drain_err then return nil, drain_err end
            if drained then held.retired = nil end
            return more, storage.save(tx, attachment, held)
        end
        if held.building and (not same or (page and page.reset)) then
            held.retired, held.building, held.token = held.building.id, nil, nil
            return more, storage.save(tx, attachment, held)
        end
        if not scope then
            if held.active then
                held.retired, held.active, held.token = held.active.id, nil, nil
                return more, storage.save(tx, attachment, held)
            end
            return { last_seq = input.range.to_seq }, nil
        end
        if not page then return nil, pending("search_projection_changed", "search page is unavailable") end
        if not same or page.reset then
            held.building = { id = (uuid.v4()), schema = schema.generation, scope = scope, registration = config.start_seq }
        end
        local target = (held.building or held.active) :: storage.Generation
        local fold_err = index_page(tx, sqlite, target, page)
        if fold_err then return nil, fold_err end
        held.token = page.token
        if held.building and page.done then
            held.retired = held.active and held.active.id
            held.active, held.building = held.building, nil
        end
        local done = page.done and not held.retired
        return { patch = { token = page.token }, last_seq = done and input.range.to_seq or more.last_seq },
            storage.save(tx, attachment, held)
    end)
end

return { run = run }
