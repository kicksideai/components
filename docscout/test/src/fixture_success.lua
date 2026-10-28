-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {}
function M.structured(args: any): (any?, error?)
    local chunk = args.schema.properties.total.properties.evidence.items.properties.chunk.enum[1]
    return { result = { data = { total = { found = true, value = 1250, confidence = 1,
        evidence = { { chunk = chunk, quote = "The total amount is 1250." } } } } },
        tokens = { prompt_tokens = 12, completion_tokens = 8 } }, nil
end
function M.embed(args: any): (any?, error?)
    local vectors = {}
    for i = 1, #args.input do
        local vector = {}
        for n = 1, 512 do vector[n] = n == 1 and 1.0 or 0.0 end
        vectors[i] = vector
    end
    return { result = { embeddings = vectors }, tokens = { prompt_tokens = #args.input, completion_tokens = 0 } }, nil
end
function M.status(_args: any): (any?, error?) return { status = "ready" }, nil end
return M
