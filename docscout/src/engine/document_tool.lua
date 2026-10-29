-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Native agent tools read a processed document owned by the current caller.
local ctx = require("ctx")
local security = require("security")
local time = require("time")
local json = require("json")
local store = require("store")
local extractors = require("extractors")
local doctools = require("doctools")
local ai = require("ai")
local error_envelope = require("error_envelope")

return { run = function(args: any): (any?, error?)
    local context, context_err = ctx.get("docscout")
    if context_err then return nil, context_err end
    if type(context) ~= "table" or type(context.component_id) ~= "string" or type(context.document_id) ~= "string" then
        return nil, errors.new({ kind = errors.INVALID, message = "Document tool requires a scouting context" })
    end
    local actor = security.actor()
    if not actor then return nil, errors.new({ kind = errors.UNAUTHENTICATED, message = "Document tools require an actor" }) end
    local _, access_err = extractors.for_run(context.component_id)
    if access_err then return nil, access_err end
    local document, document_err = store.for_agent(context.component_id, actor:id(), context.document_id)
    if document_err then return nil, document_err end
    document.outline, document.embedding_model = context.outline, context.embedding_model
    local deadline = nil
    if context.deadline then
        local parsed, parse_err = time.parse(time.RFC3339, context.deadline)
        if parse_err then return nil, parse_err end
        deadline = parsed
    end
    local definition = doctools.TOOLS[context.tool]
    if not definition then return nil, errors.new({ kind = errors.INVALID, message = "Unknown scouting document tool" }) end
    local valid, validation_err = json.validate(definition.schema, args)
    if not valid then return nil, errors.new({ kind = errors.INVALID, message = "Invalid document tool arguments: " .. tostring(validation_err) }) end
    local meter = ai.meter(deadline)
    local failure = ai.check_deadline(meter, "a document tool call")
    local hits, text, err = nil, nil, failure
    if not err then hits, text, err = doctools.call({ document = document, meter = meter }, context.tool, args) end
    return { text = text, chunks = hits or {}, docscout = {
        input_tokens = meter.input_tokens, output_tokens = meter.output_tokens,
        error = err and error_envelope.encode(err) or nil,
    } }, nil
end }
