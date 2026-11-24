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

local function recipients(input: types.SendRequest): (types.Addresses?, error?)
    local users: types.Users?
    local addresses = {}
    local seen: {[string]: boolean} = {}
    for _, field in ipairs({"to", "cc", "bcc"}) do
        if input[field] ~= nil then
            local resolved = {}
            for _, recipient in ipairs(input[field]) do
                local address: string
                if type(recipient) == "table" then
                    if not users then
                        local definition, definition_err = contract.get("kickside.users:user_provisioning")
                        if definition_err then return nil, definition_err end
                        local opened, open_err = definition:open()
                        if open_err then return nil, open_err end
                        users = opened :: types.Users
                    end
                    local email, err = user_address(users, recipient.user_id)
                    if err then return nil, err end
                    address = email :: string
                else
                    address = recipient :: string
                end
                local at = address:find("@", 1, true) :: integer
                local key = address:sub(1, at) .. address:sub(at + 1):lower()
                if not seen[key] then
                    seen[key] = true
                    resolved[#resolved + 1] = address
                end
            end
            if #resolved > 0 then addresses[field] = resolved end
        end
    end
    return addresses :: types.Addresses, nil
end

return {resolve = recipients}
