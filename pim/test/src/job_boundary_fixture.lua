-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Job dependencies expose executed work and lease completion to boundary tests.
local types = require("types")
local sql = require("sql")
local M = { calls = 0, completed = 0, request = nil :: unknown }
local source: error? = nil
local release_error: error? = nil
local done_after = 1
M.CONTEXT_KEY = "_execution_identity"
function M.done_after(n: integer) done_after = n end
function M.get_private_context(id: string): (unknown, error?)
    if id ~= "catalog" then return nil, errors.new({ kind = errors.INVALID, retryable = false, message = "unexpected scheduling fixture catalog", details = { code = "fixture_catalog_invalid" } }) end
    return { _execution_identity = { principal = { id = "scheduler-probe" } } }, nil
end
function M.validate(identity: unknown): (boolean, error?)
    local value = identity :: { principal: { id: string } }
    if value.principal.id ~= "scheduler-probe" then
        return false, errors.new({ kind = errors.INVALID, retryable = false, message = "unexpected scheduling fixture identity", details = { code = "fixture_identity_invalid" } })
    end
    return true, nil
end
function M.reset(err: error?, cleanup_err: error?)
    M.calls, M.completed, M.request, source, release_error, done_after = 0, 0, nil, err, cleanup_err, 1
end
function M.lease_valid(_id: string, _lease: unknown): (boolean, error?) return true, nil end
function M.complete(_id: string, _lease: unknown, _result: unknown): (unknown, error?)
    M.completed = M.completed + 1
    return {}, nil
end
function M.run_as(_identity: unknown, _target: string, request: unknown, _options: unknown): (unknown, error?)
    M.calls = M.calls + 1
    M.request = request
    if source then return nil, source end
    return { remaining = 0, done = M.calls >= done_after }, nil
end
function M.open(): (sql.DB?, error?)
    return { release = function() return release_error == nil, release_error end } :: sql.DB, nil
end
function M.get(_db: unknown, _catalog_id: string, _vocabulary: string, _from: string): (types.Merge?, error?)
    return { catalog_id = "catalog", vocabulary = "v", from = "a", into = "b", identity = {}, requested_by = "actor", created_at = "now" }, nil
end
function M.delete(_db: unknown, _catalog_id: string, _vocabulary: string, _from: string): error? return nil end
return M
