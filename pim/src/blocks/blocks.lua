-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Function Blocks over the catalog contract: each Block is one exact method,
-- run as the Flow's caller through kickside.pim:catalog, so access and
-- validation are the contract's. The Block config names the catalog; the input
-- is the method's request without it.
local catalog_client = require("catalog_client")

local M = {}

type Map = { [string]: unknown }
type Args = { input: unknown, config: unknown }



local function run(method: string, args: unknown): (unknown, error?)
    local a = (type(args) == "table" and args or {}) :: Args
    local config = (type(a.config) == "table" and a.config or {}) :: Map
    local catalog_id = config.catalog_id
    if type(catalog_id) ~= "string" or catalog_id == "" then
        return nil, errors.new({ kind = errors.INVALID, message = "config.catalog_id is required", details = { code = "invalid_config" } })
    end
    local input: Map = {}
    for k, v in pairs((type(a.input) == "table" and a.input or {}) :: Map) do input[k] = v end
    input.catalog_id = catalog_id
    if method == "wait_for_product" then input.timeout_ms = config.timeout_ms end
    return catalog_client.call(method, input)
end

function M.get_product(args: unknown): (unknown, error?) return run("get", args) end
function M.query_products(args: unknown): (unknown, error?) return run("query", args) end
function M.apply(args: unknown): (unknown, error?) return run("apply", args) end
function M.release(args: unknown): (unknown, error?) return run("release", args) end
function M.wait_for_product(args: unknown): (unknown, error?) return run("wait_for_product", args) end

return M
