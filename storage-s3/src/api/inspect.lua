local http = require("http")
local security = require("security")
local cloudstorage = require("cloudstorage")
local uuid = require("uuid")
local contract = require("contract")
local policy = require("policy")
local resources = require("resources")
local M = {}

function M.configure(): any
    local req, res = http.request(), http.response()
    if not req or not res then return nil, "HTTP context required" end
    res:set_content_type(http.CONTENT.JSON)
    if not security.actor() or not security.can("access", "kickside.settings.api:put_settings.endpoint") then
        res:set_status(http.STATUS.FORBIDDEN)
        return res:write_json({ success = false, error = "Settings administrator access required" })
    end
    local reset = req:method() == "DELETE"
    local body, body_err
    if not reset then body, body_err = req:body_json() end
    local checked = reset and { valid = true } or policy.validate({ value = body })
    if body_err or not checked.valid then
        res:set_status(http.STATUS.BAD_REQUEST)
        return res:write_json({ success = false, error = checked.error or "Storage policy required" })
    end
    local definition, contract_err = contract.get("kickside.settings:settings")
    if contract_err or not definition then return nil, contract_err or "Settings unavailable" end
    local settings, open_err = definition:open()
    if open_err or not settings then return nil, open_err or "Settings unavailable" end
    local args = { namespace = "kickside.storage_s3", key = "policy", value = body }
    local saved, save_err
    if reset then saved, save_err = settings:unset(args) else saved, save_err = settings:set(args) end
    if save_err or not saved or saved.success ~= true then
        res:set_status(http.STATUS.BAD_REQUEST)
        return res:write_json({ success = false, saved = saved and saved.success == true,
            error = (saved and saved.error) or tostring(save_err or "Storage settings could not be saved") })
    end
    return res:write_json({ success = true })
end

function M.handle(): any
    local req, res = http.request(), http.response()
    if not req or not res then return nil, "HTTP context required" end
    res:set_content_type(http.CONTENT.JSON)
    if not security.actor() or not security.can("access", "kickside.settings.api:put_settings.endpoint") then
        res:set_status(http.STATUS.FORBIDDEN)
        return res:write_json({ success = false, error = "Settings administrator access required" })
    end
    if req:method() == "GET" then
        local entries, find_err = resources.s3_entries()
        if find_err then
            res:set_status(http.STATUS.INTERNAL_ERROR)
            return res:write_json({ success = false, error = "Could not discover storage resources" })
        end
        local choices = {}
        for _, entry in ipairs(entries or {}) do
            choices[#choices + 1] = { id = entry.id, title = type(entry.meta) == "table" and entry.meta.title or entry.id }
        end
        table.sort(choices, function(a, b) return a.id < b.id end)
        return res:write_json({ success = true, resources = choices })
    end
    local body, body_err = req:body_json()
    local checked = policy.validate({ value = body })
    if body_err or not checked.valid or body.mode ~= "s3" then
        res:set_status(http.STATUS.BAD_REQUEST)
        return res:write_json({ success = false, error = checked.error or "S3 policy required" })
    end
    local cloud, cloud_err = cloudstorage.get(body.resource_id)
    if cloud_err then
        res:set_status(http.STATUS.BAD_REQUEST)
        return res:write_json({ success = false, error = "Could not open storage resource" })
    end
    local key = body.prefix .. "/.connection-test-" .. uuid.v4()
    local content = "Kickside private storage check " .. uuid.v4()
    local _, upload_err = cloud:upload_object(key, content, { content_type = "text/plain" })
    local head, head_err
    if not upload_err then head, head_err = cloud:head_object(key) end
    local test_err = upload_err or head_err or (not head and "Storage object was not created")
        or (head.size ~= #content and "Storage object size does not match")
    local _, delete_err = cloud:delete_objects({ key })
    cloud:release()
    if test_err or delete_err then
        res:set_status(http.STATUS.BAD_REQUEST)
        return res:write_json({ success = false, error = delete_err and "Storage cleanup failed; check bucket delete permissions" or "Storage upload verification failed" })
    end
    return res:write_json({ success = true })
end

return M
