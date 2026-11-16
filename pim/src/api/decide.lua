-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- POST /pim/catalogs/{id}/proposals/{proposal_id}/decision - accept or reject a proposal.
local access = require("access")

local function handler()
    access.command("decide", { "proposal_id" })
end

return { handler = handler }
