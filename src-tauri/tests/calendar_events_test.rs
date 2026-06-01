use mind_boop_lib::calendar_events::event_db::list_db_events;
use rusqlite::Connection;
use uuid::Uuid;

fn set_up_db() -> Connection {
  let connection = Connection::open_in_memory().expect("Should be able to open an in-memory connection");

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
  .expect("Should be able to create tasks table");

  connection
}

fn insert_event(
  task_id: &str,
  title: &str,
  starts_at: Option<&str>,
  is_completed: bool,
  deleted_at: Option<&str>,
  connection: &Connection,
) {
  connection.execute(
    "INSERT INTO tasks (id, title, starts_at, is_completed, deleted_at, created_at, updated_at)
      VALUES (?1, ?2, ?3, ?4, ?5, datetime('now'), datetime('now'))",
    rusqlite::params![task_id, title, starts_at, is_completed as i32, deleted_at],
  ).expect("Task should get inserted to DB");
}

#[test]
pub fn it_lists_only_tasks_that_have_a_start_time() {
  let connection = set_up_db();

  let scheduled_id = Uuid::new_v4().to_string();
  let unscheduled_id = Uuid::new_v4().to_string();

  insert_event(&scheduled_id, "Scheduled task", Some("2026-06-01T09:00:00"), false, None, &connection);
  insert_event(&unscheduled_id, "Unscheduled task", None, false, None, &connection);

  let result = list_db_events(&connection);

  assert!(result.is_ok());

  let events = result.expect("Events should be present");
  assert_eq!(events.len(), 1);
  assert_eq!(events[0].id, scheduled_id);
}

#[test]
pub fn it_excludes_completed_tasks() {
  let connection = set_up_db();

  let active_id = Uuid::new_v4().to_string();
  let completed_id = Uuid::new_v4().to_string();

  insert_event(&active_id, "Active task", Some("2026-06-01T09:00:00"), false, None, &connection);
  insert_event(&completed_id, "Completed task", Some("2026-06-01T10:00:00"), true, None, &connection);

  let result = list_db_events(&connection);

  assert!(result.is_ok());

  let events = result.expect("Events should be present");
  assert_eq!(events.len(), 1);
  assert_eq!(events[0].id, active_id);
}

#[test]
pub fn it_excludes_deleted_tasks() {
  let connection = set_up_db();

  let active_id = Uuid::new_v4().to_string();
  let deleted_id = Uuid::new_v4().to_string();

  insert_event(&active_id, "Active task", Some("2026-06-01T09:00:00"), false, None, &connection);
  insert_event(&deleted_id, "Deleted task", Some("2026-06-01T10:00:00"), false, Some("2026-05-31T00:00:00"), &connection);

  let result = list_db_events(&connection);

  assert!(result.is_ok());

  let events = result.expect("Events should be present");
  assert_eq!(events.len(), 1);
  assert_eq!(events[0].id, active_id);
}

#[test]
pub fn it_lists_events_ordered_by_start_time() {
  let connection = set_up_db();

  let tasks = vec![
    (Uuid::new_v4().to_string(), "Morning task", "2026-06-01T08:00:00"),
    (Uuid::new_v4().to_string(), "Afternoon task", "2026-06-01T14:00:00"),
    (Uuid::new_v4().to_string(), "Evening task", "2026-06-01T18:00:00"),
  ];

  for (id, title, starts_at) in tasks.iter().rev() {
    insert_event(id, title, Some(starts_at), false, None, &connection);
  }

  let result = list_db_events(&connection);

  assert!(result.is_ok());

  let events = result.expect("Events should be present");
  assert_eq!(events.len(), 3);

  let event_ids: Vec<&str> = events.iter().map(|e| e.id.as_str()).collect();
  let expected_ids: Vec<&str> = tasks.iter().map(|(id, _, _)| id.as_str()).collect();
  assert_eq!(event_ids, expected_ids);
}
