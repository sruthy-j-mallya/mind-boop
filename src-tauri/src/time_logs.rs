pub mod log_db;

use log_db::TimeLog;
use tauri::State;

use crate::db::DbState;

#[tauri::command]
pub async fn list_time_logs(state: State<'_, DbState>) -> Result<Vec<TimeLog>, String> {
  let connection = state.connection.lock().map_err(|e| e.to_string())?;
  log_db::list_db_time_logs(&connection)
}

#[tauri::command]
pub async fn create_time_log(
    task_id: String,
    mode: String,
    timer_preset: Option<i64>,
    started_at: String,
    completed_at: Option<String>,
    state: State<'_, DbState>,
) -> Result<String, String> {
  let connection = state.connection.lock().map_err(|e| e.to_string())?;
  log_db::create_db_time_log(task_id, mode, timer_preset, started_at, completed_at, &connection)
}
