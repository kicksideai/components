-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local json = require("json")
local contract = require("contract")
local security = require("security")
local M = {}
type Map = { [string]: unknown }
function M.run(native: { thread_id: string, projection: { body: Map }, range: { from_seq: integer, to_seq: integer } }): (Map?, error?)
    local body = native.projection.body
    local client = assert(contract.get("kickside.pim:catalog")):with_actor(security.actor()):with_scope(security.scope()):open()
    local input, ferr = client:plugin_feed({ catalog_id = native.thread_id, plugin = body.worker_config.plugin, kind = "app:state_fold", token = body.token })
    if ferr then return nil, ferr end
    input.catalog_id, input.plugin = native.thread_id, body.worker_config.plugin
    if input.config.fail then return nil, errors.new({kind=errors.INVALID,message="state mapping refuses configuration",details={code="state_map_refused"}}) end
    local db, err = sql.get("app:db")
    if err or not db then return nil, err end
    local _, derr = db:execute("CREATE TABLE IF NOT EXISTS pim_test_plugin_state (catalog_id TEXT NOT NULL, product_id TEXT NOT NULL, body TEXT NOT NULL, PRIMARY KEY (catalog_id, product_id))", {})
    if derr then db:release(); return nil, derr end
    for _, change in ipairs(input.changes) do
        local _, werr = db:execute("INSERT INTO pim_test_plugin_state (catalog_id, product_id, body) VALUES ($1, $2, $3) ON CONFLICT (catalog_id, product_id) DO UPDATE SET body=excluded.body", { input.catalog_id, change.product_id, json.encode({ change = change, bootstrap = input.bootstrap, config = input.config, attachment_id = input.attachment_id, plugin = input.plugin }) })
        if werr then db:release(); return nil, werr end
    end
    local _, rerr = db:release()
    if rerr then return nil, rerr end
    body.token = input.token
    return { body = body, last_seq = input.done and native.range.to_seq or native.range.from_seq - 1 }, nil
end
return M
