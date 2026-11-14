-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local consts = require("consts")
return { kind = "reindex", batch_id = "kickside.work.jobs:reindex_batch", owner = consts.REINDEX_OWNER,
    batches = consts.LIMITS.recompute_batches_per_run, event = consts.EVENTS.INDEX_REBUILT }
