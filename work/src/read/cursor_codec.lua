-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local base64 = require("base64")
local crypto = require("crypto")
local env = require("env")
local M = {}

local function unavailable(): error
    return errors.new({ kind = errors.UNAVAILABLE, message = "private continuation positions are unavailable",
        details = { code = "cursor_unavailable" } })
end

local function invalid(): error
    return errors.new({ kind = errors.INVALID, message = "private continuation position is invalid",
        details = { code = "invalid_query" } })
end

local function key(): (string?, error?)
    local hex, err = env.get("ENCRYPTION_KEY")
    if err or not hex or #hex ~= 64 or hex:find("[^%x]") then return nil, unavailable() end
    return (hex:gsub("%x%x", function(pair: string): string
        return string.char(tonumber(pair, 16) :: integer)
    end)), nil
end

function M.seal(value: string, context: string): (string?, error?)
    local secret, err = key()
    if err or not secret then return nil, err end
    local ciphertext, cerr = crypto.encrypt.aes(value, secret, context)
    if cerr or not ciphertext then return nil, unavailable() end
    return base64.encode(ciphertext), nil
end

function M.open(position: string, context: string): (string?, error?)
    if #position > 512 then return nil, invalid() end
    local secret, err = key()
    if err or not secret then return nil, err end
    local ciphertext, derr = base64.decode(position)
    if derr or not ciphertext then return nil, invalid() end
    local value, verr = crypto.decrypt.aes(ciphertext, secret, context)
    if verr or not value then return nil, invalid() end
    return value, nil
end

return M
