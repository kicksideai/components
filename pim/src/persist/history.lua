-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local failure=require("failure")
-- Change history (spec 5.6): the rows a fold projects from events into
-- kickside_pim_change, so history outlives event retention. Rows are (catalog,
-- seq, n, subject, kind, attribute, ctx, before, after, actor, source, origin,
-- at); before, after and origin hold canonical JSON.
local sql = require("sql")
local json = require("json")
local bulk = require("bulk")
local values = require("values")
local narrow = require("narrow")
local types = require("types")
local error_envelope = require("error_envelope")

local M = {}

local TABLE = "kickside_pim_change"

-- Change is one row an event contributes: its kind, and for value rows the
-- attribute, context and the value before and after.
type Change = { kind: string, attribute_id: integer?, ctx: string?, before: unknown, after: unknown, source: string? }
-- Stamp is what every row of one event shares.
type Stamp = { catalog_id: string, seq: integer, subject: string, actor: string, at: string, source: string?, origin: unknown }
-- Entry is one change row as read back.
type Entry = {
    seq: integer, n: integer, subject: string, kind: string, attribute_id: integer?, ctx: string?, before: types.Json, after: types.Json,
    actor: string, source: string?, origin: types.Json, at: string,
}
-- Page asks for rows newest first, optionally of one subject and before a cursor.
type Page = { subject: string?, before: string?, limit: integer }
M.Change = Change

local function encoded(v: unknown): unknown
    if v == nil then return sql.NULL end
    return values.canonical(v)
end

local function decoded(v: unknown): (types.Json, error?)
    if v == nil then return nil, nil end
    if type(v) ~= "string" then return nil, failure.corrupt("history JSON is not text") end
    local value, err = json.decode(v)
    if err then return nil, error_envelope.wrap(failure.corrupt("history JSON is malformed"),"stored history",{cause=error_envelope.encode(err)}) end
    return value :: types.Json, nil
end

local COLUMNS: { bulk.Column } = { { name = "catalog_id" }, { name = "seq" }, { name = "n" }, { name = "subject" }, { name = "kind" },
    { name = "attribute_id" }, { name = "ctx" }, { name = "before" }, { name = "after" }, { name = "actor" }, { name = "source" },
    { name = "origin" }, { name = "at" } }

-- collect appends the rows of one event to out, numbered from 1 in order.
function M.collect(out: { types.SqlParams }, stamp: Stamp, changes: { Change })
    for n, c in ipairs(changes) do
        local source = c.source or stamp.source
        out[#out + 1] = { stamp.catalog_id, stamp.seq, n, stamp.subject, c.kind, c.attribute_id or sql.NULL, c.ctx or sql.NULL,
            encoded(c.before), encoded(c.after), stamp.actor, source or sql.NULL, encoded(stamp.origin), stamp.at }
    end
end

-- write inserts collected rows in bulk.
function M.write(db: types.Executor, rows: { types.SqlParams }): error?
    return bulk.insert(db, TABLE, COLUMNS, rows)
end

-- cursor parses a "seq:n" history cursor.
function M.cursor(text: string): (integer?, integer?)
    local a, b = text:match("^(%d+):(%d+)$")
    return math.tointeger(tonumber(a)), math.tointeger(tonumber(b))
end

-- page reads one page of catalog_id's rows newest first and returns the cursor
-- of the next page when the page is full.
function M.page(db: types.Executor, catalog_id: string, p: Page): ({ Entry }?, string?, error?)
    local statement: { string } = { "SELECT seq, n, subject, kind, attribute_id, ctx, before, after, actor, source, origin, at FROM "
        .. TABLE .. " WHERE catalog_id = $1" }
    local params: types.SqlParams = { catalog_id }
    if p.subject then
        params[#params + 1] = p.subject
        statement[#statement + 1] = "AND subject = $" .. #params
    end
    if p.before ~= nil then
        local seq, n = M.cursor(p.before :: string)
        if not seq or not n then return nil, nil, errors.new({ details = { code = "history_cursor_invalid" }, kind = errors.INVALID, message = "before must be a history cursor" }) end
        params[#params + 1] = seq
        local a = #params
        params[#params + 1] = seq
        params[#params + 1] = n
        statement[#statement + 1] = "AND (seq < $" .. a .. " OR (seq = $" .. (a + 1) .. " AND n < $" .. (a + 2) .. "))"
    end
    params[#params + 1] = p.limit
    statement[#statement + 1] = "ORDER BY seq DESC, n DESC LIMIT $" .. #params
    local rows, err = db:query(table.concat(statement, " "), params)
    if err then return nil, nil, errors.wrap(err, "history read failed") end
    local entries: { Entry } = {}
    for _, raw in ipairs(rows or {}) do
        local r: types.Row = raw
        local seq, n = narrow.int(r.seq), narrow.int(r.n)
        if not seq or not n or type(r.subject) ~= "string" or type(r.kind) ~= "string" or type(r.actor) ~= "string" or type(r.at) ~= "string" then
            return nil, nil, failure.corrupt("history row is malformed")
        end
        local before, berr = decoded(r.before)
        if berr then return nil, nil, berr end
        local after, aerr = decoded(r.after)
        if aerr then return nil, nil, aerr end
        local origin, oerr = decoded(r.origin)
        if oerr then return nil, nil, oerr end
        entries[#entries + 1] = { seq = seq, n = n, subject = r.subject :: string, kind = r.kind :: string, attribute_id = narrow.int(r.attribute_id),
            ctx = type(r.ctx) == "string" and r.ctx :: string or nil, before = before, after = after,
            actor = r.actor :: string, source = type(r.source) == "string" and r.source :: string or nil, origin = origin,
            at = r.at :: string }
    end
    local next_cursor: string? = nil
    if #entries == p.limit then
        local last = entries[#entries]
        next_cursor = tostring(last.seq) .. ":" .. tostring(last.n)
    end
    return entries, next_cursor, nil
end

-- prune deletes up to limit of catalog_id's rows older than before (a canonical
-- timestamp), oldest first, and returns how many it deleted.
function M.prune(db: types.Executor, catalog_id: string, before: string, limit: integer): (integer?, error?)
    local out, err = db:execute("DELETE FROM " .. TABLE .. " WHERE catalog_id = $1 AND (seq, n) IN (SELECT seq, n FROM " .. TABLE
        .. " WHERE catalog_id = $2 AND at < $3 ORDER BY at,seq,n LIMIT $4)", { catalog_id, catalog_id, before, limit })
    if err then return nil, errors.wrap(err, "change history prune failed") end
    local n = narrow.int(out and out.rows_affected)
    if not n then return nil, errors.new({ details = { code = "internal" }, kind = errors.INTERNAL, message = "change history prune reported no row count" }) end
    return n, nil
end

return M
