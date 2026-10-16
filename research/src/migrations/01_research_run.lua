-- kickside.research read-model schema.
--
-- kickside_research_run is research's OWN materialized read model, kept in sync by
-- the run projection (projection.lua) that folds the canonical thread events
-- (request / progress / result / failed) into one row per run. The thread is the
-- source of truth; this table is the queryable projection the API and UI read.
-- One row per research run, keyed by research_id; thread_id carries the cascade so
-- the row is torn down with its component (deletable contract).
return require("migration").define(function()
    migration("kickside research run read model", function()
        database("postgres", function()
            up(function(db)
                db:execute([[
                    CREATE TABLE kickside_research_run (
                        research_id   TEXT PRIMARY KEY,
                        thread_id     TEXT NOT NULL,
                        actor_id      TEXT NOT NULL DEFAULT '',
                        title         TEXT NOT NULL DEFAULT '',
                        prompt        TEXT NOT NULL DEFAULT '',
                        agent_id      TEXT NOT NULL DEFAULT '',
                        status        TEXT NOT NULL DEFAULT 'running',
                        latest_step   TEXT NOT NULL DEFAULT '',
                        result_md     TEXT NOT NULL DEFAULT '',
                        urls          TEXT NOT NULL DEFAULT '[]',
                        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                        updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
                    )
                ]])
                db:execute([[CREATE INDEX idx_kickside_research_run_actor ON kickside_research_run (actor_id, updated_at DESC)]])
                db:execute([[CREATE INDEX idx_kickside_research_run_thread ON kickside_research_run (thread_id)]])
            end)
            down(function(db)
                db:execute([[DROP TABLE IF EXISTS kickside_research_run]])
            end)
        end)

        database("sqlite", function()
            up(function(db)
                db:execute([[
                    CREATE TABLE kickside_research_run (
                        research_id   TEXT PRIMARY KEY,
                        thread_id     TEXT NOT NULL,
                        actor_id      TEXT NOT NULL DEFAULT '',
                        title         TEXT NOT NULL DEFAULT '',
                        prompt        TEXT NOT NULL DEFAULT '',
                        agent_id      TEXT NOT NULL DEFAULT '',
                        status        TEXT NOT NULL DEFAULT 'running',
                        latest_step   TEXT NOT NULL DEFAULT '',
                        result_md     TEXT NOT NULL DEFAULT '',
                        urls          TEXT NOT NULL DEFAULT '[]',
                        created_at    TEXT NOT NULL DEFAULT (datetime('now')),
                        updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
                    )
                ]])
                db:execute([[CREATE INDEX idx_kickside_research_run_actor ON kickside_research_run (actor_id, updated_at)]])
                db:execute([[CREATE INDEX idx_kickside_research_run_thread ON kickside_research_run (thread_id)]])
            end)
            down(function(db)
                db:execute([[DROP TABLE IF EXISTS kickside_research_run]])
            end)
        end)
    end)
end)
