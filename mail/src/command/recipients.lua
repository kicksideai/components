-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local contract = require("contract")
local message = require("message")

local function user_address(users: types.Users, id: string): (string?, error?)
    local result, err = users:get_user({identifier = id})
    if err then return nil, err end
    if not result or result.ok ~= true then
        return nil, errors.new({kind = errors.UNAVAILABLE, retryable = false,
            message = "Cannot look up a mail recipient by user ID",
            details = {code = "recipient_lookup_failed", reason = result and result.error}})
    end
    local user = result.user
    if not user or user.user_id ~= id or not message.address(user.email) then
        return nil, errors.new({kind = errors.INVALID, retryable = false,
            message = "The recipient user ID does not have a valid email address",
            details = {code = "recipient_address_missing"}})
    end
    return user.email, nil
end

local function lookup(ids: {string}): ({[string]: string}?, error?)
    if #ids == 0 then return {}, nil end
    local definition, definition_err = contract.get("kickside.users:user_provisioning")
    if definition_err then return nil, definition_err end
    local users, open_err = definition:open()
    if open_err then return nil, open_err end
    local addresses = {}
    for _, id in ipairs(ids) do
        local address, err = user_address(users :: types.Users, id)
        if err then return nil, err end
        addresses[id] = address
    end
    return addresses, nil
end

local FIELDS = {"to", "cc", "bcc"}

local function recipients(input: types.SendRequest): (types.Addresses?, error?)
    local ids: {string} = {}
    local seen: {[string]: boolean} = {}
    for _, field in ipairs(FIELDS) do
        for _, recipient in ipairs(input[field] or {}) do
            if type(recipient) == "table" and not seen[recipient.user_id] then
                seen[recipient.user_id] = true
                ids[#ids + 1] = recipient.user_id
            end
        end
    end
    local users, err = lookup(ids)
    if err then return nil, err end
    local addresses = {to = {}}
    for _, field in ipairs(FIELDS) do
        local resolved: {string} = {}
        for _, recipient in ipairs(input[field] or {}) do
            resolved[#resolved + 1] = type(recipient) == "table" and users[recipient.user_id] or recipient :: string
        end
        if #resolved > 0 then addresses[field] = resolved end
    end
    return message.normalize_addresses(addresses :: types.Addresses), nil
end

return {resolve = recipients}
