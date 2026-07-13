use mind_boop_lib::timer::timer_db;

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
      );"
  ).expect("failed to run migrations");

  connection
}

fn insert_sample_task(task_id: &str, title: &str, connection: &Connection) {
  connection.execute(
    "INSERT INTO tasks (id, title, created_at, updated_at)
      VALUES (?1, ?2, strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))",
    rusqlite::params![task_id, title],
  ).expect("Task should get inserted to DB");
}

fn insert_timer_timelog(timer_id: &str, connection: &Connection) {
  let task_id = Uuid::new_v4().to_string();
  insert_sample_task(&task_id, "Test task", connection);
  connection.execute(
    "INSERT INTO time_logs (
        id, task_id, mode, timer_preset, accumulated_elapsed_seconds,
        pause_count, is_running, current_run_started_at,
        started_at, created_at, updated_at
    )
    VALUES (
        ?1, ?2, 'timer', 600, 0,
        0, 1, strftime('%s', 'now') - 600,
        strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), strftime('%Y-%m-%dT%H:%M:%SZ', 'now')
    )",
    rusqlite::params![timer_id, task_id],
  ).expect("Time log should get inserted to DB");
}


#[test]
pub fn it_creates_time_log_record_for_timer() {
  let connection = set_up_db();

  let task_id = Uuid::new_v4().to_string();
  insert_sample_task(&task_id, "Test task", &connection);

  let result = timer_db::add_new_timer(task_id.clone(), String::from("timer"), Some(600), &connection);
  assert!(result.is_ok());

  let id = result.unwrap();
  let (db_task_id, mode, timer_preset, accumulated_elapsed_seconds, pause_count, is_running, current_run_started_at, completed_at): (String, String, Option<u16>, u16, i64, i32, Option<u32>, Option<String>) = connection.query_row(
    "SELECT task_id, mode, timer_preset, accumulated_elapsed_seconds, pause_count, is_running, current_run_started_at, completed_at FROM time_logs WHERE id = ?1",
    rusqlite::params![&id],
    |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?, row.get(3)?, row.get(4)?, row.get(5)?, row.get(6)?, row.get(7)?)),
  ).unwrap();

  assert_eq!(db_task_id, task_id);
  assert_eq!(mode, "timer");
  assert_eq!(timer_preset, Some(600));
  assert_eq!(accumulated_elapsed_seconds, 0);
  assert_eq!(pause_count, 0);
  assert_eq!(is_running, 1);
  assert!(current_run_started_at.is_some());
  assert!(completed_at.is_none());
}

#[test]
pub fn it_creates_time_log_record_for_stopwatch() {
  let connection = set_up_db();

  let task_id = Uuid::new_v4().to_string();
  insert_sample_task(&task_id, "Test task", &connection);

  let result = timer_db::add_new_timer(task_id.clone(), String::from("stopwatch"), None, &connection);
  assert!(result.is_ok());

  let id = result.unwrap();
  let (db_task_id, mode, timer_preset, accumulated_elapsed_seconds, pause_count, is_running, current_run_started_at, completed_at): (String, String, Option<u16>, u16, i64, i32, Option<u32>, Option<String>) = connection.query_row(
    "SELECT task_id, mode, timer_preset, accumulated_elapsed_seconds, pause_count, is_running, current_run_started_at, completed_at FROM time_logs WHERE id = ?1",
    rusqlite::params![&id],
    |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?, row.get(3)?, row.get(4)?, row.get(5)?, row.get(6)?, row.get(7)?)),
  ).unwrap();

  assert_eq!(db_task_id, task_id);
  assert_eq!(mode, "stopwatch");
  assert!(timer_preset.is_none());
  assert_eq!(accumulated_elapsed_seconds, 0);
  assert_eq!(pause_count, 0);
  assert_eq!(is_running, 1);
  assert!(current_run_started_at.is_some());
  assert!(completed_at.is_none());
}

#[test]
pub fn it_marks_a_timer_as_paused() {
  let connection = set_up_db();

  let timer_id = Uuid::new_v4().to_string();
  insert_timer_timelog(&timer_id, &connection);

  let result = timer_db::mark_as_paused(timer_id.clone(), &connection);
  assert!(result.is_ok());

  let (accumulated_elapsed_seconds, pause_count, is_running, current_run_started_at, completed_at): (u16, i64, i32, Option<u32>, Option<String>) = connection.query_row(
    "SELECT accumulated_elapsed_seconds, pause_count, is_running, current_run_started_at, completed_at FROM time_logs WHERE id = ?1",
    rusqlite::params![&timer_id],
    |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?, row.get(3)?, row.get(4)?)),
  ).unwrap();

  assert!(accumulated_elapsed_seconds > 0);
  assert_eq!(pause_count, 1);
  assert_eq!(is_running, 0);
  assert!(current_run_started_at.is_none());
  assert!(completed_at.is_none());
}

#[test]
pub fn it_marks_a_timer_as_restarted() {
  let connection = set_up_db();

  let timer_id: String = Uuid::new_v4().to_string();
  insert_timer_timelog(&timer_id, &connection);

  let result = timer_db::mark_as_restarted(timer_id.clone(), &connection);
  assert!(result.is_ok());

  let (is_running, current_run_started_at): (i32, Option<u32>) = connection.query_row(
    "SELECT is_running, current_run_started_at FROM time_logs WHERE id = ?1",
    rusqlite::params![&timer_id],
    |row| Ok((row.get(0)?, row.get(1)?)),
  ).unwrap();

  assert_eq!(is_running, 1);
  assert!(current_run_started_at.is_some());
}

#[test]
pub fn it_marks_a_timer_as_completed() {
  let connection = set_up_db();

  let timer_id: String = Uuid::new_v4().to_string();
  insert_timer_timelog(&timer_id, &connection);

  let result = timer_db::mark_as_completed(timer_id.clone(), &connection);
  assert!(result.is_ok());

  let (accumulated_elapsed_seconds, is_running, current_run_started_at, completed_at): (u16, i32, Option<u32>, Option<String>) = connection.query_row(
    "SELECT accumulated_elapsed_seconds, is_running, current_run_started_at, completed_at FROM time_logs WHERE id = ?1",
    rusqlite::params![&timer_id],
    |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?, row.get(3)?)),
  ).unwrap();

  assert!(accumulated_elapsed_seconds > 0);
  assert_eq!(is_running, 0);
  assert!(current_run_started_at.is_none());
  assert!(completed_at.is_some());
}

#[test]
pub fn it_gives_the_state_of_running_timer_when_present() {
  let connection = set_up_db();

  let timer_id: String = Uuid::new_v4().to_string();
  insert_timer_timelog(&timer_id, &connection);

  let result = timer_db::get_the_current_running_timer_status(&connection);
  assert!(result.is_ok());

  let state = result.unwrap();
  assert!(state.is_some());

  let timer_state = state.unwrap();
  assert_eq!(timer_state.id, timer_id);
  assert_eq!(timer_state.mode, "timer");
  assert_eq!(timer_state.timer_preset, Some(600));
  assert!(timer_state.current_run_started_at.is_some());
  assert!(timer_state.is_running);
}

#[test]
pub fn it_gives_none_when_running_timer_is_absent() {
  let connection = set_up_db();

  let timer_id: String = Uuid::new_v4().to_string();
  insert_timer_timelog(&timer_id, &connection);

  let mark_completed = timer_db::mark_as_completed(timer_id.clone(), &connection);
  assert!(mark_completed.is_ok());

  let result = timer_db::get_the_current_running_timer_status(&connection);
  assert!(result.is_ok());
  assert!(result.unwrap().is_none());
}
