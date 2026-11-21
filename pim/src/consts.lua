-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Stable PIM identifiers, event types and limits.

local catalog_limits = require("catalog_limits")
local M = {}

M.DB_CONFIG = "kickside.pim.persist:config"
M.PROJECTION_KIND = "kickside.pim:catalog_model"
M.CATALOG_IMPL = "kickside.pim.binding:catalog"
M.THREAD_CLASS = "pim.catalog"
M.REBUILD_OWNER = "kickside.pim.jobs:rebuild"
M.REBUILD_BATCH = "kickside.pim.jobs:rebuild_batch"
-- MERGE_OWNER is the term merge job; MERGE_BATCH the command it issues as the merging actor.
M.MERGE_OWNER = "kickside.pim.jobs:term_merge"
M.MERGE_BATCH = "kickside.pim.jobs:term_merge_batch"
M.RELEASE_OWNER = "kickside.pim.jobs:release_model"
M.RELEASE_BATCH = "kickside.pim.jobs:release_model_batch"
M.EXTERNAL_SOURCE = "pim"

local NS = "kickside.pim.events:"
M.EVENTS = {
    PLUGIN_REBUILD = NS .. "plugin.rebuild",
    PLUGIN_CONFIGURED = NS .. "plugin.configured",
    SCHEMA_APPLIED = NS .. "schema.applied",
    PRODUCT_CREATED = NS .. "product.created",
    PRODUCT_CHANGED = NS .. "product.changed",
    PRODUCT_MOVED = NS .. "product.moved",
    PRODUCT_DELETED = NS .. "product.deleted",
    PRODUCT_RESTORED = NS .. "product.restored",
    ASSET_RESERVED = NS .. "asset.reserved",
    ASSETS_REAPING = NS .. "assets.reaping",
    PRODUCT_PURGED = NS .. "product.purged",
    TERM_CHANGED = NS .. "term.changed",
    MODEL_RELEASE_REQUESTED = NS .. "model.release_requested",
    PROPOSAL_SUBMITTED = NS .. "proposal.submitted",
    PROPOSAL_DECIDED = NS .. "proposal.decided",
    PRODUCT_RELEASED = NS .. "product.released",
    PRODUCT_WITHDRAWN = NS .. "product.withdrawn",
}


M.STATUSES = { active = true, draft = true, archived = true }

M.LIMITS = {
    asset_bytes = 25 * 1024 * 1024,
    items = catalog_limits.items,
    -- merge_inline is how many products a term merge rewrites in its own
    -- command; the rest wait for the term merge job.
    merge_inline = 500,
    -- columns is how many attributes a query may resolve per item.
    columns = catalog_limits.columns,
    document_bytes = 262144,
    dimensions = 4,
    members = 64,
    depth = 2,
    descendants = 2000,
    indexed_columns = 400,
    command_deadline_ms = 5000,
    request_bytes = 4194304,
    request_depth = 16,
    request_entries = 4096,
    page = catalog_limits.page,
    page_default = catalog_limits.page_default,
    feed_page = catalog_limits.feed_page,
    count = catalog_limits.count,
    scan = catalog_limits.scan,
    term_depth = 64,
    requirement_sets = 64,
    snapshot_bytes = 524288,
    release_items = catalog_limits.release_items,
    fold_rows = 20000,
    merge_holders = 20000,
    sku_bytes = 128,
}

return M
