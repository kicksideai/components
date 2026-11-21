-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local contract = require("contract")
local security = require("security")

local M = {}
local PLUGIN = "app.compliance:plugin"
local REPLICA = "app.compliance:replica"
local SCOPE = "app.compliance:approved"

type Map = { [string]: unknown }
type Event = { seq: integer, type: string }
type Callback = {
    thread_id: string, projection: { body: Map }, events: { Event },
    range: { from_seq: integer, to_seq: integer },
}

local function catalog()
    return assert(contract.get("kickside.pim:catalog")):with_actor(security.actor()):with_scope(security.scope()):open()
end

local function write(run: (sql.Transaction) -> error?): error?
    local db, err = sql.get("app:db")
    if err or not db then return err end
    local tx, terr = db:begin()
    if terr or not tx then db:release(); return terr end
    local failure = run(tx)
    if failure then
        tx:rollback()
    else
        local _, commit_error = tx:commit()
        failure = commit_error
    end
    local _, release_error = db:release()
    return failure or release_error
end

function M.state(input: Callback): (Map?, error?)
    local body = input.projection.body
    local page, err = catalog():plugin_feed({
        catalog_id = input.thread_id, plugin = PLUGIN, kind = REPLICA, token = body.token,
    })
    if err then return nil, err end
    local config = page.config
    local failure = write(function(tx: sql.Transaction): error?
        if not body.token or page.gap then
            local _, reset = tx:execute("DELETE FROM pim_test_compliance_replica WHERE catalog_id=$1", { input.thread_id })
            if reset then return reset end
        end
        for i, row in ipairs(page.changes) do
            local _, change_err
            if row.op == "upsert" then
                local certificate = (row.values or {})["compliance.certificate"]
                local value = certificate and certificate[""]
                local region = type(value) == "string" and value:match("^([A-Z][A-Z])%-") or ""
                _, change_err = tx:execute([[INSERT INTO pim_test_compliance_replica (catalog_id, product_id, attachment_id, region)
                    VALUES ($1,$2,$3,$4) ON CONFLICT (catalog_id, product_id)
                    DO UPDATE SET attachment_id=excluded.attachment_id, region=excluded.region]],
                    { input.thread_id, row.product_id, page.attachment_id, region })
            else
                _, change_err = tx:execute("DELETE FROM pim_test_compliance_replica WHERE catalog_id=$1 AND product_id=$2",
                    { input.thread_id, row.product_id })
            end
            if change_err then return change_err end
            if config.crash and i == 1 then
                error(errors.new({ kind = errors.INVALID, retryable = false,
                    message = "Compliance replica crashed after its first row", details = { code = "compliance_mid_batch" } }))
            end
        end
        return nil
    end)
    if failure then return nil, failure end
    body.token = page.token
    return { body = body, last_seq = page.done and input.range.to_seq or input.range.from_seq - 1 }, nil
end

function M.events(input: Callback): (Map?, error?)
    local context, err = catalog():plugin_context({ catalog_id = input.thread_id, plugin = PLUGIN })
    if err then return nil, err end
    local failure = write(function(tx: sql.Transaction): error?
        for _, event in ipairs(input.events) do
            local _, event_err = tx:execute([[INSERT INTO pim_test_compliance_events (catalog_id, seq, attachment_id, event_type)
                VALUES ($1,$2,$3,$4) ON CONFLICT (catalog_id, seq) DO NOTHING]],
                { input.thread_id, event.seq, context.attachment_id, event.type })
            if event_err then return event_err end
        end
        return nil
    end)
    if failure then return nil, failure end
    return { body = input.projection.body, last_seq = input.range.to_seq }, nil
end

function M.approve(input: { catalog_id: string, sku: string }): (unknown, error?)
    local client = catalog()
    local _, err = client:plugin_context({ catalog_id = input.catalog_id, plugin = PLUGIN })
    if err then return nil, err end
    local found, gerr = client:get({ catalog_id = input.catalog_id, product = { sku = input.sku } })
    if gerr then return nil, gerr end
    local product = found.product
    local certificate = found.values["compliance.certificate"].value
    if type(certificate) ~= "string" then
        return nil, errors.new({ kind = errors.INVALID, message = "A certificate is required before approval" })
    end
    local threads, terr = assert(contract.get("kickside.core:threads")):with_actor(security.actor()):with_scope(security.scope()):open()
    if terr then return nil, terr end
    return threads:append_events({ thread_id = input.catalog_id, events = { {
        type = "app.compliance:certificate.approved",
        body = { product_id = product.product_id, certificate = certificate, version = product.version },
        external = { external_source = PLUGIN, external_id = product.product_id .. ":" .. product.version },
    } } })
end

function M.approved(input: { catalog_id: string, region: string }): (unknown, error?)
    local client = catalog()
    local _, err = client:plugin_context({ catalog_id = input.catalog_id, plugin = PLUGIN })
    if err then return nil, err end
    local found, qerr = client:query({ catalog_id = input.catalog_id, scopes = { { id = SCOPE, where = { region = { eq = input.region } } } } })
    if qerr then return nil, qerr end
    return { items = found.items }, nil
end

function M.delete(): (Map?, error?)
    local attachment = require("ctx").get("component_id")
    local failure = write(function(tx: sql.Transaction): error?
        local _, replica = tx:execute("DELETE FROM pim_test_compliance_replica WHERE attachment_id=$1", { attachment })
        if replica then return replica end
        local _, events = tx:execute("DELETE FROM pim_test_compliance_events WHERE attachment_id=$1", { attachment })
        return events
    end)
    if failure then return nil, failure end
    return { success = true }, nil
end

return M
