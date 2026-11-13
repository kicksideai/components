-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Stable work identifiers, event types and limits.

local M = {}

M.DB_CONFIG = "kickside.work.persist:config"
M.PROJECTION_KIND = "kickside.work:board_model"
M.BOARD_IMPL = "kickside.work.binding:board"
M.BOARD_CONTRACT = "kickside.work:board"
M.THREAD_CLASS = "work.board"
M.REGISTRY_IMPL = "kickside.work.binding:registry"
M.REGISTRY_CLASS = "work_registry"
M.REGISTRY_THREAD_CLASS = "work.registry"
M.WAIT_TIMER = "$wait"
M.RETRY_TIMER_PREFIX = "$retry:"
M.STAGE_TIMER_PREFIX = "$stage:"
M.PROCESS_JOB = "kickside.work.jobs:process"
M.ADVANCE_JOB = "kickside.work.jobs:advance"
M.MIGRATION_JOB = "kickside.work.jobs:migrate"
M.REINDEX_JOB = "kickside.work.jobs:reindex"
M.REINDEX_OWNER = "kickside.work.jobs:reindex"
M.RECOMPUTE_JOB = "kickside.work.jobs:recompute"
M.RECOMPUTE_OWNER = "kickside.work.jobs:recompute"
M.REBALANCE_JOB = "kickside.work.jobs:rebalance"
M.REBALANCE_OWNER = "kickside.work.jobs:rebalance"
M.MIGRATION_OWNER = "kickside.work.jobs:migrate"
M.EXTERNAL_SOURCE = "work"
M.PRINCIPAL_TARGET = "principal"
M.ITEM_TARGET = "kickside.work:item"

local NS = "kickside.work.events:"
M.EVENTS = {
    BOARD_UPDATED = "kickside.work.events:board.updated",
    BULK_PROGRESS = NS .. "bulk.progress",
    MOVE_PREPARED = NS .. "item.move_prepared",
    ITEM_MOVED_IN = NS .. "item.moved_in",
    ITEM_MOVED_OUT = NS .. "item.moved_out",
    COMMAND_RECORDED = "kickside.work.command:command.recorded",
    PLUGIN_REBUILD = NS .. "plugin.rebuild",
    PLUGIN_CONFIGURED = NS .. "plugin.configured",
    SCHEMA_APPLIED = NS .. "schema.applied",
    ITEM_CREATED = NS .. "item.created",
    ITEM_CHANGED = NS .. "item.changed",
    ITEM_RANKED = NS .. "item.ranked",
    INDEX_REBUILT = NS .. "index.rebuilt",
    ROLLUPS_RECOMPUTED = NS .. "rollups.recomputed",
    RANK_REBALANCED = NS .. "rank.rebalanced",
    ITEM_PARENTED = NS .. "item.parented",
    ITEM_LINKED = NS .. "item.linked",
    ITEM_UNLINKED = NS .. "item.unlinked",
    ITEM_PURGED = NS .. "item.purged",
    ITEM_DELETED = NS .. "item.deleted",
    ITEM_RESTORED = NS .. "item.restored",
    STAGE_ENTERED = NS .. "stage.entered",
    STAGE_REPORTED = NS .. "stage.reported",
    APPROVAL_RECORDED = NS .. "approval.recorded",
    TIMER_FIRED = NS .. "timer.fired",
    ITEM_TRANSITIONED = NS .. "item.transitioned",
    ITEM_MIGRATED = NS .. "item.migrated",
    COMMENT_ADDED = NS .. "comment.added",
    COMMENT_EDITED = NS .. "comment.edited",
    COMMENT_DELETED = NS .. "comment.deleted",
    PREFIX_CLAIMED = NS .. "prefix.claimed",
    PREFIX_RELEASED = NS .. "prefix.released",
}

M.CATEGORIES = { triage = true, backlog = true, unstarted = true, started = true, completed = true, canceled = true }
M.TERMINAL = { completed = true, canceled = true }
M.STATE_KINDS = { human = true, automated = true, gate = true, parallel = true }
M.PROCESS_KEYS = { id = true, name = true, initial = true, states = true, transitions = true, migration = true, map = true }
M.STATE_KEYS = { awaiting = true, id = true, name = true, category = true, kind = true, stage = true, assign = true, require = true, due = true,
    timers = true, run = true, release_when = true, regions = true, join = true, invariants = true }
M.TRANSITION_KEYS = { people = true, id = true, name = true, from = true, to = true, require = true, set = true, auto = true, order = true, default = true, when = true, guards = true }
M.TIMER_KEYS = { id = true, after = true, at_field = true, by = true, table = true, interrupting = true, ["repeat"] = true, ["then"] = true }
M.STAGE_KEYS = { max_visits = true, on_exhausted = true, timeout = true, stage = true, retry = true, on_fail = true, on_pass = true, on_cancel = true }
M.RETRY_KEYS = { max = true, backoff = true }
M.RELEASE_KEYS = { approvals = true, wait = true, when = true }
M.APPROVAL_KEYS = { min = true, from = true, prevent_self = true }
M.APPROVAL_GROUP_KEYS = { group = true }
M.PRINCIPAL_KEYS = { kind = true, id = true }
M.REGION_KEYS = { id = true, initial = true }
M.TIMER_EFFECT_KEYS = { emit = true, transition = true }
M.STAGE_OUTCOMES = { passed = true, failed = true, canceled = true }
M.MIGRATIONS = { follow = true, pin = true }
M.MIGRATION_DEFAULTS = { human = "follow", gate = "follow", automated = "pin", parallel = "pin" }
M.PRINCIPAL_KINDS = { user = true, group = true, service = true }
M.FORMS = { text = true, int = true, dec = true, quantity = true, bool = true, time = true, ref = true, record = true }
M.CARDINALITIES = { one = true, list = true, set = true }
M.INDEXES = { none = true, key = true, number = true }
M.KINDS = { option = true, principal = true, counter = true, rollup = true, item = true, rank = true, formula = true, rich_text = true }

M.KEY_PREFIX_PATTERN = "^[A-Z][A-Z0-9]*$"
M.KEY_PREFIX_MIN = 2
M.KEY_PREFIX_MAX = 10
M.ID_PATTERN = "^[a-z][a-z0-9_]*$"

M.LIMITS = {
    stage_outputs = 65536,
    plugin_fragment_bytes = 262144,
    rollup_children = 2000,
    rollup_links = 2000,
    recompute_batch = 500,
    recompute_batches_per_run = 20,
    ops = 200,
    fields = 200,
    item_types = 50,
    migration_batch = 500,
    migration_batches_per_run = 20,
    states = 64,
    transitions = 256,
    auto_steps = 8,
    depth = 5,
    subtree_rows = 5000,
    mentions = 200,
    mention_id_bytes = 255,
    rank_length = 64,
    rebalance_batch = 500,
    rebalance_batches_per_run = 20,
    page = 200,
    comments = 200,
    children = 200,
    comment_bytes = 65536,
    command_deadline_ms = 5000,
    read_deadline_ms = 2000,
    fold_rows = 5000,
    retention_batch = 100,
    prepare_retries = 3,
}

return M
