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
                id          TEXT PRIMARY KEY NOT NULL,
                task_id     TEXT NOT NULL,
                starts_at   TEXT NOT NULL,
                ends_at     TEXT NOT NULL,
                created_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                deleted_at  TEXT
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
    (Uuid::new_v4().to_string(), tasks[0].id.clone(), "2026-06-01T08:00:00Z".to_string(), "2026-06-01T08:45:00Z".to_string()),
    (Uuid::new_v4().to_string(), tasks[1].id.clone(), "2026-06-01T09:00:00Z".to_string(), "2026-06-01T10:30:00Z".to_string()),
    (Uuid::new_v4().to_string(), tasks[2].id.clone(), "2026-06-01T11:00:00Z".to_string(), "2026-06-01T11:20:00Z".to_string()),
    (Uuid::new_v4().to_string(), tasks[3].id.clone(), "2026-06-01T13:00:00Z".to_string(), "2026-06-01T14:00:00Z".to_string()),
  ];

  let ids: Vec<String> = time_logs.iter().map(|(id, _, _, _)| id.clone()).collect();

  for (id, task_id, starts_at, ends_at) in time_logs {
    connection.execute(
      "INSERT INTO time_logs (id, task_id, starts_at, ends_at) VALUES (?1, ?2, ?3, ?4)",
      (id, task_id, starts_at, ends_at),
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

  let starts_at = String::from("2026-06-01T09:00:00Z");
  let ends_at = String::from("2026-06-01T10:00:00Z");

  let result = create_db_time_log(task_id.clone(), starts_at.clone(), ends_at.clone(), &connection);

  assert!(result.is_ok());

  let created_id = result.expect("Id of created time log should be present");

  let fetched_result: Result<(String, String, String), rusqlite::Error> = connection.query_row(
    "SELECT task_id, starts_at, ends_at FROM time_logs WHERE id = ?1",
    [created_id],
    |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?)),
  );
  let (fetched_task_id, fetched_starts_at, fetched_ends_at) = fetched_result.expect("Time log should be present");

  assert_eq!(fetched_task_id, task_id);
  assert_eq!(fetched_starts_at, starts_at);
  assert_eq!(fetched_ends_at, ends_at);
}

#[test]
pub fn it_rejects_time_log_when_starts_at_is_after_ends_at() {
  let connection = set_up_db();
  let task_id = Uuid::new_v4().to_string();
  connection.execute(
    "INSERT INTO tasks (id, title, created_at, updated_at) VALUES (?1, ?2, datetime('now'), datetime('now'))",
    rusqlite::params![task_id, "Test task"],
  ).expect("Task should get inserted to DB");

  let result = create_db_time_log(
    task_id,
    "2026-06-01T10:00:00Z".to_string(),
    "2026-06-01T09:00:00Z".to_string(),
    &connection,
  );

  assert!(result.is_err());
  assert_eq!(result.unwrap_err(), "starts_at must be before ends_at");
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
    "2026-06-01T09:00:00Z".to_string(),
    "2026-06-01T09:01:30Z".to_string(),
    &connection,
  );

  assert!(result.is_err());
  assert_eq!(result.unwrap_err(), "ends_at must be at least 2 minutes after starts_at");
}

#[test]
pub fn it_rejects_time_log_when_starts_at_is_invalid() {
  let connection = set_up_db();
  let task_id = Uuid::new_v4().to_string();
  connection.execute(
    "INSERT INTO tasks (id, title, created_at, updated_at) VALUES (?1, ?2, datetime('now'), datetime('now'))",
    rusqlite::params![task_id, "Test task"],
  ).expect("Task should get inserted to DB");

  let result = create_db_time_log(
    task_id,
    "not-a-date".to_string(),
    "2026-06-01T09:00:00Z".to_string(),
    &connection,
  );

  assert!(result.is_err());
  assert!(result.unwrap_err().starts_with("Invalid starts_at"));
}

#[test]
pub fn it_rejects_time_log_when_ends_at_is_invalid() {
  let connection = set_up_db();
  let task_id = Uuid::new_v4().to_string();
  connection.execute(
    "INSERT INTO tasks (id, title, created_at, updated_at) VALUES (?1, ?2, datetime('now'), datetime('now'))",
    rusqlite::params![task_id, "Test task"],
  ).expect("Task should get inserted to DB");

  let result = create_db_time_log(
    task_id,
    "2026-06-01T09:00:00Z".to_string(),
    "not-a-date".to_string(),
    &connection,
  );

  assert!(result.is_err());
  assert!(result.unwrap_err().starts_with("Invalid ends_at"));
}
