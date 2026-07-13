use mind_boop_lib::time_logs::log_db::list_db_time_logs;

use rusqlite::Connection;
use uuid::Uuid;

fn set_up_db() -> Connection {
  let connection = Connection::open_in_memory().expect("failed to open in-memory database");

  connection.execute_batch(
        "CREATE TABLE IF NOT EXISTS tasks (
                id                  TEXT    PRIMARY KEY NOT NULL,
                title               TEXT    NOT NULL,
                description         TEXT,
                estimated_minutes   INTEGER,
                is_duration         INTEGER NOT NULL DEFAULT 0,
                is_all_day          INTEGER NOT NULL DEFAULT 0,
                is_completed        INTEGER NOT NULL DEFAULT 0,
                starts_at           TEXT,
                ends_at             TEXT,
                created_at          TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at          TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
                deleted_at          TEXT
            );
            CREATE TABLE IF NOT EXISTS time_logs (
                id                            TEXT PRIMARY KEY NOT NULL,
                task_id                       TEXT NOT NULL,
                mode                          TEXT NOT NULL,
                timer_preset                  INTEGER,
                accumulated_elapsed_seconds   INTEGER NOT NULL DEFAULT 0,
                pause_count                   INTEGER NOT NULL DEFAULT 0,
                is_running                    INTEGER NOT NULL DEFAULT 0,
                current_run_started_at        INTEGER,
                started_at                    TEXT NOT NULL,
                completed_at                  TEXT,
                created_at                    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at                    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                deleted_at                    TEXT
            );",
    )
    .expect("failed to run migrations");

  connection
}

struct Task {
  id: String,
  title: String,
}

fn create_sample_tasks_and_time_logs(connection: &Connection) -> Vec<String> {
  let tasks: Vec<Task> = vec![
    Task { id: Uuid::new_v4().to_string(), title: "Buy Groceries".to_string() },
    Task { id: Uuid::new_v4().to_string(), title: "Write unit tests".to_string() },
    Task { id: Uuid::new_v4().to_string(), title: "Organize study table".to_string() },
    Task { id: Uuid::new_v4().to_string(), title: "Write integration tests".to_string() },
  ];

  for task in &tasks {
    connection.execute(
      "INSERT INTO tasks (id, title) VALUES (?1, ?2)",
      (&task.id, &task.title),
    ).expect("failed to create task");
  }

  let time_logs = vec![
    (Uuid::new_v4().to_string(), tasks[0].id.clone(), "timer",     Some(1500i64), "2026-06-01T08:00:00Z".to_string(), Some("2026-06-01T08:45:00Z".to_string())),
    (Uuid::new_v4().to_string(), tasks[1].id.clone(), "timer",     Some(3600i64), "2026-06-01T09:00:00Z".to_string(), Some("2026-06-01T10:30:00Z".to_string())),
    (Uuid::new_v4().to_string(), tasks[2].id.clone(), "stopwatch", None,          "2026-06-01T11:00:00Z".to_string(), Some("2026-06-01T11:20:00Z".to_string())),
    (Uuid::new_v4().to_string(), tasks[3].id.clone(), "stopwatch", None,          "2026-06-01T13:00:00Z".to_string(), None),
  ];

  let ids: Vec<String> = time_logs.iter().map(|(id, _, _, _, _, _)| id.clone()).collect();

  for (id, task_id, mode, timer_preset, started_at, completed_at) in time_logs {
    connection.execute(
      "INSERT INTO time_logs (id, task_id, mode, timer_preset, started_at, completed_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
      rusqlite::params![id, task_id, mode, timer_preset, started_at, completed_at],
    ).expect("failed to create time log");
  }

  ids
}

#[test]
pub fn it_list_time_logs() {
  let connection = set_up_db();

  let expected_ids = create_sample_tasks_and_time_logs(&connection);

  let logs = list_db_time_logs(&connection).expect("failed to list time logs");

  let actual_ids: Vec<String> = logs.iter().map(|log| log.id.clone()).collect();
  assert_eq!(actual_ids, expected_ids);
}
