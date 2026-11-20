-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Agent tools invoke one exact contract method under the caller's identity.
local ctx = require("ctx")
local catalog_client = require("catalog_client")
local M = {}
type Map = { [string]: unknown }

local function run(method: string, args: Map, catalog_id: unknown): (Map?, error?)
    local input: Map = {}
    for key, value in pairs(args) do input[key] = value end
    if input.catalog_id == nil then input.catalog_id = catalog_id end
    local client, err = catalog_client.open()
    if err then return nil, err end
    local service = client :: catalog_client.Catalog
    local invoke = service[method] :: (catalog_client.Catalog, Map) -> (Map?, error?)
    local out, cerr = invoke(service, input)
    if cerr then return nil, cerr end
    local result = out :: Map
    result.success = true
    return result, nil
end

function M.list_catalogs(args: Map): (Map?, error?) return run("list", args, nil) end
function M.get_schema(args: Map): (Map?, error?) return run("get_schema", args, ctx.get("catalog_id")) end
function M.policy_defaults(args: Map): (Map?, error?) return run("policy_defaults", args, ctx.get("catalog_id")) end
function M.schema_options(args: Map): (Map?, error?) return run("schema_options", args, ctx.get("catalog_id")) end
function M.list_terms(args: Map): (Map?, error?) return run("list_terms", args, ctx.get("catalog_id")) end
function M.query(args: Map): (Map?, error?) return run("query", args, ctx.get("catalog_id")) end
function M.get(args: Map): (Map?, error?) return run("get", args, ctx.get("catalog_id")) end
function M.explain(args: Map): (Map?, error?) return run("explain", args, ctx.get("catalog_id")) end
function M.list_history(args: Map): (Map?, error?) return run("list_history", args, ctx.get("catalog_id")) end
function M.list_links(args: Map): (Map?, error?) return run("list_links", args, ctx.get("catalog_id")) end
function M.list_proposals(args: Map): (Map?, error?) return run("list_proposals", args, ctx.get("catalog_id")) end
function M.list_releases(args: Map): (Map?, error?) return run("list_releases", args, ctx.get("catalog_id")) end
function M.get_release(args: Map): (Map?, error?) return run("get_release", args, ctx.get("catalog_id")) end
function M.list_publications(args: Map): (Map?, error?) return run("list_publications", args, ctx.get("catalog_id")) end
function M.list_changes(args: Map): (Map?, error?) return run("list_changes", args, ctx.get("catalog_id")) end
function M.apply(args: Map): (Map?, error?) return run("apply", args, ctx.get("catalog_id")) end
function M.propose(args: Map): (Map?, error?) return run("propose", args, ctx.get("catalog_id")) end
function M.decide(args: Map): (Map?, error?) return run("decide", args, ctx.get("catalog_id")) end
function M.release(args: Map): (Map?, error?) return run("release", args, ctx.get("catalog_id")) end
function M.withdraw(args: Map): (Map?, error?) return run("withdraw", args, ctx.get("catalog_id")) end
function M.create_catalog(args: Map): (Map?, error?) return run("create", args, nil) end
function M.plan_schema(args: Map): (Map?, error?) return run("plan_schema", args, ctx.get("catalog_id")) end
function M.apply_schema(args: Map): (Map?, error?) return run("apply_schema", args, ctx.get("catalog_id")) end

function M.configure_plugin(args: Map): (Map?, error?) return run("configure_plugin", args, ctx.get("catalog_id")) end
function M.rebuild(args: Map): (Map?, error?) return run("rebuild", args, ctx.get("catalog_id")) end

return M
