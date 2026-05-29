use mind_boop_lib::tasks::tasks_db::{list_db_tasks};
use rusqlite::Connection;
use uuid::Uuid;


fn set_up_db() -> Connection {
  let connection = Connection::open_in_memory().expect("failed to open in-memory database");

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

  connection
}

#[test]
pub fn it_lists_uncompleted_tasks_tasks_with_a_given_search_string() {
  let connection = set_up_db();

  let tasks = vec![
    (Uuid::new_v4().to_string(), "Buy groceries", 1),
    (Uuid::new_v4().to_string(), "Write unit tests", 1),
    (Uuid::new_v4().to_string(), "Organize study table", 0),
    (Uuid::new_v4().to_string(), "Write integration tests", 0)
  ];

  for (id, title, is_completed) in &tasks {
    connection.execute(
      "INSERT INTO tasks (id, title, is_completed, created_at, updated_at)
        VALUES (?1, ?2, ?3, datetime('now'), datetime('now'))",
      rusqlite::params![id, title, is_completed],
    ).expect("failed to insert task");
  };

  let result = list_db_tasks("tests", &connection);

  assert!(result.is_ok());

  let result_tasks = result.expect("Tasks should be present");
  assert_eq!(result_tasks.len(), 1);
  if let Some(matched_task) = result_tasks.get(0) {
    assert_eq!(matched_task.id, tasks[3].0);
    assert_eq!(matched_task.title, "Write integration tests");
  }
}

#[test]
pub fn it_lists_all_uncompleted_tasks_when_search_string_is_absent() {
  let connection = set_up_db();

  let tasks = vec![
    (Uuid::new_v4().to_string(), "Buy groceries", 1),
    (Uuid::new_v4().to_string(), "Write unit tests", 1),
    (Uuid::new_v4().to_string(), "Organize study table", 0),
    (Uuid::new_v4().to_string(), "Write integration tests", 0)
  ];

  for (id, title, is_completed) in &tasks {
    connection.execute(
      "INSERT INTO tasks (id, title, is_completed, created_at, updated_at)
        VALUES (?1, ?2, ?3, datetime('now'), datetime('now'))",
      rusqlite::params![id, title, is_completed],
    ).expect("failed to insert task");
  };

  let result = list_db_tasks("", &connection);

  assert!(result.is_ok());

  let result_tasks = result.expect("Tasks should be present");
  assert_eq!(result_tasks.len(), 2);

  let expected_task_ids: Vec<String> = tasks.iter().skip(2).map(|task| task.0.clone()).collect() ;
  let listed_task_ids: Vec<String> = result_tasks.iter().map(|task| task.id.clone()).collect();

  assert!(expected_task_ids.eq(&listed_task_ids));
}

#[test]
#[ignore = "This test will be enabled once all the date and time values are stored as ISO string in SQLite"]
pub fn it_lists_uncompleted_tasks_in_order_of_starting_date_and_time() {
  let connection = set_up_db();

  let tasks = vec![
    (Uuid::new_v4().to_string(), "Buy groceries", Some("01-01-2000"), Some("10:00")),
    (Uuid::new_v4().to_string(), "Write unit tests", Some("01-01-2000"), None),
    (Uuid::new_v4().to_string(), "Write integration tests", Some("02-01-2000"), Some("08:00")),
    (Uuid::new_v4().to_string(), "Organize study table", None, None),
  ];

  for (id, title, starts_at, starts_on) in &tasks {
    connection.execute(
      "INSERT INTO tasks (id, title, starts_at, starts_on, created_at, updated_at)
        VALUES (?1, ?2, ?3, ?4, datetime('now'), datetime('now'))",
      rusqlite::params![id, title, starts_at, starts_on],
    ).expect("failed to insert task");
  };

  let result = list_db_tasks("", &connection);

  assert!(result.is_ok());

  let result_tasks = result.expect("Tasks should be present");
  assert_eq!(result_tasks.len(), 4);

  let expected_task_ids: Vec<String> = tasks.iter().map(|task| task.1.to_string()).collect() ;
  let listed_task_ids: Vec<String> = result_tasks.iter().map(|task| task.title.clone()).collect();

  println!("{:?}", expected_task_ids);
  println!("{:?}", listed_task_ids);
  assert!(expected_task_ids.eq(&listed_task_ids));
}
