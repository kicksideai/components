-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Fixture model driver. Tests use its models to reach the llm module's own
-- checks, which run before any driver call; a call that gets through is refused.
local function refuse(_args: any): (any?, error?)
    return nil, errors.new({ kind = errors.UNAVAILABLE, retryable = false, message = "the fixture driver answers no model calls" })
end

return { refuse = refuse }
