-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- kickside.data:writable sink for products. One upsert names a product by sku
-- and maps onto a single apply; its receipt key is (origin, sink_op,
-- idempotency_key), so a redelivery returns the same effect and a different
-- payload under the same key is a conflict.
local writable_sink = require("writable_sink")
local registry = require("registry")
local json = require("json")
local shape = require("shape")
local writer = require("writer")
local requests = require("requests")
local types = require("types")

local data_error = require("data_error")
local failure = require("failure")

local M = {}

type Config = { catalog_id: string?, source: string? }
type Input = { sku: string?, family: string?, parent_sku: string?, seq: integer?, status: string?,
    set: { types.ValueEntry }?, clear: { types.ValueEntry }?, unset: { types.ValueEntry }? }
type Request = { trace_context: types.TraceContext?, config: Config?, sink_op: string?, input: Input?, idempotency_key: string?,
    origin: string?, automation_ref: unknown }
-- Write failures carry the DataError envelope and native classification.
type Result = { success: boolean, result: string?, dest_ref: { product_id: string? }? } | data_error.Failure

type Details = { findings: { types.Finding } }

local function fail(message: string, code: data_error.CodeOverride?, retriable: boolean?, scope: string?, details: Details?): Result
    local kind = errors.INVALID
    if code == "permission_denied" then kind = errors.PERMISSION_DENIED
    elseif code == "conflict" or code == "idempotency_conflict" then kind = errors.CONFLICT
    elseif code == "contract_unavailable" then kind = errors.UNAVAILABLE end
    local fields: { [string]: unknown } = { code = code or "invalid_request", findings = details and details.findings }
    return data_error.failure(errors.new({ kind = kind, message = message, retryable = retriable == true, details = fields }), code, scope)
end

-- unresolved is true when an item failed only because a product, term or link
-- target it names is not in the catalog: a dependency a later delivery can
-- supply, so the engine retries instead of poisoning the item.
local function unresolved(findings: { types.Finding }?): boolean
    if not findings or #findings == 0 then return false end
    for _, f in ipairs(findings) do
        if f.code ~= "invalid_reference" then return false end
    end
    return true
end

local SEP = string.char(31)

function M.write(req: Request): Result
    local origin, origin_fail = writable_sink.origin(req)
    if not origin then
        local reported = origin_fail :: { error: { message: string, code: string } }
        return data_error.failure(failure.invalid(reported.error.message, { code = reported.error.code }))
    end
    local config: Config = req.config or {}
    local catalog_id = writable_sink.trim(config.catalog_id)
    if catalog_id == "" then return fail("config.catalog_id is required", "invalid_config") end
    if req.sink_op ~= "upsert" then return fail("unsupported sink_op " .. tostring(req.sink_op)) end
    local input: Input = req.input or {}
    local port, lerr = registry.get("kickside.pim.sink:products_port")
    if lerr then return data_error.failure(lerr) end
    if not port then return fail("products port unavailable", "contract_unavailable", true) end
    local schema, serr = json.decode(port.data.input_schema :: string)
    if serr then return data_error.failure(serr) end
    local invalid_input = shape.check(shape.tolerant(schema :: types.JsonObject), input, "sink input")
    if invalid_input then return data_error.failure(invalid_input, "invalid_request") end
    if input.sku ~= nil and type(input.sku) ~= "string" then return fail("input.sku must be a string", "invalid_request") end
    local sku = writable_sink.trim(input.sku)
    if sku == "" then return fail("input.sku is required") end
    local key = writable_sink.trim(req.idempotency_key)
    if key == "" then return fail("idempotency_key is required") end
    local item: types.ApplyItem = { product = { sku = sku }, upsert = true, seq = input.seq, set = input.set, clear = input.clear,
        unset = input.unset, status = input.status,
        create = { family = input.family, parent = input.parent_sku and { sku = input.parent_sku } or nil } }
    local request: types.ApplyRequest = { items = { item }, source = config.source, origin = { type = "automation", id = origin },
        idempotency = { namespace = "sink", key = origin .. SEP .. "upsert" .. SEP .. key }, trace_context = req.trace_context }
    local perr = requests.parse("apply", request)
    if perr then return data_error.failure(perr, "invalid_request") end
    local out, err = writer.apply(catalog_id, request)
    if err then return data_error.write(err) end
    if not out then return fail("apply returned no result", "contract_unavailable", true) end
    local o = out.outcomes[1]
    if o.outcome == "created" then return { success = true, result = "created", dest_ref = { product_id = o.product_id } } end
    if o.outcome == "updated" then return { success = true, result = "updated", dest_ref = { product_id = o.product_id } } end
    if o.outcome == "unchanged" then return { success = true, result = "noop", dest_ref = { product_id = o.product_id } } end
    local details: Details? = o.findings and { findings = o.findings } or nil
    if o.outcome == "conflict" then return fail("product changed concurrently", "conflict", true, "item", details) end
    if o.outcome == "forbidden" then return fail("source may not write these values", "permission_denied", false, "item", details) end
    if unresolved(o.findings) then
        return fail("a product, term or link target this write names is not in the catalog yet", "dependency_missing", true, "item", details)
    end
    return fail("product values are invalid", "invalid_request", false, "item", details)
end

return M
