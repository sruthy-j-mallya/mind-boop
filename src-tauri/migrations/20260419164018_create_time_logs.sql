CREATE TABLE IF NOT EXISTS time_logs (
    id                            TEXT PRIMARY KEY NOT NULL,
    task_id                       TEXT NOT NULL,
    mode                          TEXT NOT NULL,
    timer_preset                  INTEGER NOT NULL DEFAULT 300,
    accumulated_elapsed_seconds   INTEGER NOT NULL DEFAULT 0,
    pause_count                   INTEGER NOT NULL DEFAULT 0,
    is_running                    INTEGER NOT NULL DEFAULT 0,
    current_run_started_at        INTEGER,
    started_at                    INTEGER NOT NULL,
    completed_at                  INTEGER,
    created_at                    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at                    TEXT
);
