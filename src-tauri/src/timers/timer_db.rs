use rusqlite::{Connection, OptionalExtension};
use serde::Serialize;
use uuid::Uuid;

#[derive(Serialize)]
pub struct TimerState {
    pub id: String,
    pub task_id: String,
    pub mode: String,
    pub timer_preset: u16,
    pub accumulated_elapsed_seconds: u32,
    pub is_running: bool,
}

pub fn start_timer(
  task_id: String,
  mode: String,
  timer_preset: u16,
  connection: &Connection,
) -> Result<String, String> {
  let id = Uuid::new_v4().to_string();

  connection.execute(
    "INSERT INTO time_logs (
      id, task_id, mode, timer_preset, is_running,
      started_at, current_run_started_at, created_at, updated_at
    )
    VALUES (
      ?1, ?2, ?3, ?4, 1,
      datetime('now'), datetime('now'), datetime('now'), datetime('now')
    )",
    (&id, task_id, mode, timer_preset),
  ).map_err(|e| e.to_string())?;

  Ok(id)
}

pub fn pause_timer(id: String, connection: &Connection) -> Result<(), String> {
  connection.execute(
    "UPDATE time_logs SET
      is_running = 0,
      accumulated_elapsed_seconds = accumulated_elapsed_seconds + (strftime('%s', 'now') - strftime('%s', current_run_started_at)),
      pause_count = pause_count + 1,
      current_run_started_at = NULL,
      updated_at = datetime('now')
    WHERE id = ?1",
    (&id,),
  ).map_err(|e| e.to_string())?;

  Ok(())
}

pub fn restart_timer(id: String, connection: &Connection) -> Result<(), String> {
  connection.execute(
    "UPDATE time_logs SET
      is_running = 1,
      current_run_started_at = datetime('now'),
      updated_at = datetime('now')
    WHERE id = ?1",
    (&id,),
  ).map_err(|e| e.to_string())?;

  Ok(())
}

pub fn complete_timer(id: String, connection: &Connection) -> Result<(), String> {
  connection.execute(
    "UPDATE time_logs SET
      is_running = 0,
      accumulated_elapsed_seconds = accumulated_elapsed_seconds + (strftime('%s', 'now') - strftime('%s', current_run_started_at)),
      current_run_started_at = NULL,
      completed_at = datetime('now')
      updated_at = datetime('now')
    WHERE id = ?1",
    (&id,),
  ).map_err(|e| e.to_string())?;

  Ok(())
}

pub fn get_timer_status(connection: &Connection) -> Result<Option<TimerState>, String> {
    let mut stmt = connection
        .prepare(
            "SELECT id, task_id, mode, timer_preset, accumulated_elapsed_seconds, is_running
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
                accumulated_elapsed_seconds: row.get(4)?,
                is_running: row.get::<_, i32>(5)? != 0,
            })
        })
        .optional()
        .map_err(|e| e.to_string())?;

    Ok(result)
}
