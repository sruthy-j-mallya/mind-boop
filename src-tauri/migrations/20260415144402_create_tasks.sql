CREATE TABLE IF NOT EXISTS tasks (
    id                  TEXT    PRIMARY KEY NOT NULL,
    title               TEXT    NOT NULL,
    description         TEXT,
    estimated_minutes   INTEGER,
    is_duration         INTEGER NOT NULL DEFAULT 0,
    is_all_day          INTEGER NOT NULL DEFAULT 0,
    is_completed        INTEGER NOT NULL DEFAULT 0,
    starts_at           TEXT,
    starts_on           TEXT,
    ends_at             TEXT,
    ends_on             TEXT,
    created_at          TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at          TEXT
);

CREATE INDEX IF NOT EXISTS idx_tasks_is_completed ON tasks(is_completed);
CREATE INDEX IF NOT EXISTS idx_tasks_deleted_at ON tasks(deleted_at);
