use mind_boop_lib::tasks::task_db::{
  Task,
  create_db_task,
  list_db_tasks,
  set_db_estimated_minutes,
  set_db_task_schedule,
  show_db_task,
  update_db_task_title_and_description,
  complete_db_task
};
use rusqlite::Connection;
use uuid::Uuid;


fn insert_task_with_all_details(task: &Task, connection: &Connection) {
  connection.execute(
    "INSERT INTO tasks (id, title, description, estimated_minutes, starts_at, ends_at, is_all_day, is_completed, is_duration, created_at, updated_at)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, datetime('now'), datetime('now'))",
    rusqlite::params![task.id, task.title, task.description, task.estimated_minutes, task.starts_at, task.ends_at, task.is_all_day, task.is_completed, task.is_duration],
  ).expect("Task should get inserted to DB");
}

fn insert_sample_task(task_id: &str, title: &str, connection: &Connection) {
  connection.execute(
    "INSERT INTO tasks (id, title, created_at, updated_at)
      VALUES (?1, ?2, datetime('now'), datetime('now'))",
    rusqlite::params![task_id, title],
  ).expect("Task should get inserted to DB");
}

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
    ).expect("Task should get inserted to DB");
  };

  let result = list_db_tasks("tests", &connection);

  assert!(result.is_ok());

  let result_tasks = result.expect("Tasks should be present");
  assert_eq!(result_tasks.len(), 1);

  let matched_task = result_tasks.get(0).expect("Task should be present");
  assert_eq!(matched_task.id, tasks[3].0);
  assert_eq!(matched_task.title, "Write integration tests");
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
    ).expect("Task should get inserted to DB");
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
pub fn it_lists_uncompleted_tasks_in_order_of_starting_date_and_time() {
  let connection = set_up_db();

  let tasks = vec![
    (Uuid::new_v4().to_string(), "Buy groceries", Some("2000-01-01")),
    (Uuid::new_v4().to_string(), "Write unit tests", Some("2000-01-01T10:00:00")),
    (Uuid::new_v4().to_string(), "Write integration tests", Some("2000-01-02T08:00:00")),
    (Uuid::new_v4().to_string(), "Organize study table", None),
  ];

  for (id, title, starts_at) in &tasks {
    connection.execute(
      "INSERT INTO tasks (id, title, starts_at, created_at, updated_at)
        VALUES (?1, ?2, ?3, datetime('now'), datetime('now'))",
      rusqlite::params![id, title, starts_at],
    ).expect("Task should get inserted to DB");
  };

  let result = list_db_tasks("", &connection);

  assert!(result.is_ok());

  let result_tasks = result.expect("Tasks should be present");
  assert_eq!(result_tasks.len(), 4);

  let expected_task_ids: Vec<String> = tasks.iter().map(|task| task.0.to_string()).collect() ;
  let listed_task_ids: Vec<String> = result_tasks.iter().map(|task| task.id.clone()).collect();

  assert!(expected_task_ids.eq(&listed_task_ids));
}

#[test]
pub fn it_creates_task_when_provided_with_title() {
  let connection = set_up_db();
  let title = String::from("Test task");

  let result = create_db_task(title.clone(), &connection);

  assert!(result.is_ok());

  let created_task_id = result.expect("Id of task created should be present");

  let created_task_result: Result<String, rusqlite::Error> = connection.query_row("SELECT id, title FROM tasks WHERE id = ?1", [created_task_id], |row| row.get(1));
  let created_task_title = created_task_result.expect("Task title should be present");

  assert_eq!(created_task_title, title);
}

#[test]
pub fn it_gives_the_task_details_with_given_id() {
  let connection = set_up_db();
  let task = Task {
    id: Uuid::new_v4().to_string(),
    title: String::from("Test task"),
    description: Some(String::from("Test task description")),
    estimated_minutes: Some(15),
    starts_at: Some(String::from("Test task")),
    ends_at: None,
    is_all_day: true,
    is_completed: false,
    is_duration: false,
  };

  insert_task_with_all_details(&task, &connection);

  let result = show_db_task(task.id.clone(), &connection);

  assert!(result.is_ok());

  let fetched = result.expect("Task should be present");
  assert_eq!(fetched.id, task.id);
  assert_eq!(fetched.title, task.title);
  assert_eq!(fetched.description, task.description);
  assert_eq!(fetched.estimated_minutes, task.estimated_minutes);
  assert_eq!(fetched.starts_at, task.starts_at);
  assert_eq!(fetched.ends_at, task.ends_at);
  assert_eq!(fetched.is_all_day, task.is_all_day);
  assert_eq!(fetched.is_completed, task.is_completed);
  assert_eq!(fetched.is_duration, task.is_duration);
}

