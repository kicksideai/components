-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The boards a caller can read, and the rule that picks one: an explicit id,
-- otherwise the caller's only readable board.
local component = require("component")
local access = require("access")
local consts = require("consts")
local domain = require("domain")
local types = require("types")

local store = require("store")
local tables = require("tables")
local access_rows = require("access_rows")
local principals = require("principals")
local reads = require("reads")
local M = {}

-- counts reads one aggregate statement for the caller's bounded board page.
function M.counts(out: { types.BoardSummary }): error?
    if #out == 0 then return nil end
    local ids: { unknown } = {}
    local marks: { string } = {}
    for i, board in ipairs(out) do ids[i] = board.board_id; marks[i] = "$" .. i end
    local db, err = store.open()
    if not db then return err end
    local dialect = db:type()
    local rows, rerr = db:query("SELECT * FROM kickside_work_board WHERE board_id IN (" .. table.concat(marks, ",") .. ")", ids)
    db:release()
    if rerr then return rerr end
    local boards: { [string]: domain.Board } = {}
    local statements: { string } = {}
    local args: { unknown } = {}
    local summaries: { [string]: types.BoardSummary } = {}
    for _, summary in ipairs(out) do summaries[summary.board_id] = summary end
    local context: reads.ReadContext = { admitted = {}, holders = {} }
    for _, row in ipairs(rows or {}) do
        local board, berr = store.decode_board(row)
        if berr or not board then return berr end
        local perr = principals.resolve(board, context)
        if perr then return perr end
        boards[board.board_id] = board
        local condition, cerr = access_rows.condition(board, dialect)
        if cerr or not condition then return cerr end
        statements[#statements + 1] = [[SELECT ? AS board_id,
            (SELECT digest FROM kickside_work_board WHERE board_id = ?) AS digest,
            COUNT(CASE WHEN i.life = 'live' THEN 1 END) AS item_count,
            COUNT(CASE WHEN i.life = 'live' AND i.category NOT IN ('completed','canceled') THEN 1 END) AS open_count,
            COUNT(CASE WHEN i.life = 'live' AND i.category = 'completed' THEN 1 END) AS completed_count,
            COUNT(CASE WHEN i.life = 'trashed' THEN 1 END) AS trashed_count
            FROM ]] .. tables.names(board.board_id).item .. [[ i JOIN kickside_work_item r ON r.board_id = ? AND r.item_id = i.item_id
            WHERE (]] .. condition.sql .. ")"
        args[#args + 1] = board.board_id
        args[#args + 1] = board.board_id
        args[#args + 1] = board.board_id
        for _, value in ipairs(condition.args) do args[#args + 1] = value end
    end
    if #statements == 0 then return nil end
    local n = 0
    local statement = table.concat(statements, " UNION ALL "):gsub("%?", function(): string n = n + 1; return "$" .. n end)
    db, err = store.open()
    if not db then return err end
    local counted, cerr = db:query(statement, args)
    db:release()
    if cerr then return cerr end
    for _, row in ipairs(counted or {}) do
        local id, ierr = store.need(row, "board_id")
        if ierr or not id then return ierr end
        if row.digest ~= boards[id].digest then
            return errors.new({ kind = errors.UNAVAILABLE, retryable = false, message = "board access rules changed during discovery", details = { code = "access_projection_changed" } })
        end
        for _, key in ipairs({ "item_count", "open_count", "completed_count", "trashed_count" }) do
            local count, err = store.need_int(row, key)
            if err then return err end
            (summaries[id] :: { [string]: unknown })[key] = count
        end
    end
    return nil
end

-- trim returns the text of v without surrounding space; non-text is empty.
local function trim(v: unknown): string
    if type(v) ~= "string" then return "" end
    return (v:gsub("^%s*(.-)%s*$", "%1"))
end

local function display(meta: domain.ComponentMeta): domain.BoardMeta
    return { title = trim(meta.title) ~= "" and trim(meta.title) or "Board",
        description = type(meta.description) == "string" and meta.description or "",
        icon = type(meta.icon) == "string" and meta.icon or "" }
end

-- readable returns a bounded page of readable boards in component id order.
function M.readable(limit: integer?, offset: integer?): ({ types.BoardSummary }?, error?)
    local rows, err = component.query({ impl_ids = { consts.BOARD_IMPL }, access_mask = (component.ACCESS.READ :: integer),
        include = { meta = true, access = true }, order_by = { field = "component_id", direction = "ASC" }, limit = limit or 50, offset = offset or 0 })
    if err then return nil, errors.wrap(err :: error, "board lookup failed") end
    local out: { types.BoardSummary } = {}
    for _, raw in ipairs(type(rows) == "table" and (rows :: { unknown }) or {}) do
        if type(raw) ~= "table" then return nil, errors.new({ details = { code = "row_corrupt" }, kind = errors.INTERNAL, message = "board component row is malformed" }) end
        local row = raw :: domain.ComponentRow
        local id = trim(row.component_id)
        if id ~= "" then
            local grants, gerr = access.describe(row.access_level)
            if gerr or not grants then return nil, gerr end
            local meta = row.meta or {}
            local properties = display(meta)
            out[#out + 1] = { board_id = id, access = grants, title = properties.title, description = properties.description, icon = properties.icon,
                key_prefix = type(meta.key_prefix) == "string" and meta.key_prefix or nil,
                generation = meta.generation and math.tointeger(meta.generation) or nil,
                status = type(meta.status) == "string" and meta.status or nil }
        end
    end
    return out, nil
end

-- metadata reads the component metadata under the requested board grant.
function M.metadata(board_id: string, mask: integer): (domain.BoardMeta?, error?)
    local rows, err = component.query({ component_ids = { board_id }, impl_ids = { consts.BOARD_IMPL }, access_mask = mask,
        include = { meta = true }, limit = 1 })
    if err then return nil, err :: error end
    local row = rows and (rows :: { domain.ComponentRow })[1]
    if not row then return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = "board metadata access denied", details = { code = "board_access_denied" } }) end
    return display(row.meta or {}), nil
end

-- resolve answers the board a request addresses.
function M.resolve(explicit: string?): (string?, error?)
    local id = trim(explicit)
    if id ~= "" then return id, nil end
    local boards, err = M.readable()
    if not boards then return nil, err end
    if #boards == 1 then return boards[1].board_id, nil end
    if #boards == 0 then return nil, errors.new({ details = { code = "board_not_found" }, kind = errors.NOT_FOUND, message = "no board is available; create one first" }) end
    local named: { string } = {}
    for _, b in ipairs(boards) do named[#named + 1] = b.board_id .. " (" .. b.title .. ")" end
    return nil, errors.new({ kind = errors.CONFLICT, message = "several boards are available; pass board_id as one of: " .. table.concat(named, ", "),
        details = { code = "board_required", boards = named } })
end

M.trim = trim

return M
