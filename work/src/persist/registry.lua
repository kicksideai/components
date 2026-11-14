-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local storage = require("storage")
-- The installation prefix registry: a system component whose thread records which
-- board holds which key prefix. Each prefix is a subject; its version counts claims
-- and releases, so an odd version means the prefix is held; a prefix row records the
-- version its claim produced.
local autoinit = require("autoinit")
local consts = require("consts")
local types = require("domain")

local M = {}

local function subject_of(prefix: string): string
    return "prefix:" .. prefix
end

-- thread_id is the deterministic id of the registry component.
function M.thread_id(): string
    return autoinit.component_id(autoinit.SYSTEM_SCOPE_KEY, consts.REGISTRY_CLASS) :: string
end

local function taken(prefix: string): error
    return errors.new({ kind = errors.INVALID, message = "key prefix " .. prefix .. " is taken", details = { code = "key_prefix_taken" } })
end

-- version reads the current version of a prefix subject: 0 when never claimed.
function M.version(c: types.ThreadClient, prefix: string): (integer?, error?)
    local opaque: unknown = c
    local finder = opaque :: storage.Finder
    local found, err = finder:find({ thread_id = M.thread_id(), subject = subject_of(prefix) })
    if err then return nil, errors.wrap(err, "prefix registry read failed") end
    if type(found) ~= "table" then
        return nil, errors.new({ details = { code = "registry_denied" }, kind = errors.PERMISSION_DENIED, message = "the prefix registry is not readable by the caller" })
    end
    local version = math.tointeger((found :: { subject_version: unknown }).subject_version)
    if not version then return nil, errors.new({ details = { code = "row_corrupt" }, kind = errors.INTERNAL, message = "prefix registry returned no subject version" }) end
    return version, nil
end

-- claim builds the registry write that claims prefix for board_id, or the taken error
-- when the prefix is held.
function M.claim(c: types.ThreadClient, prefix: string, board_id: string, actor: string, at: string, trace_context: types.TraceContext?): (types.Write?, error?)
    local version, err = M.version(c, prefix)
    if not version then return nil, err end
    if version % 2 == 1 then return nil, taken(prefix) end
    return {
        group = "registry", thread_id = M.thread_id(), ops = {}, caller_expect = false, expect_subject = subject_of(prefix), expect_version = version,
        events = { { trace_context = trace_context, type = consts.EVENTS.PREFIX_CLAIMED, subject = subject_of(prefix),
            body = { prefix = prefix, board = board_id, actor = actor, at = at } } },
    }, nil
end

-- release builds the registry write that releases the claim a prefix row records, or
-- nil when that claim is already released. A subject behind the recorded claim version
-- contradicts the log and is an internal error.
function M.release(c: types.ThreadClient, prefix: string, claim_version: integer, board_id: string, at: string): (types.Write?, error?)
    local version, err = M.version(c, prefix)
    if not version then return nil, err end
    if version > claim_version then return nil, nil end
    if version < claim_version then
        return nil, errors.new({ kind = errors.INTERNAL, message = "prefix " .. prefix .. " row records claim version " .. claim_version
            .. " but the registry is at " .. version, details = { code = "prefix_claim_ahead", prefix = prefix } })
    end
    return {
        group = "registry", thread_id = M.thread_id(), ops = {}, caller_expect = false, expect_subject = subject_of(prefix), expect_version = claim_version,
        events = { { type = consts.EVENTS.PREFIX_RELEASED, subject = subject_of(prefix), body = { prefix = prefix, board = board_id, at = at } } },
    }, nil
end

M.taken = taken

return M