#[test]
pub fn it_updates_title_and_description_of_a_task(){
  let connection = set_up_db();
  let new_title = String::from("New task title");
  let new_description = String::from("New task description");

  let task_id = Uuid::new_v4().to_string();

  connection.execute(
    "INSERT INTO tasks (id, title, description, created_at, updated_at)
      VALUES (?1, ?2, ?3, datetime('now'), datetime('now'))",
    rusqlite::params![task_id, "Test task", "Test task description"],
  ).expect("Task should get inserted to DB");

  let result = update_db_task_title_and_description(task_id.clone(), new_title.clone(), new_description.clone(), &connection);
  assert!(result.is_ok());

  let success_msg = result.expect("Success message should be present");
  assert_eq!(String::from("Task updated successfully"), success_msg);

  let updated_task_result: Result<(String, Option<String>), rusqlite::Error> = connection.query_row("SELECT id, title, description FROM tasks WHERE id = ?1", [task_id], |row| Ok((row.get(1)?, row.get(2)?)));
  let (updated_title, description_option) = updated_task_result.expect("Task title should be present");

  assert_eq!(new_title, updated_title);
  let updated_description = description_option.expect("Description should be present");
  assert_eq!(new_description, updated_description)
}

#[test]
pub fn it_sets_estimated_minutes_of_a_task() {
  let connection = set_up_db();
  let task_id = Uuid::new_v4().to_string();

  insert_sample_task(&task_id, "Test task", &connection);

  let result = set_db_estimated_minutes(task_id.clone(), 75, &connection);
  assert!(result.is_ok());

  let success_msg = result.expect("Success message should be present");
  assert_eq!(String::from("Estimation updated successfully"), success_msg);

  let updated_task_result: Result<u16, rusqlite::Error> = connection.query_row("SELECT id, estimated_minutes FROM tasks WHERE id = ?1", [task_id], |row| row.get(1));
  let estimated_minutes = updated_task_result.expect("Estimated minutes should be present");

  assert_eq!(estimated_minutes, 75);
}

#[test]
pub fn it_marks_a_task_as_completed() {
  let connection = set_up_db();
  let task_id = Uuid::new_v4().to_string();

  insert_sample_task(&task_id, "Test task", &connection);

  let result = complete_db_task(task_id.clone(), &connection);
  assert!(result.is_ok());

  let success_msg = result.expect("Success message should be present");
  assert_eq!(String::from("Task completed"), success_msg);

  let updated_task_result: Result<bool, rusqlite::Error> = connection.query_row("SELECT id, is_completed FROM tasks WHERE id = ?1", [task_id], |row| row.get(1));
  let is_completed = updated_task_result.expect("Task title should be present");

  assert_eq!(is_completed, true);
}

#[test]
pub fn it_sets_the_schedule_of_a_task() {
  let connection = set_up_db();
  let task_id = Uuid::new_v4().to_string();

  insert_sample_task(&task_id, "Test task", &connection);

  let result = set_db_task_schedule(
    task_id.clone(),
    true,
    false,
    Some(String::from("2026-06-01T09:00:00")),
    Some(String::from("2026-06-01T10:00:00")),
    &connection,
  );
  assert!(result.is_ok());

  let success_msg = result.expect("Success message should be present");
  assert_eq!(String::from("Schedule updated successfully"), success_msg);

  let updated_task_result: Result<(bool, bool, Option<String>, Option<String>), rusqlite::Error> = connection.query_row(
    "SELECT is_duration, is_all_day, starts_at, ends_at FROM tasks WHERE id = ?1",
    [task_id],
    |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?, row.get(3)?)),
  );
  let (is_duration, is_all_day, starts_at, ends_at) = updated_task_result.expect("Task should be present");

  assert_eq!(is_duration, true);
  assert_eq!(is_all_day, false);
  assert_eq!(starts_at, Some(String::from("2026-06-01T09:00:00")));
  assert_eq!(ends_at, Some(String::from("2026-06-01T10:00:00")));
}

