-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Typed access to the Core threads contract for board and registry threads.
-- Callers open the contract under the caller's actor and scope and get narrowed
-- results.
local contract = require("contract")
local security = require("security")
local store = require("store")
local types = require("types")

local THREADS = "kickside.core:threads"

local limits = require("limits")
local M = {}

local function field(v: unknown, name: string): unknown
    if type(v) ~= "table" then return nil end
    return (v :: { [string]: unknown })[name]
end

function M.open(): (types.ThreadClient?, error?)
    local def, err = contract.get(THREADS)
    if err then return nil, errors.wrap(err, "threads contract unavailable") end
    if not def then return nil, errors.new({ details = { code = "contract_unavailable" }, kind = errors.UNAVAILABLE, message = "threads contract unavailable" }) end
    local client, oerr = def:with_actor(security.actor()):with_scope(security.scope()):open()
    if oerr then return nil, errors.wrap(oerr, "threads open failed") end
    if type(client) ~= "table" and type(client) ~= "userdata" then
        return nil, errors.new({ details = { code = "contract_unavailable" }, kind = errors.UNAVAILABLE, message = "threads open returned no client" })
    end
    return client :: types.ThreadClient, nil
end

-- catch_up waits for the target sequence, defaulting to the head sampled by Core.
function M.catch_up(c: types.ThreadClient, thread_id: string, kind: string, deadline: types.Deadline, target_seq: integer?): (types.CatchUp?, error?)
    local settings, settings_err = limits.read()
    if settings_err or not settings then return nil, settings_err end
    local result, err = c:catch_up_projection({ thread_id = thread_id, kind = kind, max_ticks = settings.projection_catchup_ticks, deadline = deadline.at, target_seq = target_seq })
    if err then return nil, errors.wrap(err, "projection catch-up failed") end
    local done = field(result, "done") == true
    local last_seq = store.int(field(result, "last_seq"))
    if done and not last_seq then return nil, errors.new({ details = { code = "row_corrupt" }, kind = errors.INTERNAL, message = "catch-up reported no last_seq" }) end
    return { done = done, last_seq = last_seq }, nil
end

-- mismatch reports whether err is the expect conflict named by reason
-- (head_mismatch or version_mismatch).
function M.mismatch(err: error, reason: string): boolean
    if err:kind() ~= errors.CONFLICT then return false end
    local details = err:details() or {}
    return details.reason == reason
end

-- Every name is already fenced by its Work owner. Never call in a SQL write transaction.
function M.retire(board_id: string, subjects: {string}): error?
    if #subjects == 0 then return nil end
    local client, err = M.open()
    if err or not client then return err end
    local _, rerr = client:retire_subjects({thread_id=board_id, subjects=subjects})
    return rerr
end

return M
