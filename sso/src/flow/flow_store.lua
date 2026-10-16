-- Server-side storage for the in-flight login flow, keyed by the random state.
-- Holds the PKCE verifier, nonce, redirect_uri, and post-login target between the
-- start redirect and the provider callback. Entries are one-time (taken on
-- callback) and TTL'd, so a replayed or stale state cannot complete a login.

local store = require("store")
local json = require("json")
local consts = require("sso_consts")

local STORE_ID = "kickside.sso:flow_store"

local M = {}

local function key(state)
    return "flow:" .. tostring(state)
end

-- put persists a flow payload under its state for up to ttl seconds.
function M.put(state, payload, ttl)
    if type(state) ~= "string" or state == "" then
        return false, "state is required"
    end
    local s, err = store.get(STORE_ID)
    if err or not s then return false, "flow store unavailable" end
    local ok, serr = s:set(key(state), json.encode(payload), ttl or consts.FLOW_TTL_SECONDS)
    s:release()
    if not ok then return false, serr or "failed to store flow" end
    return true
end

-- take returns and deletes the flow payload for a state (one-time use), or nil
-- when absent/expired.
function M.take(state)
    if type(state) ~= "string" or state == "" then return nil end
    local s, err = store.get(STORE_ID)
    if err or not s then return nil, "flow store unavailable" end
    local raw = s:get(key(state))
    if raw ~= nil then s:delete(key(state)) end
    s:release()
    if raw == nil then return nil end
    local payload, derr = json.decode(tostring(raw))
    if derr or type(payload) ~= "table" then return nil, "corrupt flow payload" end
    return payload
end

return M
