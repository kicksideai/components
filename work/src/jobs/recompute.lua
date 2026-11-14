-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local consts = require("consts")
return { kind = "recompute", batch_id = "kickside.work.jobs:recompute_batch", owner = consts.RECOMPUTE_OWNER,
    batches = consts.LIMITS.recompute_batches_per_run, event = consts.EVENTS.ROLLUPS_RECOMPUTED }