#[test]
pub fn it_should_raise_error_if_is_duration_is_false_but_ends_at_is_present() {
  let connection = set_up_db();
  let task_id = Uuid::new_v4().to_string();

  insert_sample_task(&task_id, "Test task", &connection);

  let result = set_db_task_schedule(
    task_id,
    false,
    false,
    Some("2026-06-01T09:00:00".to_string()),
    Some("2026-06-01T10:00:00".to_string()),
    &connection,
  );

  assert!(result.is_err());
  assert_eq!(result.unwrap_err(), "ends_at need not be populated within due date context");
}

#[test]
pub fn it_should_raise_error_if_is_duration_is_false_and_is_all_day_is_true() {
  let connection = set_up_db();
  let task_id = Uuid::new_v4().to_string();

  insert_sample_task(&task_id, "Test task", &connection);

  let result = set_db_task_schedule(
    task_id,
    false,
    true,
    Some("2026-06-01T10:00:00".to_string()),
    None,
    &connection,
  );

  assert!(result.is_err());
  assert_eq!(result.unwrap_err(), "is_all_day need not be populated within due date context");
}

#[test]
pub fn it_should_raise_error_if_due_at_is_invalid_datetime() {
  let connection = set_up_db();
  let task_id = Uuid::new_v4().to_string();

  insert_sample_task(&task_id, "Test task", &connection);

  let result = set_db_task_schedule(
    task_id,
    false,
    false,
    Some("Invalid date/datetime".to_string()),
    None,
    &connection,
  );

  assert!(result.is_err());
  assert_eq!(result.unwrap_err(), "Invalid due date/time format");
}

#[test]
pub fn it_should_set_schedule_when_starts_at_is_none() {
  let connection = set_up_db();
  let task_id = Uuid::new_v4().to_string();

  insert_sample_task(&task_id, "Test task", &connection);

  let result = set_db_task_schedule(
    task_id.clone(),
    false,
    false,
    None,
    None,
    &connection,
  );
  assert!(result.is_ok());

  let success_msg = result.expect("Success message should be present");
  assert_eq!(String::from("Schedule updated successfully"), success_msg);

  let updated_task_result: Result<(bool, bool, Option<String>, Option<String>), rusqlite::Error> = connection.query_row(
    "SELECT is_duration, is_all_day, starts_at, ends_at FROM tasks WHERE id = ?1",
    [task_id],
    |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?, row.get(3)?)),
  );
  let (is_duration, is_all_day, starts_at, ends_at) = updated_task_result.expect("Task should be present");

  assert_eq!(is_duration, false);
  assert_eq!(is_all_day, false);
  assert_eq!(starts_at, None);
  assert_eq!(ends_at, None);
}

#[test]
pub fn it_should_set_schedule_when_starts_at_is_valid_date() {
  let connection = set_up_db();
  let task_id = Uuid::new_v4().to_string();

  insert_sample_task(&task_id, "Test task", &connection);

  let result = set_db_task_schedule(
    task_id.clone(),
    false,
    false,
    Some("2026-06-01".to_string()),
    None,
    &connection,
  );
  assert!(result.is_ok());

  let success_msg = result.expect("Success message should be present");
  assert_eq!(String::from("Schedule updated successfully"), success_msg);

  let updated_task_result: Result<(bool, bool, Option<String>, Option<String>), rusqlite::Error> = connection.query_row(
    "SELECT is_duration, is_all_day, starts_at, ends_at FROM tasks WHERE id = ?1",
    [task_id],
    |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?, row.get(3)?)),
  );
  let (is_duration, is_all_day, starts_at, ends_at) = updated_task_result.expect("Task should be present");

  assert_eq!(is_duration, false);
  assert_eq!(is_all_day, false);
  assert_eq!(starts_at, Some("2026-06-01".to_string()));
  assert_eq!(ends_at, None);
}

#[test]
pub fn it_should_set_schedule_when_starts_at_is_valid_date_time() {
  let connection = set_up_db();
  let task_id = Uuid::new_v4().to_string();

  insert_sample_task(&task_id, "Test task", &connection);

  let result = set_db_task_schedule(
    task_id.clone(),
    false,
    false,
    Some("2026-06-01T10:00:00".to_string()),
    None,
    &connection,
  );
  assert!(result.is_ok());

  let success_msg = result.expect("Success message should be present");
  assert_eq!(String::from("Schedule updated successfully"), success_msg);

  let updated_task_result: Result<(bool, bool, Option<String>, Option<String>), rusqlite::Error> = connection.query_row(
    "SELECT is_duration, is_all_day, starts_at, ends_at FROM tasks WHERE id = ?1",
    [task_id],
    |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?, row.get(3)?)),
  );
  let (is_duration, is_all_day, starts_at, ends_at) = updated_task_result.expect("Task should be present");

  assert_eq!(is_duration, false);
  assert_eq!(is_all_day, false);
  assert_eq!(starts_at, Some("2026-06-01T10:00:00".to_string()));
  assert_eq!(ends_at, None);
}

