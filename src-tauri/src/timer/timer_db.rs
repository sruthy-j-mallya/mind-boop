use rusqlite::{named_params, Connection, OptionalExtension};
use serde::Serialize;
use uuid::Uuid;
use crate::time_helpers::now_iso;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TimerState {
    pub id: String,
    pub task_id: String,
    pub mode: String,
    pub timer_preset: Option<u16>,
    pub current_run_started_at: Option<u32>,
    pub accumulated_elapsed_seconds: u16,
    pub is_running: bool,
}

pub fn add_new_timer(
  task_id: String,
  mode: String,
  timer_preset: Option<u16>,
  connection: &Connection,
) -> Result<String, String> {
  let id = Uuid::new_v4().to_string();
  let now = now_iso();

  connection.execute(
    "INSERT INTO time_logs (
      id, task_id, mode, timer_preset, is_running,
      started_at, current_run_started_at,
      created_at, updated_at
    )
    VALUES (
      :id, :task_id, :mode, :timer_preset, 1,
      :now, strftime('%s', 'now'),
      :now, :now
    )",
    named_params! {
      ":id": id,
      ":task_id": task_id,
      ":mode": mode,
      ":timer_preset": timer_preset,
      ":now": now,
    },
  ).map_err(|e| e.to_string())?;

  Ok(id)
}

pub fn mark_as_paused(id: String, connection: &Connection) -> Result<(), String> {
  let now = now_iso();
  connection.execute(
    "UPDATE time_logs SET
      is_running = 0,
      accumulated_elapsed_seconds = accumulated_elapsed_seconds + (strftime('%s', 'now') - current_run_started_at),
      pause_count = pause_count + 1,
      current_run_started_at = NULL,
      updated_at = :now
    WHERE id = :id",
    named_params! { ":id": id, ":now": now },
  ).map_err(|e| e.to_string())?;

  Ok(())
}

pub fn mark_as_restarted(id: String, connection: &Connection) -> Result<(), String> {
  let now = now_iso();
  connection.execute(
    "UPDATE time_logs SET
      is_running = 1,
      current_run_started_at = strftime('%s', 'now'),
      updated_at = :now
    WHERE id = :id",
    named_params! { ":id": id, ":now": now },
  ).map_err(|e| e.to_string())?;

  Ok(())
}

pub fn mark_as_completed(id: String, connection: &Connection) -> Result<(), String> {
  let now = now_iso();
  connection.execute(
    "UPDATE time_logs SET
      is_running = 0,
      accumulated_elapsed_seconds = accumulated_elapsed_seconds + (strftime('%s', 'now') - current_run_started_at),
      current_run_started_at = NULL,
      completed_at = :now,
      updated_at = :now
    WHERE id = :id",
    named_params! { ":id": id, ":now": now },
  ).map_err(|e| e.to_string())?;

  Ok(())
}

pub fn get_the_current_running_timer_status(connection: &Connection) -> Result<Option<TimerState>, String> {
    let mut stmt = connection
        .prepare(
            "SELECT id, task_id, mode, timer_preset, current_run_started_at, accumulated_elapsed_seconds, is_running
             FROM time_logs
             WHERE completed_at IS NULL AND deleted_at IS NULL
             LIMIT 1",
        )
        .map_err(|e| e.to_string())?;

    let result = stmt
        .query_row([], |row| {
            Ok(TimerState {
                id: row.get(0)?,
                task_id: row.get(1)?,
                mode: row.get(2)?,
                timer_preset: row.get(3)?,
                current_run_started_at: row.get(4)?,
                accumulated_elapsed_seconds: row.get(5)?,
                is_running: row.get::<_, i32>(6)? != 0,
            })
        })
        .optional()
        .map_err(|e| e.to_string())?;

    Ok(result)
}
