CREATE TABLE IF NOT EXISTS time_logs (
    id      TEXT PRIMARY KEY NOT NULL,
    task_id TEXT NOT NULL,
    starts_at TEXT NOT NULL,
    ends_at TEXT NOT NULL,
    created_at          TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at          TEXT
);
