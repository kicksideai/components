-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {}
local mode = "missing"
function M.set(value: string) mode = value end
local function source(): error
    return errors.new({ kind = errors.PERMISSION_DENIED, retryable = false, message = "settings refuses access", details = { code = "settings_access_denied", marker = "kept" } })
end
function M.get(_id: string): (unknown, error?)
    if mode == "missing" then return nil, nil end
    if mode == "native" then return nil, source() end
    return { open = function(): (unknown, error?)
        if mode == "no_client" then return nil, nil end
        return {
            get = function(_self, _request): (unknown, error?)
                if mode == "response_native" then return { success = false, error = source() }, nil end
                if mode == "unreadable" then return { success = false, error = "settings read fails" }, nil end
                return { success = true, value = false }, nil
            end,
            get_namespace = function(): (unknown, error?)
                if mode == "response_native" then return { success = false, error = source() }, nil end
                if mode == "unreadable" then return { success = false, error = "settings read fails" }, nil end
                return { success = true, values = false }, nil
            end,
        }, nil
    end }, nil
end
return M
