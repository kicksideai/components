-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Request-level checks shared by the write commands: board access, the calling actor, the command time and
-- the common errors.
local security = require("security")
local component = require("component")
local clock = require("clock")
local error_envelope = require("error_envelope")

local M = {}


function M.invalid(message: string, details: { [string]: unknown }?): error
    local metadata = details or {}
    metadata.code = metadata.code or "invalid_request"
    return errors.new({ kind = errors.INVALID, message = message, details = metadata })
end

-- stamp_now is the command time in canonical UTC precision.
function M.stamp_now(): string
    return clock.now()
end

-- Commands carry WRITE; read surfaces check READ independently.
function M.write_access(): integer
    return component.ACCESS.WRITE :: integer
end

function M.admin_access(): integer
    return component.ACCESS.ADMIN :: integer
end

-- authorization distinguishes an explicit refusal from a failed lookup.
function M.authorization(err: error?): (boolean, error?)
    if not err then return true, nil end
    if err:kind() == errors.PERMISSION_DENIED then return false, nil end
    return false, err
end

function M.require_access(board_id: string, access: integer): error?
    if not security.actor() then return errors.new({ details = { code = "authentication_required" }, kind = errors.PERMISSION_DENIED, message = "an authenticated actor is required" }) end
    if board_id == "" then return M.invalid("board_id required") end
    local _, err = component.validate_access(board_id, access)
    if err then
        local received = err :: error
        local details = received:details() or {}
        if received:kind() == errors.PERMISSION_DENIED and details.code == nil then
            return error_envelope.wrap(received, "board access denied", { code = "board_access_denied", board_id = board_id, access = access })
        end
        return errors.wrap(received, "board access denied")
    end
    return nil
end

-- actor_id names the caller; require_access has already refused calls without one.
function M.actor_id(): string
    return (security.actor() :: security.Actor):id()
end

function M.owner_access(board_id: string, actor_id: string): error?
    if M.actor_id() == actor_id then return nil end
    return M.require_access(board_id, M.admin_access())
end

function M.busy(): error
    return errors.new({ kind = errors.UNAVAILABLE, retryable = true, message = "board is busy", details = { code = "busy" } })
end

return M
