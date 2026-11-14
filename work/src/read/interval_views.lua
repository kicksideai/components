-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local time = require("time")
local fields = require("fields")
local store = require("store")
local rules = require("rules")
local domain = require("domain")
local types = require("types")
local peers = require("peers")
local json = require("json")
local M = {}

-- interval_views renders interval rows: the state, the category or a declared field with its value, and how long
-- the period lasted, up to now while it is open.
function M.render(board: domain.Board, rows: { domain.IntervalRow }, doc: domain.Document): ({ types.IntervalView }?, error?)
    local now = time.now()
    local out: { types.IntervalView } = {}
    for _, r in ipairs(rows) do
        local name: string? = nil
        local value: unknown = nil
        if r.field_id == "state" or r.field_id == "category" then
            name, value = r.field_id, r.value_key
        else
            local field = board.model.by_id[math.tointeger(tonumber(r.field_id)) :: integer]
            if field and rules.field(board, field, "read", doc) then
                local decoded_14, decode_err = store.stored(r.value_key, nil)
                if decode_err then return nil, decode_err end
                local held: domain.Json = decoded_14
                name = field.code
                local surface, serr = fields.surface(field, held :: domain.Value)
                if serr then return nil, serr end
                value = surface
            end
        end
        if name then
            local started, serr = time.parse(time.RFC3339, r.started_at)
            if serr or not started then return nil, errors.wrap(serr or errors.new({ kind = errors.INTERNAL, retryable = false, message = "operation returned no result", details = { code = "internal" } }), "interval start is malformed") end
            local ended = now
            if r.ended_at then
                local parsed, eerr = time.parse(time.RFC3339, r.ended_at)
                if eerr or not parsed then return nil, errors.wrap(eerr or errors.new({ kind = errors.INTERNAL, retryable = false, message = "operation returned no result", details = { code = "internal" } }), "interval end is malformed") end
                ended = parsed
            end
            out[#out + 1] = { field = name, value = value, started_at = r.started_at, ended_at = r.ended_at,
                duration_ms = math.max(0, (ended:unix_nano() - started:unix_nano()) // 1000000) }
        end
    end
    return out, nil
end

function M.redact(periods: { types.IntervalView }, redact: types.Redactor): error?
    for _, period in ipairs(periods) do
        local value, err = redact(period.field, period.value)
        if err then return err end
        period.value = value
    end
    return nil
end

function M.totals(field: string, totals: { [string]: integer }, catalog: { [string]: domain.Field }, redact: types.Redactor): ({ [string]: integer }?, error?)
    if not catalog[field] then return totals, nil end
    local out: { [string]: integer } = {}
    for key, duration in pairs(totals) do
        local raw, err = json.decode(key)
        if err then return nil, err end
        local value, rerr = redact(field, raw)
        if rerr then return nil, rerr end
        local encoded, eerr = json.encode(value)
        if eerr then return nil, eerr end
        out[encoded] = (out[encoded] or 0) + duration
    end
    return out, nil
end
return M
