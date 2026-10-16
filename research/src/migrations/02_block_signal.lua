-- kickside_research_block_signal schema.
--
-- Correlation store for a parked Research Block Signal. The Block arm inserts one row
-- keyed by research_id (deterministic: "block:" .. dataflow_id .. ":" .. signal_id, so a
-- re-armed retry of the same Block Signal is idempotent). resume_from_event marks the
-- row resumed/failed exactly once when the research thread's terminal event lands, so
-- a duplicate terminal event never double-resumes the parked Signal.
return require("migration").define(function()
    migration("kickside research block signal correlation", function()
        database("postgres", function()
            up(function(db)
                db:execute([[
                    CREATE TABLE kickside_research_block_signal (
                        research_id         TEXT PRIMARY KEY,
                        thread_id           TEXT NOT NULL,
                        dataflow_id         TEXT NOT NULL DEFAULT '',
                        signal_id           TEXT NOT NULL DEFAULT '',
                        status              TEXT NOT NULL DEFAULT 'waiting',
                        terminal_event_id   TEXT NOT NULL DEFAULT '',
                        created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                        updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
                    )
                ]])
                db:execute([[CREATE INDEX idx_kickside_research_block_signal_thread ON kickside_research_block_signal (thread_id)]])
                db:execute([[CREATE INDEX idx_kickside_research_block_signal_dataflow ON kickside_research_block_signal (dataflow_id, signal_id)]])
            end)
            down(function(db)
                db:execute([[DROP TABLE IF EXISTS kickside_research_block_signal]])
            end)
        end)

        database("sqlite", function()
            up(function(db)
                db:execute([[
                    CREATE TABLE kickside_research_block_signal (
                        research_id         TEXT PRIMARY KEY,
                        thread_id           TEXT NOT NULL,
                        dataflow_id         TEXT NOT NULL DEFAULT '',
                        signal_id           TEXT NOT NULL DEFAULT '',
                        status              TEXT NOT NULL DEFAULT 'waiting',
                        terminal_event_id   TEXT NOT NULL DEFAULT '',
                        created_at          TEXT NOT NULL DEFAULT (datetime('now')),
                        updated_at          TEXT NOT NULL DEFAULT (datetime('now'))
                    )
                ]])
                db:execute([[CREATE INDEX idx_kickside_research_block_signal_thread ON kickside_research_block_signal (thread_id)]])
                db:execute([[CREATE INDEX idx_kickside_research_block_signal_dataflow ON kickside_research_block_signal (dataflow_id, signal_id)]])
            end)
            down(function(db)
                db:execute([[DROP TABLE IF EXISTS kickside_research_block_signal]])
            end)
        end)
    end)
end)
