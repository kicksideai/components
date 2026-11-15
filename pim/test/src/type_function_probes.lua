-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Harness type functions in every shape a plugin can answer.
local common = require("common")
local M = { normalize = common.normalize, validate = common.validate }

type Batch = { config: { [string]: unknown }, values: { unknown } }

function M.broken(_batch: Batch): unknown
    return { results = { {} } }
end

function M.raise(_batch: Batch): unknown
    error(errors.new({ kind = errors.UNAVAILABLE, message = "validate exploded", details = { code = "probe_validate_unavailable" } }))
end

function M.denied(_batch: Batch): (unknown, error?)
    return nil, errors.new({ kind = errors.PERMISSION_DENIED, retryable = false, message = "type owner refuses access", details = { code = "type_owner_denied", owner = "probe" } })
end

function M.malformed(batch: Batch): unknown
    local shape = batch.config.shape
    local findings: { [unknown]: unknown } = {}
    if shape == "object" then findings.denied = { message = "denied" }
    elseif shape == "sparse" then findings[2] = { message = "denied" }
    elseif shape == "code" then findings[1] = { message = "denied", code = 42 }
    else findings[1] = { message = "denied" }; findings.extra = true end
    if batch.config.check then return { findings = findings } end
    if batch.config.results then return { results = { [1] = { value = "a" }, extra = true } } end
    return { results = { { findings = findings } } }
end

return M
