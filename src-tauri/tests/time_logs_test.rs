use mind_boop_lib::time_logs::log_db::{
  list_db_time_logs,
  create_db_time_log,
};

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

#[test]
pub fn it_creates_a_time_log() {
  let connection = set_up_db();

  let task_id = Uuid::new_v4().to_string();
  connection.execute(
    "INSERT INTO tasks (id, title, created_at, updated_at) VALUES (?1, ?2, datetime('now'), datetime('now'))",
    rusqlite::params![task_id, "Test task"],
  ).expect("Task should get inserted to DB");

  let started_at = String::from("2026-06-01T09:00:00Z");
  let completed_at = Some(String::from("2026-06-01T10:00:00Z"));

  let result = create_db_time_log(task_id.clone(), "timer".to_string(), Some(3600), started_at.clone(), completed_at.clone(), &connection);

  assert!(result.is_ok());

  let created_id = result.expect("Id of created time log should be present");

  let fetched_result: Result<(String, String, Option<u16>, String, Option<String>), rusqlite::Error> = connection.query_row(
    "SELECT task_id, mode, timer_preset, started_at, completed_at FROM time_logs WHERE id = ?1",
    [created_id],
    |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?, row.get(3)?, row.get(4)?)),
  );
  let (fetched_task_id, fetched_mode, fetched_timer_preset, fetched_started_at, fetched_completed_at) = fetched_result.expect("Time log should be present");

  assert_eq!(fetched_task_id, task_id);
  assert_eq!(fetched_mode, "timer");
  assert_eq!(fetched_timer_preset, Some(3600));
  assert_eq!(fetched_started_at, started_at);
  assert_eq!(fetched_completed_at, completed_at);
}

#[test]
pub fn it_rejects_time_log_when_started_at_is_after_completed_at() {
  let connection = set_up_db();
  let task_id = Uuid::new_v4().to_string();
  connection.execute(
    "INSERT INTO tasks (id, title, created_at, updated_at) VALUES (?1, ?2, datetime('now'), datetime('now'))",
    rusqlite::params![task_id, "Test task"],
  ).expect("Task should get inserted to DB");

  let result = create_db_time_log(
    task_id,
    "timer".to_string(),
    Some(600),
    "2026-06-01T10:00:00Z".to_string(),
    Some("2026-06-01T09:00:00Z".to_string()),
    &connection,
  );

  assert!(result.is_err());
  assert_eq!(result.unwrap_err(), "started_at must be before completed_at");
}

#[test]
pub fn it_rejects_time_log_when_gap_is_less_than_2_minutes() {
  let connection = set_up_db();
  let task_id = Uuid::new_v4().to_string();
  connection.execute(
    "INSERT INTO tasks (id, title, created_at, updated_at) VALUES (?1, ?2, datetime('now'), datetime('now'))",
    rusqlite::params![task_id, "Test task"],
  ).expect("Task should get inserted to DB");

  let result = create_db_time_log(
    task_id,
    "stopwatch".to_string(),
    None,
    "2026-06-01T09:00:00Z".to_string(),
    Some("2026-06-01T09:01:30Z".to_string()),
    &connection,
  );

  assert!(result.is_err());
  assert_eq!(result.unwrap_err(), "completed_at must be at least 2 minutes after started_at");
}

#[test]
pub fn it_rejects_time_log_when_started_at_is_invalid() {
  let connection = set_up_db();
  let task_id = Uuid::new_v4().to_string();
  connection.execute(
    "INSERT INTO tasks (id, title, created_at, updated_at) VALUES (?1, ?2, datetime('now'), datetime('now'))",
    rusqlite::params![task_id, "Test task"],
  ).expect("Task should get inserted to DB");

  let result = create_db_time_log(
    task_id,
    "timer".to_string(),
    Some(600),
    "not-a-date".to_string(),
    None,
    &connection,
  );

  assert!(result.is_err());
  assert!(result.unwrap_err().starts_with("Invalid started_at"));
}

#[test]
pub fn it_rejects_time_log_when_completed_at_is_invalid() {
  let connection = set_up_db();
  let task_id = Uuid::new_v4().to_string();
  connection.execute(
    "INSERT INTO tasks (id, title, created_at, updated_at) VALUES (?1, ?2, datetime('now'), datetime('now'))",
    rusqlite::params![task_id, "Test task"],
  ).expect("Task should get inserted to DB");

  let result = create_db_time_log(
    task_id,
    "stopwatch".to_string(),
    None,
    "2026-06-01T09:00:00Z".to_string(),
    Some("not-a-date".to_string()),
    &connection,
  );

  assert!(result.is_err());
  assert!(result.unwrap_err().starts_with("Invalid completed_at"));
}