#[test]
pub fn it_should_raise_error_if_schedule_is_duration_and_starts_at_is_absent() {
  let connection = set_up_db();
  let task_id = Uuid::new_v4().to_string();

  insert_sample_task(&task_id, "Test task", &connection);

  let result = set_db_task_schedule(
    task_id,
    true,
    false,
    None,
    Some(String::from("2026-06-01T10:00:00")),
    &connection,
  );

  assert!(result.is_err());
  assert_eq!(result.unwrap_err(), "starts_at must be present");
}

#[test]
pub fn it_should_raise_error_if_schedule_is_duration_and_ends_at_is_absent() {
  let connection = set_up_db();
  let task_id = Uuid::new_v4().to_string();

  insert_sample_task(&task_id, "Test task", &connection);

  let result = set_db_task_schedule(
    task_id,
    true,
    false,
    Some(String::from("2026-06-01T09:00:00")),
    None,
    &connection,
  );

  assert!(result.is_err());
  assert_eq!(result.unwrap_err(), "ends_at must be present");
}

#[test]
pub fn it_sets_schedule_when_duration_and_all_day_with_valid_dates() {
  let connection = set_up_db();
  let task_id = Uuid::new_v4().to_string();

  insert_sample_task(&task_id, "Test task", &connection);

  let result = set_db_task_schedule(
    task_id,
    true,
    true,
    Some("2026-06-01".to_string()),
    Some("2026-06-03".to_string()),
    &connection,
  );

  assert!(result.is_ok());
  assert_eq!(result.unwrap(), "Schedule updated successfully");
}

#[test]
pub fn it_should_raise_error_if_duration_is_all_day_and_starts_at_is_invalid() {
  let connection = set_up_db();
  let task_id = Uuid::new_v4().to_string();

  insert_sample_task(&task_id, "Test task", &connection);

  let result = set_db_task_schedule(
    task_id,
    true,
    true,
    Some("invalid-date".to_string()),
    Some("2026-06-03".to_string()),
    &connection,
  );

  assert!(result.is_err());
  assert_eq!(result.unwrap_err(), "Invalid starts_at date format");
}

#[test]
pub fn it_should_raise_error_if_duration_is_all_day_and_ends_at_is_invalid() {
  let connection = set_up_db();
  let task_id = Uuid::new_v4().to_string();

  insert_sample_task(&task_id, "Test task", &connection);

  let result = set_db_task_schedule(
    task_id,
    true,
    true,
    Some("2026-06-01".to_string()),
    Some("invalid-date".to_string()),
    &connection,
  );

  assert!(result.is_err());
  assert_eq!(result.unwrap_err(), "Invalid ends_at date format");
}

#[test]
pub fn it_should_raise_error_if_duration_is_not_all_day_and_starts_at_is_invalid() {
  let connection = set_up_db();
  let task_id = Uuid::new_v4().to_string();

  insert_sample_task(&task_id, "Test task", &connection);

  let result = set_db_task_schedule(
    task_id,
    true,
    false,
    Some("invalid-datetime".to_string()),
    Some("2026-06-01T10:00:00".to_string()),
    &connection,
  );

  assert!(result.is_err());
  assert_eq!(result.unwrap_err(), "Invalid starts_at datetime format");
}

#[test]
pub fn it_should_raise_error_if_duration_is_not_all_day_and_ends_at_is_invalid() {
  let connection = set_up_db();
  let task_id = Uuid::new_v4().to_string();

  insert_sample_task(&task_id, "Test task", &connection);

  let result = set_db_task_schedule(
    task_id,
    true,
    false,
    Some("2026-06-01T09:00:00".to_string()),
    Some("invalid-datetime".to_string()),
    &connection,
  );

  assert!(result.is_err());
  assert_eq!(result.unwrap_err(), "Invalid ends_at datetime format");
}
