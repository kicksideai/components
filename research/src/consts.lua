-- Stable vocabulary for kickside.research. A research run is a canonical
-- kickside.core thread (class = THREAD_CLASS) under the requester's actor. The
-- request, every progress update, and the final result are THREAD EVENTS -- the
-- thread is the source of truth and survives the dataflow. The projection (kind =
-- PROJECTION_KIND) is DECLARED on the research_kind binding and auto-applied by the
-- engine when the run thread is created with that kind (KIND_IMPL); it folds those
-- events into research's own read model, the kickside_research_run table. The API
-- reads that table and the UI loads it then folds the same live events. Keep these
-- names stable: they are a wire contract shared by the request seam, the
-- report_progress tool, the deliver node, the worker, and the UI.
local registry = require("registry")

local M = {}

-- One thread per research run. external_ref = actor + research_id, so a run is
-- idempotent and the thread is actor-scoped.
M.THREAD_CLASS = "kickside.research"

-- Registry entry whose meta.db_id holds the configured research database resource
-- (rewritten by the target_db requirement). The read model + projection bind it.
M.DB_CONFIG = "kickside.research:db_config"

function M.db_id(): (string?, error?)
    local entry, err = registry.get(M.DB_CONFIG)
    if err then return nil, errors.wrap(err, "research db_config unavailable") end
    if not entry then return nil, errors.new({ kind = errors.INTERNAL, message = "research db_config unavailable: not found" }) end
    local meta: any = entry.meta or {}
    if type(meta.db_id) == "string" and meta.db_id ~= "" then
        return meta.db_id :: string, nil
    end
    return nil, errors.new({ kind = errors.INTERNAL, message = "research db_config.meta.db_id is not set" })
end

-- Thread event types appended to a research thread's immutable log.
M.EVENT = {
    REQUEST = "kickside.research.events:request",   -- body: { research_id, prompt, ctx, agent_id }
    PROGRESS = "kickside.research.events:progress",  -- body: { status, step, findings[], eta, urls[] }
    RESULT = "kickside.research.events:result",     -- body: { markdown, urls[] }
    FAILED = "kickside.research.events:failed",     -- body: { error }
}

-- Status folded from the event log: a run is RUNNING from its request event until
-- a terminal result or failure event lands.
M.STATUS = {
    RUNNING = "running",
    COMPLETE = "complete",
    FAILED = "failed",
}

-- kickside.core seams the component reads + writes through.
M.THREADS_UPSERT = "kickside.core.threads:upsert_method"
M.THREADS_APPEND_EVENT = "kickside.core.threads:append_event_method"
M.THREADS_CATCH_UP_PROJECTION = "kickside.core.threads:catch_up_projection_method"
M.THREADS_LIST_EVENTS = "kickside.core.threads:list_events_method"
M.THREADS_LIST = "kickside.core.threads:list_method"
M.THREADS_LIST_PROJECTIONS = "kickside.core.threads:list_projections_method"
M.THREADS_REGISTER_PROJECTION = "kickside.core.threads:register_projection_method"

-- Correlation status for a Research Block parked on its terminal event.
M.BLOCK_SIGNAL_STATUS = {
    WAITING = "waiting",
    RESUMED = "resumed",
    FAILED = "failed",
}

-- The research-run component KIND binding. A run is created with this impl_id, so
-- thread creation reads the binding and auto-applies its declared projection.
M.KIND_IMPL = "kickside.research:research_kind"

-- The read-model projection kind state.lua reads the body of. The projection's
-- full config (worker_ref/input_mode) is declared on the KIND binding (single
-- source); only the kind name is needed here to locate the materialized body.
M.PROJECTION_KIND = "kickside.research:run"

-- external_ref is the natural key for a research thread: actor + research id, so a
-- repeat request idempotently resolves the same thread.
function M.external_ref(actor_id: string, research_id: string): string
    return actor_id .. ":" .. research_id
end

return M
