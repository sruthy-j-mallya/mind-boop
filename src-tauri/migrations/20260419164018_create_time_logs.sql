CREATE TABLE IF NOT EXISTS time_logs (
    id      TEXT PRIMARY KEY NOT NULL,
    task_id TEXT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    duration INTEGER NOT NULL
);
