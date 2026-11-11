-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local repository = require("repository")
local function empty(_limit: integer): (integer?, error?) return 0, nil end
return { expire_runs = empty, next_deadline_ms = repository.next_deadline_ms }
