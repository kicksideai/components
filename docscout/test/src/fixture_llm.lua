-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Fixture provider returns a native refusal; the small-window model also tests prompt admission.
local function refuse(_args: any): (any?, error?)
    return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = false, message = "the fixture driver answers no model calls",
        details = { code = "provider_refused" } })
end

return { refuse = refuse }
