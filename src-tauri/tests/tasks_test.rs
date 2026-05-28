use mind_boop_lib::tasks::task::list_db_tasks;
use rusqlite::Connection;
use uuid::Uuid;

fn establish_db_connection() -> Connection {
  Connection::open_in_memory().expect("failed to open in-memory database")
}

fn create_task_table(connection: &Connection) {
  connection.execute_batch(
        "CREATE TABLE IF NOT EXISTS tasks (
            id                  TEXT    PRIMARY KEY NOT NULL,
            title               TEXT    NOT NULL,
            description         TEXT,
            estimated_minutes   INTEGER NOT NULL DEFAULT 0,
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
        );",
    )
    .expect("failed to run migrations");
}

#[test]
pub fn it_lists_tasks_with_a_given_search_string() {
  let connection = establish_db_connection();
  create_task_table(&connection);

  let tasks = vec![
    (Uuid::new_v4().to_string(), "Buy groceries", 1),
    (Uuid::new_v4().to_string(), "Write unit tests", 1),
    (Uuid::new_v4().to_string(), "Organize study table", 0),
    (Uuid::new_v4().to_string(), "Write integration tests", 0)
  ];

  for (id, title, is_completed) in tasks {
    connection.execute(
      "INSERT INTO tasks (id, title, is_completed, created_at, updated_at)
        VALUES (?1, ?2, ?3, datetime('now'), datetime('now'))",
      rusqlite::params![id, title, is_completed],
    ).expect("failed to insert task");
  };

  let result = list_db_tasks(&connection, "tests");
  assert!(result.is_ok());
}
